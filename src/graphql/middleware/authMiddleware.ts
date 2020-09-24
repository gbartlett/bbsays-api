import { AuthenticationError } from "apollo-server-express";
import { GraphQLContext } from "../../apolloServer";
import { IMiddlewareFunction, IMiddlewareTypeMap } from "graphql-middleware";
import { ROLES } from "../../db/users";
import { combineMiddlewares } from "./combineMiddlewares";

export const isCoach: IMiddlewareFunction = async (
  resolve,
  root,
  args,
  context: GraphQLContext,
  info,
) => {
  if (!context.user) {
    throw new AuthenticationError("User does not have the correct permissions");
  }

  if (context.user.role !== ROLES.COACH) {
    throw new AuthenticationError("User is not a coach");
  }

  return resolve(root, args, context, info);
};

export const isAuthenticated: IMiddlewareFunction = async (
  resolve,
  root,
  args,
  context: GraphQLContext,
  info,
) => {
  if (!context.user) {
    throw new AuthenticationError("User is not authenticated");
  }
  return resolve(root, args, context, info);
};

export const authMiddleware: IMiddlewareTypeMap = {
  Query: {
    me: isAuthenticated,
    clients: combineMiddlewares(isCoach, isAuthenticated),
    getUser: combineMiddlewares(isCoach, isAuthenticated),
  },
  Mutation: {},
};
