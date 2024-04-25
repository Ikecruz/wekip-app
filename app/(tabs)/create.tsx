import { StyleSheet, Text, View } from 'react-native';
import { PinInput } from '@/components/form';
import { Button } from '@/components/buttons';
import Typography from '@/constants/Typography';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

export default function CreateScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.input_container}>
                <View>
                    <Text style={styles.description}>Get a share code for secure receipt storage</Text>
                    <PinInput
                        editable={false}
                        value='412389'
                        password={false}
                        codeLength={6}
                    />
                    <View style={styles.code_timer_contain}>
                        <Text style={styles.normal_text}>Your code will expire in</Text>
                        <Text style={styles.timer}>12:00</Text>
                        <Text style={styles.normal_text}>You will be served with new code each time or generate a new code</Text>
                    </View>
                </View>
                <View style={styles.button_contain}>
                    <Button fullWidth>
                        Copy Code
                    </Button>
                    <Button fullWidth variant='subtle' leftIcon={<Feather name="refresh-ccw" size={18} color="black" />}>
                        Refresh Code
                    </Button>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 20,
        paddingBottom: 10
    },
    input_container: {
        display: "flex",
        justifyContent: "space-between",
        flexGrow: 1,
        gap: 25
    },
    code_timer_contain: {
        marginTop: 40,
        alignItems: "center",
        gap: 10,
        textAlign: "center"
    },
    timer: {
        fontFamily: Typography.headline.fontFamily.bold,
        fontSize: Typography.headline.size.large + 2
    },
    button_contain: {
        gap: 10
    },
    description: {
        marginBottom: 30,
        fontFamily: Typography.content.fontFamily.regular,
        color: Colors.darkGrey
    },
    normal_text: {
        fontFamily: Typography.content.fontFamily.regular,
        color: Colors.darkGrey,
        textAlign: "center"
    },
});
