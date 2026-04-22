# ConsentLens Chrome Web Store Publishing Guidelines

## Overview
This document outlines the complete process for publishing and maintaining ConsentLens on the Chrome Web Store. Follow these guidelines to ensure compliance with Chrome Web Store policies and maintain a professional presence.

---

## Pre-Publication Checklist

### 1. Code Quality & Security
- [ ] All code is minified and optimized for production
- [ ] No console.log() statements or debug code remain
- [ ] No hardcoded API keys, tokens, or sensitive data
- [ ] All external dependencies are vetted and up-to-date
- [ ] Content Security Policy (CSP) is properly configured in manifest.json
- [ ] No eval() or Function() constructors used
- [ ] All permissions in manifest.json are necessary and justified

### 2. Manifest & Metadata
- [ ] manifest.json version is incremented (semantic versioning)
- [ ] manifest_version is 3 (required for new extensions)
- [ ] minimum_chrome_version is specified (currently 102)
- [ ] All icons are provided in required sizes (16, 32, 48, 128 px)
- [ ] Icons are in PNG format with transparent backgrounds
- [ ] Extension name is clear and descriptive
- [ ] Description accurately reflects functionality

### 3. Documentation
- [ ] README.md is complete and user-friendly
- [ ] CHANGELOG.md documents all changes for this version
- [ ] Privacy policy is clear and accurate
- [ ] Terms of service (if applicable) are provided
- [ ] All features are documented

### 4. Testing
- [ ] Extension loads without errors in Chrome
- [ ] All features work as intended
- [ ] Tested on multiple websites (privacy policies, ToS, cookie banners)
- [ ] No console errors or warnings
- [ ] Performance is acceptable on large pages
- [ ] Dark mode compatibility verified
- [ ] Keyboard shortcuts work correctly
- [ ] Extension works offline

### 5. Compliance
- [ ] No malware or suspicious code
- [ ] No data collection beyond what's disclosed
- [ ] No tracking or analytics (unless explicitly disclosed)
- [ ] Permissions are minimal and justified
- [ ] No deceptive practices or misleading claims
- [ ] Complies with Chrome Web Store policies

---

## Chrome Web Store Account Setup

