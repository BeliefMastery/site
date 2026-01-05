// Core Temperament Dimensions
// Questions that map position on masculine-feminine spectrum across various life dimensions
// Reframed as situational prompts to avoid triggering keyword associations

export const TEMPERAMENT_DIMENSIONS = {
  // Core Behavioral Patterns
  direction_and_structure: {
    name: 'Direction and Structure',
    description: 'Preference for establishing direction, order, and structure vs. flowing with what emerges',
    questions: [
      {
        id: 'dir_1',
        question: 'Imagine planning a significant project or journey. What feels more natural: creating a detailed roadmap with specific steps and deadlines, or keeping plans flexible and adapting as circumstances unfold?',
        masculineWeight: 1.0,
        feminineWeight: -0.8
      },
      {
        id: 'dir_2',
        question: 'When unexpected opportunities arise, how do you typically respond: by evaluating them against your existing plans, or by allowing yourself to explore where they might lead?',
        masculineWeight: -0.9,
        feminineWeight: 1.0
      },
      {
        id: 'dir_3',
        question: 'In a collaborative setting where roles are unclear, what feels more comfortable: stepping in to define who does what, or waiting to see how things naturally organize themselves?',
        masculineWeight: 1.0,
        feminineWeight: -0.7
      },
      {
        id: 'dir_4',
        question: 'When making a decision, what feels more authentic: having clear criteria and boundaries to guide you, or staying open to possibilities and letting the situation reveal what\'s needed?',
        masculineWeight: -0.8,
        feminineWeight: 1.0
      }
    ]
  },
  
  provision_and_nurture: {
    name: 'Provision and Nurture',
    description: 'Tendency toward providing/protecting vs. nurturing/receiving',
    questions: [
      {
        id: 'prov_1',
        question: 'When someone close to you faces difficulty, what feels more natural: taking practical action to solve their problems and secure resources, or offering emotional presence and understanding?',
        masculineWeight: 1.0,
        feminineWeight: -0.6
      },
      {
        id: 'prov_2',
        question: 'In a moment when someone you care about seems distressed, what feels more authentic: addressing the emotional tone and creating a sense of warmth and safety, or focusing on the practical aspects of what needs to happen next?',
        masculineWeight: -0.7,
        feminineWeight: 1.0
      },
      {
        id: 'prov_3',
        question: 'When you\'re going through a difficult time yourself, how comfortable are you with others taking care of practical matters for you, versus handling things independently even when help is offered?',
        masculineWeight: -0.8,
        feminineWeight: 1.0
      },
      {
        id: 'prov_4',
        question: 'Imagine a scenario where people depend on you. What feels more natural: feeling responsible for their security and well-being, or being present to support them while they find their own way?',
        masculineWeight: 1.0,
        feminineWeight: 0.3
      }
    ]
  },
  
  focus_and_expression: {
    name: 'Focus and Expression',
    description: 'Tendency toward focused action vs. expressive flow',
    questions: [
      {
        id: 'foc_1',
        question: 'When working on something important, what feels more natural: maintaining clear objectives and working steadily toward a defined outcome, or allowing the process to unfold and evolve organically?',
        masculineWeight: 1.0,
        feminineWeight: -0.8
      },
      {
        id: 'foc_2',
        question: 'In conversations about meaningful experiences, what feels more authentic: sharing your emotional responses and what you felt, or discussing the facts and what happened?',
        masculineWeight: -0.7,
        feminineWeight: 1.0
      },
      {
        id: 'foc_3',
        question: 'When strong emotions arise during a task that requires completion, what feels more natural: setting the feelings aside to maintain focus on the goal, or allowing the emotions to inform how you approach the task?',
        masculineWeight: 1.0,
        feminineWeight: -0.6
      },
      {
        id: 'foc_4',
        question: 'Imagine receiving difficult feedback. What feels more authentic: processing your emotional response first, or analyzing the information logically before allowing feelings to surface?',
        masculineWeight: -0.8,
        feminineWeight: 1.0
      }
    ]
  },
  
  certainty_and_clarity: {
    name: 'Certainty and Clarity',
    description: 'Need for certainty/direction vs. need for clarity/richness',
    questions: [
      {
        id: 'cert_1',
        question: 'When entering an unfamiliar situation, what helps you feel more secure: knowing exactly what to expect and having a clear plan, or trusting that you\'ll navigate it as it unfolds?',
        masculineWeight: 0.8,
        feminineWeight: -0.5
      },
      {
        id: 'cert_2',
        question: 'In a relationship or connection, what helps you feel more at ease: understanding where things stand, what\'s expected, and how the other person feels, or being comfortable with some ambiguity?',
        masculineWeight: -0.3,
        feminineWeight: 1.0
      },
      {
        id: 'cert_3',
        question: 'When outcomes are uncertain, what feels more natural: feeling anxious until you can gain more information, or remaining relatively calm and trusting the process?',
        masculineWeight: -0.6,
        feminineWeight: 0.4
      },
      {
        id: 'cert_4',
        question: 'When others seem uncertain or unclear, what feels more natural: offering structure and clear direction to help them find their footing, or providing space for them to discover clarity on their own?',
        masculineWeight: 1.0,
        feminineWeight: -0.4
      }
    ]
  },
  
  shame_and_fear: {
    name: 'Shame and Fear Sensitivity',
    description: 'Primary vulnerability: shame (masculine) vs. fear/isolation (feminine)',
    questions: [
      {
        id: 'vuln_1',
        question: 'Imagine failing publicly or being perceived as incompetent. What feels more difficult: the sense of having lost respect or status, or the feeling of being exposed and vulnerable?',
        masculineWeight: 1.0,
        feminineWeight: -0.3
      },
      {
        id: 'vuln_2',
        question: 'In moments when connection feels threatened, what feels more difficult: the fear of being alone or abandoned, or the sense of having lost your footing or place in the relationship?',
        masculineWeight: -0.4,
        feminineWeight: 1.0
      },
      {
        id: 'vuln_3',
        question: 'When you make a mistake that affects others, what feels worse: the sense that you\'ve let people down or shown weakness, or the uncertainty about whether others will still accept you?',
        masculineWeight: 1.0,
        feminineWeight: 0.2
      },
      {
        id: 'vuln_4',
        question: 'Imagine being in a situation where someone\'s intentions toward you are unclear. What creates more anxiety: not knowing where you stand with them, or not understanding what they might do next?',
        masculineWeight: -0.3,
        feminineWeight: 1.0
      }
    ]
  },
  
  achievement_and_connection: {
    name: 'Achievement and Connection',
    description: 'Drive for achievement/mastery vs. drive for connection/belonging',
    questions: [
      {
        id: 'ach_1',
        question: 'When you accomplish something significant, what feels more satisfying: the recognition and validation from others, or the sense of personal mastery and competence?',
        masculineWeight: 1.0,
        feminineWeight: -0.5
      },
      {
        id: 'ach_2',
        question: 'In your relationships, what feels more important: creating harmony and feeling deeply connected, or achieving mutual goals and building something together?',
        masculineWeight: -0.6,
        feminineWeight: 1.0
      },
      {
        id: 'ach_3',
        question: 'Imagine being in a competitive environment. What feels more natural: engaging fully in the competition and striving to excel, or finding ways to collaborate and minimize hierarchy?',
        masculineWeight: 1.0,
        feminineWeight: -0.7
      },
      {
        id: 'ach_4',
        question: 'When spending time with someone you care about, what feels more fulfilling: having deep, emotionally intimate conversations, or working together on shared projects or activities?',
        masculineWeight: -0.7,
        feminineWeight: 1.0
      }
    ]
  },
  
  control_and_flow: {
    name: 'Control and Flow',
    description: 'Preference for control/mastery vs. flow/receptivity',
    questions: [
      {
        id: 'ctrl_1',
        question: 'When outcomes matter, what feels more natural: taking steps to ensure things go according to plan, or staying present and responding to what emerges?',
        masculineWeight: 1.0,
        feminineWeight: -0.8
      },
      {
        id: 'ctrl_2',
        question: 'Imagine being in a situation where someone else is making decisions. What feels more comfortable: trusting their judgment and going with the flow, or needing to understand and potentially influence the direction?',
        masculineWeight: -0.9,
        feminineWeight: 1.0
      },
      {
        id: 'ctrl_3',
        question: 'When facing challenges, what feels more authentic: analyzing the situation and developing strategies to master it, or staying open to what the situation might teach you?',
        masculineWeight: 1.0,
        feminineWeight: -0.6
      },
      {
        id: 'ctrl_4',
        question: 'In moments of uncertainty, what feels more natural: having faith that things will work out as they should, or taking action to influence the outcome?',
        masculineWeight: -0.7,
        feminineWeight: 1.0
      }
    ]
  },
  
  independence_and_interdependence: {
    name: 'Independence and Interdependence',
    description: 'Preference for independence/autonomy vs. interdependence/connection',
    questions: [
      {
        id: 'ind_1',
        question: 'When facing a challenge, what feels more natural: handling it yourself first and asking for help only if needed, or naturally involving others in problem-solving?',
        masculineWeight: 1.0,
        feminineWeight: -0.5
      },
      {
        id: 'ind_2',
        question: 'In relationships, what feels more authentic: maintaining your own space and autonomy while being connected, or naturally blending lives and creating interdependence?',
        masculineWeight: -0.5,
        feminineWeight: 1.0
      },
      {
        id: 'ind_3',
        question: 'When you need support, how comfortable are you with: relying on others to help carry the load, versus managing independently even when support is available?',
        masculineWeight: -0.8,
        feminineWeight: 0.7
      },
      {
        id: 'ind_4',
        question: 'Imagine others depending on you for important matters. What feels more natural: being the one others rely on for stability and direction, or sharing responsibility more equally?',
        masculineWeight: 0.8,
        feminineWeight: 0.3
      }
    ]
  },
  
  logic_and_intuition: {
    name: 'Logic and Intuition',
    description: 'Preference for logic/reason vs. intuition/feeling',
    questions: [
      {
        id: 'log_1',
        question: 'When making an important decision, what feels more natural: gathering information, analyzing options, and using systematic thinking, or tuning into your feelings and inner sense of what\'s right?',
        masculineWeight: 1.0,
        feminineWeight: -0.6
      },
      {
        id: 'log_2',
        question: 'Imagine getting a "gut feeling" about something. How much do you typically: trust and act on that feeling, versus analyzing it logically before proceeding?',
        masculineWeight: -0.7,
        feminineWeight: 1.0
      },
      {
        id: 'log_3',
        question: 'When presented with a new idea, what feels more authentic: understanding how it works and examining it systematically, or sensing whether it feels right before diving into the details?',
        masculineWeight: 1.0,
        feminineWeight: -0.5
      },
      {
        id: 'log_4',
        question: 'In moments when logic and feeling conflict, what feels more trustworthy: your analytical assessment of the situation, or your intuitive sense of what\'s true?',
        masculineWeight: -0.8,
        feminineWeight: 1.0
      }
    ]
  },
  
  stability_and_movement: {
    name: 'Stability and Movement',
    description: 'Preference for stability/steadiness vs. movement/change',
    questions: [
      {
        id: 'stab_1',
        question: 'When life feels chaotic, what helps you feel more grounded: having routines and predictable structures, or allowing yourself to move with the energy and find your balance dynamically?',
        masculineWeight: 1.0,
        feminineWeight: -0.4
      },
      {
        id: 'stab_2',
        question: 'Imagine your environment or circumstances changing frequently. What feels more natural: finding it energizing and dynamic, or preferring more consistency and predictability?',
        masculineWeight: -0.6,
        feminineWeight: 1.0
      },
      {
        id: 'stab_3',
        question: 'When others around you feel unsteady, what feels more natural: providing a stabilizing presence and steady direction, or being present to their experience and responding to their needs?',
        masculineWeight: 1.0,
        feminineWeight: 0.2
      },
      {
        id: 'stab_4',
        question: 'In a group setting, what feels more authentic: maintaining your own steady presence regardless of the energy around you, or naturally picking up and responding to the emotional tone of the group?',
        masculineWeight: -0.7,
        feminineWeight: 1.0
      }
    ]
  }
};
