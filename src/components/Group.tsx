import { StyleSheet, View } from "react-native";
import { UserLocationPoint } from "./UserLocationPoint";
import theme from "../utils/Theme";

export default function Group() {
  return (
    <View style={styles.container}>
      <UserLocationPoint />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: theme.primary,
  },
});
