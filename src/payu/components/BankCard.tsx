import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, View, ViewStyle } from "react-native";

type Props = {
    style?: ViewStyle;
};

const BankCard = ({ style }: Props) => {
    return (
        <LinearGradient
            colors={["#FED4B4", "#3BB9A1"]}
            start={{ x: 0, y: 0.3 }}
            end={{ x: 0.8, y: 1 }}
            style={[styles.container, style]}
        >
            <View style={styles.content}>
                <Text style={styles.bankName}>ADRBank</Text>
                <Image source={require("../../../styles/Banklogo.png")} style={{ width: 24, height: 24 }} />
            </View>
            <View style={styles.cardNumberContainer}>
                <Text style={styles.cardNumber}>8763 1111 2222 0329</Text>
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.expiryContainer}>
                    <Text style={styles.label}>Card Holder Name</Text>
                    <Text style={styles.value}>Alex</Text>
                </View>

                <View style={styles.cvvContainer}>
                    <Text style={styles.label}>Expired Date</Text>
                    <Text style={styles.value}>10/28</Text>
                </View>
            </View>
        </LinearGradient>
    );
};

export default BankCard;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        padding: 24,
        width: "100%",
        minHeight: 200,
        borderRadius: 16
    },
    bankName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FAFAFA",
    },
    label: {
        fontSize: 12,
        color: "#FFFFFF",
        textAlign: "left",
    },
    value: {
        fontSize: 14,
        color: "#FFFFFF",
        textAlign: "left",
        fontWeight: "bold",
    },
    content: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",

    },
    cardNumberContainer: {
        // flex: 1,
        justifyContent: "center",
        // alignItems: "center",
        flexDirection: "row",
        textAlign: 'left',
        alignSelf: 'flex-start',
        paddingVertical: 48
    },
    cardNumber: {
        fontSize: 24,
        color: "#FFFFFF",
        textAlign: "left",
        fontWeight: "bold",
    },
    infoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    expiryContainer: {
        alignItems: "flex-start",
    },

    cvvContainer: {
        alignItems: "flex-start",
    },
});
