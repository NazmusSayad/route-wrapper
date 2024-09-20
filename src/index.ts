import RouteCore from './RouteCore'
import { ErrorHandler, FinisherHandler } from './types.t'

export * from './types.t'
export default function SafeRoute<TParams extends unknown[], TReturn = unknown>(
  errorHandler?: ErrorHandler<TParams>,
  finisher?: FinisherHandler<TParams>
) {
  return RouteCore<TParams, TReturn>({ errorHandler, finisher })
}
