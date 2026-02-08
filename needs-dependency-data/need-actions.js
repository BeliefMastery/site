// Practical actions for addressing loop need and root need
// Used by Dependency Loop Tracer Action Strategies
// Keys match need text (case-insensitive lookup); fallback by category

const titleCase = (s) => String(s || '').replace(/\b\w/g, c => c.toUpperCase()).trim();

export const NEED_LOOP_ACTIONS = {
  'Acceptance': ['Pause before seeking validation; ask "Do I need this response to feel OK?"', 'Notice when you change yourself to fit in; choose one situation to show up as you are', 'Reduce people-pleasing by saying no to one low-stakes request daily', 'Identify one person whose approval you can release dependence on'],
  'Affection': ['Notice when you seek touch or closeness to fill a void; pause and breathe', 'Create non-dependent ways to receive warmth (self-care, pets, nature)', 'Set a boundary: one interaction per day where you give affection without expecting return', 'Track compulsive intimacy-seeking; introduce a delay before acting'],
  'Appreciation': ['Stop overworking for acknowledgment; do one invisible act of contribution', 'Notice when you downplay achievements; practice stating one win without apology', 'Reduce dependence on external praise by writing one self-acknowledgment daily', 'Identify situations where you seek recognition and add a pause'],
  'Belonging': ['Notice sacrificing individuality for acceptance; reclaim one preference or boundary', 'Reduce group-hopping; commit to one community or relationship more deeply', 'Practice belonging without merging: attend one gathering as yourself, not as chameleon', 'Create solo rituals that affirm "I belong to myself"'],
  'Autonomy': ['Make one small decision daily without seeking permission or validation', 'Set a boundary: protect 15–30 min of unscheduled time for yourself', 'Notice when you over-commit to avoid freedom; decline one request', 'Identify one area where you defer to others and take the lead'],
  'Connection': ['Reduce over-sharing; share one thing and sit with the silence', 'Notice avoidance of intimacy; initiate one low-stakes connection', 'Create connection that doesn\'t drain: one quality interaction without expectation', 'Practice receiving without reciprocating immediately'],
  'Safety': ['Identify one situation where safety-seeking limits your life; take a small calculated risk', 'Notice hypervigilance; practice grounding (feet on floor, breath) before reacting', 'Reduce avoidance by entering one feared-but-safe situation', 'Create internal safety through routine: one predictable daily anchor'],
  'Approval': ['Delay seeking approval; act first, then notice the urge to check in', 'Identify whose approval matters most; practice one action without their validation', 'Notice approval-seeking in conversation; reduce by 50% one day', 'Write down one thing you did well without telling anyone'],
  'Control': ['Release one small thing you control; observe what happens', 'Notice when control masks fear; name the fear and sit with it', 'Reduce over-planning: allow one 30-min block to be unstructured', 'Practice asking for help instead of doing it yourself'],
  'Security': ['Identify one way you over-secure (money, relationships, routines); loosen slightly', 'Notice when security-seeking prevents growth; take one small step into uncertainty', 'Create security from within: one daily practice that grounds you', 'Reduce checking behaviors; set a limit (e.g. check bank once per day)'],
  'Validation': ['Pause before sharing to get a reaction; ask "Am I sharing to connect or to be validated?"', 'Notice when you need others to confirm your worth; write one self-validation', 'Reduce social-media validation-seeking; post one thing without checking likes', 'Identify one arena where you depend on external validation; meet it yourself first'],
  'Love': ['Notice when you seek love to fill a void; practice loving yourself in that moment', 'Reduce conditional giving: give one act of love without expectation of return', 'Create non-dependent love: care for someone without needing them to need you', 'Practice receiving love without deflecting or minimizing'],
  'Support': ['Identify one thing you always ask others to do; try doing it yourself or finding another way', 'Notice when you seek support to avoid discomfort; sit with the discomfort once', 'Reduce over-reliance: solve one small problem without consulting anyone', 'Build self-support: one resource or skill that reduces dependence'],
  'Purpose': ['Notice when purpose-seeking becomes escapism; ground in one mundane task', 'Reduce the need for grand purpose; find meaning in one small action today', 'Identify when you chase purpose externally; ask "What would purpose look like from within?"', 'Practice purpose without performance: do one meaningful thing without sharing'],
  'Certainty': ['Tolerate one moment of uncertainty without resolving it immediately', 'Notice when you seek certainty to reduce anxiety; breathe and stay', 'Reduce over-researching; make one small decision with incomplete information', 'Practice "good enough" instead of "certain" in one area'],
  'Competence': ['Notice perfectionism; complete one task at 80% and let it go', 'Reduce over-working to prove yourself; do one thing without showing anyone', 'Identify when you avoid challenges; take one small step into discomfort', 'Practice receiving feedback without collapsing or defending'],
  'Independence': ['Notice when you refuse help to prove independence; accept one offer', 'Reduce isolation; reach out to one person without it being transactional', 'Identify when independence masks fear of reliance; experiment with healthy dependence', 'Practice interdependence: ask for one thing you could do yourself'],
  'Freedom': ['Notice when you resist authority reflexively; choose one instance of constructive compliance', 'Reduce over-commitment that kills freedom; clear one obligation', 'Identify what freedom would look like; take one concrete step toward it', 'Practice freedom within constraint: find one way to choose within limits'],
  'Rest': ['Notice when you cannot rest; schedule one non-negotiable rest block', 'Reduce guilt about resting; take 15 min without productivity', 'Identify what prevents rest; address one barrier', 'Practice rest as authorship: choose how you restore'],
  'Space': ['Claim one physical or temporal space as yours; defend it', 'Notice when you give away all your space; reclaim 30 min', 'Reduce people-pleasing that invades space; say no to one request', 'Create a ritual that marks "my space" (corner, walk, door closed)']
};

