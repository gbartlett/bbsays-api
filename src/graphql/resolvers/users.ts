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
  ROLES,
  setUserPassword,
  User,
  UserNoPWD,
} from "../../db/users";
import { validateRole } from "../utils/authMiddleware";

export const userResolvers = {
  Query: {
    me: (root: never, args: null, context: GraphQLContext): UserNoPWD => {
      return context.user;
    },
    clients: validateRole<UserNoPWD, { id: string }, GraphQLContext>(
      ROLES.COACH
    )((_, args) => {
      console.log("HEY");
      return getClients(args.id);
    }),
    getUser: validateRole<UserNoPWD, { id: string }, GraphQLContext>(
      ROLES.COACH
    )(async (_, args, context) => {
      const user = await getUserById(args.id);
      if (!user) {
        throw new Error("Could not find user");
      }

      if (
        !isCoachForClient(context.user.id, user.id) ||
        !isRequestingOwnData(parseInt(args.id, 10), context.user.id)
      ) {
        throw new Error("Cannot access this user");
      }

      return user;
    }),
  },
  Mutation: {
    createUser: (
      root: never,
      args: Omit<User, "id" | "pwd_hash">,
      context: GraphQLContext
    ): Promise<UserNoPWD> => {
      return insertUser(args);
    },
    setPassword: (
      root: never,
      args: { raw_password: string; id: string },
      context: GraphQLContext
    ): Promise<UserNoPWD> => {
      if (!isRequestingOwnData(context.user.id, parseInt(args.id))) {
        throw new Error("Unauthorized");
      }
      return setUserPassword(args.raw_password, args.id);
    },
    login: async (
      root: never,
      args: { email: string; raw_password: string },
      context: GraphQLContext
    ): Promise<UserNoPWD> => {
      const user = await authUser(args.email, args.raw_password);
      if (!user) {
        throw new Error("Invalid credentials");
      }
      return user;
    },
  },
};
