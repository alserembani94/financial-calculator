#!/usr/bin/env python3
"""Research reference for the v1 baseline in docs/research/v1-baseline.md. Not app code.

Works out a flat January-to-December breakdown from gross salary, age, year,
marital status and children, using the data files in this folder, and compares
"annual tax / 12" with a real month-by-month payslip from
.research-cache/scripts/pcb_ref_official.py.

Run from the repo root:  python3 -I docs/research/data/v1-baseline.py
The comparison section is skipped if the local .research-cache isn't present.
"""
import importlib.util
import json
import math
import os
from decimal import Decimal as D, ROUND_DOWN, ROUND_HALF_UP

HERE = os.path.dirname(os.path.abspath(__file__))


def load(name):
    with open(os.path.join(HERE, name)) as f:
        return json.load(f)


EPF_A = load("epf-third-schedule-2025-10-partA.json")["rows"]  # [from, to, employer, employee, total]
EPF_E = load("epf-third-schedule-2025-10-partE.json")["rows"]
SOCSO_2025 = load("socso-act4-2025.json")["bands"]
SOCSO_2026 = load("socso-act4-2026.json")["phases"][0]["bands"]
EIS = load("eis-2025.json")
EIS = EIS["rows"] if "rows" in EIS else EIS["bands"]

MIN_WAGE_FLOOR = 1700  # applies at the end of 2025, 2026 and 2027 (D6: RM2,000 isn't gazetted)
EPF_RELIEF_CAP = 4000
SELF_RELIEF = 9000
SPOUSE_RELIEF = 4000
CHILD_RELIEF = 2000  # one unit: a child under 18
NISAB = {2025: 29740, 2026: 33996, 2027: 33996}  # 2027 is 2026 carried forward (D6)
ZAKAT_SELF = 12000
ZAKAT_WIFE = 5000
ZAKAT_CHILD = 2000  # a child under 18
# LHDN category for each marital status. Categories 1 and 3 share a table; only 3 allows children.
CATEGORY = {"single": 1, "married-spouse-not-working": 2, "married-spouse-working": 3, "divorced-or-widowed": 3}
# Rows carry M, R and B by category, unchanged in 2025 and 2026.
TAX_TABLE = load("pcb-spec-2026.json")["table1"]


CASES = [("single", 0), ("married-spouse-working", 0), ("married-spouse-working", 1), ("married-spouse-working", 2),
         ("married-spouse-working", 3), ("married-spouse-not-working", 0), ("married-spouse-not-working", 1),
         ("married-spouse-not-working", 2), ("married-spouse-not-working", 3)]


def t2(x):
    return D(x).quantize(D("0.01"), rounding=ROUND_DOWN)


def sen(x):
    return D(x).quantize(D("0.01"), rounding=ROUND_HALF_UP)


def epf(gross, age):
    """Returns (employee, employer). Above RM20,000 the employee split is provisional (epf.md)."""
    if gross <= 10 or age >= 75:
        return D(0), D(0)
    base = max(gross, MIN_WAGE_FLOOR)
    table = EPF_A if age < 60 else EPF_E
    if base <= 20000:
        row = next(r for r in table if r[0] <= base <= r[1])
        return D(str(row[3] or 0)), D(str(row[2] or 0))
    ee, er = (0.11, 0.12) if age < 60 else (0.0, 0.04)
    total = math.ceil(round(base * (ee + er), 6))
    employee = math.ceil(round(base * ee, 6))
    return D(employee), D(total - employee)


def _band(rows, wage, lo, hi):
    return next(b for b in rows if (b[lo] or 0) < wage and (b[hi] is None or wage <= b[hi]))


def socso(gross, age, year, opted_out=False):
    """Returns (employee, employer). End-of-year rule (N1): 2025 has no SKBBK; 2026 and 2027 do."""
    second = age >= 60
    if year == 2025:
        b = _band(SOCSO_2025, gross, "wageAbove", "wageUpTo")
        cat = b["secondCategory"] if second else b["firstCategory"]
        return D(str(cat.get("employee", cat.get("employeeInvalidity", 0)))), D(str(cat["employer"]))
    b = _band(SOCSO_2026, gross, "wageAbove", "wageUpTo")
    cat = b["secondCategory"] if second else b["firstCategory"]
    key = "employeeWithoutNEI" if opted_out else "employeeWithNEI"
    return D(str(cat[key])), D(str(cat["employer"]))


def eis(gross, age):
    if age < 18 or age >= 60:
        return D(0)
    b = _band(EIS, gross, "wageExceedsRm", "wageNotExceedsRm")
    return D(b["employeeSen"]) / 100


def relief_total(employee_epf, status="single", children=0, relief_extra=D(0)):
    cat = CATEGORY[status]
    kids = 0 if cat == 1 else children
    spouse = SPOUSE_RELIEF if cat == 2 else 0
    return min(employee_epf * 12, D(EPF_RELIEF_CAP)) + SELF_RELIEF + spouse + CHILD_RELIEF * kids + relief_extra


