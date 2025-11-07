import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// import { account } from "../lib/appwrite";
import { Link, useRouter } from "expo-router";
import { account } from "../lib/appwrite";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const session = await account.createSession(email, password);
      Alert.alert("Success", `Logged in as ${email}`);
      router.push("/index"); // navigate to home after login
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to login.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don’t have an account?{" "}
        <Link href="/register" style={styles.link}>
          Sign up
        </Link>
      </Text>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 28, fontWeight: "600", marginBottom: 40 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    backgroundColor: "coral",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  footerText: { marginTop: 20, fontSize: 14, color: "#555" },
  link: { color: "coral", fontWeight: "bold" },
});
