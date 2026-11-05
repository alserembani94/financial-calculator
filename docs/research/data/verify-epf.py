#!/usr/bin/env python3
"""Reproducible checks for the EPF (KWSP) research data.

Run from anywhere:  python3 -I docs/research/data/verify-epf.py

Standard library only, and no network access. Exact arithmetic throughout
(fractions, never floats). Exit status is 0 when nothing fails, 1 otherwise.

The committed JSON checks always run. Checks against source documents read the
git-ignored .research-cache/ folder and report SKIP when a file is missing, so
a SKIP means "not checked", not "passed".

Override the locations with --data DIR and --cache DIR.
"""
import argparse
import json
import math
import os
import re
import sys
import xml.etree.ElementTree as ET
import zipfile
from fractions import Fraction as Fr

# (employer up to RM5,000, employer above RM5,000, employee)
RATES = {
    "A": (Fr(13, 100), Fr(12, 100), Fr(11, 100)),
    "C": (Fr(65, 1000), Fr(6, 100), Fr(55, 1000)),
    "E": (Fr(4, 100), Fr(4, 100), Fr(0)),
}
# Parts B and D were deleted by Act A1760 from October 2025 wages.
# RM5 employer share above RM10, percentage employee share.
FLAT_RATES = {"B": Fr(11, 100), "D": Fr(55, 1000)}

results = {"PASS": 0, "FAIL": 0, "SKIP": 0}


def report(status, name, detail=""):
    results[status] += 1
    print(f"{status:4}  {name}" + (f"  ({detail})" if detail else ""))


def compare(name, mismatches, count):
    if mismatches:
        report("FAIL", name, f"{len(mismatches)} of {count} differ, first: {mismatches[0]}")
    else:
        report("PASS", name, f"{count} rows")


def ceil_rm(amount):
    return Fr(math.ceil(amount))


def bands():
    """Yield the (lower, upper) wage bands up to RM20,000 used by every banded part."""
    yield Fr(1, 100), Fr(10)
    yield Fr(1001, 100), Fr(20)
    upper = 20
    while upper < 5000:
        yield Fr(upper) + Fr(1, 100), Fr(upper + 20)
        upper += 20
    while upper < 20000:
        yield Fr(upper) + Fr(1, 100), Fr(upper + 100)
        upper += 100


def expected_table(part):
    """Generate a full part as rows of (lower, upper, employer, employee, total)."""
    rows = []
    for lower, upper in bands():
        if upper == 10:
            rows.append((lower, upper, None, None, None))
            continue
        if part in FLAT_RATES:
            employer, employee = Fr(5), ceil_rm(upper * FLAT_RATES[part])
        else:
            low, high, ee = RATES[part]
            employer = ceil_rm(upper * (low if upper <= 5000 else high))
            employee = ceil_rm(upper * ee)
        rows.append((lower, upper, employer, employee, employer + employee))
    return rows


def upper_bound(wage):
    if wage <= 20:
        return Fr(20)
    if wage <= 5000:
        return Fr(math.ceil(wage / 20) * 20)
    return Fr(math.ceil(wage / 100) * 100)


def contribution(part, wage, excl_bonus=None, floor=0, rounding="default"):
    """Return (employee, employer) in ringgit under the defaults in epf.md section 3.

    excl_bonus: wages excluding bonus, given only when the month includes a bonus.
    floor: minimum wages for the month under s.43(1A); 0 where no floor applies.
    rounding: "total" selects the alternative for Part F; "share" the alternative above RM20,000.
    """
    wage = Fr(wage)
    if wage <= 10:  # liability test on actual wages, before the floor
        return Fr(0), Fr(0)
    base = max(wage, Fr(floor))
    if part == "F":
        share = base * Fr(2, 100)
        if rounding == "total":
            raise ValueError("Part F total rounding has no stated split; use part_f_total")
        return ceil_rm(share), ceil_rm(share)
    if part in FLAT_RATES:
        rate = FLAT_RATES[part]
        return ceil_rm((upper_bound(base) if base <= 20000 else base) * rate), Fr(5)
    low, high, ee = RATES[part]
    note = (
        part in ("A", "C")
        and excl_bonus is not None
        and Fr(excl_bonus) <= 5000
        and wage > 5000
    )
    if base > 20000:
        er = low if note else high
        employee = ceil_rm(base * ee)
        if rounding == "share":
            return employee, ceil_rm(base * er)
        # The rounded total is the schedule's rule. The split is provisional: KWSP does not state it.
        return employee, ceil_rm(base * (ee + er)) - employee
    upper = upper_bound(base)
    employee = ceil_rm(upper * ee)
    if note:
        return employee, ceil_rm(base * low)
    return employee, ceil_rm(upper * (low if upper <= 5000 else high))


