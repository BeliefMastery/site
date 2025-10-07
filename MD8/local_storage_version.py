"""
Local Storage Version of Unified Mediation Platform
Single-device access with local SQLite database and export/import capabilities
"""

import streamlit as st
import sqlite3
import json
import os
from datetime import datetime
from typing import Dict, List, Optional
import zipfile
import io
from pathlib import Path

# Import all the existing modules
from form_based_case_management import FormBasedCaseManager, show_form_based_case_management
from enhanced_styling import get_enhanced_css, get_enhanced_header_html, get_metric_card_html, get_status_badge_html, get_role_badge_html
from user_management_system import UserManagementSystem
from ai_provider_system import AIProviderManager, show_ai_provider_settings
from password_management import show_password_change_interface

class LocalDataManager:
    """Manages local data storage and export/import operations"""
    
    def __init__(self, db_name: str = "local_mediation.db"):
        self.db_name = db_name
        self.ensure_local_directory()
        self.init_database()
    
    def ensure_local_directory(self):
        """Ensure local data directory exists"""
        self.data_dir = Path("local_data")
        self.data_dir.mkdir(exist_ok=True)
        
        # Update database path to be in local directory
        self.db_path = self.data_dir / self.db_name
    
    def init_database(self):
        """Initialize local database with all required tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create all necessary tables (simplified version)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                full_name TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'client',
                created_at TEXT NOT NULL,
                last_login TEXT,
                is_active BOOLEAN DEFAULT 1
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS cases (
                case_id TEXT PRIMARY KEY,
                case_number TEXT UNIQUE NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                case_type TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'draft',
                assigned_mediator_id TEXT,
                created_by TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                scheduled_date TEXT,
                location TEXT,
                case_details TEXT,
                FOREIGN KEY (assigned_mediator_id) REFERENCES users(user_id),
                FOREIGN KEY (created_by) REFERENCES users(user_id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS case_participants (
                participant_id TEXT PRIMARY KEY,
                case_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                role TEXT NOT NULL,
                joined_at TEXT NOT NULL,
                is_active BOOLEAN DEFAULT 1,
                FOREIGN KEY (case_id) REFERENCES cases(case_id),
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS case_timeline (
                event_id TEXT PRIMARY KEY,
                case_id TEXT NOT NULL,
                event_type TEXT NOT NULL,
                event_description TEXT NOT NULL,
                performed_by TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (case_id) REFERENCES cases(case_id),
                FOREIGN KEY (performed_by) REFERENCES users(user_id)
            )
        ''')
        
        # Create default admin user if not exists
        cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'admin'")
        if cursor.fetchone()[0] == 0:
            from datetime import datetime
            import hashlib
            import secrets
            
            admin_id = f"admin-{secrets.token_hex(8)}"
            default_password = "admin123"  # User should change this
            password_hash = hashlib.sha256(default_password.encode()).hexdigest()
            
            cursor.execute('''
                INSERT INTO users (user_id, username, email, full_name, password_hash, role, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (admin_id, "admin", "admin@local.com", "Local Administrator", password_hash, "admin", datetime.now().isoformat()))
        
        conn.commit()
        conn.close()
    
    def export_data(self, include_sensitive: bool = False) -> bytes:
        """Export all local data to a ZIP file"""
        buffer = io.BytesIO()
        
        with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            # Export database
            if os.path.exists(self.db_path):
                zip_file.write(self.db_path, "database/mediation.db")
            
            # Export configuration
            config = {
                "export_date": datetime.now().isoformat(),
                "version": "2.0.0",
                "platform": "local_storage",
                "include_sensitive": include_sensitive
            }
            
            zip_file.writestr("config.json", json.dumps(config, indent=2))
            
            # Export app settings if they exist
            if os.path.exists("app_settings.json"):
                zip_file.write("app_settings.json", "settings/app_settings.json")
        
        buffer.seek(0)
        return buffer.getvalue()
    
    def import_data(self, zip_data: bytes) -> Dict:
        """Import data from ZIP file"""
        result = {"success": False, "message": "", "imported_items": {}}
        
        try:
            buffer = io.BytesIO(zip_data)
            
            with zipfile.ZipFile(buffer, 'r') as zip_file:
                # Read config
                if "config.json" in zip_file.namelist():
                    config_data = zip_file.read("config.json")
                    config = json.loads(config_data.decode())
                    result["imported_items"]["config"] = config
                
                # Import database
                if "database/mediation.db" in zip_file.namelist():
                    # Backup current database
                    if os.path.exists(self.db_path):
                        backup_path = self.db_path.with_suffix('.backup')
                        os.rename(self.db_path, backup_path)
                    
                    # Extract new database
                    zip_file.extract("database/mediation.db", self.data_dir)
                    os.rename(self.data_dir / "database" / "mediation.db", self.db_path)
                    
                    # Clean up extracted directory
                    import shutil
                    shutil.rmtree(self.data_dir / "database", ignore_errors=True)
                    
                    result["imported_items"]["database"] = "Successfully imported"
                
                # Import settings
                if "settings/app_settings.json" in zip_file.namelist():
                    zip_file.extract("settings/app_settings.json", ".")
                    result["imported_items"]["settings"] = "Successfully imported"
            
            result["success"] = True
            result["message"] = "Data imported successfully"
            
        except Exception as e:
            result["message"] = f"Import failed: {str(e)}"
        
        return result
    
    def get_data_summary(self) -> Dict:
        """Get summary of local data"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute("SELECT COUNT(*) FROM users")
            user_count = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM cases")
            case_count = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM case_participants")
            participant_count = cursor.fetchone()[0]
            
            conn.close()
            
            return {
                "users": user_count,
                "cases": case_count,
                "participants": participant_count,
                "database_size": os.path.getsize(self.db_path) if os.path.exists(self.db_path) else 0,
                "last_modified": datetime.fromtimestamp(os.path.getmtime(self.db_path)).isoformat() if os.path.exists(self.db_path) else None
            }
        except Exception as e:
            return {"error": str(e)}

