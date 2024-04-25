import { useFonts } from "expo-font";
import { Slot, SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { AuthProvider, useAuth } from "../contexts/auth.context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AlertNotificationRoot } from "react-native-alert-notification";
import Typography from "@/constants/Typography";
import { WekipProvider } from "@/contexts/wekip.context";
// import { ClipboardProvider } from "../contexts/clipboard.context";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    IBMPlexSans: require("../assets/fonts/IBMPlexSans-Regular.ttf"),
    IBMPlexSerif: require("../assets/fonts/IBMPlexSerif-Regular.ttf"),
    IBMPlexSansBold: require("../assets/fonts/IBMPlexSans-Bold.ttf"),
    IBMPlexSerifBold: require("../assets/fonts/IBMPlexSerif-Bold.ttf")
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SafeAreaProvider>
          <AlertNotificationRoot toastConfig={{titleStyle: styles.toast_title, textBodyStyle: styles.toast_body}}>
            <WekipProvider>
              <RootLayoutNav />
            </WekipProvider>
          </AlertNotificationRoot>
        </SafeAreaProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function RootLayoutNav() {

  const { loading, authData } = useAuth();

  if (loading && !authData) return null;

  return <>

    <StatusBar backgroundColor="white" barStyle="dark-content" translucent={true} />

    <Stack screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="transaction/[json]" options={{ presentation: "modal" }} /> */}
    </Stack>
  </>
}

const styles = StyleSheet.create({
  toast_title: {
    fontFamily: Typography.content.fontFamily.bold,
    fontSize: Typography.content.size.small
  },
  toast_body: {
    fontFamily: Typography.content.fontFamily.regular,
    fontSize: Typography.content.size.small - 2
  }
})