def part_f_total(wage, floor=0):
    return ceil_rm(max(Fr(wage), Fr(floor)) * Fr(4, 100))


# Worked examples in docs/research/epf.md section 6:
# (case, part, wage, wages excluding bonus, floor, employee, employer).
EXAMPLES = [
    (1, "A", "10.00", None, 1700, 0, 0),
    (2, "A", "1700", None, 1700, 187, 221),
    (3, "A", "2950", None, 1700, 326, 385),
    (4, "A", "5000.00", None, 1700, 550, 650),
    (5, "A", "5000.01", None, 1700, 561, 612),
    (6, "A", "6250", None, 1700, 693, 756),
    (7, "A", "12345", None, 1700, 1364, 1488),
    (8, "A", "20000.01", None, 1700, 2201, 2400),
    (9, "A", "25000.50", None, 1700, 2751, 3000),
    (10, "E", "4500", None, 1700, 0, 180),
    (11, "E", "6250", None, 1700, 0, 252),
    (12, "C", "8000", None, 1700, 440, 480),
    (13, "A", "8000", "4000", 1700, 880, 1040),
    (14, "F", "1725", None, 1700, 35, 35),
    # 15 and 16 are not table lookups; see check_topup for 16.
    (17, "A", "1550", None, 1700, 187, 221),
    (18, "E", "1550", None, 1700, 0, 68),
    (19, "C", "1550", None, 1700, 94, 111),
    (20, "F", "1550", None, 1700, 34, 34),
    (21, "A", "1400", None, 1500, 165, 195),
    (22, "A", "1400", None, 1700, 187, 221),
    (23, "A", "800", None, "697.60", 88, 104),
    (24, "A", "560", None, "697.60", 77, 91),
    (25, "A", "600", None, Fr(1700 * 10, 30), 66, 78),
    (26, "A", "1800", None, 2000, 220, 260),
    (27, "F", "1800", None, 2000, 40, 40),
    (28, "A", "1800", None, 1700, 198, 234),
    (29, "A", "7950", "4000", 1700, 880, 1034),
    (30, "A", "8010", "2800", 1700, 891, 1042),
    (31, "A", "5500", "3000", 1700, 605, 715),
    (32, "A", "4500", "3000", 1700, 495, 585),
    (33, "A", "5500", None, 1700, 605, 660),
    (34, "A", "7300", "5300", 1700, 803, 876),
    (35, "A", "6800", "4800", 1700, 748, 884),
    (36, "A", "24000", "4000", 1700, 2640, 3120),
    (37, "C", "20000.01", None, 1700, 1101, 1200),
    (38, "C", "25000.50", None, 1700, 1376, 1500),
    (39, "E", "20000.01", None, 1700, 0, 801),
    (40, "E", "25000.50", None, 1700, 0, 1001),
    (41, "A", "21250", None, 1700, 2338, 2550),
    (42, "C", "21250", None, 1700, 1169, 1275),
    (43, "F", "1751", None, 1700, 36, 36),
    (44, "F", "6710", None, 1700, 135, 135),
    (45, "F", "3250", None, 1700, 65, 65),
    (46, "B", "10.01", None, 0, 3, 5),
    (47, "D", "10.01", None, 0, 2, 5),
    (48, "B", "5000", None, 0, 550, 5),
    (49, "D", "5000.01", None, 0, 281, 5),
    (50, "B", "20000.01", None, 0, 2201, 5),
    (51, "D", "25000.50", None, 0, 1376, 5),
    # KWSP's own worked examples on its employer page, capture 2026-08-10.
    (52, "A", "3250", None, 1700, 359, 424),
    (53, "A", "6710.80", None, 1700, 748, 816),
    (54, "E", "3250", None, 1700, 0, 131),
    (55, "C", "3250", None, 1700, 180, 212),
]


