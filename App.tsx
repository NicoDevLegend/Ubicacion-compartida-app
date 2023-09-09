import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink,
  gql,
} from "@apollo/client";
import { NativeRouter } from "react-router-native";
import { Main } from "./src/components/Main";
import { getMainDefinition } from "@apollo/client/utilities";
import { User, UserContextProvider } from "./src/Context/UserContext";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { LOCATION_TASK_NAME } from "./src/utils/TaskNames";

const httpLink = new HttpLink({
  uri: "YOUR-APOLLO-SERVER-ENDPOINT",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "YOUR-APOLLO-SERVER-ENDPOINT",
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  if (error) {
    console.log("Error al actualizar la ubicación");
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Error al actualizar la ubicación",
        body: error.message,
      },
      trigger: null,
    });
    return;
  }

  if (data) {
    const { locations }: any = data;
    const location = locations[0];
    const storedUser = await AsyncStorage.getItem("user");
    const date = new Date();
    if (location && storedUser) {
      const USER: User = JSON.parse(storedUser);
      const geocodeResult = await Location.reverseGeocodeAsync({
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude,
      });
      await client.mutate({
        mutation: gql`
          mutation addLocation($id: ID!, $location: locationInput) {
            addLocation(_id: $id, location: $location) {
              _id
              username
              latitude
              longitude
              date
              time
              adress {
                street
                streetNumber
                city
              }
            }
          }
        `,
        variables: {
          id: USER?.id,
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
  }
});

export const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <UserContextProvider>
        <View style={styles.container}>
          <StatusBar style="light" backgroundColor="black" />
          <NativeRouter>
            <Main />
          </NativeRouter>
        </View>
      </UserContextProvider>
    </ApolloProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
