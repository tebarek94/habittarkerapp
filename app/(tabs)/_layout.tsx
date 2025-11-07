import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "coral" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="login"
        options={{
          title: "Sign In",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" size={size} color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="register"
        options={{
          title: "Register",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-plus" size={size} color={color} />
          ),
        }}
      /> */}
    </Tabs>
  );
}
