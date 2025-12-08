// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import { Link, Outlet } from "react-router";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <Link to="/">
        <div className="header">Pasatiempos Diarios</div>
      </Link>
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div> */}
      <div className="page">
        <Outlet />
      </div>
    </>
  );
}

export default App;
