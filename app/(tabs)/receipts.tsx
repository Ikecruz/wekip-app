// import { makePrivateApiCall } from "@/api/api-request";
// import { Loader } from "@/src/components/feedback/loader";
import { NothingFound } from "@/components/misc/nothing-found";
import { BottomSlider } from "@/components/misc/bottom-slider";
import { GroupDate, SingleReceipt } from "@/components/receipt-card";
import Colors from "@/constants/Colors";
import { useAuth } from "@/contexts/auth.context";
// import { AxiosResponseMessage } from "@/interface/axios.interface";
import { PaginatedResult } from "@/interfaces/pagination.interface";
// import { formatText } from "@/src/utils";
import { Octicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import moment from "moment";
import { useRef, useState } from "react";
import { Platform, RefreshControl, SectionList, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Dates, TimeFrame } from "@/components/misc/timeframe";
import { AxiosResponseMessage } from "@/services/axios.service";
import { GroupedReceipt } from "@/interfaces/receipts.interface";
import { makePrivateApiCall } from "@/services/api.service";
import { TextInput } from "@/components/form";

export default function Receipts() {

    const bottomSliderRef = useRef<BottomSheetModal>(null)

    const { authData, signOut } = useAuth()

    const [refreshByControl, setRefreshByControl] = useState(false)

    const defaultDate = {
        start: moment().subtract(1, "years").toDate(),
        end: new Date()
    }

    const [dates, setDates] = useState<Dates>(defaultDate);

    const [search, setSearch] = useState("")

    const {
        data: receipts,
        refetch: refetchTransactions,
        isRefetching,
        isFetching,
        isLoading
    } = useQuery<unknown, AxiosResponse<AxiosResponseMessage>, PaginatedResult<GroupedReceipt>, any>({
        queryKey: ['getAllReceipts', dates, search],
        queryFn: async () => await makePrivateApiCall({
            url: `/receipt?start_date=${dates?.start}&end_date=${dates?.end}&search=${search}`,
            method: "GET",
            token: authData!.token,
            signOut,
        }),
    })

    const closeDateInput = (dates: Dates) => {
        setDates(dates)
        bottomSliderRef.current?.close()
    }

    return <>
        {/* <Loader active={isFetching && !isRefetching} /> */}
        <View
            style={styles.container}
        >
            <View style={styles.filter_contain}>
                <View style={styles.filter_group}>
                    <TextInput 
                        placeholder="Search Business"
                        value={search}
                        onChangeText={setSearch}
                        containerStyle={{flex: 1}}
                    />
                </View>
                <TouchableOpacity
                    style={styles.filter_button}
                    activeOpacity={0.6}
                    onPress={() => bottomSliderRef.current?.present()}
                >
                    <Octicons name="filter" size={20} color={Colors.dark} />
                </TouchableOpacity>
            </View>
            {/* {
                transactions && */}
            <SectionList
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching && refreshByControl}
                        onRefresh={async () => {
                            setRefreshByControl(true)
                            await refetchTransactions()
                            setRefreshByControl(false)
                        }}
                        tintColor={Colors.dark}
                        colors={[Colors.dark]}
                    />
                }
                contentInset={{
                    bottom: 30,
                    top: 0
                }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    paddingBottom: Platform.OS === "android" ? 30 : 0
                }}
                sections={receipts?.results.map((receipt) => ({ date: receipt.date, data: receipt.receipts })) || []}
                refreshing={isRefetching}
                renderItem={({ item }) => (
                    <SingleReceipt
                        receipt={item}
                    />
                )}
                renderSectionHeader={({ section: { date } }) => (
                    <GroupDate date={date} />
                )}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                    <NothingFound
                        message={
                            JSON.stringify(defaultDate) === JSON.stringify(dates) ?
                            "No receipt records for the past year" :
                            "No receipt records for the selected date range"
                        }
                        action={() => bottomSliderRef.current?.present()}
                        actionPlaceHolder="View More"
                    />
                }
                ItemSeparatorComponent={() =>
                    <View style={{ height: 10 }} />
                }
                SectionSeparatorComponent={() =>
                    <View style={{ height: 5 }} />
                }
            />
            {/* } */}
        </View>
        <BottomSlider
            snapPoints={["45%"]}
            ref={bottomSliderRef}
            animateOnMount
        >
            <TimeFrame
                dates={dates}
                finish={(dates) => closeDateInput(dates)}
            />
        </BottomSlider>
    </>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 20,
    },
    filter_contain: {
        flexDirection: "row",
        gap: 7,
        alignItems: "center",
        marginVertical: 5
    },
    filter_group: {
        flex: 1,
        gap: 5,
        display: "flex",
        flexDirection: "row"
    },
    filter_input: {
        height: 40,
        flex: 1
    },
    filter_button: {
        height: 45,
        width: 40,
        borderRadius: 5,
        // backgroundColor: Colors.blue,
        justifyContent: "center",
        alignItems: "center"
    },
    transactions: {
        gap: 20,
        marginTop: 10
    }
});
