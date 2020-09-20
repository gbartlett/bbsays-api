import { GraphQLFieldResolver, GraphQLResolveInfo } from "graphql";
import { GraphQLContext } from "../../apolloServer";

export const combineMiddlewares = (...middlewares: any[]) => async (
	resolve: GraphQLFieldResolver<any, GraphQLContext>,
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	parent: any,
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	args: any,
	context: GraphQLContext,
	info: GraphQLResolveInfo
): Promise<any> => {
	if (middlewares.length === 0) {
		return resolve(parent, args, context, info);
	}

	const mCopy = [...middlewares];
	const middleware = mCopy.pop();
	const next = (
		mParent = parent,
		mArgs = args,
		mContext = context,
		mInfo = info
	) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		return combineMiddlewares(...mCopy)(
			resolve,
			mParent,
			mArgs,
			mContext,
			mInfo
		);
	};

	return await middleware(next, parent, args, context, info);
};
