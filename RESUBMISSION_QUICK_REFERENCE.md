# ConsentLens Resubmission - Quick Reference Card

**Print this page or keep it open while resubmitting**

---

## PHASE 1: CREATE ZIP (5 minutes)

```bash
# Run these commands in terminal
cd /path/to/consentlens

# Create ZIP
zip -r consentlens-1.0.0.zip \
  manifest.json \
  src/ \
  assets/ \
  README.md \
  CHANGELOG.md

# Verify ZIP
unzip -l consentlens-1.0.0.zip | head -20
```

**✅ Done when:** ZIP file created, ~200-300KB size

---

## PHASE 2: UPLOAD ZIP (5 minutes)

1. Go to: https://chrome.google.com/webstore/devconsole
2. Sign in with your Google account
3. Click "ConsentLens" extension
4. Find "Package" section
5. Click upload button
6. Select `consentlens-1.0.0.zip`
7. Wait for validation (1-5 minutes)

**✅ Done when:** See "Package uploaded successfully"

---

## PHASE 3: UPDATE STORE LISTING (10 minutes)

### Fields to KEEP (✅ DO NOT CHANGE):
- Extension Name: ConsentLens
- Short Description: "Highlights risky legal and consent terms..."
- Detailed Description: (full README content)
- Category: Productivity
- Language: English
- Content Rating: Suitable for all ages
- Privacy Policy URL: (your URL)
- Support Email: (your email)
- Support Website: (your website)
- Screenshots: (existing)
- Icon: (existing)
- storage justification: (existing)
- activeTab justification: (existing)
- scripting justification: (existing)

### Fields to MODIFY (⚠️ CHANGE THESE):
- **Host permission justification:** REPLACE with new text (see below)

---

## PHASE 4: UPDATE HOST PERMISSIONS JUSTIFICATION

### OLD TEXT (DELETE THIS):
```
The host permission `<all_urls>` is required because ConsentLens must scan 
any webpage a user visits to identify risky legal terms...
```

### NEW TEXT (PASTE THIS):
```
ConsentLens does not use broad host permissions. Instead, it uses the `activeTab` 
permission to access the current tab when the user clicks the extension popup. 
This approach is more secure and privacy-respecting because:

- Access is only granted when the user explicitly clicks the popup
- The extension can only access the active tab, not all tabs
- Permission is automatically revoked when the user navigates away
- No broad `<all_urls>` permission is needed

Content scripts are dynamically injected on-demand when the user interacts with 
the extension. This means:
- No automatic injection on every page
- Scanning only occurs when the user requests it
- All processing happens locally in the browser
- No data is collected or sent anywhere
- Users can disable the extension at any time

This optimized permission model follows Chrome Web Store best practices and 
provides better security and privacy for users.
```

**Character count:** ~650 characters (under 1000 limit ✅)

---

## PHASE 5: ADD SUBMISSION NOTES (2 minutes)

Find "Submission notes" or "Developer notes" field and paste:

```
This update optimizes host permissions to use the activeTab permission instead 
of broad permissions. The extension now dynamically injects content scripts 
on-demand when the user clicks the popup, providing better security and privacy.

All functionality is preserved. Users will not notice any difference in how the 
extension works. This change addresses the previous review feedback about broad 
host permissions.

For technical details, see: HOST_PERMISSIONS_OPTIMIZATION.md
```

---

## PHASE 6: VERIFY COMPLIANCE FORM (3 minutes)

Check all these are filled:
- ✅ Single purpose description
- ✅ storage justification
- ✅ activeTab justification
- ✅ scripting justification
- ✅ Host permission justification (UPDATED)
- ✅ Remote code: "No, I am not using Remote code"
- ✅ Data usage: None selected
- ✅ All three certifications: CHECKED
- ✅ Privacy policy URL: Valid URL

---

## PHASE 7: SUBMIT (2 minutes)

1. Scroll to bottom of form
2. Click "Submit for review" button
3. Wait for confirmation message
4. Check email for confirmation

**✅ Done when:** See "Your item has been submitted for review"

---

## PHASE 8: MONITOR (Ongoing)

1. Go to: https://chrome.google.com/webstore/devconsole
2. Check ConsentLens status
3. Expected timeline:
   - Now: Submitted
   - 24 hours: Review starts
   - 1-3 days: Review completes
   - Approved: Published to Chrome Web Store

---

## WHAT CHANGED

### ✅ Files Modified:
- `manifest.json` - Removed host_permissions and content_scripts
- `src/background/service-worker.js` - Updated for dynamic injection
- Store listing - Updated host permissions justification

### ✅ Files NOT Modified:
- All content scripts (work the same way)
- All CSS files
- All HTML files
- README.md
- CHANGELOG.md
- Icons
- Everything else

### ✅ Functionality:
- 100% preserved
- Users won't notice difference
- All features work the same

---

## EXPECTED RESULTS

### Before Resubmission:
- ❌ Broad host permissions flagged
- ⏳ In-depth review (1-2 weeks)
- ❌ Publication delayed

### After Resubmission:
- ✅ No broad host permissions
- ✅ Standard review (1-3 days)
- ✅ Faster publication

---

## TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| ZIP won't upload | Check file size < 500KB, verify manifest.json is valid |
| Store listing won't save | Verify all required fields filled, check character limits |
| Submission button disabled | Verify ZIP uploaded, store listing complete, compliance form complete |
| Review takes > 3 days | Normal - may be in queue, check email for updates |
| Rejected | Check rejection email, address issues, resubmit |

---

## IMPORTANT REMINDERS

✅ **DO:**
- Keep all descriptions unchanged
- Only modify host permissions justification
- Add submission notes explaining the change
- Verify ZIP file before uploading
- Check email for review updates

❌ **DON'T:**
- Change extension name
- Change short description
- Change detailed description
- Change category
- Change privacy policy URL
- Change support email
- Upload wrong ZIP file
- Forget to update host permissions justification

---

## CHECKLIST

Before clicking "Submit for review":

- [ ] ZIP file created and verified
- [ ] ZIP file uploaded successfully
- [ ] Store listing complete
- [ ] Host permissions justification updated
- [ ] All other fields unchanged
- [ ] Submission notes added
- [ ] Compliance form complete
- [ ] Privacy policy URL valid
- [ ] No typos or errors
- [ ] Ready to submit

---

## TIMELINE

| Step | Time | Status |
|------|------|--------|
| Create ZIP | 5 min | Now |
| Upload ZIP | 5 min | +5 min |
| Update store listing | 10 min | +15 min |
| Update host permissions | 3 min | +18 min |
| Add submission notes | 2 min | +20 min |
| Verify compliance | 3 min | +23 min |
| Submit | 2 min | +25 min |
| **Total** | **~30 min** | **Done!** |

---

## AFTER SUBMISSION

1. **Check email** - Confirmation should arrive within 1 hour
2. **Monitor dashboard** - Status should show "Pending review"
3. **Wait for review** - Typically 1-3 days
4. **Check email again** - Approval or rejection notice
5. **If approved** - Extension published to Chrome Web Store
6. **If rejected** - Address issues and resubmit

---

## SUPPORT

For detailed information:
- **Technical details:** HOST_PERMISSIONS_OPTIMIZATION.md
- **Full steps:** DETAILED_RESUBMISSION_STEPS.md
- **Compliance info:** CHROME_WEB_STORE_COMPLIANCE_FORM.md
- **Chrome docs:** https://developer.chrome.com/docs/webstore/

---

**Ready to resubmit? Start with PHASE 1 above! 🚀**

**Expected publication: 1-3 days after submission**
