import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";

//Tipos de dato para "user"
export type User = { username: string; id: string };

//Tipos de datos para el contexto
type UserContextType = {
  user: object | null;
  _storeUsername: string | null;
  _storeId: string | null;
  locationsID: string[] | [];
  addNewLocationsID: (id: string) => void;
  deleteLocationID: (id: string) => void;
  addNewUser: (username: string, id: string) => void;
  clearAll: () => void;
};

//Tipo de dato para "children" React prop
type Props = { children: React.ReactNode };

//Creacion del contexto
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

//Custom Hook del contexto
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("No se puede encontrar el contexto");
  }
  return context;
};

//Creacion del Provider del contexto
export const UserContextProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [locationsID, setLocationsID] = useState<string[] | []>([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const USER: User = JSON.parse(storedUser);
          setUser(USER);
        }
      } catch (error) {
        Alert.alert("Error", "No se pudo obtener el nombre de usuario", [
          { text: "OK" },
        ]);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const getLocationsID = async () => {
      try {
        const storedLocationsID = await AsyncStorage.getItem("locationsID");
        if (storedLocationsID) {
          const LOCATIONSID: string[] | [] = JSON.parse(storedLocationsID);
          setLocationsID(LOCATIONSID);
        }
      } catch (error) {
        Alert.alert("Error", "No se pudo obtener las ubicaciones", [
          { text: "OK" },
        ]);
      }
    };
    getLocationsID();
  }, []);

  const addNewUser = async (username: string, id: string) => {
    const USER = {
      username: username,
      id: id,
    };
    try {
      await AsyncStorage.setItem("user", JSON.stringify(USER));
      setUser(USER);
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el nombre de usuario", [
        { text: "OK" },
      ]);
    }
  };

  const addNewLocationsID = async (id: string) => {
    try {
      await AsyncStorage.setItem(
        "locationsID",
        JSON.stringify([id, ...locationsID])
      );
      setLocationsID([id, ...locationsID]);
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el nombre de usuario", [
        { text: "OK" },
      ]);
    }
  };

  const deleteLocationID = async (id: string) => {
    try {
      const newlocationsID = locationsID.filter((i) => i !== id);
      await AsyncStorage.setItem("locationsID", JSON.stringify(newlocationsID));
      setLocationsID(newlocationsID);
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el nombre de usuario", [
        { text: "OK" },
      ]);
    }
  };

  const clearAll = async () => {
    try {
      await AsyncStorage.clear();
      setUser(null);
      setLocationsID([]);
    } catch (error) {
      Alert.alert("Error", "No se pudo borrar el usuario", [{ text: "OK" }]);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        _storeUsername: user?.username || null,
        _storeId: user?.id || null,
        locationsID,
        addNewLocationsID,
        deleteLocationID,
        addNewUser,
        clearAll,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
