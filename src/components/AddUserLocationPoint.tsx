import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useUserContext } from "../Context/UserContext";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../graphql/Username";
import theme from "../utils/Theme";

export const AddUserLocationPoint = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { addNewLocationsID } = useUserContext();
  const [userID, onChangeID] = useState<string>("");
  const { error } = useQuery(GET_USER, {
    variables: {
      id: userID,
    },
  });

  const addUserID = () => {
    if (error) {
      Alert.alert("Error", error.message, [{ text: "OK" }]);
    } else {
      addNewLocationsID(userID);
      setModalVisible(!modalVisible);
    }
  };

  const cancel = () => {
    setModalVisible(!modalVisible);
    onChangeID("");
  };

  return (
    <View style={styles.centeredView}>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Coloca una ID para agregar la ubicación al grupo
            </Text>
            <TextInput
              maxLength={24}
              style={styles.modalInput}
              placeholder="ID"
              placeholderTextColor={theme.text}
              onChangeText={onChangeID}
              value={userID}
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={addUserID}
              >
                <Text style={styles.textStyle}>Aceptar</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={cancel}
              >
                <Text style={styles.textStyle}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Agregar una ubicación</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    alignItems: "center",
    marginVertical: 25,
  },
  modalView: {
    marginTop: 150,
    backgroundColor: theme.secondary,
    borderRadius: 10,
    padding: 50,
    borderWidth: 2,
    borderColor: theme.text,
    shadowColor: theme.secondary,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: theme.primary,
  },
  buttonCancel: {
    backgroundColor: theme.danger,
  },
  textStyle: {
    color: theme.selection,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    fontSize: 20,
    marginBottom: 25,
    fontWeight: "bold",
    textAlign: "center",
    color: theme.text,
  },
  modalInput: {
    fontSize: 20,
    marginVertical: 15,
    padding: 10,
    borderColor: theme.text,
    backgroundColor: theme.primary,
    borderWidth: 1,
    color: theme.text,
  },
  modalButtons: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
