#!/usr/bin/env python3
"""
Platform Initialization Script
Sets up the database and creates initial test data for local testing
"""

import sqlite3
import hashlib
import uuid
from datetime import datetime
import json

def init_platform():
    """Initialize the platform with test data"""
    print("🏛️ Initializing Unified Mediation Platform...")
    
    # Initialize database
    from core_database_system import CoreDatabaseSystem
    from ai_provider_system import AIProviderManager
    
    db_system = CoreDatabaseSystem("unified_mediation.db")
    ai_manager = AIProviderManager("unified_mediation.db")
    
    print("✅ Database initialized")
    
    # Create test users
    create_test_users()
    
    # Create test cases
    create_test_cases()
    
    print("\n🎉 Platform initialization complete!")
    print("\n📋 Test Accounts Created:")
    print("👨‍⚖️ Mediator: mediator@test.com / password123")
    print("👤 Client 1: client1@test.com / password123")
    print("👤 Client 2: client2@test.com / password123")
    print("👤 Client 3: client3@test.com / password123")
    
    print("\n🚀 Ready to test!")
    print("Access the platform at: http://localhost:8501")

def create_test_users():
    """Create test users for local testing"""
    try:
        conn = sqlite3.connect("unified_mediation.db")
        cursor = conn.cursor()
        
        # Test mediator
        mediator_id = str(uuid.uuid4())
        mediator_password = hashlib.sha256("password123".encode()).hexdigest()
        
        cursor.execute('''
            INSERT OR REPLACE INTO users 
            (user_id, email, password_hash, role, full_name, organization, phone, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (mediator_id, "mediator@test.com", mediator_password, "mediator", 
              "Dr. Sarah Johnson", "Johnson Mediation Services", "+1-555-0123", 1, 
              datetime.now().isoformat()))
        
        # Test clients
        clients = [
            ("client1@test.com", "John Smith", "Smith Enterprises"),
            ("client2@test.com", "Jane Doe", "Doe Consulting"),
            ("client3@test.com", "Mike Wilson", "Wilson & Associates")
        ]
        
        for email, name, org in clients:
            client_id = str(uuid.uuid4())
            client_password = hashlib.sha256("password123".encode()).hexdigest()
            
            cursor.execute('''
                INSERT OR REPLACE INTO users 
                (user_id, email, password_hash, role, full_name, organization, phone, is_active, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (client_id, email, client_password, "client", name, org, "+1-555-0000", 1,
                  datetime.now().isoformat()))
        
        conn.commit()
        conn.close()
        
        print("✅ Test users created")
        
    except Exception as e:
        print(f"❌ Error creating test users: {e}")

def create_test_cases():
    """Create test cases for local testing"""
    try:
        conn = sqlite3.connect("unified_mediation.db")
        cursor = conn.cursor()
        
        # Get mediator ID
        cursor.execute('SELECT user_id FROM users WHERE email = ?', ("mediator@test.com",))
        mediator_result = cursor.fetchone()
        if not mediator_result:
            print("❌ Mediator not found")
            return
        
        mediator_id = mediator_result[0]
        
        # Test cases
        test_cases = [
            {
                "title": "Property Division Dispute",
                "description": "Dispute over division of marital property and assets",
                "case_type": "Family",
                "priority": "high",
                "case_details": {
                    "parties": {
                        "spouse_1": "John Smith",
                        "spouse_2": "Jane Doe"
                    },
                    "property": {
                        "family_home": True,
                        "property_value": 750000,
                        "mortgage_balance": 200000,
                        "vehicles": True,
                        "bank_accounts": True
                    },
                    "legal": {
                        "court_proceedings": False,
                        "lawyer_representation": True
                    }
                }
            },
            {
                "title": "Business Partnership Dispute",
                "description": "Disagreement over business operations and profit sharing",
                "case_type": "Commercial",
                "priority": "medium",
                "case_details": {
                    "parties": {
                        "company_1": "Smith Enterprises",
                        "company_2": "Doe Consulting"
                    },
                    "dispute": {
                        "dispute_type": "Partnership Dispute",
                        "dispute_value": 50000,
                        "business_relationship": "Joint venture partnership"
                    }
                }
            },
            {
                "title": "Employment Contract Dispute",
                "description": "Dispute over employment terms and termination",
                "case_type": "Employment",
                "priority": "medium",
                "case_details": {
                    "parties": {
                        "employer": "Wilson & Associates",
                        "employee": "Mike Wilson"
                    },
                    "employment": {
                        "contract_type": "Executive",
                        "dispute_issue": "Termination terms",
                        "severance_dispute": True
                    }
                }
            }
        ]
        
        # Get client IDs
        cursor.execute('SELECT user_id, email FROM users WHERE role = "client"')
        clients = cursor.fetchall()
        
        for i, case_data in enumerate(test_cases):
            case_id = str(uuid.uuid4())
            case_number = f"TEST-{datetime.now().strftime('%Y%m%d')}-{i+1:03d}"
            
            cursor.execute('''
                INSERT INTO cases 
                (case_id, case_number, title, description, case_type, priority, 
                 assigned_mediator_id, created_by, case_details, status, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (case_id, case_number, case_data["title"], case_data["description"], 
                  case_data["case_type"], case_data["priority"], mediator_id, mediator_id,
                  json.dumps(case_data["case_details"]), "active", 
                  datetime.now().isoformat(), datetime.now().isoformat()))
            
            # Add clients to case
            if i < len(clients):
                client_id, client_email = clients[i]
                
                cursor.execute('''
                    INSERT INTO case_participants 
                    (participant_id, case_id, user_id, role, added_by, joined_at, is_active)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (str(uuid.uuid4()), case_id, client_id, "claimant", mediator_id,
                      datetime.now().isoformat(), 1))
                
                # Add timeline event
                cursor.execute('''
                    INSERT INTO case_timeline 
                    (event_id, case_id, event_type, event_description, performed_by, created_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (str(uuid.uuid4()), case_id, "created", 
                      f"Case created and assigned to {client_email}", mediator_id,
                      datetime.now().isoformat()))
        
        conn.commit()
        conn.close()
        
        print("✅ Test cases created")
        
    except Exception as e:
        print(f"❌ Error creating test cases: {e}")

def show_testing_guide():
    """Show testing guide"""
    print("\n" + "="*60)
    print("🧪 LOCAL TESTING GUIDE")
    print("="*60)
    
    print("\n📋 Available Test Accounts:")
    print("┌─────────────────────┬─────────────────┬──────────────┐")
    print("│ Email               │ Password        │ Role         │")
    print("├─────────────────────┼─────────────────┼──────────────┤")
    print("│ mediator@test.com   │ password123     │ Mediator     │")
    print("│ client1@test.com    │ password123     │ Client       │")
    print("│ client2@test.com    │ password123     │ Client       │")
    print("│ client3@test.com    │ password123     │ Client       │")
    print("└─────────────────────┴─────────────────┴──────────────┘")
    
    print("\n🎯 Testing Scenarios:")
    print("\n1. 👨‍⚖️ MEDIATOR TESTING:")
    print("   • Login as mediator@test.com")
    print("   • View dashboard with test cases")
    print("   • Configure AI provider (Ollama or OpenAI)")
    print("   • Manage case participants")
    print("   • Set information sharing controls")
    print("   • Start mediation sessions")
    
    print("\n2. 👤 CLIENT TESTING:")
    print("   • Login as client1@test.com")
    print("   • View assigned cases")
    print("   • Join mediation sessions")
    print("   • Send messages (with AI mediation if configured)")
    
    print("\n3. 🤖 AI TESTING:")
    print("   • Configure Ollama (if installed)")
    print("   • Configure OpenAI (if API key available)")
    print("   • Test message mediation")
    print("   • Compare different AI providers")
    
    print("\n4. 🔒 PRIVACY TESTING:")
    print("   • Test information sharing controls")
    print("   • Verify client data isolation")
    print("   • Test field-level sharing permissions")
    
    print("\n🚀 Quick Start:")
    print("1. Open browser to: http://localhost:8501")
    print("2. Register new account OR use test accounts above")
    print("3. Explore the platform features")
    print("4. Configure AI provider in AI Settings tab")
    print("5. Test mediation workflows")
    
    print("\n📚 Documentation:")
    print("• README_RENOVATED_SYSTEM.md - Complete system overview")
    print("• OLLAMA_SETUP_GUIDE.md - Local LLM setup guide")
    print("• SYSTEM_TRANSFORMATION_SUMMARY.md - Architecture details")

if __name__ == "__main__":
    init_platform()
    show_testing_guide()














