import type { PRD, Issue, DevTicket } from '../types'

export const fakeSpotifyRes = {
  "id": "6lfjfixb5qp",
  "user_id": "d33f6eca-337b-4682-b19d-5ef3f26228f5",
  "app_name": "Zomato: Food Delivery & Dining",
  "platform": "android",
  "input_value": "http://play.google.com/store/apps/details?id=com.application.zomato&hl=en_IN",
  "input_mode": "google-play",
  "prd": {
    "appName": "Zomato: Food Delivery & Dining",
    "appId": "com.zomato.android",
    "platform": "android",
    "analysisDate": "2026-03-15",
    "totalReviewsAnalyzed": 150,
    "problemStatement": {
      "summary": "Users are experiencing issues with delayed deliveries, inaccurate offers, and poor customer support.",
      "painPoints": [
        "Delayed deliveries leading to cold food",
        "Inaccurate and outdated offers in certain locations",
        "Poor customer support and unresolved issues",
        "Higher menu prices compared to restaurant prices",
        "Non-functional cash on delivery option"
      ],
      "userQuotes": [
        "the delivery gets really delayed other than that everything is nice the good gets cold before they arrive",
        "Need to update Zomato offers in Navi Mumbai restaurants and hotels all back dated and wrong information",
        "Zomato taking its customer for granted. while placing the order they will show some time and once the order is placed then they come to know that there is high demand and they double the delivery time",
        "I ordered food on Sunday my money has been debited but they cancelled my order",
        "why cod option is not working"
      ]
    },
    "successMetrics": [
      "Reduce average delivery time by 20%",
      "Increase accuracy of offers by 30%",
      "Improve customer support satisfaction score by 25%",
      "Decrease the number of complaints related to pricing discrepancies by 15%"
    ],
    "userStories": [
      {
        "as": "a user",
        "iWant": "my food to be delivered on time",
        "soThat": "I can enjoy it while it's still hot"
      },
      {
        "as": "a user",
        "iWant": "accurate offers and discounts",
        "soThat": "I can make informed decisions about where to dine"
      },
      {
        "as": "a user",
        "iWant": "reliable customer support",
        "soThat": "my issues can be resolved promptly"
      },
      {
        "as": "a user",
        "iWant": "the cash on delivery option to work correctly",
        "soThat": "I can pay for my order upon delivery"
      }
    ],
    "requirements": {
      "functional": [
        "Implement a real-time delivery tracking system to reduce delays",
        "Update the offers database regularly to ensure accuracy",
        "Enhance the customer support system with faster response times",
        "Fix the cash on delivery functionality"
      ],
      "nonFunctional": [
        "Ensure the app remains responsive under high demand",
        "Maintain data accuracy for offers and pricing",
        "Provide a seamless user experience across all devices"
      ]
    },
    "edgeCases": [
      "Handling high demand periods without affecting delivery times",
      "Ensuring offer updates do not disrupt the user experience"
    ],
    "outOfScope": [
      "Redesigning the entire user interface",
      "Expanding delivery areas beyond current operational zones"
    ],
    "estimatedEffort": "6 months",
    "priority": "high",
    "confidence": "We have high confidence in addressing these issues based on user feedback and technical feasibility."
  },
  "issues": [
    {
      "id": "1",
      "title": "Delayed Deliveries Leading to Cold Food",
      "description": "Deliveries are often delayed, resulting in cold food upon arrival.",
      "severity": "critical",
      "affectedUsers": 5000,
      "userQuotes": [
        "the delivery gets really delayed other than that everything is nice the good gets cold before they arrive"
      ],
      "suggestedFix": "Implement a real-time delivery tracking system to reduce delays.",
      "estimatedEffort": "high",
      "category": "Performance",
      "status": "open",
      "pmNotes": "",
      "priority": 1
    },
    {
      "id": "2",
      "title": "Inaccurate and Outdated Offers",
      "description": "Offers in certain locations are inaccurate and outdated, leading to customer dissatisfaction.",
      "severity": "high",
      "affectedUsers": 3000,
      "userQuotes": [
        "Need to update Zomato offers in Navi Mumbai restaurants and hotels all back dated and wrong information"
      ],
      "suggestedFix": "Update the offers database regularly to ensure accuracy.",
      "estimatedEffort": "medium",
      "category": "Content",
      "status": "open",
      "pmNotes": "",
      "priority": 2
    },
    {
      "id": "3",
      "title": "Poor Customer Support and Unresolved Issues",
      "description": "Customer support is slow and issues remain unresolved, leading to frustration.",
      "severity": "high",
      "affectedUsers": 4000,
      "userQuotes": [
        "Zomato taking its customer for granted."
      ],
      "suggestedFix": "Enhance the customer support system with faster response times.",
      "estimatedEffort": "high",
      "category": "Reliability",
      "status": "open",
      "pmNotes": "",
      "priority": 3
    },
    {
      "id": "4",
      "title": "Non-functional Cash on Delivery Option",
      "description": "The cash on delivery option is not working, affecting payment flexibility.",
      "severity": "medium",
      "affectedUsers": 2000,
      "userQuotes": [
        "why cod option is not working"
      ],
      "suggestedFix": "Fix the cash on delivery functionality.",
      "estimatedEffort": "medium",
      "category": "Features",
      "status": "open",
      "pmNotes": "",
      "priority": 4
    },
    {
      "id": "5",
      "title": "Higher Menu Prices Compared to Restaurant Prices",
      "description": "Menu prices on the app are higher than the actual restaurant prices, leading to customer dissatisfaction.",
      "severity": "medium",
      "affectedUsers": 2500,
      "userQuotes": [],
      "suggestedFix": "Review and adjust menu pricing to align with restaurant prices.",
      "estimatedEffort": "medium",
      "category": "Pricing",
      "status": "open",
      "pmNotes": "",
      "priority": 5
    }
  ],
  "ticket_cache": {},
  "analyzed_at": "2026-03-15T18:01:21.999Z"
} as any

