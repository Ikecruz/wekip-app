import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SelectItem } from "./select-input";
import Typography from "@/src/constants/Typography";

function isSelectItem(obj: any): obj is SelectItem {
    return typeof obj === 'object' && obj !== null && 'value' in obj;
}

interface Props {
    item: string | SelectItem;
    specialComponent?: React.FC<SelectItem>;
    onSelect: (value: string) => void
}

export default class PureSelectItem extends React.PureComponent<Props> {

    constructor(props: Props) {
        super(props);
    }

    render(): React.ReactNode {

        const { item, specialComponent: SpecialComponent, onSelect } = this.props

        return (
            <TouchableOpacity
                onPress={() => onSelect(isSelectItem(item) ? item.value : item)}
                style={styles.controller}
                activeOpacity={0.8}
            >
                {
                    SpecialComponent ?
                        <SpecialComponent {...item as SelectItem} /> :
                        <View style={styles.item}>
                            <Text style={styles.item_text}>{isSelectItem(item) ? item.label : item}</Text>
                        </View>
                }
            </TouchableOpacity>
        );

    }
}

const styles = StyleSheet.create({
    controller: {
        paddingVertical: 10
    },
    item: {
        height: 40,
        justifyContent: "center",
        width: "100%",
        paddingHorizontal: 10,
    },
    item_text: {
        fontFamily: Typography.content.fontFamily.bold,
        textTransform: "capitalize"
    },
})