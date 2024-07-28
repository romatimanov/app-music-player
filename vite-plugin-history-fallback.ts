import history from "connect-history-api-fallback";
import { createProxyMiddleware } from "http-proxy-middleware";

export default function historyFallback() {
  return {
    name: "history-fallback",
    configureServer(server) {
      server.middlewares.use(
        history({
          disableDotRule: true,
          htmlAcceptHeaders: ["text/html", "application/xhtml+xml"],
        })
      );
    },
  };
}
