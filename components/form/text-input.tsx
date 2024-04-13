import Colors from "@/src/constants/Colors"
import Typography from "@/src/constants/Typography"
import { forwardRef, useRef } from "react"
import { Text, TextInput as DefaultTextInput, TextInputProps, TextStyle, StyleSheet, View } from "react-native"
import { InputProps } from "."
import { formatter } from "@/src/utils"
import { TouchableOpacity } from "react-native"

interface Props extends InputProps {
    icon?: React.JSX.Element,
    balance?: string,
    rightComponent?: React.JSX.Element,
}

export const TextInput = forwardRef<DefaultTextInput, Props>(
    (props, ref): React.ReactElement => {

        const {
            label,
            error,
            variant = "filled",
            labelStyle,
            icon,
            style,
            containerStyle,
            balance,
            rightComponent,
            editable,
            ...otherProps
        } = props

        const innerRef = useRef<DefaultTextInput>(null)

        return (
            <View style={[styles.container, containerStyle]} onTouchEnd={() => innerRef.current?.focus()}>
                {label && <Text style={[styles.label, editable == false && styles.disabled, labelStyle]}>{label}</Text>}
                <View
                    style={[
                        styles.base,
                        styles[variant],
                        error !== undefined && styles.error,
                        editable == false && styles.disabled,
                        style
                    ]}
                >
                    <View style={styles.input_container}>
                        {icon}
                        <DefaultTextInput
                            autoCapitalize="none"
                            ref={innerRef}
                            placeholderTextColor={Colors.darkGrey}
                            style={styles.input}
                            editable={editable}
                            {...otherProps}
                        />
                        {rightComponent}
                    </View>
                    {
                        balance !== undefined &&
                        <View style={styles.balance_contain}>
                            <Text style={styles.balance_text}>Balance: {formatter.format(Number(balance))}</Text>
                        </View>
                    }
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
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        minHeight: 50,
        gap: 10,
        justifyContent: "center"
    },
    input_container: {
        height: "auto",
        flexDirection: "row",
        alignItems: "center",
        fontFamily: Typography.content.fontFamily.regular,
        gap: 10
    },
    input: {
        flex: 1,
        justifyContent: "center"
    },
    arrow_container: {
        alignItems: "center",
        justifyContent: "center"
    },
    balance_contain: {
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    balance_text: {
        fontFamily: Typography.content.fontFamily.regular,
        fontSize: Typography.content.size.extraSmall
    },
    filled: {
        backgroundColor: Colors.filledGrey
    },
    outline: {
        borderColor: Colors.midGrey,
        borderWidth: 1,
        borderStyle: "solid"
    },
    disabled: {
        opacity: 0.5
    },
    label: {
        fontFamily: Typography.content.fontFamily.regular,
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