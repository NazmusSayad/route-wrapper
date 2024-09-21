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
      const wrappedHandlers = totalHandlers.map((handler, ind) => {
        return async () => {
          const nextFn = wrappedHandlers[ind + 1]

          try {
            let response = handler((err) => {
              if (err) throw err
              return nextFn && nextFn()
            }, ...args)

            while (response instanceof Promise) {
              response = await response
            }

            if (!options.finisher) return response
            return options.finisher(response, ...args)
          } catch (err) {
            if (!options.errorHandler) throw err
            return options.errorHandler(err, ...args)
          }
        }
      })

      const firstFn = wrappedHandlers[0]
      return firstFn && firstFn()
    }
  }

  ExecuteRoute.create = function <
    TInnerParams extends any[] = TParams,
    TInnerReturn = TReturn
  >(
    errHandler?: ErrorHandler<TInnerParams>,
    finisher?: FinisherHandler<TInnerParams, TInnerReturn>
  ) {
    return Core<TInnerParams, TInnerReturn>({
      ...options,
      finisher: finisher ?? (options.finisher as any),
      middlewares: [...((options.middlewares ?? []) as any[])],
      errorHandler: errHandler ?? (options.errorHandler as any),
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
