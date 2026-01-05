# Firebase Integration Plan

## Overview
This document outlines the planned Firebase integration for the Diagnosis System, supporting both guest/anonymous usage and professional licensing with custom logins.

## Current State
- **Status**: Public access, no authentication required
- **Data Storage**: LocalStorage/SessionStorage (client-side only)
- **No user tracking or data persistence** across sessions

## Future Architecture

### Authentication Models

#### 1. Guest/Anonymous Usage
- **Firebase Anonymous Authentication**: Allow users to use the system without registration
- **Benefits**: 
  - No barrier to entry
  - Can sync data across devices for same anonymous session
  - Can later convert to full account
- **Limitations**:
  - Data tied to anonymous UID (lost if cleared)
  - Limited features compared to licensed users

#### 2. Professional Licensing
- **Custom Login System**: Email/password or OAuth providers
- **Features**:
  - User account management
  - Professional license validation
  - Enhanced features and data retention
  - Multi-device sync
  - Export capabilities
  - Professional report generation

### Data Structure

#### Firebase Realtime Database / Firestore Structure
```
users/
  {userId}/
    profile/
      email: string
      userType: 'guest' | 'licensed' | 'professional'
      licenseKey: string (optional)
      createdAt: timestamp
      lastActive: timestamp
    assessments/
      {assessmentId}/
        timestamp: timestamp
        categories: array
        answers: object
        scores: object
        probabilities: object
        conclusionVector: object
        treatmentData: object
    preferences/
      debugMode: boolean
      savedCategories: array
```

#### Anonymous User Structure
```
anonymousUsers/
  {anonymousUid}/
    assessments/
      {assessmentId}/
        ... (same structure)
    createdAt: timestamp
    canUpgrade: boolean (for account conversion)
```

### Implementation Notes

#### Phase 1: Preparation (Current)
- Keep current insecure/public access
- Structure code to easily swap storage backends
- Add abstraction layer for data persistence
- Document data models

#### Phase 2: Guest/Anonymous (Future)
- Implement Firebase Anonymous Auth
- Add Firebase Realtime Database or Firestore
- Create data migration from LocalStorage to Firebase
- Implement sync on login/logout
- Keep LocalStorage as fallback

#### Phase 3: Professional Licensing (Future)
- Implement custom authentication UI
- Add license validation system
- Create user management dashboard
- Implement role-based feature access
- Add professional report export
- Implement data retention policies

### Code Organization

#### Recommended File Structure
```
diagnosis-system/
  ├── auth/
  │   ├── firebase-config.js (future)
  │   ├── auth-manager.js (future)
  │   └── license-validator.js (future)
  ├── storage/
  │   ├── storage-adapter.js (abstraction layer)
  │   ├── local-storage.js (current)
  │   └── firebase-storage.js (future)
  ├── diagnosis-engine.js (main logic)
  └── ...
```

#### Storage Adapter Pattern
```javascript
// storage-adapter.js (future implementation)
class StorageAdapter {
  async saveAssessment(userId, assessmentData) { }
  async loadAssessment(userId, assessmentId) { }
  async listAssessments(userId) { }
  async deleteAssessment(userId, assessmentId) { }
  async saveProgress(userId, progressData) { }
  async loadProgress(userId) { }
}

// Current: LocalStorageAdapter
// Future: FirebaseStorageAdapter
```

### Security Considerations

#### Current (Public Access)
- No authentication required
- All data client-side only
- No server validation
- Suitable for educational/demo purposes

#### Future (Firebase)
- Firebase Security Rules for data access control
- License validation server-side
- Rate limiting per user type
- Data encryption in transit (Firebase default)
- GDPR compliance for user data

### Migration Strategy

#### Data Migration
1. On first Firebase login, check LocalStorage for existing data
2. Offer user option to migrate local data to Firebase
3. Merge local and cloud data (handle conflicts)
4. Clear LocalStorage after successful migration

#### Backward Compatibility
- Keep LocalStorage as fallback if Firebase unavailable
- Graceful degradation for offline usage
- Clear user messaging about data location

### Feature Flags

#### Recommended Implementation
```javascript
// feature-flags.js (future)
const FEATURE_FLAGS = {
  FIREBASE_ENABLED: false, // Set to true when ready
  AUTH_REQUIRED: false,
  GUEST_ACCESS: true,
  PROFESSIONAL_LICENSING: false,
  DATA_SYNC: false,
  EXPORT_ENABLED: true, // Currently via LocalStorage
  PROFESSIONAL_REPORTS: false
};
```

### Environment Configuration

#### Recommended Setup
```javascript
// config.js (future)
const CONFIG = {
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  },
  features: FEATURE_FLAGS
};
```

## Implementation Checklist

### Phase 1: Current (Done)
- [x] Public access system
- [x] LocalStorage/SessionStorage implementation
- [x] No authentication barrier

### Phase 2: Guest/Anonymous (Future)
- [ ] Firebase project setup
- [ ] Anonymous authentication implementation
- [ ] Storage adapter abstraction layer
- [ ] Firebase Realtime Database/Firestore integration
- [ ] Data migration from LocalStorage
- [ ] Sync functionality
- [ ] Anonymous to account conversion flow

### Phase 3: Professional Licensing (Future)
- [ ] Custom authentication UI
- [ ] Email/password authentication
- [ ] OAuth providers (Google, etc.)
- [ ] License key validation system
- [ ] User management dashboard
- [ ] Role-based feature access
- [ ] Professional report generation
- [ ] Data retention policies
- [ ] Export capabilities
- [ ] Multi-device sync
- [ ] Admin panel

## Notes
- **Current Priority**: Maintain public access, prepare architecture
- **Timeline**: Implementation deferred until authentication/licensing needed
- **Flexibility**: Code structured to minimize refactoring when Firebase is added

