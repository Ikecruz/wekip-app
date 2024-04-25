import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { Linking, Platform } from "react-native";
import * as Notifications from "expo-notifications"
import * as Device from "expo-device";
import Constants from "expo-constants";
import moment from "moment";

export type WekipData = {
    pushToken?: string
}

const WekipContext = createContext<WekipData>({} as WekipData)

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const WekipProvider = ({
    children
}: {
    children: React.ReactNode
}) => {

    const [pushToken, setPushToken] = useState<string>('')
    const notificationListener = useRef<Notifications.Subscription>();

    useEffect(() => {
        registerForPushNotification();
    }, [])

    async function registerForPushNotification(): Promise<void> {
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status, canAskAgain } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                return;
            }

            let token = await Notifications.getExpoPushTokenAsync({
                projectId: "102120e2-259a-41c1-816b-4f28460d5604",
            });

            setPushToken(token.data);
        } else {
            alert('Must use physical device for Push Notifications');
        }
    }

    useEffect(() => {
        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => { });
        
        return () => {
            Notifications.removeNotificationSubscription(
                notificationListener.current as Notifications.Subscription
            );
        };
    }, []);

    return (
        <WekipContext.Provider value={{ pushToken }}>
            {children}
        </WekipContext.Provider>
    )

}

function useWekip(): WekipData {

    const context = useContext(WekipContext);

    if (!context) {
        throw new Error('useWekip must be used within an WekipProvider');
    }

    return context

}

export { WekipContext, WekipProvider, useWekip }