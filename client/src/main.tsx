import ReactDOM from "react-dom/client";

import App from "./App.tsx";

import "./styles/index.css";

import { AuthProvider } from "./context/AuthContext";
import { DropdownProvider } from "./context/DropdownContext";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(

  <AuthProvider>

    <DropdownProvider>

      <App />

    </DropdownProvider>

  </AuthProvider>
);