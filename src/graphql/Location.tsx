import { gql } from "@apollo/client";

const LOCATION_FRAGMENT = gql`
  fragment LocationFragment on Location {
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
`;

export const ADD_LOCATION = gql`
  mutation addLocation($id: ID!, $location: locationInput) {
    addLocation(_id: $id, location: $location) {
      ...LocationFragment
    }
  }

  ${LOCATION_FRAGMENT}
`;

export const GET_LOCATIONS = gql`
  query getLocations($ids: [ID!]!) {
    getLocations(ids: $ids) {
      ...LocationFragment
    }
  }

  ${LOCATION_FRAGMENT}
`;

export const LOCATION_SUBSCRIPTION = gql`
  subscription LocationSubscription {
    locationAdded {
      ...LocationFragment
    }
  }

  ${LOCATION_FRAGMENT}
`;
