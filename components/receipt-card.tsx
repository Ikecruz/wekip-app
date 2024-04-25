import Colors from "@/constants/Colors";
import Typography from "@/constants/Typography";
import { GroupedReceipt, Receipt } from "@/interfaces/receipts.interface";
import React, { forwardRef } from "react";
import { Image, StyleSheet, Text, View, ViewProps } from "react-native";
import { encodeData } from "@/services/utils.service";
import moment from "moment";
import { TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";

interface Props extends ViewProps {
    receiptGroup: GroupedReceipt
}

interface SingleProps extends ViewProps {
    receipt: Receipt
}

export const SingleTransaction = forwardRef<View, SingleProps>(
    (props, ref): React.ReactElement => {

        const { receipt } = props

        const router = useRouter()

        return (
            <TouchableOpacity activeOpacity={0.7} /* onPress={() => router.push(`/transaction/${encodeData(receipt)}`)} */>
                <View style={styles.single}>
                    <Image
                        source={{ uri: receipt.business.logo }}
                        style={styles.item_image}
                    />
                    <View style={styles.type_time_display}>
                        <Text style={styles.type}>{receipt.business.name}</Text>
                        <Text style={styles.time}>{moment(receipt.created_at).format("HH:mm")}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
)

export const GroupDate = ({
    date
}: {
    date: string
}) => {

    return <View style={styles.group_date_contain}>
        <Text style={styles.group_date}>{moment(date).format("dddd, Do MMM YYYY")}</Text>
    </View>

}

export const TransactionGroupCard = forwardRef<View, Props>(
    (props, ref): React.ReactElement => {

        const {
            receiptGroup: { date, receipts }
        } = props

        return (
            <View style={styles.group_container}>
                <GroupDate date={date} />
                <View style={styles.group}>
                    {
                        receipts.map(receipt => (
                            <SingleTransaction
                                receipt={receipt}
                                key={receipt.id}
                            />
                        ))
                    }
                </View>
            </View>
        )

    }
)

const styles = StyleSheet.create({
    group_container: {
        gap: 5
    },
    group_date: {
        fontFamily: Typography.content.fontFamily.regular,
        fontSize: Typography.content.size.extraSmall,
        color: Colors.darkGrey
    },
    group_date_contain: {
        backgroundColor: Colors.white,
        paddingVertical: 12
    },
    group: {
        gap: 10
    },
    single: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        width: "100%"
    },
    type_time_display: {
        flex: 1,
        gap: 5
    },
    type: {
        textTransform: "capitalize",
        fontFamily: Typography.content.fontFamily.bold,
        fontSize: Typography.content.size.small - 2,
    },
    time: {
        fontFamily: Typography.content.fontFamily.regular,
        fontSize: Typography.content.size.small - 2,
        color: Colors.darkGrey
    },
    amount_container: {
        width: "auto",
    },
    amount_text: {
        fontFamily: Typography.content.fontFamily.bold,
        fontSize: Typography.content.size.small,
        color: Colors.dark
    },
    item_image: {
        height: 40,
        width: 40,
        borderRadius: 100,
        // resizeMode: "fill"
    },
})