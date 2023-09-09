import { gql } from "@apollo/client";

const ID_USERNAME_LOCATION_FRAGMENT = gql`
  fragment IdUsernameLocationFragment on Location {
    _id
    username
  }
`;

export const GET_USER = gql`
  query getUser($id: ID!) {
    getUser(_id: $id) {
      ...IdUsernameLocationFragment
    }
  }

  ${ID_USERNAME_LOCATION_FRAGMENT}
`;

export const ADD_USER = gql`
  mutation addUser($username: String!) {
    addUser(username: $username) {
      ...IdUsernameLocationFragment
    }
  }

  ${ID_USERNAME_LOCATION_FRAGMENT}
`;

export const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(_id: $id) {
      ...IdUsernameLocationFragment
      latitude
      longitude
      date
      time
    }
  }

  ${ID_USERNAME_LOCATION_FRAGMENT}
`;
