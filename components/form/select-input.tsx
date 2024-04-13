import Colors from "@/src/constants/Colors";
import Typography from "@/src/constants/Typography";
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Text, StyleSheet, View, TextStyle, TouchableOpacity, TouchableOpacityProps, Keyboard, ViewStyle } from "react-native";
import { BottomSlider } from "../misc";
import { EvilIcons, Fontisto } from "@expo/vector-icons";
import { Image } from "expo-image";
import { formatText, formatter } from "@/src/utils";
import uuid from 'react-native-uuid';
import PureView from "../misc/pure-view";
import { TextInput } from "./text-input";
import PureSelectItem from "./pure-select-item";

export interface SelectItem {
    value: string;
    label: string;
    disabled?: boolean;
    selected?: boolean;
    [key: string]: any;
}

interface SelectProps<Item, Value> extends TouchableOpacityProps {
    variant?: "filled" | "outline";
    label?: string;
    placeholder?: string;
    error?: string;
    labelStyle?: TextStyle;
    data: ReadonlyArray<string | Item>;
    value?: Value;
    onChange?: (value: Value) => void;
    itemComponent?: React.FC<SelectItem>;
    selectComponent?: React.FC<SelectItem>;
    nothingFound?: string;
    balance?: string;
    snapPoints?: string[],
    searchable?: boolean,
    containerStyle?: ViewStyle
}

function isSelectItem(obj: any): obj is SelectItem {
    return typeof obj === 'object' && obj !== null && 'value' in obj;
}

export const SelectInput = forwardRef<TouchableOpacity, SelectProps<SelectItem, string>>(
    (props, ref): React.ReactElement => {

        const {
            label,
            error,
            variant = "filled",
            labelStyle,
            placeholder,
            value,
            data,
            onChange,
            itemComponent,
            selectComponent: SelectComponent,
            nothingFound,
            balance,
            snapPoints,
            searchable,
            containerStyle,
            ...otherProps
        } = props

        const [innerValue, setInnerValue] = useState<string | null>(null)

        useEffect(() => {
            setInnerValue(value || null)
        }, [value])

        const bottomSliderRef = useRef<BottomSheetModal>(null)

        const open = () => {
            bottomSliderRef.current?.present()
            Keyboard.dismiss()
        }

        const handleValueChange = (item: string) => {
            setInnerValue(item)

            if (onChange && typeof onChange === "function")
                onChange(item);

            bottomSliderRef.current?.dismiss()
        }

        const [keyword, setKeyword] = useState("")

        const filteredData = useMemo(() => {
            return data.filter((option) => {
                const labelProp = isSelectItem(option) ? option.label : option;
                const valueProp = isSelectItem(option) ? option.value : option;
                return labelProp.toLowerCase().includes(keyword.toLowerCase()) ||
                    valueProp.toLowerCase().includes(keyword.toLowerCase())
            })
        }, [data, keyword])

        const keyExtractor = useCallback(() => uuid.v4().toString(), [])

        const itemSeperator = useCallback(() => <View style={styles.divider} />, [])

        const listEmpty = useCallback(() =>
            <View style={styles.nothing_found_container}>
                <Text style={styles.nothing_found_text}>{nothingFound ? nothingFound : "Nothing Found"}</Text>
            </View>
            , []);

        return <>
            <View style={[styles.container, containerStyle]}>
                {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
                <TouchableOpacity
                    ref={ref}
                    onPress={open}
                    activeOpacity={0.7}
                    {...otherProps}
                >
                    <View
                        style={[
                            styles.base,
                            styles[variant],
                            error !== undefined && styles.error
                        ]}
                    >
                        <View style={styles.input}>
                            <View style={styles.select_container}>
                                {
                                    placeholder && !innerValue &&
                                    <Text style={styles.placeholder}>{placeholder}</Text>
                                }
                                {
                                    innerValue &&
                                    <>
                                        {
                                            SelectComponent ?
                                                <SelectComponent {...(data as SelectItem[]).find((value) => value.value === innerValue) as SelectItem} /> :
                                                <Text style={styles.value}>{data.every((value) => typeof value === "string") ? formatText(innerValue) : formatText((data as SelectItem[]).find((value) => value.value === innerValue)!.label)}</Text>
                                        }
                                    </>
                                }
                            </View>
                            <View style={styles.arrow_container}>
                                <EvilIcons name="chevron-down" size={24} color="black" />
                            </View>
                        </View>
                        {
                            balance !== undefined &&
                            <View style={styles.balance_contain}>
                                <Text style={styles.balance_text}>Balance: {formatter.format(parseFloat(balance))}</Text>
                            </View>
                        }
                    </View>
                </TouchableOpacity>
                {error && <Text style={[styles.errorText, labelStyle]}>{error}</Text>}
            </View>
            <BottomSlider
                snapPoints={snapPoints || ["50%", "75%"]}
                ref={bottomSliderRef}
                animateOnMount
            >
                <BottomSheetFlatList
                    data={filteredData}
                    ListHeaderComponent={searchable ?
                        <View style={styles.search_container}>
                            <TextInput
                                value={keyword}
                                onChangeText={(value) => setKeyword(value)}
                                placeholder="Search options"
                                icon={
                                    <Fontisto name="search" size={20} color={Colors.darkGrey} />
                                }
                            />
                        </View>
                        : null}
                    stickyHeaderIndices={searchable ? [0] : undefined}
                    renderItem={(item) => <PureSelectItem
                        item={item.item}
                        onSelect={handleValueChange}
                        specialComponent={itemComponent}
                    />}
                    keyExtractor={keyExtractor}
                    ItemSeparatorComponent={itemSeperator}
                    ListEmptyComponent={listEmpty}
                    removeClippedSubviews={true}
                    initialNumToRender={7}
                    maxToRenderPerBatch={7}
                    updateCellsBatchingPeriod={1500}
                    showsVerticalScrollIndicator={false}
                    disableScrollViewPanResponder={true}
                    // keyboardShouldPersistTaps={'always'}
                    keyboardDismissMode="none"
                />
            </BottomSlider>
        </>

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
    input: {
        height: "auto",
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    select_container: {
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
    label: {
        fontFamily: Typography.content.fontFamily.regular,
        textTransform: "capitalize"
    },
    placeholder: {
        fontFamily: Typography.content.fontFamily.regular,
        color: Colors.darkGrey
    },
    value: {
        fontFamily: Typography.content.fontFamily.regular,
        textTransform: "capitalize"
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
    },
    item_controller: {
        paddingVertical: 10
    },
    divider: {
        borderColor: Colors.filledGrey,
        borderBottomWidth: 1,
        borderStyle: "solid"
    },
    item: {
        height: 50,
        justifyContent: "center",
        width: "100%",
        paddingHorizontal: 10,
    },
    item_text: {
        fontFamily: Typography.content.fontFamily.bold,
        textTransform: "capitalize"
    },
    nothing_found_container: {
        alignItems: "center",
        justifyContent: "center",
        height: 150,
        width: "100%",
    },
    nothing_found_text: {
        fontFamily: Typography.content.fontFamily.bold
    },
    search_container: {
        backgroundColor: "white",
        paddingVertical: 5
    }
})