// Contradictory validation questions for response consistency checking

export const VALIDATION_PAIRS = [
  {
    primary: "depressed_mood",
    contradictory: "I generally feel optimistic and positive about my future",
    weight: 0.8
  },
  {
    primary: "anhedonia",
    contradictory: "I regularly experience joy and satisfaction in my activities",
    weight: 0.8
  },
  {
    primary: "worry",
    contradictory: "I rarely worry about things beyond my immediate control",
    weight: 0.7
  },
  {
    primary: "elevated_mood",
    contradictory: "My mood has been stable and consistent",
    weight: 0.8
  },
  {
    primary: "panic",
    contradictory: "I rarely experience sudden intense fear or panic",
    weight: 0.7
  }
];