def check_examples():
    bad = []
    for case, part, wage, excl, floor, employee, employer in EXAMPLES:
        got = contribution(part, wage, excl, floor)
        if got != (employee, employer):
            bad.append(f"case {case}: got {tuple(map(int, got))}")
    compare("Worked examples", bad, len(EXAMPLES))


def check_totals():
    """Rounded totals above RM20,000 and the Part F alternative."""
    bad = []
    for part, wage, total in (
        ("A", "20000.01", 4601),
        ("A", "25000.50", 5751),
        ("C", "20000.01", 2301),
        ("C", "25000.50", 2876),
        ("A", "21250", 4888),
        ("C", "21250", 2444),
    ):
        if sum(contribution(part, wage)) != total:
            bad.append(f"{part} {wage}")
    for wage, total in (("1751", 71), ("6710", 269), ("1725", 69), ("3250", 130), ("1700", 68)):
        if part_f_total(wage) != total:
            bad.append(f"F total {wage}")
    if contribution("A", "20000.01", rounding="share") != (2201, 2401):
        bad.append("A per-share alternative")
    compare("Totals above RM20,000 and Part F alternative", bad, 12)


def check_topup():
    """i-Topup: table + whole-ringgit excess, against the combined rate on actual wages."""
    bad = []
    cases = (
        # wage, top-up %, method 1 employee, method 2 employee (combined rate, then rounded)
        ("3000", 2, 390, 390),
        ("3010", 2, 394, 392),
        ("6250", 5, 1006, 1000),
    )
    for wage, pct, one, two in cases:
        table, _ = contribution("A", wage)
        if table + ceil_rm(Fr(wage) * Fr(pct, 100)) != one:
            bad.append(f"method 1 {wage}")
        if ceil_rm(Fr(wage) * (Fr(11, 100) + Fr(pct, 100))) != two:
            bad.append(f"method 2 {wage}")
    employee, employer = contribution("A", "6250")
    if employer + ceil_rm(Fr(6250) * Fr(5, 100)) != 1069 or employee != 693:
        bad.append("employer top-up method 1")
    if ceil_rm(Fr(6250) * Fr(17, 100) + employee) != 1756:
        bad.append("employer top-up method 2")
    compare("i-Topup methods", bad, 8)


def check_arrears():
    """Recalculate each month against one lump sum in the paying month (rise in Jan, paid in Mar)."""
    bad = []
    for old, new, recalculated, lump in (
        ("3000", "3300", (1287, 1089), (1287, 1089)),
        ("8000", "8500", (3060, 2805), (3060, 2805)),
        ("4900", "5200", (1872, 1716), (1970, 1716)),
        ("4950", "5050", (1836, 1683), (1926, 1675)),
        ("4500", "4800", (1872, 1584), (1818, 1584)),
    ):
        ee_new, er_new = contribution("A", new)
        ee_old, er_old = contribution("A", old)
        ee_lump, er_lump = contribution("A", Fr(new) + 2 * (Fr(new) - Fr(old)))
        if (3 * er_new, 3 * ee_new) != recalculated:
            bad.append(f"recalculated {old}-{new}")
        if (2 * er_old + er_lump, 2 * ee_old + ee_lump) != lump:
            bad.append(f"lump {old}-{new}")
    compare("Arrears examples", bad, 10)


