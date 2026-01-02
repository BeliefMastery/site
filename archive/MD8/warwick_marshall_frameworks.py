"""
Warwick Marshall's Proprietary Communication and Mediation Frameworks
Integrated from Belief Mastery, Peer Counseling, and Sovereign of Mind
"""

from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import json

class MarshallConflictType(Enum):
    """Warwick Marshall's expanded conflict taxonomy"""
    # Core conflict types from original framework
    COMMUNICATION_BREAKDOWN = "communication_breakdown"
    RESOURCE_COMPETITION = "resource_competition"
    VALUE_DISAGREEMENT = "value_disagreement"
    POWER_IMBALANCE = "power_imbalance"
    PERSONALITY_CLASH = "personality_clash"
    PROCEDURAL_DISPUTE = "procedural_dispute"
    INTEREST_CONFLICT = "interest_conflict"
    EMOTIONAL_TRIGGER = "emotional_trigger"
    CULTURAL_DIFFERENCE = "cultural_difference"
    TRUST_ISSUE = "trust_issue"
    
    # Marshall's proprietary additions
    ARCHETYPAL_IMPRINT_CONFLICT = "archetypal_imprint_conflict"
    DEPENDENCY_LOOP_CONFLICT = "dependency_loop_conflict"
    NEEDS_CASCADE_CONFLICT = "needs_cascade_conflict"
    SOVEREIGNTY_VIOLATION = "sovereignty_violation"
    IMPRINTING_CONFLICT = "imprinting_conflict"
    PARADIGM_COLLAPSE_CONFLICT = "paradigm_collapse_conflict"

class MarshallMediationStrategy(Enum):
    """Warwick Marshall's proprietary mediation strategies"""
    # Enhanced versions of standard strategies
    SOVEREIGN_COLLABORATIVE = "sovereign_collaborative"
    ARCHETYPAL_INTEGRATION = "archetypal_integration"
    NEEDS_BASED_RESOLUTION = "needs_based_resolution"
    DEPENDENCY_LOOP_BREAKING = "dependency_loop_breaking"
    IMPRINT_REPARENTING = "imprint_reparenting"
    PARADIGM_RECONSTRUCTION = "paradigm_reconstruction"
    PEER_COUNSELING_APPROACH = "peer_counseling_approach"
    SOVEREIGNTY_RESTORATION = "sovereignty_restoration"
    
    # Original strategies enhanced with Marshall wisdom
    COLLABORATIVE = "collaborative"
    ACTIVE_LISTENING = "active_listening"
    TRANSFORMATIVE = "transformative"
    INTEREST_BASED = "interest_based"
    COMPROMISE = "compromise"

class MarshallNeedsCategory(Enum):
    """Warwick Marshall's Needs Vocabulary Categories"""
    CONNECTION = "connection"
    PHYSICAL_WELL_BEING = "physical_well_being"
    HONESTY_ELUCIDATION = "honesty_elucidation"
    PEACE = "peace"
    AUTONOMY = "autonomy"
    MEANING = "meaning"

class MarshallDependencyLoop(Enum):
    """Warwick Marshall's Dependency Loop Types"""
    SPACE_LOOP = "space_loop"
    JOY_LOOP = "joy_loop"
    BEING_WANTED_LOOP = "being_wanted_loop"
    EQUALITY_LOOP = "equality_loop"
    TO_SEE_AND_BE_SEEN_LOOP = "to_see_and_be_seen_loop"
    EASE_LOOP = "ease_loop"
    SECURITY_LOOP = "security_loop"
    BELONGING_LOOP = "belonging_loop"
    CONSIDERATION_LOOP = "consideration_loop"
    FLOW_LOOP = "flow_loop"
    MOURNING_LOOP = "mourning_loop"
    APPROVAL_LOOP = "approval_loop"
    REST_LOOP = "rest_loop"
    CONTRIBUTION_LOOP = "contribution_loop"
    INDEPENDENCE_LOOP = "independence_loop"

