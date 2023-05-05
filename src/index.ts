type RouterItem = Function | Function[]
interface Routes {
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

const defaultOptions: Options = { errorHandler() {}, middlewares: [] }

export default function Route(options = {} as Partial<Options>) {
  const conf = { ...defaultOptions, ...options }

  return function (routes: Partial<Routes>) {
    return (req: any, res: any) => {
      const rawHandler = (routes as any)[req.method!.toLowerCase()]
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
