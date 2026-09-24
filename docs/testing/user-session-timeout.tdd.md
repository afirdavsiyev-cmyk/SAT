# TDD Evidence Report: User Session Timeout & Inactivity Management

**Feature**: User Session Timeout with Proactive Warning & Cross-Tab Synchronization  
**Workflow**: ECC Test-Driven Development (TDD) Workflow  
**Date**: 2026-09-24  
**Coverage Achieved**: **96.05% Statements**, **85.95% Branches**, **94.44% Functions**, **96.01% Lines** (Target: ≥80%)

---

## 1. Source Plan & Objectives

- **Goal**: Implement secure user session timeouts for inactivity with countdown warning, cross-tab synchronization, activity throttling, and automatic authentication state invalidation.
- **Workflow Principle**: Tests written before implementation code; verified strict RED state before implementing code to reach GREEN state.

---

## 2. User Journeys

1. **Journey 1: Idle Inactivity Detection & Invalidation**  
   *As an authenticated user, when I remain idle on the application for the configured session timeout period, the system logs me out automatically and invalidates my active session to protect account data.*
2. **Journey 2: Session Expiration Warning & Countdown**  
   *As an authenticated user approaching timeout, I want to receive a visible warning modal with an accurate countdown when the warning threshold is reached, avoiding abrupt or unannounced logouts.*
3. **Journey 3: Session Extension & Keep-Alive**  
   *As an authenticated user viewing the expiration warning, I want to click "Stay Signed In", so my session timer resets back to full duration and the warning modal is dismissed.*
4. **Journey 4: Activity Throttling & Cross-Tab Activity Synchronization**  
   *As a multi-tab user, when I interact (keystroke, mouse movement, click) in Tab A, Tab B's session timer refreshes via storage synchronization, with rapid mouse events throttled to prevent storage thrashing.*
5. **Journey 5: Clean Teardown & Post-Expiry Notification**  
   *As an inactive user who timed out, I want session tokens cleaned up, auth state reset to unauthenticated, and a clear message displayed with an option to sign in again.*

---

## 3. TDD Task & Evidence Report

### Stage 1: RED Gate Verification
- **Test Target**: `src/services/sessionTimeout.test.ts`, `src/hooks/useSessionTimeout.test.ts`, `src/components/auth/SessionTimeoutModal.test.tsx`
- **Validation Command**: `npm test`
- **RED Evidence Excerpt**:
  ```text
  FAIL src/services/sessionTimeout.test.ts
  Error: Cannot find module './sessionTimeout' imported from src/services/sessionTimeout.test.ts

  FAIL src/hooks/useSessionTimeout.test.ts
  Error: Failed to resolve import "./useSessionTimeout" from "src/hooks/useSessionTimeout.test.ts". Does the file exist?

  FAIL src/components/auth/SessionTimeoutModal.test.tsx
  Error: Failed to resolve import "./SessionTimeoutModal" from "src/components/auth/SessionTimeoutModal.test.tsx". Does the file exist?
  ```
- **Confirmation**: All unit tests failed initially due strictly to missing implementation modules.

### Stage 2: Minimal Implementation & GREEN Gate Verification
- **Implemented Files**:
  - `src/services/sessionTimeout.ts`: Core `SessionTimeoutManager` engine.
  - `src/hooks/useSessionTimeout.ts`: React hook binding user activity DOM events and state.
  - `src/components/auth/SessionTimeoutModal.tsx`: Accessible dialog component for warning & expiration.
  - `src/App.tsx`: Contextual integration with `useAuth()` and app view hierarchy.
- **Validation Command**: `npm test`
- **GREEN Evidence Excerpt**:
  ```text
   ✓ src/services/sessionTimeout.test.ts (21 tests) 42ms
   ✓ src/hooks/useSessionTimeout.test.ts (8 tests) 81ms
   ✓ src/components/auth/SessionTimeoutModal.test.tsx (5 tests) 405ms

   Test Files  3 passed (3)
        Tests  34 passed (34)
     Duration  3.32s
  ```

### Stage 3: Type Checking Verification
- **Validation Command**: `npx tsc --noEmit`
- **Result**: Exit code 0 (clean build with strict typing).

---

## 4. Test Specification & Guarantees