@dataclass
class MarshallNeedsVocabulary:
    """Warwick Marshall's comprehensive needs vocabulary"""
    connection_needs: List[str]
    physical_well_being_needs: List[str]
    honesty_elucidation_needs: List[str]
    peace_needs: List[str]
    autonomy_needs: List[str]
    meaning_needs: List[str]

@dataclass
class MarshallViceVocabulary:
    """Warwick Marshall's vice vocabulary for identifying dysregulated responses"""
    negative_expressions: List[str]
    compulsive_drives: List[str]
    protective_adaptations: List[str]
    moral_distortions: List[str]

@dataclass
class MarshallFiveCorePrinciples:
    """Warwick Marshall's Five Core Principles for Healthy Relationships"""
    trust_through_consistency: Dict[str, str]
    vulnerability_through_honesty: Dict[str, str]
    communication_owns_perspective: Dict[str, str]
    restraint_honors_permission: Dict[str, str]
    acknowledgment_imperfection: Dict[str, str]

@dataclass
class MarshallPeerCounselingProtocol:
    """Warwick Marshall's Peer Counseling methodology"""
    group_size: str
    time_discipline: str
    consent_requirements: List[str]
    role_separation: str
    witness_discipline: str
    hazard_controls: List[str]
    eye_contact_protocol: str
    session_structure: Dict[str, str]

