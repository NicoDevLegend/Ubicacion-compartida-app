import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import { useUserContext } from "../Context/UserContext";
import { DELETE_USER } from "../graphql/Username";
import { ShareButton } from "./ShareButton";
import theme from "../utils/Theme";

const Separator = () => <View style={styles.separator} />;

export default function Profile() {
  const { _storeUsername, _storeId, clearAll } = useUserContext();
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [deleteUser] = useMutation(DELETE_USER);

  useEffect(() => {
    setUsername(_storeUsername || "");
    setId(_storeId || "");
  }, []);

  const clearUser = async () => {
    await deleteUser({
      variables: {
        id: id,
      },
    });
    clearAll();
  };

  const confirmClearUser = () => {
    Alert.alert(
      "¡Atención!",
      "¿Estás seguro que deseas eliminar este nombre de usuario?",
      [{ text: "Aceptar", onPress: clearUser }, { text: "Cancelar" }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.username}>
        <Text style={styles.label}>Nombre de Usuario</Text>
        <TextInput
          style={styles.usernameInput}
          value={username}
          selectTextOnFocus
          editable={false}
        />
      </View>
      <Separator />
      <View style={styles.id}>
        <Text style={styles.label}>ID</Text>
        <View style={styles.idShare}>
          <TextInput
            style={styles.idInput}
            value={id}
            selectTextOnFocus
            editable={false}
          />
          <ShareButton text={id} />
        </View>
      </View>
      <View>
        <Text style={styles.idLegend}>(Comparte tu ID para que otro usuario vea tu ubicación)</Text>
      </View>
      <View style={styles.deleteButton}>
        <Pressable onPress={confirmClearUser}>
          <Text style={styles.textStyle}>Eliminar usuario</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: theme.primary,
  },
  username: {
    padding: 100,
  },
  label: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    color: theme.text,
  },
  usernameInput: {
    fontSize: 25,
    height: 60,
    marginVertical: 10,
    textAlign: "center",
    backgroundColor: theme.secondary,
    borderWidth: 1,
    borderColor: theme.text,
    padding: 10,
    color: theme.text,
  },
  id: {
    paddingTop: 40,
    paddingHorizontal: 50,
    paddingBottom: 20,
  },
  idInput: {
    fontSize: 20,
    height: 45,
    padding: 10,
    marginEnd: 15,
    textAlign: "center",
    backgroundColor: theme.secondary,
    borderWidth: 1,
    borderColor: theme.text,
    color: theme.text,
  },
  idShare: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  idLegend: {
    color: theme.text,
    textAlign: "center",
  },
  separator: {
    marginHorizontal: 50,
    borderBottomColor: theme.text,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  deleteButton: {
    backgroundColor: theme.danger,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 150,
    marginTop: 100,
    marginBottom: 1,
  },
  textStyle: {
    color: theme.selection,
    fontWeight: "bold",
    textAlign: "center",
  },
});
