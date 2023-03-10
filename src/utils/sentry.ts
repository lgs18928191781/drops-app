import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'
import 'virtual:vite-plugin-sentry/sentry-config'
const dist = window.VITE_PLUGIN_SENTRY_CONFIG.dist
const release = window.VITE_PLUGIN_SENTRY_CONFIG.release

export function StartSentry(parmas: { app: any; router: any }) {
  Sentry.init({
    app: parmas.app,
    dsn: 'https://93303d5ab3984aacac0e6e6382aaf3dd@sentry.show3.space/2',
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(parmas.router),
        tracePropagationTargets: ['*'],
      }),
      new Sentry.Replay(),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    dist,
    release,
  })
}
