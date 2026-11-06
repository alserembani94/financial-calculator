# Design reference: what we took from studying a fintech design system

In November 2026 we studied the public design system of a large consumer fintech, including its mobile app, as a reference for our own design system. The full research is kept locally and isn't published. This page records only the general lessons, which are the parts we use. None of that company's brand (name, colours, fonts, icons, illustrations or copy) is used, and nothing should be built to resemble it.

## Lessons we adopted

### Foundations
- **Name colours by role, not hue.** Tokens describe their job: content (text), interactive, surface, line, and status. Each has explicit hover and pressed values rather than computed ones.
- **Mostly calm, one colour of action.** Screens are mostly white or near-black, with grey text, one colour for anything interactive, and a rare accent for the single most important result.
- **Neutrals carry a hint of the brand hue.** Neutral fills can be a low-opacity tint of the brand colour, so they work on any surface.
- **Depth comes from surface colour, not shadows.** Raised surfaces are slightly lighter or outlined; only floating overlays get a shadow.
- **Spacing steps by 4 below 16px and by 8 above.**
- **One body typeface for almost everything.** Any display face is rare and reserved for celebration moments.
- **Visible focus:** a solid 2px ring with a 2px gap, shown on keyboard focus only.

### Showing money
- **Every amount is a labelled row.** A plain title, an optional basis line underneath, and the amount right-aligned on the same line, never wrapping.
- **One total, one dominant result.** Costs are listed and totalled next to the result, so nothing is hidden.
- **Tables only for real comparisons across columns.** Columns of amounts always show decimals and scroll sideways on narrow screens rather than breaking the page.
- **Amount fields format when you leave them, never while typing.** They reject negatives, open the numeric keypad and recalculate instantly without a loader.
- **Explanations of terms open on tap,** as a popover on desktop and a bottom sheet on phones. They never hold anything needed to understand the result.
- **Date every comparison and say where the figures come from.**

### Mobile and dark mode
- **A must-take action is one full-width button pinned to the bottom** on phones.
- **Bottom sheets are for supporting detail only.** Never stack them, never navigate inside one, and always give them a visible close button.
- **Dark mode is designed, not inverted:**
  - raised surfaces get lighter, and borders get stronger;
  - shadows go away;
  - the interactive colour lightens, with dark text on it;
  - hover and pressed states get lighter, not darker.
- **Offer "Same as device", "Light" and "Dark",** and respect reduced motion.
- **Sizes follow the reader's text size.** Labels wrap rather than truncate.

### Voice and accessibility
- **Plain words:** the fewest, most widely understood ones. Sentence case, verb-led buttons, errors that say what to do and never blame.
- **The studied company's own accessibility statement claimed only partial WCAG 2.1 AA conformance.** Its known failures (status messages not announced, layouts breaking at 320px and 200% zoom, focus not returning after a dialog) are exactly the risks a calculator has, so we test for them.

## Lessons about reuse
- A company's open-source component code may carry a permissive licence while its design tokens, icons, fonts and illustrations don't. Check each package's licence, and when the metadata and the licence file disagree, assume the stricter one.
- A permissive code licence never grants trademark rights.
- Distinctive brand elements (name, logo, custom typeface, signature colour pairing, illustration style) are protected, and the risk is cumulative: several borrowed elements together can amount to imitation even if no single one does.
- So we borrow structure and method, and build our own palette, type choices, shapes and words. Our own design-system draft follows this.
