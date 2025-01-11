import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./index.css";
import { store } from "./store/store.ts";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider
    clientId={
      "830837464571-lb91s99nkkbaghpoidd1pn8ijjq61ov3.apps.googleusercontent.com"
    }
  >
    <StrictMode>
      <Provider store={store}>
        <NextUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <App />
          </NextThemesProvider>
        </NextUIProvider>
      </Provider>
    </StrictMode>
  </GoogleOAuthProvider>
);
