/**
 * ATTRACTION ASSESSMENT ENGINE
 * 
 * A sophisticated multi-phase assessment system for evaluating attraction dynamics
 * based on evolutionary psychology, red-pill frameworks, and behavioral patterns.
 * 
 * Structure:
 * - Gender-specific assessment paths (Male/Female)
 * - Three-cluster evaluation system per gender
 * - Behavioral pattern analysis
 * - Weighted scoring with cross-cluster synthesis
 * - Comprehensive reporting with actionable insights
 * 
 * @author Warwick Marshall
 * @version 1.0.0
 */

export class AttractionEngine {
  constructor() {
    this.currentGender = null;
    this.currentPhase = 0;
    this.responses = {};
    this.scores = {};
    this.initialized = false;
    
    console.log('AttractionEngine constructor called');
    
    this.init();
  }

  init() {
    console.log('Initializing AttractionEngine...');
    this.initialized = true;
    console.log('AttractionEngine initialized:', this.initialized);
  }

  /**
   * ========================================================================
   * MALE ASSESSMENT QUESTIONS
   * ========================================================================
   */
  getMaleQuestions() {
    return {
      // PHASE 1: Coalition Rank (3C's) - Male-Male Hierarchy
      coalitionRank: {
        title: "Coalition Rank Assessment",
        subtitle: "Male-Male Hierarchy Determinants (3C's)",
        description: "This phase evaluates your standing among male peers through courage, control, and competence.",
        questions: [
          // COURAGE - Risk tolerance under threat
          {
            id: 'courage_1',
            cluster: 'coalitionRank',
            subcategory: 'courage',
            text: 'When faced with physical confrontation or danger, how do you typically respond?',
            type: 'scale',
            weight: 1.2,
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
          {
            id: 'courage_3',
            cluster: 'coalitionRank',
            subcategory: 'courage',
            text: 'When you see injustice or someone being mistreated, what do you do?',
            type: 'scale',
            weight: 1.1,
            options: [
              { value: 1, label: 'I look away and avoid getting involved' },
              { value: 3, label: 'I feel bad but rarely act on it' },
              { value: 5, label: 'I sometimes speak up depending on the situation' },
              { value: 7, label: 'I usually intervene verbally or seek help' },
              { value: 10, label: 'I consistently intervene directly to protect or defend others' }
            ]
          },
          
          // CONTROL - Mastery over impulses and stress
          {
            id: 'control_1',
            cluster: 'coalitionRank',
            subcategory: 'control',
            text: 'How well do you maintain composure during high-stress situations?',
            type: 'scale',
            weight: 1.3,
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
            weight: 1.2,
            options: [
              { value: 1, label: 'Very inconsistent - I struggle with basic routines' },
              { value: 3, label: 'Somewhat inconsistent - I have good weeks and bad weeks' },
              { value: 5, label: 'Moderately consistent - I maintain most habits most of the time' },
              { value: 7, label: 'Very consistent - I rarely deviate from my routines' },
              { value: 10, label: 'Extremely disciplined - My routines are non-negotiable' }
            ]
          },
          {
            id: 'control_3',
            cluster: 'coalitionRank',
            subcategory: 'control',
            text: 'When provoked or insulted, how do you typically react?',
            type: 'scale',
            weight: 1.1,
            options: [
              { value: 1, label: 'I react emotionally and impulsively' },
              { value: 3, label: 'I get upset but try to control my reaction' },
              { value: 5, label: 'I pause before responding but may still show emotion' },
              { value: 7, label: 'I respond calmly and strategically' },
              { value: 10, label: 'I remain completely unfazed and use it to my advantage' }
            ]
          },
          
          // COMPETENCE - Ability to solve problems and secure resources
          {
            id: 'competence_1',
            cluster: 'coalitionRank',
            subcategory: 'competence',
            text: 'How effectively can you solve complex problems in unfamiliar domains?',
            type: 'scale',
            weight: 1.3,
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
            weight: 1.4,
            options: [
              { value: 1, label: 'I struggle financially and depend on others' },
              { value: 3, label: 'I meet basic needs but have little surplus' },
              { value: 5, label: 'I generate moderate income and build slowly' },
              { value: 7, label: 'I generate strong income and accumulate resources steadily' },
              { value: 10, label: 'I create significant wealth and multiple income streams' }
            ]
          },
          {
            id: 'competence_3',
            cluster: 'coalitionRank',
            subcategory: 'competence',
            text: 'When other men seek advice or help, how often do they come to you?',
            type: 'scale',
            weight: 1.2,
            options: [
              { value: 1, label: 'Rarely or never - I\'m usually the one seeking help' },
              { value: 3, label: 'Occasionally for basic things' },
              { value: 5, label: 'Regularly for specific areas of expertise' },
              { value: 7, label: 'Frequently across multiple domains' },
              { value: 10, label: 'Constantly - I\'m a go-to resource and mentor' }
            ]
          }
        ]
      },

      // PHASE 2: Reproductive Confidence (4P's) - Female Selection Criteria
      reproductiveConfidence: {
        title: "Reproductive Confidence Assessment",
        subtitle: "Female Selection Criteria (4P's)",
        description: "This phase evaluates traits that women assess for long-term mate selection and genetic legacy.",
        questions: [
          // PERSPICACITY - Acute perception of threats/opportunities
          {
            id: 'perspicacity_1',
            cluster: 'reproductiveConfidence',
            subcategory: 'perspicacity',
            text: 'How quickly do you identify potential threats or dangers in your environment?',
            type: 'scale',
            weight: 1.2,
            options: [
              { value: 1, label: 'I often miss warning signs until it\'s too late' },
              { value: 3, label: 'I notice some threats but not consistently' },
              { value: 5, label: 'I pick up on most threats with reasonable speed' },
              { value: 7, label: 'I quickly identify threats before they materialize' },
              { value: 10, label: 'I have exceptional situational awareness and foresight' }
            ]
          },
          {
            id: 'perspicacity_2',
            cluster: 'reproductiveConfidence',
            subcategory: 'perspicacity',
            text: 'How effectively do you read social dynamics and identify opportunities?',
            type: 'scale',
            weight: 1.1,
            options: [
              { value: 1, label: 'I\'m often oblivious to social undercurrents' },
              { value: 3, label: 'I notice obvious social patterns but miss subtleties' },
              { value: 5, label: 'I read most social situations reasonably well' },
              { value: 7, label: 'I quickly assess social hierarchies and opportunities' },
              { value: 10, label: 'I have exceptional social intelligence and strategic insight' }
            ]
          },
          
          // PROTECTOR - Physical defense capacity and intent
          {
            id: 'protector_1',
            cluster: 'reproductiveConfidence',
            subcategory: 'protector',
            text: 'How capable are you of physically protecting someone from harm?',
            type: 'scale',
            weight: 1.4,
            options: [
              { value: 1, label: 'Not capable - I would likely be a liability' },
              { value: 3, label: 'Limited capability - I could help but not lead' },
              { value: 5, label: 'Moderate capability - I can hold my own' },
              { value: 7, label: 'High capability - I train regularly and am confident' },
              { value: 10, label: 'Expert level - Combat/martial arts training, always ready' }
            ]
          },
          {
            id: 'protector_2',
            cluster: 'reproductiveConfidence',
            subcategory: 'protector',
            text: 'How seriously do you take your responsibility to protect those under your care?',
            type: 'scale',
            weight: 1.3,
            options: [
              { value: 1, label: 'I rarely think about protection responsibilities' },
              { value: 3, label: 'I acknowledge it but don\'t actively prepare' },
              { value: 5, label: 'I take it seriously and make basic preparations' },
              { value: 7, label: 'I prioritize it highly and train/prepare regularly' },
              { value: 10, label: 'It\'s a core identity - I\'m always prepared and vigilant' }
            ]
          },
          
          // PROVIDER - Consistent resource generation
          {
            id: 'provider_1',
            cluster: 'reproductiveConfidence',
            subcategory: 'provider',
            text: 'How stable and consistent is your income/resource generation?',
            type: 'scale',
            weight: 1.5,
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
            weight: 1.3,
            options: [
              { value: 1, label: 'Not at all - I struggle to support myself' },
              { value: 3, label: 'Minimally - I could barely manage' },
              { value: 5, label: 'Adequately - I could make it work with adjustments' },
              { value: 7, label: 'Well prepared - I could comfortably support a family' },
              { value: 10, label: 'Fully prepared - I actively plan for family provision' }
            ]
          },
          
          // PARENTAL INVESTOR - Willingness and competence in offspring rearing
          {
            id: 'parental_1',
            cluster: 'reproductiveConfidence',
            subcategory: 'parentalInvestor',
            text: 'How committed are you to the idea of being an active, involved father?',
            type: 'scale',
            weight: 1.2,
            options: [
              { value: 1, label: 'Not interested or committed to fatherhood' },
              { value: 3, label: 'Open to it but uncertain about involvement level' },
              { value: 5, label: 'Willing and would be reasonably involved' },
              { value: 7, label: 'Committed to being highly involved and present' },
              { value: 10, label: 'Passionate about fatherhood as a core life purpose' }
            ]
          },
          {
            id: 'parental_2',
            cluster: 'reproductiveConfidence',
            subcategory: 'parentalInvestor',
            text: 'How well do you interact with and relate to children?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'Poorly - I avoid children and feel uncomfortable' },
              { value: 3, label: 'Awkwardly - I can manage but prefer not to' },
              { value: 5, label: 'Adequately - I\'m fine with children in small doses' },
              { value: 7, label: 'Well - I enjoy spending time with and teaching children' },
              { value: 10, label: 'Naturally - Children gravitate to me and I mentor them' }
            ]
          }
        ]
      },

      // PHASE 3: Axis of Attraction - Display Signals
      axisOfAttraction: {
        title: "Axis of Attraction Assessment",
        subtitle: "Display Signals",
        description: "This phase evaluates the immediate signals you display that attract or repel potential mates.",
        questions: [
          // PERFORMANCE/STATUS SIGNALS
          {
            id: 'status_1',
            cluster: 'axisOfAttraction',
            subcategory: 'performanceStatus',
            text: 'How would you rate your current social status and influence?',
            type: 'scale',
            weight: 1.3,
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
            text: 'How productive and accomplished are you in your primary pursuits?',
            type: 'scale',
            weight: 1.2,
            options: [
              { value: 1, label: 'Minimal productivity or achievement' },
              { value: 3, label: 'Below average - Struggling to make progress' },
              { value: 5, label: 'Average - Steady progress and moderate success' },
              { value: 7, label: 'High - Consistent achievements and recognition' },
              { value: 10, label: 'Exceptional - Top performer with significant accomplishments' }
            ]
          },
          {
            id: 'status_3',
            cluster: 'axisOfAttraction',
            subcategory: 'performanceStatus',
            text: 'How generous are you with resources, time, and expertise?',
            type: 'scale',
            weight: 1.0,
            options: [
              { value: 1, label: 'Not generous - I rarely share or help others' },
              { value: 3, label: 'Selectively generous - Only with close friends/family' },
              { value: 5, label: 'Moderately generous - I help when asked' },
              { value: 7, label: 'Very generous - I actively look for ways to help' },
              { value: 10, label: 'Exceptionally generous - Giving is core to my identity' }
            ]
          },
          {
            id: 'status_4',
            cluster: 'axisOfAttraction',
            subcategory: 'performanceStatus',
            text: 'What is your current financial capacity to "fluff the nest" (home quality, lifestyle, experiences)?',
            type: 'scale',
            weight: 1.4,
            options: [
              { value: 1, label: 'Minimal - Struggling with basics' },
              { value: 3, label: 'Limited - Can afford modest living' },
              { value: 5, label: 'Comfortable - Can provide quality living' },
              { value: 7, label: 'Affluent - Can provide excellent lifestyle' },
              { value: 10, label: 'Wealthy - Can provide luxury and abundance' }
            ]
          },
          
          // PHYSICAL/GENETIC SIGNALS
          {
            id: 'physical_1',
            cluster: 'axisOfAttraction',
            subcategory: 'physicalGenetic',
            text: 'How would you honestly rate your physical attractiveness (face, build, overall aesthetics)?',
            type: 'scale',
            weight: 1.4,
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
            weight: 1.3,
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
            text: 'How well do you maintain your grooming, style, and overall presentation?',
            type: 'scale',
            weight: 1.1,
            options: [
              { value: 1, label: 'Poorly - Neglected appearance' },
              { value: 3, label: 'Basic - Minimal effort in presentation' },
              { value: 5, label: 'Adequate - Clean and presentable' },
              { value: 7, label: 'Well-groomed - Intentional style and care' },
              { value: 10, label: 'Impeccable - Exceptional attention to presentation' }
            ]
          },
          {
            id: 'physical_4',
            cluster: 'axisOfAttraction',
            subcategory: 'physicalGenetic',
            text: 'How would you rate your overall health and vitality (energy, resilience, longevity indicators)?',
            type: 'scale',
            weight: 1.2,
            options: [
              { value: 1, label: 'Poor - Chronic health issues, low energy' },
              { value: 3, label: 'Below average - Frequent illness or fatigue' },
              { value: 5, label: 'Average - Generally healthy' },
              { value: 7, label: 'Excellent - High energy, rarely sick' },
              { value: 10, label: 'Optimal - Peak health, exceptional vitality' }
            ]
          }
        ]
      }
    };
  }

