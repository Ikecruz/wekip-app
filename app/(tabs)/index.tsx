import { Keyboard, Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {SafeView } from "@/components/misc/safe-view";
import Typography from "@/constants/Typography";
import Colors from "@/constants/Colors";
import { ActionIcon, Button } from "@/components/buttons";
import { Entypo, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
// import { useEonace } from "@/src/contexts/eonace.context";
import { useAuth } from "@/contexts/auth.context";
import { Href, Link, router } from "expo-router";
// import { TransactionIcon } from "@/src/components/transaction";
// import { GroupedTransaction, Transaction, TransactionType } from "@/src/interface/transaction.interface";
// import { BottomSheetModal, TouchableOpacity } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
// import { makePrivateApiCall } from "@/src/api/api-request";
import { AxiosError, AxiosResponse } from "axios";
// import { AxiosResponseMessage } from "@/src/interface/axios.interface";
// import { PaginatedResult } from "@/src/interface/paginated-result.interface";
// import { TransactionGroupCard } from "@/src/components/transaction/transaction-card";
// import { NothingFound } from "@/src/components/feedback/nothing-found";
// import { User } from "@/src/interface/user.interface";
import { useEffect, useMemo, useRef } from "react";

export default function HomeScreen() {

    const { authData, signIn, signOut } = useAuth()

    // const {
    //     data: transactions,
    //     refetch: refetchTransactions,
    //     isRefetching: isTransactionRefetching
    // } = useQuery<unknown, AxiosResponse<AxiosResponseMessage>, PaginatedResult<GroupedTransaction>, any>({
    //     queryKey: ['getRecentTransactions'],
    //     queryFn: async () => await makePrivateApiCall({
    //         url: `/user/transactions?limit=6`,
    //         method: "GET",
    //         token: authData!.token,
    //         signOut
    //     }),
    //     refetchOnReconnect: 'always'
    // })

    // const {
    //     data: user,
    //     isSuccess: isUserFetched,
    //     refetch: refetchUser,
    //     isRefetching: isUserRefetching
    // } = useQuery<unknown, AxiosResponse<AxiosResponseMessage>, User, any>({
    //     queryKey: ['getUser'],
    //     queryFn: async () => await makePrivateApiCall({
    //         url: "/user/profile",
    //         method: "GET",
    //         token: authData!.token,
    //         signOut
    //     }),
    //     enabled: false
    // })

    // const refetchData = async () => await Promise.all([refetchTransactions(), refetchUser()]);

    // const isRefetching = useMemo(() => {
    //     if (isUserRefetching && isTransactionRefetching)
    //         return true

    //     return false
    // }, [isUserRefetching, isTransactionRefetching])

    // useEffect(() => {
    //     if (isUserFetched) {
    //         signIn({
    //             ...authData!,
    //             account_balance: user.account_balance,
    //             username: user.username
    //         })
    //     }
    // }, [user])

    return <>
        <SafeView>
            <ScrollView
                style={styles.container}
                // refreshControl={
                //     <RefreshControl
                //         refreshing={isRefetching}
                //         onRefresh={refetchData}
                //         tintColor={Colors.dark}
                //         colors={[Colors.dark]}
                //     />
                // }
                contentInset={{
                    bottom: 30,
                    top: 0
                }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    paddingBottom: Platform.OS === "android" ? 30 : 0
                }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.nav_header}>
                    <Text style={styles.intro}>
                        Hi{" "}
                        <Text style={styles.username}>{authData?.username}</Text>
                        {" "}
                    </Text>
                </View>

                <View style={styles.stats_container}>
                    <View style={[styles.stats_box, {backgroundColor: Colors.indigo + "15"}]}>
                        <Ionicons name="receipt-outline" size={24} color={Colors.dark} />
                        <View style={{gap: 3}}>
                            <Text style={styles.key}>Receipts Saved</Text>
                            <Text style={styles.value}>0</Text>
                        </View>
                    </View>
                    <View style={[styles.stats_box, {backgroundColor: Colors.lime + "15"}]}>
                        <MaterialIcons name="business-center" size={24} color={Colors.dark} />
                        <View style={{gap: 3}}>
                            <Text style={styles.key}>Businesses</Text>
                            <Text style={styles.value}>0</Text>
                        </View>
                    </View>
                </View>

                {/* <View style={styles.balance_box}>
                    <EonaceArrow
                        height={200}
                        width={200}
                        color={Colors.white}
                        style={styles.balance_box_arrow_1}
                        opacity={0.08}
                    />
                    <EonaceArrow
                        height={200}
                        width={200}
                        color={Colors.white}
                        style={styles.balance_box_arrow_2}
                        opacity={0.08}
                    />
                    <Text style={styles.available_balance_text}>Available Balance</Text>
                    <BalanceText privacyMode={privacyMode}>
                        {formatter.format(parseInt(authData?.account_balance || "0"))}
                    </BalanceText>
                    <ActionIcon onPress={changePrivacyMode}>
                        <Entypo color={Colors.white} name={privacyMode ? "eye" : "eye-with-line"} size={18} />
                    </ActionIcon>
                </View> */}


                <View style={styles.recent_activities_container}>
                    <View style={styles.recent_activities_name_container}>
                        <Text style={styles.shortcut_header}>Recent Activities</Text>
                        {/* <Link href="/(tabs)/transactions" asChild>
                            <TouchableOpacity>
                                <Text style={styles.link}>See all</Text>
                            </TouchableOpacity>
                        </Link> */}
                    </View>
                    {/* {
                        transactions && <>
                            {
                                transactions.results.length > 0 ?
                                    <View style={styles.recent_activities}>
                                        {
                                            transactions.results.map(transactionsGroup => (
                                                <TransactionGroupCard
                                                    transactionGroup={transactionsGroup}
                                                    key={transactionsGroup.date}
                                                />
                                            ))
                                        }
                                    </View> :
                                    <NothingFound
                                        message="No transaction records for the past year"
                                        action={() => router.push("/(tabs)/transactions")}
                                        actionPlaceHolder="View More"
                                    />
                            }
                        </>
                    } */}
                </View>

            </ScrollView>
        </SafeView>
    </>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 20,
        paddingTop: 15
    },
    nav_header: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    intro: {
        fontFamily: Typography.content.fontFamily.regular,
        fontSize: Typography.content.size.small + 1
    },
    username: {
        color: Colors.dark,
        fontFamily: Typography.content.fontFamily.bold,
    },
    balance_box: {
        backgroundColor: Colors.dark,
        borderRadius: 10,
        height: 200,
        padding: 20,
        marginVertical: 15,
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        gap: 2
    },
    available_balance_text: {
        fontFamily: Typography.content.fontFamily.regular,
        fontSize: Typography.content.size.small - 1,
        color: Colors.white
    },
    shortcut_container: {
        marginVertical: 25,
        gap: 10
    },
    shortcut_header: {
        fontFamily: Typography.content.fontFamily.bold,
        fontSize: Typography.content.size.small,
    },
    shortcut: {
        gap: 5,
        alignItems: "center",
        width: 73
    },
    shortcut_text: {
        fontFamily: Typography.content.fontFamily.regular,
        fontSize: Typography.content.size.extraSmall,
        textAlign: "center"
    },
    recent_activities_container: {
        gap: 10
    },
    recent_activities_name_container: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    link: {
        fontFamily: Typography.content.fontFamily.regular,
        fontSize: Typography.content.size.extraSmall,
        color: Colors.dark
    },
    recent_activities: {
        gap: 5
    },
    deposit_methods_contain: {
        gap: 8
    },
    minor_product_card: {
        flexDirection: "row",
        gap: 15,
        alignItems: "center",
        marginBottom: 8
    },
    divider: {
        borderColor: Colors.filledGrey,
        borderBottomWidth: 1,
        borderStyle: "solid"
    },
    stats_container: {
        gap: 10,
        marginVertical: 15
    },
    stats_box: {
        width: "100%",
        backgroundColor: "red",
        padding: 20,
        borderRadius: 10,
        flexDirection: "row",
        gap: 15,
        alignItems: "center"
    },
    key: {
        fontFamily: Typography.content.fontFamily.bold,
    },
    value: {
        fontFamily: Typography.headline.fontFamily.regular,
    }
});
