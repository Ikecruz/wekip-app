import { Keyboard, Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {SafeView } from "@/components/misc/safe-view";
import Typography from "@/constants/Typography";
import Colors from "@/constants/Colors";
import { ActionIcon, Button } from "@/components/buttons";
import { Entypo, Feather, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/auth.context";
import { Href, Link, router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useEffect, useMemo, useRef } from "react";
import { AxiosResponseMessage } from "@/services/axios.service";
import { makePrivateApiCall } from "@/services/api.service";
import { PaginatedResult } from "@/interfaces/pagination.interface";
import { GroupedReceipt } from "@/interfaces/receipts.interface";
import { ReceiptGroupCard } from "@/components/receipt-card";
import { NothingFound } from "@/components/misc/nothing-found";

export default function HomeScreen() {

    const { authData, signOut } = useAuth()

    const {
        data: receipts,
        refetch: refetchReceipts,
        isRefetching: isReceiptRefetching
    } = useQuery<unknown, AxiosResponse<AxiosResponseMessage>, PaginatedResult<GroupedReceipt>, any>({
        queryKey: ['getRecentReceipts'],
        queryFn: async () => await makePrivateApiCall({
            url: `/receipt?limit=6`,
            method: "GET",
            token: authData!.token,
            signOut
        }),
        refetchOnReconnect: 'always'
    })

    const {
        data: stats,
        isSuccess: isStatsFetched,
        refetch: refetchStats,
        isRefetching: isStatsRefetching
    } = useQuery<unknown, AxiosResponse<AxiosResponseMessage>, any, any>({
        queryKey: ['getStats'],
        queryFn: async () => await makePrivateApiCall({
            url: "/receipt/stats",
            method: "GET",
            token: authData!.token,
            signOut
        }),
        // enabled: false
    })

    const refetchData = async () => await Promise.all([refetchReceipts(), refetchStats()]);

    const isRefetching = useMemo(() => {
        if (isStatsRefetching && isReceiptRefetching)
            return true

        return false
    }, [isStatsRefetching, isReceiptRefetching])

    return <>
        <SafeView>
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetchData}
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
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.nav_header}>
                    <Text style={styles.intro}>
                        Hi{" "}
                        <Text style={styles.username}>{authData?.username}</Text>
                        {" "}
                    </Text>
                    <ActionIcon onPress={signOut}>
                        <Feather name="power" size={20} color={Colors.dark} />
                    </ActionIcon>
                </View>

                <View style={styles.stats_container}>
                    <View style={[styles.stats_box, {backgroundColor: Colors.indigo + "15"}]}>
                        <Ionicons name="receipt-outline" size={24} color={Colors.dark} />
                        <View style={{gap: 3}}>
                            <Text style={styles.key}>Receipts Saved</Text>
                            <Text style={styles.value}>{stats?.receipts}</Text>
                        </View>
                    </View>
                    <View style={[styles.stats_box, {backgroundColor: Colors.lime + "15"}]}>
                        <MaterialIcons name="business-center" size={24} color={Colors.dark} />
                        <View style={{gap: 3}}>
                            <Text style={styles.key}>Businesses</Text>
                            <Text style={styles.value}>{stats?.businesses}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.recent_activities_container}>
                    <View style={styles.recent_activities_name_container}>
                        <Text style={styles.shortcut_header}>Recent Activities</Text>
                        <Link href="/(tabs)/receipts" asChild>
                            <TouchableOpacity>
                                <Text style={styles.link}>See all</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                    {
                        receipts && <>
                            {
                                receipts.results.length > 0 ?
                                    <View style={styles.recent_activities}>
                                        {
                                            receipts.results.map(receiptsGroup => (
                                                <ReceiptGroupCard
                                                    receiptGroup={receiptsGroup}
                                                    key={receiptsGroup.date}
                                                />
                                            ))
                                        }
                                    </View> :
                                    <NothingFound
                                        message="No receipt records for the past year"
                                        action={() => router.push("/(tabs)/receipts")}
                                        actionPlaceHolder="View More"
                                    />
                            }
                        </>
                    }
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
