export type RouteOptions<TParams extends any[]> = {
  middlewares?: Handlers<TParams>[]
  errorHandlers?: ErrorHandler<TParams>[]
  finisher?: FinisherHandler<TParams>
}

export type ErrorHandler<TParams extends any[]> = (
  next: () => void,
  err: any,
  ...args: TParams
) => unknown

export type Handlers<TParams extends any[]> = (
  next: (err?: unknown) => void,
  ...args: TParams
) => unknown

export type FinisherHandler<TParams extends any[]> = (
  data: unknown,
  ...args: TParams
) => unknown
