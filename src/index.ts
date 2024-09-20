import RouteCore from './RouteCore'

export * from './types.t'
export default function SafeRoute<TParams extends any[]>() {
  return RouteCore<TParams>({})
}
