import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Creates a new user in Firestore
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {string} email - User's email address
 * @param {string} userId - User's unique ID (usually from Firebase Auth)
 * @param {string} role - User's role (e.g., 'member', 'admin')
 * @returns {Promise<Object>} The created user data
 */
export const createUser = async (firstName, lastName, email, userId, role) => {
   const firstLast = `${firstName} ${lastName}`.toLowerCase();

   const userData = {
      firstName,
      lastName,
      firstLast,
      email,
      userId,
      role,
      signUpDate: new Date().toISOString(),
      boardIds: [],
   };

   await setDoc(doc(db, 'users', userId), userData);
   return userData;
};

/**
 * Updates an existing user's information in Firestore
 * @param {string} userId - User's unique ID
 * @param {Object} updateData - Object containing the fields to update
 * @returns {Promise<Object>} The updated user data
 */
export const updateUser = async (userId, updateData) => {
   const userRef = doc(db, 'users', userId);
   
   // If firstName or lastName is being updated, update firstLast as well
   if (updateData.firstName || updateData.lastName) {
      const snapshot = await getDoc(userRef);
      const currentData = snapshot.data();
      const newFirstName = updateData.firstName || currentData.firstName;
      const newLastName = updateData.lastName || currentData.lastName;
      updateData.firstLast = `${newFirstName} ${newLastName}`.toLowerCase();
   }

   await updateDoc(userRef, updateData);
   return updateData;
};

/**
 * Gets a user's data from Firestore
 * @param {string} userId - User's unique ID
 * @returns {Promise<Object>} The user's data
 */
export const getUser = async (userId) => {
   const userRef = doc(db, 'users', userId);
   const snapshot = await getDoc(userRef);
   
   if (!snapshot.exists()) {
      throw new Error('User not found');
   }
   
   return snapshot.data();
}; 