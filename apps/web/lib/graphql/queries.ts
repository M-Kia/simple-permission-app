import { gql } from "graphql-request";

export const WHO_AM_I_QUERY = gql`
  query WhoAmI {
    whoAmI {
      id
      userName
      permissions
      createdAt
      updatedAt
    }
  }
`;

export const PERMISSIONS_QUERY = gql`
  query Permissions {
    permissions
  }
`;
