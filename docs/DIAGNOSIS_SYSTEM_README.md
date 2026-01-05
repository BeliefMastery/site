# Diagnosis System - Comprehensive DSM-5 Self-Reporting Assessment Tool

## Overview

The Diagnosis System is an advanced, educational self-reporting questionnaire tool that navigates the DSM-5 (Diagnostic and Statistical Manual of Mental Disorders, 5th Edition) to help users explore potential diagnostic categories through structured assessment. This system is designed for informational and educational purposes, providing a comprehensive framework for understanding mental health conditions.

## Key Features

### Comprehensive Diagnostic Coverage
- **13+ Major Diagnostic Categories** covering 100+ disorders
- **Mood Disorders**: Major Depression, Bipolar I/II, Persistent Depressive Disorder, PMDD, and more
- **Anxiety Disorders**: GAD, Panic Disorder, Social Anxiety, Agoraphobia, Specific Phobias
- **Trauma Disorders**: PTSD, Acute Stress Disorder, Adjustment Disorders
- **Personality Disorders**: All 13 personality disorders across Clusters A, B, and C
- **OCD & Related Disorders**: OCD, Body Dysmorphic Disorder, Hoarding, Trichotillomania
- **Eating Disorders**: Anorexia, Bulimia, Binge-Eating Disorder
- **Substance-Related Disorders**: Substance Use Disorders and Gambling Disorder
- **Sleep Disorders**: Insomnia, Hypersomnolence, Narcolepsy
- **Dissociative Disorders**: DID, Dissociative Amnesia, Depersonalization/Derealization
- **Somatic Disorders**: Somatic Symptom Disorder, Conversion Disorder, and related conditions
- **Sexual Dysfunctions**: Multiple categories of sexual function disorders
- **Psychotic Disorders**: Schizophrenia, Schizoaffective Disorder, and related conditions
- **Neurocognitive & Neurodevelopmental Disorders**: Cognitive decline, Autism Spectrum, ADHD

### Advanced Assessment Features

#### 1. Category Selection Guide ("Start Here" Feature)
- **Intelligent Questionnaire**: Brief screening questions to identify relevant diagnostic categories
- **Personalized Suggestions**: System suggests categories based on user responses
- **Educational Tool**: Helps users understand which areas may be most relevant to their concerns
- **Flexible Selection**: Users can choose suggested categories or select any categories they prefer

#### 2. Multi-Stage Assessment Process
- **Dynamic Question Generation**: Questions generated based on selected categories
- **Likert Scale Inputs**: 0-10 numerical scales for precise symptom assessment
- **Validation Questions**: Contradictory questions to check response consistency
- **Progress Tracking**: Visual progress bar showing assessment completion

#### 3. Comorbidity Detection & Multi-Branching
- **Automatic Detection**: System identifies when multiple disorders may be present
- **Comorbidity Groups**: Recognizes common co-occurring conditions (e.g., Mood-Anxiety, Trauma-Mood-Anxiety)
- **Refined Questioning**: Offers additional detailed questions when comorbidity is detected
- **Differential Diagnosis Support**: Helps differentiate between similar conditions

#### 4. Refined Assessment Questions
- **Detailed Symptom Clarification**: Additional questions for major disorders to refine diagnoses
- **Differential Diagnosis**: Questions designed to distinguish between similar conditions
- **Severity Assessment**: Detailed inquiry into functional impact and symptom severity
- **Comprehensive Coverage**: Expanded questions for MDD, Bipolar, GAD, PTSD, Borderline PD, OCD, and more

#### 5. Comprehensive Results & Treatment Information
- **Probability Scoring**: Statistical probability scores for each disorder
- **Primary & Secondary Diagnoses**: Identifies most likely primary diagnosis and secondary considerations
- **Treatment Database**: Comprehensive treatment information including:
  - Behavioral interventions
  - Dietary considerations
  - Pharmacological options
  - Alternative health approaches
  - Western medicine treatments
  - Eastern medicine perspectives
  - Biophysical theories
  - Metaphysical perspectives
  - Biochemical factors
  - Mythopoetical frameworks
  - Management strategies
  - Potential causes
  - Environmental factors

#### 6. Data Export & Analysis
- **Export Functionality**: Users can export their assessment data as JSON
- **Session Persistence**: Progress saved automatically during assessment
- **Results History**: Previous assessments stored for review
- **Analysis Data**: Comprehensive data export for professional review

#### 7. Debug Features
- **Debug Panel**: Real-time logging and state tracking (Ctrl+D to enable)
- **State Monitoring**: Track question progression, category selection, and assessment flow
- **Error Tracking**: Comprehensive debugging tools for development and testing

## Technical Architecture

### Frontend Implementation
- **Pure JavaScript (ES6 Modules)**: No frameworks, vanilla JS implementation
- **Modular Data Structure**: Organized data files for each diagnostic category
- **Client-Side Storage**: LocalStorage/SessionStorage for data persistence
- **Responsive Design**: Mobile-friendly interface matching main site design