def show_local_data_management():
    """Show local data management interface"""
    st.header("💾 Local Data Management")
    
    data_manager = LocalDataManager()
    
    # Data summary
    summary = data_manager.get_data_summary()
    
    if "error" in summary:
        st.error(f"Error loading data summary: {summary['error']}")
        return
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown(get_metric_card_html(
            value=str(summary["users"]),
            label="Users",
            delta=f"{summary['users']} total users"
        ), unsafe_allow_html=True)
    
    with col2:
        st.markdown(get_metric_card_html(
            value=str(summary["cases"]),
            label="Cases",
            delta=f"{summary['cases']} total cases"
        ), unsafe_allow_html=True)
    
    with col3:
        st.markdown(get_metric_card_html(
            value=str(summary["participants"]),
            label="Participants",
            delta=f"{summary['participants']} total participants"
        ), unsafe_allow_html=True)
    
    with col4:
        size_mb = summary["database_size"] / (1024 * 1024)
        st.markdown(get_metric_card_html(
            value=f"{size_mb:.2f} MB",
            label="Database Size",
            delta="Local storage"
        ), unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Export/Import section
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("📤 Export Data")
        st.write("Export all your local data for backup or transfer to another device.")
        
        include_sensitive = st.checkbox("Include sensitive data", value=False)
        
        if st.button("📦 Export All Data", type="primary"):
            with st.spinner("Creating export package..."):
                export_data = data_manager.export_data(include_sensitive)
                
                st.download_button(
                    label="⬇️ Download Export File",
                    data=export_data,
                    file_name=f"mediation_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.zip",
                    mime="application/zip"
                )
                
                st.success("✅ Export package created successfully!")
    
    with col2:
        st.subheader("📥 Import Data")
        st.write("Import data from another device or restore from backup.")
        
        uploaded_file = st.file_uploader(
            "Choose export file",
            type=['zip'],
            help="Select a .zip file exported from another installation"
        )
        
        if uploaded_file is not None:
            if st.button("📥 Import Data", type="primary"):
                with st.spinner("Importing data..."):
                    result = data_manager.import_data(uploaded_file.read())
                    
                    if result["success"]:
                        st.success(f"✅ {result['message']}")
                        st.write("**Imported items:**")
                        for item, status in result["imported_items"].items():
                            st.write(f"• {item}: {status}")
                        
                        st.info("🔄 Please refresh the page to see imported data.")
                    else:
                        st.error(f"❌ {result['message']}")
    
    # Local storage info
    st.markdown("---")
    st.subheader("ℹ️ Local Storage Information")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.info("""
        **Benefits of Local Storage:**
        • Complete privacy - data never leaves your device
        • No internet required after initial setup
        • Full control over your data
        • Fast performance
        • No subscription costs
        """)
    
    with col2:
        st.warning("""
        **Limitations:**
        • Single device access
        • Data lost if device fails (use export/import for backup)
        • No real-time collaboration
        • Manual backup required
        """)

def show_local_version_dashboard():
    """Show dashboard for local storage version"""
    st.markdown(get_enhanced_header_html(
        title="⚖️ Unified Mediation Platform",
        subtitle="Local Storage Edition - Complete Privacy",
        description="Your data stays on your device. Export/import for multi-device access."
    ), unsafe_allow_html=True)
    
    # Navigation tabs
    tab1, tab2, tab3, tab4, tab5 = st.tabs([
        "📝 Case Management", 
        "💾 Data Management",
        "💬 Mediation Sessions",
        "🤖 AI Settings",
        "🔐 User Settings"
    ])
    
    with tab1:
        show_form_based_case_management()
    
    with tab2:
        show_local_data_management()
    
    with tab3:
        st.info("💬 Mediation sessions will be available in the next update.")
    
    with tab4:
        show_ai_provider_settings()
    
    with tab5:
        show_password_change_interface()

def main():
    """Main function for local storage version"""
    # Load enhanced CSS
    st.markdown(get_enhanced_css(), unsafe_allow_html=True)
    
    # Initialize session state
    if 'authenticated' not in st.session_state:
        st.session_state.authenticated = False
    
    if not st.session_state.authenticated:
        # Simple authentication for local version
        st.title("🔐 Local Access")
        
        col1, col2, col3 = st.columns([1, 2, 1])
        with col2:
            with st.container():
                st.markdown("### Welcome to Local Storage Edition")
                st.write("This version stores all data locally on your device for complete privacy.")
                
                username = st.text_input("Username", value="admin")
                password = st.text_input("Password", type="password", value="admin123")
                
                if st.button("Login", type="primary"):
                    if username == "admin" and password == "admin123":
                        st.session_state.authenticated = True
                        st.session_state.user_id = "admin"
                        st.session_state.user_role = "admin"
                        st.rerun()
                    else:
                        st.error("Invalid credentials")
    else:
        show_local_version_dashboard()

if __name__ == "__main__":
    main()
