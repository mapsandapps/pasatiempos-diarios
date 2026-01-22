import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Credits from "./credits/Credits.tsx";
import Silabas from "./silabas/Silabas.tsx";
import ObjetoOculto from "./objeto-oculto/ObjetoOculto.tsx";
import SilabasGenerator from "./silabas/Generator.tsx";
import Home from "./Home.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: Home },
      { path: "credits", Component: Credits },
      { path: "silabas", Component: Silabas },
      { path: "objeto-oculto", Component: ObjetoOculto },
      { path: "silabas-generator", Component: SilabasGenerator },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <>
    <RouterProvider router={router} />
  </>
);
