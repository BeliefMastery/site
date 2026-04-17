# Android Platform Scope (Optional v2.0+)

This document captures the decision boundary for Android packaging, monetization, and build-pipeline expansion.

## Current state

- BeliefMastery ships as a static web app.
- No in-repo Capacitor project or Android sync pipeline is currently active.
- No in-repo entitlement or billing integration is currently active.

## Decision gates

Proceed with Android platform implementation only when all gates are approved:

1. **Product gate**: Android distribution is an explicit release target.
2. **Monetization gate**: a premium model and entitlement policy is finalized.
3. **Maintenance gate**: ownership is assigned for Android build/plugin upgrades.

## Planned implementation sequence

1. Add Capacitor scaffolding and `cap:sync` command integration.
2. Add `scripts/copy-to-www.js` and `npm run copy:www` for controlled web asset transfer.
3. Add `shared/premium-entitlement.js` abstraction and paywall UI contract.
4. Add Android IAP provider wiring and restore-purchase flow.
5. Add release checklist for web parity and Android regression verification.

## Out of scope until gates pass

- Shipping Play Billing plugins.
- Marking any tool as Android-premium gated.
- Maintaining vendor ESM shims for Android WebView.
