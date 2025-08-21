# Setup Instructions

## Prerequisites

1. **Firebase Project**
   - Create a new project at https://console.firebase.google.com/
   - Enable Authentication (Email/Password)
   - Enable Realtime Database
   - Enable Storage
   - Get your configuration from Project Settings → General

2. **ImgBB API Key**
   - Visit https://imgbb.com/
   - Create an account
   - Get your API key from the API section

## Installation

1. **Configure APIs**
   - Open setup.html in your browser
   - Fill in your Firebase configuration
   - Add your ImgBB API key
   - Click "Generate Configured Files"

2. **Deploy Files**
   - Extract the downloaded zip file
   - Upload all files to your web server
   - Ensure HTTPS is enabled

3. **Admin Setup**
   - Access the admin panel
   - Create an admin account through Firebase Authentication
   - Set up games and initial configuration

4. **Launch Platform**
   - Share the user app URL with your players
   - Monitor through the admin panel

## Firebase Security Rules

Set up proper security rules in your Firebase Console:

### Realtime Database Rules
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('isAdmin').val() === true",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('isAdmin').val() === true"
      }
    },
    "tournaments": {
      ".read": "auth != null",
      ".write": "root.child('users').child(auth.uid).child('isAdmin').val() === true"
    },
    "challenges": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "transactions": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('isAdmin').val() === true",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('isAdmin').val() === true"
      }
    }
  }
}
```

### Storage Rules
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **Firebase Connection Errors**
   - Verify your Firebase configuration
   - Check if all required services are enabled
   - Ensure your domain is authorized in Firebase Console

2. **Image Upload Failures**
   - Verify your ImgBB API key
   - Check file size limits
   - Ensure proper file formats

3. **Admin Access Issues**
   - Verify admin status in Firebase Authentication
   - Check custom claims configuration
   - Ensure proper database permissions

### Support

For additional support:
- Check the Firebase documentation
- Review browser console for errors
- Verify all API keys are correct
- Ensure HTTPS is enabled on your server

---

**Generated**: 2025-08-21T09:21:50.867Z