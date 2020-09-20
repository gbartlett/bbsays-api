import { AuthenticationError } from "apollo-server-express";
import { GraphQLContext } from "../../apolloServer";

export const validateRole = <R = any, A = any, I = any>(role: string) => (
	next: (root: R, args: A, context: GraphQLContext, info: I) => void
) => (root: R, args: A, context: GraphQLContext, info: I): R => {
	if (!context.user) {
		throw new AuthenticationError("Error");
	}

	if (context.user.email !== role) {
		throw new AuthenticationError(
			`User does not have the role: ${role.toLocaleLowerCase()}.`
		);
	}

	return (next(root, args, context, info) as unknown) as R;
};
