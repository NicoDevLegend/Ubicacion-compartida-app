import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";

const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "No se ha otorgado permiso para acceder a la ubicacion",
          [{ text: "OK" }]
        );
        return
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })()
  }, []);

  return { location };
};

export default useLocation;
