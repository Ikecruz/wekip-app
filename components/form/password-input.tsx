import Colors from "@/constants/Colors"
import Typography from "@/constants/Typography"
import { forwardRef, useState } from "react"
import { Text, TextInput as DefaultTextInput, TextInputProps, TextStyle, StyleSheet, View } from "react-native"
import { InputProps } from "."
import { ActionIcon } from "@/components/buttons/action-icon"
import { Entypo } from "@expo/vector-icons"

export const PasswordInput = forwardRef<DefaultTextInput, InputProps>(
    (props, ref): React.ReactElement => {

        const { label, error, variant = "filled", labelStyle, ...otherProps } = props

        const [privateMode, setPrivateMode] = useState(true)

        return (
            <View style={styles.container}>
                {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
                <View
                    style={[
                        styles.base,
                        styles[variant],
                        error !== undefined && styles.error
                    ]}
                >
                    <DefaultTextInput
                        autoCapitalize="none"
                        ref={ref}
                        placeholderTextColor={Colors.darkGrey}
                        style={styles.input}
                        secureTextEntry={privateMode}
                        {...otherProps}
                    />
                    <ActionIcon onPress={() => setPrivateMode(!privateMode)}>
                        <Entypo name={privateMode ? "eye" : "eye-with-line"} size={18} />
                    </ActionIcon>
                </View>
                {error && <Text style={[styles.errorText, labelStyle]}>{error}</Text>}
            </View>
        )

    }
)

const styles = StyleSheet.create({
    container: {
        gap: 5,
        width: "auto"
    },
    base: {
        width: "100%",
        height: 50,
        borderRadius: 5,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
    },
    filled: {
        backgroundColor: Colors.filledGrey
    },
    outline: {
        borderColor: Colors.midGrey,
        borderWidth: 1,
        borderStyle: "solid"
    },
    label: {
        fontFamily: Typography.content.fontFamily.regular,
    },
    input: {
        flex: 1,
        fontFamily: Typography.content.fontFamily.regular,
        height: "100%"
    },
    error: {
        borderColor: Colors.error,
        borderWidth: 1,
        borderStyle: "solid"
    },
    errorText: {
        fontFamily: Typography.content.fontFamily.regular,
        fontSize: Typography.content.size.extraSmall,
        color: Colors.error
    }
})