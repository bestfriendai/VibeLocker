// Firebase functionality test script
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, collection, addDoc, getDocs, getDoc, connectFirestoreEmulator, doc, setDoc } = require('firebase/firestore');

// Load environment variables
require('dotenv').config();

// Firebase configuration from environment
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Connect to emulator (comment out for production testing)
// connectFirestoreEmulator(db, 'localhost', 8080);

async function testFirebaseFeatures() {
  console.log('🔥 Testing Firebase Features...\n');

  try {
    // Test 1: Authentication
    console.log('1️⃣ Testing Authentication...');
    const testEmail = `test${Date.now()}@example.com`; // Use unique email
    const testPassword = 'password123';

    let userCredential;
    try {
      // Try to create user
      userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      console.log('✅ User created successfully:', userCredential.user.uid);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        // If user exists, sign in instead
        userCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
        console.log('✅ User signed in successfully:', userCredential.user.uid);
      } else {
        throw error;
      }
    }
    
    // Test 2: Firestore - Create user profile
    console.log('\n2️⃣ Testing Firestore - User Profile...');
    const userProfile = {
      id: userCredential.user.uid,
      email: testEmail,
      location: {
        city: "Washington",
        state: "DC"
      },
      genderPreference: "all",
      createdAt: new Date()
    };

    // Use setDoc with the user's UID as document ID (required by security rules)
    await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
    console.log('✅ User profile created with ID:', userCredential.user.uid);
    
    // Test 3: Firestore - Create review
    console.log('\n3️⃣ Testing Firestore - Review Creation...');
    const review = {
      authorId: userCredential.user.uid,
      firstName: "John",
      reviewText: "Great experience at the local coffee shop!",
      sentiment: "positive",
      location: {
        city: "Washington",
        state: "DC"
      },
      createdAt: new Date(),
      likeCount: 0,
      status: "published"
    };
    
    const reviewDocRef = await addDoc(collection(db, 'reviews'), review);
    console.log('✅ Review created:', reviewDocRef.id);
    
    // Test 4: Firestore - Create chat room
    console.log('\n4️⃣ Testing Firestore - Chat Room...');
    const chatRoom = {
      name: "Washington DC Local",
      description: "Connect with singles in the Washington DC area",
      type: "local",
      category: "all",
      memberCount: 1,
      onlineCount: 1,
      location: { city: "Washington", state: "DC" },
      createdAt: new Date(),
      isActive: true
    };
    
    const chatRoomDocRef = await addDoc(collection(db, 'chatRooms'), chatRoom);
    console.log('✅ Chat room created:', chatRoomDocRef.id);
    
    // Test 5: Firestore - Create message
    console.log('\n5️⃣ Testing Firestore - Chat Message...');
    const message = {
      chatRoomId: chatRoomDocRef.id,
      senderId: userCredential.user.uid,
      senderName: "John",
      content: "Hello everyone!",
      messageType: "text",
      timestamp: new Date(),
      isRead: false
    };
    
    const messageDocRef = await addDoc(collection(db, `chatRooms/${chatRoomDocRef.id}/messages`), message);
    console.log('✅ Message created:', messageDocRef.id);
    
    // Test 6: Read data (only publicly readable collections)
    console.log('\n6️⃣ Testing Data Retrieval...');

    const reviewsSnapshot = await getDocs(collection(db, 'reviews'));
    console.log('✅ Reviews count:', reviewsSnapshot.size);

    const chatRoomsSnapshot = await getDocs(collection(db, 'chatRooms'));
    console.log('✅ Chat rooms count:', chatRoomsSnapshot.size);

    // Test reading the user's own profile (should work)
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    const userDoc = await getDoc(userDocRef);
    console.log('✅ User profile readable:', userDoc.exists());
    
    console.log('\n🎉 All Firebase features tested successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testFirebaseFeatures().then(() => {
  console.log('\n✨ Firebase testing completed!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Testing failed:', error);
  process.exit(1);
});
