# Product brief

Decided by the owner on 2026-11-06. The visual identity is still open.

## Name

**Petawang**, written as one word. It comes from the Malay *peta wang*, "money map": the whole picture of your money, so you can find your way. The audience is mostly Malaysian, so a Malay name fits. For readers who don't speak Malay, a tagline can carry the meaning (for example "your money, mapped"). A trademark search (MyIPO) is still to do.

## What it is

A web app that gives people the big picture of their own finances, using public information that's usually scattered across EPF, LHDN, PERKESO, BNM, DOSM and others. It focuses on reality, not products: it computes, projects and compares with published benchmarks, and leaves the decisions to the user.

## Who it's for

Anyone who wants to discover personal finance, whatever stage they're at. It's designed first for people early in their working life, especially first-jobbers, but it should make sense to someone who has worked for years and is only now looking at the whole picture.

## Scope

1. Now: salary breakdown (EPF, SOCSO, EIS, PCB, zakat as information).
2. Next: commitments, with the debt service ratio.
3. Then: investments and savings, with financial health indicators and projected accumulated wealth.

Each stage adds insights: values computed from the user's inputs, sometimes projected over time, and compared with published benchmarks (see `CONTEXT.md`).

## Principles

- **Education, not advice.** No product names, rankings or personal plans (ADR-0001).
- **Neutral.** No selling and no referral income.
- **Clear about good and bad shape, one measure at a time.** Each measure gets its own signal against a named, dated benchmark ("Below EPF's Basic Savings for your age"). There's no overall rating of the person.
- **Private by design.** Data stays on the user's device (ADR-0002).
- **Usable by people and by AI.** Public information is presented with its sources, so it can be read, checked and reused.

## Voice

Like a knowledgeable friend: warm and plain-spoken, but careful and professional about money. Never hype, never shaming. The design-system draft's content rules apply (it still uses the old placeholder name "Take-home").

## Language

English only for now. Build with internationalisation in mind so Malay and others can be added later: no text in images, no sentences built from fragments.

## Accepted risks

- Projections are in scope as a medium regulatory risk, with guardrails (ADR-0003).
