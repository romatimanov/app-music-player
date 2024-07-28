import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { setupStore } from "./store/store.js";
import { TokenProvider } from "./Provider/TokenProvider";
import { LikeProvider } from "./Provider/LikeProvider";
import { TrackProvider } from "./Provider/TrackProvider";
import App from "./App";

const modalRoot = document.createElement("div");
modalRoot.setAttribute("id", "modal-root");
document.body.append(modalRoot);
const queryClient = new QueryClient();

const store = setupStore();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <TokenProvider>
          <LikeProvider>
            <TrackProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </TrackProvider>
          </LikeProvider>
        </TokenProvider>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
