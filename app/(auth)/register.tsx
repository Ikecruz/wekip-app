import { Button } from "@/components/buttons";
import { PasswordInput, TextInput } from "@/components/form";
import { SafeView } from "@/components/misc/safe-view";
import Colors from "@/constants/Colors";
import Typography from "@/constants/Typography";
import { useAuth } from "@/contexts/auth.context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, Stack, useRouter } from "expo-router";
import { KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as WebBrowser from "expo-web-browser"
import validator from "validator";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { makePublicApiCall } from "@/services/api.service";
import { AxiosResponseMessage } from "@/services/axios.service";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { encodeData } from "@/services/utils.service";
// import { EmailVerificationObject } from "@/src/interface/auth.interface";

interface FormData {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

interface EmailVerificationObject {
    email: string;
    verification_key: string
}

export default function Register() {

    const router = useRouter()

    const openExternalLink = async (url: string) => {
        await WebBrowser.openBrowserAsync(url, {
            presentationStyle: WebBrowser.WebBrowserPresentationStyle.POPOVER
        });
    }

    const { mutate: register, isPending } = useMutation<unknown, AxiosResponse<AxiosResponseMessage>, FormData, unknown>({
        retry: 0,
        mutationFn: async ({ confirmPassword, ...body }: FormData) => await makePublicApiCall({
            url: "/auth/user/register",
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
                title: "Sign Up Successfully",
            })

            const verificationObject: EmailVerificationObject = {
                email: variables.email,
                verification_key: response.verification_key,
            }

            router.push(`/(auth)/verify-email/${encodeData(verificationObject)}`)
        }
    })

    const schema = z.object({
        email: z.string({ required_error: "Email is required" })
            .trim().refine(validator.isEmail, "Enter a valid email address"),
        username: z.string({required_error: "Username is required"}).trim().min(3, "Username should have at least 3 character"),
        password: z.string({required_error: "Password is required"}).trim().min(8, { message: 'Password should have at least 8 letters' }),
        confirmPassword: z.string({required_error: "Password is required"}).trim().min(8, { message: 'Confirm Password should have at least 8 letters' }),
    }).refine(data => data.password === data.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
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
                            Create an Account
                        </Text>
                        <Text style={styles.description_text}>
                            Let's get you started! this will only take a few minutes
                        </Text>
                        <ScrollView
                            contentContainerStyle={styles.form_container}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.form_children}>
                                <Controller
                                    control={control}
                                    render={({ field: { onBlur, onChange, value } }) => (
                                        <TextInput
                                            placeholder="Email"
                                            error={errors.email?.message}
                                            value={value}
                                            autoCorrect={false}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                        />
                                    )}
                                    name="email"
                                />
                                <Controller
                                    control={control}
                                    render={({ field: { onBlur, onChange, value } }) => (
                                        <TextInput
                                            placeholder="Username"
                                            error={errors.username?.message}
                                            value={value}
                                            autoCorrect={false}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                        />
                                    )}
                                    name="username"
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
                        </ScrollView>
                        <View style={styles.button_container}>
                            <Button fullWidth onPress={handleSubmit((data) => register(data))} loading={isPending}>
                                Create Account
                            </Button>
                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                <Text style={styles.grey_text}>Already have an account? </Text>
                                <Link href="/(auth)/login" asChild>
                                    <TouchableOpacity>
                                        <Text style={styles.link_text}> Sign In</Text>
                                    </TouchableOpacity>
                                </Link>
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
    button_container: {
        gap: 10,
        marginTop: 15
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
        color: Colors.darkGrey,
        lineHeight: 17
    }
});
