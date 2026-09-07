import { FlatList, Text, View } from "react-native";
import UserCard from "./UserCard";

export default function UserList({ users }) {
  if (users.length === 0) {
    return <Text>No users found.</Text>;
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(user) => String(user.id)}
      renderItem={({ item }) => <UserCard user={item} />}
      scrollEnabled={false}
      ListFooterComponent={<View style={{ height: 12 }} />}
    />
  );
}
