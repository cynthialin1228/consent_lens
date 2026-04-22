# ConsentLens Roadmap

This roadmap outlines the evolution of ConsentLens from MVP to a comprehensive legal-term highlighting tool.

## Current Version: 0.2.0

### Completed (v0.1 → v0.2)
- ✅ Expanded dictionary from 15 to 62 terms
- ✅ Context-aware detection to reduce false positives
- ✅ Prev/Next navigation with keyboard shortcuts (Alt+Shift+Arrow)
- ✅ Match counter and live navigation state
- ✅ On-page toolbar with category filters
- ✅ "High risk only" quick filter
- ✅ Category toggles in popup (7 categories)
- ✅ Dark mode support for highlights
- ✅ First-run welcome banner
- ✅ Extension context invalidation handling
- ✅ Cleaned up UI (no emojis, clear hierarchy)
- ✅ Improved popup UX with severity badges and category breakdown

## Version 1.1 (Current Focus)

**Goal:** Make flagged terms faster and easier to review on long pages.

### Completed
- ✅ Find next/previous navigation
- ✅ Current match counter (X / Y)
- ✅ Auto-scroll selected term into view
- ✅ Stronger active highlight styling
- ✅ Keyboard shortcuts for navigation
- ✅ On-page toolbar with filters
- ✅ Category-based filtering

### In Progress / Planned
- [ ] Improve dictionary coverage (target: 100+ terms)
- [ ] Add more context rules to reduce false positives
- [ ] Detect likely consent regions before full-page scan
- [ ] Better plain-language explanations
- [ ] User feedback loop for dictionary improvements

## Version 1.2 (Planned)

**Goal:** Make the extension feel more powerful and user-friendly.

### Features
- [ ] Floating on-page navigation bar (alternative to toggle button)
- [ ] Compact results summary badge on the page
- [ ] Export flagged terms as CSV or JSON
- [ ] Highlight history (remember what you've reviewed)
- [ ] Better first-run onboarding with demo page
- [ ] Settings persistence across sessions
- [ ] Undo/redo for category filter changes

## Version 1.3 (Planned)

**Goal:** Improve usefulness and build trust.

### Features
- [ ] Expand dictionary to 150+ terms
- [ ] Machine learning-based context rules (optional, local-only)
- [ ] Consent region detection (scan only relevant sections)
- [ ] Improved explanation wording (even more plain-language)
- [ ] User-contributed terms (community dictionary)
- [ ] Term severity voting (users rate if a term is actually risky)
- [ ] Integration with privacy rating services

## Version 2.0 (Future)

**Goal:** Expand beyond standard webpages.

### Features
- [ ] PDF support for text-based PDFs
- [ ] Page-aware navigation for flagged PDF terms
- [ ] Side panel results list with clickable jump links
- [ ] Batch export of flagged terms from multiple pages
- [ ] Browser history integration (see which sites have risky terms)
- [ ] Privacy score for websites (aggregate risk level)
- [ ] Integration with password managers and privacy tools

## Known Limitations

### Current
- Webpages only (PDF support in v2.0)
- English language only
- Dictionary-based detection (no AI)
- May miss some terms or flag false positives
- Best on structured pages (privacy policies, ToS, cookie banners)

### By Design
- Local-only processing (no cloud analysis)
- No user tracking or data collection
- No server infrastructure required

## Technical Debt & Improvements

- [ ] Add unit tests for scanner and highlighter
- [ ] Add integration tests for popup and content script
- [ ] Improve performance on very large pages (10k+ words)
- [ ] Add telemetry (opt-in) to understand usage patterns
- [ ] Refactor content.js to reduce complexity
- [ ] Add JSDoc comments to all functions
- [ ] Create developer documentation

## Community Contributions

We welcome contributions! Areas where help is needed:

- **Dictionary expansion** — suggest new terms or variations
- **Context rules** — help reduce false positives
- **Translations** — localize for other languages
- **Testing** — test on real websites and report issues
- **UI/UX** — design improvements and accessibility
- **Documentation** — improve guides and tutorials

## Release Schedule

- **v0.2.0** — Current (Feb 2025)
- **v1.1** — Q1 2025 (improved navigation and filtering)
- **v1.2** — Q2 2025 (export, history, better UX)
- **v1.3** — Q3 2025 (community features, ML context)
- **v2.0** — Q4 2025 (PDF support, integrations)

## Feedback & Suggestions

Have an idea? Found a bug? Open an issue on GitHub or reach out to the team.

---

**Last updated:** February 2025
