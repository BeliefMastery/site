/**
 * ATTRACTION ASSESSMENT ENGINE v2.0
 * 
 * Enhanced with:
 * - Sexual Market Value (SMV) relative positioning
 * - Market segmentation (Keepers, Sleepers, Sweepers)
 * - Age-adjusted expectations and filtering
 * - Categorical preference modifiers
 * - @hoe_math framework integration (Delta Hot Index, Levels, Value Disparity)
 * 
 * @author Warwick Marshall
 * @version 2.0.0
 */

export class AttractionEngine {
  constructor() {
    this.currentGender = null;
    this.currentPhase = 0;
    this.responses = {};
    this.preferences = {};
    this.scores = {};
    this.smv = {};
    this.initialized = false;
    
    console.log('AttractionEngine v2.0 constructor called');
    
    this.init();
  }

  init() {
    console.log('Initializing AttractionEngine v2.0...');
    this.initialized = true;
    console.log('AttractionEngine initialized:', this.initialized);
  }

  /**
   * ========================================================================
   * MARKET PREFERENCE CONFIGURATION
   * ========================================================================
   */
  getPreferenceQuestions(gender) {
    if (gender === 'male') {
      return {
        title: "Market Preference Configuration",
        subtitle: "Define Your Mate Selection Criteria",
        description: "These preferences help calibrate your assessment to the specific market segment you're targeting.",
        questions: [
          {
            id: 'age',
            text: 'What is your current age?',
            type: 'number',
            min: 18,
            max: 80,
            required: true
          },
          {
            id: 'target_age_min',
            text: 'Minimum age of desired partner?',
            type: 'number',
            min: 18,
            max: 80,
            required: true
          },
          {
            id: 'target_age_max',
            text: 'Maximum age of desired partner?',
            type: 'number',
            min: 18,
            max: 80,
            required: true
          },
          {
            id: 'physical_standards',
            text: 'How important are physical attractiveness standards (face, body, fitness)?',
            type: 'scale',
            options: [
              { value: 1, label: 'Not important - Personality and compatibility matter most' },
              { value: 3, label: 'Somewhat important - Basic attraction threshold' },
              { value: 5, label: 'Very important - Strong physical attraction required' },
              { value: 7, label: 'Extremely important - Top tier looks are essential' }
            ]
          },
          {
            id: 'fertility_priority',
            text: 'How important is fertility/ability to have children?',
            type: 'scale',
            options: [
              { value: 1, label: 'Not important - Not seeking children' },
              { value: 3, label: 'Somewhat important - Open to possibility' },
              { value: 5, label: 'Very important - Definitely want children' },
              { value: 7, label: 'Critical - Primary relationship purpose' }
            ]
          },
          {
            id: 'career_expectations',
            text: 'What are your expectations for her career/productivity?',
            type: 'scale',
            options: [
              { value: 1, label: 'Prefer full homemaker/traditional role' },
              { value: 3, label: 'Flexible - either career or home focused' },
              { value: 5, label: 'Prefer she has career but family comes first' },
              { value: 7, label: 'Want ambitious career woman/high earner' }
            ]
          },
          {
            id: 'relationship_goal',
            text: 'Primary relationship goal?',
            type: 'select',
            options: [
              { value: 'casual', label: 'Casual dating / Short-term' },
              { value: 'ltr', label: 'Long-term relationship' },
              { value: 'marriage', label: 'Marriage / Life partnership' },
              { value: 'family', label: 'Marriage + Children' }
            ]
          }
        ]
      };
    } else {
      return {
        title: "Market Preference Configuration",
        subtitle: "Define Your Mate Selection Criteria",
        description: "These preferences help calibrate your assessment to the specific market segment you're targeting.",
        questions: [
          {
            id: 'age',
            text: 'What is your current age?',
            type: 'number',
            min: 18,
            max: 80,
            required: true
          },
          {
            id: 'target_age_min',
            text: 'Minimum age of desired partner?',
            type: 'number',
            min: 18,
            max: 80,
            required: true
          },
          {
            id: 'target_age_max',
            text: 'Maximum age of desired partner?',
            type: 'number',
            min: 18,
            max: 80,
            required: true
          },
          {
            id: 'height_requirement',
            text: 'Minimum height requirement for partner?',
            type: 'scale',
            options: [
              { value: 1, label: 'No requirement - Height doesn\'t matter' },
              { value: 3, label: 'Prefer taller than me' },
              { value: 5, label: 'Must be 5\'10" (178cm) or taller' },
              { value: 7, label: 'Must be 6\'0" (183cm) or taller' },
              { value: 10, label: 'Must be 6\'2" (188cm)+ only' }
            ]
          },
          {
            id: 'income_requirement',
            text: 'Minimum income/wealth requirement?',
            type: 'scale',
            options: [
              { value: 1, label: 'Not important - Character matters most' },
              { value: 3, label: 'Must be self-sufficient/stable job' },
              { value: 5, label: 'Must earn above average ($75k+)' },
              { value: 7, label: 'Must be high earner ($150k+)' },
              { value: 10, label: 'Must be wealthy ($250k+)' }
            ]
          },
          {
            id: 'status_requirement',
            text: 'How important is social status/prestige?',
            type: 'scale',
            options: [
              { value: 1, label: 'Not important - Character over status' },
              { value: 3, label: 'Prefer some social standing' },
              { value: 5, label: 'Want respected professional/leader' },
              { value: 7, label: 'Need high status/influential man' }
            ]
          },
          {
            id: 'relationship_goal',
            text: 'Primary relationship goal?',
            type: 'select',
            options: [
              { value: 'casual', label: 'Casual dating / Short-term' },
              { value: 'ltr', label: 'Long-term relationship' },
              { value: 'marriage', label: 'Marriage / Life partnership' },
              { value: 'family', label: 'Marriage + Children' }
            ]
          }
        ]
      };
    }
  }

