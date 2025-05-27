import { ref, set, get, update } from 'firebase/database';
import { database } from '../firebase/config';

/**
 * Creates a new user in Firebase Realtime Database
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

   // Realtime Database'e kaydetmek için ref ve set kullanıyoruz
   await set(ref(database, 'users/' + userId), userData);
   return userData;
};

/**
 * Updates an existing user's information in Firebase Realtime Database
 * @param {string} userId - User's unique ID
 * @param {Object} updateData - Object containing the fields to update
 * @returns {Promise<Object>} The updated user data
 */
export const updateUser = async (userId, updateData) => {
   const userRef = ref(database, 'users/' + userId);
   
   // If firstName or lastName is being updated, update firstLast as well
   if (updateData.firstName || updateData.lastName) {
      const snapshot = await get(userRef);
      const currentData = snapshot.val();
      const newFirstName = updateData.firstName || currentData.firstName;
      const newLastName = updateData.lastName || currentData.lastName;
      updateData.firstLast = `${newFirstName} ${newLastName}`.toLowerCase();
   }

   await update(userRef, updateData);
   return updateData;
};

/**
 * Gets a user's data from Firebase Realtime Database
 * @param {string} userId - User's unique ID
 * @returns {Promise<Object>} The user's data
 */
export const getUser = async (userId) => {
   const userRef = ref(database, 'users/' + userId);
   const snapshot = await get(userRef);
   
   if (!snapshot.exists()) {
      throw new Error('User not found');
   }
   
   return snapshot.val();
}; 