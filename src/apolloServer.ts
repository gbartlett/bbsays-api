import { UserNoPWD } from "./db/users";
import typeDefs from "./graphql/typesDefs";
import resolvers from "./graphql/resolvers";
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";
import { authMiddleware } from "./graphql/middleware/authMiddleware";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { validateToken } from "./jwt";

export interface GraphQLContext {
	user?: UserNoPWD;
}

const getGraphQLContext = (expressCtx: ExpressContext): GraphQLContext => {
	if (expressCtx.req.headers.authorization) {
		const decoded = validateToken(expressCtx.req.headers.authorization);
		return { user: decoded.user };
	}

	return {};
};

const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
});

const schemaWithMiddleware = applyMiddleware(schema, authMiddleware);

export const graphQLServer = new ApolloServer({
	typeDefs,
	resolvers,
	schema: schemaWithMiddleware,
	context: getGraphQLContext,
});
