import streamlit as st
import sqlite3
import os
import json
import uuid
import hashlib
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from enum import Enum
from openai import OpenAI

# Import existing modules
from aminz_mediation_platform import (
    init_database, migrate_database, authenticate_user, create_case, get_user_cases,
    assign_client_to_case, get_case_participants, CASE_CATEGORIES, CaseStatus, UserRole
)
from consent_and_privacy_system import ConsentAndPrivacySystem, UserRole as ConsentUserRole
from interactive_mediation_system import InteractiveMediationSystem
from warwick_marshall_frameworks import WarwickMarshallFrameworks

# Import enhanced systems
from user_management_system import UserManagementSystem, show_enhanced_user_search, show_add_participant_form, show_user_statistics
# Sharing controls removed as redundant
from enhanced_mediation_session import EnhancedMediationSession, show_enhanced_mediation_session, show_session_analytics
from ai_provider_system import AIProviderManager, show_ai_provider_settings, get_mediator_ai_client
from password_management import show_password_change_interface
from enhanced_styling import get_enhanced_css, get_enhanced_header_html, get_metric_card_html, get_status_badge_html, get_role_badge_html
from form_based_case_management import show_form_based_case_management

# -----------------------------------------------------------------------------
# 🔧 CONFIGURATION
# -----------------------------------------------------------------------------
APP_NAME = "Unified Mediation Platform"
DB_NAME = "unified_mediation.db"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-openai-api-key-here")

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY != "your-openai-api-key-here" else None

# Initialize systems
consent_system = ConsentAndPrivacySystem(DB_NAME)
mediation_system = InteractiveMediationSystem()
marshall_frameworks = WarwickMarshallFrameworks()

