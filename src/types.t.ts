export type RouteOptions<TParams extends any[], TReturn = unknown> = {
  errorHandler?: ErrorHandler<TParams>
  finisher?: FinisherHandler<TParams, TReturn>
  middlewares?: RouteHandler<TParams, TReturn>[]
}

export type RouteHandler<TParams extends any[], TReturn = unknown> = (
  ...args: TParams
) => TReturn | Promise<TReturn> | void | Promise<void>

export type FinisherHandler<TParams extends any[], TReturn = unknown> = (
  data: TReturn | void,
  ...args: TParams
) => unknown

export type ErrorHandler<TParams extends any[]> = (
  err: any,
  ...args: TParams
) => unknown
