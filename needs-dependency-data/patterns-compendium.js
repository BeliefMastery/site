// Patterns Compendium
// From BM-Appendix1.html: Patterns Compendium - Human Coping Strategies
// Each pattern includes: narrative, impact, likely unmet needs, compulsions, aversions, potential triggers, likely vice expression
// STRICT PROPRIETARY VOCABULARY - MUST BE ADHERED TO

// This is a comprehensive but not exhaustive list. The full compendium contains many more patterns.
// Patterns are organized by category for easier navigation.

export const PATTERNS_COMPENDIUM = {
  // Insecurity Management Strategies - Avoidance/Evasion
  'Defeat': {
    category: 'Insecurity Management - Avoidance/Evasion',
    narrative: 'Not this again. I hate this pattern. I can\'t seem to change it no matter what I do. This is agonizing, and I don\'t want to look at it.',
    impact: 'Overwhelmed by failure, you feel trapped in a cycle, leading to avoidance, stagnation, and self-loathing.',
    needs: ['Support', 'Clarity', 'Acceptance', 'Compassion', 'Self-Respect', 'Understanding', 'To Matter', 'Growth'],
    compulsions: 'Seeking external validation to temporarily alleviate feelings of inadequacy or engaging in distraction behaviors to escape the feeling of failure.',
    aversions: 'Avoiding tasks, challenges, or self-reflection that might expose inadequacies, preferring to retreat into familiar routines or isolation.',
    triggers: ['Criticism from others', 'Encountering situations that require performance', 'Being compared to others'],
    viceExpression: ['Anxiety', 'Shame', 'Worthlessness', 'Fear', 'Anguish']
  },
  'Rationalization': {
    category: 'Insecurity Management - Avoidance/Evasion',
    narrative: 'This issue isn\'t really a problem. Everyone has weaknesses, and this one doesn\'t affect me much.',
    impact: 'By downplaying the problem, you justify inaction, preventing meaningful change or growth.',
    needs: ['Self-Respect', 'Acceptance', 'Clarity', 'Compassion', 'Understanding', 'Being Right'],
    compulsions: 'Seeking comfort in complacency or justifying behaviors to avoid the discomfort of growth and change.',
    aversions: 'Avoiding situations that challenge the status quo or require acknowledging areas of weakness.',
    triggers: ['Confrontations where flaws are pointed out', 'Situations demanding accountability', 'Being faced with others\' progress'],
    viceExpression: ['Bitterness', 'Resentment', 'Frustration', 'Guilt', 'Disappointment']
  },
  'By-passing / Surrendered Acceptance': {
    category: 'Insecurity Management - Avoidance/Evasion',
    narrative: 'I\'m okay. I don\'t need to focus on this. We\'re all perfect the way we are, and these issues will resolve naturally.',
    impact: 'This mindset promotes passivity, fostering the belief that no active effort is required. It creates a false sense of peace while neglecting meaningful self-improvement.',
    needs: ['Self-Respect', 'Closeness', 'Support', 'Clarity', 'Compassion'],
    compulsions: 'Seeking out environments or situations where you can remain passive and avoid confrontation, gravitating toward relationships that don\'t challenge you to grow.',
    aversions: 'Avoiding conversations about personal development, conflict, or any situation that may demand effort or change, as they disrupt the illusion of peace.',
    triggers: ['Confrontation', 'Being asked to take responsibility', 'Witnessing others\' growth or progress', 'Feeling pressured to change', 'Experiencing failure'],
    viceExpression: ['Sloth', 'Anxiety', 'Anguish', 'Resentment', 'Frustration']
  },
  'Comparative Disregard': {
    category: 'Insecurity Management - Avoidance/Evasion',
    narrative: 'I have other qualities in abundance. This shortfall is minor in comparison, and I make up for it in other ways. No stress. It\'s not a priority. Ya can\'t have everything.',
    impact: 'In this response, the individual minimizes the issue by focusing on their strengths. While this may temporarily avoid the problem, it can lead to complacency and an unwillingness to confront areas that need attention.',
    needs: ['Self-Respect', 'Acceptance', 'Appreciation', 'Clarity', 'Community'],
    compulsions: 'Highlighting personal strengths or achievements to deflect attention from areas needing improvement, seeking validation through comparison.',
    aversions: 'Avoiding direct engagement with weaknesses or areas of failure, as this would challenge the self-image that has been built around strengths.',
    triggers: ['Situations where shortcomings are highlighted', 'Being compared unfavorably to others', 'Facing criticism'],
    viceExpression: ['Resentment', 'Disappointment', 'Frustration', 'Guilt', 'Anxiety']
  },
  'Avoidant Optimism': {
    category: 'Insecurity Management - Avoidance/Evasion',
    narrative: 'Things will get better on their own, and I\'ll handle it later.',
    impact: 'This response involves deferring responsibility to the future, hoping that circumstances will improve without active intervention. This tendency leads to prolonged stagnation.',
    needs: ['Clarity', 'Self-Respect', 'Support', 'Trust', 'Companionship'],
    compulsions: 'Engaging in distraction tactics (e.g., excessive screen time, overworking, or seeking temporary relief through other activities) as a way to avoid facing unresolved issues.',
    aversions: 'Avoiding planning, goal setting, or discussions that focus on addressing challenges directly, as these activities would require immediate action.',
    triggers: ['Deadlines', 'Increased responsibility', 'Feeling pressured to take action', 'Seeing others achieving goals that you\'ve deferred'],
    viceExpression: ['Fear', 'Anxiety', 'Sloth', 'Disappointment', 'Frustration']
  },
  
  // Insecurity Management Strategies - Perfectionism/Overcompensation
  'Perfectionism': {
    category: 'Insecurity Management - Perfectionism/Overcompensation',
    narrative: 'I need to fix this completely or it\'s worthless. If I can\'t do it perfectly, why even try?',
    impact: 'The fear of imperfection can lead to either paralyzing inaction or an obsessive pursuit of unattainable ideals, blocking constructive progress.',
    needs: ['Self-Respect', 'Competence', 'Acceptance', 'Support', 'Clarity', 'Safety', 'Stability', 'To Matter', 'Ease', 'Order', 'Approval', 'Being Esteemed'],
    compulsions: 'Overworking or fixating on details in an attempt to perfect an outcome and prove self-worth.',
    aversions: 'Avoiding tasks where there is a risk of not achieving perfection, leading to procrastination or opting out entirely.',
    triggers: ['Feedback or critique from others', 'High-stakes situations where performance is measured', 'Seeing others succeed'],
    viceExpression: ['Fear', 'Anxiety', 'Shame', 'Frustration', 'Inferiority']
  },
  'Overcompensation': {
    category: 'Insecurity Management - Perfectionism/Overcompensation',
    narrative: 'If I double down on another area of strength, this problem won\'t matter.',
    impact: 'Instead of confronting the failing, a person may overcompensate in another area to offset feelings of inadequacy. This approach can provide temporary relief but ultimately reinforces avoidance of the core issue.',
    needs: ['Self-Respect', 'Acceptance', 'Community', 'Support', 'Love', 'Security', 'Independence', 'Appreciation', 'Growth', 'Competence', 'Contribution', 'Being Esteemed'],
    compulsions: 'Focusing intensely on excelling in specific areas as a way to distract from vulnerabilities, seeking approval or success in unrelated domains to feel secure.',
    aversions: 'Avoiding scenarios that would require addressing personal weaknesses or taking responsibility for failures.',
    triggers: ['Feedback indicating a lack of skill or competence in certain areas', 'Being placed in situations that highlight perceived inadequacies', 'Facing situations where support is not provided'],
    viceExpression: ['Anger', 'Bitterness', 'Anxiety', 'Shame', 'Inferiority']
  },
  
  // Insecurity Management Strategies - Blame/Externalization
  'Projection': {
    category: 'Insecurity Management - Blame/Externalization',
    narrative: 'It\'s not me - it\'s them. I\'m only struggling because of the people or circumstances around me.',
    impact: 'Projection shifts blame onto others, externalizing responsibility for one\'s own failings. This pattern avoids personal accountability, making it difficult to confront or address the underlying issue.',
    needs: ['Self-Respect', 'Closeness', 'Support', 'Trust', 'Compassion', 'Safety', 'Empathy', 'Acceptance', 'Understanding', 'Being Right', 'Stability'],
    compulsions: 'Attempting to control others\' behaviors or situations to feel secure, monitoring or criticizing those around you as a means of maintaining perceived control.',
    aversions: 'Avoiding self-reflection or accountability, fearing that acknowledging your own role might expose vulnerability or inadequacy.',
    triggers: ['Conflicts with others', 'Feeling undermined or unsupported', 'Situations where expectations are not met', 'When others behave unpredictably'],
    viceExpression: ['Anger', 'Resentment', 'Anxiety', 'Bitterness', 'Frustration']
  },
  
  // Insecurity Management Strategies - Sabotage
  'Destructive Actions': {
    category: 'Insecurity Management - Sabotage',
    narrative: 'I know this will ruin things, but I don\'t deserve to have this anyway.',
    impact: 'This behavior involves intentionally or subconsciously acting out in ways that disrupt relationships or opportunities. It often serves to confirm negative beliefs about oneself, making failure or rejection feel inevitable and deserved.',
    needs: ['Self-Respect', 'Belonging', 'Love', 'Support', 'Acceptance'],
    compulsions: 'Seeking validation through destructive means, such as picking fights, testing others\' loyalty to extreme degrees, or engaging in risky behaviors that jeopardize relationships or opportunities.',
    aversions: 'Avoiding open communication, vulnerable discussions, or situations that may require self-reflection and accountability, as these would challenge the self-sabotaging narrative.',
    triggers: ['Moments of intimacy', 'Success', 'Positive feedback', 'Fear of being seen as "enough"', 'Situations where one is expected to accept support or trust others'],
    viceExpression: ['Rage', 'Anguish', 'Guilt', 'Shame', 'Desperation']
  },
  'Chaos Creation': {
    category: 'Insecurity Management - Sabotage',
    narrative: 'If I create chaos, at least I have control over the outcome.',
    impact: 'In this response, the individual disrupts stability by provoking conflicts or creating unpredictable situations. This can be an attempt to gain a sense of control or to pre-emptively end relationships, ensuring rejection occurs on their terms.',
    needs: ['Self-Respect', 'Stability', 'Trust', 'Closeness', 'Support'],
    compulsions: 'Stirring up drama or conflict to force a rupture in relationships or environments, as a way to align external circumstances with internal chaos.',
    aversions: 'Avoiding stable or predictable relationships and situations, as they challenge the belief that instability is inevitable or deserved.',
    triggers: ['Experiencing stability', 'Receiving care or acceptance', 'Feeling seen or valued', 'Moments where one is required to maintain harmony'],
    viceExpression: ['Bitterness', 'Anger', 'Resentment', 'Fear', 'Disgust']
  },
  
  // Resilient Response
  'Confident Approach': {
    category: 'Resilient Response',
    narrative: 'Alright! I\'m willing to try again to address this weakness! If I don\'t have the tools, I\'ll find them. I believe in myself, even though I\'ve failed before. I\'ll make myself proud. I am the author of my future.',
    impact: 'This inspires willingness for taking on challenges, maintaining an optimistic and proactive mindset, and pursuing growth despite previous setbacks. There is a focus on self-improvement and resilience.',
    needs: ['Self-Respect', 'Autonomy', 'Growth', 'Clarity'],
    compulsions: ['Overworking or pushing oneself beyond healthy limits to prove autonomy and competence', 'Seeking constant opportunities for growth and self-improvement, sometimes at the cost of rest or balance', 'Pursuing challenging situations repeatedly, even when they may not serve long-term well-being, to affirm self-trust and resilience'],
    aversions: ['Avoiding situations that don\'t offer clear opportunities for growth or autonomy, as they may feel limiting or stifling', 'Steering clear of environments where one\'s control or independence may be undermined, as these can trigger discomfort or frustration'],
    triggers: ['Situations where autonomy is restricted or where one feels micromanaged', 'Encounters where one\'s competence is questioned or where growth opportunities are blocked', 'Moments of failure or setbacks that challenge self-trust and the belief in one\'s capacity to overcome difficulties'],
    viceExpression: ['Anxiety', 'Frustration', 'Impatience', 'Worthlessness'] // if unmet needs persist
  },
  
  // Imprints of Childhood: Constraining Patterns in Adulthood
  'Low Confidence': {
    category: 'Imprints of Childhood',
    pattern: 'Finds it hard to feel secure in oneself, seeking external validation (compulsion) or avoiding challenges (aversion) due to fear of failure. This may stem from not being celebrated or encouraged as a child.',
    needs: ['Self-Respect', 'Appreciation', 'Acceptance', 'Support', 'Closeness', 'Companionship', 'Security', 'Encouragement', 'Clarity', 'Trust'],
    compulsions: 'Seeking constant reassurance, praise, or approval from others to feel valued.',
    aversions: 'Avoiding challenging tasks, unfamiliar situations, or feedback that could expose perceived inadequacies.',
    triggers: ['Receiving critical feedback or negative evaluations', 'Being compared to others or put in competitive situations', 'Facing unfamiliar challenges or high-stakes tasks', 'Not receiving recognition or praise for efforts', 'Experiencing situations where others are praised while feeling overlooked'],
    viceExpression: ['Anxiety', 'Inferiority', 'Shame', 'Fear', 'Frustration']
  },
  'Dependence on Others': {
    category: 'Imprints of Childhood',
    pattern: 'Finds it hard to make independent decisions or handle challenges without external guidance, possibly due to not being encouraged toward autonomy in childhood.',
    needs: ['Independence', 'Self-Respect', 'Support', 'Acceptance', 'Closeness', 'Trust', 'Security', 'Stability', 'Belonging', 'Companionship', 'Respect~Self-respect', 'Empathy', 'Autonomy'],
    compulsions: 'Clinging to authority figures, seeking advice excessively, or relying on others for decision-making to feel secure.',
    aversions: 'Avoiding situations where they must act alone or take full responsibility, as it triggers feelings of inadequacy or anxiety.',
    triggers: ['Situations where independent decision-making is required', 'Being left without guidance or support in challenging scenarios', 'Expectations to take responsibility without external validation', 'Instances where trusted figures are unavailable or unresponsive', 'Pressure to make a significant or impactful choice alone'],
    viceExpression: ['Worthlessness', 'Guilt', 'Anguish', 'Desperation', 'Anxiety']
  },
  'Lack of Empathy': {
    category: 'Imprints of Childhood',
    pattern: 'Finds it hard to emotionally connect with others or form meaningful relationships, likely due to a lack of empathetic response or understanding from caregivers during childhood.',
    needs: ['Empathy', 'Understanding', 'Closeness', 'Communication', 'Support', 'Community', 'Connection', 'Compassion', 'Companionship', 'Self-Respect'],
    compulsions: 'Seeking out relationships where emotional needs are excessively catered to, trying to recreate the connection they didn\'t receive.',
    aversions: 'Avoiding emotionally intense situations or deep conversations that require vulnerability or empathetic response, fearing discomfort or inability to connect.',
    triggers: ['Being confronted with others\' emotional needs or vulnerabilities', 'Situations that require active listening or emotional engagement', 'Perceived criticism about emotional unavailability or detachment', 'Witnessing or being part of emotionally intense interactions', 'Attempts by others to deepen the relationship or establish intimacy'],
    viceExpression: ['Bitterness', 'Anger', 'Resentment', 'Disappointment', 'Frustration']
  },
  'Fear of Challenges': {
    category: 'Imprints of Childhood',
    pattern: 'Finds it hard to engage with difficulties, often feeling overwhelmed by obstacles. This may be the result of overprotection or insufficient encouragement to face challenges in childhood.',
    needs: ['Self-Respect', 'Growth', 'Support', 'Clarity', 'Acceptance', 'Safety', 'Encouragement', 'Competence', 'Challenge', 'Understanding'],
    compulsions: 'Seeking easy wins or avoiding challenges altogether, preferring situations where they are guaranteed success or comfort.',
    aversions: 'Avoiding risk-taking, new ventures, or situations where they could potentially fail, as these scenarios amplify their sense of vulnerability.',
    triggers: ['High-pressure situations with uncertain outcomes', 'Opportunities that require risk-taking or stepping outside of comfort zones', 'Perceived pressure to perform or achieve at a high standard', 'Encounters with competitive or demanding environments', 'Experiences of failure or being reminded of past mistakes'],
    viceExpression: ['Fear', 'Anxiety', 'Shame', 'Disappointment', 'Sloth']
  },
  'Lack of Practical Wisdom': {
    category: 'Imprints of Childhood',
    pattern: 'Struggles with making sound decisions or navigating practical life situations, possibly due to not being taught problem-solving skills or being overprotected in childhood.',
    needs: ['Clarity', 'Competence', 'Understanding', 'Authenticity', 'Presence', 'Support']
  }
  
  // Note: Many more patterns exist in the full compendium including:
  // - Emotional Detachment
  // - Persistent Self-Criticism
  // - Avoidance of Responsibility
  // - Creative Stagnation
  // - Attachment patterns (Secure, Anxious, Avoidant, Disorganized)
  // - Various forms of neglect and abuse patterns
  // - And many more...
};

