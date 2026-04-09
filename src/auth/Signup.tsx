import React, { useEffect, useState } from "react";
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
import { deleteAccount, getCurrentUser, signUp, updateUserDetails } from "../../localstorage-services/auth";

const Signup = ({ buttonText }: { buttonText?: string }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setFullName(user.fullName);
        setEmail(user.email);
      }
    };

    loadUser();
  }, []);

  const updateProfile = async () => {
    setError(null);
    setLoading(true);
// deleteAccount("avish.vijay2021@gmail.com")
    try {
      if (!currentUser?.id) {
        setError("User not found.");
        return;
      }

      const result = await updateUserDetails(currentUser.id, {
        fullName,
        email,
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      // ✅ success
      navigation.goBack(); // or navigate("Profile")
    } catch (e) {
      console.error(e);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setError(null);
    setLoading(true);

    try {
      const result = await signUp(fullName, email, password, confirmPassword);

      if (!result.success) {
        setError(result.message);
        return;
      }

      navigation.navigate("PayU" as never);
    } catch (e) {
      console.error("[Signup] unhandled error:", e);
      setError("Unexpected error. Please try again.");
    } finally {
      // Always runs — guarantees loading turns off
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        placeholder="Full Name"
        placeholderTextColor="#555"
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />

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
          onPress={() => setPasswordVisible((v) => !v)}
          style={styles.passwordToggle}
        >
          {passwordVisible ? (
            <EyeOff size={20} color="#FAFAFA" />
          ) : (
            <Eye size={20} color="#FAFAFA" />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Confirm Password</Text>
      <View style={styles.passwordWrapper}>
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#555"
          secureTextEntry={!confirmVisible}
          style={styles.passwordInput}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setConfirmVisible((v) => !v)}
          style={styles.passwordToggle}
        >
          {confirmVisible ? (
            <EyeOff size={20} color="#FAFAFA" />
          ) : (
            <Eye size={20} color="#FAFAFA" />
          )}
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={() => {
          if (buttonText === "Update Profile") {
            // updateProfile();
            navigation.navigate("HomePage" as never);
          } else {
            handleSignup();
            // updateProfile();

          }
        }}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#171717" />
        ) : (
          <Text style={styles.buttonText}>{buttonText ? buttonText + " (Not yet working)" : "Create Account"}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", gap: 12 },
  label: { color: "#FAFAFA", fontSize: 14, marginBottom: 4 },
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
  passwordToggle: { left: -24 },
  errorText: { color: "#FF6B6B", fontSize: 13, marginTop: -4 },
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