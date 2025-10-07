"""
Enhanced User Management System for Unified Mediation Platform
Provides comprehensive user search, assignment, and management capabilities
"""

import sqlite3
import streamlit as st
from typing import Dict, List, Optional, Tuple
from datetime import datetime
import uuid

class UserManagementSystem:
    """Enhanced user management system for mediation platform"""
    
    def __init__(self, db_name: str):
        self.db_name = db_name
    
    def search_users(self, 
                    search_term: str = "", 
                    role_filter: str = None,
                    organization_filter: str = None,
                    limit: int = 50,
                    exclude_admin: bool = False) -> List[Dict]:
        """Search for users with various filters"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            # Build dynamic query
            query = """
                SELECT user_id, email, full_name, role, organization, phone, 
                       is_active, created_at, last_login
                FROM users 
                WHERE is_active = 1
            """
            params = []
            
            if search_term:
                query += " AND (email LIKE ? OR full_name LIKE ? OR organization LIKE ?)"
                search_param = f"%{search_term}%"
                params.extend([search_param, search_param, search_param])
            
            if role_filter:
                query += " AND role = ?"
                params.append(role_filter)
            
            if organization_filter:
                query += " AND organization LIKE ?"
                params.append(f"%{organization_filter}%")
            
            if exclude_admin:
                query += " AND role != 'admin'"
            
            query += " ORDER BY full_name LIMIT ?"
            params.append(limit)
            
            cursor.execute(query, params)
            results = cursor.fetchall()
            conn.close()
            
            users = []
            for row in results:
                users.append({
                    'user_id': row[0],
                    'email': row[1],
                    'full_name': row[2],
                    'role': row[3],
                    'organization': row[4],
                    'phone': row[5],
                    'is_active': bool(row[6]),
                    'created_at': row[7],
                    'last_login': row[8]
                })
            
            return users
            
        except Exception as e:
            print(f"Error searching users: {e}")
            return []
    
    def get_user_by_id(self, user_id: str) -> Optional[Dict]:
        """Get user by ID"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT user_id, email, full_name, role, organization, phone, 
                       is_active, created_at, last_login
                FROM users WHERE user_id = ?
            ''', (user_id,))
            
            result = cursor.fetchone()
            conn.close()
            
            if result:
                return {
                    'user_id': result[0],
                    'email': result[1],
                    'full_name': result[2],
                    'role': result[3],
                    'organization': result[4],
                    'phone': result[5],
                    'is_active': bool(result[6]),
                    'created_at': result[7],
                    'last_login': result[8]
                }
            return None
            
        except Exception as e:
            print(f"Error getting user: {e}")
            return None
    
    def create_user(self, 
                   full_name: str, 
                   email: str, 
                   password: str,
                   role: str = "client",
                   organization: str = None,
                   phone: str = None) -> Tuple[str, bool]:
        """Create a new user account"""
        try:
            import hashlib
            
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            # Check if email already exists
            cursor.execute('SELECT user_id FROM users WHERE email = ?', (email,))
            if cursor.fetchone():
                conn.close()
                return "", False
            
            user_id = str(uuid.uuid4())
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            cursor.execute('''
                INSERT INTO users (user_id, email, password_hash, role, full_name, 
                                 organization, phone, is_active, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (user_id, email, password_hash, role, full_name, organization, phone, 1, 
                  datetime.now().isoformat()))
            
            conn.commit()
            conn.close()
            
            return user_id, True
            
        except Exception as e:
            print(f"Error creating user: {e}")
            return "", False
    
    def update_user_role(self, user_id: str, new_role: str) -> bool:
        """Update user role"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('''
                UPDATE users SET role = ?, updated_at = ?
                WHERE user_id = ?
            ''', (new_role, datetime.now().isoformat(), user_id))
            
            conn.commit()
            conn.close()
            
            return True
            
        except Exception as e:
            print(f"Error updating user role: {e}")
            return False
    
    def get_case_participants(self, case_id: str) -> List[Dict]:
        """Get all participants for a case"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT cp.participant_id, cp.user_id, cp.role, cp.joined_at,
                       u.full_name, u.email, u.organization, u.phone
                FROM case_participants cp
                JOIN users u ON cp.user_id = u.user_id
                WHERE cp.case_id = ? AND cp.is_active = 1
                ORDER BY cp.joined_at
            ''', (case_id,))
            
            results = cursor.fetchall()
            conn.close()
            
            participants = []
            for row in results:
                participants.append({
                    'participant_id': row[0],
                    'user_id': row[1],
                    'role': row[2],
                    'joined_at': row[3],
                    'full_name': row[4],
                    'email': row[5],
                    'organization': row[6],
                    'phone': row[7]
                })
            
            return participants
            
        except Exception as e:
            print(f"Error getting case participants: {e}")
            return []
    
    def add_case_participant(self, 
                           case_id: str, 
                           user_id: str, 
                           role: str,
                           added_by: str = None) -> bool:
        """Add a participant to a case"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            # Check if user is already a participant
            cursor.execute('''
                SELECT participant_id FROM case_participants 
                WHERE case_id = ? AND user_id = ? AND is_active = 1
            ''', (case_id, user_id))
            
            if cursor.fetchone():
                conn.close()
                return False  # Already a participant
            
            participant_id = str(uuid.uuid4())
            cursor.execute('''
                INSERT INTO case_participants 
                (participant_id, case_id, user_id, role, added_by, joined_at, is_active)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (participant_id, case_id, user_id, role, added_by, 
                  datetime.now().isoformat(), 1))
            
            conn.commit()
            conn.close()
            
            return True
            
        except Exception as e:
            print(f"Error adding case participant: {e}")
            return False
    
    def remove_case_participant(self, case_id: str, user_id: str) -> bool:
        """Remove a participant from a case"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('''
                UPDATE case_participants 
                SET is_active = 0, left_at = ?
                WHERE case_id = ? AND user_id = ? AND is_active = 1
            ''', (datetime.now().isoformat(), case_id, user_id))
            
            conn.commit()
            conn.close()
            
            return True
            
        except Exception as e:
            print(f"Error removing case participant: {e}")
            return False
    
    def get_user_statistics(self) -> Dict:
        """Get user statistics for dashboard"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            # Total users
            cursor.execute('SELECT COUNT(*) FROM users WHERE is_active = 1')
            total_users = cursor.fetchone()[0]
            
            # Users by role
            cursor.execute('''
                SELECT role, COUNT(*) FROM users 
                WHERE is_active = 1 GROUP BY role
            ''')
            role_counts = dict(cursor.fetchall())
            
            # Recent registrations (last 30 days)
            thirty_days_ago = datetime.now().replace(day=datetime.now().day-30).isoformat()
            cursor.execute('''
                SELECT COUNT(*) FROM users 
                WHERE created_at >= ? AND is_active = 1
            ''', (thirty_days_ago,))
            recent_registrations = cursor.fetchone()[0]
            
            # Active users (logged in last 30 days)
            cursor.execute('''
                SELECT COUNT(*) FROM users 
                WHERE last_login >= ? AND is_active = 1
            ''', (thirty_days_ago,))
            active_users = cursor.fetchone()[0]
            
            conn.close()
            
            return {
                'total_users': total_users,
                'role_counts': role_counts,
                'recent_registrations': recent_registrations,
                'active_users': active_users
            }
            
        except Exception as e:
            print(f"Error getting user statistics: {e}")
            return {
                'total_users': 0,
                'role_counts': {},
                'recent_registrations': 0,
                'active_users': 0
            }