  /**
   * ========================================================================
   * FEMALE ASSESSMENT QUESTIONS
   * ========================================================================
   */
  getFemaleQuestions() {
    return {
      // PHASE 1: Coalition Rank (3S's) - Female-Female Hierarchy
      coalitionRank: {
        title: "Coalition Rank Assessment",
        subtitle: "Female-Female Hierarchy Determinants (3S's)",
        description: "This phase evaluates your standing among female peers through social influence, selectivity, and status signaling.",
        questions: [
          // SOCIAL INFLUENCE - Control over perceptions and alliances
          {
            id: 'social_1',
            cluster: 'coalitionRank',
            subcategory: 'socialInfluence',
            text: 'How much influence do you have over social narratives and group opinions?',
            type: 'scale',
            weight: 1.3,
            options: [
              { value: 1, label: 'Minimal - I\'m often excluded or ignored in social settings' },
              { value: 3, label: 'Limited - I participate but rarely shape conversations' },
              { value: 5, label: 'Moderate - People listen to me and sometimes follow my lead' },
              { value: 7, label: 'Significant - I regularly influence group decisions and opinions' },
              { value: 10, label: 'Dominant - I\'m a social leader who shapes perceptions' }
            ]
          },
          {
            id: 'social_2',
            cluster: 'coalitionRank',
            subcategory: 'socialInfluence',
            text: 'How effectively can you build and maintain beneficial alliances?',
            type: 'scale',
            weight: 1.2,
            options: [
              { value: 1, label: 'Poorly - I struggle to form or keep alliances' },
              { value: 3, label: 'Limited - I have a few unstable relationships' },
              { value: 5, label: 'Adequately - I maintain a small, stable social circle' },
              { value: 7, label: 'Well - I build strong networks across multiple groups' },
              { value: 10, label: 'Masterfully - I create and leverage powerful alliances' }
            ]
          },
          {
            id: 'social_3',
            cluster: 'coalitionRank',
            subcategory: 'socialInfluence',
            text: 'How often do other women seek your advice or validation?',
            type: 'scale',
            weight: 1.1,
            options: [
              { value: 1, label: 'Rarely - I\'m usually seeking others\' input' },
              { value: 3, label: 'Occasionally - Sometimes for basic things' },
              { value: 5, label: 'Regularly - Friends often ask my opinion' },
              { value: 7, label: 'Frequently - I\'m a trusted advisor to many' },
              { value: 10, label: 'Constantly - I\'m seen as a wisdom source and mentor' }
            ]
          },
          
          // SELECTIVITY & MATE GUARDING - Ability to attract and retain top males
          {
            id: 'selectivity_1',
            cluster: 'coalitionRank',
            subcategory: 'selectivity',
            text: 'How successful are you at attracting high-quality male attention?',
            type: 'scale',
            weight: 1.4,
            options: [
              { value: 1, label: 'Unsuccessful - I receive little quality male attention' },
              { value: 3, label: 'Limited - Occasional interest from average men' },
              { value: 5, label: 'Moderate - Regular interest from decent quality men' },
              { value: 7, label: 'High - Frequent attention from high-value men' },
              { value: 10, label: 'Exceptional - Top-tier men actively pursue me' }
            ]
          },
          {
            id: 'selectivity_2',
            cluster: 'coalitionRank',
            subcategory: 'selectivity',
            text: 'How effectively can you maintain a high-value man\'s interest long-term?',
            type: 'scale',
            weight: 1.3,
            options: [
              { value: 1, label: 'Poorly - Men lose interest quickly' },
              { value: 3, label: 'Limited - Struggle to keep quality men engaged' },
              { value: 5, label: 'Adequately - Can maintain interest with effort' },
              { value: 7, label: 'Well - High-value men stay committed' },
              { value: 10, label: 'Masterfully - Men become deeply invested and loyal' }
            ]
          },
          {
            id: 'selectivity_3',
            cluster: 'coalitionRank',
            subcategory: 'selectivity',
            text: 'How well do you defend against female rivals and maintain your position?',
            type: 'scale',
            weight: 1.2,
            options: [
              { value: 1, label: 'Poorly - Often undermined by other women' },
              { value: 3, label: 'Limited - Some vulnerability to rivals' },
              { value: 5, label: 'Adequately - Can hold my ground most of the time' },
              { value: 7, label: 'Well - Effectively neutralize competitive threats' },
              { value: 10, label: 'Dominantly - Other women defer to me' }
            ]
          },
          
          // STATUS SIGNALING - Strategic display without triggering sabotage
          {
            id: 'status_signal_1',
            cluster: 'coalitionRank',
            subcategory: 'statusSignaling',
            text: 'How well do you display your value without triggering jealousy or sabotage?',
            type: 'scale',
            weight: 1.3,
            options: [
              { value: 1, label: 'Poorly - Either invisible or create resentment' },
              { value: 3, label: 'Limited - Struggle to balance visibility and backlash' },
              { value: 5, label: 'Adequately - Manage perception reasonably well' },
              { value: 7, label: 'Skillfully - Project value while maintaining alliances' },
              { value: 10, label: 'Masterfully - Command respect without creating enemies' }
            ]
          },
          {
            id: 'status_signal_2',
            cluster: 'coalitionRank',
            subcategory: 'statusSignaling',
            text: 'How strategic are you in managing your reputation and social image?',
            type: 'scale',
            weight: 1.2,
            options: [
              { value: 1, label: 'Not strategic - My reputation suffers from neglect' },
              { value: 3, label: 'Minimally - I react to reputation issues defensively' },
              { value: 5, label: 'Moderately - I maintain a decent public image' },
              { value: 7, label: 'Highly - I actively curate and protect my reputation' },
              { value: 10, label: 'Expertly - I control my narrative across all contexts' }
            ]
          }
        ]
      },

      // PHASE 2: Reproductive Confidence - Male Selection Criteria
      reproductiveConfidence: {
        title: "Reproductive Confidence Assessment",
        subtitle: "Male Selection Criteria",
        description: "This phase evaluates traits that men assess for long-term investment and commitment.",
        questions: [
          // PATERNITY CERTAINTY - Signals of loyalty and exclusivity
          {
            id: 'paternity_1',
            cluster: 'reproductiveConfidence',
            subcategory: 'paternityCertainty',
            text: 'How loyal and faithful are you in committed relationships?',
            type: 'scale',
            weight: 1.5,
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
            text: 'How transparent and honest are you about your past and present?',
            type: 'scale',
            weight: 1.3,
            options: [
              { value: 1, label: 'Very secretive - Hide significant information' },
              { value: 3, label: 'Selectively honest - Conceal some important details' },
              { value: 5, label: 'Generally honest with occasional omissions' },
              { value: 7, label: 'Very transparent - Open about almost everything' },
              { value: 10, label: 'Completely honest - Full disclosure is my standard' }
            ]
          },
          {
            id: 'paternity_3',
            cluster: 'reproductiveConfidence',
            subcategory: 'paternityCertainty',
            text: 'How exclusive is your attention when in a committed relationship?',
            type: 'scale',
            weight: 1.4,
            options: [
              { value: 1, label: 'Non-exclusive - I maintain multiple romantic interests' },
              { value: 3, label: 'Mostly exclusive but keep options open' },
              { value: 5, label: 'Exclusive with occasional wandering attention' },
              { value: 7, label: 'Fully exclusive - No romantic attention to others' },
              { value: 10, label: 'Completely devoted - Partner is my sole focus' }
            ]
          },
          
          // NURTURING STANDARD - Alignment with mother imprint
          {
            id: 'nurture_1',
            cluster: 'reproductiveConfidence',
            subcategory: 'nurturingStandard',
            text: 'How warm, caring, and nurturing are you toward a partner?',
            type: 'scale',
            weight: 1.3,
            options: [
              { value: 1, label: 'Cold - I rarely show affection or care' },
              { value: 3, label: 'Limited - Some warmth but generally distant' },
              { value: 5, label: 'Moderate - I show care but it\'s inconsistent' },
              { value: 7, label: 'Very nurturing - I actively care for my partner' },
              { value: 10, label: 'Exceptionally nurturing - Caregiving is natural to me' }
            ]
          },
          {
            id: 'nurture_2',
            cluster: 'reproductiveConfidence',
            subcategory: 'nurturingStandard',
            text: 'How would you rate your domestic skills (cooking, homemaking, creating comfort)?',
            type: 'scale',
            weight: 1.2,
            options: [
              { value: 1, label: 'Very poor - I lack basic domestic capabilities' },
              { value: 3, label: 'Limited - Can manage basics but not well' },
              { value: 5, label: 'Adequate - Competent in essential domestic tasks' },
              { value: 7, label: 'Skilled - I create a quality home environment' },
              { value: 10, label: 'Exceptional - Domestic excellence is my strength' }
            ]
          },
          {
            id: 'nurture_3',
            cluster: 'reproductiveConfidence',
            subcategory: 'nurturingStandard',
            text: 'How naturally do you provide emotional support and comfort?',
            type: 'scale',
            weight: 1.2,
            options: [
              { value: 1, label: 'Poorly - I struggle with emotional support' },
              { value: 3, label: 'Limited - I try but it doesn\'t come naturally' },
              { value: 5, label: 'Adequately - I provide decent emotional support' },
              { value: 7, label: 'Well - I\'m naturally good at emotional nurturing' },
              { value: 10, label: 'Exceptionally - Emotional support is my gift' }
            ]
          },
          
          // COLLABORATIVE TRUST EFFICIENCY - Low-conflict cooperation
          {
            id: 'collab_1',
            cluster: 'reproductiveConfidence',
            subcategory: 'collaborativeTrust',
            text: 'How well do you cooperate with a partner without creating drama or conflict?',
            type: 'scale',
            weight: 1.4,
            options: [
              { value: 1, label: 'Poorly - Constant conflict and drama' },
              { value: 3, label: 'Limited - Frequent disagreements and tension' },
              { value: 5, label: 'Adequately - Some conflict but generally workable' },
              { value: 7, label: 'Well - Low conflict, high cooperation' },
              { value: 10, label: 'Seamlessly - We work together like a unified team' }
            ]
          },
          {
            id: 'collab_2',
            cluster: 'reproductiveConfidence',
            subcategory: 'collaborativeTrust',
            text: 'How efficiently can you resolve disagreements without waste (time, energy, goodwill)?',
            type: 'scale',
            weight: 1.3,
            options: [
              { value: 1, label: 'Very inefficient - Conflicts drag on endlessly' },
              { value: 3, label: 'Limited - Resolution is slow and draining' },
              { value: 5, label: 'Adequate - Eventually resolve but with some waste' },
              { value: 7, label: 'Efficient - Quick resolution with minimal damage' },
              { value: 10, label: 'Highly efficient - Conflicts resolve quickly and cleanly' }
            ]
          },
          {
            id: 'collab_3',
            cluster: 'reproductiveConfidence',
            subcategory: 'collaborativeTrust',
            text: 'How trustworthy are you with shared resources and joint decisions?',
            type: 'scale',
            weight: 1.4,
            options: [
              { value: 1, label: 'Untrustworthy - History of mismanagement or betrayal' },
              { value: 3, label: 'Questionable - Some trust violations' },
              { value: 5, label: 'Generally trustworthy with occasional lapses' },
              { value: 7, label: 'Very trustworthy - Reliable steward of shared interests' },
              { value: 10, label: 'Completely trustworthy - Perfect track record' }
            ]
          }
        ]
      },

      // PHASE 3: Axis of Attraction - Male Mate Choice Filters
      axisOfAttraction: {
        title: "Axis of Attraction Assessment",
        subtitle: "Male Mate Choice Filters",
        description: "This phase evaluates the fertility signals and stability indicators you display.",
        questions: [
          // FERTILITY & HEALTH CUES (Hot)
          {
            id: 'fertility_1',
            cluster: 'axisOfAttraction',
            subcategory: 'fertility',
            text: 'How would you honestly rate your physical attractiveness and feminine beauty?',
            type: 'scale',
            weight: 1.5,
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
            weight: 1.4,
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
            text: 'How healthy are your skin, hair, and overall physical vitality?',
            type: 'scale',
            weight: 1.3,
            options: [
              { value: 1, label: 'Poor - Visible health issues' },
              { value: 3, label: 'Below average - Some health concerns' },
              { value: 5, label: 'Average - Generally healthy appearance' },
              { value: 7, label: 'Excellent - Glowing health and vitality' },
              { value: 10, label: 'Radiant - Exceptional health markers' }
            ]
          },
          {
            id: 'fertility_4',
            cluster: 'axisOfAttraction',
            subcategory: 'fertility',
            text: 'How well do you maintain your appearance, grooming, and feminine presentation?',
            type: 'scale',
            weight: 1.2,
            options: [
              { value: 1, label: 'Poorly - Neglected appearance' },
              { value: 3, label: 'Minimal - Basic hygiene only' },
              { value: 5, label: 'Adequate - Clean and presentable' },
              { value: 7, label: 'Well-maintained - Intentional feminine style' },
              { value: 10, label: 'Impeccable - Exceptional attention to beauty' }
            ]
          },
          {
            id: 'fertility_5',
            cluster: 'axisOfAttraction',
            subcategory: 'fertility',
            text: 'What is your age relative to peak fertility (early 20s = highest)?',
            type: 'scale',
            weight: 1.6,
            options: [
              { value: 1, label: '40+ years old' },
              { value: 3, label: '35-39 years old' },
              { value: 5, label: '30-34 years old' },
              { value: 7, label: '25-29 years old' },
              { value: 10, label: '18-24 years old' }
            ]
          },
          
          // RISK COST INDICATORS (Crazy)
          {
            id: 'risk_1',
            cluster: 'axisOfAttraction',
            subcategory: 'riskCost',
            text: 'How emotionally stable and predictable are you?',
            type: 'scale',
            weight: 1.5,
            reverseScore: true, // Lower instability = better score
            options: [
              { value: 10, label: 'Very unstable - Frequent emotional crises and volatility' },
              { value: 7, label: 'Somewhat unstable - Regular mood swings and drama' },
              { value: 5, label: 'Moderately stable - Occasional emotional episodes' },
              { value: 3, label: 'Quite stable - Rare emotional disruptions' },
              { value: 1, label: 'Very stable - Consistently calm and predictable' }
            ]
          },
          {
            id: 'risk_2',
            cluster: 'axisOfAttraction',
            subcategory: 'riskCost',
            text: 'How high is your partner count (sexual and romantic)?',
            type: 'scale',
            weight: 1.4,
            reverseScore: true,
            options: [
              { value: 10, label: '20+ partners' },
              { value: 7, label: '10-19 partners' },
              { value: 5, label: '5-9 partners' },
              { value: 3, label: '2-4 partners' },
              { value: 1, label: '0-1 partners' }
            ]
          },
          {
            id: 'risk_3',
            cluster: 'axisOfAttraction',
            subcategory: 'riskCost',
            text: 'How present are red flags (substance abuse, mental health issues, destructive patterns)?',
            type: 'scale',
            weight: 1.5,
            reverseScore: true,
            options: [
              { value: 10, label: 'Multiple severe red flags' },
              { value: 7, label: 'Several moderate red flags' },
              { value: 5, label: 'A few minor red flags' },
              { value: 3, label: 'Very few, manageable issues' },
              { value: 1, label: 'No significant red flags' }
            ]
          },
          {
            id: 'risk_4',
            cluster: 'axisOfAttraction',
            subcategory: 'riskCost',
            text: 'How likely are you to create conflict, drama, or sabotage in relationships?',
            type: 'scale',
            weight: 1.4,
            reverseScore: true,
            options: [
              { value: 10, label: 'Very high - I often create drama and conflict' },
              { value: 7, label: 'High - Regular relationship turbulence' },
              { value: 5, label: 'Moderate - Occasional drama' },
              { value: 3, label: 'Low - Rare conflicts' },
              { value: 1, label: 'Very low - I actively avoid and resolve conflicts' }
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
    
    // Hide intro, show gender selection
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

    // Add event listeners
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
    this.currentPhase = 0;
    this.responses = {};
    
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
                  <span class="option-value">${opt.value}/10</span>
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

    // Save response
    const questionId = input.name;
    this.responses[questionId] = parseInt(input.value);

    // Move to next question
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

    // Save final response
    const questionId = input.name;
    this.responses[questionId] = parseInt(input.value);

    // Move to next phase or generate report
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
   * SCORING AND ANALYSIS ENGINE
   * ========================================================================
   */
  calculateAndShowResults() {
    console.log('Calculating results...');
    console.log('Responses:', this.responses);

    const scores = this.calculateScores();
    console.log('Calculated scores:', scores);

    this.displayResults(scores);
  }

  calculateScores() {
    const questions = this.currentGender === 'male' ? this.getMaleQuestions() : this.getFemaleQuestions();
    const scores = {
      overall: 0,
      clusters: {},
      subcategories: {},
      rawData: {}
    };

    // Initialize structure
    Object.keys(questions).forEach(clusterName => {
      scores.clusters[clusterName] = { weighted: 0, raw: 0, count: 0 };
      scores.subcategories[clusterName] = {};
    });

    // Calculate scores
    Object.keys(questions).forEach(clusterName => {
      const phase = questions[clusterName];
      
      phase.questions.forEach(q => {
        const response = this.responses[q.id];
        if (response === undefined) return;

        // Apply reverse scoring if needed
        const actualValue = q.reverseScore ? (11 - response) : response;
        const weightedValue = actualValue * (q.weight || 1.0);

        // Initialize subcategory if needed
        if (!scores.subcategories[clusterName][q.subcategory]) {
          scores.subcategories[clusterName][q.subcategory] = {
            weighted: 0,
            raw: 0,
            count: 0,
            questions: []
          };
        }

        // Add to subcategory
        scores.subcategories[clusterName][q.subcategory].weighted += weightedValue;
        scores.subcategories[clusterName][q.subcategory].raw += actualValue;
        scores.subcategories[clusterName][q.subcategory].count++;
        scores.subcategories[clusterName][q.subcategory].questions.push({
          id: q.id,
          text: q.text,
          response: response,
          actualValue: actualValue,
          weight: q.weight
        });

        // Add to cluster
        scores.clusters[clusterName].weighted += weightedValue;
        scores.clusters[clusterName].raw += actualValue;
        scores.clusters[clusterName].count++;

        // Store raw response
        scores.rawData[q.id] = {
          response: response,
          actualValue: actualValue,
          weighted: weightedValue,
          cluster: clusterName,
          subcategory: q.subcategory
        };
      });
    });

    // Calculate averages
    Object.keys(scores.clusters).forEach(clusterName => {
      const cluster = scores.clusters[clusterName];
      cluster.average = cluster.count > 0 ? cluster.raw / cluster.count : 0;
      cluster.weightedAverage = cluster.count > 0 ? cluster.weighted / cluster.count : 0;

      Object.keys(scores.subcategories[clusterName]).forEach(subcatName => {
        const subcat = scores.subcategories[clusterName][subcatName];
        subcat.average = subcat.count > 0 ? subcat.raw / subcat.count : 0;
        subcat.weightedAverage = subcat.count > 0 ? subcat.weighted / subcat.count : 0;
      });
    });

    // Calculate overall score (weighted average of clusters)
    const clusterAverages = Object.values(scores.clusters).map(c => c.weightedAverage);
    scores.overall = clusterAverages.reduce((a, b) => a + b, 0) / clusterAverages.length;

    // Add percentile rankings (approximate)
    scores.percentile = this.calculatePercentile(scores.overall);

    return scores;
  }

  calculatePercentile(score) {
    // Approximate percentile based on score
    // Assumes normal distribution with mean=5.5, sd=2
    if (score >= 9) return 95;
    if (score >= 8) return 85;
    if (score >= 7) return 70;
    if (score >= 6) return 55;
    if (score >= 5) return 40;
    if (score >= 4) return 25;
    if (score >= 3) return 15;
    return 5;
  }

  /**
   * ========================================================================
   * RESULTS DISPLAY
   * ========================================================================
   */
  displayResults(scores) {
    const container = document.getElementById('questionContainer');
    const resultsSection = document.getElementById('resultsSection');
    
    if (container) container.style.display = 'none';
    if (resultsSection) resultsSection.style.display = 'block';

    this.renderResultsDashboard(scores);
    this.renderDetailedAnalysis(scores);
    this.renderActionableInsights(scores);

    // Setup export handlers
    this.setupExportHandlers(scores);

    // Scroll to results
    window.scrollTo(0, 0);
  }

  renderResultsDashboard(scores) {
    const container = document.getElementById('resultsContent');
    if (!container) return;

    const questions = this.currentGender === 'male' ? this.getMaleQuestions() : this.getFemaleQuestions();
    
    let html = `
      <div class="results-dashboard">
        <div class="results-header">
          <h2>Your Attraction Profile</h2>
          <p class="results-subtitle">${this.currentGender === 'male' ? 'Male' : 'Female'} Assessment Results</p>
        </div>

        <div class="overall-score-card">
          <div class="score-display">
            <div class="score-number">${scores.overall.toFixed(1)}</div>
            <div class="score-label">Overall Attraction Score</div>
            <div class="score-percentile">~${scores.percentile}th Percentile</div>
          </div>
          <div class="score-interpretation">
            ${this.getOverallInterpretation(scores.overall, this.currentGender)}
          </div>
        </div>

        <div class="cluster-scores">
          <h3>Cluster Breakdown</h3>
          ${Object.keys(questions).map((clusterName, index) => {
            const phase = questions[clusterName];
            const cluster = scores.clusters[clusterName];
            return `
              <div class="cluster-card">
                <div class="cluster-header">
                  <h4>${phase.title}</h4>
                  <span class="cluster-score">${cluster.weightedAverage.toFixed(1)}/10</span>
                </div>
                <div class="cluster-bar">
                  <div class="cluster-bar-fill" style="width: ${cluster.weightedAverage * 10}%; background: ${this.getScoreColor(cluster.weightedAverage)}"></div>
                </div>
                <p class="cluster-description">${this.getClusterInterpretation(clusterName, cluster.weightedAverage, this.currentGender)}</p>
                
                <div class="subcategory-scores">
                  ${Object.keys(scores.subcategories[clusterName]).map(subcatName => {
                    const subcat = scores.subcategories[clusterName][subcatName];
                    return `
                      <div class="subcategory-row">
                        <span class="subcat-name">${this.formatSubcategory(subcatName)}</span>
                        <span class="subcat-score">${subcat.weightedAverage.toFixed(1)}</span>
                        <div class="subcat-bar">
                          <div class="subcat-bar-fill" style="width: ${subcat.weightedAverage * 10}%; background: ${this.getScoreColor(subcat.weightedAverage)}"></div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  getScoreColor(score) {
    if (score >= 8) return '#2ecc71'; // Excellent - Green
    if (score >= 6) return '#3498db'; // Good - Blue
    if (score >= 4) return '#f39c12'; // Average - Orange
    return '#e74c3c'; // Needs work - Red
  }

  getOverallInterpretation(score, gender) {
    if (score >= 8.5) {
      return `<p><strong>Exceptional.</strong> You possess strong attraction fundamentals across all dimensions. You're likely highly successful in ${gender === 'male' ? 'securing female interest and maintaining high status among males' : 'attracting quality male attention and maintaining strong social positioning'}.</p>`;
    } else if (score >= 7) {
      return `<p><strong>Strong.</strong> You have solid attraction fundamentals with room for optimization. You're above average in ${gender === 'male' ? 'both male hierarchies and female selection criteria' : 'both securing commitment and social positioning'}.</p>`;
    } else if (score >= 5.5) {
      return `<p><strong>Average.</strong> You have decent attraction fundamentals but significant room for improvement. Focus on strengthening your weakest clusters for better results.</p>`;
    } else if (score >= 4) {
      return `<p><strong>Below Average.</strong> You face challenges in attraction dynamics. This assessment identifies specific areas requiring urgent attention and development.</p>`;
    } else {
      return `<p><strong>Needs Significant Work.</strong> Multiple critical deficiencies require immediate attention. Use the detailed analysis below to prioritize your development path.</p>`;
    }
  }

  getClusterInterpretation(clusterName, score, gender) {
    const interpretations = {
      male: {
        coalitionRank: {
          high: "You command strong respect among men through demonstrated courage, self-control, and competence. Other males recognize your capability and are likely to ally with or defer to you.",
          mid: "You maintain reasonable standing among male peers but lack dominance. Building courage, discipline, and problem-solving capacity will elevate your position.",
          low: "You struggle for respect in male hierarchies. This limits your access to resources, alliances, and ultimately, female selection. Focus on building courage and competence."
        },
        reproductiveConfidence: {
          high: "You strongly signal provider, protector, and parental investment capacity. Women seeking long-term commitment will perceive you as high-value for genetic legacy.",
          mid: "You show moderate potential as a long-term mate but lack compelling signals in one or more P dimensions. Strengthen your weakest areas to improve female evaluation.",
          low: "Women will hesitate to invest long-term due to weak signals of protection, provision, or parental capacity. This severely limits relationship depth and commitment."
        },
        axisOfAttraction: {
          high: "You display strong initial attraction signals through status, resources, and physical presentation. You likely generate significant female interest on first impression.",
          mid: "Your display signals are adequate but not compelling. Improving physical fitness, status, or wealth presentation will significantly boost initial attraction.",
          low: "Weak display signals limit initial female interest. Without strong first impressions, you never get the chance to demonstrate deeper value. Prioritize visible improvements."
        }
      },
      female: {
        coalitionRank: {
          high: "You wield significant influence among women and successfully navigate female social hierarchies. You defend your position against rivals and command respect.",
          mid: "You maintain stable social positioning but lack dominance. Building stronger alliances and more strategic status signaling will elevate your position.",
          low: "You struggle in female social hierarchies, making you vulnerable to sabotage and limiting your ability to retain high-value male attention."
        },
        reproductiveConfidence: {
          high: "You strongly signal loyalty, nurturing capacity, and collaborative partnership. Men seeking long-term commitment will perceive you as low-risk, high-reward.",
          mid: "You show moderate potential as a long-term partner but raise some concerns. Addressing loyalty signals or nurturing capacity will improve male commitment.",
          low: "Men will hesitate to commit resources long-term due to concerns about loyalty, collaboration, or nurturing. This limits relationship stability and male investment."
        },
        axisOfAttraction: {
          high: "You display strong fertility signals and minimal risk indicators. Men find you highly attractive for both short-term and long-term consideration.",
          mid: "Your attraction signals are mixed - good fertility markers but some risk flags, or vice versa. Optimizing both dimensions will significantly improve male interest.",
          low: "Weak fertility signals and/or high risk indicators severely limit male attraction. Physical optimization and stability are critical priorities."
        }
      }
    };

    const genderMaps = interpretations[gender];
    if (!genderMaps || !genderMaps[clusterName]) return '';

    const cluster = genderMaps[clusterName];
    if (score >= 7) return cluster.high;
    if (score >= 5) return cluster.mid;
    return cluster.low;
  }

  renderDetailedAnalysis(scores) {
    const container = document.getElementById('resultsContent');
    if (!container) return;

    // Find strengths and weaknesses
    const allSubcats = [];
    Object.keys(scores.subcategories).forEach(clusterName => {
      Object.keys(scores.subcategories[clusterName]).forEach(subcatName => {
        const subcat = scores.subcategories[clusterName][subcatName];
        allSubcats.push({
          cluster: clusterName,
          subcategory: subcatName,
          score: subcat.weightedAverage,
          label: this.formatSubcategory(subcatName)
        });
      });
    });

    allSubcats.sort((a, b) => b.score - a.score);
    const strengths = allSubcats.slice(0, 3);
    const weaknesses = allSubcats.slice(-3).reverse();

    const analysisHtml = `
      <div class="detailed-analysis">
        <h3>Detailed Analysis</h3>
        
        <div class="strength-weakness-grid">
          <div class="strength-column">
            <h4>Top Strengths</h4>
            ${strengths.map(s => `
              <div class="strength-item">
                <div class="sw-header">
                  <span class="sw-label">${s.label}</span>
                  <span class="sw-score" style="color: ${this.getScoreColor(s.score)}">${s.score.toFixed(1)}/10</span>
                </div>
                <p class="sw-description">${this.getSubcategoryGuidance(s.subcategory, s.score, this.currentGender, true)}</p>
              </div>
            `).join('')}
          </div>

          <div class="weakness-column">
            <h4>Priority Development Areas</h4>
            ${weaknesses.map(w => `
              <div class="weakness-item">
                <div class="sw-header">
                  <span class="sw-label">${w.label}</span>
                  <span class="sw-score" style="color: ${this.getScoreColor(w.score)}">${w.score.toFixed(1)}/10</span>
                </div>
                <p class="sw-description">${this.getSubcategoryGuidance(w.subcategory, w.score, this.currentGender, false)}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', analysisHtml);
  }

  getSubcategoryGuidance(subcategory, score, gender, isStrength) {
    // This would be a large mapping of specific guidance for each subcategory
    // For brevity, providing a template approach
    if (isStrength) {
      return `This is a key strength. Continue to develop and leverage this advantage in your attraction strategy.`;
    } else {
      return `This area requires development. Focus here to see significant improvement in overall attraction dynamics.`;
    }
  }

  renderActionableInsights(scores) {
    const container = document.getElementById('resultsContent');
    if (!container) return;

    const insights = this.generateActionableInsights(scores, this.currentGender);

    const insightsHtml = `
      <div class="actionable-insights">
        <h3>Actionable Development Path</h3>
        <p class="insights-intro">Based on your assessment, here are prioritized actions to improve your attraction profile:</p>

        <div class="insights-grid">
          ${insights.map((insight, index) => `
            <div class="insight-card priority-${insight.priority}">
              <div class="insight-header">
                <span class="insight-number">${index + 1}</span>
                <span class="insight-priority">${insight.priority} Priority</span>
              </div>
              <h4>${insight.title}</h4>
              <p class="insight-why"><strong>Why:</strong> ${insight.rationale}</p>
              <div class="insight-actions">
                <strong>Actions:</strong>
                <ul>
                  ${insight.actions.map(action => `<li>${action}</li>`).join('')}
                </ul>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', insightsHtml);
  }

  generateActionableInsights(scores, gender) {
    // Generate prioritized insights based on scores
    const insights = [];

    // Analyze clusters and subcategories to find critical gaps
    Object.keys(scores.subcategories).forEach(clusterName => {
      Object.keys(scores.subcategories[clusterName]).forEach(subcatName => {
        const subcat = scores.subcategories[clusterName][subcatName];
        if (subcat.weightedAverage < 5) {
          // Critical area
          insights.push(this.getInsightForSubcategory(clusterName, subcatName, subcat.weightedAverage, gender, 'Critical'));
        } else if (subcat.weightedAverage < 7) {
          // Important area
          insights.push(this.getInsightForSubcategory(clusterName, subcatName, subcat.weightedAverage, gender, 'High'));
        }
      });
    });

    // Sort by priority and score (lowest first within priority)
    insights.sort((a, b) => {
      const priorityOrder = { 'Critical': 1, 'High': 2, 'Medium': 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.score - b.score;
    });

    return insights.slice(0, 5); // Top 5 insights
  }

  getInsightForSubcategory(cluster, subcategory, score, gender, priority) {
    // Template insight - in production, this would be a comprehensive mapping
    return {
      priority: priority,
      score: score,
      title: `Improve ${this.formatSubcategory(subcategory)}`,
      rationale: `This dimension scores ${score.toFixed(1)}/10, significantly limiting your overall attraction profile.`,
      actions: [
        'Specific action 1 based on subcategory',
        'Specific action 2 based on subcategory',
        'Specific action 3 based on subcategory'
      ]
    };
  }

  /**
   * ========================================================================
   * EXPORT FUNCTIONALITY
   * ========================================================================
   */
  setupExportHandlers(scores) {
    const jsonBtn = document.getElementById('exportJSON');
    const csvBtn = document.getElementById('exportCSV');
    const briefBtn = document.getElementById('exportExecutiveBrief');
    const newBtn = document.getElementById('newAssessment');

    if (jsonBtn) {
      jsonBtn.addEventListener('click', () => this.exportJSON(scores));
    }
    if (csvBtn) {
      csvBtn.addEventListener('click', () => this.exportCSV(scores));
    }
    if (briefBtn) {
      briefBtn.addEventListener('click', () => this.exportExecutiveBrief(scores));
    }
    if (newBtn) {
      newBtn.addEventListener('click', () => this.resetAssessment());
    }
  }

  exportJSON(scores) {
    const data = {
      gender: this.currentGender,
      timestamp: new Date().toISOString(),
      responses: this.responses,
      scores: scores
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attraction-assessment-${this.currentGender}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  }

  exportCSV(scores) {
    let csv = 'Category,Subcategory,Score,Interpretation\n';
    
    Object.keys(scores.subcategories).forEach(clusterName => {
      Object.keys(scores.subcategories[clusterName]).forEach(subcatName => {
        const subcat = scores.subcategories[clusterName][subcatName];
        csv += `"${clusterName}","${subcatName}",${subcat.weightedAverage.toFixed(2)},"${this.getScoreLabel(subcat.weightedAverage)}"\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attraction-assessment-${this.currentGender}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  exportExecutiveBrief(scores) {
    // Generate a comprehensive PDF-style text report
    let brief = `ATTRACTION ASSESSMENT - EXECUTIVE BRIEF\n`;
    brief += `${'='.repeat(80)}\n\n`;
    brief += `Assessment Date: ${new Date().toISOString().split('T')[0]}\n`;
    brief += `Gender: ${this.currentGender.toUpperCase()}\n`;
    brief += `Overall Score: ${scores.overall.toFixed(1)}/10 (~${scores.percentile}th percentile)\n\n`;

    brief += `EXECUTIVE SUMMARY\n`;
    brief += `${'-'.repeat(80)}\n`;
    brief += this.getOverallInterpretation(scores.overall, this.currentGender).replace(/<[^>]*>/g, '') + '\n\n';

    brief += `CLUSTER ANALYSIS\n`;
    brief += `${'-'.repeat(80)}\n`;
    Object.keys(scores.clusters).forEach(clusterName => {
      const cluster = scores.clusters[clusterName];
      brief += `\n${clusterName.toUpperCase()}: ${cluster.weightedAverage.toFixed(1)}/10\n`;
      brief += this.getClusterInterpretation(clusterName, cluster.weightedAverage, this.currentGender).replace(/<[^>]*>/g, '') + '\n';
    });

    const blob = new Blob([brief], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attraction-brief-${this.currentGender}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  }

  getScoreLabel(score) {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Average';
    return 'Needs Development';
  }

  resetAssessment() {
    // Reset all state
    this.currentGender = null;
    this.currentPhase = 0;
    this.responses = {};
    this.scores = {};
    this.currentQuestionIndex = 0;

    // Hide results, show intro
    const intro = document.getElementById('introSection');
    const assessment = document.getElementById('assessmentSection');
    const results = document.getElementById('resultsSection');

    if (intro) intro.style.display = 'block';
    if (assessment) assessment.style.display = 'none';
    if (results) results.style.display = 'none';

    window.scrollTo(0, 0);
  }
}

// Auto-initialize
console.log('attraction-engine.js loaded');
