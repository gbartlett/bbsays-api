import { GraphQLContext } from "src/apolloServer";
import { getUserById, insertUser, User, UserNoPWD } from "../../db/users";

export const userResolvers = {
  Query: {
    me: (root: never, args: null, context: GraphQLContext): UserNoPWD => {
      return context.user;
    },
    getUser: async (
      root: never,
      args: { id: number },
      context: GraphQLContext
    ): Promise<UserNoPWD> => {
      const user = await getUserById(args.id);
      if (!user) {
        throw new Error("Could not find user");
      }
      return user;
    },
  },
  Mutation: {
    createUser: (
      root: never,
      args: Omit<User, "id" | "pwd_hash">,
      context: GraphQLContext
    ): Promise<UserNoPWD> => {
      return insertUser(args);
    },
  },
};
