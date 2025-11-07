import { UserProvider } from "@/contexts/UserContext";
import { Stack } from "expo-router";
import React, { JSX } from "react";

export default function RootLayout(): JSX.Element {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}