def show_enhanced_user_search():
    """Enhanced user search interface"""
    user_mgmt = UserManagementSystem("unified_mediation.db")
    
    st.subheader("🔍 User Search & Management")
    
    # Search filters
    col1, col2, col3 = st.columns(3)
    
    with col1:
        search_term = st.text_input("Search", placeholder="Name, email, or organization...")
    
    with col2:
        # Simplified role options - no admin role
        role_options = ["All", "client", "mediator"]
        role_filter = st.selectbox("Role", role_options)
        role_filter = None if role_filter == "All" else role_filter
    
    with col3:
        organization_filter = st.text_input("Organization", placeholder="Filter by organization...")
    
    # Search button
    if st.button("🔍 Search Users", type="primary"):
        users = user_mgmt.search_users(
            search_term=search_term,
            role_filter=role_filter,
            organization_filter=organization_filter,
            exclude_admin=True  # Always exclude admin (no admin role exists)
        )
        
        if users:
            st.write(f"**Found {len(users)} users:**")
            
            for user in users:
                with st.container():
                    col1, col2, col3, col4 = st.columns([3, 1, 1, 1])
                    
                    with col1:
                        st.write(f"**{user['full_name']}**")
                        st.write(f"📧 {user['email']}")
                        if user['organization']:
                            st.write(f"🏢 {user['organization']}")
                    
                    with col2:
                        role_color = {
                            'client': '🟢',
                            'mediator': '🔵', 
                            'admin': '🟣'
                        }
                        st.write(f"{role_color.get(user['role'], '⚪')} {user['role'].title()}")
                    
                    with col3:
                        if user['last_login']:
                            last_login = datetime.fromisoformat(user['last_login']).strftime('%m/%d')
                            st.write(f"📅 {last_login}")
                        else:
                            st.write("📅 Never")
                    
                    with col4:
                        if st.button("➕ Add", key=f"add_{user['user_id']}"):
                            st.session_state.selected_user = user
                            st.session_state.show_add_participant = True
                            st.rerun()
                    
                    st.divider()
        else:
            st.info("No users found matching your criteria.")

