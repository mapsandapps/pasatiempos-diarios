import "./App.css";
import { Link, Outlet } from "react-router";

function App() {
  return (
    <>
      <div className="header">
        <Link to="/" aria-label="Home">
          <img src="/wordmark.png" alt="" />
        </Link>
      </div>
      <div className="page">
        <Outlet />
      </div>
    </>
  );
}

export default App;
