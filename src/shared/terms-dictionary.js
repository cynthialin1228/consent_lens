(() => {
  const TERMS_DICTIONARY = [
    {
      id: "binding-arbitration",
      phrase: "binding arbitration",
      variants: ["arbitration", "mandatory arbitration", "arbitrate disputes"],
      category: "legal-rights",
      severity: "high",
      explanation: "This may stop you from taking a dispute to court and push you into private arbitration."
    },
    {
      id: "class-action-waiver",
      phrase: "class action waiver",
      variants: ["waiver of class actions", "waive class action rights", "class action claims"],
      category: "legal-rights",
      severity: "high",
      explanation: "This may block you from joining other people in a group lawsuit."
    },
    {
      id: "automatic-renewal",
      phrase: "automatic renewal",
      variants: ["auto-renewal", "renews automatically", "automatically renew", "continuous subscription"],
      category: "money",
      severity: "high",
      explanation: "This may keep charging you unless you cancel before the renewal date."
    },
    {
      id: "recurring-billing",
      phrase: "recurring billing",
      variants: ["recurring charges", "subscription fee", "monthly billing", "annual billing"],
      category: "money",
      severity: "high",
      explanation: "This means payments may repeat over time instead of happening just once."
    },
    {
      id: "non-refundable",
      phrase: "non-refundable",
      variants: ["no refunds", "not refundable", "all sales final"],
      category: "money",
      severity: "high",
      explanation: "This usually means you may not get your money back even if you change your mind."
    },
    {
      id: "third-party-sharing",
      phrase: "third-party sharing",
      variants: ["share with third parties", "shared with third parties", "third party partners", "third parties", "third-party partners"],
      category: "data-sharing",
      severity: "high",
      explanation: "Your information may be passed to outside companies, vendors, or partners."
    },
    {
      id: "sell-personal-information",
      phrase: "sell personal information",
      variants: ["sale of personal information", "sell your data", "selling personal data", "sell personal data"],
      category: "data-sharing",
      severity: "high",
      explanation: "Your personal data may be sold or traded for business value."
    },
    {
      id: "biometric-data",
      phrase: "biometric data",
      variants: ["faceprint", "fingerprint data", "voiceprint", "facial recognition", "retina scan"],
      category: "biometrics",
      severity: "high",
      explanation: "This involves sensitive body-based data such as your face, fingerprint, or voice."
    },
    {
      id: "location-tracking",
      phrase: "location tracking",
      variants: ["track your location", "precise location", "geolocation data", "location data"],
      category: "tracking",
      severity: "high",
      explanation: "This means the service may watch where you are or where you have been."
    },
    {
      id: "retain-data",
      phrase: "retain data",
      variants: ["data retention", "retain your information", "keep your data", "retain personal data", "store your information"],
      category: "privacy",
      severity: "medium",
      explanation: "This means the company may keep your information instead of deleting it quickly."
    },
    {
      id: "collect-personal-data",
      phrase: "collect personal data",
      variants: ["collect your information", "collect personal information", "gather your data", "personal information", "personal data"],
      category: "privacy",
      severity: "medium",
      explanation: "This means the service is gathering information about you.",
      requiresContextAny: ["privacy", "policy", "consent", "data", "information", "cookies", "tracking"]
    },
    {
      id: "cookies",
      phrase: "cookies",
      variants: ["tracking cookies", "cookie policy", "cookie preferences", "cookie settings", "cookie banner"],
      category: "tracking",
      severity: "medium",
      explanation: "Cookies can be used to remember activity and track behavior across visits.",
      requiresContextAny: ["privacy", "consent", "tracking", "policy", "browser", "advertising"]
    },
    {
      id: "privacy-policy",
      phrase: "privacy policy",
      variants: ["privacy notice", "data policy"],
      category: "privacy",
      severity: "medium",
      explanation: "This section explains how the company says it collects, uses, and shares your information."
    },
    {
      id: "share-information",
      phrase: "share information",
      variants: ["share your information", "share personal information", "disclose your information", "disclose personal information"],
      category: "data-sharing",
      severity: "medium",
      explanation: "This means your information may be given to other people or organizations."
    },
    {
      id: "targeted-advertising",
      phrase: "targeted advertising",
      variants: ["personalized advertising", "interest-based advertising", "ad partners", "ad personalization"],
      category: "tracking",
      severity: "medium",
      explanation: "This may mean your activity is used to decide which ads you see."
    },
    {
      id: "consent",
      phrase: "consent",
      variants: ["by clicking accept", "you agree to", "by continuing you agree", "i agree"],
      category: "legal-rights",
      severity: "medium",
      explanation: "This signals that using the service may count as agreeing to its rules or data practices.",
      requiresContextAny: ["terms", "privacy", "policy", "cookies", "agreement", "consent"]
    },
    {
      id: "terminate-account",
      phrase: "terminate your account",
      variants: ["suspend your account", "close your account", "end your access", "disable your account"],
      category: "termination",
      severity: "medium",
      explanation: "This means the company may stop your access under certain conditions."
    },
    {
      id: "marketing-emails",
      phrase: "marketing emails",
      variants: ["promotional emails", "marketing communications", "special offers"],
      category: "privacy",
      severity: "medium",
      explanation: "This may mean they can contact you for advertising, not just for your account."
    },
    {
      id: "cross-device-tracking",
      phrase: "cross-device tracking",
      variants: ["cross-device", "device identifiers", "advertising identifier"],
      category: "tracking",
      severity: "medium",
      explanation: "This may link your activity across your phone, browser, or other devices."
    }
  ];

  globalThis.ConsentLensDictionary = TERMS_DICTIONARY;
})();
