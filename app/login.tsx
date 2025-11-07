import { useUser } from "@/contexts/UserContext";
import { useRouter } from "expo-router";
import React, { JSX, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen(): JSX.Element {
  const { current, login } = useUser();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (current) router.replace("/");
  }, [current, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome Back 👋</Text>
      <Text style={styles.subHeader}>Login or create a new account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#aaa"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity
        style={styles.loginButton}
        onPress={async () => {
          setLoading(true);
          try {
            await login(email, password);
            router.replace("/");
          } catch {
            // handled by context toast
          } finally {
            setLoading(false);
          }
        }}
      >
        <Text style={styles.loginText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => router.push("/register")}
      >
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f9fafb",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
  },
  subHeader: {
    fontSize: 15,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  loginButton: {
    backgroundColor: "coral",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: "#fff",
    borderColor: "coral",
    borderWidth: 1.5,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  registerText: {
    color: "coral",
    fontWeight: "600",
    fontSize: 16,
  },
});
