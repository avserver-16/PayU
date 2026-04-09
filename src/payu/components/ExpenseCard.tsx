import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";

type Props = {
    style?: ViewStyle;
    title?: string;
    description?: string;
    price?: string;
    colors?: string[];
};

const ExpenseCard = ({ style, title, description, price, colors = ["#192D29", "#262626", "#0A0A0A"] }: Props) => {
    return (
        <LinearGradient
            colors={colors as [string, string, string]}
            start={{ x: 0, y: 0.3 }}
            end={{ x: 0.8, y: 1 }}
            style={[styles.container, style]}
        >
            <LinearGradient
                colors={["#FAFAFA26", "transparent"]}
                style={{ position: 'absolute', top: 0, left: 0, height: 10, width: '100%' }}
            />
            <LinearGradient
                colors={["transparent", "#FAFAFA26"]}
                style={{ position: 'absolute', bottom: 0, left: 0, height: 15, width: '100%' }}
            />
            <LinearGradient
                colors={["transparent", "#FAFAFA26"]}
                style={{ position: 'absolute', bottom: 0, left: 0, height: '100%', width: 10 }}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 1 }}
            />
            <LinearGradient
                colors={["#FAFAFA26", "transparent"]}
                style={{ position: 'absolute', bottom: 0, right: 0, height: '100%', width: 10 }}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 1 }}
            />
            <View style={{ padding: 16 ,flexDirection:'row',gap:12,alignItems:'center'}}>
                <Image source={require("../../../styles/Banklogo.png")} style={{ width: 24, height: 24 }} />
                <View style={styles.content}>
                    <View style={{ gap: 8 }}>
                        <Text style={styles.bankName}>{title?.toUpperCase() || 'FOOD'}</Text>
                        <Text style={styles.description}>{description || 'Lesser than last week'}</Text>
                    </View>
                    <View style={{flexDirection:'row',gap:16 ,left:-40}}>
                        <Ionicons name="star-outline" size={16} color="#FAFAFA" style={{top:8}}/>
                        <TouchableOpacity style={{ alignItems: 'flex-end',padding:8,backgroundColor:"#262626",borderRadius:8 }}>
                            <Text style={styles.amount}>{price || '₹2,500'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
};

export default ExpenseCard;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // padding: 16,
        width: "100%",
        minHeight: 80,
        borderRadius: 16,
        borderWidth: 0.5,
        borderColor: '#262626',
        overflow: 'hidden'
    },
    bankName: {
        fontSize: 16,
        // fontWeight: "bold",
        color: "#FAFAFA",
    },
    description: {
        fontSize: 14,
        color: "#A1A1A1",
        textAlign: "left",
    },
    amount: {
        fontSize: 14,
        color: "#FFFFFF",
        textAlign: "left",
        fontWeight: "bold",
    },
    content: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
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
