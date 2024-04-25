import { makePublicApiCall } from "@/services/api.service";
import { Button } from "@/components/buttons";
import { PasswordInput, TextInput } from "@/components/form";
import { SafeView } from "@/components/misc/safe-view";
import Colors from "@/constants/Colors";
import Typography from "@/constants/Typography";
import { useAuth } from "@/contexts/auth.context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, Stack, useNavigation } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import validator from "validator";
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { router } from "expo-router";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { AxiosResponseMessage } from "@/services/axios.service";
import { encodeData } from "@/services/utils.service";

interface FormData {
    email: string;
    password: string
}

export default function Login() {

    const { signIn } = useAuth()

    const { mutate, isPending } = useMutation<unknown, AxiosResponse<AxiosResponseMessage>, FormData, unknown>({
        retry: 0,
        mutationFn: async (loginObj: FormData) => await makePublicApiCall({
            url: "/auth/user/login",
            method: "POST",
            body: loginObj
        }),
        onError: (error, variables) => {
            if (error.data.message === "Email not verified") {
                router.replace(`/(auth)/verify-email/${encodeData({email: variables.email})}`)
                return;
            }
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: error.data.message,
            })
        },
        onSuccess: (response: any) => {
            signIn({
                email: response.user.email,
                username: response.user.username,
                token: response.token,
            })
            router.push(`/(tabs)/`)
        }
    })

    const onSubmit = (data: FormData) => mutate(data)

    const schema = z.object({
        email: z.string({ required_error: "Email is required" })
            .trim().refine(validator.isEmail, "Enter a valid email address"),
        password: z.string({ required_error: "Password is required" })
    })

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
                            Welcome back 👋
                        </Text>
                        <Text style={styles.description_text}>
                            Great to see you again!. Login to view your digital receipts
                        </Text>
                        <ScrollView
                            contentContainerStyle={styles.form_container}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.form_children}>

                                <Controller
                                    control={control}
                                    render={({ field: { onBlur, onChange, value } }) => (
                                        <TextInput
                                            placeholder="Email"
                                            error={errors.email?.message}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                        />
                                    )}
                                    name="email"
                                />

                                <Controller
                                    control={control}
                                    render={({ field: { onBlur, onChange, value } }) => (
                                        <PasswordInput
                                            placeholder="Password"
                                            error={errors.password?.message}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                        />
                                    )}
                                    name="password"
                                />

                                <Link href="/(auth)/forgot-password" asChild>
                                    <TouchableOpacity>
                                        <Text style={styles.link_text}>Forgot Password?</Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                            <View style={styles.form_children}>
                                <Button onPress={handleSubmit(onSubmit)} loading={isPending} fullWidth>
                                    Login
                                </Button>
                                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                    <Text style={styles.grey_text}>New to Wekip? </Text>
                                    <Link href="/(auth)/register" asChild>
                                        <TouchableOpacity>
                                            <Text style={styles.link_text}> Sign Up</Text>
                                        </TouchableOpacity>
                                    </Link>
                                </View>
                            </View>
                        </ScrollView>
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
        paddingHorizontal: 25,
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