def annual_tax(gross, employee_epf, status="single", children=0, relief_extra=D(0)):
    """Resident: annual gross less reliefs. Self and spouse rebates are built into B."""
    P = t2(D(str(gross)) * 12 - relief_total(employee_epf, status, children, relief_extra))
    whole = int(P)
    row = None
    for r in TAX_TABLE:
        if whole > r["M"]:
            row = r
    if row is None:
        return D(0)
    b = row["B"][f"category{CATEGORY[status]}"]
    return max(D(0), t2(t2((P - row["M"]) * D(str(row["R"]))) + b))


def breakdown(gross, age=30, year=2026, opted_out=False, status="single", children=0):
    ee, er = epf(gross, age)
    soc_ee, soc_er = socso(gross, age, year, opted_out)
    eis_each = eis(gross, age)
    tax = annual_tax(gross, ee, status, children)
    pcb = sen(tax / 12)
    take_home = sen(D(str(gross)) - ee - soc_ee - eis_each - pcb)
    return dict(gross=gross, epf=ee, socso=soc_ee, eis=eis_each, annualTax=tax, pcb=pcb, takeHome=take_home,
                erEpf=er, erSocso=soc_er, erEis=eis_each, employerCost=sen(D(str(gross)) + er + soc_er + eis_each))


def zakat_annual(gross, employee_epf, year, method, children=0, wife=False):
    """Method 1 is on gross (Kaedah 1). Method 2 deducts self, wife, children under 18 and EPF (Kaedah 2)."""
    income = D(str(gross)) * 12
    if method == 1:
        base = income
    else:
        base = income - ZAKAT_SELF - employee_epf * 12 - ZAKAT_CHILD * children - (ZAKAT_WIFE if wife else 0)
    return sen(base * D("0.025")) if base >= NISAB[year] else D(0)


def zakat_routes(gross, age=30, year=2026, opted_out=False, status="single", children=0, method=2, wife=False):
    """The two ways to pay, side by side. Kids are dropped for "single", matching tax."""
    kids = 0 if CATEGORY[status] == 1 else children
    b = breakdown(gross, age, year, opted_out, status, children)
    zakat = zakat_annual(gross, b["epf"], year, method, kids, wife)
    tax_after = max(D(0), b["annualTax"] - zakat)
    rebate = min(zakat, b["annualTax"])
    through_salary = sen(D(str(gross)) - b["epf"] - b["socso"] - b["eis"] - sen(tax_after / 12) - sen(zakat / 12))
    return dict(zakatYear=zakat, zakatMonth=sen(zakat / 12), annualTax=b["annualTax"], pcbAfter=sen(tax_after / 12),
                takeHomeThroughSalary=through_salary, takeHomeBeforePayingYourself=b["takeHome"],
                refundAtFiling=rebate, lostToCap=zakat - rebate)


