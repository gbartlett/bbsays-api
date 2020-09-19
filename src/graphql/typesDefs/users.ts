import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  extend type Query {
    me: User!
    getUser(id: ID!): User!
    clients(id: ID!): [User!]!
  }

  extend type Mutation {
    createUser(first_name: String!, last_name: String!, email: String!): User!
    setPassword(raw_password: String!, id: ID!): User!
    login(email: String!, raw_password: String): String!
  }

  type User {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
  }
`;
