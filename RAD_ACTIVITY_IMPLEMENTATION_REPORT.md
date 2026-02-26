# Rad Activity Feature — Implementation Report

**Date:** February 2025  
**Scope:** Attraction assessment — male Axis of Attraction, Rad Activity subcategory  
**Files:** `attraction-data.js`, `attraction-engine.js` (apps and root)

---

## 1. Overview

The Rad Activity feature assesses a male respondent’s external focus outside romantic relationships. It measures whether he has an interest that signals direction and that a partner might “compete with”—as opposed to consumption, escape, or passive pastimes that weaken attraction.

---

## 2. Conceptual Model

### 2.1 Activity Spectrum

Activities are placed on a spectrum from **anti-rad** to **high-rad**:

| Band | Signal | Examples (conceptual; not listed to respondent) |
|------|--------|-------------------------------------------------|
| Anti-rad | Consumption, escape, no direction | Substances, porn, video games, TV |
| Low-rad | Light commitment, no larger purpose | Badminton, casual hobbies, **gym-for-aesthetics** |
| Rad | Risk, skill, mastery, real commitment | Snowboarding, kitesurfing, martial arts |
| High-rad | Building, mission, extends beyond self | Career mission, build a house, be the best counselor |

### 2.2 Gym / Vanity Nuance

Gym/fitness is treated as **low-rad**: regular effort and aesthetic perks, but often without a broader mission. It sits with “regular activities or hobbies… not part of a larger purpose” to reflect that vanity fitness is better than consumption but weaker than purposeful rad activity.

### 2.3 Mission Breadth

“Mission” is broad: “be the best counselor,” “build a house in the woods,” “be a hunter.” What matters is commitment, direction, and output that extends beyond the self—not specific categories.

---

## 3. Self-Report Design Choices

### 3.1 Behavioral Descriptors (Not Category Lists)

Options describe **behaviour** instead of listing activity categories. This:

- Reduces social desirability (no obvious “right” answer).
- Covers many activities without an exhaustive list.
- Lets respondents self-map to behavioural patterns.

**Before (exhaustive):**  
“Porn, substance use, or escape — significant part of my life”  
“Casual low-intensity (badminton, gardening, light hobbies)”

**After (behavioural):**  
“I spend significant time on escape, substances, or content consumption with nothing to show for it”  
“I have regular activities or hobbies—fitness, light pastimes—but they’re not part of a larger purpose”

### 3.2 Shuffled Response Order

- Rad questions use `shuffleOptions: true`.
- The engine randomises option order per question and per respondent.
- Score mapping is based on stored option values, not display position.
- Respondents cannot infer “best” or “worst” from position alone.

**Implementation:** Fisher–Yates shuffle on `(value, label)` pairs before rendering.

---

## 4. Question Structure

### 4.1 Four Questions, Weighted

| ID   | Weight | Focus |
|------|--------|-------|
| rad_1 | 40% | Activity type (spectrum) |
| rad_2 | 30% | Consumption vs creation |
| rad_3 | 20% | Competition (does she compete?) |
| rad_4 | 10% | Visibility (others see ambition?) |

### 4.2 Rationale for Weights

- **Activity type (40%):** Primary signal of direction.
- **Consumption vs creation (30%):** Watching/playing vs building/mastery.
- **Competition (20%):** Scarcity and “something to compete with.”
- **Visibility (10%):** Social proof; secondary to behaviour.

---

## 5. Scoring Logic

### 5.1 Weighted Normalisation

1. Each response is normalised to [0, 1] via `(v - 1) / 9` (1–10 scale).
2. Weighted sum: `0.40*n1 + 0.30*n2 + 0.20*n3 + 0.10*n4`.
3. Result mapped to 1–10, then passed to the percentile sigmoid.

### 5.2 Anti-Rad Floor

- If `rad_1 ≤ 2` (escape/substances or passive consumption), percentile is capped at 25.
- Ensures consumption/escape cannot be offset by high scores on other questions.

---

## 6. Technical Implementation

### 6.1 Data (`attraction-data.js`)

- `MALE_RAD_ACTIVITY_QUESTIONS`: 4 questions with `shuffleOptions: true`.
- `OPTS_6`: 6-point scale for rad_1 (1, 2, 4, 6, 8, 10).
- `RAD_ACTIVITY_TYPE_MODIFIER`: `ANTI_RAD_FLOOR: 25`, `ANTI_RAD_THRESHOLD: 2`.

### 6.2 Engine (`attraction-engine.js`)

- `shuffleArray(arr)`: Fisher–Yates shuffle.
- `showPhaseQuestions()`: For questions with `shuffleOptions`, shuffles `(value, label)` pairs before render.
- `calculateRadActivityScore()`: Weighted scoring and anti-rad floor; overrides default subcategory scoring for male radActivity.

### 6.3 Sync

Both `apps/red-pill-relationships/` and root implementations are kept in sync.

---

## 7. Files Touched

| File | Changes |
|------|---------|
| `apps/red-pill-relationships/attraction-data.js` | Rad questions, behavioural labels, `shuffleOptions`, gym nuance |
| `apps/red-pill-relationships/attraction-engine.js` | `shuffleArray`, option shuffle in render, `calculateRadActivityScore` |
| `attraction-data.js` | Mirrors apps data |
| `attraction-engine.js` | Mirrors apps engine |
| `apps/red-pill-relationships/attraction.html` | Rad Activity theory text (earlier pass) |

---

## 8. Future Considerations

- **Fishing:** Left as a borderline case; behavioural phrasing lets respondents place it via consumption vs creation and commitment level.
- **Other question sets:** `shuffleOptions` is reusable for any question where order could bias answers.
- **Mission definitions:** “Mission” is intentionally broad; wording invites diverse interpretations (counselor, house, hunter) without listing them.
