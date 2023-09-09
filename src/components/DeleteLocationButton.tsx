import { useUserContext } from "../Context/UserContext";
import { Pressable, StyleSheet, Text } from "react-native";
import theme from "../utils/Theme";
import React from "react";

type Props = {
  id: string;
};

export const DeleteLocationButton: React.FC<Props> = ({ id }) => {
  const { deleteLocationID } = useUserContext();

  return (
    <Pressable style={styles.button} onPress={() => deleteLocationID(id)}>
      <Text style={styles.textStyle}>Eliminar</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: theme.primary,
  },
  textStyle: {
    color: theme.selection,
    fontWeight: "bold",
    textAlign: "center",
  },
});
