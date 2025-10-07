"""
Enhanced Mediation Session System
Integrates case management, participant management, and AI mediation
"""

import sqlite3
import streamlit as st
import json
from typing import Dict, List, Optional, Tuple
from datetime import datetime
import uuid
from openai import OpenAI
import os

# Import existing systems
from sharing_control_system import SharingControlSystem
from user_management_system import UserManagementSystem

class EnhancedMediationSession:
    """Enhanced mediation session system with full integration"""
    
    def __init__(self, db_name: str):
        self.db_name = db_name
        self.sharing_system = SharingControlSystem(db_name)
        self.user_mgmt = UserManagementSystem(db_name)
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY")) if os.getenv("OPENAI_API_KEY") else None
    
    def create_mediation_session(self, 
                               case_id: str, 
                               mediator_id: str,
                               session_type: str = "joint") -> str:
        """Create a new mediation session"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            session_id = str(uuid.uuid4())
            
            cursor.execute('''
                INSERT INTO mediation_sessions 
                (session_id, case_id, mediator_id, session_type, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (session_id, case_id, mediator_id, session_type, 'active', 
                  datetime.now().isoformat()))
            
            conn.commit()
            conn.close()
            
            return session_id
            
        except Exception as e:
            print(f"Error creating mediation session: {e}")
            return ""
    
    def add_session_message(self, 
                          session_id: str,
                          sender_id: str,
                          message_type: str,
                          original_message: str,
                          mediated_message: str = None,
                          is_private: bool = False,
                          recipient_id: str = None) -> bool:
        """Add a message to a mediation session"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            message_id = str(uuid.uuid4())
            
            cursor.execute('''
                INSERT INTO session_messages 
                (message_id, session_id, sender_id, message_type, original_message,
                 mediated_message, is_private, recipient_id, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (message_id, session_id, sender_id, message_type, original_message,
                  mediated_message, is_private, recipient_id, datetime.now().isoformat()))
            
            conn.commit()
            conn.close()
            
            return True
            
        except Exception as e:
            print(f"Error adding session message: {e}")
            return False
    
    def get_session_messages(self, session_id: str, user_id: str) -> List[Dict]:
        """Get messages for a session, filtered by user permissions"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            # Get session info
            cursor.execute('''
                SELECT s.case_id, s.mediator_id, s.session_type, s.status
                FROM mediation_sessions s
                WHERE s.session_id = ?
            ''', (session_id,))
            
            session_info = cursor.fetchone()
            if not session_info:
                conn.close()
                return []
            
            case_id, mediator_id, session_type, session_status = session_info
            
            # Get messages (filtered by privacy)
            if user_id == mediator_id:
                # Mediator sees all messages
                cursor.execute('''
                    SELECT sm.message_id, sm.sender_id, sm.message_type, sm.original_message,
                           sm.mediated_message, sm.is_private, sm.recipient_id, sm.created_at,
                           u.full_name as sender_name
                    FROM session_messages sm
                    JOIN users u ON sm.sender_id = u.user_id
                    WHERE sm.session_id = ?
                    ORDER BY sm.created_at
                ''', (session_id,))
            else:
                # Clients see only public messages and messages to them
                cursor.execute('''
                    SELECT sm.message_id, sm.sender_id, sm.message_type, sm.original_message,
                           sm.mediated_message, sm.is_private, sm.recipient_id, sm.created_at,
                           u.full_name as sender_name
                    FROM session_messages sm
                    JOIN users u ON sm.sender_id = u.user_id
                    WHERE sm.session_id = ? 
                    AND (sm.is_private = 0 OR sm.recipient_id = ? OR sm.sender_id = ?)
                    ORDER BY sm.created_at
                ''', (session_id, user_id, user_id))
            
            messages = []
            for row in cursor.fetchall():
                messages.append({
                    'message_id': row[0],
                    'sender_id': row[1],
                    'message_type': row[2],
                    'original_message': row[3],
                    'mediated_message': row[4],
                    'is_private': bool(row[5]),
                    'recipient_id': row[6],
                    'created_at': row[7],
                    'sender_name': row[8]
                })
            
            conn.close()
            return messages
            
        except Exception as e:
            print(f"Error getting session messages: {e}")
            return []
    
    def process_message_with_ai(self, message: str, context: Dict = None) -> Dict:
        """Process message with AI mediation"""
        if not self.openai_client:
            return {
                'mediated_message': message,
                'analysis': 'AI mediation not available',
                'suggestions': []
            }
        
        try:
            # Build context for AI
            system_prompt = """You are a professional mediator with expertise in conflict resolution. 
            Your role is to help reframe messages to be more constructive and collaborative while preserving 
            the core message and intent. Focus on:
            1. Identifying underlying needs and interests
            2. Removing blame and accusations
            3. Using "I-statements" when appropriate
            4. Promoting collaborative tone
            5. Maintaining authenticity of the original message
            
            Provide a reframed version that is more likely to lead to productive dialogue."""
            
            if context:
                context_info = f"\n\nContext: {json.dumps(context, indent=2)}"
                system_prompt += context_info
            
            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                temperature=0.7
            )
            
            mediated_message = response.choices[0].message.content.strip()
            
            return {
                'mediated_message': mediated_message,
                'analysis': 'Message successfully mediated',
                'suggestions': []
            }
            
        except Exception as e:
            print(f"Error processing message with AI: {e}")
            return {
                'mediated_message': message,
                'analysis': f'AI processing error: {e}',
                'suggestions': []
            }
    
    def get_session_participants(self, session_id: str) -> List[Dict]:
        """Get all participants in a mediation session"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT DISTINCT u.user_id, u.full_name, u.email, u.role,
                       CASE WHEN s.mediator_id = u.user_id THEN 'mediator' ELSE 'participant' END as session_role
                FROM mediation_sessions s
                JOIN case_participants cp ON s.case_id = cp.case_id
                JOIN users u ON (cp.user_id = u.user_id OR s.mediator_id = u.user_id)
                WHERE s.session_id = ? AND (cp.is_active = 1 OR s.mediator_id = u.user_id)
            ''', (session_id,))
            
            participants = []
            for row in cursor.fetchall():
                participants.append({
                    'user_id': row[0],
                    'full_name': row[1],
                    'email': row[2],
                    'role': row[3],
                    'session_role': row[4]
                })
            
            conn.close()
            return participants
            
        except Exception as e:
            print(f"Error getting session participants: {e}")
            return []

