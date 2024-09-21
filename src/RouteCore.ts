import {
  RouteOptions,
  RouteHandler,
  CatchHandler,
  FinisherHandler,
} from './types.t'

export default function RouteCore<TParams extends any[], TReturn>(
  options: RouteOptions<TParams, TReturn>
) {
  const ExecuteRoute: ExecuteRoute<TParams, TReturn> = function (...handlers) {
    const totalHandlers = [...(options.middlewares ?? []), ...handlers]

    return async function (...args) {
      try {
        for (const handler of totalHandlers) {
          let response = handler(...args)
          while (response instanceof Promise) response = await response
        }

        console.warn('No response from handlers')
      } catch (exception: any) {
        while (exception instanceof Promise) exception = await exception

        if (exception instanceof Error) {
          if (!options.catcher) throw exception
          return options.catcher(exception, ...args)
        }

        if (!options.finisher) return exception
        return options.finisher(exception, ...args)
      }
    }
  }

  ExecuteRoute.create = function (catcher, finisher) {
    return RouteCore({
      ...options,
      finisher: finisher ?? (options.finisher as any),
      middlewares: [...((options.middlewares ?? []) as any[])],
      catcher: catcher ?? (options.catcher as any),
    })
  }

  ExecuteRoute.use = function (...handlers) {
    return RouteCore({
      ...options,
      middlewares: [...(options.middlewares ?? []), ...handlers],
    })
  }

  return ExecuteRoute
}

export type ExecuteRoute<TParams extends any[], TReturn> = {
  (...handlers: RouteHandler<TParams>[]): (...args: TParams) => Promise<any>

  create<TInnerParams extends any[] = TParams, TInnerReturn = TReturn>(
    catcher?: CatchHandler<TInnerParams>,
    finisher?: FinisherHandler<TInnerParams, TInnerReturn>
  ): ExecuteRoute<TInnerParams, TInnerReturn>

  use<THandlers extends RouteHandler<TParams>[]>(
    ...handlers: THandlers
  ): ExecuteRoute<TParams, TReturn>
}
