"""
API Server for Unified Mediation Platform
Provides REST API endpoints for the web interface
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import json
import io
import os
from core_database_system import CoreDatabaseSystem

app = Flask(__name__)
CORS(app)  # Enable CORS for web interface

# Initialize database
db = CoreDatabaseSystem("unified_mediation.db")

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        user = db.authenticate_user(email, password)
        if user:
            return jsonify({
                'success': True,
                'user': user
            })
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/register', methods=['POST'])
def register():
    """User registration endpoint"""
    try:
        data = request.get_json()
        
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('full_name')
        role = data.get('role')
        organization = data.get('organization')
        phone = data.get('phone')
        preferred_mediators = data.get('preferred_mediators', [])
        
        if not all([email, password, full_name, role]):
            return jsonify({'error': 'Required fields missing'}), 400
        
        if role not in ['mediator', 'client']:
            return jsonify({'error': 'Invalid role'}), 400
        
        success = db.create_user(email, password, full_name, role, organization, phone, preferred_mediators)
        
        if success:
            return jsonify({'success': True, 'message': 'User created successfully'})
        else:
            return jsonify({'error': 'Failed to create user'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/cases', methods=['GET'])
def get_cases():
    """Get cases for current user"""
    try:
        user_id = request.args.get('user_id')
        role = request.args.get('role')
        
        if not user_id or not role:
            return jsonify({'error': 'User ID and role required'}), 400
        
        cases = db.get_user_cases(user_id, role)
        return jsonify({'success': True, 'cases': cases})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/cases', methods=['POST'])
def create_case():
    """Create a new case"""
    try:
        data = request.get_json()
        
        title = data.get('title')
        description = data.get('description')
        category = data.get('category')
        priority = data.get('priority')
        assigned_mediator_id = data.get('assigned_mediator_id')
        created_by = data.get('created_by')
        case_details = data.get('case_details', {})
        
        if not all([title, description, category, priority, assigned_mediator_id, created_by]):
            return jsonify({'error': 'Required fields missing'}), 400
        
        case_id = db.create_case(title, description, category, priority, assigned_mediator_id, created_by, case_details)
        
        if case_id:
            return jsonify({'success': True, 'case_id': case_id})
        else:
            return jsonify({'error': 'Failed to create case'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/cases/<case_id>/assign-client', methods=['POST'])
def assign_client(case_id):
    """Assign client to case"""
    try:
        data = request.get_json()
        
        user_id = data.get('user_id')
        role = data.get('role', 'primary_party')
        added_by = data.get('added_by')
        
        if not all([user_id, added_by]):
            return jsonify({'error': 'Required fields missing'}), 400
        
        success = db.assign_client_to_case(case_id, user_id, role, added_by)
        
        if success:
            return jsonify({'success': True, 'message': 'Client assigned successfully'})
        else:
            return jsonify({'error': 'Failed to assign client'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/cases/<case_id>/archive', methods=['POST'])
def archive_case(case_id):
    """Archive a case"""
    try:
        data = request.get_json()
        
        archived_by = data.get('archived_by')
        reason = data.get('reason', '')
        
        if not archived_by:
            return jsonify({'error': 'Archived by field required'}), 400
        
        success = db.archive_case(case_id, archived_by, reason)
        
        if success:
            return jsonify({'success': True, 'message': 'Case archived successfully'})
        else:
            return jsonify({'error': 'Failed to archive case'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/cases/<case_id>/delete', methods=['DELETE'])
def delete_case(case_id):
    """Delete a case permanently"""
    try:
        data = request.get_json()
        
        deleted_by = data.get('deleted_by')
        reason = data.get('reason', '')
        
        if not deleted_by:
            return jsonify({'error': 'Deleted by field required'}), 400
        
        success = db.delete_case(case_id, deleted_by, reason)
        
        if success:
            return jsonify({'success': True, 'message': 'Case deleted successfully'})
        else:
            return jsonify({'error': 'Failed to delete case'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/cases/<case_id>/export', methods=['POST'])
def export_case(case_id):
    """Export case data to CSV"""
    try:
        data = request.get_json()
        export_options = data.get('export_options', {
            'case-details': True,
            'client-info': True,
            'case-logs': True,
            'documents': False
        })
        
        csv_data = db.export_case_data_csv(case_id, export_options)
        
        if csv_data:
            # Create file-like object
            output = io.BytesIO()
            output.write(csv_data.encode('utf-8'))
            output.seek(0)
            
            return send_file(
                output,
                as_attachment=True,
                download_name=f'case-{case_id}-export.csv',
                mimetype='text/csv'
            )
        else:
            return jsonify({'error': 'Failed to export case data'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/mediators', methods=['GET'])
def get_mediators():
    """Get list of available mediators"""
    try:
        mediators = db.get_available_mediators()
        return jsonify({'success': True, 'mediators': mediators})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/clients', methods=['GET'])
def get_clients():
    """Get list of available clients"""
    try:
        clients = db.get_available_clients()
        return jsonify({'success': True, 'clients': clients})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/cases/<case_id>/participants', methods=['GET'])
def get_case_participants(case_id):
    """Get case participants"""
    try:
        participants = db.get_case_participants(case_id)
        return jsonify({'success': True, 'participants': participants})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'API server is running'})

if __name__ == '__main__':
    print("🚀 Starting Unified Mediation Platform API Server...")
    print("📡 API will be available at: http://localhost:5000")
    print("🌐 Web interface should connect to this API")
    
    # Run the server
    app.run(debug=True, host='0.0.0.0', port=5000)