export const NEED_ROOT_ACTIONS = {
  'Acceptance': ['Build self-acceptance practice: daily affirmation or mirror work', 'Create relationships where you can be yourself without performing', 'Develop internal acceptance before seeking it externally', 'Reduce environments that demand you change to belong'],
  'Affection': ['Schedule regular self-nurturing: massage, warmth, gentle touch (self or trusted other)', 'Build affection into daily life: hug a tree, hold a cup of tea, pet an animal', 'Create non-romantic sources of warmth: friends, family, community', 'Develop capacity to receive; practice receiving one compliment fully'],
  'Appreciation': ['Build self-appreciation ritual: end each day with three things you did well', 'Create work or contribution that aligns with your values (intrinsic reward)', 'Reduce dependence on external milestones; find satisfaction in process', 'Develop appreciation for yourself independent of output'],
  'Belonging': ['Choose one community that aligns with your values; show up consistently', 'Create belonging through contribution: give before you take', 'Build relationships where you can be fully yourself', 'Develop "belonging to self" through identity work and boundaries'],
  'Autonomy': ['Audit your life: where are you giving away choice? Reclaim one area', 'Build decision-making muscle: make small choices without consulting', 'Create financial, emotional, or practical buffers that increase independence', 'Develop clarity on your values so choices come from within'],
  'Connection': ['Schedule regular quality time with people who see you', 'Create connection rituals: weekly call, monthly meal, annual retreat', 'Build depth in fewer relationships rather than breadth in many', 'Develop capacity for solitude so connection is chosen, not needed'],
  'Safety': ['Create physical and emotional safety through routine and environment', 'Build resources: savings, skills, support network', 'Address past trauma or anxiety with professional support if needed', 'Develop internal safety through grounding, breathwork, and self-regulation'],
  'Approval': ['Reduce time with people whose approval you depend on; or change the dynamic', 'Build self-trust: keep small promises to yourself daily', 'Create work or identity that doesn\'t depend on others\' opinions', 'Develop intrinsic validation through values alignment'],
  'Control': ['Identify what you can control (your response) vs. what you cannot; release the latter', 'Build adaptability: practice responding to change without over-planning', 'Create systems that reduce need for micromanagement', 'Develop trust in process; allow outcomes to unfold'],
  'Security': ['Build financial security: emergency fund, reduce debt, diversify income', 'Create relational security: repair trust, set clear expectations', 'Develop internal security through self-reliance and competence', 'Address existential insecurity through meaning-making or spiritual practice'],
  'Validation': ['Build self-validation: journal, therapy, or coaching that strengthens inner voice', 'Create work or art that satisfies you regardless of audience', 'Reduce exposure to validation-seeking environments (e.g. social media)', 'Develop intrinsic worth through values-based living'],
  'Love': ['Build self-love practice: compassion, boundaries, self-care', 'Create loving relationships that are mutual and sustainable', 'Develop capacity to give and receive love without fusion', 'Address blocks to receiving love (therapy, inner work)'],
  'Support': ['Build support network: identify 2–3 people you can rely on', 'Develop skills that reduce dependence: learn, practice, get coaching', 'Create systems: automation, routines, delegation', 'Address the belief that needing support is weakness'],
  'Purpose': ['Clarify values and purpose through reflection or guided process', 'Create daily alignment: one action that connects to larger meaning', 'Build purpose from within rather than role or title', 'Develop tolerance for purpose that evolves; don\'t freeze it'],
  'Certainty': ['Build tolerance for uncertainty through exposure and practice', 'Create anchors: routines, relationships, beliefs that ground you', 'Develop "good enough" decision-making; reduce analysis paralysis', 'Address anxiety or control issues with professional support'],
  'Competence': ['Invest in skill-building: courses, practice, feedback', 'Create environments where you can grow without constant evaluation', 'Develop growth mindset: mistakes as learning', 'Address imposter syndrome or perfectionism with support'],
  'Independence': ['Build practical independence: skills, finances, decision-making', 'Create healthy interdependence: give and receive without fusion', 'Develop comfort with both autonomy and connection', 'Address fear of dependence or engulfment'],
  'Freedom': ['Audit commitments; release what doesn\'t serve', 'Create buffers: time, money, space that allow choice', 'Build capacity to say no without guilt', 'Develop freedom as internal state, not only external conditions'],
  'Rest': ['Schedule rest as non-negotiable; treat it like an appointment', 'Create restful environment: sleep hygiene, calm space, boundaries', 'Address beliefs that rest is laziness or waste', 'Develop rest as authorship: you choose how you restore'],
  'Space': ['Create physical space: room, corner, or ritual that is yours', 'Build temporal space: unscheduled time, boundaries on availability', 'Develop emotional space: capacity to be with yourself', 'Address enmeshment or over-giving; reclaim your margin']
};

// Map need text to closest key (case-insensitive, partial match)
function findBestMatch(needText, keys) {
  const n = String(needText || '').trim().toLowerCase();
  if (!n) return null;
  // Exact match first
  let key = keys.find(k => k.toLowerCase() === n);
  if (key) return key;
  // Need contains key
  key = keys.find(k => n.includes(k.toLowerCase()));
  if (key) return key;
  // Key contains need (for short needs)
  key = keys.find(k => k.toLowerCase().includes(n));
  return key || null;
}

export function getLoopActionsForNeed(needText) {
  const keys = Object.keys(NEED_LOOP_ACTIONS);
  const key = findBestMatch(needText, keys);
  return NEED_LOOP_ACTIONS[key] || NEED_LOOP_ACTIONS['Acceptance'];
}

export function getRootActionsForNeed(needText) {
  const keys = Object.keys(NEED_ROOT_ACTIONS);
  const key = findBestMatch(needText, keys);
  return NEED_ROOT_ACTIONS[key] || NEED_ROOT_ACTIONS['Acceptance'];
}
