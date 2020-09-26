import { AuthenticationError } from "apollo-server-express";
import { GraphQLContext } from "../../../apolloServer";
import { ROLES } from "../../../db/users";
import { userResolvers } from "../users";

describe.only("User Resolvers", () => {
  const contextUser = {
    id: 1,
    first_name: "test",
    last_name: "user",
    email: "test@test.com",
    role: ROLES.COACH,
    coach_id: 1,
    refresh_token: "SOM-TOKEN",
  };

  const context: GraphQLContext = { user: contextUser };

  describe("me", () => {
    it("returns the context user", () => {
      const result = userResolvers.Query.me(null, null, context);
      expect(result).toEqual(contextUser);
    });

    it("throws an Authentication error if there is no user in the graphql context", () => {
      expect(() => {
        userResolvers.Query.me(null, null, {});
      }).toThrow(AuthenticationError);
    });
  });
});
