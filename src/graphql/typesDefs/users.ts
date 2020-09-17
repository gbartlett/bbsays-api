import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  extend type Query {
    me: User!
    getUser(id: ID!): User!
  }

  extend type Mutation {
    createUser(first_name: String!, last_name: String!, email: String!): User!
  }

  type User {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
  }
`;