def show_enhanced_mediation_session():
    """Show enhanced mediation session interface"""
    if not st.session_state.get('show_mediation_session'):
        return
    
    case = st.session_state.selected_case
    mediation_system = EnhancedMediationSession("unified_mediation.db")
    
    st.subheader(f"💬 Mediation Session: {case['title']}")
    
    # Session info header
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.write(f"**Case:** {case['case_number']}")
    
    with col2:
        st.write(f"**Status:** {case['status']}")
    
    with col3:
        participants = mediation_system.get_session_participants("current_session")
        st.write(f"**Participants:** {len(participants)}")
    
    with col4:
        # Session controls
        if st.button("⚙️ Session Settings"):
            st.session_state.show_session_settings = True
            st.rerun()
    
    st.divider()
    
    # Main session interface
    col1, col2 = st.columns([3, 1])
    
    with col1:
        show_session_chat_interface(mediation_system, case)
    
    with col2:
        show_session_sidebar(mediation_system, case)

def show_session_chat_interface(mediation_system: EnhancedMediationSession, case: Dict):
    """Show the main chat interface for mediation session"""
    st.write("**Mediation Chat Interface**")
    
    # Message history (placeholder - would need session_id)
    st.write("**Message History:**")
    st.info("Message history would be displayed here based on session permissions.")
    
    # Message input
    st.write("**Send a Message:**")
    
    message_type = st.radio(
        "Message Type:",
        ["Public", "Private to Mediator", "Private to Participant"],
        horizontal=True
    )
    
    user_input = st.text_area("Type your message...", height=100)
    
    # Recipient selection for private messages
    recipient_id = None
    if message_type == "Private to Participant":
        participants = mediation_system.get_session_participants("current_session")
        participant_options = {p['user_id']: p['full_name'] for p in participants 
                             if p['user_id'] != st.session_state.user_id}
        
        if participant_options:
            recipient_id = st.selectbox(
                "Send to:",
                list(participant_options.keys()),
                format_func=lambda x: participant_options[x]
            )
        else:
            st.warning("No other participants available for private message.")
    
    # Send button
    if st.button("📤 Send Message", type="primary"):
        if user_input.strip():
            # Process message with AI
            context = {
                'case_id': case['case_id'],
                'case_type': case['case_type'],
                'sender_role': st.session_state.user_role
            }
            
            ai_result = mediation_system.process_message_with_ai(user_input, context)
            
            # Display results
            st.success("Message processed!")
            
            with st.expander("📝 Message Preview", expanded=True):
                st.write("**Original Message:**")
                st.write(user_input)
                
                st.write("**AI-Mediated Version:**")
                st.write(ai_result['mediated_message'])
                
                if ai_result['analysis']:
                    st.write("**Analysis:**")
                    st.write(ai_result['analysis'])
            
            # Confirmation to send
            col1, col2 = st.columns(2)
            with col1:
                if st.button("✅ Send Mediated Version"):
                    # Here you would actually send the message
                    st.success("Message sent!")
                    st.rerun()
            
            with col2:
                if st.button("📤 Send Original"):
                    # Here you would send the original message
                    st.info("Original message sent!")
                    st.rerun()

