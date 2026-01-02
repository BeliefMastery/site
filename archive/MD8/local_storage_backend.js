/**
 * Local Storage Backend for Unified Mediation Platform
 * This replaces the API server for offline/static deployment
 */

class LocalStorageBackend {
    constructor() {
        this.storagePrefix = 'mediation_platform_';
        this.initializeData();
    }

    // Initialize with default data if none exists
    initializeData() {
        if (!this.get('users')) {
            this.set('users', [
                {
                    user_id: 'mediator-001',
                    email: 'mediator@test.com',
                    password_hash: this.hashPassword('password123'),
                    role: 'mediator',
                    full_name: 'Dr. Sarah Johnson',
                    organization: 'Mediator Corp',
                    phone: '+1234567890',
                    is_active: 1,
                    created_at: new Date().toISOString(),
                    preferred_mediators: []
                },
                {
                    user_id: 'client-001',
                    email: 'client1@test.com',
                    password_hash: this.hashPassword('password123'),
                    role: 'client',
                    full_name: 'John Doe',
                    organization: 'Client Inc',
                    phone: '+1987654321',
                    is_active: 1,
                    created_at: new Date().toISOString(),
                    preferred_mediators: ['mediator-001']
                },
                {
                    user_id: 'client-002',
                    email: 'client2@test.com',
                    password_hash: this.hashPassword('password123'),
                    role: 'client',
                    full_name: 'Jane Smith',
                    organization: 'Client Co',
                    phone: '+1122334455',
                    is_active: 1,
                    created_at: new Date().toISOString(),
                    preferred_mediators: ['mediator-001']
                }
            ]);
        }

        if (!this.get('cases')) {
            this.set('cases', []);
        }

        if (!this.get('case_participants')) {
            this.set('case_participants', []);
        }

        if (!this.get('case_timeline')) {
            this.set('case_timeline', []);
        }

        if (!this.get('information_requests')) {
            this.set('information_requests', []);
        }

        if (!this.get('notifications')) {
            this.set('notifications', []);
        }
    }

    // Storage helper methods
    set(key, value) {
        localStorage.setItem(this.storagePrefix + key, JSON.stringify(value));
    }

    get(key) {
        const item = localStorage.getItem(this.storagePrefix + key);
        return item ? JSON.parse(item) : null;
    }

    remove(key) {
        localStorage.removeItem(this.storagePrefix + key);
    }

