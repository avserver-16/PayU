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

const Signin = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigation = useNavigation();
    const handleNavigateToPayU = () => { navigation.navigate('PayU' as never); };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Email</Text>
            <TextInput placeholder="Email" style={styles.input} />

            {/* Password */}
            <Text style={styles.label}>Password</Text>

            <View style={styles.passwordWrapper}>
                <TextInput
                    placeholder="Password"
                    secureTextEntry={!passwordVisible}
                    style={styles.passwordInput}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.passwordToggle}>
                    {passwordVisible ? <EyeOff size={20} color={'#FAFAFA'}/> : <Eye color={"#FAFAFA"} size={20} />}
                </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity>
                <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleNavigateToPayU}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Signin;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 16,
        justifyContent: "center",
        gap: 12,
    },
    title: {
        fontSize: 28,
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        marginBottom: 0,
        color:'#FAFAFA'
    },
    input: {
        height: 36,
        borderWidth: 0.5,
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor:'#2626264D',
        borderColor:'#262626',
        color:'#FAFAFA'
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
        backgroundColor:'#2626264D',
        borderColor:'#262626'
    },
    passwordInput: {
width:'100%',
height:'100%',
color:'#FAFAFA'
    },
    forgot: {
        alignSelf: "flex-end",
        color: "#FAFAFA",
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
    passwordToggle: {
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
        left:-30
    },
});