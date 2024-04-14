import Colors from "@/constants/Colors";
import { forwardRef } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface Props extends TouchableOpacityProps{
    children: JSX.Element;
    compact?: boolean;
    loading?: boolean;
}

export const ActionIcon = forwardRef<TouchableOpacity, Props>(
    (props, ref) => {

        const { children, compact, loading, ...otherProps } = props

        return(
            <TouchableOpacity style={[styles.button, compact && {width: "auto"}]} ref={ref} {...otherProps}>
                { 
                    loading ?
                    <ActivityIndicator color={Colors.night} /> :
                    children
                }
            </TouchableOpacity>
        )
    }
)

const styles = StyleSheet.create({
    button: {
        height: 30,
        width: 30,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center"
    }
})