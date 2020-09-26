import { AuthenticationError } from "apollo-server-express";
import { GraphQLContext } from "../../../apolloServer";
import * as UserDB from "../../../db/users";
import { userResolvers } from "../users";

describe.only("User Resolvers", () => {
  const contextUser = {
    id: 1,
    first_name: "test",
    last_name: "coach",
    email: "test@test.com",
    role: UserDB.ROLES.COACH,
    coach_id: null,
    refresh_token: "SOME-TOKEN",
  };

  const client = {
    id: 2,
    first_name: "test",
    last_name: "client",
    email: "test_client@test.com",
    role: UserDB.ROLES.CLIENT,
    coach_id: 1,
    refresh_token: "SOME-TOKEN",
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

  describe("clients", () => {
    let mockGetClients: jest.SpyInstance;

    beforeEach(() => {
      mockGetClients = jest.spyOn(UserDB, "getClients");
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("returns a coaches clients", async (done) => {
      const coachId = contextUser.id.toString();
      mockGetClients.mockResolvedValueOnce([client]);
      const clients = await userResolvers.Query.clients(null, { id: coachId });
      expect(clients).toHaveLength(1);
      expect(mockGetClients).toHaveBeenCalledWith(coachId);
      done();
    });

    it("throws an error if undefined is returned", async (done) => {
      const coachId = contextUser.id.toString();
      mockGetClients.mockResolvedValueOnce(undefined);
      try {
        await userResolvers.Query.clients(null, { id: coachId });
      } catch (error) {
        console.log(error.message);
        expect(error.message).toBe("An error occured while fetching clients");
      }
      done();
    });
  });
});
