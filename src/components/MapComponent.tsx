import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Pressable, Text, Alert } from "react-native";
import MapView, { Marker, LatLng, PROVIDER_GOOGLE } from "react-native-maps";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Location from "expo-location";
import useGetLocations from "../hooks/useGetLocations";
import data from "../utils/MapStyle.json";
import theme from "../utils/Theme";
import Loader from "./Loader";
import useIsLive from "../hooks/useIsLive";

const MapComponent: React.FC = () => {
  const [activeExpand, setActiveExpand] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const { locationsPoints, loading } = useGetLocations();
  const isLiveLocationsPoints = useIsLive(locationsPoints);

  const mapRef = useRef<MapView>(null);

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
  }, [])

  const markers: LatLng[] = locationsPoints.map((location) => ({
    latitude: location.latitude,
    longitude: location.longitude,
  }));

  const onMapLayout = () => {
    if (mapRef.current && markers.length > 0) {
      mapRef.current.fitToCoordinates(markers, {
        edgePadding: {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        },
        animated: true,
      });
    }
  };

  if (loading || !location) {
    return (
      <View style={styles.container}>
        <Loader />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        ref={mapRef}
        region={{
          latitude: location?.coords.latitude || 0,
          longitude: location?.coords.longitude || 0,
          latitudeDelta: 0.05,
          longitudeDelta: 0.04,
        }}
        provider={PROVIDER_GOOGLE}
        customMapStyle={data}
        onMapLoaded={() => setActiveExpand(true)}
        showsUserLocation
        loadingEnabled
      >
        {isLiveLocationsPoints.map((item) => {
          const {
            _id,
            username,
            latitude,
            longitude,
            adress,
            isLive,
            date,
            time,
          } = item;
          const { street, city, streetNumber } = adress;

          return (
            <Marker
              key={_id}
              coordinate={{
                latitude: latitude,
                longitude: longitude,
              }}
              title={isLive ? username : `${username} (${time}hs ${date})`}
              description={
                adress
                  ? `${street} ${streetNumber}, ${city}`
                  : "Ubicacion desconocida"
              }
              pinColor={isLive ? "green" : "red"}
            />
          );
        })}
      </MapView>
      {activeExpand && (
        <>
          <View style={styles.button}>
            <Pressable onPress={onMapLayout}>
              <FontAwesome5 name="expand" size={24} color={theme.secondary} />
            </Pressable>
          </View>
          <View style={styles.markersContainer}>
            <View style={styles.markers}>
              <FontAwesome5 name="map-marker-alt" size={24} color="red" />
              <Text style={styles.markersText}>Última</Text>
            </View>
            <View style={styles.markers}>
              <FontAwesome5 name="map-marker-alt" size={24} color="green" />
              <Text style={styles.markersText}>Actual</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    borderWidth: 3,
    backgroundColor: theme.primary,
  },
  button: {
    padding: 8,
    position: "absolute",
    right: 12,
    top: 100,
    backgroundColor: theme.selection,
    borderRadius: 2,
    opacity: 0.65,
  },
  markersContainer: {
    position: "absolute",
    right: 5,
    bottom: 100,
    width: 50,
    backgroundColor: theme.selection,
    opacity: 0.65,
  },
  markers: {
    alignItems: "center",
    marginVertical: 5,
  },
  markersText: {
    color: theme.secondary,
  },
});

export default MapComponent;
