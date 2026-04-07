import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import Logo from "../../../styles/Logo";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

type Props = {
    title?: string;
    onBackPress?: () => void;
    rightComponent?: React.ReactNode;
    showBack?: boolean;
};

const Header = ({
    title = "",
}: Props) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>

            <View style={styles.side}>
                <Logo width={32} height={32} borderRadius={10} />
                <Text numberOfLines={1} style={styles.title}>
                    {title}
                </Text>

            </View>






            <View style={styles.rightSide}>
                <Ionicons name="search-outline" size={24} color="#FAFAFA" />
                <Ionicons name="notifications-outline" size={24} color="#FAFAFA" />
            </View>
        </View>
    );
};

export default Header;
const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: "transparent",
        borderBottomWidth:0.5,
        borderBottomColor:"#333333"
    },
    side: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        gap: 12
    },
    rightSide: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        gap: 24
    },
    center: {
        flex: 1,
        alignItems: "center",
    },
    title: {
        fontSize: 16,
        color: "#FAFAFA",
        fontWeight: "600",
        top: -6
    },
    iconButton: {
        padding: 8,
        borderRadius: 100,
    },
});