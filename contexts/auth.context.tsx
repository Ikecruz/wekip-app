import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigationContainerRef, useRouter, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

export type AuthContextData = {
    authData?: AuthData;
    loading: boolean;
    signIn(authData: AuthData): Promise<void>;
    signOut(): void;
};

export type AuthData = {
    token: string;
    email: string;
    username: string;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

const AuthProvider = ({
    children
}: {
    children: React.ReactNode
}) => {

    const [authData, setAuthData] = useState<AuthData>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStorageData();
    }, [])

    const signIn = async (_authData: AuthData) => {
        setAuthData(_authData)
        await AsyncStorage.setItem('@AuthData', JSON.stringify(_authData));
    }

    const signOut = async () => {
        setAuthData(undefined);
        await AsyncStorage.removeItem('@AuthData');
    };

    async function loadStorageData(): Promise<void> {
        try {

            const authDataSerialized = await AsyncStorage.getItem('@AuthData');

            if (authDataSerialized) {
                const _authData: AuthData = JSON.parse(authDataSerialized);
                setAuthData(_authData);
            }

        } catch (error) { }
        finally {
            setLoading(false);
        }
    }

    const useProtectedRoute = (_authData: AuthData | null) => {
        const segments = useSegments();
        const router = useRouter();

        // checking that navigation is all good;
        const [isNavigationReady, setNavigationReady] = useState(false);
        const rootNavigation = useNavigationContainerRef();

        useEffect(() => {
            const unsubscribe = rootNavigation?.addListener("state", (event) => {
                setNavigationReady(true);
            });
            return function cleanup() {
                if (unsubscribe) {
                    unsubscribe();
                }
            };
        }, [rootNavigation]);

        useEffect(() => {
            if (!isNavigationReady) return;

            const inAuthGroup = segments[0] === "(auth)";

            if (loading) return;

            if (!authData && !inAuthGroup) {
                router.replace("/login");
            } else if (authData && inAuthGroup) {
                router.replace("/(tabs)/");
            }

        }, [_authData, segments, loading, isNavigationReady]);
    };

    useProtectedRoute(authData as AuthData);

    return (
        <AuthContext.Provider value={{ authData, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )

}

function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

export { AuthContext, AuthProvider, useAuth }