### 1. Developer Account
- Create a Google account if you don't have one
- Visit [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- Pay the one-time $5 registration fee
- Verify your identity and payment method

### 2. Developer Profile
- Complete your developer profile with:
  - Developer name (your name or organization)
  - Contact email
  - Website (optional but recommended)
  - Support email
  - Privacy policy URL (required)

### 3. Payment & Billing
- Set up payment method for the registration fee
- Ensure billing information is current
- Note: ConsentLens is free, so no revenue sharing applies

---

## Submission Process

### Step 1: Prepare Your Package

```bash
# Create a production build
# Ensure all files are included:
# - manifest.json
# - All source files (src/)
# - All assets (assets/)
# - README.md
# - CHANGELOG.md
# - LICENSE (if applicable)

# Do NOT include:
# - .git/
# - .vscode/
# - node_modules/
# - .gitignore
# - Development files
```

### Step 2: Create ZIP Archive

```bash
# Create a clean ZIP file for submission
zip -r consentlens.zip \
  manifest.json \
  src/ \
  assets/ \
  README.md \
  CHANGELOG.md \
  LICENSE
```

### Step 3: Upload to Chrome Web Store

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click "New Item"
3. Upload the ZIP file
4. Wait for automatic validation (usually completes in minutes)

### Step 4: Fill in Store Listing

#### Basic Information
- **Extension Name:** ConsentLens
- **Short Description:** (max 132 characters)
  - "Highlights risky legal and consent terms on webpages in plain language."
- **Detailed Description:** (use README.md content)
  - Include key features, benefits, and usage instructions
  - Explain privacy commitment clearly
  - Mention that everything stays local

#### Graphic Assets
- **Icon (128x128 px):** assets/icon128.png
- **Screenshots (1280x800 or 640x400 px):**
  - Screenshot 1: Extension highlighting terms on a privacy policy
  - Screenshot 2: Popup showing categories and filters
  - Screenshot 3: Tooltip showing plain-language explanation
  - Screenshot 4: Keyboard navigation feature
  - Add captions explaining each screenshot
- **Promotional Tile (440x280 px):** (optional)
  - Eye-catching image representing the extension's purpose

#### Category & Content Rating
- **Category:** Productivity or Privacy
- **Content Rating:** Select appropriate rating
  - ConsentLens is suitable for all ages
  - No adult content, violence, or sensitive material

#### Languages
- **Primary Language:** English
- **Localization:** (future versions)

#### Permissions Justification
Explain why each permission is needed:

- **storage:** Store user settings (scan depth, category filters, enabled/disabled state)
- **activeTab:** Access the current tab to highlight terms
- **scripting:** Inject content scripts to scan and highlight terms
- **host_permissions (<all_urls>):** Scan any webpage for risky terms

#### Privacy & Security
- **Privacy Policy URL:** Link to your privacy policy
  - Must clearly state:
    - No data collection
    - No tracking
    - All processing is local
    - No third-party sharing
- **Support Email:** Your support contact
- **Support Website:** Link to GitHub repository or support page

### Step 5: Review & Submit

1. Review all information for accuracy
2. Ensure all required fields are completed
3. Accept Chrome Web Store Developer Agreement
4. Click "Submit for Review"
5. Wait for review (typically 1-3 days)

---

## Chrome Web Store Policies Compliance

### Prohibited Content
❌ Do NOT include:
- Malware or deceptive code
- Misleading claims about functionality
- Unauthorized data collection
- Tracking without disclosure
- Phishing or social engineering
- Hate speech or discrimination
- Illegal content

### Required Disclosures
✅ DO include:
- Clear privacy policy
- Accurate description of functionality
- Honest permission justification
- Transparent data handling practices
- Support contact information

### Best Practices
- Keep descriptions accurate and up-to-date
- Respond promptly to user reviews
- Fix reported bugs quickly
- Update regularly with improvements
- Maintain high code quality standards

---

## Post-Publication

### 1. Monitor Reviews & Feedback
- Check Chrome Web Store reviews regularly
- Respond to user feedback professionally
- Address bugs and issues promptly
- Track feature requests

### 2. Update Management
- Increment version number in manifest.json
- Update CHANGELOG.md with changes
- Test thoroughly before updating
- Submit updates through developer dashboard
- Updates typically take 1-3 hours to deploy

### 3. Maintenance Schedule
- **Weekly:** Monitor reviews and support emails
- **Monthly:** Review analytics and user feedback
- **Quarterly:** Plan feature updates and improvements
- **As needed:** Release bug fixes and security patches

### 4. Analytics
- Monitor installation and active user counts
- Track crash reports and errors
- Review user feedback and ratings
- Use data to inform future development

---

## Version Update Process

### For Each Release:

1. **Update manifest.json**
   ```json
   "version": "1.0.1"  // Increment version
   ```

2. **Update CHANGELOG.md**
   ```markdown
   ## Version 1.0.1 (Date)
   - Bug fix: [description]
   - Feature: [description]
   - Improvement: [description]
   ```

3. **Test Thoroughly**
   - Load unpacked extension in Chrome
   - Test all features
   - Verify no console errors
   - Test on multiple websites

4. **Create ZIP Archive**
   ```bash
   zip -r consentlens-1.0.1.zip manifest.json src/ assets/ README.md CHANGELOG.md LICENSE
   ```

5. **Submit Update**
   - Go to developer dashboard
   - Click "Package" for ConsentLens
   - Upload new ZIP file
   - Update store listing if needed
   - Submit for review

---

## Marketing & Promotion

### Before Launch
- [ ] Create social media accounts (optional)
- [ ] Write blog post about ConsentLens
- [ ] Prepare launch announcement
- [ ] Reach out to privacy-focused communities

### After Launch
- [ ] Share on relevant subreddits (r/privacy, r/chrome, etc.)
- [ ] Post on privacy forums and communities
- [ ] Reach out to privacy bloggers for reviews
- [ ] Share on social media
- [ ] Engage with users in reviews and comments

### Ongoing
- [ ] Regular updates with new features
- [ ] Respond to all user reviews
- [ ] Share roadmap updates
- [ ] Highlight privacy commitment
- [ ] Build community around the extension

---

## Troubleshooting Common Issues

### Extension Rejected
**Reason:** Unclear privacy policy or data handling
**Solution:** 
- Provide detailed privacy policy
- Clearly explain that no data is collected
- Justify all permissions

**Reason:** Misleading description
**Solution:**
- Ensure description matches actual functionality
- Remove any exaggerated claims
- Be specific about features and limitations

### Low Installation Rate
**Solution:**
- Improve store listing with better screenshots
- Add more detailed description
- Respond to reviews and feedback
- Promote on social media and forums
- Optimize keywords in title and description

### User Complaints
**Solution:**
- Respond promptly and professionally
- Acknowledge issues and provide solutions
- Release bug fixes quickly
- Update documentation if needed
- Consider feature requests for future versions

---

## Security & Privacy Maintenance

### Regular Audits
- [ ] Review code for security vulnerabilities
- [ ] Check for outdated dependencies
- [ ] Verify permissions are still necessary
- [ ] Test on latest Chrome version

### Privacy Commitment
- [ ] Maintain zero data collection policy
- [ ] Never add tracking without explicit user consent
- [ ] Keep privacy policy up-to-date
- [ ] Be transparent about any changes

### User Trust
- [ ] Respond to all support inquiries
- [ ] Fix bugs promptly
- [ ] Maintain high code quality
- [ ] Be honest about limitations
- [ ] Respect user privacy absolutely

---

## Useful Resources

- [Chrome Web Store Developer Documentation](https://developer.chrome.com/docs/webstore/)
- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)
- [Chrome Web Store Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Chrome Extension Best Practices](https://developer.chrome.com/docs/extensions/mv3/best-practices/)
- [Privacy Policy Generator](https://www.privacypolicygenerator.info/)

---

## Contact & Support

- **GitHub Issues:** Report bugs and request features
- **Email Support:** [your-email@example.com]
- **Privacy Questions:** [privacy@example.com]
- **General Inquiries:** [support@example.com]

---

## Appendix: Sample Privacy Policy

```markdown
# ConsentLens Privacy Policy

## Data Collection
ConsentLens does not collect, store, or transmit any personal data. All processing happens locally in your browser.

## How It Works
- Scans webpages for risky legal and consent terms
- Highlights matching terms with color-coded severity
- Stores user settings (enabled/disabled, scan depth, category filters) locally in your browser
- No data is sent to any server or third party

## Permissions
- **storage:** Store user preferences locally
- **activeTab:** Access current tab to scan for terms
- **scripting:** Inject content scripts to perform scanning
- **host_permissions:** Scan any webpage for risky terms

## Third Parties
ConsentLens does not share data with any third parties.

## Changes to This Policy
We may update this policy occasionally. Changes will be reflected in the extension version history.

## Contact
For privacy questions, contact: [your-email@example.com]
```

---

**Last Updated:** April 2026
**Version:** 1.0
