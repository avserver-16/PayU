import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { signIn } from "../../localstorage-services/auth";


const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation();

  const handleSignin = async () => {
    setError(null);
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigation.navigate("PayU" as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#555"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordWrapper}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#555"
          secureTextEntry={!passwordVisible}
          style={styles.passwordInput}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)}
          style={styles.passwordToggle}
        >
          {passwordVisible ? (
            <EyeOff size={20} color="#FAFAFA" />
          ) : (
            <Eye color="#FAFAFA" size={20} />
          )}
        </TouchableOpacity>
      </View>

      {/* Inline error */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#171717" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Signin;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", gap: 12 },
  label: { fontSize: 14, color: "#FAFAFA" },
  input: {
    height: 36,
    borderWidth: 0.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#2626264D",
    borderColor: "#262626",
    color: "#FAFAFA",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 36,
    borderWidth: 0.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#2626264D",
    borderColor: "#262626",
  },
  passwordInput: { width: "100%", height: "100%", color: "#FAFAFA" },
  passwordToggle: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    left: -30,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 13,
    marginTop: -4,
  },
  forgot: { alignSelf: "flex-end", color: "#FAFAFA" },
  button: {
    height: 36,
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#171717", fontWeight: "300" },
});