| # | What is guaranteed | Test Target | Test Type | Result | Evidence |
|---|--------------------|-------------|-----------|--------|----------|
| 1 | Defaults to 15m timeout and 2m warning | `src/services/sessionTimeout.test.ts` | unit | PASS | `npm test` |
| 2 | Accepts custom timeouts and thresholds | `src/services/sessionTimeout.test.ts` | unit | PASS | `npm test` |
| 3 | Restores valid stored timestamp | `src/services/sessionTimeout.test.ts` | unit | PASS | `npm test` |
| 4 | Resets corrupted/invalid storage timestamps | `src/services/sessionTimeout.test.ts` | unit | PASS | `npm test` |
| 5 | Calculates remaining milliseconds accurately | `src/services/sessionTimeout.test.ts` | unit | PASS | `npm test` |
| 6 | Clamps remaining time to 0 when expired | `src/services/sessionTimeout.test.ts` | unit | PASS | `npm test` |
| 7 | Computes warning time countdown accurately | `src/services/sessionTimeout.test.ts` | unit | PASS | `npm test` |
| 8 | Throttles high-frequency activity updates (1000ms window) | `src/services/sessionTimeout.test.ts` | unit | PASS | `npm test` |
| 9 | Invokes `onActivity` callback on activity | `src/services/sessionTimeout.test.ts` | unit | PASS | `npm test` |
| 10 | Transitions to warning & triggers `onWarning` | `src/services/sessionTimeout.test.ts` | unit | PASS | `npm test` |
| 11 | Transitions to expired & triggers `onTimeout` exactly once | `src/services/sessionTimeout.test.ts` | unit | PASS | `npm test` |
| 12 | `extendSession()` returns status from warning to active | `src/services/sessionTimeout.test.ts` | unit | PASS | `npm test` |
| 13 | Periodic heartbeat advances state automatically | `src/services/sessionTimeout.test.ts` | unit | PASS | `npm test` |
| 14 | Cross-tab synchronization via `storage` event | `src/services/sessionTimeout.test.ts` | unit | PASS | `npm test` |
| 15 | Ignores unrelated storage keys or null changes | `src/services/sessionTimeout.test.ts` | unit | PASS | `npm test` |
| 16 | Cleans up timers and memory on `stop()` | `src/services/sessionTimeout.test.ts` | unit | PASS | `npm test` |
| 17 | Handles sudden clock jumps (OS sleep/wake) safely | `src/services/sessionTimeout.test.ts` | unit | PASS | `npm test` |
| 18 | `useSessionTimeout` stays idle when disabled | `src/hooks/useSessionTimeout.test.ts` | unit/hook | PASS | `npm test` |
| 19 | `useSessionTimeout` attaches DOM event listeners on enable | `src/hooks/useSessionTimeout.test.ts` | unit/hook | PASS | `npm test` |
| 20 | User activity events reset hook timer | `src/hooks/useSessionTimeout.test.ts` | unit/hook | PASS | `npm test` |
| 21 | Warning modal state flags activate at threshold | `src/hooks/useSessionTimeout.test.ts` | unit/hook | PASS | `npm test` |
| 22 | `extendSession()` clears warning state | `src/hooks/useSessionTimeout.test.ts` | unit/hook | PASS | `npm test` |
| 23 | Immediate logout supported via `logoutNow()` | `src/hooks/useSessionTimeout.test.ts` | unit/hook | PASS | `npm test` |
| 24 | Hook unmount cleans up all listeners and intervals | `src/hooks/useSessionTimeout.test.ts` | unit/hook | PASS | `npm test` |
| 25 | Modal renders countdown formatted in `MM:SS` | `src/components/auth/SessionTimeoutModal.test.tsx` | unit/UI | PASS | `npm test` |
| 26 | Modal "Stay Signed In" button calls extend | `src/components/auth/SessionTimeoutModal.test.tsx` | unit/UI | PASS | `npm test` |
| 27 | Modal "Sign Out" button calls logout | `src/components/auth/SessionTimeoutModal.test.tsx` | unit/UI | PASS | `npm test` |
| 28 | Modal renders expired state and "Sign In Again" | `src/components/auth/SessionTimeoutModal.test.tsx` | unit/UI | PASS | `npm test` |

---

## 5. Coverage Report Summary

**Command**: `npm run test:coverage`

```
 % Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   96.05 |    85.95 |   94.44 |   96.01 |                   
 components/auth   |     100 |    70.58 |     100 |     100 |                   
  ...eoutModal.tsx |     100 |    70.58 |     100 |     100 | 63-124            
 hooks             |   96.55 |    90.47 |   88.88 |   96.51 |                   
  ...ionTimeout.ts |   96.55 |    90.47 |   88.88 |   96.51 | 196-197,222       
 services          |   95.23 |    87.95 |     100 |   95.19 |                   
  ...ionTimeout.ts |   95.23 |    87.95 |     100 |   95.19 | ...97,244,256,283 
-------------------|---------|----------|---------|---------|-------------------
```

**Outcome**: Exceeds the 80% coverage mandate across statements (96.05%), branches (85.95%), functions (94.44%), and lines (96.01%).
