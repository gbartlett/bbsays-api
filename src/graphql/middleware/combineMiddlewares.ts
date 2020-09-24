import { GraphQLFieldResolver, GraphQLResolveInfo } from "graphql";
import { GraphQLContext } from "../../apolloServer";

export const combineMiddlewares = (...middlewares: any[]) => async (
  resolve: GraphQLFieldResolver<any, GraphQLContext>,
  parent: any,
  args: any,
  context: GraphQLContext,
  info: GraphQLResolveInfo,
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
    mInfo = info,
  ) => {
    return combineMiddlewares(...mCopy)(
      resolve,
      mParent,
      mArgs,
      mContext,
      mInfo,
    );
  };
  return await middleware(next, parent, args, context, info);
};
