export type RouteOptions<TParams extends any[]> = {
  errorHandler?: ErrorHandler<TParams>
  finisher?: FinisherHandler<TParams>
  middlewares?: RouteHandler<TParams>[]
}

export type RouteHandler<TParams extends any[], TReturn = unknown> = (
  next: (err?: unknown) => void,
  ...args: TParams
) => TReturn | Promise<TReturn> | void | Promise<void>

export type ErrorHandler<TParams extends any[]> = (
  err: any,
  ...args: TParams
) => unknown

export type FinisherHandler<TParams extends any[]> = (
  data: unknown,
  ...args: TParams
) => unknown
