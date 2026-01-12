// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import { Link, Outlet } from "react-router";

function App() {
  return (
    <>
      <Link to="/" aria-label="Home">
        <img className="header" src="/wordmark.png" alt="" />
      </Link>
      <div className="page">
        <Outlet />
      </div>
    </>
  );
}

export default App;