def show_session_sidebar(mediation_system: EnhancedMediationSession, case: Dict):
    """Show session sidebar with controls and information"""
    st.write("**Session Controls**")
    
    # Participants
    st.write("**Participants:**")
    participants = mediation_system.get_session_participants("current_session")
    
    if participants:
        for participant in participants:
            role_icon = "👨‍⚖️" if participant['session_role'] == 'mediator' else "👤"
            st.write(f"{role_icon} {participant['full_name']} ({participant['session_role']})")
    else:
        st.info("No participants loaded")
    
    st.divider()
    
    # Session actions
    st.write("**Session Actions:**")
    
    if st.button("📋 View Case Details"):
        st.session_state.show_case_details = True
        st.rerun()
    
    if st.button("🔒 Manage Sharing"):
        st.session_state.show_sharing_controls = True
        st.rerun()
    
    if st.button("👥 Manage Participants"):
        st.session_state.show_client_assignment = True
        st.rerun()
    
    if st.button("📊 Session Analytics"):
        st.session_state.show_session_analytics = True
        st.rerun()
    
    st.divider()
    
    # Quick navigation
    st.write("**Quick Navigation:**")
    
    if st.button("← Back to Dashboard"):
        st.session_state.show_mediation_session = False
        st.session_state.selected_case = None
        st.rerun()

def show_session_analytics():
    """Show session analytics and insights"""
    if not st.session_state.get('show_session_analytics'):
        return
    
    case = st.session_state.selected_case
    
    st.subheader(f"📊 Session Analytics: {case['title']}")
    
    # Analytics would be implemented here
    st.info("Session analytics would be displayed here, including:")
    st.write("• Message frequency and patterns")
    st.write("• Participation levels")
    st.write("• Conflict escalation indicators")
    st.write("• Resolution progress tracking")
    
    # Back button
    if st.button("← Back to Session"):
        st.session_state.show_session_analytics = False
        st.rerun()

def initialize_session_tables():
    """Initialize database tables for mediation sessions"""
    try:
        conn = sqlite3.connect("unified_mediation.db")
        cursor = conn.cursor()
        
        # Create mediation sessions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS mediation_sessions (
                session_id TEXT PRIMARY KEY,
                case_id TEXT NOT NULL,
                mediator_id TEXT NOT NULL,
                session_type TEXT DEFAULT 'joint',
                status TEXT DEFAULT 'active',
                created_at TEXT NOT NULL,
                updated_at TEXT,
                FOREIGN KEY (case_id) REFERENCES cases (case_id),
                FOREIGN KEY (mediator_id) REFERENCES users (user_id)
            )
        ''')
        
        # Create session messages table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS session_messages (
                message_id TEXT PRIMARY KEY,
                session_id TEXT NOT NULL,
                sender_id TEXT NOT NULL,
                message_type TEXT DEFAULT 'public',
                original_message TEXT NOT NULL,
                mediated_message TEXT,
                is_private BOOLEAN DEFAULT 0,
                recipient_id TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY (session_id) REFERENCES mediation_sessions (session_id),
                FOREIGN KEY (sender_id) REFERENCES users (user_id),
                FOREIGN KEY (recipient_id) REFERENCES users (user_id)
            )
        ''')
        
        conn.commit()
        conn.close()
        
        return True
        
    except Exception as e:
        print(f"Error initializing session tables: {e}")
        return False

# Initialize session tables when module is imported
initialize_session_tables()

