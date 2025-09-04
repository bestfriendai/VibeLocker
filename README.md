# VibeLocker 🔐

A React Native app built with Expo for sharing authentic experiences and connecting with your community through reviews and real-time chat.

## 🚀 Features

- **User Authentication** - Secure sign up/sign in with Firebase Auth
- **Review System** - Post and browse authentic reviews with ratings
- **Real-time Chat** - Connect with others through live chat rooms
- **Media Upload** - Share photos and media with Firebase Storage
- **Location-based** - Find reviews and connections near you
- **Secure & Private** - Comprehensive security rules and data protection

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Firebase (Auth, Firestore, Storage)
- **State Management**: Zustand with AsyncStorage persistence
- **Navigation**: React Navigation
- **UI Components**: Custom animated components
- **TypeScript**: Full type safety

## 📱 Firebase Services

### Authentication
- Email/password authentication
- Persistent login sessions
- Password reset functionality

### Firestore Database
- User profiles and preferences
- Review system with ratings and comments
- Real-time chat rooms and messages
- Optimized with 16+ indexes for performance

### Firebase Storage
- Profile image uploads
- Review media (photos/videos)
- Chat media sharing
- Secure access controls

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/VibeLocker.git
   cd VibeLocker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Firebase Configuration
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Firebase Setup**
   ```bash
   # Install Firebase CLI if not already installed
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Deploy Firestore rules and indexes
   firebase deploy --only firestore
   
   # Deploy Storage rules
   firebase deploy --only storage
   ```

5. **Start the development server**
   ```bash
   npx expo start
   ```

## 🧪 Testing

The project includes comprehensive test scripts to validate Firebase functionality:

```bash
# Test Firebase configuration and services
node test-app-features.js

# Test Firebase authentication and database operations
node firebase-test.js

# Test Firebase Storage functionality
node firebase-storage-test.js
```

## 📁 Project Structure

```
VibeLocker/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # App screens
│   ├── services/           # Firebase services
│   ├── config/             # Firebase configuration
│   ├── state/              # Zustand stores
│   └── types/              # TypeScript type definitions
├── assets/                 # Images and static assets
├── firebase.json           # Firebase configuration
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore indexes
├── storage.rules           # Storage security rules
└── app.json               # Expo configuration
```

## 🔒 Security

- **Firestore Rules**: Comprehensive security rules for data access
- **Storage Rules**: Secure file upload and access controls
- **Authentication**: Required for all write operations
- **Data Validation**: Input validation and sanitization

## 🚀 Deployment

### Expo Build
```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android
```

### Firebase Deployment
```bash
# Deploy all Firebase services
firebase deploy

# Deploy specific services
firebase deploy --only firestore
firebase deploy --only storage
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for backend services
- Expo for React Native development platform
- React Navigation for navigation
- Zustand for state management

---

**VibeLocker** - Where authentic experiences meet real connections 🔐✨