def print_tables():
    print("v1 baseline, age 30, 2026 rules (SKBBK included; 2027 shows the same)")
    print("gross | EPF | SOCSO | EIS | PCB | take-home | no-SKBBK take-home | 2025 take-home | employer cost")
    for g in [1700, 2000, 2500, 3000, 3500, 3700, 4000, 4001, 4500, 5000, 5001, 5500, 6000, 7000, 8000, 10000, 15000, 20000, 25000]:
        b = breakdown(g)
        out = breakdown(g, opted_out=True)
        y25 = breakdown(g, year=2025)
        print(f"{g:>6} | {b['epf']} | {b['socso']} | {b['eis']} | {b['pcb']} | {b['takeHome']} | {out['takeHome']} | {y25['takeHome']} | {b['employerCost']}")

    print("\nAge check at RM5,000, 2026")
    for a in [17, 30, 59, 60, 74, 75]:
        b = breakdown(5000, age=a)
        print(a, {k: str(b[k]) for k in ("epf", "socso", "eis", "pcb", "takeHome", "erEpf", "erSocso", "erEis")})

    print("\nPCB by marital status and children, age 30, 2026")
    print("gross | single | spouse working/divorced 0,1,2,3 kids | spouse not working 0,1,2,3 kids")
    for g in [3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 10000, 15000]:
        c3 = [breakdown(g, status="married-spouse-working", children=k)["pcb"] for k in range(4)]
        c2 = [breakdown(g, status="married-spouse-not-working", children=k)["pcb"] for k in range(4)]
        print(g, breakdown(g)["pcb"], [str(x) for x in c3], [str(x) for x in c2])

    print("\nWhere tax starts and where the rebate ends, age 30, 2026")
    for status, kids in CASES:
        first = None
        worst = (D(0), None, None)
        prev = breakdown(1700, status=status, children=kids)
        for g in range(1701, 30001):
            b = breakdown(g, status=status, children=kids)
            if first is None and b["pcb"] > 0:
                first = g
            drop = prev["takeHome"] - b["takeHome"]
            if drop > worst[0]:
                worst = (drop, g - 1, g)
            prev = b
        recover = next(g for g in range(worst[2], 30001)
                       if breakdown(g, status=status, children=kids)["takeHome"]
                       >= breakdown(worst[1], status=status, children=kids)["takeHome"])
        print(status, kids, "PCB starts", first, "largest fall", worst, "recovers at", recover)

    print("\nSKBBK opt-out, 2026, age 30 and 60: employee SOCSO and take-home, in and out")
    for g in [1700, 3000, 5000, 6000, 10000]:
        row = [g]
        for a in (30, 60):
            i, o = breakdown(g, age=a), breakdown(g, age=a, opted_out=True)
            row += [f"age{a}", i["socso"], o["socso"], i["takeHome"], o["takeHome"]]
        print(row)

    print("\nZakat, age 30, 2026: method 2 and method 1")
    print("gross | status kids wife | method | zakat/yr | zakat/mo | tax/yr | PCB after | take-home through salary | take-home before paying yourself | refund | lost")
    for g in [3000, 4000, 4500, 5000, 6000, 8000, 10000]:
        for status, kids, wife in [("single", 0, False), ("married-spouse-not-working", 0, True),
                                   ("married-spouse-not-working", 2, True), ("married-spouse-working", 2, False),
                                   ("married-spouse-working", 2, True)]:
            for m in (2, 1):
                r = zakat_routes(g, status=status, children=kids, method=m, wife=wife)
                print(g, status, kids, wife, f"K{m}", *[r[k] for k in ("zakatYear", "zakatMonth", "annualTax", "pcbAfter",
                      "takeHomeThroughSalary", "takeHomeBeforePayingYourself", "refundAtFiling", "lostToCap")])

    print("\nZakat starts, and salaries where it exceeds annual tax, 2026, method 2")
    for status, kids, wife in [("single", 0, False), ("married-spouse-not-working", 0, True), ("married-spouse-not-working", 2, True),
                               ("married-spouse-working", 0, False), ("married-spouse-working", 2, False), ("married-spouse-working", 2, True)]:
        first = None
        above = []
        most = (D(0), None)
        for g in range(1700, 30001):
            r = zakat_routes(g, status=status, children=kids, wife=wife)
            if r["zakatYear"] > 0:
                first = first or g
                if r["lostToCap"] > 0:
                    above.append(g)
                    if r["lostToCap"] > most[0]:
                        most = (r["lostToCap"], g)
        print(status, kids, "wife" if wife else "no wife", "zakat starts", first, "zakat above tax:", (above[0], above[-1], len(above)) if above else None, "largest loss", most)

    print("\nRM350 SOCSO + EIS relief: PCB with and without, 2026")
    for g in [3000, 4000, 5000, 8000]:
        b = breakdown(g)
        relief = min((b["socso"] + b["eis"]) * 12, D(350))
        print(g, "without", b["pcb"], "with", sen(annual_tax(g, b["epf"], relief_extra=relief) / 12), "relief", relief)


def print_payslip_gap():
    path = os.path.join(HERE, "..", "..", "..", ".research-cache", "scripts", "pcb_ref_official.py")
    if not os.path.exists(path):
        print("\nPayslip comparison skipped: .research-cache isn't present")
        return
    spec = importlib.util.spec_from_file_location("pcb_model", path)
    model = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(model)
    print("\nFlat salary, whole ringgit RM1,700 to RM30,000, by marital status and children")
    for status, kids in CASES:
        cat = CATEGORY[status]
        rel = D(SELF_RELIEF + (SPOUSE_RELIEF if cat == 2 else 0) + CHILD_RELIEF * kids)
        max_month = (D(0), 0)
        max_year = (D(0), 0)
        over1 = []
        year_over1 = []
        for g in range(1700, 30001):
            ee, _ = epf(g, 30)
            st = model.new()
            pays = [model.month(st, D(g), ee, cat, rel, m)["final"] for m in range(1, 13)]
            tax = annual_tax(g, ee, status, kids)
            worst = max(abs(p - sen(tax / 12)) for p in pays)
            gap_year = abs(sum(pays) - tax)
            if worst >= 1:
                over1.append(g)
            if gap_year >= 1:
                year_over1.append(g)
            if worst > max_month[0]:
                max_month = (worst, g)
            if gap_year > max_year[0]:
                max_year = (gap_year, g)
        print(status, kids, "month gap >= RM1:", len(over1), (over1[0], over1[-1]) if over1 else None, "largest", max_month,
              "| year gap >= RM1:", len(year_over1), (year_over1[0], year_over1[-1]) if year_over1 else None, "largest", max_year)


if __name__ == "__main__":
    print_tables()
    print_payslip_gap()
