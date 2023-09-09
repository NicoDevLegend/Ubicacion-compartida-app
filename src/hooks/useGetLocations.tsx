import { useQuery, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_LOCATIONS } from "../graphql/Location";
import { LOCATION_SUBSCRIPTION } from "../graphql/Location";
import { useUserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-native";
import { Alert } from "react-native";

export type location = {
  _id: string;
  username: string;
  latitude: number;
  longitude: number;
  date: string;
  time: string;
  adress: {
    street: string;
    streetNumber: string;
    city: string;
  };
};

const useGetLocations = () => {
  const [locationsPoints, setLocationsPoints] = useState<location[] | []>([]);
  const { locationsID } = useUserContext();
  const navigate = useNavigate();
  const { loading, data, error, refetch } = useQuery(GET_LOCATIONS, {
    variables: {
      ids: locationsID,
    },
  });
  const { data: subsData } = useSubscription(LOCATION_SUBSCRIPTION);

  useEffect(() => {
    refetch();
  }, [subsData]);

  useEffect(() => {
    if (data) {
      setLocationsPoints(data.getLocations);
    }
  }, [data]);

  const reloadPage = () => {
    navigate("/group");
    refetch();
  };

  if (error) {
    Alert.alert("Error", error.message, [
      { text: "Reintentar", onPress: reloadPage },
      { text: "OK" },
    ]);
  }

  return { locationsPoints, loading };
};

export default useGetLocations;
