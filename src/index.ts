import RouteCore from './RouteCore'
import { CatchHandler, FinisherHandler } from './types.t'

export * from './types.t'
export default function RouteWrapper<
  TParams extends unknown[],
  TReturn = unknown
>(
  catcher?: CatchHandler<TParams>,
  finisher?: FinisherHandler<TParams, TReturn>
) {
  return RouteCore<TParams, TReturn>({ catcher: catcher, finisher })
}