class WarwickMarshallFrameworks:
    """Integration of Warwick Marshall's proprietary communication and mediation frameworks"""
    
    def __init__(self):
        self.needs_vocabulary = self._load_needs_vocabulary()
        self.vice_vocabulary = self._load_vice_vocabulary()
        self.five_core_principles = self._load_five_core_principles()
        self.peer_counseling_protocol = self._load_peer_counseling_protocol()
        self.dependency_loops = self._load_dependency_loops()
        self.archetypal_imprints = self._load_archetypal_imprints()
        self.eight_tactical_principles = self._load_eight_tactical_principles()
        self.twenty_conflict_sources = self._load_twenty_conflict_sources()
    
    def _load_needs_vocabulary(self) -> MarshallNeedsVocabulary:
        """Load Warwick Marshall's comprehensive needs vocabulary"""
        return MarshallNeedsVocabulary(
            connection_needs=[
                "intimacy", "belonging", "companionship", "affection", "love", "acceptance",
                "understanding", "empathy", "support", "community", "friendship", "partnership",
                "recognition", "appreciation", "validation", "respect", "trust", "safety"
            ],
            physical_well_being_needs=[
                "health", "vitality", "energy", "strength", "comfort", "pleasure", "satisfaction",
                "nourishment", "rest", "movement", "touch", "sensuality", "security", "shelter",
                "warmth", "coolness", "cleanliness", "order", "beauty", "aesthetics"
            ],
            honesty_elucidation_needs=[
                "truth", "clarity", "transparency", "authenticity", "integrity", "honesty",
                "openness", "directness", "accuracy", "precision", "comprehension", "understanding",
                "insight", "wisdom", "knowledge", "learning", "growth", "development"
            ],
            peace_needs=[
                "calm", "serenity", "tranquility", "harmony", "balance", "stability", "security",
                "safety", "protection", "freedom", "liberation", "release", "relief", "comfort",
                "ease", "flow", "grace", "elegance", "simplicity", "clarity"
            ],
            autonomy_needs=[
                "freedom", "independence", "self-determination", "choice", "control", "power",
                "authority", "sovereignty", "agency", "initiative", "creativity", "expression",
                "individuality", "uniqueness", "authenticity", "integrity", "dignity", "respect"
            ],
            meaning_needs=[
                "purpose", "significance", "importance", "value", "worth", "contribution",
                "impact", "influence", "legacy", "heritage", "tradition", "culture", "spirituality",
                "transcendence", "connection", "unity", "wholeness", "completion", "fulfillment"
            ]
        )
    
    def _load_vice_vocabulary(self) -> MarshallViceVocabulary:
        """Load Warwick Marshall's vice vocabulary for identifying dysregulated responses"""
        return MarshallViceVocabulary(
            negative_expressions=[
                "shame", "guilt", "worthlessness", "inadequacy", "inferiority", "self-condemnation",
                "self-doubt", "self-criticism", "self-hatred", "despair", "hopelessness", "helplessness",
                "powerlessness", "victimization", "resentment", "bitterness", "cynicism", "pessimism"
            ],
            compulsive_drives=[
                "greed", "lust", "gluttony", "envy", "pride", "wrath", "sloth", "addiction",
                "obsession", "compulsion", "fixation", "attachment", "clinging", "grasping",
                "craving", "desire", "wanting", "needing", "demanding", "controlling"
            ],
            protective_adaptations=[
                "defensiveness", "aggression", "withdrawal", "isolation", "avoidance", "denial",
                "projection", "displacement", "rationalization", "intellectualization", "minimization",
                "dismissal", "rejection", "criticism", "judgment", "blame", "accusation"
            ],
            moral_distortions=[
                "deception", "manipulation", "exploitation", "domination", "oppression", "injustice",
                "cruelty", "malice", "spite", "revenge", "retaliation", "punishment", "condemnation",
                "righteousness", "superiority", "inferiority", "exclusion", "rejection", "abandonment"
            ]
        )
    
    def _load_five_core_principles(self) -> MarshallFiveCorePrinciples:
        """Load Warwick Marshall's Five Core Principles for Healthy Relationships"""
        return MarshallFiveCorePrinciples(
            trust_through_consistency={
                "principle": "Trust through consistency",
                "description": "Build trust through reliable, predictable actions and honest communication",
                "practices": [
                    "Follow through on commitments",
                    "Be transparent about intentions",
                    "Maintain consistent behavior patterns",
                    "Communicate clearly and directly",
                    "Acknowledge mistakes and make amends"
                ],
                "indicators": ["Reliability", "Predictability", "Transparency", "Accountability"]
            },
            vulnerability_through_honesty={
                "principle": "Vulnerability through honesty",
                "description": "Create safety for authentic expression through honest, non-judgmental communication",
                "practices": [
                    "Share authentic feelings and experiences",
                    "Listen without judgment or advice",
                    "Create space for emotional expression",
                    "Validate others' experiences",
                    "Practice emotional honesty"
                ],
                "indicators": ["Authenticity", "Emotional Safety", "Non-judgment", "Validation"]
            },
            communication_owns_perspective={
                "principle": "Communication that owns perspective without blame",
                "description": "Express your perspective and needs without blaming or attacking others",
                "practices": [
                    "Use 'I' statements to express feelings and needs",
                    "Take responsibility for your own emotions",
                    "Avoid blame, criticism, and judgment",
                    "Focus on your own experience and needs",
                    "Invite dialogue rather than demanding compliance"
                ],
                "indicators": ["Ownership", "Responsibility", "Non-blaming", "Invitation"]
            },
            restraint_honors_permission={
                "principle": "Restraint that honors permission",
                "description": "Respect boundaries and seek consent before taking action or offering advice",
                "practices": [
                    "Ask for permission before offering advice",
                    "Respect others' boundaries and limits",
                    "Practice restraint in giving unsolicited feedback",
                    "Honor others' autonomy and agency",
                    "Seek consent for physical proximity and touch"
                ],
                "indicators": ["Respect", "Consent", "Boundaries", "Autonomy"]
            },
            acknowledgment_imperfection={
                "principle": "Acknowledgment of imperfection as both boundary and compassion",
                "description": "Accept imperfection in yourself and others while maintaining healthy boundaries",
                "practices": [
                    "Accept that mistakes will happen",
                    "Practice compassion for yourself and others",
                    "Maintain healthy boundaries despite imperfection",
                    "Focus on growth rather than perfection",
                    "Choose compassion over judgment"
                ],
                "indicators": ["Acceptance", "Compassion", "Boundaries", "Growth"]
            }
        )
    
    def _load_peer_counseling_protocol(self) -> MarshallPeerCounselingProtocol:
        """Load Warwick Marshall's Peer Counseling methodology"""
        return MarshallPeerCounselingProtocol(
            group_size="3-5 participants per working unit",
            time_discipline="Visible timers with equal turns",
            consent_requirements=[
                "Consent for proximity each round",
                "Consent for touch each round", 
                "Consent for eye contact each round"
            ],
            role_separation="No counseling someone who is your topic; re-group if entangled",
            witness_discipline="Attention on the speaker; prompt the counselor only, discreetly",
            hazard_controls=[
                "Imprinting prevention",
                "Role confusion prevention", 
                "Boundary collapse prevention",
                "Confidentiality maintenance"
            ],
            eye_contact_protocol="Locked eye contact with one eye of chosen counselor",
            session_structure={
                "preparation": "Set intention, confirm consent, establish container",
                "client_session": "Maintain eye contact, speak authentically, set boundaries",
                "counselor_role": "Keep client talking, avoid evaluation, maintain presence",
                "witness_role": "Stay present as silent container, support counselor discreetly",
                "conclusion": "Attention-out available, process integration, session closure"
            }
        )
    
    def _load_dependency_loops(self) -> Dict[MarshallDependencyLoop, Dict]:
        """Load Warwick Marshall's dependency loop analysis"""
        return {
            MarshallDependencyLoop.SPACE_LOOP: {
                "description": "Need for emotional space and breathing room",
                "pattern": "Person A needs space → Person B feels rejected → Person A feels smothered → Cycle repeats",
                "resolution": "Establish clear boundaries and communication about space needs"
            },
            MarshallDependencyLoop.JOY_LOOP: {
                "description": "Dependency on others for happiness and lightness",
                "pattern": "Person A provides joy → Person B becomes dependent → Person A becomes depleted → Cycle repeats",
                "resolution": "Develop internal sources of joy and lightness"
            },
            MarshallDependencyLoop.BEING_WANTED_LOOP: {
                "description": "Need to feel desired and chosen",
                "pattern": "Person A seeks validation → Person B provides it → Person A becomes dependent → Person B feels used",
                "resolution": "Develop internal sense of worth and desirability"
            },
            MarshallDependencyLoop.EQUALITY_LOOP: {
                "description": "Struggle for equal treatment and respect",
                "pattern": "Person A demands equality → Person B resists → Person A escalates → Person B withdraws",
                "resolution": "Establish mutual respect and equal partnership"
            },
            MarshallDependencyLoop.TO_SEE_AND_BE_SEEN_LOOP: {
                "description": "Need for authentic recognition and understanding",
                "pattern": "Person A seeks to be seen → Person B provides surface recognition → Person A feels unseen → Cycle repeats",
                "resolution": "Practice deep listening and authentic recognition"
            },
            MarshallDependencyLoop.EASE_LOOP: {
                "description": "Dependency on others for comfort and ease",
                "pattern": "Person A provides ease → Person B becomes dependent → Person A becomes burdened → Cycle repeats",
                "resolution": "Develop internal capacity for self-comfort and ease"
            },
            MarshallDependencyLoop.SECURITY_LOOP: {
                "description": "Need for safety and protection",
                "pattern": "Person A seeks security → Person B provides it → Person A becomes dependent → Person B feels responsible",
                "resolution": "Develop internal sense of security and self-protection"
            },
            MarshallDependencyLoop.BELONGING_LOOP: {
                "description": "Need to belong and be accepted",
                "pattern": "Person A seeks belonging → Person B provides acceptance → Person A becomes dependent → Person B feels burdened",
                "resolution": "Develop internal sense of belonging and self-acceptance"
            },
            MarshallDependencyLoop.CONSIDERATION_LOOP: {
                "description": "Need for thoughtfulness and care",
                "pattern": "Person A seeks consideration → Person B provides it → Person A becomes dependent → Person B feels taken for granted",
                "resolution": "Practice mutual consideration and appreciation"
            },
            MarshallDependencyLoop.FLOW_LOOP: {
                "description": "Dependency on others for ease and flow",
                "pattern": "Person A provides flow → Person B becomes dependent → Person A becomes drained → Cycle repeats",
                "resolution": "Develop internal capacity for flow and ease"
            },
            MarshallDependencyLoop.MOURNING_LOOP: {
                "description": "Need for grief processing and emotional support",
                "pattern": "Person A needs mourning support → Person B provides it → Person A becomes dependent → Person B feels overwhelmed",
                "resolution": "Develop internal capacity for grief processing and self-support"
            },
            MarshallDependencyLoop.APPROVAL_LOOP: {
                "description": "Dependency on external approval and validation",
                "pattern": "Person A seeks approval → Person B provides it → Person A becomes dependent → Person B feels responsible",
                "resolution": "Develop internal sources of approval and self-validation"
            },
            MarshallDependencyLoop.REST_LOOP: {
                "description": "Need for rest and restoration",
                "pattern": "Person A needs rest → Person B provides support → Person A becomes dependent → Person B feels burdened",
                "resolution": "Develop internal capacity for rest and self-restoration"
            },
            MarshallDependencyLoop.CONTRIBUTION_LOOP: {
                "description": "Need to contribute and make a difference",
                "pattern": "Person A seeks to contribute → Person B provides opportunities → Person A becomes dependent → Person B feels responsible",
                "resolution": "Develop internal sense of contribution and purpose"
            },
            MarshallDependencyLoop.INDEPENDENCE_LOOP: {
                "description": "Struggle between independence and connection",
                "pattern": "Person A seeks independence → Person B feels rejected → Person A feels guilty → Person B feels abandoned",
                "resolution": "Balance independence with healthy connection"
            }
        }
    
    def _load_archetypal_imprints(self) -> Dict[str, Dict]:
        """Load Warwick Marshall's archetypal imprint framework"""
        return {
            "masculine_imprints": {
                "description": "Internal masculine archetypal influences",
                "aspects": [
                    "Protector", "Provider", "Leader", "Warrior", "Sage", "King", "Lover", "Magician"
                ],
                "functions": [
                    "Boundary setting", "Direction providing", "Structure creating", "Protection offering",
                    "Wisdom sharing", "Leadership taking", "Intimacy creating", "Transformation facilitating"
                ]
            },
            "feminine_imprints": {
                "description": "Internal feminine archetypal influences", 
                "aspects": [
                    "Nurturer", "Creator", "Healer", "Wisdom Keeper", "Lover", "Queen", "Mystic", "Warrior"
                ],
                "functions": [
                    "Nurturing providing", "Creativity expressing", "Healing offering", "Wisdom sharing",
                    "Love giving", "Leadership taking", "Mystery holding", "Protection offering"
                ]
            },
            "integration_principles": {
                "description": "Principles for integrating archetypal imprints",
                "practices": [
                    "Recognize both masculine and feminine aspects within",
                    "Balance internal archetypal energies",
                    "Develop missing archetypal functions",
                    "Heal wounded archetypal patterns",
                    "Embody integrated archetypal wisdom"
                ]
            }
        }
    
    def _load_eight_tactical_principles(self) -> Dict[str, Dict]:
        """Load Warwick Marshall's Eight Tactical Principles for Conflict Transformation"""
        return {
            "principle_1": {
                "name": "Conflict as Data",
                "description": "Treat conflict as information about misalignment, unmet needs, or distortion",
                "application": "Use conflict to identify underlying issues rather than as personal attacks"
            },
            "principle_2": {
                "name": "Needs Identification",
                "description": "Identify the underlying needs driving the conflict",
                "application": "Focus on needs rather than positions or demands"
            },
            "principle_3": {
                "name": "Sovereignty Preservation",
                "description": "Maintain each person's agency and self-determination",
                "application": "Support each person's capacity to make their own choices"
            },
            "principle_4": {
                "name": "Boundary Respect",
                "description": "Honor personal boundaries and consent",
                "application": "Ask for permission and respect limits"
            },
            "principle_5": {
                "name": "Authentic Communication",
                "description": "Communicate from authentic experience without blame",
                "application": "Use 'I' statements and own your perspective"
            },
            "principle_6": {
                "name": "Emotional Regulation",
                "description": "Support emotional regulation and self-soothing",
                "application": "Help each person manage their emotional state"
            },
            "principle_7": {
                "name": "Integration Focus",
                "description": "Focus on integration rather than separation",
                "application": "Seek solutions that honor both parties' needs"
            },
            "principle_8": {
                "name": "Resolution Process",
                "description": "Follow a structured resolution process",
                "application": "Use recognition, responsibility, apology, remorse, restitution, redemption"
            }
        }
    
    def _load_twenty_conflict_sources(self) -> Dict[str, List[str]]:
        """Load Warwick Marshall's Twenty Sources of Conflict arranged by impact tiers"""
        return {
            "tier_1_critical": [
                "Sovereignty violations",
                "Boundary violations", 
                "Consent violations",
                "Trust breaches",
                "Safety threats"
            ],
            "tier_2_high_impact": [
                "Communication breakdowns",
                "Needs misalignment",
                "Dependency loops",
                "Archetypal imprint conflicts",
                "Paradigm collapse"
            ],
            "tier_3_moderate_impact": [
                "Value disagreements",
                "Resource competition",
                "Power imbalances",
                "Role confusion",
                "Expectation mismatches"
            ],
            "tier_4_lower_impact": [
                "Personality differences",
                "Communication style conflicts",
                "Cultural differences",
                "Temporal misalignments",
                "Preference conflicts"
            ]
        }
    
    def analyze_marshall_conflict(self, message: str, context: Optional[Dict] = None) -> Dict:
        """Analyze conflict using Warwick Marshall's frameworks"""
        analysis = {
            "needs_identified": [],
            "dependency_loops_detected": [],
            "archetypal_imprints_involved": [],
            "conflict_tier": "unknown",
            "tactical_principles_applicable": [],
            "core_principles_violated": [],
            "peer_counseling_appropriate": False
        }
        
        message_lower = message.lower()
        
        # Identify needs using Marshall's vocabulary
        for category, needs in [
            ("connection", self.needs_vocabulary.connection_needs),
            ("physical_well_being", self.needs_vocabulary.physical_well_being_needs),
            ("honesty_elucidation", self.needs_vocabulary.honesty_elucidation_needs),
            ("peace", self.needs_vocabulary.peace_needs),
            ("autonomy", self.needs_vocabulary.autonomy_needs),
            ("meaning", self.needs_vocabulary.meaning_needs)
        ]:
            for need in needs:
                if need in message_lower:
                    analysis["needs_identified"].append(f"{category}: {need}")
        
        # Detect dependency loops
        for loop_type, loop_info in self.dependency_loops.items():
            if any(keyword in message_lower for keyword in loop_info["description"].lower().split()):
                analysis["dependency_loops_detected"].append(loop_type.value)
        
        # Identify conflict tier
        for tier, sources in self.twenty_conflict_sources.items():
            for source in sources:
                if any(keyword in message_lower for keyword in source.lower().split()):
                    analysis["conflict_tier"] = tier
                    break
            if analysis["conflict_tier"] != "unknown":
                break
        
        # Determine if peer counseling is appropriate
        analysis["peer_counseling_appropriate"] = (
            len(analysis["needs_identified"]) > 0 and
            analysis["conflict_tier"] in ["tier_2_high_impact", "tier_3_moderate_impact"]
        )
        
        return analysis
    
    def generate_marshall_strategy_prompt(self, 
                                       message: str, 
                                       strategy: MarshallMediationStrategy,
                                       analysis: Dict) -> str:
        """Generate strategic prompt using Warwick Marshall's frameworks"""
        
        if strategy == MarshallMediationStrategy.SOVEREIGN_COLLABORATIVE:
            return f"""
You are applying Warwick Marshall's Sovereign Collaborative approach to conflict resolution.

CORE PRINCIPLES:
1. Trust through consistency - Build reliability and transparency
2. Vulnerability through honesty - Create safety for authentic expression  
3. Communication that owns perspective without blame - Use 'I' statements
4. Restraint that honors permission - Respect boundaries and seek consent
5. Acknowledgment of imperfection - Accept imperfection with compassion

CONFLICT ANALYSIS:
- Identified Needs: {analysis.get('needs_identified', [])}
- Dependency Loops: {analysis.get('dependency_loops_detected', [])}
- Conflict Tier: {analysis.get('conflict_tier', 'unknown')}

SOVEREIGN COLLABORATIVE APPROACH:
- Treat conflict as data about misalignment and unmet needs
- Focus on underlying needs rather than positions
- Maintain each person's sovereignty and agency
- Use authentic communication without blame
- Seek solutions that honor both parties' needs

Original Message: {message}

Reframe this message using the Sovereign Collaborative approach, focusing on:
1. Identifying and expressing underlying needs
2. Maintaining personal sovereignty while inviting collaboration
3. Using authentic, non-blaming communication
4. Creating space for mutual understanding and resolution

Reframed Response:
"""
        
        elif strategy == MarshallMediationStrategy.NEEDS_BASED_RESOLUTION:
            return f"""
You are applying Warwick Marshall's Needs-Based Resolution approach.

NEEDS VOCABULARY CATEGORIES:
- Connection: intimacy, belonging, companionship, affection, love, acceptance
- Physical Well-Being: health, vitality, comfort, pleasure, satisfaction, rest
- Honesty/Elucidation: truth, clarity, transparency, authenticity, integrity
- Peace: calm, serenity, harmony, balance, stability, security, freedom
- Autonomy: freedom, independence, self-determination, choice, sovereignty
- Meaning: purpose, significance, value, contribution, impact, legacy

IDENTIFIED NEEDS: {analysis.get('needs_identified', [])}

NEEDS-BASED RESOLUTION APPROACH:
- Focus on underlying needs rather than surface demands
- Use needs vocabulary to clarify what's really important
- Seek solutions that meet both parties' core needs
- Avoid getting caught in dependency loops
- Create win-win solutions based on needs alignment

Original Message: {message}

Reframe this message to:
1. Clearly identify and express the underlying needs
2. Use specific needs vocabulary
3. Invite collaborative problem-solving around needs
4. Avoid dependency-creating language
5. Focus on solutions that honor both parties' needs

Reframed Response:
"""
        
        elif strategy == MarshallMediationStrategy.PEER_COUNSELING_APPROACH:
            return f"""
You are applying Warwick Marshall's Peer Counseling approach to conflict resolution.

PEER COUNSELING PRINCIPLES:
- Group size: 3-5 participants with equal turns
- Time discipline with visible timers
- Consent for proximity, touch, and eye contact
- Role separation to prevent entanglement
- Witness discipline for container support
- Locked eye contact for authentic connection

CONFLICT ANALYSIS:
- Needs Identified: {analysis.get('needs_identified', [])}
- Appropriate for Peer Counseling: {analysis.get('peer_counseling_appropriate', False)}

PEER COUNSELING APPROACH:
- Create safe container for authentic expression
- Use disciplined listening without evaluation
- Support emotional discharge and integration
- Maintain witness presence for stability
- Honor consent and boundaries at all times

Original Message: {message}

Reframe this message to:
1. Create safety for authentic emotional expression
2. Use non-evaluative, supportive language
3. Invite deeper exploration of underlying issues
4. Maintain respect for personal boundaries
5. Support the person's own process of discovery

Reframed Response:
"""
        
        else:
            # Default to sovereign collaborative approach
            return self.generate_marshall_strategy_prompt(message, MarshallMediationStrategy.SOVEREIGN_COLLABORATIVE, analysis)
    
    def get_dependency_loop_guidance(self, loop_type: MarshallDependencyLoop) -> Dict:
        """Get specific guidance for breaking dependency loops"""
        return self.dependency_loops.get(loop_type, {})
    
    def get_core_principle_guidance(self, principle: str) -> Dict:
        """Get specific guidance for applying core principles"""
        return getattr(self.five_core_principles, principle, {})
    
    def get_archetypal_integration_guidance(self) -> Dict:
        """Get guidance for archetypal integration work"""
        return self.archetypal_imprints
    
    def get_tactical_principle_guidance(self, principle_number: int) -> Dict:
        """Get specific tactical principle guidance"""
        return self.eight_tactical_principles.get(f"principle_{principle_number}", {})


