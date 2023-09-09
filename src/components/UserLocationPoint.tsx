import { View, Text, StyleSheet, FlatList } from "react-native";
import useGetLocations from "../hooks/useGetLocations";
import { AddUserLocationPoint } from "./AddUserLocationPoint";
import { location } from "../hooks/useGetLocations";
import Loader from "./Loader";
import { DeleteLocationButton } from "./DeleteLocationButton";
import theme from "../utils/Theme";

export const UserLocationPoint = () => {
  const { locationsPoints, loading } = useGetLocations();

  const renderItem = ({ item }: { item: location }) => {
    const { _id, username, time, date, adress } = item;
    const { street, city, streetNumber } = adress;

    return (
      <View style={styles.location}>
        <Text style={styles.locationText}>{username}</Text>
        <Text style={styles.locationDesc}>
          {street} {streetNumber}, {city}
        </Text>
        <Text style={styles.locationDesc}>
          Última ubicación: {time}hs - {date}{" "}
        </Text>
        <DeleteLocationButton id={_id} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grupo</Text>
      <AddUserLocationPoint />
      <View style={styles.locations}>
        {loading ? (
          <Loader />
        ) : (
          <FlatList
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            data={locationsPoints}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "flex-start",
    margin: 50,
    padding: 20,
    borderColor: theme.text,
    borderWidth: 2,
    backgroundColor: theme.secondary,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowColor: theme.secondary,
    elevation: 5,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: theme.text,
    textAlign: "center",
  },
  locations: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: theme.primary,
    borderWidth: 1,
    borderColor: theme.text,
  },
  location: {
    padding: 10,
    marginVertical: 3,
    backgroundColor: theme.secondary,
    borderColor: theme.text,
    borderWidth: 1,
    elevation: 5,
  },
  locationText: {
    color: theme.selection,
    fontWeight: "bold",
    fontSize: 25,
  },
  locationDesc: {
    textAlign: "center",
    marginTop: 15,
    marginBottom: 10,
    color: theme.selection,
    fontSize: 14,
  },
});
