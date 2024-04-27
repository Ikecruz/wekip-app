import Colors from "@/constants/Colors"
import Typography from "@/constants/Typography"
import { FontAwesome } from "@expo/vector-icons"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ActionIcon, Button } from "../buttons"
import { useState } from "react"
import moment from "moment"
import RNDateTimePicker from "@react-native-community/datetimepicker"

interface Props {
    dates: Dates;
    finish: (dates: Dates) => void
}

export interface Dates {
    start: Date,
    end: Date
}

const setTime = (date: Date, picker: string) => {
    let finalDate = date;
    if (picker === "end") {
        var m = moment(date).utcOffset(0);
        m.set({ hour: 23, minute: 59, second: 59 })
        finalDate = m.toDate()
    } else {
        var m = moment(date).utcOffset(0);
        m.set({ hour: 0, minute: 0, second: 0 })
        finalDate = m.toDate()
    }

    return finalDate;
}

export const TimeFrame = ({
    dates: datesFromParent,
    finish
}: Props) => {

    const [currentPicker, setCurrentPicker] = useState<"start" | "end" | null>(null);

    const [dates, setDates] = useState<Dates>(datesFromParent)

    return <>

        <View style={styles.container}>
            {
                currentPicker ?
                    <>
                        <Text style={styles.sheet_header}>{currentPicker} Date</Text>
                        <RNDateTimePicker
                            value={dates[currentPicker]}
                            mode="date"
                            display="spinner"
                            themeVariant="light"
                            minimumDate={currentPicker === "start" ? new Date(2021, 0, 1) : dates.start}
                            maximumDate={new Date()}
                            onChange={(event, date) => {
                                setDates({
                                    ...dates,
                                    [currentPicker]: setTime(date!, currentPicker)
                                })
                            }}
                        />
                        <Button fullWidth style={{ marginTop: 10 }} onPress={() => setCurrentPicker(null)}>
                            Continue
                        </Button>

                    </> :
                    <>
                        <Text style={styles.sheet_header}>Choose a timeframe to view more transactions</Text>
                        <View style={styles.inputs_container}>
                            <View style={styles.input_group}>
                                <Text style={styles.label}>Start Date</Text>
                                <TouchableOpacity onPress={() => setCurrentPicker("start")}>
                                    <View style={styles.input}>
                                        <Text style={styles.value_display}>{moment(dates.start).format("DD MMM, YYYY")}</Text>
                                        <FontAwesome name="angle-right" size={24} color="black" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.input_group}>
                                <Text style={styles.label}>End Date</Text>
                                <TouchableOpacity onPress={() => setCurrentPicker("end")}>
                                    <View style={styles.input}>
                                        <Text style={styles.value_display}>{moment(dates.end).format("DD MMM, YYYY")}</Text>
                                        <FontAwesome name="angle-right" size={24} color="black" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <Button fullWidth style={{ marginTop: 20 }} onPress={() => finish(dates)}>
                                Finish
                            </Button>
                        </View>
                    </>
            }
        </View>

    </>

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sheet_header: {
        fontFamily: Typography.content.fontFamily.bold,
        fontSize: Typography.content.size.small,
        marginBottom: 20,
        textTransform: "capitalize"
    },
    inputs_container: {
        gap: 10,
    },
    input_group: {
        width: "100%",
        gap: 10
    },
    label: {
        fontFamily: Typography.content.fontFamily.regular,
        fontSize: Typography.content.size.small
    },
    input: {
        width: "100%",
        height: 50,
        borderRadius: 5,
        paddingHorizontal: 15,
        flexDirection: "row",
        gap: 15,
        alignItems: "center",
        backgroundColor: Colors.filledGrey
    },
    value_display: {
        fontFamily: Typography.content.fontFamily.regular,
        fontSize: Typography.content.size.extraSmall,
        flex: 1,
    },
    picker_button_container: {
        flexDirection: "row",
        gap: 10
    }
})