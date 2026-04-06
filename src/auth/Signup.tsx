import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

const Signup = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const navigation = useNavigation();
    const handleNavigateToPayU = () => { navigation.navigate('PayU' as never); };
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput placeholder="Full Name" style={styles.input} />
            <Text style={styles.label}>Email</Text>
            <TextInput placeholder="Email" style={styles.input} />
            <Text style={styles.label}>Password</Text>
            {/* Password */}
            <View style={styles.passwordWrapper}>
                <TextInput
                    placeholder="Password"
                    secureTextEntry={!passwordVisible}
                    style={styles.passwordInput}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.passwordToggle}>
                    {passwordVisible ? <EyeOff size={20} color="#FAFAFA" /> : <Eye size={20} color="#FAFAFA" />}
                </TouchableOpacity>
            </View>
            <Text style={styles.label}>Confirm Password</Text>
            {/* Confirm Password */}
            <View style={styles.passwordWrapper}>
                <TextInput
                    placeholder="Confirm Password"
                    secureTextEntry={!confirmVisible}
                    style={styles.passwordInput}
                />
                <TouchableOpacity onPress={() => setConfirmVisible(!confirmVisible)} style={styles.passwordToggle}>
                    {confirmVisible ? <EyeOff size={20} color="#FAFAFA" /> : <Eye size={20} color="#FAFAFA" />}
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleNavigateToPayU}>
                <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Signup;

const styles = StyleSheet.create({
    container: {
        flex: 1,

        justifyContent: "center",
        gap: 12,
    },
    title: {
        fontSize: 28,
        marginBottom: 16,
    },
    input: {
        height: 36,
        borderWidth: 0.5,
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: '#2626264D',
        borderColor: '#262626',
        color: '#FAFAFA'
    },
    label: {
        color: '#FAFAFA',
        fontSize: 14,
        marginBottom: 4,
    },
    passwordWrapper: {
        flexDirection: "row",
        alignItems: "center",
        // borderWidth: 1,
        // borderRadius: 12,
        // paddingHorizontal: 12,
        // height: 50,
        justifyContent: "space-between",
        height: 36,
        borderWidth: 0.5,
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: '#2626264D',
        borderColor: '#262626'
    },
    passwordInput: {
        width: '100%',
        height: '100%',
        color: '#FAFAFA'
    },
    passwordToggle: {
        left: -24
    },
    button: {
        height: 36,
        backgroundColor: "#FAFAFA",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
    },
    buttonText: {
        color: "#171717",
        fontWeight: "light",
    },
});