  /**
   * ========================================================================
   * MALE ASSESSMENT QUESTIONS (Same as before but optimized)
   * ========================================================================
   */
  getMaleQuestions() {
    return {
      coalitionRank: {
        title: "Coalition Rank Assessment",
        subtitle: "Male-Male Hierarchy Determinants (3C's)",
        description: "This phase evaluates your standing among male peers through courage, control, and competence.",
        questions: [
          // COURAGE
          {
            id: 'courage_1',
            cluster: 'coalitionRank',
            subcategory: 'courage',
            text: 'When faced with physical confrontation or danger, how do you typically respond?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'I avoid confrontation at all costs and retreat immediately' },
              { value: 3, label: 'I assess the situation carefully and only engage when necessary' },
              { value: 5, label: 'I stand my ground but try to de-escalate verbally' },
              { value: 7, label: 'I confidently face threats and defend myself when needed' },
              { value: 10, label: 'I actively confront threats and protect others without hesitation' }
            ]
          },
          {
            id: 'courage_2',
            cluster: 'coalitionRank',
            subcategory: 'courage',
            text: 'How often do you take calculated risks in your career or business ventures?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'Never - I always choose the safest path' },
              { value: 3, label: 'Rarely - Only when forced by circumstances' },
              { value: 5, label: 'Sometimes - When the potential reward clearly outweighs risk' },
              { value: 7, label: 'Often - I actively seek opportunities with acceptable risk' },
              { value: 10, label: 'Regularly - I thrive on calculated risk-taking and bold moves' }
            ]
          },
          
          // CONTROL
          {
            id: 'control_1',
            cluster: 'coalitionRank',
            subcategory: 'control',
            text: 'How well do you maintain composure during high-stress situations?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'I frequently lose my temper or become overwhelmed' },
              { value: 3, label: 'I struggle to stay calm but eventually regain control' },
              { value: 5, label: 'I maintain reasonable composure most of the time' },
              { value: 7, label: 'I stay calm and focused even under significant pressure' },
              { value: 10, label: 'I thrive under pressure and use stress to sharpen my focus' }
            ]
          },
          {
            id: 'control_2',
            cluster: 'coalitionRank',
            subcategory: 'control',
            text: 'How consistent are you with your personal discipline (fitness, diet, sleep, work routine)?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'Very inconsistent - I struggle with basic routines' },
              { value: 3, label: 'Somewhat inconsistent - I have good weeks and bad weeks' },
              { value: 5, label: 'Moderately consistent - I maintain most habits most of the time' },
              { value: 7, label: 'Very consistent - I rarely deviate from my routines' },
              { value: 10, label: 'Extremely disciplined - My routines are non-negotiable' }
            ]
          },
          
