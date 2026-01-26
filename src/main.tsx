import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Credits from "./credits/Credits.tsx";
import Settings from "./settings/Settings.tsx";
import Silabas from "./silabas/Silabas.tsx";
import SilabasGenerator from "./silabas/Generator.tsx";
import ObjetoOculto from "./objeto-oculto/ObjetoOculto.tsx";
import Memoria from "./memoria/Memoria.tsx";
import MemoriaGenerator from "./memoria/MemoriaGenerator.tsx";
import Home from "./Home.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: Home },
      { path: "credits", Component: Credits },
      { path: "settings", Component: Settings },
      { path: "silabas", Component: Silabas },
      { path: "silabas-generator", Component: SilabasGenerator },
      { path: "objeto-oculto", Component: ObjetoOculto },
      { path: "memoria", Component: Memoria },
      { path: "memoria-generator", Component: MemoriaGenerator },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <>
    <RouterProvider router={router} />
  </>,
);
