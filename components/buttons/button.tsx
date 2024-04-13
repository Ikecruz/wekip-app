import Colors from "@/src/constants/Colors"
import Typography from "@/src/constants/Typography"
import { forwardRef } from "react"
import { ActivityIndicator, Button as NativeButton, StyleSheet, Text, TextStyle, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from "react-native"

interface ButtonProps extends TouchableOpacityProps {
    children: string,
    fullWidth?: boolean,
    disabled?: boolean,
    loading?: boolean,
    variant?: "filled" | "outline" | "subtle",
    compact?: boolean,
    textStyle?: TextStyle,
    rightIcon?: JSX.Element,
    leftIcon?: JSX.Element
}

export const Button = forwardRef<TouchableOpacity, ButtonProps>(
    (props, ref): React.ReactElement => {

        const { 
            children, 
            fullWidth, 
            disabled, 
            loading,
            style, 
            variant = "filled", 
            compact, 
            textStyle,
            rightIcon,
            leftIcon,
            ...otherProps 
        } = props

        return (
            <TouchableOpacity 
                disabled={disabled} 
                ref={ref} 
                activeOpacity={0.8} 
                style={styles.container} 
                {...otherProps}
            >
                <View 
                    style={[
                        styles.base,
                        styles[variant],
                        style,
                        compact && styles.compact,
                        (disabled || loading) && styles.disabled,
                        fullWidth && styles.fullWidth
                    ]}
                >
                    {
                        loading ? 
                        <ActivityIndicator color={textStyle?.color || "white"} />  : 
                        leftIcon
                    }
                    <Text 
                        style={[
                            styles.text,
                            styles[`text_${variant}`],
                            textStyle
                        ]}
                    >
                        {children}
                    </Text>
                    {rightIcon}
                </View>
            </TouchableOpacity>
        )
    }
)

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    base: {
        backgroundColor: "transparent",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 5,
        gap: 10,
    },
    filled: {
        backgroundColor: Colors.blue,
    },
    outline: {
        borderWidth: 2,
        borderColor: Colors.blue,
        borderStyle: "solid",
        paddingHorizontal: 43,
        paddingVertical: 10,
    },
    subtle: {},
    fullWidth: {
        width: "100%"
    },
    disabled: {
        opacity: 0.7
    },
    text: {
        fontSize: Typography.content.size.small,
        fontFamily: Typography.content.fontFamily.regular
    },
    text_filled: {
        color: "white"
    },
    text_outline: {
        color: Colors.blue
    },
    text_subtle: {},
    compact: {
        paddingHorizontal: 0,
        paddingVertical: 0
    }
})