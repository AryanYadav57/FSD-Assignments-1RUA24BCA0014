import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import UserList from "./components/UserList";
import { getEvenUsers, getOddUsers } from "./services/userApi";

export default function App() {
  const [selectedParity, setSelectedParity] = useState("even");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;
    const loadUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const result = selectedParity === "even" ? await getEvenUsers() : await getOddUsers();
        if (isCurrent) setUsers(result.users);
      } catch (requestError) {
        if (isCurrent) setError(requestError.message);
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    loadUsers();
    return () => { isCurrent = false; };
  }, [selectedParity]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>FSD LAB 07</Text>
        <Text style={styles.title}>User directory</Text>
        <Text style={styles.subtitle}>Explore users through two Express API routes, filtered by ID parity.</Text>

        <View style={styles.segmentedControl}>
          {["even", "odd"].map((parity) => (
            <Pressable
              key={parity}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedParity === parity }}
              onPress={() => setSelectedParity(parity)}
              style={[styles.segment, selectedParity === parity && styles.activeSegment]}
            >
              <Text style={[styles.segmentText, selectedParity === parity && styles.activeSegmentText]}>
                {parity === "even" ? "Even IDs" : "Odd IDs"}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{selectedParity === "even" ? "Even users" : "Odd users"}</Text>
          {!loading && !error && <Text style={styles.count}>{users.length} records</Text>}
        </View>

        {loading && <ActivityIndicator color="#0d6b61" size="large" style={styles.loader} />}
        {!!error && <Text style={styles.error}>{error} Make sure the backend is running on port 3000.</Text>}
        {!loading && !error && <UserList users={users} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#f5f8f7", flex: 1 },
  container: { alignSelf: "center", maxWidth: 760, padding: 28, width: "100%" },
  eyebrow: { color: "#0d6b61", fontSize: 12, fontWeight: "800", letterSpacing: 1.5 },
  title: { color: "#12212b", fontSize: 36, fontWeight: "800", marginTop: 10 },
  subtitle: { color: "#60717b", fontSize: 16, lineHeight: 24, marginTop: 8, maxWidth: 560 },
  segmentedControl: { backgroundColor: "#e8efed", borderRadius: 12, flexDirection: "row", marginTop: 28, padding: 4 },
  segment: { alignItems: "center", borderRadius: 9, flex: 1, padding: 12 },
  activeSegment: { backgroundColor: "#ffffff", shadowColor: "#24443f", shadowOpacity: 0.12, shadowRadius: 6 },
  segmentText: { color: "#71808b", fontSize: 14, fontWeight: "700" },
  activeSegmentText: { color: "#0d6b61" },
  sectionHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 14, marginTop: 30 },
  sectionTitle: { color: "#12212b", fontSize: 20, fontWeight: "800" },
  count: { color: "#71808b", fontSize: 13 },
  loader: { marginTop: 42 },
  error: { backgroundColor: "#fff0ee", borderRadius: 10, color: "#a33d32", lineHeight: 21, marginTop: 16, padding: 14 },
});
