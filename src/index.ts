import RouteHandlerCore from './RouteHandlerCore'

export * from './types.t'
export default function SafeRoute<TParams extends any[]>() {
  return RouteHandlerCore<TParams>({})
}
