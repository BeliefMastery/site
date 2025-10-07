"""
Form-Based Case Management Solution
A reliable approach using Streamlit forms for case archiving and deletion
"""

import streamlit as st
import sqlite3
import json
from datetime import datetime
from typing import Dict, List, Optional
from enhanced_styling import get_status_badge_html

class FormBasedCaseManager:
    def __init__(self, db_name: str):
        self.db_name = db_name
    
    def archive_case(self, case_id: str, archived_by: str) -> bool:
        """Archive a case (set status to retired)"""
        try:
            print(f"[DEBUG] Starting archive operation for case_id: {case_id}")
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            # Get case info for logging
            cursor.execute('SELECT title, case_number, status FROM cases WHERE case_id = ?', (case_id,))
            case_info = cursor.fetchone()
            
            if not case_info:
                print(f"[ERROR] Case {case_id} not found in database")
                conn.close()
                return False
            
            case_title, case_number, current_status = case_info
            print(f"[DEBUG] Found case: {case_title} ({case_number}) - Current status: {current_status}")
            
            # Check if already archived
            if current_status == 'retired':
                print(f"[WARNING] Case {case_id} is already archived")
                conn.close()
                return False
            
            # Archive case (use 'retired' status)
            cursor.execute('''
                UPDATE cases 
                SET status = 'retired', updated_at = ?
                WHERE case_id = ?
            ''', (datetime.now().isoformat(), case_id))
            
            rows_updated = cursor.rowcount
            print(f"[DEBUG] Rows updated: {rows_updated}")
            
            if rows_updated == 0:
                print(f"[ERROR] No case updated for case_id: {case_id}")
                conn.close()
                return False
            
            # Log the archiving in case timeline
            try:
                cursor.execute('''
                    INSERT INTO case_timeline 
                    (event_id, case_id, event_type, event_description, performed_by, created_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (f"event-{int(datetime.now().timestamp())}", case_id, "case_archived", 
                      f"Case archived: {case_title} ({case_number})", archived_by, datetime.now().isoformat()))
                print(f"[DEBUG] Timeline event logged successfully")
            except Exception as timeline_error:
                print(f"[WARNING] Could not log timeline event: {timeline_error}")
                # Continue anyway, timeline logging is not critical
            
            conn.commit()
            print(f"[DEBUG] Database transaction committed successfully")
            conn.close()
            
            print(f"[SUCCESS] Successfully archived case: {case_title} ({case_number})")
            return True
            
        except Exception as e:
            print(f"[ERROR] Error archiving case: {e}")
            import traceback
            print(f"[ERROR] Traceback: {traceback.format_exc()}")
            if 'conn' in locals():
                try:
                    conn.rollback()
                    conn.close()
                except:
                    pass
            return False
    
    def permanently_delete_case(self, case_id: str, deleted_by: str) -> bool:
        """Permanently delete a case and all related data"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            # Get case details for logging
            cursor.execute('''
                SELECT title, case_number FROM cases WHERE case_id = ?
            ''', (case_id,))
            case_info = cursor.fetchone()
            
            if not case_info:
                conn.close()
                return False
            
            case_title, case_number = case_info
            
            # Delete related data in correct order (foreign key constraints)
            tables_to_clean = [
                'case_timeline', 'case_documents', 'communications',
                'case_participants', 'mediation_sessions', 'session_participants',
                'session_messages', 'case_notes', 'case_party_links',
                'case_disputed_details', 'mediator_sharing_controls',
                'information_sharing_controls', 'consent_forms', 'user_consent',
                'case_outcomes', 'case_billing', 'audit_log'
            ]
            
            for table in tables_to_clean:
                try:
                    cursor.execute(f'DELETE FROM {table} WHERE case_id = ?', (case_id,))
                except Exception as e:
                    print(f"Warning: Could not clean table {table}: {e}")
            
            # Finally delete the case itself
            cursor.execute('DELETE FROM cases WHERE case_id = ?', (case_id,))
            
            conn.commit()
            conn.close()
            
            print(f"Successfully permanently deleted case: {case_title} ({case_number})")
            return True
            
        except Exception as e:
            print(f"Error permanently deleting case: {e}")
            if 'conn' in locals():
                conn.rollback()
                conn.close()
            return False
    
    def restore_case(self, case_id: str, restored_by: str) -> bool:
        """Restore an archived case back to active status"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            # Get case info for logging
            cursor.execute('SELECT title, case_number FROM cases WHERE case_id = ?', (case_id,))
            case_info = cursor.fetchone()
            
            if not case_info:
                print(f"Case {case_id} not found")
                conn.close()
                return False
            
            case_title, case_number = case_info
            
            # Restore case (set status to active)
            cursor.execute('''
                UPDATE cases 
                SET status = 'active', updated_at = ?
                WHERE case_id = ?
            ''', (datetime.now().isoformat(), case_id))
            
            if cursor.rowcount == 0:
                print(f"No case updated for case_id: {case_id}")
                conn.close()
                return False
            
            # Log the restoration in case timeline
            cursor.execute('''
                INSERT INTO case_timeline 
                (event_id, case_id, event_type, event_description, performed_by, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (f"event-{int(datetime.now().timestamp())}", case_id, "case_restored", 
                  f"Case restored: {case_title} ({case_number})", restored_by, datetime.now().isoformat()))
            
            conn.commit()
            conn.close()
            
            print(f"Successfully restored case: {case_title} ({case_number})")
            return True
            
        except Exception as e:
            print(f"Error restoring case: {e}")
            return False

def show_form_based_case_management():
    """Show form-based case management interface"""
    st.header("📋 Form-Based Case Management")
    st.info("This version uses forms for reliable archive/delete operations")
    
    # Initialize case manager
    case_manager = FormBasedCaseManager("unified_mediation.db")
    
    # Get user info
    user_id = st.session_state.get('user_id')
    user_role = st.session_state.get('user_role')
    
    if not user_id:
        st.error("User not authenticated")
        return
    
    # Archive toggle
    col1, col2 = st.columns([3, 1])
    with col1:
        show_archived = st.checkbox("📁 Show Archived Cases", key="form_show_archived")
    with col2:
        if st.button("🔄 Refresh", key="form_refresh"):
            st.rerun()
    
    # Get cases
    if show_archived:
        cases = get_archived_cases_form(user_id, user_role)
        case_type_label = "archived"
    else:
        cases = get_active_cases_form(user_id, user_role)
        case_type_label = "active"
    
    if not cases:
        if show_archived:
            st.info("No archived cases found.")
        else:
            st.info("No active cases found.")
        return
    
    st.write(f"**{len(cases)} {case_type_label} cases found**")
    
    # Display cases with form-based actions
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
            
            # Form-based action buttons
            is_archived = case['status'] in ['retired', 'cancelled']
            
            if user_role == 'mediator':
                if is_archived:
                    # Archived case actions using forms
                    col1, col2, col3, col4 = st.columns(4)
                    
                    with col1:
                        with st.form(f"view_form_{case['case_id']}_archived"):
                            if st.form_submit_button("📝 View Case"):
                                show_case_details_form(case)
                    
                    with col2:
                        with st.form(f"export_form_{case['case_id']}_archived"):
                            if st.form_submit_button("📊 Export"):
                                st.info("Export functionality not implemented in form version")
                    
                    with col3:
                        with st.form(f"restore_form_{case['case_id']}_archived"):
                            st.write("**Restore Case**")
                            st.write(f"Case: {case['title']}")
                            if st.form_submit_button("🔄 Restore Case", type="primary"):
                                with st.spinner("Restoring case..."):
                                    success = case_manager.restore_case(case['case_id'], user_id)
                                    if success:
                                        st.success(f"✅ Case '{case['title']}' restored successfully!")
                                        st.balloons()
                                        st.rerun()
                                    else:
                                        st.error("❌ Failed to restore case.")
                    
                    with col4:
                        with st.form(f"delete_form_{case['case_id']}_archived"):
                            st.write("**⚠️ PERMANENT DELETE**")
                            st.write(f"Case: {case['title']}")
                            st.write("**WARNING: Cannot be undone!**")
                            if st.form_submit_button("🗑️ DELETE PERMANENTLY", type="primary"):
                                with st.spinner("Permanently deleting case..."):
                                    success = case_manager.permanently_delete_case(case['case_id'], user_id)
                                    if success:
                                        st.success(f"✅ Case '{case['title']}' permanently deleted!")
                                        st.balloons()
                                        st.rerun()
                                    else:
                                        st.error("❌ Failed to permanently delete case.")
                else:
                    # Active case actions using forms
                    col1, col2, col3 = st.columns(3)
                    
                    with col1:
                        with st.form(f"manage_form_{case['case_id']}_active"):
                            if st.form_submit_button("📝 Manage Case"):
                                show_case_details_form(case)
                    
                    with col2:
                        with st.form(f"export_form_{case['case_id']}_active"):
                            if st.form_submit_button("📊 Export"):
                                st.info("Export functionality not implemented in form version")
                    
                    with col3:
                        with st.form(f"archive_form_{case['case_id']}_active"):
                            st.write("**Archive Case**")
                            st.write(f"Case: {case['title']}")
                            st.write("Will move to archived status")
                            if st.form_submit_button("📁 Archive Case", type="primary"):
                                with st.spinner("Archiving case..."):
                                    try:
                                        success = case_manager.archive_case(case['case_id'], user_id)
                                        if success:
                                            st.success(f"✅ Case '{case['title']}' archived successfully!")
                                            st.balloons()
                                            st.rerun()
                                        else:
                                            st.error(f"❌ Failed to archive case '{case['title']}'. Check console for details.")
                                    except Exception as e:
                                        st.error(f"❌ Error during archive operation: {str(e)}")
                                        st.write("Check console for detailed error information.")
            else:
                # Client view using forms
                col1, col2 = st.columns(2)
                
                with col1:
                    with st.form(f"view_form_{case['case_id']}_client"):
                        if st.form_submit_button("📝 View Case"):
                            show_case_details_form(case)
                
                with col2:
                    with st.form(f"export_form_{case['case_id']}_client"):
                        if st.form_submit_button("📊 Export"):
                            st.info("Export functionality not implemented in form version")
            
            st.divider()

def show_case_details_form(case: Dict):
    """Show case details using form approach"""
    st.markdown("---")
    st.markdown("### 📝 Case Details")
    
    # Basic case info
    col1, col2 = st.columns(2)
    
    with col1:
        st.write(f"**Title:** {case['title']}")
        st.write(f"**Case Number:** {case['case_number']}")
        st.write(f"**Type:** {case['case_type']}")
        st.write(f"**Status:** {get_status_badge_html(case['status'])}")
    
    with col2:
        st.write(f"**Created:** {case['created_at']}")
        st.write(f"**Updated:** {case.get('updated_at', 'N/A')}")
        st.write(f"**Description:** {case.get('description', 'No description')}")
    
    # Participants
    st.markdown("#### 👥 Participants")
    try:
        conn = sqlite3.connect("unified_mediation.db")
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT u.full_name, u.email, u.role, cp.role, cp.joined_at, cp.is_active
            FROM case_participants cp
            JOIN users u ON cp.user_id = u.user_id
            WHERE cp.case_id = ?
            ORDER BY cp.joined_at DESC
        ''', (case['case_id'],))
        
        participants = cursor.fetchall()
        conn.close()
        
        if participants:
            for participant in participants:
                full_name, email, user_role, participant_role, joined_at, is_active = participant
                status = "✅ Active" if is_active else "❌ Inactive"
                st.write(f"• **{full_name}** ({email}) - {user_role.title()} - {status}")
                st.write(f"  Role: {participant_role}, Joined: {joined_at}")
        else:
            st.info("No participants assigned to this case yet.")
            
    except Exception as e:
        st.error(f"Error loading participants: {e}")

def get_active_cases_form(user_id: str, user_role: str) -> List[Dict]:
    """Get active cases for user"""
    try:
        conn = sqlite3.connect("unified_mediation.db")
        cursor = conn.cursor()
        
        if user_role == 'mediator':
            cursor.execute('''
                SELECT c.case_id, c.case_number, c.title, c.description, c.case_type, c.status, 
                       c.assigned_mediator_id, u.full_name as mediator_name, c.created_at, c.updated_at
                FROM cases c
                LEFT JOIN users u ON c.assigned_mediator_id = u.user_id
                WHERE c.status NOT IN ('retired', 'cancelled')
                ORDER BY c.created_at DESC
            ''')
        else:
            cursor.execute('''
                SELECT c.case_id, c.case_number, c.title, c.description, c.case_type, c.status, 
                       c.assigned_mediator_id, u.full_name as mediator_name, c.created_at, c.updated_at
                FROM cases c
                LEFT JOIN users u ON c.assigned_mediator_id = u.user_id
                JOIN case_participants cp ON c.case_id = cp.case_id
                WHERE cp.user_id = ? AND c.status NOT IN ('retired', 'cancelled')
                ORDER BY c.created_at DESC
            ''', (user_id,))
        
        cases = []
        for row in cursor.fetchall():
            cases.append({
                'case_id': row[0],
                'case_number': row[1],
                'title': row[2],
                'description': row[3],
                'case_type': row[4],
                'status': row[5],
                'assigned_mediator_id': row[6],
                'mediator_name': row[7],
                'created_at': row[8],
                'updated_at': row[9]
            })
        
        conn.close()
        return cases
        
    except Exception as e:
        st.error(f"Error loading active cases: {e}")
        return []

def get_archived_cases_form(user_id: str, user_role: str) -> List[Dict]:
    """Get archived cases for user"""
    try:
        conn = sqlite3.connect("unified_mediation.db")
        cursor = conn.cursor()
        
        if user_role == 'mediator':
            cursor.execute('''
                SELECT c.case_id, c.case_number, c.title, c.description, c.case_type, c.status, 
                       c.assigned_mediator_id, u.full_name as mediator_name, c.created_at, c.updated_at
                FROM cases c
                LEFT JOIN users u ON c.assigned_mediator_id = u.user_id
                WHERE c.status IN ('retired', 'cancelled')
                ORDER BY c.created_at DESC
            ''')
        else:
            cursor.execute('''
                SELECT c.case_id, c.case_number, c.title, c.description, c.case_type, c.status, 
                       c.assigned_mediator_id, u.full_name as mediator_name, c.created_at, c.updated_at
                FROM cases c
                LEFT JOIN users u ON c.assigned_mediator_id = u.user_id
                JOIN case_participants cp ON c.case_id = cp.case_id
                WHERE cp.user_id = ? AND c.status IN ('retired', 'cancelled')
                ORDER BY c.created_at DESC
            ''', (user_id,))
        
        cases = []
        for row in cursor.fetchall():
            cases.append({
                'case_id': row[0],
                'case_number': row[1],
                'title': row[2],
                'description': row[3],
                'case_type': row[4],
                'status': row[5],
                'assigned_mediator_id': row[6],
                'mediator_name': row[7],
                'created_at': row[8],
                'updated_at': row[9]
            })
        
        conn.close()
        return cases
        
    except Exception as e:
        st.error(f"Error loading archived cases: {e}")
        return []
