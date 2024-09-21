import RouteCore from './RouteCore'
import { ErrorHandler, FinisherHandler } from './types.t'

export * from './types.t'
export default function RouteWrapper<
  TParams extends unknown[],
  TReturn = unknown
>(
  catcher?: ErrorHandler<TParams>,
  finisher?: FinisherHandler<TParams, TReturn>
) {
  return RouteCore<TParams, TReturn>({ errorHandler: catcher, finisher })
}
