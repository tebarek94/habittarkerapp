import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link
        href="/login"
        style={{
          width: 200,
          height: 50,
          backgroundColor: "blue",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
          borderRadius: 5,
          color: "white",
          textAlign: "center",
          lineHeight: 50,
        }}
      >
        Go to Login
      </Link>
    </View>
  );
}
