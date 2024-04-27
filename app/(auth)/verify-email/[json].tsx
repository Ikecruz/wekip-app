import { makePublicApiCall } from "@/services/api.service";
import { Button } from "@/components/buttons";
import { PinInput } from "@/components/form";
import { SafeView } from "@/components/misc/safe-view";
import Colors from "@/constants/Colors";
import Typography from "@/constants/Typography";
import { AxiosResponseMessage } from "@/services/axios.service";
import { decodeData } from "@/services/utils.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

interface ResendForm {
    email: string;
}

interface VerifyForm {
    email: string;
    otp: string;
}

interface EmailVerificationObject {
    email: string;
}

export default function VerifyEmail() {

    const { json } = useLocalSearchParams<{ json: string }>()

    const verificationObject = useMemo<EmailVerificationObject>(() => {
        if (json) {
            return decodeData(json)
        }
        return {}
    }, [json])

    const { mutate: resendOtp } = useMutation<unknown, AxiosResponse<AxiosResponseMessage>, ResendForm, unknown>({
        retry: 0,
        mutationFn: async (body: ResendForm) => await makePublicApiCall({
            url: "/auth/get_otp",
            method: "POST",
            body
        }),
        onError: (error, variables) => {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: error.data.message,
            })
        },
        onSuccess: (response: any, variables) => {
            Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: "OTP resent successfully",
            })
        }
    })

    const timer = useRef(30)

    const [displayTimer, setDisplayTimer] = useState<number | null>(null)

    const interval = () => {
        timer.current = timer.current - 1

        setDisplayTimer(timer.current)

        if (timer.current < 0) {
            timer.current = 30
            setDisplayTimer(null)
            return;
        }
        setTimeout(interval, 1000)
    }

    const startTimerAndResendPin = () => {
        interval()
        resendOtp({email: verificationObject.email})
    }

    const schema = z.object({
        otp: z.string({required_error: "Otp is required"}).length(6, {message: "Enter a valid otp"}),
        email: z.string()
    })

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<VerifyForm>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: verificationObject.email,
        }
    })

    const { mutate: verifyEmail, isPending } = useMutation<unknown, AxiosResponse<AxiosResponseMessage>, VerifyForm, unknown>({
        retry: 0,
        mutationFn: async (body: VerifyForm) => await makePublicApiCall({
            url: "/auth/verify-email",
            method: "POST",
            body: {
                token: body.otp,
                group: "user" 
            }
        }),
        onError: (error, variables) => {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: error.data.message,
            })
        },
        onSuccess: (response: any, variables) => {
            Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: "Email verified successfully",
            })
            router.push("/(auth)/login")
        }
    })

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
                style={{ flexGrow: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                enabled
            >
                <SafeView>
                    <View style={styles.container}>
                        <Text style={styles.heading_text}>
                            Verify Email
                        </Text>
                        <Text style={styles.description_text}>
                            We've sent a six digit code to{" "}
                            <Text style={{ color: Colors.night }}> {verificationObject.email}</Text>
                        </Text>
                        <View
                            style={styles.form_container}
                        >
                            <View style={styles.form_children}>
                                <Controller
                                    control={control}
                                    render={({ field: { onBlur, onChange, value } }) => (
                                        <PinInput
                                            codeLength={6}
                                            containerStyle={{ marginVertical: 20, width: "100%" }}
                                            cellSpacing={5}
                                            value={value}
                                            onTextChange={onChange}
                                            error={errors.otp?.message !== undefined}
                                        />
                                    )}
                                    name="otp"
                                />

                            </View>
                            <View style={styles.form_children}>
                                <Button fullWidth loading={isPending} onPress={handleSubmit((data) => verifyEmail(data))}>
                                    Verify Now
                                </Button>
                                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                    <Text style={styles.grey_text}>Didn't receive any code? </Text>
                                    {
                                        displayTimer === null ?
                                        <TouchableOpacity onPress={startTimerAndResendPin}>
                                            <Text style={styles.link_text}>Resend code</Text>
                                        </TouchableOpacity> :
                                        <Text style={styles.grey_text}>
                                            {" "}Try again in{" "}
                                            <Text style={styles.link_text}>{displayTimer}</Text>
                                        </Text>
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                </SafeView >
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    heading_text: {
        fontFamily: Typography.headline.fontFamily.bold,
        fontSize: Typography.headline.size.meduim,
        color: Colors.night,
        marginBottom: 5
    },
    description_text: {
        fontFamily: Typography.content.fontFamily.regular,
        fontSize: Typography.content.size.small,
        color: Colors.darkGrey,
        marginBottom: 25,
        width: "70%"
    },
    form_container: {
        flexGrow: 1,
        justifyContent: "space-between",
        gap: 25
    },
    form_children: {
        gap: 15
    },
    link_text: {
        color: Colors.night,
        textAlign: "right",
        fontFamily: Typography.content.fontFamily.regular,
        fontSize: Typography.content.size.extraSmall
    },
    grey_text: {
        textAlign: "center",
        fontFamily: Typography.content.fontFamily.regular,
        fontSize: Typography.content.size.extraSmall,
        color: Colors.darkGrey
    }
});