def show_add_participant_form():
    """Show form to add participant to case"""
    if not st.session_state.get('show_add_participant'):
        return
    
    user = st.session_state.selected_user
    case = st.session_state.selected_case
    
    st.subheader(f"➕ Add {user['full_name']} to Case")
    
    # User info
    st.write(f"**User:** {user['full_name']} ({user['email']})")
    st.write(f"**Case:** {case['title']}")
    
    # Role selection
    role = st.selectbox(
        "Participant Role",
        ["claimant", "respondent", "witness", "expert", "other"],
        help="Select the role this person will have in the mediation"
    )
    
    # Additional notes
    notes = st.text_area("Notes (optional)", placeholder="Any additional notes about this participant...")
    
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("✅ Add Participant", type="primary"):
            user_mgmt = UserManagementSystem("unified_mediation.db")
            # Import the correct function from aminz_mediation_platform
            from aminz_mediation_platform import assign_client_to_case
            success = assign_client_to_case(case['case_id'], user['user_id'], role)
            
            if success:
                st.success(f"Successfully added {user['full_name']} as {role}")
                st.session_state.show_add_participant = False
                st.session_state.selected_user = None
                st.rerun()
            else:
                st.error("Failed to add participant. They may already be assigned to this case.")
    
    with col2:
        if st.button("❌ Cancel"):
            st.session_state.show_add_participant = False
            st.session_state.selected_user = None
            st.rerun()

def show_user_statistics():
    """Show user statistics dashboard"""
    user_mgmt = UserManagementSystem("unified_mediation.db")
    stats = user_mgmt.get_user_statistics()
    
    st.subheader("📊 User Statistics")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Users", stats['total_users'])
    
    with col2:
        st.metric("Recent Registrations", stats['recent_registrations'])
    
    with col3:
        st.metric("Active Users (30d)", stats['active_users'])
    
    with col4:
        mediators = stats['role_counts'].get('mediator', 0)
        st.metric("Mediators", mediators)
    
    # Role breakdown
    if stats['role_counts']:
        st.write("**Users by Role:**")
        for role, count in stats['role_counts'].items():
            st.write(f"• {role.title()}: {count}")
