# Projections are in scope, accepted as medium risk

The app will project values over time (for example, a user's accumulated EPF after a number of years), even though projections with assumed returns are the riskiest feature still on the education side: research rates them medium, because a chosen return can read as a promise or a recommendation. They're kept because a projection compared with a published benchmark is the core of an insight, and they stay acceptable only with these guardrails:

- **Scenarios, not one number.** Show a range (for example low, middle and high rates), or let the user set the rate. Never a single promised figure.
- **Every assumption visible.** Rates, inflation, years and contribution levels are stated next to the result.
- **Today's money.** Show results adjusted for inflation, as well as the nominal amount.
- **Published history, not product picks.** Rates come from public, dated history (for example EPF's own dividend record for EPF balances), labelled "past returns don't promise future ones". Never tie a rate to a named investment product.
- **Compare, don't advise.** A projection is set against a published benchmark in the same money terms ("EPF's Basic Savings for your age is RM Y in today's ringgit"), never turned into an instruction.

## Consequences

- Investment projections beyond EPF need the same guardrails and a fresh check against ADR-0001 before they're built.
- A Malaysian lawyer should confirm these guardrails before launch.
