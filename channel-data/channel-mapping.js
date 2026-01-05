// Channel Mapping - Maps symptoms to channels

export const CHANNEL_MAPPING = {
  // Maps symptom responses to likely channel blockages
  root_sex: {
    symptoms: ['root_symptom_1', 'root_symptom_2', 'sex_symptom_1', 'sex_symptom_2'],
    threshold: 0.6
  },
  root_gut: {
    symptoms: ['root_symptom_1', 'root_symptom_2', 'gut_symptom_1'],
    threshold: 0.6
  },
  root_heart: {
    symptoms: ['root_symptom_1', 'heart_symptom_1', 'heart_symptom_2'],
    threshold: 0.6
  },
  root_throat: {
    symptoms: ['root_symptom_1', 'throat_symptom_1', 'throat_symptom_2'],
    threshold: 0.6
  },
  root_mind: {
    symptoms: ['root_symptom_1', 'mind_symptom_1', 'mind_symptom_2'],
    threshold: 0.6
  },
  root_crown: {
    symptoms: ['root_symptom_1', 'crown_symptom_1', 'crown_symptom_2'],
    threshold: 0.6
  },
  sex_gut: {
    symptoms: ['sex_symptom_1', 'gut_symptom_1'],
    threshold: 0.6
  },
  sex_heart: {
    symptoms: ['sex_symptom_1', 'heart_symptom_1'],
    threshold: 0.6
  },
  sex_throat: {
    symptoms: ['sex_symptom_1', 'sex_symptom_2', 'throat_symptom_1'],
    threshold: 0.6
  },
  sex_mind: {
    symptoms: ['sex_symptom_1', 'sex_symptom_2', 'mind_symptom_2'],
    threshold: 0.6
  },
  gut_heart: {
    symptoms: ['gut_symptom_1', 'heart_symptom_1', 'heart_symptom_2'],
    threshold: 0.6
  },
  heart_throat: {
    symptoms: ['heart_symptom_1', 'throat_symptom_1', 'throat_symptom_2'],
    threshold: 0.6
  },
  throat_mind: {
    symptoms: ['throat_symptom_1', 'throat_symptom_2', 'mind_symptom_1'],
    threshold: 0.6
  },
  mind_crown: {
    symptoms: ['mind_symptom_1', 'mind_symptom_2', 'crown_symptom_1'],
    threshold: 0.6
  }
  // Additional mappings for all 42 channels
};

