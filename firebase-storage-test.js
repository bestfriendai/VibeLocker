// Firebase Storage functionality test script
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage');

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
const storage = getStorage(app);

async function testFirebaseStorage() {
  console.log('🔥 Testing Firebase Storage...\n');
  
  try {
    // Test 1: Authentication (required for storage operations)
    console.log('1️⃣ Testing Authentication...');
    const testEmail = `test-storage-${Date.now()}@example.com`;
    const testPassword = 'testPassword123!';
    
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('✅ User authenticated:', userCredential.user.uid);
    
    // Test 2: Upload a test file
    console.log('\n2️⃣ Testing File Upload...');
    const testData = Buffer.from('Hello Firebase Storage! This is a test file.', 'utf8');
    const testFileName = `test-${Date.now()}.txt`;
    const storageRef = ref(storage, `reviews/${testFileName}`);
    
    const uploadResult = await uploadBytes(storageRef, testData);
    console.log('✅ File uploaded successfully:', uploadResult.metadata.name);
    
    // Test 3: Get download URL
    console.log('\n3️⃣ Testing Download URL...');
    const downloadURL = await getDownloadURL(storageRef);
    console.log('✅ Download URL generated:', downloadURL.substring(0, 50) + '...');
    
    // Test 4: Test user-specific storage
    console.log('\n4️⃣ Testing User-Specific Storage...');
    const userStorageRef = ref(storage, `users/${userCredential.user.uid}/profile.txt`);
    const userTestData = Buffer.from('User profile data', 'utf8');
    
    const userUploadResult = await uploadBytes(userStorageRef, userTestData);
    console.log('✅ User file uploaded:', userUploadResult.metadata.name);
    
    // Test 5: Clean up - delete test files
    console.log('\n5️⃣ Cleaning up test files...');
    await deleteObject(storageRef);
    await deleteObject(userStorageRef);
    console.log('✅ Test files deleted successfully');
    
    console.log('\n🎉 All Firebase Storage tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testFirebaseStorage().then(() => {
  console.log('\n✨ Firebase Storage testing completed!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Storage test failed:', error);
  process.exit(1);
});
