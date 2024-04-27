import Colors from "@/constants/Colors";
import Typography from "@/constants/Typography";
import { FontAwesome5 } from "@expo/vector-icons";
import { forwardRef } from "react"
import { StyleSheet, Text, View, ViewProps } from "react-native"
import { Button } from "../buttons";

interface Props extends ViewProps {
    message: string;
    actionPlaceHolder?: string;
    action?: () => void
}

export const NothingFound = forwardRef<View, Props>(
    (props, ref): React.JSX.Element => {

        const { message, actionPlaceHolder, action } = props

        return(
            <View
                ref={ref}
                style={styles.container}
            >
                <FontAwesome5 name="inbox" size={70} color={Colors.midGrey} />
                <Text style={styles.text}>
                    {message}
                </Text>
                {
                    action &&
                    <Button 
                        onPress={() => action()}
                        variant="outline"
                    >
                        {actionPlaceHolder!}
                    </Button>
                }
            </View>
        )

    }
)

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: 20,
        paddingVertical: 50,
        gap: 15,
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        fontFamily: Typography.content.fontFamily.regular,
        color: Colors.darkGrey,
        flex: 1,
        textAlign: "center"
    },
})