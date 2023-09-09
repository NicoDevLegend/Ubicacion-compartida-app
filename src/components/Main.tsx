import { Alert, View } from "react-native";
import AppBar from "./AppBar";
import { Route, Routes } from "react-router-native";
import MapComponent from "./MapComponent";
import Home from "./Home";
import Group from "./Group";
import { useUserContext } from "../Context/UserContext";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { ADD_LOCATION } from "../graphql/Location";
import { useMutation } from "@apollo/client";
import { LOCATION_TASK_NAME } from "../utils/TaskNames";

export const Main: React.FC = () => {
  const { _storeUsername, _storeId } = useUserContext();
  const [addLocation] = useMutation(ADD_LOCATION);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "No se ha otorgado permiso para acceder a la ubicacion",
          [{ text: "OK" }]
        );
        return;
      }

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
        },
        (location) => {
          setLocation(location);
        }
      );

      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 60000,
      });
    })();
  }, []);

  const sendLocation = async () => {
    if (location) {
      const date = new Date();
      const geocodeResult = await Location.reverseGeocodeAsync({
        latitude: location?.coords.latitude || 0,
        longitude: location?.coords.longitude || 0,
      });
      addLocation({
        variables: {
          id: _storeId,
          location: {
            latitude: location?.coords.latitude,
            longitude: location?.coords.longitude,
            adress: {
              street: geocodeResult[0]?.street,
              streetNumber: geocodeResult[0]?.streetNumber,
              city: geocodeResult[0]?.city,
            },
            date: date.toLocaleDateString("en-GB"),
            time: date.toLocaleTimeString(),
          },
        },
      });
    }
  };

  setInterval(() => {
    sendLocation();
  }, 300000);

  return (
    <View style={{ flex: 1 }}>
      {_storeUsername && <AppBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapComponent />} />
        <Route path="/group" element={<Group />} />
      </Routes>
    </View>
  );
};
