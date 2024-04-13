import Colors from "@/constants/Colors";
import Typography from "@/constants/Typography";
import { forwardRef, useState } from "react";
import { StyleSheet } from "react-native";
import SmoothPinCodeInput, { SmoothPinCodeInputProps } from "react-native-smooth-pincode-input";

interface Props extends SmoothPinCodeInputProps{
    error?: boolean,
    variant?: "filled" | "outline"
}

export const PinInput = forwardRef<SmoothPinCodeInput, Props>(
    (props, ref) => {

        const { error, variant = "filled" } = props

        return (
            <SmoothPinCodeInput
                keyboardType="number-pad" 
                restrictToNumbers
                mask="*"
                cellSpacing={10}
                containerStyle={styles.container}
                textStyle={styles.text}
                cellStyle={[
                    styles.cell,
                    styles[variant],
                    error && styles.error
                ]}
                cellStyleFocused={styles.focused}
                animated={false}
                ref={ref}
                password
                {...props}
            />
        )

    }
)

const styles= StyleSheet.create({
    container: {
        justifyContent: "center",
        width: "100%"
    },
    text: {
        fontFamily: Typography.content.fontFamily.bold
    },
    cell: {
        borderRadius: 10,
        height: 50,
        width: 50
    },
    filled: {
        backgroundColor: Colors.filledGrey
    },
    outline: {
        borderColor: Colors.midGrey,
        borderWidth: 1,
        borderStyle: "solid"
    },
    focused: {
        borderColor: Colors.night,
        borderWidth: 1.5,
        borderStyle: "solid"
    },
    error: {
        borderColor: Colors.error,
        borderWidth: 1.5,
        borderStyle: "solid"
    }
})