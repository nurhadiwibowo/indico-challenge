import { getAuth, onAuthStateChanged, sendSignInLinkToEmail, signOut, } from "@firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "src/routes/hooks";
import { actionCodeSettings } from "src/utils/firebase/auth";
import app from "src/utils/firebase/firebase";

type FetchStatus = "idle" | "loading" | "success" | "error";
type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';


export const useLogin = () => {
    const auth = getAuth(app);
    const [status, setStatus] = useState<FetchStatus>("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const login = async (email: string) => {
        setStatus("loading");
        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            setStatus("success");
            setTimeout(() => {
                setStatus("idle")
            }, 3000);
        } catch (error) {
            setErrorMessage(error.message);
            setStatus("error");
        }
    }

    return { login, status, errorMessage };
}

export const useAuthCheck = (requireAuth: boolean) => {
    const auth = getAuth(app);
    const [status, setStatus] = useState<AuthStatus>('loading');
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log({user})
            if (user) {
                // User is signed in
                setStatus('authenticated');
                if (!requireAuth) {
                    // Redirect to home if user is already authenticated and tries to access auth pages
                    router.push('/');
                }
            } else {
                // User is not signed in
                setStatus('unauthenticated');
                if (requireAuth) {
                    // Redirect to sign-in if authentication is required
                    router.push('/sign-in');
                }
            }
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, [auth, requireAuth, router]);

    return { status };
}

export const useLogout = async () => {
    const auth = getAuth(app);
    const router = useRouter();
    try {
        window.localStorage.clear();
        await signOut(auth);
        router.push('/sign-in');
    } catch (error) {
        console.log(error);
    }
}