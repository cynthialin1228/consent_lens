# ConsentLens

**Know what you're agreeing to.**

ConsentLens is a Chrome extension that highlights risky legal and consent terms on webpages in plain language. Everything stays local in your browser — no data collection, no servers, no tracking.

## Why ConsentLens?

Most people don't read terms of service, privacy policies, or cookie banners. They should. ConsentLens makes it easy by:

- **Highlighting risky terms** — binding arbitration, class action waivers, automatic renewal, data sharing, tracking, and more
- **Plain-language explanations** — hover over any flagged term to understand what it means
- **Local processing only** — all analysis happens in your browser; nothing is sent anywhere
- **Smart filtering** — reduce noise with "High risk only" mode or filter by category
- **Keyboard navigation** — jump between flagged terms without opening the popup

## Features

### On-Page Highlighting
- **62+ legal and consent terms** across 7 categories (Legal Rights, Money, Privacy, Data Sharing, Tracking, Termination, Biometrics)
- **Color-coded by severity** — red for high risk, amber for medium, blue for low
- **Context-aware detection** — reduces false positives by checking surrounding text
- **Dark mode support** — highlights remain visible on any background

### Smart Navigation
- **Prev/Next buttons** in the popup to step through flagged terms
- **Keyboard shortcuts** — Alt+Shift+Right/Left to navigate without opening the popup
- **Auto-scroll** — selected term scrolls into view automatically
- **Live counter** — shows current position (e.g., "3 / 14")

### Flexible Filtering
- **Scan depth** — "High risk only" for speed, or "Everything" for thoroughness
- **Category toggles** — enable/disable Privacy, Money, Tracking, Legal Rights, Termination, Biometrics
- **On-page toolbar** — filter and navigate without leaving the page

### First-Run Guidance
- **Welcome banner** — explains what ConsentLens does on first install
- **Rescan button** — manually re-scan if the page updates
- **Clear UI** — no clutter, no emojis, just the information you need

## Installation

1. Open `chrome://extensions` in your browser
2. Turn on **Developer Mode** (top right)
3. Click **Load unpacked**
4. Select this project folder
5. Open a privacy policy, terms of service, or cookie consent page
6. Refresh the page to see ConsentLens in action

## How to Use

### Basic Workflow
1. **Enable ConsentLens** — toggle is in the popup header
2. **Choose scan depth** — "High risk only" (default) or "Everything"
3. **Select categories** — check which term types to highlight
4. **Navigate** — use Prev/Next buttons or Alt+Shift+Arrow keys
5. **Read explanations** — hover over any highlighted term to see what it means

### Keyboard Shortcuts
- **Alt + Shift + Right Arrow** — jump to next flagged term
- **Alt + Shift + Left Arrow** — jump to previous flagged term

### On-Page Toolbar
When terms are found, a small "ConsentLens" button appears in the bottom right. Click it to open the full review bar with:
- Category filters
- "High risk only" toggle
- Prev/Next navigation
- Current term explanation

## Dictionary

ConsentLens includes 62 terms across these categories:

### Legal Rights (10 terms)
Binding arbitration, class action waivers, limitation of liability, indemnification, unilateral changes, waivers, disclaimers, governing law, force majeure, IP licensing

### Money (8 terms)
Automatic renewal, recurring billing, non-refundable fees, price changes, cancellation fees, free trial conversion, in-app purchases, price increase notices

### Privacy (9 terms)
Data collection, data retention, right to deletion, privacy policy, marketing emails, opt-out rights, CCPA opt-out, sensitive data, profiling

### Data Sharing (8 terms)
Third-party sharing, third parties, selling personal information, sharing information, data transfer, aggregated data, business transfer, law enforcement disclosure

### Tracking (8 terms)
Cookies, targeted advertising, location tracking, cross-device tracking, tracking pixels, analytics, browser fingerprinting, session recording

### Termination (4 terms)
Account termination, termination without notice, data after termination, survival clauses

### Biometrics (2 terms)
Biometric data, facial recognition

## Settings

### Enable/Disable
Toggle the main switch in the popup header to turn highlighting on or off. When disabled, the on-page button disappears.

### Scan Depth
- **High risk only** (default) — shows only high-severity terms for a quick scan
- **Everything** — shows all three severity levels for a thorough review

### Categories
Check or uncheck each category to control what gets highlighted. Changes apply immediately.

## Privacy & Security

- **No data collection** — ConsentLens never sends your data anywhere
- **No servers** — all processing happens locally in your browser
- **No tracking** — we don't track your activity or which pages you visit
- **Open source** — the code is transparent and auditable
- **Offline capable** — works without an internet connection

## Limitations

- **Webpages only** — PDF support coming in a future version
- **Dictionary-based** — uses pattern matching, not AI; may miss some terms or flag false positives
- **English only** — currently supports English-language terms
- **Best on structured pages** — works best on privacy policies, terms of service, and cookie banners

## Troubleshooting

### Extension not working on a page?
- Make sure ConsentLens is enabled (toggle in popup)
- Try clicking the "Rescan" button
- Some pages block extensions; try a different site

### Highlights disappearing?
- The page may have updated its content. Click "Rescan" to re-highlight.
- If the extension was recently updated, refresh the page.

### Too many false positives?
- Try "High risk only" mode for a cleaner scan
- Uncheck categories you don't care about
- The dictionary will improve over time

## Roadmap

### Version 1.1 (In Progress)
- ✅ Prev/Next navigation
- ✅ Match counter
- ✅ Keyboard shortcuts
- ✅ On-page toolbar
- ✅ Category filters

### Version 1.2 (Planned)
- Improved dictionary coverage (100+ terms)
- Better context rules to reduce false positives
- Consent region detection (scan only relevant sections)
- Export flagged terms

### Version 2.0 (Future)
- PDF support
- Side panel results list
- Community dictionary contributions
- Integration with other privacy tools

## Contributing

Found a bug? Have a suggestion? Open an issue on GitHub.

## License

MIT License — see LICENSE file for details.

## Support

For questions or feedback, open an issue on GitHub or visit the project page.

---

**ConsentLens: Know what you're agreeing to.**
