"""
Core Database System for Unified Mediation Platform
Handles all database operations including user management, case management, and data export
"""

import sqlite3
import json
import uuid
import hashlib
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import csv
import io

class CoreDatabaseSystem:
    """Core database system for mediation platform"""
    
    def __init__(self, db_name: str = "unified_mediation.db"):
        self.db_name = db_name
        self.init_database()
    
    def init_database(self):
        """Initialize database with all required tables"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            # Users table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    user_id TEXT PRIMARY KEY,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    full_name TEXT NOT NULL,
                    role TEXT NOT NULL CHECK(role IN ('mediator', 'client', 'admin')),
                    organization TEXT,
                    phone TEXT,
                    is_active INTEGER DEFAULT 1,
                    created_at TEXT NOT NULL,
                    last_login TEXT,
                    preferred_mediators TEXT
                )
            ''')
            
            # Cases table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS cases (
                    case_id TEXT PRIMARY KEY,
                    case_number TEXT UNIQUE NOT NULL,
                    title TEXT NOT NULL,
                    description TEXT,
                    category TEXT NOT NULL,
                    priority TEXT NOT NULL CHECK(priority IN ('low', 'medium', 'high', 'urgent')),
                    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'pending', 'completed', 'archived', 'retired')),
                    assigned_mediator_id TEXT NOT NULL,
                    created_by TEXT NOT NULL,
                    case_details TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    FOREIGN KEY (assigned_mediator_id) REFERENCES users (user_id),
                    FOREIGN KEY (created_by) REFERENCES users (user_id)
                )
            ''')
            
            # Case participants table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS case_participants (
                    participant_id TEXT PRIMARY KEY,
                    case_id TEXT NOT NULL,
                    user_id TEXT NOT NULL,
                    role TEXT NOT NULL CHECK(role IN ('primary_party', 'secondary_party', 'witness', 'support_person')),
                    added_by TEXT NOT NULL,
                    joined_at TEXT NOT NULL,
                    is_active INTEGER DEFAULT 1,
                    FOREIGN KEY (case_id) REFERENCES cases (case_id),
                    FOREIGN KEY (user_id) REFERENCES users (user_id),
                    FOREIGN KEY (added_by) REFERENCES users (user_id)
                )
            ''')
            
            # Mediation sessions table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS mediation_sessions (
                    session_id TEXT PRIMARY KEY,
                    case_id TEXT NOT NULL,
                    mediator_id TEXT NOT NULL,
                    session_type TEXT NOT NULL CHECK(session_type IN ('joint', 'individual', 'caucus')),
                    session_date TEXT NOT NULL,
                    duration_hours INTEGER DEFAULT 2,
                    location TEXT,
                    status TEXT NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
                    notes TEXT,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (case_id) REFERENCES cases (case_id),
                    FOREIGN KEY (mediator_id) REFERENCES users (user_id)
                )
            ''')
            
            # Case timeline table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS case_timeline (
                    event_id TEXT PRIMARY KEY,
                    case_id TEXT NOT NULL,
                    event_type TEXT NOT NULL,
                    event_description TEXT NOT NULL,
                    performed_by TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (case_id) REFERENCES cases (case_id),
                    FOREIGN KEY (performed_by) REFERENCES users (user_id)
                )
            ''')
            
            # Client information table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS client_information (
                    info_id TEXT PRIMARY KEY,
                    case_id TEXT NOT NULL,
                    user_id TEXT NOT NULL,
                    field_name TEXT NOT NULL,
                    field_value TEXT NOT NULL,
                    visibility_settings TEXT,
                    submitted_at TEXT NOT NULL,
                    FOREIGN KEY (case_id) REFERENCES cases (case_id),
                    FOREIGN KEY (user_id) REFERENCES users (user_id)
                )
            ''')
            
            conn.commit()
            conn.close()
            
            print("✅ Database initialized successfully")
            
        except Exception as e:
            print(f"❌ Error initializing database: {e}")
            raise
    
    def authenticate_user(self, email: str, password: str) -> Optional[Dict]:
        """Authenticate user and return user data"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            cursor.execute('''
                SELECT user_id, email, full_name, role, organization, phone, is_active
                FROM users 
                WHERE email = ? AND password_hash = ? AND is_active = 1
            ''', (email, password_hash))
            
            result = cursor.fetchone()
            
            if result:
                # Update last login
                cursor.execute('''
                    UPDATE users SET last_login = ? WHERE email = ?
                ''', (datetime.now().isoformat(), email))
                conn.commit()
                
                user_data = {
                    'user_id': result[0],
                    'email': result[1],
                    'full_name': result[2],
                    'role': result[3],
                    'organization': result[4],
                    'phone': result[5],
                    'is_active': bool(result[6])
                }
                
                conn.close()
                return user_data
            
            conn.close()
            return None
            
        except Exception as e:
            print(f"Error authenticating user: {e}")
            return None
    
    def create_user(self, email: str, password: str, full_name: str, role: str, 
                   organization: str = None, phone: str = None, preferred_mediators: List[str] = None) -> bool:
        """Create a new user"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            user_id = str(uuid.uuid4())
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            preferred_mediators_json = json.dumps(preferred_mediators) if preferred_mediators else None
            
            cursor.execute('''
                INSERT INTO users 
                (user_id, email, password_hash, full_name, role, organization, phone, 
                 is_active, created_at, preferred_mediators)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (user_id, email, password_hash, full_name, role, organization, phone,
                  1, datetime.now().isoformat(), preferred_mediators_json))
            
            conn.commit()
            conn.close()
            return True
            
        except Exception as e:
            print(f"Error creating user: {e}")
            return False
    
    def create_case(self, title: str, description: str, category: str, priority: str,
                   assigned_mediator_id: str, created_by: str, case_details: Dict = None) -> str:
        """Create a new case"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            case_id = str(uuid.uuid4())
            case_number = f"CASE-{datetime.now().strftime('%Y%m%d')}-{int(datetime.now().timestamp()) % 10000}"
            case_details_json = json.dumps(case_details) if case_details else None
            
            cursor.execute('''
                INSERT INTO cases 
                (case_id, case_number, title, description, category, priority, 
                 assigned_mediator_id, created_by, case_details, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (case_id, case_number, title, description, category, priority,
                  assigned_mediator_id, created_by, case_details_json,
                  datetime.now().isoformat(), datetime.now().isoformat()))
            
            # Log creation in timeline
            cursor.execute('''
                INSERT INTO case_timeline 
                (event_id, case_id, event_type, event_description, performed_by, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (str(uuid.uuid4()), case_id, "created", 
                  f"Case created: {title} ({case_number})", created_by,
                  datetime.now().isoformat()))
            
            conn.commit()
            conn.close()
            
            return case_id
            
        except Exception as e:
            print(f"Error creating case: {e}")
            return None
    
    def assign_client_to_case(self, case_id: str, user_id: str, role: str, added_by: str) -> bool:
        """Assign a client to a case"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            participant_id = str(uuid.uuid4())
            
            cursor.execute('''
                INSERT INTO case_participants 
                (participant_id, case_id, user_id, role, added_by, joined_at, is_active)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (participant_id, case_id, user_id, role, added_by,
                  datetime.now().isoformat(), 1))
            
            # Log assignment in timeline
            cursor.execute('''
                INSERT INTO case_timeline 
                (event_id, case_id, event_type, event_description, performed_by, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (str(uuid.uuid4()), case_id, "participant_added", 
                  f"Client assigned to case with role: {role}", added_by,
                  datetime.now().isoformat()))
            
            conn.commit()
            conn.close()
            
            return True
            
        except Exception as e:
            print(f"Error assigning client to case: {e}")
            return False
    
    def get_user_cases(self, user_id: str, role: str) -> List[Dict]:
        """Get cases for a user based on their role"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            if role == 'mediator':
                # Get cases where user is the assigned mediator
                cursor.execute('''
                    SELECT c.case_id, c.case_number, c.title, c.description, c.category, 
                           c.priority, c.status, c.assigned_mediator_id, c.created_at,
                           u.full_name as mediator_name, c.case_details
                    FROM cases c
                    JOIN users u ON c.assigned_mediator_id = u.user_id
                    WHERE c.assigned_mediator_id = ?
                    ORDER BY c.created_at DESC
                ''', (user_id,))
            else:
                # Get cases where user is a participant
                cursor.execute('''
                    SELECT c.case_id, c.case_number, c.title, c.description, c.category, 
                           c.priority, c.status, c.assigned_mediator_id, c.created_at,
                           u.full_name as mediator_name, c.case_details
                    FROM cases c
                    JOIN case_participants cp ON c.case_id = cp.case_id
                    JOIN users u ON c.assigned_mediator_id = u.user_id
                    WHERE cp.user_id = ? AND cp.is_active = 1
                    ORDER BY c.created_at DESC
                ''', (user_id,))
            
            results = cursor.fetchall()
            conn.close()
            
            cases = []
            for row in results:
                case_details = json.loads(row[10]) if row[10] else {}
                cases.append({
                    'case_id': row[0],
                    'case_number': row[1],
                    'title': row[2],
                    'description': row[3],
                    'category': row[4],
                    'priority': row[5],
                    'status': row[6],
                    'assigned_mediator_id': row[7],
                    'created_at': row[8],
                    'mediator_name': row[9],
                    'case_details': case_details
                })
            
            return cases
            
        except Exception as e:
            print(f"Error getting user cases: {e}")
            return []
    
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
    
    def archive_case(self, case_id: str, archived_by: str, reason: str = None) -> bool:
        """Archive a case"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            # Update case status
            cursor.execute('''
                UPDATE cases 
                SET status = 'retired', updated_at = ?
                WHERE case_id = ?
            ''', (datetime.now().isoformat(), case_id))
            
            # Log archiving in timeline
            cursor.execute('''
                INSERT INTO case_timeline 
                (event_id, case_id, event_type, event_description, performed_by, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (str(uuid.uuid4()), case_id, "case_archived", 
                  f"Case archived. Reason: {reason}" if reason else "Case archived", 
                  archived_by, datetime.now().isoformat()))
            
            conn.commit()
            conn.close()
            
            return True
            
        except Exception as e:
            print(f"Error archiving case: {e}")
            return False
    
    def delete_case(self, case_id: str, deleted_by: str, reason: str = None) -> bool:
        """Permanently delete a case and all related data"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            # Delete related data first (foreign key constraints)
            cursor.execute('DELETE FROM case_timeline WHERE case_id = ?', (case_id,))
            cursor.execute('DELETE FROM client_information WHERE case_id = ?', (case_id,))
            cursor.execute('DELETE FROM case_participants WHERE case_id = ?', (case_id,))
            cursor.execute('DELETE FROM mediation_sessions WHERE case_id = ?', (case_id,))
            
            # Delete the case
            cursor.execute('DELETE FROM cases WHERE case_id = ?', (case_id,))
            
            conn.commit()
            conn.close()
            
            return True
            
        except Exception as e:
            print(f"Error deleting case: {e}")
            return False
    
    def export_case_data_csv(self, case_id: str, export_options: Dict) -> str:
        """Export case data to CSV format"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            # Get case details
            cursor.execute('''
                SELECT c.case_id, c.case_number, c.title, c.description, c.category, 
                       c.priority, c.status, c.created_at, c.updated_at,
                       u.full_name as mediator_name, u.email as mediator_email
                FROM cases c
                JOIN users u ON c.assigned_mediator_id = u.user_id
                WHERE c.case_id = ?
            ''', (case_id,))
            
            case_result = cursor.fetchone()
            if not case_result:
                return None
            
            # Create CSV content
            output = io.StringIO()
            writer = csv.writer(output)
            
            # Case details
            if export_options.get('case-details', True):
                writer.writerow(['Case Details'])
                writer.writerow(['Field', 'Value'])
                writer.writerow(['Case ID', case_result[0]])
                writer.writerow(['Case Number', case_result[1]])
                writer.writerow(['Title', case_result[2]])
                writer.writerow(['Description', case_result[3]])
                writer.writerow(['Category', case_result[4]])
                writer.writerow(['Priority', case_result[5]])
                writer.writerow(['Status', case_result[6]])
                writer.writerow(['Created', case_result[7]])
                writer.writerow(['Updated', case_result[8]])
                writer.writerow(['Mediator', case_result[9]])
                writer.writerow(['Mediator Email', case_result[10]])
                writer.writerow([])  # Empty row
            
            # Client information
            if export_options.get('client-info', True):
                writer.writerow(['Client Information'])
                writer.writerow(['Name', 'Email', 'Organization', 'Phone', 'Role', 'Joined'])
                
                cursor.execute('''
                    SELECT u.full_name, u.email, u.organization, u.phone, cp.role, cp.joined_at
                    FROM case_participants cp
                    JOIN users u ON cp.user_id = u.user_id
                    WHERE cp.case_id = ? AND cp.is_active = 1
                ''', (case_id,))
                
                participants = cursor.fetchall()
                for participant in participants:
                    writer.writerow(participant)
                writer.writerow([])  # Empty row
            
            # Case logs/timeline
            if export_options.get('case-logs', True):
                writer.writerow(['Case Timeline'])
                writer.writerow(['Event Type', 'Description', 'Performed By', 'Date'])
                
                cursor.execute('''
                    SELECT ct.event_type, ct.event_description, u.full_name, ct.created_at
                    FROM case_timeline ct
                    JOIN users u ON ct.performed_by = u.user_id
                    WHERE ct.case_id = ?
                    ORDER BY ct.created_at
                ''', (case_id,))
                
                timeline = cursor.fetchall()
                for event in timeline:
                    writer.writerow(event)
                writer.writerow([])  # Empty row
            
            conn.close()
            
            return output.getvalue()
            
        except Exception as e:
            print(f"Error exporting case data: {e}")
            return None
    
    def get_available_mediators(self) -> List[Dict]:
        """Get list of available mediators"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT user_id, full_name, email, organization, phone
                FROM users 
                WHERE role = 'mediator' AND is_active = 1
                ORDER BY full_name
            ''')
            
            results = cursor.fetchall()
            conn.close()
            
            mediators = []
            for row in results:
                mediators.append({
                    'user_id': row[0],
                    'full_name': row[1],
                    'email': row[2],
                    'organization': row[3],
                    'phone': row[4]
                })
            
            return mediators
            
        except Exception as e:
            print(f"Error getting mediators: {e}")
            return []
    
    def get_available_clients(self) -> List[Dict]:
        """Get list of available clients"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT user_id, full_name, email, organization, phone
                FROM users 
                WHERE role = 'client' AND is_active = 1
                ORDER BY full_name
            ''')
            
            results = cursor.fetchall()
            conn.close()
            
            clients = []
            for row in results:
                clients.append({
                    'user_id': row[0],
                    'full_name': row[1],
                    'email': row[2],
                    'organization': row[3],
                    'phone': row[4]
                })
            
            return clients
            
        except Exception as e:
            print(f"Error getting clients: {e}")
            return []
