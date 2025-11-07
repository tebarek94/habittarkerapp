// app/(tabs)/index.tsx
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Index() {
  // Animated values
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;

  const taglineOpacity = useRef(new Animated.Value(0)).current;

  const featuresAnim = useRef(
    [0, 1, 2].map(() => new Animated.Value(0))
  ).current; // one Animated.Value per feature row

  // Typewriter state
  const fullDescription =
    "HabitTrack helps you build streaks, stay consistent, and see real progress. Create habits, set reminders, track completion, and celebrate wins — one day at a time.";
  const [typed, setTyped] = useState("");

  useEffect(() => {
    // Sequence: title (slide up + fade), tagline fade, then feature rows stagger
    Animated.sequence([
      Animated.parallel([
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.stagger(
        120,
        featuresAnim.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          })
        )
      ),
    ]).start();

    // Typewriter effect for description
    let idx = 0;
    const delay = 20; // ms per character (adjust faster/slower)
    const typer = setInterval(() => {
      setTyped((prev) => prev + fullDescription[idx]);
      idx++;
      if (idx >= fullDescription.length) clearInterval(typer);
    }, delay);

    return () => clearInterval(typer);
  }, []); // run once on mount

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Hero */}
        <View style={styles.hero}>
          <Animated.Text
            style={[
              styles.appTitle,
              {
                transform: [{ translateY: titleTranslateY }],
                opacity: titleOpacity,
              },
            ]}
          >
            HabitTrack
          </Animated.Text>

          <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
            Build small habits. Make big changes. 🎯
          </Animated.Text>

          <Text style={styles.description}>{typed}</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresCard}>
          <Text style={styles.sectionTitle}>Why HabitTrack?</Text>

          {[
            {
              icon: "check-circle",
              title: "Daily Streaks",
              desc: "Visual streaks keep you motivated and consistent.",
            },
            {
              icon: "bell",
              title: "Reminders",
              desc: "Gentle nudges so you never miss a habit.",
            },
            {
              icon: "chart-line",
              title: "Progress Stats",
              desc: "See how your habits improve over time.",
            },
          ].map((f, i) => {
            const animStyle = {
              opacity: featuresAnim[i],
              transform: [
                {
                  translateY: featuresAnim[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [8, 0],
                  }),
                },
              ],
            };

            return (
              <Animated.View key={i} style={[styles.featureRow, animStyle]}>
                <FontAwesome5 name={f.icon} size={20} />
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
              </Animated.View>
            );
          })}
        </View>

        {/* Small callout */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Ready to craft better habits? Start small and stay consistent.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  hero: {
    backgroundColor: "#fff5f0",
    padding: 20,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: Platform.OS === "android" ? 0.08 : 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ff6f61",
  },
  tagline: {
    marginTop: 8,
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  description: {
    marginTop: 12,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
    minHeight: 64,
  },
  featuresCard: {
    marginTop: 20,
    backgroundColor: "#f7fafc",
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 12,
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  featureDesc: {
    marginTop: 4,
    fontSize: 13,
    color: "#666",
  },
  footer: {
    marginTop: 18,
    alignItems: "center",
    padding: 8,
  },
  footerText: {
    color: "#666",
    textAlign: "center",
  },
});
