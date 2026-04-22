# Changelog

All notable changes to ConsentLens are documented in this file.

## [1.0.0] — 2026-04-21

### Release Status
- ✅ **Published on Chrome Web Store**
- ✅ **Production-ready**
- ✅ **Approved by Google**

### Features
- **62+ legal and consent terms** across 7 categories
- **Color-coded severity levels** (red/amber/blue)
- **Plain-language explanations** for every flagged term
- **Smart filtering** — "High risk only" mode or category-based filtering
- **Keyboard navigation** — Alt+Shift+Arrow keys to jump between terms
- **On-page toolbar** — floating review bar with filters and navigation
- **Dark mode support** — highlights remain visible on any background
- **Context-aware detection** — reduces false positives
- **100% local processing** — no data collection, no servers, no tracking
- **Works offline** — no internet connection required

### Documentation
- Comprehensive README with installation, usage, and troubleshooting
- Detailed ROADMAP with v1.1 → v2.0 plans
- Complete CHANGELOG documenting all changes
- Privacy policy and security information

### Known Limitations
- Webpages only (PDF support in v2.0)
- English language only
- Dictionary-based detection (no AI)
- Best on structured pages (privacy policies, ToS, cookie banners)

---

## [0.2.0] — 2025-02-XX

### Added
- **Dictionary expansion** — 62 terms across 7 categories (up from 15)
  - Legal Rights: binding arbitration, class action waivers, liability limits, indemnification, unilateral changes, waivers, disclaimers, governing law, force majeure, IP licensing
  - Money: automatic renewal, recurring billing, non-refundable fees, price changes, cancellation fees, free trials, in-app purchases, price notices
  - Privacy: data collection, retention, deletion rights, privacy policy, marketing emails, opt-out, CCPA, sensitive data, profiling
  - Data Sharing: third-party sharing, selling data, data transfer, aggregation, business transfer, law enforcement
  - Tracking: cookies, targeted ads, location tracking, cross-device tracking, pixels, analytics, fingerprinting, session recording
  - Termination: account termination, termination without notice, data after termination, survival clauses
  - Biometrics: biometric data, facial recognition

- **Context-aware detection** — reduces false positives by checking surrounding text for relevant keywords
- **On-page toolbar** — floating review bar with navigation, filters, and term explanations
- **Category filtering** — toggle 7 categories on/off to customize what gets highlighted
- **"High risk only" mode** — quick filter to show only high-severity terms
- **Keyboard navigation** — Alt+Shift+Right/Left to jump between terms without opening popup
- **Dark mode support** — highlights remain visible on dark backgrounds
- **First-run welcome banner** — explains ConsentLens on first install
- **Severity badges** — visual breakdown of high/medium/low terms in popup
- **Category breakdown** — shows which categories have the most flagged terms
- **Extension context invalidation handling** — gracefully shuts down when extension is reloaded

### Changed
- **UI redesign** — removed emojis, cleaner typography, better visual hierarchy
- **Popup layout** — tighter spacing, clearer sections, improved readability
- **Highlight styling** — stronger visual distinction between severity levels
- **Navigation counter** — now shows filtered count (respects toolbar filters)
- **Default scan depth** — changed from "Balanced" to "High risk only" for better UX
- **Removed features**
  - Custom terms input (replaced with category toggles)
  - "Balanced" preset (kept "High risk only" and "Everything")
  - "Show hover explanations" checkbox (tooltips always on)

### Fixed
- **Extension context invalidated errors** — wrapped chrome.storage and chrome.runtime calls with error handling
- **Navigation counter inconsistency** — nav counter now reflects filtered count, not raw page total
- **Toolbar auto-expansion** — toolbar now starts collapsed (toggle button only), never blocks screen
- **False positives** — added context rules for common terms like "third parties", "cookies", "data"
- **Dark mode readability** — highlights now use opaque underlines instead of transparent tints

### Technical
- Refactored content.js with context validity guards
- Added safeSendMessage wrapper for chrome.runtime calls
- Improved error handling in settings.js for storage API
- Better separation of concerns (raw counts vs. filtered navigation state)
- Cleaner CSS with dark mode media queries

### Documentation
- Comprehensive README with features, usage, and troubleshooting
- Updated ROADMAP with completed features and future plans
- Added CHANGELOG (this file)

## [0.1.0] — 2025-01-XX

### Initial Release
- MVP with 15 legal/consent terms
- Basic highlighting and tooltips
- Simple highlight presets
- Dynamic page content rescanning
- Local settings storage
- Popup with basic controls