def check_age():
    """KWSP calculator getAge, as read from its cached client code."""
    def age(wage_year, wage_month, birth_year, birth_month):
        years = wage_year - birth_year
        return years if wage_month - 1 >= birth_month else years - 1

    cases = (
        ((2026, 3, 1966, 3), 59),
        ((2026, 4, 1966, 3), 60),
        ((2026, 1, 1966, 1), 59),
        ((2026, 2, 1966, 1), 60),
        ((2026, 12, 1966, 12), 59),
        ((2027, 1, 1966, 12), 60),
        ((2026, 3, 1951, 3), 74),
        ((2026, 4, 1951, 3), 75),
    )
    bad = [f"{args}: {age(*args)}" for args, want in cases if age(*args) != want]
    compare("Age for a wage month", bad, len(cases))


def check_config(data_dir):
    with open(os.path.join(data_dir, "epf-config.json"), encoding="utf-8") as handle:
        config = json.load(handle)
    bad = []
    floors = config["minimumWageFloor"]["periods"]
    if floors[0]["monthly"] != 1500 or floors[1]["standard"]["monthly"] != 1700 or floors[1]["smallEmployer"]["monthly"] != 1500:
        bad.append("2025 floor periods")
    if floors[2]["monthly"] != 1700 or floors[3]["monthly"] != 2000:
        bad.append("later floor periods")
    for part in "ABCDE":
        if not os.path.exists(os.path.join(data_dir, config["shared"]["parts"][part]["table"])):
            bad.append(f"table for Part {part}")
    for name in ("epf-wage-components.json", "epf-basic-savings-by-age.json"):
        with open(os.path.join(data_dir, name), encoding="utf-8") as handle:
            json.load(handle)
    compare("Config file", bad, 7)


def fraction_or_none(value):
    return None if value is None else Fr(str(value))


def load_json_part(data_dir, part):
    edition = "2022-07" if part in FLAT_RATES else "2025-10"
    path = os.path.join(data_dir, f"epf-third-schedule-{edition}-part{part}.json")
    with open(path, encoding="utf-8") as handle:
        return [tuple(fraction_or_none(v) for v in row) for row in json.load(handle)["rows"]]


def diff_rows(actual, expected):
    if len(actual) != len(expected):
        return [f"row count {len(actual)} vs {len(expected)}"]
    return [
        f"upper {float(want[1])}: {[None if v is None else float(v) for v in got]}"
        for got, want in zip(actual, expected)
        if got != want
    ]


def parse_schedule_text(path):
    """Read a text extraction of a KWSP Third Schedule PDF into {part: rows}."""
    with open(path, encoding="utf-8", errors="replace") as handle:
        text = re.sub(r"=====PAGE \d+=====", "", handle.read())
    pieces = re.split(r"\n\s*PART ([A-F])\s*\n", text)
    row = re.compile(
        r"From\s+([\d,]+\.\d\d)\s+to\s+([\d,]+\.\d\d)"
        r"\s+(NIL|[\d,]+\.\d\d)\s+(NIL|[\d,]+\.\d\d)\s+(NIL|[\d,]+\.\d\d)"
    )

    def value(token):
        return None if token == "NIL" else Fr(token.replace(",", ""))

    parts = {}
    for index in range(1, len(pieces), 2):
        rows = [tuple(value(g) for g in m.groups()) for m in row.finditer(pieces[index + 1])]
        parts[pieces[index]] = rows
    return parts


def read_workbook(path):
    """Read an .xlsx without third-party packages, returning {sheet name: rows}."""
    main = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
    rel = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"
    with zipfile.ZipFile(path) as book:
        strings = [
            "".join(t.text or "" for t in item.iter(main + "t"))
            for item in ET.fromstring(book.read("xl/sharedStrings.xml"))
        ]
        targets = {
            item.get("Id"): item.get("Target")
            for item in ET.fromstring(book.read("xl/_rels/workbook.xml.rels"))
        }
        sheets = {}
        for sheet in ET.fromstring(book.read("xl/workbook.xml")).find(main + "sheets"):
            target = targets[sheet.get(rel)].lstrip("/")
            target = target if target.startswith("xl/") else "xl/" + target
            rows = []
            for row in ET.fromstring(book.read(target)).find(main + "sheetData"):
                cells = []
                for cell in row:
                    raw = cell.find(main + "v")
                    text = None if raw is None else raw.text
                    cells.append(strings[int(text)] if cell.get("t") == "s" else text)
                rows.append(cells)
            sheets[sheet.get("name")] = rows
    return sheets