          // COMPETENCE
          {
            id: 'competence_1',
            cluster: 'coalitionRank',
            subcategory: 'competence',
            text: 'How effectively can you solve complex problems in unfamiliar domains?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'I struggle and usually need extensive help' },
              { value: 3, label: 'I can solve simple problems but need guidance for complex ones' },
              { value: 5, label: 'I can work through most problems with research and time' },
              { value: 7, label: 'I quickly identify solutions and execute effectively' },
              { value: 10, label: 'I excel at complex problem-solving and often teach others' }
            ]
          },
          {
            id: 'competence_2',
            cluster: 'coalitionRank',
            subcategory: 'competence',
            text: 'How would you rate your ability to generate and secure resources (income, assets, opportunities)?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'I struggle financially and depend on others' },
              { value: 3, label: 'I meet basic needs but have little surplus' },
              { value: 5, label: 'I generate moderate income and build slowly' },
              { value: 7, label: 'I generate strong income and accumulate resources steadily' },
              { value: 10, label: 'I create significant wealth and multiple income streams' }
            ]
          }
        ]
      },

      reproductiveConfidence: {
        title: "Reproductive Confidence Assessment",
        subtitle: "Female Selection Criteria (4P's)",
        description: "This phase evaluates traits that women assess for long-term mate selection.",
        questions: [
          // PERSPICACITY
          {
            id: 'perspicacity_1',
            cluster: 'reproductiveConfidence',
            subcategory: 'perspicacity',
            text: 'How quickly do you identify potential threats or dangers in your environment?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'I often miss warning signs until it\'s too late' },
              { value: 3, label: 'I notice some threats but not consistently' },
              { value: 5, label: 'I pick up on most threats with reasonable speed' },
              { value: 7, label: 'I quickly identify threats before they materialize' },
              { value: 10, label: 'I have exceptional situational awareness and foresight' }
            ]
          },
          
          // PROTECTOR
          {
            id: 'protector_1',
            cluster: 'reproductiveConfidence',
            subcategory: 'protector',
            text: 'How capable are you of physically protecting someone from harm?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'Not capable - I would likely be a liability' },
              { value: 3, label: 'Limited capability - I could help but not lead' },
              { value: 5, label: 'Moderate capability - I can hold my own' },
              { value: 7, label: 'High capability - I train regularly and am confident' },
              { value: 10, label: 'Expert level - Combat/martial arts training, always ready' }
            ]
          },
          
          // PROVIDER
          {
            id: 'provider_1',
            cluster: 'reproductiveConfidence',
            subcategory: 'provider',
            text: 'How stable and consistent is your income/resource generation?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'Unstable - Frequent gaps or dependency on others' },
              { value: 3, label: 'Inconsistent - Variable income, occasional struggles' },
              { value: 5, label: 'Stable - Reliable income covering needs and some wants' },
              { value: 7, label: 'Very stable - Consistent income with savings and investments' },
              { value: 10, label: 'Exceptional - Multiple income streams, significant reserves' }
            ]
          },
          {
            id: 'provider_2',
            cluster: 'reproductiveConfidence',
            subcategory: 'provider',
            text: 'If you had to support a family tomorrow, how prepared are you?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'Not at all - I struggle to support myself' },
              { value: 3, label: 'Minimally - I could barely manage' },
              { value: 5, label: 'Adequately - I could make it work with adjustments' },
              { value: 7, label: 'Well prepared - I could comfortably support a family' },
              { value: 10, label: 'Fully prepared - I actively plan for family provision' }
            ]
          },
          
          // PARENTAL INVESTOR
          {
            id: 'parental_1',
            cluster: 'reproductiveConfidence',
            subcategory: 'parentalInvestor',
            text: 'How committed are you to the idea of being an active, involved father?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'Not interested or committed to fatherhood' },
              { value: 3, label: 'Open to it but uncertain about involvement level' },
              { value: 5, label: 'Willing and would be reasonably involved' },
              { value: 7, label: 'Committed to being highly involved and present' },
              { value: 10, label: 'Passionate about fatherhood as a core life purpose' }
            ]
          }
        ]
      },

      axisOfAttraction: {
        title: "Axis of Attraction Assessment",
        subtitle: "Display Signals",
        description: "This phase evaluates the immediate signals you display that attract or repel potential mates.",
        questions: [
          // STATUS
          {
            id: 'status_1',
            cluster: 'axisOfAttraction',
            subcategory: 'performanceStatus',
            text: 'How would you rate your current social status and influence?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'Low - Little influence or recognition' },
              { value: 3, label: 'Below average - Some friends but minimal influence' },
              { value: 5, label: 'Average - Decent social circle and moderate respect' },
              { value: 7, label: 'Above average - Known and respected in multiple circles' },
              { value: 10, label: 'High - Significant influence and leadership position' }
            ]
          },
          {
            id: 'status_2',
            cluster: 'axisOfAttraction',
            subcategory: 'performanceStatus',
            text: 'What is your current annual income?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'Under $30,000' },
              { value: 3, label: '$30,000 - $60,000' },
              { value: 5, label: '$60,000 - $100,000' },
              { value: 7, label: '$100,000 - $200,000' },
              { value: 10, label: 'Over $200,000' }
            ]
          },
          
          // PHYSICAL
          {
            id: 'physical_1',
            cluster: 'axisOfAttraction',
            subcategory: 'physicalGenetic',
            text: 'How would you honestly rate your physical attractiveness (face, build, overall aesthetics)?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'Below average - Significant aesthetic limitations' },
              { value: 3, label: 'Slightly below average' },
              { value: 5, label: 'Average - Typical attractiveness' },
              { value: 7, label: 'Above average - Noticeably attractive' },
              { value: 10, label: 'Exceptionally attractive - Consistently draw attention' }
            ]
          },
          {
            id: 'physical_2',
            cluster: 'axisOfAttraction',
            subcategory: 'physicalGenetic',
            text: 'How would you rate your fitness, strength, and physical capability?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'Poor - Sedentary, weak, out of shape' },
              { value: 3, label: 'Below average - Limited fitness' },
              { value: 5, label: 'Average - Reasonably active and capable' },
              { value: 7, label: 'Fit - Regular training, visible muscle, strong' },
              { value: 10, label: 'Athletic/elite - Exceptional fitness and capability' }
            ]
          },
          {
            id: 'physical_3',
            cluster: 'axisOfAttraction',
            subcategory: 'physicalGenetic',
            text: 'What is your height?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'Under 5\'6" (168cm)' },
              { value: 3, label: '5\'6" - 5\'8" (168-173cm)' },
              { value: 5, label: '5\'9" - 5\'11" (175-180cm)' },
              { value: 7, label: '6\'0" - 6\'2" (183-188cm)' },
              { value: 10, label: 'Over 6\'2" (188cm)' }
            ]
          }
        ]
      }
    };
  }

  /**
   * ========================================================================
   * FEMALE ASSESSMENT QUESTIONS (Optimized)
   * ========================================================================
   */
  getFemaleQuestions() {
    return {
      coalitionRank: {
        title: "Coalition Rank Assessment",
        subtitle: "Female-Female Hierarchy Determinants (3S's)",
        description: "This phase evaluates your standing among female peers.",
        questions: [
          // SOCIAL INFLUENCE
          {
            id: 'social_1',
            cluster: 'coalitionRank',
            subcategory: 'socialInfluence',
            text: 'How much influence do you have over social narratives and group opinions?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'Minimal - I\'m often excluded or ignored' },
              { value: 3, label: 'Limited - I participate but rarely shape conversations' },
              { value: 5, label: 'Moderate - People listen to me and sometimes follow my lead' },
              { value: 7, label: 'Significant - I regularly influence group decisions' },
              { value: 10, label: 'Dominant - I\'m a social leader who shapes perceptions' }
            ]
          },
          
          // SELECTIVITY
          {
            id: 'selectivity_1',
            cluster: 'coalitionRank',
            subcategory: 'selectivity',
            text: 'How successful are you at attracting high-quality male attention?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'Unsuccessful - I receive little quality male attention' },
              { value: 3, label: 'Limited - Occasional interest from average men' },
              { value: 5, label: 'Moderate - Regular interest from decent quality men' },
              { value: 7, label: 'High - Frequent attention from high-value men' },
              { value: 10, label: 'Exceptional - Top-tier men actively pursue me' }
            ]
          },
          
          // STATUS SIGNALING
          {
            id: 'status_signal_1',
            cluster: 'coalitionRank',
            subcategory: 'statusSignaling',
            text: 'How well do you display your value without triggering jealousy or sabotage?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'Poorly - Either invisible or create resentment' },
              { value: 3, label: 'Limited - Struggle to balance visibility and backlash' },
              { value: 5, label: 'Adequately - Manage perception reasonably well' },
              { value: 7, label: 'Skillfully - Project value while maintaining alliances' },
              { value: 10, label: 'Masterfully - Command respect without creating enemies' }
            ]
          }
        ]
      },

      reproductiveConfidence: {
        title: "Reproductive Confidence Assessment",
        subtitle: "Male Selection Criteria",
        description: "This phase evaluates traits that men assess for long-term investment.",
        questions: [
          // PATERNITY CERTAINTY
          {
            id: 'paternity_1',
            cluster: 'reproductiveConfidence',
            subcategory: 'paternityCertainty',
            text: 'How loyal and faithful are you in committed relationships?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'Poor history - Multiple infidelities or betrayals' },
              { value: 3, label: 'Questionable - Emotional affairs or boundary violations' },
              { value: 5, label: 'Generally faithful but with some lapses in judgment' },
              { value: 7, label: 'Very loyal - No serious violations of trust' },
              { value: 10, label: 'Absolutely faithful - Loyalty is core to my identity' }
            ]
          },
          {
            id: 'paternity_2',
            cluster: 'reproductiveConfidence',
            subcategory: 'paternityCertainty',
            text: 'How many sexual/romantic partners have you had?',
            type: 'scale',
            weight: 1.0,
            reverseScore: true,
            options: [
              { value: 10, label: '20+ partners' },
              { value: 7, label: '10-19 partners' },
              { value: 5, label: '5-9 partners' },
              { value: 3, label: '2-4 partners' },
              { value: 1, label: '0-1 partners' }
            ]
          },
          
          // NURTURING
          {
            id: 'nurture_1',
            cluster: 'reproductiveConfidence',
            subcategory: 'nurturingStandard',
            text: 'How warm, caring, and nurturing are you toward a partner?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'Cold - I rarely show affection or care' },
              { value: 3, label: 'Limited - Some warmth but generally distant' },
              { value: 5, label: 'Moderate - I show care but it\'s inconsistent' },
              { value: 7, label: 'Very nurturing - I actively care for my partner' },
              { value: 10, label: 'Exceptionally nurturing - Caregiving is natural to me' }
            ]
          },
          
          // COLLABORATIVE TRUST
          {
            id: 'collab_1',
            cluster: 'reproductiveConfidence',
            subcategory: 'collaborativeTrust',
            text: 'How well do you cooperate with a partner without creating drama or conflict?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'Poorly - Constant conflict and drama' },
              { value: 3, label: 'Limited - Frequent disagreements and tension' },
              { value: 5, label: 'Adequately - Some conflict but generally workable' },
              { value: 7, label: 'Well - Low conflict, high cooperation' },
              { value: 10, label: 'Seamlessly - We work together like a unified team' }
            ]
          }
        ]
      },

      axisOfAttraction: {
        title: "Axis of Attraction Assessment",
        subtitle: "Male Mate Choice Filters",
        description: "This phase evaluates fertility signals and stability indicators.",
        questions: [
          // FERTILITY (Hot)
          {
            id: 'fertility_1',
            cluster: 'axisOfAttraction',
            subcategory: 'fertility',
            text: 'How would you honestly rate your physical attractiveness and feminine beauty?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'Below average - Significant aesthetic limitations' },
              { value: 3, label: 'Slightly below average' },
              { value: 5, label: 'Average - Typical attractiveness for my age' },
              { value: 7, label: 'Above average - Noticeably attractive' },
              { value: 10, label: 'Exceptionally beautiful - Consistently turn heads' }
            ]
          },
          {
            id: 'fertility_2',
            cluster: 'axisOfAttraction',
            subcategory: 'fertility',
            text: 'How favorable is your waist-hip ratio and overall body composition?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'Unfavorable - Significantly out of optimal range' },
              { value: 3, label: 'Below average - Not ideal proportions' },
              { value: 5, label: 'Average - Typical proportions' },
              { value: 7, label: 'Good - Favorable feminine proportions' },
              { value: 10, label: 'Excellent - Optimal fertility indicators' }
            ]
          },
          {
            id: 'fertility_3',
            cluster: 'axisOfAttraction',
            subcategory: 'fertility',
            text: 'What is your age?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: '45+ years old' },
              { value: 3, label: '35-44 years old' },
              { value: 5, label: '30-34 years old' },
              { value: 7, label: '25-29 years old' },
              { value: 10, label: '18-24 years old' }
            ]
          },
          
          // RISK/CRAZY
          {
            id: 'risk_1',
            cluster: 'axisOfAttraction',
            subcategory: 'riskCost',
            text: 'How emotionally stable and predictable are you?',
            type: 'scale',
            weight: 1.0,
            reverseScore: true,
            options: [
              { value: 10, label: 'Very unstable - Frequent emotional crises' },
              { value: 7, label: 'Somewhat unstable - Regular mood swings' },
              { value: 5, label: 'Moderately stable - Occasional episodes' },
              { value: 3, label: 'Quite stable - Rare disruptions' },
              { value: 1, label: 'Very stable - Consistently calm' }
            ]
          },
          {
            id: 'risk_2',
            cluster: 'axisOfAttraction',
            subcategory: 'riskCost',
            text: 'How present are red flags (substance abuse, mental health issues, destructive patterns)?',
            type: 'scale',
            weight: 1.0,
            reverseScore: true,
            options: [
              { value: 10, label: 'Multiple severe red flags' },
              { value: 7, label: 'Several moderate red flags' },
              { value: 5, label: 'A few minor red flags' },
              { value: 3, label: 'Very few, manageable issues' },
              { value: 1, label: 'No significant red flags' }
            ]
          }
        ]
      }
    };
  }

  /**
   * ========================================================================
   * ASSESSMENT FLOW CONTROL
   * ========================================================================
   */
  startAssessment() {
    console.log('startAssessment called');
    
    const intro = document.getElementById('introSection');
    const assessment = document.getElementById('assessmentSection');
    
    if (intro) intro.style.display = 'none';
    if (assessment) assessment.style.display = 'block';
    
    this.showGenderSelection();
  }

  showGenderSelection() {
    const container = document.getElementById('questionContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="gender-selection">
        <h2>Select Your Gender</h2>
        <p class="form-help">This assessment uses gender-specific frameworks based on evolutionary psychology and reproductive dynamics.</p>
        
        <div class="gender-buttons">
          <button class="btn btn-large gender-btn" data-gender="male">
            <span class="gender-icon">♂</span>
            <span class="gender-label">Male Assessment</span>
            <span class="gender-desc">Evaluates Coalition Rank (3C's), Reproductive Confidence (4P's), and Display Signals</span>
          </button>
          
          <button class="btn btn-large gender-btn" data-gender="female">
            <span class="gender-icon">♀</span>
            <span class="gender-label">Female Assessment</span>
            <span class="gender-desc">Evaluates Coalition Rank (3S's), Male Selection Criteria, and Fertility/Risk Signals</span>
          </button>
        </div>

        <div class="ack-box" style="margin-top: 2rem;">
          <p><strong>Note:</strong> These assessments are based on statistical patterns and biological essentialism. Individual variation is expected and normal. This tool provides insight, not prescription.</p>
        </div>
      </div>
    `;

    document.querySelectorAll('.gender-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const gender = e.currentTarget.dataset.gender;
        this.selectGender(gender);
      });
    });
  }

  selectGender(gender) {
    console.log('Gender selected:', gender);
    this.currentGender = gender;
    this.currentPhase = -1; // Start with preferences
    this.responses = {};
    this.preferences = {};
    
    this.showPreferencesForm();
  }

  showPreferencesForm() {
    const prefQuestions = this.getPreferenceQuestions(this.currentGender);
    const container = document.getElementById('questionContainer');
    if (!container) return;

    let html = `
      <div class="phase-intro">
        <h2>${prefQuestions.title}</h2>
        <h3 class="phase-subtitle">${prefQuestions.subtitle}</h3>
        <p class="phase-description">${prefQuestions.description}</p>

        <form id="preferencesForm" class="preferences-form">
    `;

    prefQuestions.questions.forEach(q => {
      html += `<div class="form-group">`;
      html += `<label class="form-label">${q.text}</label>`;
      
      if (q.type === 'number') {
        html += `<input type="number" id="${q.id}" name="${q.id}" min="${q.min}" max="${q.max}" ${q.required ? 'required' : ''} class="form-input">`;
      } else if (q.type === 'select') {
        html += `<select id="${q.id}" name="${q.id}" class="form-select">`;
        q.options.forEach(opt => {
          html += `<option value="${opt.value}">${opt.label}</option>`;
        });
        html += `</select>`;
      } else if (q.type === 'scale') {
        html += `<div class="options-container">`;
        q.options.forEach(opt => {
          html += `
            <label class="option-label">
              <input type="radio" name="${q.id}" value="${opt.value}" required>
              <span class="option-content">
                <span class="option-text">${opt.label}</span>
              </span>
            </label>
          `;
        });
        html += `</div>`;
      }
      
      html += `</div>`;
    });

    html += `
          <button type="button" class="btn btn-primary btn-large" id="submitPreferences">Continue to Assessment</button>
        </form>
      </div>
    `;

    container.innerHTML = html;

    document.getElementById('submitPreferences').addEventListener('click', () => {
      this.capturePreferences();
    });
  }

  capturePreferences() {
    const form = document.getElementById('preferencesForm');
    const formData = new FormData(form);
    
    // Validate
    let valid = true;
    formData.forEach((value, key) => {
      if (!value) valid = false;
    });

    if (!valid) {
      alert('Please complete all preference fields');
      return;
    }

    // Store preferences
    formData.forEach((value, key) => {
      this.preferences[key] = isNaN(value) ? value : parseFloat(value);
    });

    console.log('Preferences captured:', this.preferences);
    
    this.currentPhase = 0;
    this.showPhaseIntro();
  }

  showPhaseIntro() {
    const questions = this.currentGender === 'male' ? this.getMaleQuestions() : this.getFemaleQuestions();
    const phases = Object.keys(questions);
    const currentPhaseName = phases[this.currentPhase];
    const phase = questions[currentPhaseName];

    const container = document.getElementById('questionContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="phase-intro">
        <div class="phase-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(this.currentPhase / phases.length) * 100}%"></div>
          </div>
          <p class="progress-text">Phase ${this.currentPhase + 1} of ${phases.length}</p>
        </div>

        <h2>${phase.title}</h2>
        <h3 class="phase-subtitle">${phase.subtitle}</h3>
        <p class="phase-description">${phase.description}</p>

        <div class="phase-info">
          <p><strong>Questions in this phase:</strong> ${phase.questions.length}</p>
          <p><strong>Estimated time:</strong> ${Math.ceil(phase.questions.length * 0.5)} minutes</p>
        </div>

        <button class="btn btn-primary btn-large" id="startPhaseBtn">Begin Phase ${this.currentPhase + 1}</button>
      </div>
    `;

    document.getElementById('startPhaseBtn').addEventListener('click', () => {
      this.showPhaseQuestions();
    });
  }

  showPhaseQuestions() {
    const questions = this.currentGender === 'male' ? this.getMaleQuestions() : this.getFemaleQuestions();
    const phases = Object.keys(questions);
    const currentPhaseName = phases[this.currentPhase];
    const phase = questions[currentPhaseName];

    const container = document.getElementById('questionContainer');
    if (!container) return;

    let html = `
      <div class="phase-questions">
        <div class="phase-header-mini">
          <h3>${phase.title}</h3>
          <p class="question-progress" id="questionProgress">Question 1 of ${phase.questions.length}</p>
        </div>
        
        <form id="phaseForm">
    `;

    phase.questions.forEach((q, index) => {
      html += `
        <div class="question-block" data-question-index="${index}" style="${index === 0 ? '' : 'display: none;'}">
          <div class="question-header">
            <span class="question-number">Question ${index + 1} of ${phase.questions.length}</span>
            <span class="question-category">${this.formatSubcategory(q.subcategory)}</span>
          </div>
          
          <p class="question-text">${q.text}</p>
          
          <div class="options-container">
            ${q.options.map(opt => `
              <label class="option-label">
                <input type="radio" name="${q.id}" value="${opt.value}" required>
                <span class="option-content">
                  <span class="option-text">${opt.label}</span>
                </span>
              </label>
            `).join('')}
          </div>

          <div class="question-nav">
            ${index > 0 ? `<button type="button" class="btn btn-secondary" onclick="window.AttractionEngine.previousQuestion()">Previous</button>` : '<div></div>'}
            ${index < phase.questions.length - 1 
              ? `<button type="button" class="btn btn-primary" onclick="window.AttractionEngine.nextQuestion()">Next Question</button>`
              : `<button type="button" class="btn btn-primary" onclick="window.AttractionEngine.completePhase()">Complete Phase</button>`
            }
          </div>
        </div>
      `;
    });

    html += `
        </form>
      </div>
    `;

    container.innerHTML = html;
    this.currentQuestionIndex = 0;
  }

  formatSubcategory(subcategory) {
    const map = {
      courage: 'Courage',
      control: 'Control',
      competence: 'Competence',
      perspicacity: 'Perspicacity',
      protector: 'Protector',
      provider: 'Provider',
      parentalInvestor: 'Parental Investor',
      performanceStatus: 'Performance/Status',
      physicalGenetic: 'Physical/Genetic',
      socialInfluence: 'Social Influence',
      selectivity: 'Selectivity & Mate Guarding',
      statusSignaling: 'Status Signaling',
      paternityCertainty: 'Paternity Certainty',
      nurturingStandard: 'Nurturing Standard',
      collaborativeTrust: 'Collaborative Trust',
      fertility: 'Fertility & Health',
      riskCost: 'Risk/Stability'
    };
    return map[subcategory] || subcategory;
  }

  nextQuestion() {
    const currentBlock = document.querySelector(`[data-question-index="${this.currentQuestionIndex}"]`);
    const input = currentBlock.querySelector('input[type="radio"]:checked');
    
    if (!input) {
      alert('Please select an answer before continuing.');
      return;
    }

    const questionId = input.name;
    this.responses[questionId] = parseInt(input.value);

    currentBlock.style.display = 'none';
    this.currentQuestionIndex++;
    
    const nextBlock = document.querySelector(`[data-question-index="${this.currentQuestionIndex}"]`);
    if (nextBlock) {
      nextBlock.style.display = 'block';
      this.updateQuestionProgress();
      window.scrollTo(0, 0);
    }
  }

  previousQuestion() {
    const currentBlock = document.querySelector(`[data-question-index="${this.currentQuestionIndex}"]`);
    currentBlock.style.display = 'none';
    
    this.currentQuestionIndex--;
    
    const prevBlock = document.querySelector(`[data-question-index="${this.currentQuestionIndex}"]`);
    if (prevBlock) {
      prevBlock.style.display = 'block';
      this.updateQuestionProgress();
      window.scrollTo(0, 0);
    }
  }

  updateQuestionProgress() {
    const questions = this.currentGender === 'male' ? this.getMaleQuestions() : this.getFemaleQuestions();
    const phases = Object.keys(questions);
    const currentPhaseName = phases[this.currentPhase];
    const phase = questions[currentPhaseName];
    
    const progress = document.getElementById('questionProgress');
    if (progress) {
      progress.textContent = `Question ${this.currentQuestionIndex + 1} of ${phase.questions.length}`;
    }
  }

  completePhase() {
    const currentBlock = document.querySelector(`[data-question-index="${this.currentQuestionIndex}"]`);
    const input = currentBlock.querySelector('input[type="radio"]:checked');
    
    if (!input) {
      alert('Please select an answer before continuing.');
      return;
    }

    const questionId = input.name;
    this.responses[questionId] = parseInt(input.value);

    const questions = this.currentGender === 'male' ? this.getMaleQuestions() : this.getFemaleQuestions();
    const phases = Object.keys(questions);

    this.currentPhase++;

    if (this.currentPhase < phases.length) {
      this.showPhaseIntro();
    } else {
      this.calculateAndShowResults();
    }
  }

  /**
   * ========================================================================
   * SMV CALCULATION ENGINE (Enhanced with hoe_math logic)
   * ========================================================================
   */
  calculateAndShowResults() {
    console.log('Calculating results...');
    console.log('Responses:', this.responses);
    console.log('Preferences:', this.preferences);

    const scores = this.calculateSMV();
    console.log('Calculated SMV:', scores);

    this.displayResults(scores);
  }

  calculateSMV() {
    const questions = this.currentGender === 'male' ? this.getMaleQuestions() : this.getFemaleQuestions();
    
    // Raw score calculation
    const rawScores = {
      clusters: {},
      subcategories: {}
    };

    // Calculate raw averages
    Object.keys(questions).forEach(clusterName => {
      const phase = questions[clusterName];
      rawScores.clusters[clusterName] = [];
      rawScores.subcategories[clusterName] = {};
      
      phase.questions.forEach(q => {
        const response = this.responses[q.id];
        if (response === undefined) return;

        const actualValue = q.reverseScore ? (11 - response) : response;
        
        if (!rawScores.subcategories[clusterName][q.subcategory]) {
          rawScores.subcategories[clusterName][q.subcategory] = [];
        }
        
        rawScores.subcategories[clusterName][q.subcategory].push(actualValue);
        rawScores.clusters[clusterName].push(actualValue);
      });
    });

    // Calculate percentile-based SMV
    const smv = {
      overall: 0,
      clusters: {},
      subcategories: {},
      marketPosition: '',
      targetMarket: {},
      delusionIndex: 0,
      levelClassification: '',
      recommendation: ''
    };

    // Convert raw scores to percentiles (0-100 scale)
    Object.keys(rawScores.clusters).forEach(cluster => {
      const avg = rawScores.clusters[cluster].reduce((a,b) => a+b, 0) / rawScores.clusters[cluster].length;
      smv.clusters[cluster] = this.scoreToPercentile(avg);
      
      smv.subcategories[cluster] = {};
      Object.keys(rawScores.subcategories[cluster]).forEach(subcat => {
        const subAvg = rawScores.subcategories[cluster][subcat].reduce((a,b) => a+b, 0) / rawScores.subcategories[cluster][subcat].length;
        smv.subcategories[cluster][subcat] = this.scoreToPercentile(subAvg);
      });
    });

    // Overall SMV (weighted by cluster importance)
    if (this.currentGender === 'male') {
      smv.overall = (
        smv.clusters.coalitionRank * 0.25 +
        smv.clusters.reproductiveConfidence * 0.35 +
        smv.clusters.axisOfAttraction * 0.40
      );
    } else {
      smv.overall = (
        smv.clusters.coalitionRank * 0.20 +
        smv.clusters.reproductiveConfidence * 0.30 +
        smv.clusters.axisOfAttraction * 0.50
      );
    }

    // Market classification (Keeper/Sleeper/Sweeper zones)
    smv.marketPosition = this.classifyMarketPosition(smv.overall, this.currentGender);
    
    // Developmental Level (hoe_math Levels framework)
    smv.levelClassification = this.classifyDevelopmentalLevel(smv);
    
    // Calculate Delusion Index
    smv.delusionIndex = this.calculateDelusionIndex(smv);
    smv.targetMarket = this.analyzeTargetMarket(smv);
    
    // Strategic recommendations
    smv.recommendation = this.generateRecommendation(smv);
    
    // Store raw responses for detailed analysis
    smv.rawResponses = this.responses;
    smv.preferences = this.preferences;

    return smv;
  }

  scoreToPercentile(score) {
    // Convert 1-10 scale to 0-100 percentile
    // Using a normal distribution approximation
    const normalized = (score - 1) / 9; // 0 to 1
    
    // Apply sigmoid for more realistic distribution
    const sigmoid = 1 / (1 + Math.exp(-6 * (normalized - 0.5)));
    return sigmoid * 100;
  }

  classifyMarketPosition(smv, gender) {
    if (gender === 'male') {
      if (smv >= 80) return 'Top Tier Keeper (Top 20%)';
      if (smv >= 60) return 'Keeper Material (Above Average)';
      if (smv >= 40) return 'Sleeper Zone (Average)';
      if (smv >= 20) return 'Sweeper Territory (Below Average)';
      return 'Bottom Quintile (Significant Development Needed)';
    } else {
      if (smv >= 80) return 'Top Tier (High Mate Value)';
      if (smv >= 60) return 'Above Average (Strong Options)';
      if (smv >= 40) return 'Average (Decent Options)';
      if (smv >= 20) return 'Below Average (Limited Options)';
      return 'Bottom Quintile (Significant Development Needed)';
    }
  }

  classifyDevelopmentalLevel(smv) {
    // Based on hoe_math's Levels framework
    const coalitionScore = smv.clusters.coalitionRank || 0;
    const reproScore = smv.clusters.reproductiveConfidence || 0;
    
    const avgMaturity = (coalitionScore + reproScore) / 2;
    
    if (avgMaturity >= 80) return 'Integral/Holistic (High Integration)';
    if (avgMaturity >= 65) return 'Achievement-Oriented (Rational/Strategic)';
    if (avgMaturity >= 50) return 'Conformist (Rule-Following)';
    if (avgMaturity >= 35) return 'Egocentric (Reactive/Impulsive)';
    return 'Survival Mode (Basic Needs Focus)';
  }

  calculateDelusionIndex(smv) {
    // Compare self-perception vs preference standards
    const prefs = this.preferences;
    
    if (this.currentGender === 'male') {
      // If seeking much younger women while being average/below
      const ageDelta = prefs.age - prefs.target_age_max;
      const physicalStandards = prefs.physical_standards || 3;
      
      let delusionScore = 0;
      
      // Age delusion
      if (ageDelta > 10 && smv.overall < 70) delusionScore += 20;
      if (ageDelta > 15 && smv.overall < 60) delusionScore += 30;
      
      // Physical standards delusion
      if (physicalStandards >= 5 && smv.clusters.axisOfAttraction < 60) delusionScore += 25;
      if (physicalStandards >= 7 && smv.clusters.axisOfAttraction < 70) delusionScore += 35;
      
      return Math.min(delusionScore, 100);
      
    } else {
      // Female delusion calculator
      const heightReq = prefs.height_requirement || 1;
      const incomeReq = prefs.income_requirement || 1;
      const statusReq = prefs.status_requirement || 1;
      
      let delusionScore = 0;
      
      // Height requirements
      if (heightReq >= 7 && smv.overall < 70) delusionScore += 25; // 6ft+ requirement
      if (heightReq >= 10 && smv.overall < 80) delusionScore += 40; // 6'2"+ requirement
      
      // Income requirements
      if (incomeReq >= 7 && smv.overall < 70) delusionScore += 25; // $150k+ requirement
      if (incomeReq >= 10 && smv.overall < 80) delusionScore += 40; // $250k+ requirement
      
      // Status requirements
      if (statusReq >= 7 && smv.overall < 65) delusionScore += 20;
      
      // Age penalty (older women with high standards)
      const age = prefs.age || 25;
      if (age > 30 && (heightReq >= 7 || incomeReq >= 7)) delusionScore += 15;
      if (age > 35 && (heightReq >= 7 || incomeReq >= 7)) delusionScore += 25;
      
      return Math.min(delusionScore, 100);
    }
  }

  analyzeTargetMarket(smv) {
    // Determine realistic target market
    const market = {
      realistic: '',
      aspirational: '',
      settling: '',
      statistics: ''
    };

    if (this.currentGender === 'male') {
      if (smv.overall >= 80) {
        market.realistic = 'Top 20-30% of women (7-9/10 range)';
        market.aspirational = 'Top 10% of women possible';
      } else if (smv.overall >= 60) {
        market.realistic = 'Top 40-60% of women (5-7/10 range)';
        market.aspirational = 'Top 30% with optimization';
      } else if (smv.overall >= 40) {
        market.realistic = 'Average to below average women (4-6/10 range)';
        market.aspirational = 'Top 50% with significant improvement';
      } else {
        market.realistic = 'Bottom 40% of women';
        market.aspirational = 'Average women with major self-improvement';
      }
    } else {
      if (smv.overall >= 80) {
        market.realistic = 'Top 10-20% of men (High earners, fit, 6ft+)';
        market.aspirational = 'Top 5% men accessible';
      } else if (smv.overall >= 60) {
        market.realistic = 'Top 30-50% of men (Above average earners, decent looks)';
        market.aspirational = 'Top 20% with optimization';
      } else if (smv.overall >= 40) {
        market.realistic = 'Average men (median income, average looks)';
        market.aspirational = 'Above average men possible';
      } else {
        market.realistic = 'Below average men';
        market.aspirational = 'Average men with improvement';
      }
    }

    return market;
  }

  generateRecommendation(smv) {
    const recs = {
      priority: '',
      tactical: [],
      strategic: '',
      warning: ''
    };

    if (this.currentGender === 'male') {
      if (smv.overall < 40) {
        recs.priority = 'CRITICAL DEVELOPMENT NEEDED';
        recs.tactical = [
          'Focus on income/provider capability immediately',
          'Start fitness regimen - minimum 3x/week strength training',
          'Develop one high-value skill or credential',
          'Lower short-term standards to build experience'
        ];
        recs.strategic = 'Your SMV is below average. Focus on fundamentals before pursuing high-value women.';
      } else if (smv.overall < 60) {
        recs.priority = 'Optimization Phase';
        recs.tactical = [
          'Maximize earning potential in current career',
          'Build visible status markers (style, car, residence)',
          'Expand social proof and networks',
          'Improve physical presentation'
        ];
        recs.strategic = 'You have average SMV. Strategic improvements can move you into keeper territory for quality women.';
      } else {
        recs.priority = 'Refinement and Leverage';
        recs.tactical = [
          'Leverage high SMV for mate selection',
          'Be selective - you have options',
          'Maintain edge through continued development',
          'Consider long-term strategy (marriage/family timing)'
        ];
        recs.strategic = 'You have strong SMV. Focus on finding the right match rather than improvement.';
      }

      if (smv.delusionIndex > 50) {
        recs.warning = 'WARNING: Your standards significantly exceed your current market value. Adjust expectations or commit to major self-improvement.';
      }

    } else {
      if (smv.overall < 40) {
        recs.priority = 'CRITICAL DEVELOPMENT NEEDED';
        recs.tactical = [
          'Physical optimization is paramount (fitness, beauty routine)',
          'Reduce risk indicators (drama, instability)',
          'Develop nurturing and cooperative skills',
          'Lower standards to realistic range for current SMV'
        ];
        recs.strategic = 'Your SMV is below average. Without improvement, high-value men will not commit long-term.';
      } else if (smv.overall < 60) {
        recs.priority = 'Optimization Phase';
        recs.tactical = [
          'Maximize physical attractiveness (fitness, style, grooming)',
          'Develop feminine nurturing traits',
          'Minimize drama and conflict patterns',
          'Build cooperative partnership skills'
        ];
        recs.strategic = 'You have average SMV. Improvements can access above-average men for commitment.';
      } else {
        recs.priority = 'Leverage and Selection';
        recs.tactical = [
          'Be selective for commitment - you have options',
          'Vet for provider, protector, parental capacity',
          'Maintain SMV through health and beauty',
          'Act while SMV is high (age is a factor)'
        ];
        recs.strategic = 'You have strong SMV. Focus on selecting the right high-value man for long-term commitment.';
      }

      if (smv.delusionIndex > 50) {
        recs.warning = 'WARNING: Your standards (height/income/status) significantly exceed your current market value. The math suggests you\'re pursuing the top 1-5% of men while being in a lower percentile yourself. Either adjust standards or dramatically improve your SMV.';
      }
    }

    return recs;
  }

  /**
   * ========================================================================
   * RESULTS DISPLAY
   * ========================================================================
   */
  displayResults(smv) {
    const container = document.getElementById('questionContainer');
    const resultsSection = document.getElementById('resultsSection');
    
    if (container) container.style.display = 'none';
    if (resultsSection) resultsSection.style.display = 'block';

    this.renderSMVDashboard(smv);
    this.renderMarketAnalysis(smv);
    this.renderRecommendations(smv);

    this.setupExportHandlers(smv);
    window.scrollTo(0, 0);
  }

  renderSMVDashboard(smv) {
    const container = document.getElementById('resultsContent');
    if (!container) return;

    let html = `
      <div class="results-dashboard">
        <div class="results-header">
          <h2>Your Sexual Market Value Profile</h2>
          <p class="results-subtitle">${this.currentGender === 'male' ? 'Male' : 'Female'} SMV Assessment</p>
        </div>

        <div class="overall-score-card">
          <div class="score-display">
            <div class="score-number">${Math.round(smv.overall)}</div>
            <div class="score-label">SMV Percentile</div>
            <div class="score-percentile">${smv.marketPosition}</div>
          </div>
          <div class="score-interpretation">
            <p>${this.getSMVInterpretation(smv.overall, this.currentGender)}</p>
          </div>
        </div>

        ${smv.delusionIndex > 30 ? `
          <div class="delusion-warning">
            <h3>⚠️ Delusion Index: ${Math.round(smv.delusionIndex)}%</h3>
            <p>${this.getDelusionWarning(smv.delusionIndex, this.currentGender)}</p>
          </div>
        ` : ''}

        <div class="level-classification">
          <h3>Developmental Level</h3>
          <p><strong>${smv.levelClassification}</strong></p>
          <p class="level-description">${this.getLevelDescription(smv.levelClassification)}</p>
        </div>

        <div class="cluster-scores">
          <h3>SMV Component Breakdown</h3>
          ${Object.keys(smv.clusters).map(clusterName => {
            const score = smv.clusters[clusterName];
            return `
              <div class="cluster-card">
                <div class="cluster-header">
                  <h4>${this.formatClusterName(clusterName)}</h4>
                  <span class="cluster-score">${Math.round(score)}th Percentile</span>
                </div>
                <div class="cluster-bar">
                  <div class="cluster-bar-fill" style="width: ${score}%; background: ${this.getPercentileColor(score)}"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  renderMarketAnalysis(smv) {
    const container = document.getElementById('resultsContent');
    if (!container) return;

    const analysisHtml = `
      <div class="market-analysis">
        <h3>Market Position Analysis</h3>
        
        <div class="market-grid">
          <div class="market-card">
            <h4>Realistic Target Market</h4>
            <p>${smv.targetMarket.realistic}</p>
          </div>
          
          <div class="market-card">
            <h4>Aspirational (With Improvement)</h4>
            <p>${smv.targetMarket.aspirational}</p>
          </div>
        </div>

        <div class="preferences-analysis">
          <h4>Your Stated Preferences vs Market Reality</h4>
          ${this.renderPreferencesAnalysis(smv)}
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', analysisHtml);
  }

  renderPreferencesAnalysis(smv) {
    const prefs = this.preferences;
    let html = '<ul class="analysis-list">';

    if (this.currentGender === 'male') {
      const ageGap = prefs.age - prefs.target_age_max;
      if (ageGap > 10) {
        html += `<li class="warning">You're seeking women significantly younger (${ageGap}+ year gap). This requires top-tier SMV (80+). Your SMV: ${Math.round(smv.overall)}</li>`;
      }
      if (prefs.physical_standards >= 5 && smv.overall < 60) {
        html += `<li class="warning">Your physical standards are high but your Axis of Attraction score is moderate. Consider improving or adjusting standards.</li>`;
      }
    } else {
      if (prefs.height_requirement >= 7) {
        html += `<li class="warning">6ft+ height requirement eliminates ~85% of men. Your SMV of ${Math.round(smv.overall)} may not access this tier consistently.</li>`;
      }
      if (prefs.income_requirement >= 7) {
        html += `<li class="warning">$150k+ income requirement targets top ~10% of male earners. Your SMV: ${Math.round(smv.overall)} percentile.</li>`;
      }
      const age = prefs.age;
      if (age > 30 && (prefs.height_requirement >= 7 || prefs.income_requirement >= 7)) {
        html += `<li class="critical">At age ${age} with high standards, you're competing against younger women for top-tier men. Time sensitivity is critical.</li>`;
      }
    }

    html += '</ul>';
    return html;
  }

  renderRecommendations(smv) {
    const container = document.getElementById('resultsContent');
    if (!container) return;

    const rec = smv.recommendation;

    const recHtml = `
      <div class="recommendations">
        <h3>Strategic Recommendations</h3>
        
        <div class="priority-box ${rec.priority.includes('CRITICAL') ? 'critical' : 'normal'}">
          <h4>${rec.priority}</h4>
          <p>${rec.strategic}</p>
        </div>

        ${rec.warning ? `
          <div class="warning-box">
            <strong>⚠️ Reality Check:</strong>
            <p>${rec.warning}</p>
          </div>
        ` : ''}

        <div class="tactical-actions">
          <h4>Immediate Actions</h4>
          <ol>
            ${rec.tactical.map(action => `<li>${action}</li>`).join('')}
          </ol>
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', recHtml);
  }

  formatClusterName(name) {
    const map = {
      coalitionRank: 'Coalition Rank',
      reproductiveConfidence: 'Reproductive Confidence',
      axisOfAttraction: 'Axis of Attraction'
    };
    return map[name] || name;
  }

  getPercentileColor(percentile) {
    if (percentile >= 80) return '#2ecc71';
    if (percentile >= 60) return '#3498db';
    if (percentile >= 40) return '#f39c12';
    return '#e74c3c';
  }

  getSMVInterpretation(smv, gender) {
    if (smv >= 80) {
      return `You are in the top quintile of ${gender === 'male' ? 'men' : 'women'}. You have significant options and leverage in the mating market.`;
    } else if (smv >= 60) {
      return `You are above average. With strategic optimization, you can access high-quality partners.`;
    } else if (smv >= 40) {
      return `You are in the average range. Focused improvement in key areas will significantly expand your options.`;
    } else {
      return `You are below average. Significant development is needed to access quality partners. Focus on fundamentals.`;
    }
  }

  getDelusionWarning(index, gender) {
    if (index >= 70) {
      return 'SEVERE MISMATCH: Your expectations are dramatically out of alignment with your market value. You are likely chasing the top 1-5% while not being in that tier yourself. This will result in persistent rejection and frustration.';
    } else if (index >= 50) {
      return 'SIGNIFICANT MISMATCH: Your standards exceed your current market position. Either commit to major self-improvement or adjust expectations to realistic ranges.';
    } else {
      return 'MODERATE MISMATCH: Some recalibration needed between standards and market position.';
    }
  }

  getLevelDescription(level) {
    const descriptions = {
      'Integral/Holistic (High Integration)': 'You demonstrate meta-cognitive awareness and can navigate complex social dynamics with maturity.',
      'Achievement-Oriented (Rational/Strategic)': 'You operate strategically and understand market dynamics rationally.',
      'Conformist (Rule-Following)': 'You follow social scripts but may lack strategic independence.',
      'Egocentric (Reactive/Impulsive)': 'You operate primarily from ego and immediate gratification.',
      'Survival Mode (Basic Needs Focus)': 'You are focused on basic survival and security.'
    };
    return descriptions[level] || '';
  }

  /**
   * ========================================================================
   * EXPORT FUNCTIONALITY
   * ========================================================================
   */
  setupExportHandlers(smv) {
    const jsonBtn = document.getElementById('exportJSON');
    const csvBtn = document.getElementById('exportCSV');
    const briefBtn = document.getElementById('exportExecutiveBrief');
    const newBtn = document.getElementById('newAssessment');

    if (jsonBtn) jsonBtn.addEventListener('click', () => this.exportJSON(smv));
    if (csvBtn) csvBtn.addEventListener('click', () => this.exportCSV(smv));
    if (briefBtn) briefBtn.addEventListener('click', () => this.exportBrief(smv));
    if (newBtn) newBtn.addEventListener('click', () => this.resetAssessment());
  }

  exportJSON(smv) {
    const data = {
      gender: this.currentGender,
      timestamp: new Date().toISOString(),
      preferences: this.preferences,
      responses: this.responses,
      smv: smv
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smv-assessment-${this.currentGender}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  }

  exportCSV(smv) {
    let csv = 'Metric,Value\n';
    csv += `Overall SMV,${Math.round(smv.overall)}\n`;
    csv += `Market Position,${smv.marketPosition}\n`;
    csv += `Delusion Index,${Math.round(smv.delusionIndex)}\n`;
    csv += `Level,${smv.levelClassification}\n`;
    
    Object.keys(smv.clusters).forEach(cluster => {
      csv += `${this.formatClusterName(cluster)},${Math.round(smv.clusters[cluster])}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smv-report-${this.currentGender}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  exportBrief(smv) {
    let brief = `SEXUAL MARKET VALUE ASSESSMENT\n`;
    brief += `${'='.repeat(80)}\n\n`;
    brief += `Date: ${new Date().toISOString().split('T')[0]}\n`;
    brief += `Gender: ${this.currentGender.toUpperCase()}\n`;
    brief += `Overall SMV: ${Math.round(smv.overall)}th Percentile\n`;
    brief += `Market Position: ${smv.marketPosition}\n`;
    brief += `Developmental Level: ${smv.levelClassification}\n\n`;

    if (smv.delusionIndex > 30) {
      brief += `⚠️ DELUSION INDEX: ${Math.round(smv.delusionIndex)}%\n`;
      brief += `${this.getDelusionWarning(smv.delusionIndex, this.currentGender)}\n\n`;
    }

    brief += `STRATEGIC ASSESSMENT\n`;
    brief += `${'-'.repeat(80)}\n`;
    brief += `${smv.recommendation.strategic}\n\n`;

    brief += `PRIORITY: ${smv.recommendation.priority}\n\n`;

    brief += `IMMEDIATE ACTIONS:\n`;
    smv.recommendation.tactical.forEach((action, i) => {
      brief += `${i + 1}. ${action}\n`;
    });

    const blob = new Blob([brief], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smv-brief-${this.currentGender}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  }

  resetAssessment() {
    this.currentGender = null;
    this.currentPhase = 0;
    this.responses = {};
    this.preferences = {};
    this.scores = {};
    this.smv = {};
    this.currentQuestionIndex = 0;

    const intro = document.getElementById('introSection');
    const assessment = document.getElementById('assessmentSection');
    const results = document.getElementById('resultsSection');

    if (intro) intro.style.display = 'block';
    if (assessment) assessment.style.display = 'none';
    if (results) results.style.display = 'none';

    window.scrollTo(0, 0);
  }
}

console.log('AttractionEngine v2.0 loaded');
