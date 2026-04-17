(() => {
const TERMS_DICTIONARY = [
  {
    id: "binding-arbitration",
    phrase: "binding arbitration",
    variants: ["arbitration", "mandatory arbitration"],
    category: "legal-rights",
    severity: "high",
    explanation: "This can limit your ability to take a dispute to court."
  },
  {
    id: "class-action-waiver",
    phrase: "class action waiver",
    variants: ["waiver of class actions", "waive class action rights"],
    category: "legal-rights",
    severity: "high",
    explanation: "This can stop you from joining a group lawsuit with other people."
  },
  {
    id: "automatic-renewal",
    phrase: "automatic renewal",
    variants: ["auto-renewal", "renews automatically", "automatically renew"],
    category: "money",
    severity: "high",
    explanation: "This may renew a paid service unless you cancel it in time."
  },
  {
    id: "non-refundable",
    phrase: "non-refundable",
    variants: ["no refunds", "not refundable"],
    category: "money",
    severity: "high",
    explanation: "This usually means you may not get your money back."
  },
  {
    id: "third-party-sharing",
    phrase: "third-party sharing",
    variants: ["share with third parties", "shared with third parties", "third party partners", "third parties", "third-party partners"],
    category: "data-sharing",
    severity: "high",
    explanation: "Your information may be sent to outside companies or partners."
  },
  {
    id: "sell-personal-information",
    phrase: "sell personal information",
    variants: ["sale of personal information", "sell your data", "selling personal data"],
    category: "data-sharing",
    severity: "high",
    explanation: "Your personal data may be sold or transferred for business use."
  },
  {
    id: "biometric-data",
    phrase: "biometric data",
    variants: ["faceprint", "fingerprint data", "voiceprint", "facial recognition"],
    category: "biometrics",
    severity: "high",
    explanation: "This involves sensitive body-based data like your face, fingerprint, or voice."
  },
  {
    id: "location-tracking",
    phrase: "location tracking",
    variants: ["track your location", "precise location", "geolocation data"],
    category: "tracking",
    severity: "high",
    explanation: "This means the service may monitor where you are."
  },
  {
    id: "retain-data",
    phrase: "retain data",
    variants: ["data retention", "retain your information", "keep your data", "retain personal data", "store your information"],
    category: "privacy",
    severity: "medium",
    explanation: "This means the company may keep your information for a period of time."
  },
  {
    id: "collect-personal-data",
    phrase: "collect personal data",
    variants: ["collect your information", "collect personal information", "gather your data", "personal information", "personal data"],
    category: "privacy",
    severity: "medium",
    explanation: "This means the service is gathering information about you."
  },
  {
    id: "cookies",
    phrase: "cookies",
    variants: ["tracking cookies", "cookie policy", "cookie preferences", "cookie settings"],
    category: "tracking",
    severity: "medium",
    explanation: "Cookies can be used to remember activity and track behavior across visits."
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
    variants: ["share your information", "share personal information", "disclose your information"],
    category: "data-sharing",
    severity: "medium",
    explanation: "This means your information may be passed to other people or organizations."
  },
  {
    id: "targeted-advertising",
    phrase: "targeted advertising",
    variants: ["personalized advertising", "interest-based advertising", "ad partners"],
    category: "tracking",
    severity: "medium",
    explanation: "This may mean your activity is used to show you ads based on your behavior."
  },
  {
    id: "consent",
    phrase: "consent",
    variants: ["by clicking accept", "you agree to", "by continuing you agree"],
    category: "legal-rights",
    severity: "medium",
    explanation: "This signals that using the service may count as agreeing to its terms."
  },
  {
    id: "terminate-account",
    phrase: "terminate your account",
    variants: ["suspend your account", "close your account", "end your access"],
    category: "termination",
    severity: "medium",
    explanation: "This means the company may stop your access under certain conditions."
  }
];

globalThis.ConsentLensDictionary = TERMS_DICTIONARY;
})();
