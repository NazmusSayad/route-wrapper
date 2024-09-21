export type RouteOptions<TParams extends any[], TReturn = unknown> = {
  middlewares?: RouteHandler<TParams>[]
  catcher?: CatchHandler<TParams>
  finisher?: FinisherHandler<TParams, TReturn>
}

export type RouteHandler<TParams extends any[]> = (
  ...args: TParams
) => void | Promise<void>

export type CatchHandler<TParams extends any[]> = (
  err: Error,
  ...args: TParams
) => unknown

export type FinisherHandler<TParams extends any[], TReturn = unknown> = (
  data: Exclude<TReturn | void, Error>,
  ...args: TParams
) => unknown
