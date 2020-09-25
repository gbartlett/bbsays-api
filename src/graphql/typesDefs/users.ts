import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  extend type Query {
    me: User!
    getUser(id: ID!): User!
    clients(id: ID!): [User!]!
  }

  extend type Mutation {
    createUser(first_name: String!, last_name: String!, email: String!): User!
    setPassword(password: String!, id: ID!): User!
    login(email: String!, password: String): LoginResult!
  }

  type User {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
  }

  type LoginResult {
    token: String!
    refreshToken: String!
  }
`;
