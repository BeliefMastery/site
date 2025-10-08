"""
Password Management System
Simple password change functionality for all users
"""

import streamlit as st
import sqlite3
import hashlib
from datetime import datetime

def show_password_change_interface():
    """Show password change interface for all users"""
    with st.expander("🔐 Change Password", expanded=False):
        st.subheader("Change Your Password")
        
        current_password = st.text_input("Current Password", type="password", key="current_pwd")
        new_password = st.text_input("New Password", type="password", key="new_pwd")
        confirm_password = st.text_input("Confirm New Password", type="password", key="confirm_pwd")
        
        if st.button("🔄 Change Password", type="primary"):
            if not current_password or not new_password or not confirm_password:
                st.error("❌ Please fill in all fields")
                return
            
            if new_password != confirm_password:
                st.error("❌ New passwords do not match")
                return
            
            if len(new_password) < 6:
                st.error("❌ New password must be at least 6 characters long")
                return
            
            # Verify current password
            try:
                conn = sqlite3.connect("unified_mediation.db")
                cursor = conn.cursor()
                
                current_hash = hashlib.sha256(current_password.encode()).hexdigest()
                cursor.execute('SELECT password_hash FROM users WHERE user_id = ?', (st.session_state.user_id,))
                stored_hash = cursor.fetchone()
                
                if not stored_hash or stored_hash[0] != current_hash:
                    st.error("❌ Current password is incorrect")
                    conn.close()
                    return
                
                # Update password
                new_hash = hashlib.sha256(new_password.encode()).hexdigest()
                cursor.execute('''
                    UPDATE users 
                    SET password_hash = ?, updated_at = ?
                    WHERE user_id = ?
                ''', (new_hash, datetime.now().isoformat(), st.session_state.user_id))
                
                conn.commit()
                conn.close()
                
                st.success("✅ Password changed successfully!")
                
                # Clear the form
                st.session_state.current_pwd = ""
                st.session_state.new_pwd = ""
                st.session_state.confirm_pwd = ""
                
            except Exception as e:
                st.error(f"❌ Error changing password: {e}")















