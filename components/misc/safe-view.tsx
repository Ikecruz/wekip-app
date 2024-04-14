import { Platform, SafeAreaView, StatusBar, StyleSheet, Keyboard, TouchableWithoutFeedback } from "react-native"
// import { SafeAreaView } from "react-native-safe-area-context"

export function SafeView({
    children
}: {
    children: JSX.Element
}) {

    return <>
        <SafeAreaView style={styles.safe_area}>
            {children}
        </SafeAreaView>
    </>

}

const styles = StyleSheet.create({
    safe_area: {
        flex: 1,
        backgroundColor: "white",
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
})