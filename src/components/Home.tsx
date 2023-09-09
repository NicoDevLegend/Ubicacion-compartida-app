import { StyleSheet, View } from "react-native";
import NewUsername from "./NewUsername";
import Profile from "./Profile";
import { useUserContext } from "../Context/UserContext";
import theme from "../utils/Theme";

export default function Home() {
  const { _storeUsername } = useUserContext();

  return (
    <View style={styles.container}>
      {_storeUsername ? <Profile /> : <NewUsername />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    backgroundColor: theme.primary,
  },
});
