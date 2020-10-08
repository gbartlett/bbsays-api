import { GraphQLContext } from "src/apolloServer";
import {
  isCoachForClient,
  isRequestingOwnData,
} from "../../utils/userAuthHelpers";
import {
  authUser,
  getClients,
  getUserById,
  insertUser,
  setUserPassword,
  User,
  UserNoPWD,
} from "../../db/users";
import { AuthenticationError } from "apollo-server-express";

export const userResolvers = {
  Query: {
    me: (root: null, args: null, context: GraphQLContext): UserNoPWD => {
      if (!context.user) {
        throw new AuthenticationError("User is not authenticated");
      }
      return context.user;
    },
    clients: async (_: null, args: { id: string }): Promise<UserNoPWD[]> => {
      const clients = await getClients(args.id);

      if (!clients) {
        throw new Error("An error occured while fetching clients");
      }

      return clients;
    },
    getUser: async (
      _: never,
      args: { id: string },
      context: GraphQLContext,
    ): Promise<UserNoPWD> => {
      const user = await getUserById(args.id);

      if (!user) {
        throw new Error("Could not find user");
      }

      if (
        !context.user ||
        (user.coach_id &&
          !isCoachForClient(context.user.id, user.coach_id) &&
          !isRequestingOwnData(parseInt(args.id, 10), context.user.id))
      ) {
        throw new Error("Cannot access this user");
      }

      return user;
    },
  },
  Mutation: {
    createUser: async (
      _: never,
      args: Omit<User, "id" | "pwd_hash">,
    ): Promise<UserNoPWD> => {
      const user = await insertUser(args);

      if (!user) {
        throw new Error("User could not be created");
      }

      return user;
    },
    setPassword: async (
      _: never,
      args: { password: string; id: string },
      context: GraphQLContext,
    ): Promise<{ jwtToken: string; refreshToken: string }> => {
      if (
        !context.user ||
        !isRequestingOwnData(context.user.id, parseInt(args.id))
      ) {
        throw new Error("Unauthorized");
      }

      const setPwdResult = await setUserPassword(args.password, args.id);

      if (!setPwdResult) {
        throw new Error("Users password could not be updated");
      }

      return { ...setPwdResult };
    },
    login: async (
      _: never,
      args: { email: string; password: string },
    ): Promise<{ jwtToken: string; refreshToken: string }> => {
      const authResult = await authUser(args.email, args.password);

      if (!authResult) {
        throw new AuthenticationError("Invalid credentials");
      }

      return { ...authResult };
    },
  },
};