# -----------------------------------------------------------------------------
# 🎨 ENHANCED CSS LOADING
# -----------------------------------------------------------------------------
def load_custom_css():
    """Load enhanced CSS styling system"""
    st.markdown(get_enhanced_css(), unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# 🔐 AUTHENTICATION FUNCTIONS
# -----------------------------------------------------------------------------
def show_authentication_page():
    """Display authentication page with login and registration"""
    st.markdown("## 🔐 Authentication Required")
    
    tab1, tab2 = st.tabs(["Login", "Register"])
    
    with tab1:
        st.subheader("Login to Unified Mediation Platform")
        
        with st.form("login_form"):
            email = st.text_input("Email Address", placeholder="your.email@example.com")
            password = st.text_input("Password", type="password")
            submit = st.form_submit_button("Login", type="primary")
            
            if submit:
                if email and password:
                    # Try unified authentication
                    user_data = authenticate_user(email, password)
                    if user_data:
                        st.session_state.user = user_data
                        st.session_state.user_id = user_data['user_id']
                        st.session_state.user_role = user_data['role']
                        st.session_state.full_name = user_data['full_name']
                        st.success("Login successful!")
                        st.rerun()
                    else:
                        st.error("Invalid email or password")
                else:
                    st.error("Please fill in all fields")

    with tab2:
        st.subheader("Register New Account")
        
        st.info("**Account Types:**\n"
               "• **Mediator**: Create and manage cases, assign clients, control information sharing\n"
               "• **Client**: Access assigned cases, input case details, participate in mediation sessions")
        
        with st.form("register_form"):
            full_name = st.text_input("Full Name")
            email = st.text_input("Email Address")
            organization = st.text_input("Organization (optional)")
            phone = st.text_input("Phone Number (optional)")
            role = st.selectbox("Account Type", ["client", "mediator"], 
                              help="Choose your role in the mediation process")
            password = st.text_input("Password", type="password")
            confirm_password = st.text_input("Confirm Password", type="password")
            submit = st.form_submit_button("Register", type="primary")
            
            if submit:
                if password != confirm_password:
                    st.error("Passwords do not match")
                elif len(password) < 8:
                    st.error("Password must be at least 8 characters long")
                elif not all([full_name, email, password]):
                    st.error("Please fill in all required fields")
                else:
                    # Create user account
                    success = create_user_account(full_name, email, organization, phone, role, password)
                    if success:
                        st.success("Account created successfully! Please login.")
                    else:
                        st.error("Failed to create account. Email may already exist.")

def create_user_account(full_name: str, email: str, organization: str, phone: str, role: str, password: str) -> bool:
    """Create a new user account"""
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        
        user_id = str(uuid.uuid4())
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        cursor.execute('''
            INSERT INTO users (user_id, email, password_hash, role, full_name, organization, phone, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, email, password_hash, role, full_name, organization, phone, 1, datetime.now().isoformat()))
        
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Error creating user account: {e}")
        return False

# -----------------------------------------------------------------------------
# 🏠 MAIN DASHBOARD FUNCTIONS
# -----------------------------------------------------------------------------
def show_mediator_dashboard():
    """Display mediator dashboard with case management"""
    st.header("📊 Mediator Dashboard")
    
    # Enhanced Quick Stats
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        active_cases = get_user_cases(st.session_state.user_id, UserRole.MEDIATOR.value)
        st.markdown(get_metric_card_html(
            value=str(len(active_cases)),
            label="Active Cases",
            delta=f"{len(active_cases)} total"
        ), unsafe_allow_html=True)
    
    with col2:
        # Get cases by status
        in_mediation = len([c for c in active_cases if c.get('status') == 'in_mediation'])
        st.markdown(get_metric_card_html(
            value=str(in_mediation),
            label="In Mediation",
            delta=f"{in_mediation} active sessions"
        ), unsafe_allow_html=True)
    
    with col3:
        awaiting_response = len([c for c in active_cases if c.get('status') == 'awaiting_response'])
        st.markdown(get_metric_card_html(
            value=str(awaiting_response),
            label="Awaiting Response",
            delta=f"{awaiting_response} pending"
        ), unsafe_allow_html=True)
    
    with col4:
        # Get total participants across all cases
        total_participants = 0
        for case in active_cases:
            participants = get_case_participants(case['case_id'])
            total_participants += len(participants)
        st.markdown(get_metric_card_html(
            value=str(total_participants),
            label="Total Participants",
            delta=f"{total_participants} across all cases"
        ), unsafe_allow_html=True)
    
    # Navigation tabs - Different based on user role
    user_role = st.session_state.get('user_role')
    
    if user_role == 'mediator':
        tab1, tab2, tab3, tab4 = st.tabs([
            "📝 Case Management", 
            "💬 Mediation Sessions",
            "🤖 AI Settings",
            "🔐 Change Password"
        ])
    else:  # client
        tab1, tab2, tab3 = st.tabs([
            "📝 My Cases", 
            "💬 Mediation Sessions",
            "🔐 Change Password"
        ])
    
    # Tab content based on user role
    if user_role == 'mediator':
        with tab1:
            show_form_based_case_management()
        
        with tab2:
            show_active_sessions_tab()
        
        with tab3:
            show_ai_provider_settings()
        
        with tab4:
            show_password_change_interface()
    
    else:  # client
        with tab1:
            show_form_based_case_management()
        
        with tab2:
            show_active_sessions_tab()
        
        with tab3:
            show_password_change_interface()
    
    # Show enhanced components if needed
    if st.session_state.get('show_add_participant'):
        show_add_participant_form()
    
    if st.session_state.get('show_session_analytics'):
        show_session_analytics()

def show_client_dashboard():
    """Display client dashboard"""
    st.header("📊 Client Dashboard")
    
    # Get client's cases
    client_cases = get_user_cases(st.session_state.user_id, UserRole.CLIENT.value)
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown(get_metric_card_html(
            value=str(len(client_cases)),
            label="My Cases",
            delta=f"{len(client_cases)} assigned"
        ), unsafe_allow_html=True)
    
    with col2:
        active_cases = len([c for c in client_cases if c.get('status') in ['active', 'in_mediation']])
        st.markdown(get_metric_card_html(
            value=str(active_cases),
            label="Active Cases",
            delta=f"{active_cases} in progress"
        ), unsafe_allow_html=True)
    
    with col3:
        completed_cases = len([c for c in client_cases if c.get('status') == 'completed'])
        st.markdown(get_metric_card_html(
            value=str(completed_cases),
            label="Completed Cases",
            delta=f"{completed_cases} resolved"
        ), unsafe_allow_html=True)
    
    # Navigation tabs
    tab1, tab2 = st.tabs(["📋 My Cases", "💬 Mediation Sessions"])
    
    with tab1:
        show_client_cases_tab(client_cases)
    
    with tab2:
        show_client_sessions_tab()

# -----------------------------------------------------------------------------
# 📋 CASE MANAGEMENT FUNCTIONS
# -----------------------------------------------------------------------------
def show_case_management_tab():
    """Display case management interface for mediators"""
    st.subheader("📋 Case Management")
    
    col1, col2 = st.columns([3, 1])
    
    with col2:
        if st.button("➕ Create New Case", type="primary"):
            st.session_state.show_create_case = True
            st.rerun()
    
    if st.session_state.get('show_create_case'):
        show_create_case_form()
        return
    
    # Display existing cases
    cases = get_user_cases(st.session_state.user_id, UserRole.MEDIATOR.value)
    
    if not cases:
        st.info("No cases found. Create your first case to get started.")
        return
    
    for case in cases:
        with st.container():
            st.markdown(f"""
            <div class="case-card fade-in">
                <h4>{case['title']}</h4>
                <p><strong>Case Number:</strong> {case['case_number']}</p>
                <p><strong>Type:</strong> {case['case_type']}</p>
                <p><strong>Status:</strong> {get_status_badge_html(case['status'])}</p>
                <p><strong>Created:</strong> {case['created_at'][:10]}</p>
            </div>
            """, unsafe_allow_html=True)
            
            col1, col2, col3, col4 = st.columns(4)
            with col1:
                if st.button(f"👁️ View", key=f"view_{case['case_id']}"):
                    st.session_state.selected_case = case
                    st.session_state.show_case_details = True
                    st.rerun()
            with col2:
                if st.button(f"👥 Assign Clients", key=f"assign_{case['case_id']}"):
                    st.session_state.selected_case = case
                    st.session_state.show_client_assignment = True
                    st.rerun()
            with col3:
                if st.button(f"🔒 Sharing", key=f"sharing_{case['case_id']}"):
                    st.session_state.selected_case = case
                    st.session_state.show_sharing_controls = True
                    st.rerun()
            with col4:
                if st.button(f"💬 Mediate", key=f"mediate_{case['case_id']}"):
                    st.session_state.selected_case = case
                    st.session_state.show_mediation_session = True
                    st.rerun()
            
            st.divider()

def show_create_case_form():
    """Display case creation form"""
    st.subheader("➕ Create New Case")
    
    with st.form("create_case_form"):
        title = st.text_input("Case Title", placeholder="e.g., Smith vs. Johnson Property Dispute")
        description = st.text_area("Case Description", placeholder="Brief description of the dispute...")
        case_type = st.selectbox("Case Type", list(CASE_CATEGORIES.keys()))
        
        col1, col2 = st.columns(2)
        with col1:
            submit = st.form_submit_button("Create Case", type="primary")
        with col2:
            cancel = st.form_submit_button("Cancel")
        
        if cancel:
            st.session_state.show_create_case = False
            st.rerun()
        
        if submit and title and description:
            case_id = create_case(title, description, case_type, st.session_state.user_id)
            if case_id:
                st.success("Case created successfully!")
                st.session_state.show_create_case = False
                st.rerun()
            else:
                st.error("Failed to create case")

# -----------------------------------------------------------------------------
# 👥 CLIENT ASSIGNMENT FUNCTIONS
# -----------------------------------------------------------------------------
def show_client_assignment_tab():
    """Display client assignment interface"""
    st.subheader("👥 Client Assignment")
    
    if st.session_state.get('show_client_assignment'):
        show_specific_case_assignment()
        return
    
    # Show user statistics
    show_user_statistics()
    
    st.divider()
    
    # Show enhanced user search
    show_enhanced_user_search()
    
    st.divider()
    
    st.info("Select a case from the Case Management tab to assign clients.")

def show_specific_case_assignment():
    """Show client assignment for a specific case"""
    case = st.session_state.selected_case
    
    st.subheader(f"👥 Assign Clients to: {case['title']}")
    
    # Current participants
    st.write("**Current Participants:**")
    participants = get_case_participants(case['case_id'])
    
    if participants:
        for participant in participants:
            st.write(f"• {participant['full_name']} ({participant['email']}) - {participant['role']}")
    else:
        st.info("No participants assigned yet.")
    
    st.divider()
    
    # Add new participants
    st.write("**Add New Participant:**")
    
    # Search for users
    search_email = st.text_input("Search by email", placeholder="user@example.com")
    
    if search_email:
        # Find user by email
        user = find_user_by_email(search_email)
        if user:
            st.success(f"Found user: {user['full_name']} ({user['email']})")
            
            role = st.selectbox("Role", ["claimant", "respondent", "witness", "other"])
            
            if st.button("Add Participant", type="primary"):
                success = assign_client_to_case(case['case_id'], user['user_id'], role)
                if success:
                    st.success("Participant added successfully!")
                    st.rerun()
                else:
                    st.error("Failed to add participant")
        else:
            st.error("User not found. Please check the email address.")
    
    # Quick actions
    col1, col2 = st.columns(2)
    with col1:
        if st.button("← Back to Cases"):
            st.session_state.show_client_assignment = False
            st.session_state.selected_case = None
            st.rerun()
    with col2:
        if st.button("💬 Start Mediation Session"):
            st.session_state.show_mediation_session = True
            st.rerun()

def find_user_by_email(email: str) -> Optional[Dict]:
    """Find user by email address"""
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT user_id, email, full_name, role, organization, phone
            FROM users WHERE email = ? AND is_active = 1
        ''', (email,))
        
        result = cursor.fetchone()
        conn.close()
        
        if result:
            return {
                'user_id': result[0],
                'email': result[1],
                'full_name': result[2],
                'role': result[3],
                'organization': result[4],
                'phone': result[5]
            }
        return None
    except Exception as e:
        print(f"Error finding user: {e}")
        return None

# -----------------------------------------------------------------------------
# 🔒 SHARING CONTROLS FUNCTIONS
# -----------------------------------------------------------------------------
# Sharing controls functionality removed as redundant

def show_specific_case_sharing():
    """Show sharing controls for a specific case"""
    case = st.session_state.selected_case
    
    st.subheader(f"🔒 Sharing Controls: {case['title']}")
    
    # Get current sharing controls
    sharing_controls = get_mediator_sharing_controls(case['case_id'], st.session_state.user_id)
    
    # Get case details
    case_details = case.get('case_details', {})
    if isinstance(case_details, str):
        case_details = json.loads(case_details) if case_details else {}
    
    st.write("**Control what information each client can see:**")
    
    if case_details:
        for section_key, section in case_details.items():
            if isinstance(section, dict):
                st.write(f"**{section_key.replace('_', ' ').title()}:**")
                
                for field_key, field_value in section.items():
                    if isinstance(field_value, dict):
                        continue  # Skip nested dicts for now
                    
                    col1, col2, col3 = st.columns([2, 1, 1])
                    
                    with col1:
                        st.write(f"• {field_key.replace('_', ' ').title()}: {str(field_value)[:50]}...")
                    
                    with col2:
                        # Check current sharing status
                        current_control = sharing_controls.get(field_key, {})
                        is_shared = current_control.get('is_shared', False)
                        
                        shared = st.checkbox(
                            "Share", 
                            value=is_shared,
                            key=f"share_{field_key}"
                        )
                    
                    with col3:
                        if shared:
                            shared_with = st.selectbox(
                                "With", 
                                ["all", "specific_client"],
                                key=f"with_{field_key}"
                            )
                        else:
                            shared_with = "none"
                    
                    # Save sharing control
                    if st.button("💾 Save", key=f"save_{field_key}"):
                        success = set_mediator_sharing_control(
                            case['case_id'], 
                            field_key, 
                            st.session_state.user_id, 
                            shared, 
                            shared_with
                        )
                        if success:
                            st.success(f"Sharing control updated for {field_key}")
                        else:
                            st.error("Failed to update sharing control")
    
    # Quick actions
    col1, col2 = st.columns(2)
    with col1:
        if st.button("← Back to Cases"):
            st.session_state.show_sharing_controls = False
            st.session_state.selected_case = None
            st.rerun()
    with col2:
        if st.button("💬 Start Mediation Session"):
            st.session_state.show_mediation_session = True
            st.rerun()

# -----------------------------------------------------------------------------
# 💬 MEDIATION SESSION FUNCTIONS
# -----------------------------------------------------------------------------
def show_active_sessions_tab():
    """Display active mediation sessions"""
    st.subheader("💬 Active Mediation Sessions")
    
    if st.session_state.get('show_mediation_session'):
        show_enhanced_mediation_session()
        return
    
    st.info("Select a case from the Case Management tab to start a mediation session.")

def show_mediation_session():
    """Display mediation session interface"""
    case = st.session_state.selected_case
    
    st.subheader(f"💬 Mediation Session: {case['title']}")
    
    # Session info
    col1, col2, col3 = st.columns(3)
    with col1:
        st.write(f"**Case:** {case['case_number']}")
    with col2:
        st.write(f"**Status:** {case['status']}")
    with col3:
        participants = get_case_participants(case['case_id'])
        st.write(f"**Participants:** {len(participants)}")
    
    st.divider()
    
    # Mediation interface
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.write("**Mediation Chat Interface**")
        
        # Check if mediator has AI configured
        ai_client, ai_model = get_mediator_ai_client(st.session_state.user_id)
        
        if ai_client:
            st.success(f"🤖 AI Assistant Available (Using configured provider)")
        else:
            st.info("💡 Configure AI provider in AI Settings tab for enhanced mediation assistance")
        
        # Message input
        user_input = st.text_area("Type your message...", height=100)
        
        if st.button("Send Message", type="primary"):
            if user_input.strip():
                # Process message with personalized AI mediation if available
                if ai_client:
                    try:
                        if hasattr(ai_client, 'chat_completions_create'):
                            # OpenAI-style client
                            response = ai_client.chat.completions.create(
                                model=ai_model,
                                messages=[
                                    {"role": "system", "content": "You are a professional mediator. Reframe this message to be more constructive and collaborative while preserving the core message."},
                                    {"role": "user", "content": user_input}
                                ]
                            )
                            mediated_message = response.choices[0].message.content.strip()
                        else:
                            # Other provider clients
                            mediated_message = user_input  # Fallback
                        
                        st.success("Message processed with AI:")
                        st.write(f"**Original:** {user_input}")
                        st.write(f"**AI-Mediated:** {mediated_message}")
                        
                    except Exception as e:
                        st.error(f"AI processing error: {e}")
                        st.write("**Original message:** {user_input}")
                else:
                    st.info("Message sent without AI processing:")
                    st.write(f"**Message:** {user_input}")
                    st.info("Configure AI provider in AI Settings for enhanced mediation assistance")
    
    with col2:
        st.write("**Session Controls**")
        
        # Participants
        st.write("**Participants:**")
        participants = get_case_participants(case['case_id'])
        for participant in participants:
            st.write(f"• {participant['full_name']}")
        
        # Session actions
        st.divider()
        if st.button("📋 Back to Case Details"):
            st.session_state.show_mediation_session = False
            st.rerun()
        
        if st.button("🔒 Manage Sharing"):
            st.session_state.show_sharing_controls = True
            st.rerun()

# -----------------------------------------------------------------------------
# 👤 CLIENT-SPECIFIC FUNCTIONS
# -----------------------------------------------------------------------------
def show_client_cases_tab(client_cases):
    """Display client's cases"""
    st.subheader("📋 My Cases")
    
    if not client_cases:
        st.info("You are not assigned to any cases yet.")
        return
    
    for case in client_cases:
        with st.container():
            st.markdown(f"""
            <div class="case-card fade-in">
                <h4>{case['title']}</h4>
                <p><strong>Case Number:</strong> {case['case_number']}</p>
                <p><strong>Type:</strong> {case['case_type']}</p>
                <p><strong>Status:</strong> {get_status_badge_html(case['status'])}</p>
                <p><strong>Mediator:</strong> {case.get('mediator_name', 'Not assigned')}</p>
            </div>
            """, unsafe_allow_html=True)
            
            col1, col2 = st.columns(2)
            with col1:
                if st.button(f"👁️ View Details", key=f"client_view_{case['case_id']}"):
                    st.session_state.selected_case = case
                    st.session_state.show_case_details = True
                    st.rerun()
            with col2:
                if st.button(f"💬 Join Session", key=f"client_mediate_{case['case_id']}"):
                    st.session_state.selected_case = case
                    st.session_state.show_mediation_session = True
                    st.rerun()
            
            st.divider()

def show_client_sessions_tab():
    """Display client's mediation sessions"""
    st.subheader("💬 My Mediation Sessions")
    
    if st.session_state.get('show_mediation_session'):
        show_client_mediation_session()
        return
    
    st.info("Select a case to join a mediation session.")

def show_client_mediation_session():
    """Display mediation session for clients"""
    case = st.session_state.selected_case
    
    st.subheader(f"💬 Mediation Session: {case['title']}")
    
    # Session info
    col1, col2, col3 = st.columns(3)
    with col1:
        st.write(f"**Case:** {case['case_number']}")
    with col2:
        st.write(f"**Mediator:** {case.get('mediator_name', 'Not assigned')}")
    with col3:
        st.write(f"**Status:** {case['status']}")
    
    st.divider()
    
    # Client mediation interface
    st.write("**Send a Message to the Mediator:**")
    
    user_input = st.text_area("Type your message...", height=100)
    
    if st.button("Send Message", type="primary"):
        if user_input.strip():
            if client:
                try:
                    response = client.chat.completions.create(
                        model="gpt-4o-mini",
                        messages=[
                            {"role": "system", "content": "You are a professional mediator. Reframe this message to be more constructive and collaborative while preserving the core message."},
                            {"role": "user", "content": user_input}
                        ]
                    )
                    mediated_message = response.choices[0].message.content.strip()
                    
                    st.success("Message processed:")
                    st.write(f"**Original:** {user_input}")
                    st.write(f"**Mediated:** {mediated_message}")
                    
                except Exception as e:
                    st.error(f"AI processing error: {e}")
            else:
                st.warning("AI mediation not available. Please configure OpenAI API key.")
    
    # Back button
    if st.button("← Back to My Cases"):
        st.session_state.show_mediation_session = False
        st.session_state.selected_case = None
        st.rerun()

# -----------------------------------------------------------------------------
# 📱 MAIN APPLICATION
# -----------------------------------------------------------------------------
def main():
    """Main application function"""
    st.set_page_config(
        page_title=APP_NAME,
        page_icon="⚖️",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    # Load custom CSS
    load_custom_css()
    
    # Initialize database
    init_database()
    migrate_database()
    
    # Enhanced Header
    st.markdown(get_enhanced_header_html(
        title=f"⚖️ {APP_NAME}",
        subtitle="Professional Case Management & Mediation Platform",
        description="Database-driven case management with optional AI enhancement"
    ), unsafe_allow_html=True)
    
    # Check authentication
    if 'user' not in st.session_state:
        show_authentication_page()
    else:
        show_main_application()

def show_main_application():
    """Show main application interface"""
    # Enhanced Sidebar with user info
    with st.sidebar:
        st.markdown(f"""
        <div class="workflow-step active">
            <h4>👤 {st.session_state.full_name}</h4>
            <p>{get_role_badge_html(st.session_state.user_role)}</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Logout button
        if st.button("🚪 Logout"):
            for key in list(st.session_state.keys()):
                del st.session_state[key]
            st.rerun()
    
    # Main content based on user role
    if st.session_state.user_role == 'mediator':
        show_mediator_dashboard()
    elif st.session_state.user_role == 'client':
        show_client_dashboard()
    else:
        st.error("Invalid user role. Please contact administrator.")

if __name__ == "__main__":
    main()
