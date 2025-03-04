import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { SocketProvider } from "./context/SocketContext.jsx";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SocketProvider>
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ChakraProvider>
      </RecoilRoot>
    </SocketProvider>
  </StrictMode>
);
