import { StyleSheet, Text, View } from "react-native";

export default function UserCard({ user }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <View style={styles.idBadge}>
        <Text style={styles.idText}>#{user.id}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#d8e0e8",
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 12,
    padding: 16,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#dff4ef",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    marginRight: 14,
    width: 48,
  },
  avatarText: { color: "#0d6b61", fontSize: 20, fontWeight: "700" },
  details: { flex: 1 },
  name: { color: "#12212b", fontSize: 16, fontWeight: "700" },
  email: { color: "#71808b", fontSize: 13, marginTop: 4 },
  idBadge: { backgroundColor: "#edf2f5", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 },
  idText: { color: "#465761", fontSize: 12, fontWeight: "700" },
});