### Data Structure
```
dsm5-data/
  ├── index.js (main export file)
  ├── mood.js (13 mood disorders)
  ├── anxiety.js (9 anxiety disorders)
  ├── trauma.js (7 trauma disorders)
  ├── personality.js (13 personality disorders)
  ├── ocd.js (5 OCD-related disorders)
  ├── eating.js (4 eating disorders)
  ├── substance.js (substance use disorders)
  ├── sleep.js (sleep-wake disorders)
  ├── dissociative.js (dissociative disorders)
  ├── somatic.js (somatic disorders)
  ├── sexual.js (sexual dysfunctions)
  ├── schizophrenia.js (psychotic disorders)
  ├── neurocognitive.js (cognitive disorders)
  ├── neurodevelopmental.js (developmental disorders)
  ├── category-guide.js (category selection questions)
  ├── comorbidity-mapping.js (comorbidity groups)
  ├── refined-questions.js (detailed refinement questions)
  ├── question-templates.js (question templates)
  ├── validation-pairs.js (validation questions)
  ├── scoring-thresholds.js (probability thresholds)
  └── sub-inquiry-questions.js (sub-inquiry prompts)
```

### Engine Architecture
- **DiagnosisEngine Class**: Main assessment engine
- **Question Generation**: Dynamic question building from criteria
- **Scoring Algorithm**: Statistical probability calculation
- **Comorbidity Detection**: Multi-disorder identification logic
- **Treatment Integration**: Comprehensive treatment database integration

## Usage

### For End Users
1. Navigate to `diagnosis.html` from the main site
2. Read and acknowledge the disclaimers
3. Select diagnostic categories or use "Start Here" guide
4. Answer questions using the 0-10 scale
5. Review results with probability scores and treatment information
6. Export data if desired for professional consultation

### For Developers
- **Clone Repository**: Full source code available
- **Modular Structure**: Easy to extend with new categories or questions
- **No Dependencies**: Pure HTML/CSS/JS - no build process required
- **API-Ready**: Architecture prepared for future Firebase integration (see `docs/FIREBASE_INTEGRATION_PLAN.md`)

### For Researchers
- **DSM-5 Compliance**: Questions based on official DSM-5 criteria
- **Comprehensive Coverage**: 100+ disorders with detailed criteria
- **Treatment Database**: Extensive treatment information for research purposes
- **Export Capabilities**: Data export for academic analysis

## Important Disclaimers

⚠️ **Critical Limitations**:

1. **Not a Substitute for Professional Evaluation**: This self-reporting questionnaire cannot replace comprehensive clinical assessment by licensed mental health professionals
2. **Self-Reporting Limitations**: Subject to bias, including response distortion, social desirability bias, and lack of insight
3. **Diagnostic Accuracy**: The DSM-5 requires clinical judgment, observation, and collateral information that cannot be captured through self-reporting alone
4. **No Medical Advice**: Results should not be used to self-diagnose or make treatment decisions without professional consultation
5. **Cultural and Contextual Factors**: May not account for cultural variations or individual circumstances
6. **Differential Diagnosis**: Many conditions share overlapping symptoms - only trained professionals can properly differentiate

## Future Enhancements

### Planned Features (See Firebase Integration Plan)
- **Guest/Anonymous Usage**: Firebase Anonymous Authentication
- **Professional Licensing**: Custom login system for licensed professionals
- **Cloud Storage**: Firebase Realtime Database/Firestore integration
- **Multi-Device Sync**: Cross-device assessment synchronization
- **Professional Reports**: Enhanced report generation for licensed users
- **Admin Dashboard**: User management and analytics

## SEO & Discoverability

### Keywords & Tags
- DSM-5 diagnostic assessment
- Mental health self-reporting questionnaire
- Psychiatric diagnostic tool
- Psychological assessment system
- Mental health screening tool
- Comorbidity detection
- Differential diagnosis tool
- Treatment information database
- Mental health self-assessment

### Search Engine Optimization
- Comprehensive meta tags
- Structured data for health tools
- Mobile-responsive design
- Fast loading times
- Accessible markup (ARIA labels)

## Accessibility

- **Semantic HTML**: Proper markup for screen readers
- **ARIA Labels**: Comprehensive accessibility labels
- **Keyboard Navigation**: Full keyboard support
- **Responsive Design**: Works on all device sizes
- **Clear Instructions**: Step-by-step guidance throughout

## License

See main repository LICENSE file for details.

## Contact & Support

For questions, bug reports, or feature requests:
- Website: https://beliefmastery.github.io/site/
- Diagnosis System: https://beliefmastery.github.io/site/diagnosis.html
- Author: Warwick Marshall
- Instagram: @belief.mastery

---

**Note**: This system is designed for educational exploration and should be used in conjunction with professional mental health care, not as a replacement for it.

