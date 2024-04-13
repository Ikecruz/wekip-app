import { forwardRef } from "react";
import { TextInput as DefaultTextInput } from "react-native";
import { InputProps } from ".";
import { TextInput } from "./text-input"

interface Props extends InputProps {
    icon?: React.JSX.Element,
    balance?: string,
    rightComponent?: React.JSX.Element,
}

export const NumberInput = forwardRef<DefaultTextInput, Props>(
    (props, ref) => {
        return (
            <TextInput
                keyboardType="phone-pad"
                ref={ref}
                {...props}
            />
        )
    }
)