import { gql } from "apollo-server-express";
import { userTypeDefs } from "./users";

const BaseTypeDef = gql`
  type Query {
    hello: String!
  }

  type Mutation {
    hello: String!
  }
`;

export default [BaseTypeDef, userTypeDefs];
