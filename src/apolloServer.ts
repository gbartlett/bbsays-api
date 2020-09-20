import { UserNoPWD } from "./db/users";
import typeDefs from "./graphql/typesDefs";
import resolvers from "./graphql/resolvers";
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";

export interface GraphQLContext {
	user: UserNoPWD;
}

const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
});

export const graphQLServer = new ApolloServer({
	typeDefs,
	resolvers,
	schema,
	context: (expressCtx) => {
		return {};
	},
});
