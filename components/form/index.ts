import { TextInputProps, TextStyle, ViewStyle } from "react-native"

export * from "./text-input"
export * from "./number-input"
export * from "./password-input"
export * from "./pin-input"

export interface InputProps extends TextInputProps {
    variant?: "filled" | "outline"
    label?: string
    error?: string
    labelStyle?: TextStyle,
    containerStyle?: ViewStyle
}