import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  extend type Query {
    me: User!
    getUser(id: ID!): User!
    clients(id: ID!): [User!]!
  }

  extend type Mutation {
    createUser(first_name: String!, last_name: String!, email: String!): User!
    setPassword(password: String!, id: ID!): TokensResult!
    login(email: String!, password: String): TokensResult!
  }

  type User {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
  }

  type TokensResult {
    jwtToken: String!
    refreshToken: String!
  }
`;
