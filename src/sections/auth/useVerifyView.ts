import { getAuth, getIdToken, isSignInWithEmailLink, signInWithEmailLink } from "@firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "src/routes/hooks";
import app from "src/utils/firebase/firebase";

export const useVerifyView = () => {
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(app);

    async function verifyEmailLink() {
      try {
        // Check if the link is a sign-in link
        if (isSignInWithEmailLink(auth, window.location.href)) {
          // Get the email from localStorage
          const email = window.localStorage.getItem('emailForSignIn');

          if (!email) {
            setVerificationStatus('error');
            setErrorMessage('Email not found. Please try signing in again.');
            return;
          }

          // Sign in with email link
          await signInWithEmailLink(auth, email, window.location.href);

          // Clear email from storage
          window.localStorage.removeItem('emailForSignIn');

          setVerificationStatus('success');
          
          // Redirect after successful verification
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          setVerificationStatus('error');
          setErrorMessage('Invalid verification link');
        }
      } catch (error) {
        setVerificationStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Verification failed');
      }
    }

    verifyEmailLink();
  }, [router]);

  return {
    verificationStatus,
    errorMessage,
    router
  }
}