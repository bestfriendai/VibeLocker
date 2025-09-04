import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AnimatedButton from "./AnimatedButton";
import AnimatedInput from "./AnimatedInput";
import LoadingSpinner from "./LoadingSpinner";
import { firebaseAuth, firebaseUsers, firebaseReviews } from "../services/firebase";
import { auth, db } from "../config/firebase";
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import useAuthStore from "../state/authStore";
import useReviewsStore from "../state/reviewsStore";
import type { GreenFlag, RedFlag } from "../types";

export default function FirebaseExample() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [displayName, setDisplayName] = useState("Test User");
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  
  const { user, isAuthenticated } = useAuthStore();
  const { reviews } = useReviewsStore();

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testFirebaseAuth = async () => {
    setIsLoading(true);
    try {
      // Use unique email to avoid conflicts
      const testEmail = `test_${Date.now()}@example.com`;

      // Test sign up
      addTestResult("Testing Firebase Auth Sign Up...");
      const firebaseUser = await firebaseAuth.signUp(testEmail, password, displayName);
      addTestResult(`✅ Sign up successful: ${firebaseUser.email}`);

      // Test sign out
      addTestResult("Testing Firebase Auth Sign Out...");
      await firebaseAuth.signOut();
      addTestResult("✅ Sign out successful");

      // Test sign in
      addTestResult("Testing Firebase Auth Sign In...");
      const signInUser = await firebaseAuth.signIn(testEmail, password);
      addTestResult(`✅ Sign in successful: ${signInUser.email}`);

    } catch (error) {
      if (error instanceof Error && error.message.includes("email-already-in-use")) {
        // If email exists, try to sign in instead
        try {
          addTestResult("Email exists, testing sign in...");
          const signInUser = await firebaseAuth.signIn(email, password);
          addTestResult(`✅ Sign in successful: ${signInUser.email}`);
        } catch (signInError) {
          addTestResult(`❌ Auth test failed: ${signInError instanceof Error ? signInError.message : "Unknown error"}`);
        }
      } else {
        addTestResult(`❌ Auth test failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }
    setIsLoading(false);
  };

  const testFirestoreOperations = async () => {
    if (!auth.currentUser) {
      addTestResult("❌ No authenticated user for Firestore test");
      return;
    }

    setIsLoading(true);
    try {
      const userId = auth.currentUser.uid;
      const testDocId = `test_${Date.now()}`;

      // Test create document in test collection (allowed by security rules)
      addTestResult("Testing Firestore Create Document...");
      const testDocRef = doc(db, "test", testDocId);
      await setDoc(testDocRef, {
        name: "Test Document",
        value: 42,
        active: true,
        userId: userId,
        createdAt: new Date()
      });
      addTestResult("✅ Document created successfully");

      // Test get document
      addTestResult("Testing Firestore Get Document...");
      const docSnap = await getDoc(testDocRef);
      if (docSnap.exists()) {
        addTestResult(`✅ Document retrieved: ${JSON.stringify(docSnap.data())}`);
      } else {
        addTestResult("❌ Document not found");
      }

      // Test update document
      addTestResult("Testing Firestore Update Document...");
      await updateDoc(testDocRef, {
        value: 100,
        updated: true,
        updatedAt: new Date()
      });
      addTestResult("✅ Document updated successfully");

      // Test get collection
      addTestResult("Testing Firestore Get Collection...");
      const testCollectionRef = collection(db, "test");
      const querySnapshot = await getDocs(testCollectionRef);
      addTestResult(`✅ Collection retrieved: ${querySnapshot.size} documents`);

      // Test delete document
      addTestResult("Testing Firestore Delete Document...");
      await deleteDoc(testDocRef);
      addTestResult("✅ Document deleted successfully");

    } catch (error) {
      addTestResult(`❌ Firestore test failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
    setIsLoading(false);
  };

  const testUserProfile = async () => {
    if (!auth.currentUser) {
      addTestResult("❌ No authenticated user for profile test");
      return;
    }

    setIsLoading(true);
    try {
      const userId = auth.currentUser.uid;
      const userEmail = auth.currentUser.email || "test@example.com";

      // Test create user profile
      addTestResult("Testing User Profile Creation...");
      await firebaseUsers.createUserProfile(userId, {
        id: userId,
        email: userEmail,
        anonymousId: `anon_${Date.now()}`,
        location: { city: "Test City", state: "TS" },
        genderPreference: "all"
      });
      addTestResult("✅ User profile created successfully");

      // Test get user profile
      addTestResult("Testing Get User Profile...");
      const profile = await firebaseUsers.getUserProfile(userId);
      addTestResult(`✅ Profile retrieved: ${profile?.email}`);

      // Test update user profile
      addTestResult("Testing Update User Profile...");
      await firebaseUsers.updateUserProfile(userId, {
        location: { city: "Updated City", state: "UC" }
      });
      addTestResult("✅ User profile updated successfully");

    } catch (error) {
      addTestResult(`❌ User profile test failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
    setIsLoading(false);
  };

  const testReviews = async () => {
    if (!auth.currentUser) {
      addTestResult("❌ No authenticated user for reviews test");
      return;
    }

    setIsLoading(true);
    try {
      // Test create review
      addTestResult("Testing Review Creation...");
      const reviewData = {
        authorId: auth.currentUser.uid,
        reviewerAnonymousId: `anon_${Date.now()}`,
        reviewedPersonName: "Test Person",
        reviewedPersonLocation: { city: "Test City", state: "TS" },
        greenFlags: ["good_communicator", "respectful"] as GreenFlag[],
        redFlags: [] as RedFlag[],
        sentiment: "green" as const,
        reviewText: "This is a test review created via Firebase integration.",
        media: [],
        profilePhoto: "https://picsum.photos/400/600?random=1",
        status: "approved" as const,
        likeCount: 0
      };

      const reviewId = await firebaseReviews.createReview(reviewData);
      addTestResult(`✅ Review created successfully: ${reviewId}`);

      // Test get reviews
      addTestResult("Testing Get Reviews...");
      const { reviews: fetchedReviews } = await firebaseReviews.getReviews(5);
      addTestResult(`✅ Reviews retrieved: ${fetchedReviews.length} reviews`);

      // Test update review (like) - Note: Only likeCount updates are allowed by security rules
      if (fetchedReviews.length > 0) {
        addTestResult("Testing Review Update (Like)...");
        const firstReview = fetchedReviews[0];
        try {
          await firebaseReviews.updateReview(firstReview.id, {
            likeCount: firstReview.likeCount + 1
          });
          addTestResult("✅ Review liked successfully");
        } catch (updateError) {
          addTestResult(`⚠️ Review update limited by security rules (expected): ${updateError instanceof Error ? updateError.message : "Unknown error"}`);
        }
      }

    } catch (error) {
      addTestResult(`❌ Reviews test failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const runAllTests = async () => {
    clearResults();
    addTestResult("🚀 Starting comprehensive Firebase tests...");
    
    await testFirebaseAuth();
    await testFirestoreOperations();
    await testUserProfile();
    await testReviews();
    
    addTestResult("🎉 All tests completed!");
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-900">
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-text-primary mb-2">
            Firebase Integration Test
          </Text>
          <Text className="text-text-secondary">
            Test Firebase Authentication, Firestore, and other services
          </Text>
        </View>

        {/* Current Status */}
        <View className="bg-surface-800 rounded-lg p-4 mb-6">
          <Text className="text-lg font-semibold text-text-primary mb-2">
            Current Status
          </Text>
          <View className="flex-row items-center mb-2">
            <Ionicons 
              name={isAuthenticated ? "checkmark-circle" : "close-circle"} 
              size={20} 
              color={isAuthenticated ? "#10B981" : "#EF4444"} 
            />
            <Text className="text-text-secondary ml-2">
              Authentication: {isAuthenticated ? "Signed In" : "Not Signed In"}
            </Text>
          </View>
          {user && (
            <Text className="text-text-muted text-sm">
              User: {user.email} ({user.id})
            </Text>
          )}
          <Text className="text-text-muted text-sm">
            Reviews in store: {reviews.length}
          </Text>
        </View>

        {/* Test Configuration */}
        <View className="bg-surface-800 rounded-lg p-4 mb-6">
          <Text className="text-lg font-semibold text-text-primary mb-4">
            Test Configuration
          </Text>
          
          <AnimatedInput
            label="Email"
            placeholder="test@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
            className="mb-4"
          />
          
          <AnimatedInput
            label="Password"
            placeholder="password123"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon="lock-closed-outline"
            className="mb-4"
          />
          
          <AnimatedInput
            label="Display Name"
            placeholder="Test User"
            value={displayName}
            onChangeText={setDisplayName}
            leftIcon="person-outline"
          />
        </View>

        {/* Test Buttons */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-text-primary mb-4">
            Individual Tests
          </Text>
          
          <View className="space-y-3">
            <AnimatedButton
              title="Test Firebase Auth"
              variant="secondary"
              onPress={testFirebaseAuth}
              disabled={isLoading}
            />
            
            <AnimatedButton
              title="Test Firestore Operations"
              variant="secondary"
              onPress={testFirestoreOperations}
              disabled={isLoading || !auth.currentUser}
            />

            <AnimatedButton
              title="Test User Profile"
              variant="secondary"
              onPress={testUserProfile}
              disabled={isLoading || !auth.currentUser}
            />

            <AnimatedButton
              title="Test Reviews"
              variant="secondary"
              onPress={testReviews}
              disabled={isLoading || !auth.currentUser}
            />
          </View>
        </View>

        {/* Run All Tests */}
        <View className="mb-6">
          <AnimatedButton
            title="Run All Tests"
            variant="primary"
            onPress={runAllTests}
            disabled={isLoading}
            className="mb-3"
          />
          
          <AnimatedButton
            title="Clear Results"
            variant="ghost"
            onPress={clearResults}
            disabled={isLoading}
          />
        </View>

        {/* Loading Indicator */}
        {isLoading && (
          <View className="items-center mb-6">
            <LoadingSpinner size="large" />
            <Text className="text-text-secondary mt-2">Running tests...</Text>
          </View>
        )}

        {/* Test Results */}
        {testResults.length > 0 && (
          <View className="bg-surface-800 rounded-lg p-4">
            <Text className="text-lg font-semibold text-text-primary mb-4">
              Test Results
            </Text>
            <ScrollView className="max-h-96">
              {testResults.map((result, index) => (
                <Text 
                  key={index} 
                  className="text-text-secondary text-sm mb-1 font-mono"
                >
                  {result}
                </Text>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}