(() => {
  const TERMS_DICTIONARY = [

    // ─── LEGAL RIGHTS ────────────────────────────────────────────────────────

    {
      id: "binding-arbitration",
      phrase: "binding arbitration",
      variants: ["mandatory arbitration", "arbitrate disputes", "submit to arbitration", "resolved by arbitration"],
      category: "legal-rights",
      severity: "high",
      explanation: "This may stop you from taking a dispute to court and push you into private arbitration instead."
    },
    {
      id: "class-action-waiver",
      phrase: "class action waiver",
      variants: ["waiver of class actions", "waive class action rights", "class action claims", "no class action", "class or collective action"],
      category: "legal-rights",
      severity: "high",
      explanation: "This may block you from joining other people in a group lawsuit against the company."
    },
    {
      id: "limitation-of-liability",
      phrase: "limitation of liability",
      variants: ["limit our liability", "not liable for", "no liability for", "disclaim liability", "liability is limited", "maximum liability"],
      category: "legal-rights",
      severity: "high",
      explanation: "This caps how much the company owes you if something goes wrong, even if it is their fault."
    },
    {
      id: "indemnification",
      phrase: "indemnify",
      variants: ["indemnification", "hold harmless", "defend and indemnify", "indemnify us", "indemnify the company"],
      category: "legal-rights",
      severity: "high",
      explanation: "This may require you to pay the company's legal costs if a third party sues them because of your actions."
    },
    {
      id: "governing-law",
      phrase: "governing law",
      variants: ["laws of the state of", "jurisdiction of", "exclusive jurisdiction", "venue for disputes", "choice of law"],
      category: "legal-rights",
      severity: "medium",
      explanation: "This sets which state or country's laws apply to any dispute, which may not be where you live."
    },
    {
      id: "unilateral-changes",
      phrase: "modify these terms",
      variants: ["change these terms", "update this agreement", "amend this policy", "revise these terms", "right to modify", "may change at any time"],
      category: "legal-rights",
      severity: "high",
      explanation: "The company can change the rules at any time, often without asking your permission."
    },
    {
      id: "consent",
      phrase: "by clicking accept",
      variants: ["you agree to", "by continuing you agree", "i agree", "by using this service you agree", "acceptance of these terms"],
      category: "legal-rights",
      severity: "medium",
      explanation: "This signals that using the service may count as agreeing to its rules or data practices.",
      requiresContextAny: ["terms", "privacy", "policy", "cookies", "agreement", "consent"]
    },
    {
      id: "waiver-of-rights",
      phrase: "waiver of rights",
      variants: ["waive your rights", "waiving any right", "you waive", "deemed to have waived"],
      category: "legal-rights",
      severity: "high",
      explanation: "This means you may be giving up legal rights you would otherwise have."
    },
    {
      id: "disclaimer-of-warranties",
      phrase: "disclaimer of warranties",
      variants: ["as is", "as-is", "without warranty", "no warranties", "disclaim all warranties", "implied warranties"],
      category: "legal-rights",
      severity: "medium",
      explanation: "The company is saying the service comes with no guarantees about quality or reliability."
    },
    {
      id: "force-majeure",
      phrase: "force majeure",
      variants: ["acts of god", "beyond our reasonable control", "circumstances beyond our control"],
      category: "legal-rights",
      severity: "low",
      explanation: "The company may not be responsible for failures caused by events outside their control."
    },

    // ─── MONEY ───────────────────────────────────────────────────────────────

    {
      id: "automatic-renewal",
      phrase: "automatic renewal",
      variants: ["auto-renewal", "renews automatically", "automatically renew", "continuous subscription", "automatically charged"],
      category: "money",
      severity: "high",
      explanation: "This may keep charging you unless you cancel before the renewal date."
    },
    {
      id: "recurring-billing",
      phrase: "recurring billing",
      variants: ["recurring charges", "subscription fee", "monthly billing", "annual billing", "billed monthly", "billed annually"],
      category: "money",
      severity: "high",
      explanation: "This means payments may repeat over time instead of happening just once."
    },
    {
      id: "non-refundable",
      phrase: "non-refundable",
      variants: ["no refunds", "not refundable", "all sales final", "no cancellation refund", "fees are non-refundable"],
      category: "money",
      severity: "high",
      explanation: "This usually means you may not get your money back even if you change your mind."
    },
    {
      id: "price-changes",
      phrase: "change our prices",
      variants: ["change the fees", "modify pricing", "adjust our rates", "price may change", "fees may change", "right to change pricing"],
      category: "money",
      severity: "high",
      explanation: "The company can raise prices, often with limited notice and without your approval."
    },
    {
      id: "cancellation-fee",
      phrase: "cancellation fee",
      variants: ["early termination fee", "cancellation charge", "termination fee", "early cancellation"],
      category: "money",
      severity: "high",
      explanation: "You may be charged a penalty if you cancel before a set period ends."
    },
    {
      id: "free-trial-conversion",
      phrase: "free trial",
      variants: ["trial period", "trial subscription", "after your trial", "trial ends"],
      category: "money",
      severity: "medium",
      explanation: "Free trials often convert to paid subscriptions automatically if you do not cancel in time.",
      requiresContextAny: ["charge", "billing", "payment", "subscription", "credit card", "renew", "cancel"]
    },
    {
      id: "price-increase-notice",
      phrase: "notice of price increase",
      variants: ["30 days notice", "advance notice of changes", "notify you of fee changes"],
      category: "money",
      severity: "low",
      explanation: "The company will warn you before raising prices, which is a positive sign."
    },
    {
      id: "in-app-purchases",
      phrase: "in-app purchases",
      variants: ["virtual currency", "virtual goods", "digital content purchases", "paid features"],
      category: "money",
      severity: "medium",
      explanation: "Additional purchases may be available or required inside the app or service."
    },

    // ─── DATA SHARING ─────────────────────────────────────────────────────────

    {
      id: "third-party-sharing",
      phrase: "third-party sharing",
      variants: ["share with third parties", "shared with third parties", "third party partners", "third-party partners"],
      category: "data-sharing",
      severity: "high",
      explanation: "Your information may be passed to outside companies, vendors, or partners."
    },
    {
      id: "third-parties",
      phrase: "third parties",
      variants: ["third-party services", "our partners", "affiliated companies", "business partners"],
      category: "data-sharing",
      severity: "medium",
      explanation: "Your data may be shared with or accessible to outside organizations.",
      requiresContextAny: ["share", "sell", "disclose", "transfer", "provide", "send", "give", "access"]
    },
    {
      id: "sell-personal-information",
      phrase: "sell personal information",
      variants: ["sale of personal information", "sell your data", "selling personal data", "sell personal data", "sell your personal information"],
      category: "data-sharing",
      severity: "high",
      explanation: "Your personal data may be sold or traded for business value."
    },
    {
      id: "share-information",
      phrase: "share your information",
      variants: ["share personal information", "disclose your information", "disclose personal information", "share your data", "disclose your data"],
      category: "data-sharing",
      severity: "medium",
      explanation: "This means your information may be given to other people or organizations."
    },
    {
      id: "data-transfer",
      phrase: "transfer your data",
      variants: ["transfer personal data", "transfer of personal information", "international data transfer", "transfer to other countries"],
      category: "data-sharing",
      severity: "high",
      explanation: "Your data may be moved to another company or country, possibly with weaker privacy protections."
    },
    {
      id: "aggregate-data",
      phrase: "aggregate data",
      variants: ["anonymized data", "de-identified data", "aggregated information", "statistical data"],
      category: "data-sharing",
      severity: "low",
      explanation: "The company may share combined or anonymized data. This is generally lower risk but worth noting."
    },
    {
      id: "business-transfer",
      phrase: "merger or acquisition",
      variants: ["sale of the company", "business transfer", "transfer of assets", "acquired by", "in the event of a merger"],
      category: "data-sharing",
      severity: "high",
      explanation: "If the company is sold or merges, your data may be transferred to the new owner."
    },
    {
      id: "law-enforcement-disclosure",
      phrase: "law enforcement",
      variants: ["government request", "legal process", "court order", "subpoena", "required by law", "comply with legal obligations"],
      category: "data-sharing",
      severity: "medium",
      explanation: "The company may share your data with authorities if legally required.",
      requiresContextAny: ["disclose", "share", "provide", "give", "access", "data", "information"]
    },

    // ─── PRIVACY ──────────────────────────────────────────────────────────────

    {
      id: "collect-personal-data",
      phrase: "collect personal data",
      variants: ["collect your information", "collect personal information", "gather your data", "we collect"],
      category: "privacy",
      severity: "medium",
      explanation: "This means the service is gathering information about you.",
      requiresContextAny: ["privacy", "policy", "consent", "data", "information", "cookies", "tracking"]
    },
    {
      id: "retain-data",
      phrase: "retain data",
      variants: ["data retention", "retain your information", "keep your data", "retain personal data", "store your information", "retain for"],
      category: "privacy",
      severity: "medium",
      explanation: "This means the company may keep your information instead of deleting it promptly."
    },
    {
      id: "right-to-deletion",
      phrase: "right to deletion",
      variants: ["right to be forgotten", "request deletion", "delete your account", "delete your data", "erasure request"],
      category: "privacy",
      severity: "medium",
      explanation: "You may have the right to ask the company to delete your personal data."
    },
    {
      id: "privacy-policy",
      phrase: "privacy policy",
      variants: ["privacy notice", "data policy", "data protection policy"],
      category: "privacy",
      severity: "medium",
      explanation: "This section explains how the company says it collects, uses, and shares your information."
    },
    {
      id: "marketing-emails",
      phrase: "marketing emails",
      variants: ["promotional emails", "marketing communications", "special offers", "commercial messages", "marketing messages"],
      category: "privacy",
      severity: "medium",
      explanation: "This may mean they can contact you for advertising, not just for your account."
    },
    {
      id: "opt-out",
      phrase: "opt out",
      variants: ["opt-out", "unsubscribe", "right to opt out", "you may opt out"],
      category: "privacy",
      severity: "low",
      explanation: "You may have the option to stop certain uses of your data or stop receiving communications."
    },
    {
      id: "do-not-sell",
      phrase: "do not sell my personal information",
      variants: ["do not sell my data", "opt out of sale", "ccpa opt out"],
      category: "privacy",
      severity: "low",
      explanation: "This is a CCPA right that lets California residents stop the sale of their personal data."
    },
    {
      id: "sensitive-data",
      phrase: "sensitive personal information",
      variants: ["sensitive data", "special category data", "health information", "financial information", "racial or ethnic origin"],
      category: "privacy",
      severity: "high",
      explanation: "This involves especially sensitive categories of data that deserve extra scrutiny."
    },
    {
      id: "profiling",
      phrase: "profiling",
      variants: ["automated decision-making", "automated processing", "create a profile", "user profiling", "behavioral profiling"],
      category: "privacy",
      severity: "high",
      explanation: "The company may build a detailed profile of you based on your behavior and data."
    },

    // ─── TRACKING ─────────────────────────────────────────────────────────────

    {
      id: "cookies",
      phrase: "cookies",
      variants: ["tracking cookies", "cookie policy", "cookie preferences", "cookie settings", "cookie banner", "use of cookies"],
      category: "tracking",
      severity: "medium",
      explanation: "Cookies can be used to remember activity and track behavior across visits.",
      requiresContextAny: ["privacy", "consent", "tracking", "policy", "browser", "advertising"]
    },
    {
      id: "targeted-advertising",
      phrase: "targeted advertising",
      variants: ["personalized advertising", "interest-based advertising", "ad partners", "ad personalization", "behavioral advertising"],
      category: "tracking",
      severity: "medium",
      explanation: "This may mean your activity is used to decide which ads you see."
    },
    {
      id: "location-tracking",
      phrase: "location tracking",
      variants: ["track your location", "precise location", "geolocation data", "location data", "location services", "GPS data"],
      category: "tracking",
      severity: "high",
      explanation: "This means the service may watch where you are or where you have been."
    },
    {
      id: "cross-device-tracking",
      phrase: "cross-device tracking",
      variants: ["cross-device", "device identifiers", "advertising identifier", "IDFA", "GAID", "device fingerprint"],
      category: "tracking",
      severity: "medium",
      explanation: "This may link your activity across your phone, browser, or other devices."
    },
    {
      id: "tracking-pixels",
      phrase: "tracking pixel",
      variants: ["web beacon", "pixel tag", "clear gif", "tracking technology", "pixel tracking"],
      category: "tracking",
      severity: "medium",
      explanation: "Invisible tracking tools may be used to monitor when you open emails or visit pages."
    },
    {
      id: "analytics",
      phrase: "analytics",
      variants: ["usage analytics", "behavioral analytics", "analytics providers", "analytics partners", "third-party analytics"],
      category: "tracking",
      severity: "low",
      explanation: "The company may use analytics tools to track how you use the service.",
      requiresContextAny: ["collect", "track", "monitor", "share", "third-party", "partner"]
    },
    {
      id: "fingerprinting",
      phrase: "browser fingerprinting",
      variants: ["device fingerprinting", "fingerprint your device", "canvas fingerprinting"],
      category: "tracking",
      severity: "high",
      explanation: "This technique can identify you uniquely without cookies, making it hard to avoid tracking."
    },
    {
      id: "session-recording",
      phrase: "session recording",
      variants: ["record your session", "replay session", "screen recording", "keystroke logging", "mouse movement tracking"],
      category: "tracking",
      severity: "high",
      explanation: "The company may record exactly what you do on screen, including clicks and keystrokes."
    },

    // ─── BIOMETRICS ───────────────────────────────────────────────────────────

    {
      id: "biometric-data",
      phrase: "biometric data",
      variants: ["faceprint", "fingerprint data", "voiceprint", "facial recognition", "retina scan", "biometric identifiers", "biometric information"],
      category: "biometrics",
      severity: "high",
      explanation: "This involves sensitive body-based data such as your face, fingerprint, or voice."
    },
    {
      id: "facial-recognition",
      phrase: "facial recognition",
      variants: ["face scan", "face detection", "facial scan", "face matching"],
      category: "biometrics",
      severity: "high",
      explanation: "The service may scan or analyze your face, which is highly sensitive biometric data."
    },

    // ─── TERMINATION ──────────────────────────────────────────────────────────

    {
      id: "terminate-account",
      phrase: "terminate your account",
      variants: ["suspend your account", "close your account", "end your access", "disable your account", "terminate access", "revoke access"],
      category: "termination",
      severity: "medium",
      explanation: "This means the company may stop your access under certain conditions."
    },
    {
      id: "terminate-without-notice",
      phrase: "terminate without notice",
      variants: ["suspend without notice", "immediately terminate", "terminate at any time", "discontinue at any time", "without prior notice"],
      category: "termination",
      severity: "high",
      explanation: "The company can shut down your account instantly and without warning."
    },
    {
      id: "data-after-termination",
      phrase: "data after termination",
      variants: ["data upon cancellation", "retain data after account closure", "data following termination", "after your account is closed"],
      category: "termination",
      severity: "medium",
      explanation: "The company may keep your data even after you close your account."
    },
    {
      id: "survival-clause",
      phrase: "survive termination",
      variants: ["provisions survive", "obligations survive", "survive the termination", "survive expiration"],
      category: "termination",
      severity: "medium",
      explanation: "Some terms of the agreement may still apply to you even after you stop using the service."
    },

    // ─── CHILDREN & MINORS ────────────────────────────────────────────────────

    {
      id: "children-data",
      phrase: "children under 13",
      variants: ["children's privacy", "COPPA", "minors", "under the age of 13", "children under the age of 16", "parental consent"],
      category: "privacy",
      severity: "high",
      explanation: "This section covers rules about collecting data from children, which has strict legal protections."
    },

    // ─── INTELLECTUAL PROPERTY ────────────────────────────────────────────────

    {
      id: "license-to-content",
      phrase: "license to your content",
      variants: ["grant us a license", "royalty-free license", "worldwide license", "license to use your content", "right to use your content"],
      category: "legal-rights",
      severity: "high",
      explanation: "By posting content, you may be giving the company broad rights to use it for free."
    },
    {
      id: "user-generated-content",
      phrase: "user-generated content",
      variants: ["content you submit", "content you post", "your submissions", "user content"],
      category: "legal-rights",
      severity: "medium",
      explanation: "Anything you post or upload may be subject to the company's content policies and licenses.",
      requiresContextAny: ["license", "rights", "own", "use", "share", "distribute", "modify"]
    },

    // ─── SECURITY ─────────────────────────────────────────────────────────────

    {
      id: "data-breach",
      phrase: "data breach",
      variants: ["security incident", "unauthorized access", "security breach", "breach notification"],
      category: "privacy",
      severity: "medium",
      explanation: "This covers what happens if your data is exposed or stolen."
    },
    {
      id: "no-security-guarantee",
      phrase: "cannot guarantee security",
      variants: ["no guarantee of security", "security cannot be guaranteed", "absolute security", "transmission of information is not secure"],
      category: "privacy",
      severity: "high",
      explanation: "The company is saying it cannot fully protect your data from breaches or leaks."
    },

    // ─── COMMUNICATIONS ───────────────────────────────────────────────────────

    {
      id: "electronic-communications",
      phrase: "electronic communications",
      variants: ["electronic notices", "email notices", "electronic delivery", "consent to electronic records"],
      category: "legal-rights",
      severity: "low",
      explanation: "You may be agreeing to receive all legal notices by email instead of physical mail."
    },
    {
      id: "sms-consent",
      phrase: "text messages",
      variants: ["SMS messages", "mobile alerts", "text alerts", "consent to receive texts", "automated texts"],
      category: "privacy",
      severity: "medium",
      explanation: "You may be agreeing to receive automated text messages from the company.",
      requiresContextAny: ["consent", "agree", "opt", "receive", "send", "marketing", "promotional"]
    }

  ];

  globalThis.ConsentLensDictionary = TERMS_DICTIONARY;
})();