def workbook_rows(rows):
    """Normalise workbook rows, whose lower bounds carry floating-point noise."""
    out = []
    for lower, upper, employer, employee, _total in rows[1:]:
        out.append(
            (
                Fr(round(float(lower) * 100), 100),
                Fr(upper),
                Fr(employer),
                Fr(employee),
            )
        )
    return out


def strip_nil(rows):
    """Reduce table rows to the workbook's shape, in which NIL is written as 0."""
    return [(r[0], r[1], r[2] or Fr(0), r[3] or Fr(0)) for r in rows]


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    root = os.path.abspath(os.path.join(here, "..", "..", ".."))
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--data", default=here, help="folder holding the epf-*.json files")
    parser.add_argument(
        "--cache",
        default=os.path.join(root, ".research-cache", "epf"),
        help="the .research-cache/epf folder",
    )
    args = parser.parse_args()

    tables = {}
    for part in "ABCDE":
        tables[part] = load_json_part(args.data, part)
        compare(f"JSON Part {part} vs generating rule", diff_rows(tables[part], expected_table(part)), len(tables[part]))
    check_examples()
    check_totals()
    check_topup()
    check_arrears()
    check_age()
    check_config(args.data)

    # KWSP's own PDFs, in order: from January 2019, July 2024 and October 2025.
    verify = os.path.join(args.cache, "verify", "t6")
    documents = [
        ("KWSP Jan 2019", "jk_04012019_eng.txt", "ABCDE"),
        ("KWSP Jul 2024", "jk_bi1_20240728.txt", "ABCDE"),
        ("KWSP Oct 2025", "third-sched-en.txt", "ACE"),
    ]
    for label, filename, wanted in documents:
        path = os.path.join(verify, filename)
        if not os.path.exists(path):
            report("SKIP", f"{label} schedule", f"{filename} not in cache")
            continue
        parts = parse_schedule_text(path)
        for part in wanted:
            compare(f"{label} Part {part} vs generating rule", diff_rows(parts.get(part, []), expected_table(part)), len(parts.get(part, [])))
        if "B" in wanted:
            for part, sibling in (("B", "A"), ("D", "C")):
                bad = [
                    f"upper {float(x[1])}"
                    for x, y in zip(parts[part], parts[sibling])
                    if x[:2] != y[:2] or x[3] != y[3]
                ]
                compare(f"{label} Part {part} employee column vs Part {sibling}", bad, len(parts[part]))

    # Third-party workbook committed January 2024: weaker evidence, kept as a cross-check.
    workbook = os.path.join(args.cache, "gh", "keanteng.xlsx")
    if os.path.exists(workbook):
        sheets = read_workbook(workbook)
        for sheet, part in (("citizen", "A"), ("foreigner", "B")):
            got = workbook_rows(sheets[sheet])
            want = strip_nil(expected_table(part))
            bad = [f"upper {float(x[1])}" for x, y in zip(got, want) if x != y]
            if len(got) != len(want):
                bad.insert(0, f"row count {len(got)} vs {len(want)}")
            compare(f"Workbook sheet '{sheet}' vs Part {part}", bad, len(got))
    else:
        report("SKIP", "Workbook cross-check", "keanteng.xlsx not in cache")

    print(f"\n{results['PASS']} passed, {results['FAIL']} failed, {results['SKIP']} skipped")
    return 1 if results["FAIL"] else 0


if __name__ == "__main__":
    sys.exit(main())