    // Utility methods
    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    hashPassword(password) {
        // Simple hash for demo - in production use proper hashing
        return btoa(password + 'salt');
    }

    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }

    // Authentication methods
    authenticateUser(email, password) {
        const users = this.get('users') || [];
        const user = users.find(u => u.email === email && u.is_active);
        
        if (user && this.verifyPassword(password, user.password_hash)) {
            const { password_hash, ...userWithoutPassword } = user;
            return {
                success: true,
                user: userWithoutPassword
            };
        }
        
        return {
            success: false,
            error: 'Invalid credentials'
        };
    }

    addUser(userData) {
        const users = this.get('users') || [];
        
        // Check if user already exists
        if (users.find(u => u.email === userData.email)) {
            return {
                success: false,
                error: 'User with this email already exists'
            };
        }

        const newUser = {
            user_id: this.generateId(),
            email: userData.email,
            password_hash: this.hashPassword(userData.password),
            role: userData.role,
            full_name: userData.full_name,
            organization: userData.organization || '',
            phone: userData.phone || '',
            is_active: 1,
            created_at: new Date().toISOString(),
            preferred_mediators: userData.preferred_mediators || []
        };

        users.push(newUser);
        this.set('users', users);

        const { password_hash, ...userWithoutPassword } = newUser;
        return {
            success: true,
            user: userWithoutPassword
        };
    }

    getAllMediators() {
        const users = this.get('users') || [];
        return users
            .filter(u => u.role === 'mediator' && u.is_active)
            .map(u => ({
                id: u.user_id,
                name: u.full_name,
                organization: u.organization
            }));
    }

    getUserById(userId) {
        const users = this.get('users') || [];
        const user = users.find(u => u.user_id === userId);
        if (user) {
            const { password_hash, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    }

    // Case management methods
    createCase(caseData) {
        const cases = this.get('cases') || [];
        const caseId = this.generateId();
        const caseNumber = `CASE-${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}-${caseId.slice(-4).toUpperCase()}`;
        
        const newCase = {
            case_id: caseId,
            case_number: caseNumber,
            title: caseData.title,
            description: caseData.description || '',
            category: caseData.category,
            priority: caseData.priority || 'medium',
            status: 'active',
            assigned_mediator_id: caseData.assigned_mediator_id,
            created_by: caseData.created_by,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            case_details: caseData.case_details || {}
        };

        cases.push(newCase);
        this.set('cases', cases);

        // Add to timeline
        this.addTimelineEvent(caseId, 'case_created', `Case '${caseData.title}' created`, caseData.created_by);

        return {
            success: true,
            case_id: caseId,
            case_number: caseNumber
        };
    }

    getCasesForUser(userId, role) {
        const cases = this.get('cases') || [];
        const participants = this.get('case_participants') || [];
        const users = this.get('users') || [];

        if (role === 'mediator') {
            return cases
                .filter(c => c.assigned_mediator_id === userId && c.status !== 'retired')
                .map(caseItem => {
                    const mediator = users.find(u => u.user_id === caseItem.assigned_mediator_id);
                    const participantCount = participants.filter(p => p.case_id === caseItem.case_id).length;
                    
                    return {
                        case_id: caseItem.case_id,
                        case_number: caseItem.case_number,
                        title: caseItem.title,
                        description: caseItem.description,
                        category: caseItem.category,
                        priority: caseItem.priority,
                        status: caseItem.status,
                        created_at: caseItem.created_at,
                        mediator_name: mediator ? mediator.full_name : 'Unknown',
                        num_participants: participantCount
                    };
                });
        } else if (role === 'client') {
            const userCaseIds = participants
                .filter(p => p.user_id === userId && p.is_active)
                .map(p => p.case_id);

            return cases
                .filter(c => userCaseIds.includes(c.case_id) && c.status !== 'retired')
                .map(caseItem => {
                    const mediator = users.find(u => u.user_id === caseItem.assigned_mediator_id);
                    
                    return {
                        case_id: caseItem.case_id,
                        case_number: caseItem.case_number,
                        title: caseItem.title,
                        description: caseItem.description,
                        category: caseItem.category,
                        priority: caseItem.priority,
                        status: caseItem.status,
                        created_at: caseItem.created_at,
                        mediator_name: mediator ? mediator.full_name : 'Unknown'
                    };
                });
        }

        return [];
    }

    getCaseDetails(caseId) {
        const cases = this.get('cases') || [];
        const participants = this.get('case_participants') || [];
        const users = this.get('users') || [];
        const timeline = this.get('case_timeline') || [];

        const caseItem = cases.find(c => c.case_id === caseId);
        if (!caseItem) return null;

        const mediator = users.find(u => u.user_id === caseItem.assigned_mediator_id);
        
        const caseData = {
            case_id: caseItem.case_id,
            case_number: caseItem.case_number,
            title: caseItem.title,
            description: caseItem.description,
            category: caseItem.category,
            priority: caseItem.priority,
            status: caseItem.status,
            created_at: caseItem.created_at,
            case_details: caseItem.case_details || {},
            mediator_name: mediator ? mediator.full_name : 'Unknown',
            mediator_email: mediator ? mediator.email : '',
            participants: [],
            timeline: []
        };

        // Get participants
        const caseParticipants = participants.filter(p => p.case_id === caseId);
        caseData.participants = caseParticipants.map(p => {
            const user = users.find(u => u.user_id === p.user_id);
            return {
                user_id: p.user_id,
                full_name: user ? user.full_name : 'Unknown',
                email: user ? user.email : '',
                role: p.role,
                client_case_data: p.client_case_data || {},
                visibility_settings: p.visibility_settings || {}
            };
        });

        // Get timeline
        caseData.timeline = timeline
            .filter(t => t.case_id === caseId)
            .map(t => ({
                event_type: t.event_type,
                event_description: t.event_description,
                performed_by: t.performed_by,
                created_at: t.created_at
            }));

        return caseData;
    }

    assignClientToCase(caseId, clientUserId, assignedByUserId, role = 'client') {
        const participants = this.get('case_participants') || [];
        
        // Check if already assigned
        if (participants.find(p => p.case_id === caseId && p.user_id === clientUserId)) {
            return {
                success: false,
                error: 'Client already assigned to this case'
            };
        }

        const newParticipant = {
            participant_id: this.generateId(),
            case_id: caseId,
            user_id: clientUserId,
            role: role,
            added_by: assignedByUserId,
            joined_at: new Date().toISOString(),
            is_active: 1,
            client_case_data: {},
            visibility_settings: {}
        };

        participants.push(newParticipant);
        this.set('case_participants', participants);

        // Add to timeline
        const client = this.getUserById(clientUserId);
        const caseItem = this.getCaseDetails(caseId);
        this.addTimelineEvent(caseId, 'client_assigned', 
            `Client '${client.full_name}' assigned to case '${caseItem.title}' as '${role}'`, 
            assignedByUserId);

        return {
            success: true,
            participant_id: newParticipant.participant_id
        };
    }

    updateClientCaseData(caseId, clientUserId, clientCaseData, visibilitySettings) {
        const participants = this.get('case_participants') || [];
        const participantIndex = participants.findIndex(p => p.case_id === caseId && p.user_id === clientUserId);
        
        if (participantIndex === -1) {
            return {
                success: false,
                error: 'Client not assigned to this case'
            };
        }

        participants[participantIndex].client_case_data = clientCaseData;
        participants[participantIndex].visibility_settings = visibilitySettings;
        this.set('case_participants', participants);

        // Add to timeline
        const client = this.getUserById(clientUserId);
        const caseItem = this.getCaseDetails(caseId);
        this.addTimelineEvent(caseId, 'info_submitted', 
            `Client '${client.full_name}' submitted/updated case information for '${caseItem.title}'`, 
            clientUserId);

        return { success: true };
    }

    archiveCase(caseId, archivedBy, reason) {
        const cases = this.get('cases') || [];
        const caseIndex = cases.findIndex(c => c.case_id === caseId);
        
        if (caseIndex === -1) {
            return {
                success: false,
                error: 'Case not found'
            };
        }

        cases[caseIndex].status = 'retired';
        cases[caseIndex].updated_at = new Date().toISOString();
        this.set('cases', cases);

        // Add to timeline
        const caseItem = this.getCaseDetails(caseId);
        this.addTimelineEvent(caseId, 'case_archived', 
            `Case '${caseItem.title}' archived by ${archivedBy}. Reason: ${reason}`, 
            archivedBy);

        return { success: true };
    }

    deleteCase(caseId, deletedBy, reason) {
        const cases = this.get('cases') || [];
        const participants = this.get('case_participants') || [];
        const timeline = this.get('case_timeline') || [];

        const caseIndex = cases.findIndex(c => c.case_id === caseId);
        if (caseIndex === -1) {
            return {
                success: false,
                error: 'Case not found'
            };
        }

        const caseItem = cases[caseIndex];

        // Remove case
        cases.splice(caseIndex, 1);
        this.set('cases', cases);

        // Remove participants
        const filteredParticipants = participants.filter(p => p.case_id !== caseId);
        this.set('case_participants', filteredParticipants);

        // Remove timeline events
        const filteredTimeline = timeline.filter(t => t.case_id !== caseId);
        this.set('case_timeline', filteredTimeline);

        console.log(`Case '${caseItem.title}' (ID: ${caseId}) permanently deleted by ${deletedBy}. Reason: ${reason}`);

        return { success: true };
    }

    addTimelineEvent(caseId, eventType, description, performedBy) {
        const timeline = this.get('case_timeline') || [];
        timeline.push({
            event_id: this.generateId(),
            case_id: caseId,
            event_type: eventType,
            event_description: description,
            performed_by: performedBy,
            created_at: new Date().toISOString()
        });
        this.set('case_timeline', timeline);
    }

    exportCaseDataToCSV(caseId, exportOptions) {
        const caseData = this.getCaseDetails(caseId);
        if (!caseData) {
            return {
                success: false,
                error: 'Case not found'
            };
        }

        let csvContent = '';

        // Case Details
        if (exportOptions['case-details']) {
            csvContent += '--- Case Details ---\n';
            csvContent += 'Field,Value\n';
            csvContent += `Case ID,${caseData.case_id}\n`;
            csvContent += `Case Number,${caseData.case_number}\n`;
            csvContent += `Title,${caseData.title}\n`;
            csvContent += `Description,${caseData.description}\n`;
            csvContent += `Category,${caseData.category}\n`;
            csvContent += `Priority,${caseData.priority}\n`;
            csvContent += `Status,${caseData.status}\n`;
            csvContent += `Mediator,${caseData.mediator_name}\n`;
            csvContent += `Created At,${caseData.created_at}\n`;
            
            Object.entries(caseData.case_details).forEach(([key, value]) => {
                csvContent += `Case Specific - ${key},${value}\n`;
            });
            csvContent += '\n';
        }

        // Client Information
        if (exportOptions['client-info'] && caseData.participants.length > 0) {
            csvContent += '--- Client Information ---\n';
            csvContent += 'Client Name,Client Email,Role in Case,Client Specific Data,Visibility Settings\n';
            caseData.participants.forEach(participant => {
                csvContent += `${participant.full_name},${participant.email},${participant.role},"${JSON.stringify(participant.client_case_data)}","${JSON.stringify(participant.visibility_settings)}"\n`;
            });
            csvContent += '\n';
        }

        // Case Logs
        if (exportOptions['case-logs'] && caseData.timeline.length > 0) {
            csvContent += '--- Case Logs ---\n';
            csvContent += 'Event Type,Description,Performed By,Timestamp\n';
            caseData.timeline.forEach(event => {
                csvContent += `${event.event_type},${event.event_description},${event.performed_by},${event.created_at}\n`;
            });
            csvContent += '\n';
        }

        // Documents (placeholder)
        if (exportOptions['documents']) {
            csvContent += '--- Documents (Placeholder) ---\n';
            csvContent += 'Document Name,Type,Link\n';
            csvContent += 'No actual documents stored in local storage.,,\n';
            csvContent += '\n';
        }

        return {
            success: true,
            csv_data: csvContent
        };
    }

    // Clear all data (for testing)
    clearAllData() {
        const keys = Object.keys(localStorage).filter(key => key.startsWith(this.storagePrefix));
        keys.forEach(key => localStorage.removeItem(key));
        this.initializeData();
        console.log('All local storage data cleared and reinitialized');
    }

    // Export all data (for backup)
    exportAllData() {
        const data = {
            users: this.get('users'),
            cases: this.get('cases'),
            case_participants: this.get('case_participants'),
            case_timeline: this.get('case_timeline'),
            export_timestamp: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    }

    // Import data (for restore)
    importAllData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.users) this.set('users', data.users);
            if (data.cases) this.set('cases', data.cases);
            if (data.case_participants) this.set('case_participants', data.case_participants);
            if (data.case_timeline) this.set('case_timeline', data.case_timeline);
            if (data.information_requests) this.set('information_requests', data.information_requests);
            if (data.notifications) this.set('notifications', data.notifications);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Information Request Methods
    createInformationRequest(mediatorId, clientId, caseId, title, description, requestedFields) {
        const requests = this.get('information_requests') || [];
        const requestId = this.generateId();
        
        const newRequest = {
            request_id: requestId,
            mediator_id: mediatorId,
            client_id: clientId,
            case_id: caseId || null,
            request_title: title,
            request_description: description,
            requested_fields: requestedFields || [],
            status: 'pending',
            created_at: new Date().toISOString(),
            completed_at: null,
            client_response: null
        };

        requests.push(newRequest);
        this.set('information_requests', requests);

        // Create notification for client
        this.createNotification(clientId, 'info_request', 
            'New Information Request', 
            `Your mediator has requested additional information: ${title}`,
            requestId);

        return { success: true, request_id: requestId };
    }

    getInformationRequestsForUser(userId, userRole) {
        const requests = this.get('information_requests') || [];
        const users = this.get('users') || [];
        
        if (userRole === 'mediator') {
            return requests
                .filter(r => r.mediator_id === userId)
                .map(request => {
                    const client = users.find(u => u.user_id === request.client_id);
                    return {
                        ...request,
                        client_name: client ? client.full_name : 'Unknown',
                        client_email: client ? client.email : ''
                    };
                });
        } else if (userRole === 'client') {
            return requests
                .filter(r => r.client_id === userId)
                .map(request => {
                    const mediator = users.find(u => u.user_id === request.mediator_id);
                    return {
                        ...request,
                        mediator_name: mediator ? mediator.full_name : 'Unknown',
                        mediator_email: mediator ? mediator.email : ''
                    };
                });
        }
        
        return [];
    }

    updateInformationRequestResponse(requestId, clientId, response) {
        const requests = this.get('information_requests') || [];
        const requestIndex = requests.findIndex(r => r.request_id === requestId);
        
        if (requestIndex === -1) {
            return { success: false, error: 'Request not found' };
        }

        if (requests[requestIndex].client_id !== clientId) {
            return { success: false, error: 'Unauthorized' };
        }

        requests[requestIndex].client_response = response;
        requests[requestIndex].status = 'completed';
        requests[requestIndex].completed_at = new Date().toISOString();
        
        this.set('information_requests', requests);

        // Create notification for mediator
        this.createNotification(requests[requestIndex].mediator_id, 'info_request', 
            'Information Request Completed', 
            `Client has completed your information request: ${requests[requestIndex].request_title}`,
            requestId);

        return { success: true };
    }

    // Notification Methods
    createNotification(userId, type, title, message, relatedId = null) {
        const notifications = this.get('notifications') || [];
        const notificationId = this.generateId();
        
        const newNotification = {
            notification_id: notificationId,
            user_id: userId,
            type: type,
            title: title,
            message: message,
            is_read: 0,
            related_id: relatedId,
            created_at: new Date().toISOString()
        };

        notifications.push(newNotification);
        this.set('notifications', notifications);

        return { success: true, notification_id: notificationId };
    }

    getNotificationsForUser(userId) {
        const notifications = this.get('notifications') || [];
        return notifications
            .filter(n => n.user_id === userId)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    markNotificationAsRead(notificationId, userId) {
        const notifications = this.get('notifications') || [];
        const notificationIndex = notifications.findIndex(n => n.notification_id === notificationId);
        
        if (notificationIndex === -1) {
            return { success: false, error: 'Notification not found' };
        }

        if (notifications[notificationIndex].user_id !== userId) {
            return { success: false, error: 'Unauthorized' };
        }

        notifications[notificationIndex].is_read = 1;
        this.set('notifications', notifications);

        return { success: true };
    }

    getUnreadNotificationCount(userId) {
        const notifications = this.get('notifications') || [];
        return notifications.filter(n => n.user_id === userId && !n.is_read).length;
    }

    // Client-Mediator Association Methods
    getClientsForMediator(mediatorId) {
        const users = this.get('users') || [];
        return users
            .filter(u => u.role === 'client' && 
                        u.preferred_mediators && 
                        u.preferred_mediators.includes(mediatorId))
            .map(client => {
                const { password_hash, ...clientWithoutPassword } = client;
                return clientWithoutPassword;
            });
    }

    getMediatorsForClient(clientId) {
        const users = this.get('users') || [];
        const client = users.find(u => u.user_id === clientId);
        
        if (!client || !client.preferred_mediators) {
            return [];
        }

        return users
            .filter(u => u.role === 'mediator' && 
                        client.preferred_mediators.includes(u.user_id))
            .map(mediator => {
                const { password_hash, ...mediatorWithoutPassword } = mediator;
                return mediatorWithoutPassword;
            });
    }

    updateClientMediatorAssociation(clientId, mediatorIds) {
        const users = this.get('users') || [];
        const clientIndex = users.findIndex(u => u.user_id === clientId);
        
        if (clientIndex === -1) {
            return { success: false, error: 'Client not found' };
        }

        users[clientIndex].preferred_mediators = mediatorIds;
        this.set('users', users);

        return { success: true };
    }
}

// Create global instance
window.localStorageBackend = new LocalStorageBackend();

// Make it available globally
window.LSBackend = window.localStorageBackend;
