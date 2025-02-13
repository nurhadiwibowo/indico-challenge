import { getFirestore } from "@firebase/firestore";
import app from "./firebase";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);