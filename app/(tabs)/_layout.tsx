import { UserProvider } from "@/contexts/UserContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Tabs } from "expo-router";
import React, { JSX } from "react";

export default function TabsLayout(): JSX.Element {
  return (
    <UserProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "coral",
          tabBarInactiveTintColor: "gray",
          headerShown: false, // hide header for all tabs
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopColor: "#eee",
            height: 60,
            paddingBottom: 6,
          },
        }}
      >
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

        {/* Optional Register Screen */}
        {/* 
      <Tabs.Screen
        name="register"
        options={{
          title: "Register",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-plus" size={size} color={color} />
          ),
        }}
      />
      */}
      </Tabs>
    </UserProvider>
  );
}
