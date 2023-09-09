import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { ADD_USER } from "../graphql/Username";
import { useUserContext } from "../Context/UserContext";
import theme from "../utils/Theme";

export default function NewUsername() {
  const { addNewUser } = useUserContext();
  const [username, onChangeUsername] = useState("");
  const [addUser, { data, error, reset }] = useMutation(ADD_USER);

  useEffect(() => {
    addId();
  }, [data]);

  useEffect(() => {
    if (username.length === 7) {
      reset();
    }
  }, [username]);

  const confirmNewUser = () => {
    addUser({
      variables: {
        username: username,
      },
    });
  };

  const addId = async () => {
    try {
      const id = await data.addUser._id;
      if (data) {
        addNewUser(username, id);
        console.log("data available");
      }
    } catch (error) {
      console.log("No data");
    }
  };

  return (
    <View style={styles.username}>
      <Text style={styles.label}>Ingrese su nombre para comenzar</Text>
      <TextInput
        style={styles.usernameInput}
        onChangeText={onChangeUsername}
        placeholder="Nombre de Usuario"
        value={username}
      />
      <Text style={styles.error}>{error?.message}</Text>
      <Button
        onPress={confirmNewUser}
        title="Aceptar"
        disabled={!username ?? true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  username: {
    padding: 100,
  },
  label: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    color: theme.text,
  },
  usernameInput: {
    fontSize: 20,
    textAlign: "center",
    height: 60,
    marginVertical: 20,
    backgroundColor: theme.secondary,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.text,
    padding: 10,
  },
  error: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 30,
  },
});
