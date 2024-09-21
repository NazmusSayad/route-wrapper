import {
  RouteOptions,
  RouteHandler,
  ErrorHandler,
  FinisherHandler,
} from './types.t'

export default function Core<TParams extends any[], TReturn>(
  options: RouteOptions<TParams, TReturn>
) {
  function ExecuteRoute(...handlers: RouteHandler<TParams, TReturn>[]) {
    const totalHandlers = [...(options.middlewares ?? []), ...handlers]
    return async function (...args: TParams) {
      try {
        for (const handler of totalHandlers) {
          let response = handler(...args)
          while (response instanceof Promise) response = await response
        }

        console.warn('No response from handlers')
      } catch (exception: any) {
        while (exception instanceof Promise) exception = await exception

        if (exception instanceof Error) {
          if (!options.errorHandler) throw exception
          return options.errorHandler(exception, ...args)
        }

        if (!options.finisher) return exception
        return options.finisher(exception, ...args)
      }
    }
  }

  ExecuteRoute.create = function <
    TInnerParams extends any[] = TParams,
    TInnerReturn = TReturn
  >(
    catcher?: ErrorHandler<TInnerParams>,
    finisher?: FinisherHandler<TInnerParams, TInnerReturn>
  ) {
    return Core<TInnerParams, TInnerReturn>({
      ...options,
      finisher: finisher ?? (options.finisher as any),
      middlewares: [...((options.middlewares ?? []) as any[])],
      errorHandler: catcher ?? (options.errorHandler as any),
    })
  }

  ExecuteRoute.use = function <
    THandlers extends RouteHandler<TParams, TReturn>[]
  >(...handlers: THandlers) {
    return Core({
      ...options,
      middlewares: [...(options.middlewares ?? []), ...handlers],
    })
  }

  return ExecuteRoute
}
