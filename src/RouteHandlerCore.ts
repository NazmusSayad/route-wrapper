import { Handlers, ErrorHandler, RouteOptions } from './types.t'

export default function RouteHandlerCore<TParams extends any[]>(
  options: RouteOptions<TParams>
) {
  const config = {
    middlewares: options.middlewares ?? [],
    errorHandlers: options.errorHandlers ?? [],
  }

  function handleError(...args: [err: any, ...params: TParams]) {
    const allHandlers = [...config.errorHandlers]

    const wrappedHandlers = allHandlers.map((handler, ind) => {
      return async () => {
        const nextFn = wrappedHandlers[ind + 1]
        const rv = handler(() => nextFn && nextFn(), ...args)
        if (rv instanceof Promise) await rv
        return rv
      }
    })

    const firstFn = wrappedHandlers[0]
    return firstFn && firstFn()
  }

  function RouteHandlerInner(...handlers: Handlers<TParams>[]) {
    const allHandlers = [...config.middlewares, ...handlers]

    return async function (...args: TParams) {
      const wrappedHandlers = allHandlers.map((handler, ind) => {
        return async () => {
          const nextFn = wrappedHandlers[ind + 1]

          try {
            const rv = handler((err) => {
              if (err) throw err
              return nextFn && nextFn()
            }, ...args)

            if (rv instanceof Promise) await rv
            return rv
          } catch (err) {
            if (!config.errorHandlers.length) throw err
            return await handleError(err, ...args)
          }
        }
      })

      const firstFn = wrappedHandlers[0]
      return firstFn && firstFn()
    }
  }

  RouteHandlerInner.clone = function () {
    return RouteHandlerCore({ ...config })
  }

  RouteHandlerInner.catch = function (...handlers: ErrorHandler<TParams>[]) {
    return RouteHandlerCore({
      ...config,
      errorHandlers: [...config.errorHandlers, ...handlers],
    })
  }

  RouteHandlerInner.use = function (...handlers: Handlers<TParams>[]) {
    return RouteHandlerCore({
      ...config,
      middlewares: [...config.middlewares, ...handlers],
    })
  }

  return RouteHandlerInner
}
