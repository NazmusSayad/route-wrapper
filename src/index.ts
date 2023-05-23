const defaultOptions: Options = { errorHandler() {}, middlewares: [] }
export function createRouter(options = {} as Partial<Options>) {
  const conf = { ...defaultOptions, ...options }

  return function (routes: Partial<RouteOptions>) {
    return (req: any, res: any) => {
      const methodHandlers = (routes as any)[req.method!.toLowerCase()]
      const isHandlerAvailable = Array.isArray(methodHandlers)
        ? Boolean(methodHandlers.length)
        : typeof methodHandlers === 'function'

      const rawHandler = isHandlerAvailable ? methodHandlers : routes.all
      if (!rawHandler) return

      const handlers = Array.isArray(rawHandler) ? rawHandler : [rawHandler]
      const allHandlers = [...conf.middlewares, ...handlers]

      const newList = allHandlers.map((handler, ind) => {
        return async () => {
          const nextFn = newList[ind + 1]

          try {
            const rv = handler(req, res, () => nextFn && nextFn())
            if (rv instanceof Promise) await rv
          } catch (err) {
            conf.errorHandler(err, req, res)
          }
        }
      })

      const firstFn = newList[0]
      firstFn && firstFn()
    }
  }
}

export default createRouter({
  errorHandler(err, req, res) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    })
  },
})

type RouterItem = Function | Function[]
interface RouteOptions {
  all: RouterItem
  get: RouterItem
  put: RouterItem
  post: RouterItem
  head: RouterItem
  patch: RouterItem
  trace: RouterItem
  delete: RouterItem
  connect: RouterItem
  options: RouterItem
}

interface Options {
  errorHandler(err: any, req: any, res: any): void
  middlewares: Function[]
}