export const fakeBumbleRes = {
  "id": "a529qv2nrbf",
  "user_id": "d33f6eca-337b-4682-b19d-5ef3f26228f5",
  "app_name": "Bumble Dating App: Meet & Date",
  "platform": "android",
  "input_value": "https://play.google.com/store/apps/details?id=com.bumble.app&hl=en",
  "input_mode": "google-play",
  "prd": {
    "appName": "Bumble Dating App: Meet & Date",
    "appId": "com.bumble.app",
    "platform": "android",
    "analysisDate": "2026-03-15",
    "totalReviewsAnalyzed": 150,
    "problemStatement": {
      "summary": "Users are experiencing critical authentication failures (SMS verification), aggressive and misleading monetization tactics that erode trust, and algorithm opacity that hides potential matches. The app suffers from technical instability on mid-tier devices, proliferation of fake/scam profiles, and a free tier that feels intentionally crippled, resulting in high user frustration and churn.",
      "painPoints": [
        "Critical authentication failures: SMS verification codes not delivered, login loops, and tedious verification processes blocking access",
        "Misleading monetization: Hidden 'likes' revealed only after subscription purchase, algorithm appearing to suppress matches until payment",
        "Discovery algorithm opacity: Users report likes existing within filters but not being shown in swipe queue, distance filtering unavailable or broken",
        "Fake profile proliferation: Photo-verified fake accounts, scammers, and Instagram self-promoters degrading community trust",
        "Technical performance issues: App freezing during onboarding, slow loading on 2-year-old devices, video playback failures",
        "Poor customer support: Unexplained account bans, lack of transparency in moderation decisions, no remediation for billing issues",
        "Notification failures: Missing match notifications causing 24-hour expiration of connections",
        "Restrictive free tier: Severe limitations making app non-functional without payment, yet payment required to evaluate value"
      ],
      "userQuotes": [
        "The App doesn't allow us to log in with the phone number, don't know it's an error, asks for code and when we enter the code, log in doesn't happen",
        "you have no people left to view in your selected distance, then as soon as your subscription ends, you see xyz number of people have liked you",
        "I have 14 likes that are simply not being shown to me. I know that they are within my filters because when I change my filters the like number changes",
        "absolute total garbage app. soooooo many fake spam bot accounts. purchases are non refundable",
        "I could not even finish creating a profile. It performs terribly, my phone is 2 years old, but the app takes forever to launch"
      ]
    },
    "successMetrics": [
      "SMS verification success rate > 99% with < 30 second delivery time",
      "Authentication flow completion rate > 95% (current appears significantly lower based on volume of complaints)",
      "Fake profile removal time < 24 hours from report submission",
      "Free user engagement: At least 1 'like' reveal per day to free users to demonstrate value",
      "App cold start time < 3 seconds on Android devices up to 3 years old",
      "Customer support first response time < 4 hours for critical access issues"
    ],
    "userStories": [
      {
        "as": "new user",
        "iWant": "to complete phone number authentication without technical errors or missing verification codes",
        "soThat": "I can access the app and create my profile without frustration"
      },
      {
        "as": "free tier user",
        "iWant": "to see at least one profile who liked me daily without payment",
        "soThat": "I can evaluate the app's value before committing to a subscription"
      },
      {
        "as": "subscriber",
        "iWant": "the algorithm to show me all potential matches within my set distance and filter criteria",
        "soThat": "I don't feel deceived by hidden likes or suppressed visibility"
      },
      {
        "as": "active user",
        "iWant": "reliable push notifications for matches and messages",
        "soThat": "I don't miss 24-hour connection windows due to technical delays"
      },
      {
        "as": "community member",
        "iWant": "to report fake profiles and receive confirmation of action taken",
        "soThat": "I can trust that the platform is actively moderating bad actors"
      },
      {
        "as": "wrongfully banned user",
        "iWant": "a transparent appeal process with specific reasons for bans and human review",
        "soThat": "I can recover my account if banned by error or false reports"
      }
    ],
    "requirements": {
      "functional": [
        "Implement robust SMS authentication with fallback methods (voice call, email linkage) and retry logic for code delivery failures",
        "Add 'Distance Filter' controls in discovery settings allowing users to set minimum and maximum radius",
        "Provide at least one free 'Who Liked You' profile reveal per day to free users to demonstrate algorithm value",
        "Fix notification reliability for match creation, message receipt, and expiration warnings with delivery confirmation",
        "Implement enhanced fake profile detection using image recognition (reverse search) and behavioral analysis, with user-facing report status updates",
        "Create account ban appeal workflow with human review, specific violation citations, and evidence submission capability",
        "Add 'Not Interested' feedback option to improve algorithm matching without requiring payment",
        "Implement session management fixes to prevent login to recycled phone number accounts"
      ],
      "nonFunctional": [
        "App cold start time must be under 3 seconds on Android devices up to 2 years old; onboarding flow must not freeze on mid-tier devices",
        "Authentication service uptime 99.9% with automatic failover for SMS gateway providers",
        "WCAG 2.1 AA accessibility compliance for all authentication and core discovery flows",
        "Support for Android API levels covering devices up to 5 years old (not just latest flagship)",
        "End-to-end encryption for verification codes and authentication tokens"
      ]
    },
    "edgeCases": [
      "Phone number recycled from previous user: Must verify current ownership and offer account data separation/reset options",
      "Verification code delivery failure in low-network or international regions: Must provide alternative authentication methods",
      "User banned due to mass false reports: Appeal process must handle malicious reporting patterns and restore wrongly banned accounts",
      "Payment processed but subscription not activated: Automatic reconciliation and grace period access",
      "Match expires due to notification delay: Grace period extension or automatic rematch request for technical failures"
    ],
    "outOfScope": [
      "Complete UI/UX redesign - focus is on fixing broken flows, not aesthetic changes",
      "iOS platform parity fixes - this PRD addresses Android-specific issues only",
      "New matching algorithms or AI features - scope is fixing existing algorithm transparency, not replacing it",
      "International expansion or localization beyond fixing existing translation issues"
    ],
    "estimatedEffort": "4-6 weeks",
    "priority": "critical",
    "confidence": "90%"
  },
  "issues": [
    {
      "id": "issue-1",
      "title": "SMS verification delivery failures",
      "description": "Users experience complete account access blockage due to SMS verification codes not being delivered, resulting in infinite login loops. Phone number recycling causes security issues where users log into previous owners' accounts.",
      "severity": "critical",
      "affectedUsers": 40,
      "userQuotes": [
        "The App doesn't allow us to log in with the phone number, don't know it's an error, asks for code and when we enter the code, log in doesn't happen"
      ],
      "suggestedFix": "Implement robust SMS authentication with voice call fallback, email linkage, and retry logic while fixing session management for recycled phone numbers.",
      "estimatedEffort": "2 weeks",
      "category": "Reliability",
      "status": "open",
      "pmNotes": "",
      "priority": 1
    },
    {
      "id": "issue-2",
      "title": "Onboarding flow freezing and crashes",
      "description": "App freezes during profile creation onboarding, preventing new users from completing registration. Performance degradation on 2-year-old Android devices causes excessive launch times and UI unresponsiveness.",
      "severity": "critical",
      "affectedUsers": 25,
      "userQuotes": [
        "I could not even finish creating a profile. It performs terribly, my phone is 2 years old, but the app takes forever to launch"
      ],
      "suggestedFix": "Optimize onboarding memory usage, implement progressive asset loading, and reduce startup initialization time for older devices.",
      "estimatedEffort": "1 week",
      "category": "Performance",
      "status": "open",
      "pmNotes": "",
      "priority": 2
    },
    {
      "id": "issue-3",
      "title": "Discovery algorithm opacity",
      "description": "Users report existing likes within their set filters that are not displayed in the swipe queue, creating suspicion of algorithmic suppression. Distance filtering controls are either unavailable or malfunctioning, preventing proper match radius configuration.",
      "severity": "high",
      "affectedUsers": 35,
      "userQuotes": [
        "I have 14 likes that are simply not being shown to me. I know that they are within my filters because when I change my filters the like number changes"
      ],
      "suggestedFix": "Fix discovery algorithm to properly surface all matches within user-defined filters and implement functional minimum/maximum distance radius controls.",
      "estimatedEffort": "1-2 weeks",
      "category": "Features",
      "status": "open",
      "pmNotes": "",
      "priority": 3
    },
    {
      "id": "issue-4",
      "title": "Subscription gating of hidden likes",
      "description": "The app conceals the existence of likes until subscription purchase, then reveals them immediately upon cancellation, suggesting algorithmic manipulation. This creates user distrust and perceived bait-and-switch tactics regarding the free tier value proposition.",
      "severity": "high",
      "affectedUsers": 30,
      "userQuotes": [
        "you have no people left to view in your selected distance, then as soon as your subscription ends, you see xyz number of people have liked you"
      ],
      "suggestedFix": "Provide at least one free 'Who Liked You' profile reveal daily to demonstrate algorithm value without requiring payment upfront.",
      "estimatedEffort": "3-5 days",
      "category": "Pricing",
      "status": "open",
      "pmNotes": "",
      "priority": 4
    },
    {
      "id": "issue-5",
      "title": "Bot account and scammer proliferation",
      "description": "Photo-verified fake accounts, scammers, and Instagram self-promoters are degrading community trust and safety. Users encounter bot accounts despite verification systems, with no effective reporting feedback loop.",
      "severity": "high",
      "affectedUsers": 20,
      "userQuotes": [
        "absolute total garbage app. soooooo many fake spam bot accounts. purchases are non refundable"
      ],
      "suggestedFix": "Implement enhanced fake profile detection using reverse image search and behavioral analysis, with user-facing report status updates.",
      "estimatedEffort": "2 weeks",
      "category": "Content",
      "status": "open",
      "pmNotes": "",
      "priority": 5
    }
  ],
  "ticket_cache": {},
  "analyzed_at": "2026-03-15T15:12:55.700Z"
} as any