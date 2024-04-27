import { StyleSheet, Text, View } from 'react-native';
import { PinInput } from '@/components/form';
import { Button } from '@/components/buttons';
import Typography from '@/constants/Typography';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { AxiosResponseMessage } from '@/services/axios.service';
import { makePrivateApiCall } from '@/services/api.service';
import { useAuth } from '@/contexts/auth.context';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useEffect, useRef, useState } from 'react';
import moment from 'moment';

export default function CreateScreen() {

    const { authData, signOut } = useAuth()

    const [code, setCode] = useState("");

    const { mutate: generateCode, isPending } = useMutation<unknown, AxiosResponse<AxiosResponseMessage>, any, unknown>({
        retry: 0,
        mutationFn: async () => await makePrivateApiCall({
            url: "/user/share-code",
            method: "POST",
            token: authData!.token,
            signOut
        }),
        onError: (error, variables) => {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: error.data.message,
            })
        },
        onSuccess: (response: any) => {
            setCode(response.code);
        }
    })

    const timer = useRef(900)

    const [displayTimer, setDisplayTimer] = useState<number | null>(null)

    const interval = () => {
        timer.current = timer.current - 1

        setDisplayTimer(timer.current)

        if (timer.current < 0) {
            timer.current = 900
            setDisplayTimer(null)
            return;
        }
        setTimeout(interval, 1000)
    }

    const startTimerAndResendPin = () => {
        interval()
        generateCode({})
    }

    useEffect(() => {
        startTimerAndResendPin()
    }, [])


    return (
        <View style={styles.container}>
            <View style={styles.input_container}>
                <View>
                    <Text style={styles.description}>Get a share code for secure receipt storage</Text>
                    <PinInput
                        editable={false}
                        value={code}
                        password={false}
                        codeLength={6}
                    />
                    <View style={styles.code_timer_contain}>
                        <Text style={styles.normal_text}>Your code will expire in</Text>
                        <Text style={styles.timer}>{moment.utc(displayTimer as number * 1000).format('mm:ss')}</Text>
                        <Text style={styles.normal_text}>You can generate a new code when timer runs down</Text>
                    </View>
                </View>
                <View style={styles.button_contain}>
                    <Button fullWidth>
                        Copy Code
                    </Button>
                    <Button fullWidth variant='subtle' onPress={startTimerAndResendPin} disabled={displayTimer! > 0} leftIcon={<Feather name="refresh-ccw" size={18} color="black" />}>
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
        textAlign: "center",
        width: "80%"
    },
});
