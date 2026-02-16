import "./App.css";
import { Link, Outlet } from "react-router";
import { Analytics } from "@vercel/analytics/react";

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
      <Analytics />
    </>
  );
}

export default App;
