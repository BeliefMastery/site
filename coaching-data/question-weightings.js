// Question Weightings for Coaching System
// Determines how responses are weighted in the final coaching profile

export const QUESTION_WEIGHTINGS = {
  // Obstacle weightings (higher = more significant impact on sovereignty)
  obstacles: {
    past_conditioning: 1.0,
    unmet_needs: 1.0,
    trauma: 1.2,
    unresolved_emotions: 1.0,
    low_self_esteem: 1.0,
    addictions: 1.3,
    toxic_relationships: 1.1,
    guilt_shame: 1.0,
    social_expectations: 0.9,
    health: 1.1,
    debt_financial: 1.2,
    work: 1.0,
    bureaucratic_systems: 0.8,
    technology: 1.0,
    ideology: 0.9
  },
  
  // Domain weightings (higher = more important for satisfaction)
  domains: {
    family: 1.0,
    social_life: 1.0,
    intimate_relationship: 1.2,
    growth_learning_spirituality: 1.1,
    freedom_passions_creativity: 1.1,
    work_life_balance: 1.2,
    mental_health: 1.3,
    physical_health: 1.2,
    emotional_health: 1.1,
    environmental: 0.9
  },
  
  // Aspect weightings within domains (can be customized per domain)
  aspect_default: 1.0,
  
  // Response scale interpretation
  scale: {
    // 0-10 scale where 0 = Not at all / Never, 10 = Completely / Always
    // For obstacles: higher score = greater obstacle
    // For domains: higher score = greater satisfaction
    min: 0,
    max: 10,
    thresholds: {
      low: 3,
      moderate: 5,
      high: 7,
      extreme: 9
    }
  }
};

