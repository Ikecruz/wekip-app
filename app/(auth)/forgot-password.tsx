import { Button } from "@/components/buttons";
import { PasswordInput, PinInput, TextInput } from "@/components/form";
import { SafeView } from "@/components/misc/safe-view";
import Colors from "@/constants/Colors";
import Typography from "@/constants/Typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Stack, router } from "expo-router";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { z } from "zod";
import validator from "validator";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { AxiosResponseMessage } from "@/services/axios.service";
import { makePublicApiCall } from "@/services/api.service";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

interface FormData {
    email: string;
    token: string;
    password: string;
    step: number;
    confirmPassword: string;
}

interface ResendForm {
    email: string
}

export default function ForgotPassword() {

    const { mutate: sendOtp, isPending: sendOtpIsLoading } = useMutation<unknown, AxiosResponse<AxiosResponseMessage>, ResendForm, unknown>({
        retry: 0,
        mutationFn: async (body: ResendForm) => await makePublicApiCall({
            url: "/auth/forgot-password",
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
            setValue("step", 2)
        }
    })

    const { mutate: resetPassword, isPending } = useMutation<unknown, AxiosResponse<AxiosResponseMessage>, FormData, unknown>({
        retry: 0,
        mutationFn: async ({ step, confirmPassword, ...body }: FormData) => await makePublicApiCall({
            url: "/auth/change-password",
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
                title: "Your password has been reset. You're back in control of your account.",
            })
            router.push("/(auth)/login")
        }
    })

    const schema = z.discriminatedUnion("step", [
        z.object({
            step: z.literal(1),
            email: z.string({ required_error: "Email is required" })
                .trim().refine(validator.isEmail, "Enter a valid email address"),
        }),
        z.object({
            step: z.literal(2),
            email: z.string({ required_error: "Email is required" })
                .trim().refine(validator.isEmail, "Enter a valid email address"),
            otp: z.string({ required_error: "Otp is required" }).length(6, { message: "Enter a valid otp" }),
            password: z.string({ required_error: "Password is required" }).trim().min(8, { message: 'Password should have at least 8 letters' }),
            confirmPassword: z.string({ required_error: "Password is required" }).trim().min(8, { message: 'Confirm Password should have at least 8 letters' })
        }),
    ]).refine(data => {

        if (data.step === 1) return true;
        return data.step === 2 && data.password === data.confirmPassword

    }, { message: "Password and Confirm Password do not match", path: ["confirmPassword"] })

    const { control, handleSubmit, formState: { errors }, getValues, setValue } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            step: 1
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
        sendOtp({ email: getValues("email") })
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
                style={{ flexGrow: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                enabled
            >
                <SafeView>
                    {
                        getValues("step") === 1 ?
                            <View style={styles.container}>
                                <Text style={styles.heading_text}>
                                    Forgot Password
                                </Text>
                                <Text style={styles.description_text}>
                                    Locked out? Regain access to your account by resetting your password.
                                </Text>
                                <View
                                    style={styles.form_container}
                                >
                                    <View style={styles.form_children}>
                                        <TextInput
                                            placeholder="Email"
                                            error={errors.email?.message}
                                            value={getValues("email")}
                                            autoCorrect={false}
                                            onChangeText={(value) => setValue("email", value)}
                                        />
                                    </View>
                                    <View style={styles.form_children}>
                                        <Button fullWidth loading={sendOtpIsLoading} onPress={handleSubmit((data) => sendOtp({email: data.email}))}>
                                            Continue
                                        </Button>
                                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                            <Link href="/(auth)/login" asChild>
                                                <TouchableOpacity>
                                                    <Text style={styles.link_text}>Back to login</Text>
                                                </TouchableOpacity>
                                            </Link>
                                        </View>
                                    </View>
                                </View>
                            </View> :
                            <View style={styles.container}>
                                <Text style={styles.heading_text}>
                                    Reset Password
                                </Text>
                                <Text style={styles.description_text}>
                                    We've sent a six digit code to{" "}
                                    <Text style={{ color: Colors.night }}> {getValues("email")}</Text>
                                </Text>
                                <View
                                    style={styles.form_container}
                                >
                                    <View style={styles.form_children}>
                                        <Controller
                                            control={control}
                                            render={({ field: { onBlur, onChange, value } }) => (
                                                <TextInput
                                                    placeholder="Otp"
                                                    error={errors.token?.message}
                                                    value={value}
                                                    autoCorrect={false}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                />
                                            )}
                                            name="token"

                                        />
                                        <Controller
                                            control={control}
                                            render={({ field: { onBlur, onChange, value } }) => (
                                                <PasswordInput
                                                    placeholder="Password"
                                                    error={errors.password?.message}
                                                    value={value}
                                                    autoCorrect={false}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                />
                                            )}
                                            name="password"
                                        />
                                        <Controller
                                            control={control}
                                            render={({ field: { onBlur, onChange, value } }) => (
                                                <PasswordInput
                                                    placeholder="Confirm password"
                                                    error={errors.confirmPassword?.message}
                                                    value={value}
                                                    autoCorrect={false}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                />
                                            )}
                                            name="confirmPassword"
                                        />
                                    </View>
                                    <View style={styles.form_children}>
                                        <Button fullWidth loading={isPending} onPress={handleSubmit((data) => resetPassword(data))}>
                                            Reset Password
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
                    }
                </SafeView >
            </KeyboardAvoidingView>
        </>
    )

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