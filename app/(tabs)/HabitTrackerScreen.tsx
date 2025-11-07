// HabitTrackerScreen.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { JSX, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// import { useUser } from "../contexts/UserContext";
// import { toast } from "@/lib/toast";
import { useUser } from "@/contexts/UserContext";
import { toast } from "../../lib/toast";

type Habit = {
  id: string;
  title: string;
  createdAt: string; // ISO date
  logs: string[]; // list of dates (YYYY-MM-DD) when completed
};

const STORAGE_PREFIX = "@recate:habits:";

function todayKey(date = new Date()) {
  // returns YYYY-MM-DD
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// helper: get date n days ago string
function dateNDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return todayKey(d);
}

export default function HabitTrackerScreen(): JSX.Element {
  const user = useUser();
  const uid = user?.current?.$id ?? "anonymous";
  const storageKey = `${STORAGE_PREFIX}${uid}`;

  const [habits, setHabits] = useState<Habit[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);

  // load from AsyncStorage
  useEffect(() => {
    (async function load() {
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        if (raw) {
          setHabits(JSON.parse(raw) as Habit[]);
        } else {
          setHabits([]);
        }
      } catch (err) {
        console.error("Load habits error", err);
        toast("Failed to load habits");
      } finally {
        setLoading(false);
      }
    })();
  }, [storageKey]);

  async function persist(next: Habit[]) {
    setHabits(next);
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(next));
    } catch (err) {
      console.error("Persist habits error", err);
      toast("Failed to save habits");
    }
  }

  function makeId() {
    return Math.random().toString(36).slice(2, 9);
  }

  async function addHabit() {
    const title = newTitle.trim();
    if (!title) {
      toast("Please enter a habit name");
      return;
    }
    const exists = habits.some(
      (h) => h.title.toLowerCase() === title.toLowerCase()
    );
    if (exists) {
      toast("Habit already exists");
      return;
    }
    const h: Habit = {
      id: makeId(),
      title,
      createdAt: new Date().toISOString(),
      logs: [],
    };
    await persist([h, ...habits]);
    setNewTitle("");
    setModalVisible(false);
    toast("Habit added");
  }

  async function removeHabit(id: string) {
    Alert.alert("Delete habit", "Are you sure you want to delete this habit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const next = habits.filter((h) => h.id !== id);
          await persist(next);
          toast("Habit deleted");
        },
      },
    ]);
  }

  function isCompletedToday(h: Habit) {
    return h.logs.includes(todayKey());
  }

  async function toggleToday(habitId: string) {
    const today = todayKey();
    const next = habits.map((h) => {
      if (h.id !== habitId) return h;
      const has = h.logs.includes(today);
      return {
        ...h,
        logs: has ? h.logs.filter((d) => d !== today) : [...h.logs, today],
      };
    });
    await persist(next);
    const toggled = next.find((t) => t.id === habitId);
    toast(isCompletedToday(toggled!) ? "Marked complete" : "Marked incomplete");
  }

  // compute streak: consecutive days including today that habit was completed
  function computeStreak(h: Habit) {
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const dateStr = dateNDaysAgo(i); // 0 => today, 1 => yesterday, ...
      if (h.logs.includes(dateStr)) streak++;
      else break;
    }
    return streak;
  }

  // derived: sorted habits by creation date or active streak
  const sorted = useMemo(() => {
    return [...habits].sort((a, b) => {
      // primary: higher streak first
      const sA = computeStreak(a);
      const sB = computeStreak(b);
      if (sA !== sB) return sB - sA;
      // tie-break: createdAt desc
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [habits]);

  function renderItem({ item }: { item: Habit }) {
    const completed = isCompletedToday(item);
    const streak = computeStreak(item);
    return (
      <View style={styles.habitRow}>
        <View style={styles.habitInfo}>
          <Text style={styles.habitTitle}>{item.title}</Text>
          <Text style={styles.habitMeta}>
            Streak: <Text style={styles.streakValue}>{streak}</Text> · Created{" "}
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.habitActions}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              completed ? styles.toggleOn : styles.toggleOff,
            ]}
            onPress={() => toggleToday(item.id)}
          >
            <Text style={[styles.toggleText]}>
              {completed ? "Done" : "Mark"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => removeHabit(item.id)}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Habit Tracker</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.center}>Loading…</Text>
      ) : habits.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>No habits yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap + Add to create your first habit.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}

      {/* Add modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          style={styles.modalBackdrop}
        >
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>New Habit</Text>
            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="e.g. Drink water"
              style={styles.modalInput}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalAdd} onPress={addHabit}>
                <Text style={styles.modalAddText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  header: { fontSize: 26, fontWeight: "700", color: "#333" },
  addButton: {
    backgroundColor: "coral",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addText: { color: "#fff", fontWeight: "600" },
  center: { alignItems: "center", marginTop: 40, color: "#666" },
  emptyTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
  emptySubtitle: { color: "#666", marginTop: 8 },

  habitRow: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    elevation: 1,
  },
  habitInfo: { flex: 1 },
  habitTitle: { fontSize: 16, fontWeight: "600", color: "#222" },
  habitMeta: { fontSize: 12, color: "#666", marginTop: 4 },
  streakValue: { color: "coral", fontWeight: "700" },

  habitActions: { marginLeft: 12, alignItems: "flex-end" },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  toggleOn: { backgroundColor: "#e6f9f0" },
  toggleOff: {
    backgroundColor: "#fff4e6",
    borderWidth: 1,
    borderColor: "#ffd6be",
  },
  toggleText: { fontWeight: "700", color: "#333" },

  deleteButton: { paddingVertical: 6, paddingHorizontal: 10 },
  deleteText: { color: "#d9534f", fontWeight: "600" },

  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  modalInput: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  modalActions: { flexDirection: "row", justifyContent: "flex-end" },
  modalCancel: { paddingVertical: 10, paddingHorizontal: 14, marginRight: 8 },
  modalCancelText: { color: "#666" },
  modalAdd: {
    backgroundColor: "coral",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  modalAddText: { color: "#fff", fontWeight: "700" },
});
