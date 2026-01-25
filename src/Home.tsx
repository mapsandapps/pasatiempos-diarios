import { Link } from "react-router";
import "./Home.scss";
import { isTodayInLocalStorage } from "./utils/localstorage";
import { GameString } from "./types";

export default function Home() {
  return (
    <>
      <div className="home-cards">
        <div className="card">
          <div className="card-header">Sílabas</div>
          <div className="card-body">
            <p className="description">
              Form Spanish words from their syllables and English definitions
              {/* Construct words based on syllables and definitions */}
            </p>
            <Link to="/silabas">
              <button>
                Play today's puzzle
                {isTodayInLocalStorage(GameString.Silabas) && " again"}
              </button>
              {isTodayInLocalStorage(GameString.Silabas) && " ✅"}
            </Link>
          </div>
        </div>
        <div className="card objeto-oculto">
          <div className="card-header">Objeto Oculto</div>
          <div className="card-body">
            <p className="description">Find images that match Spanish words</p>
            <Link to="/objeto-oculto">
              <button>
                Play today's puzzle
                {isTodayInLocalStorage(GameString.ObjetoOculto) && " again"}
              </button>
              {isTodayInLocalStorage(GameString.ObjetoOculto) && " ✅"}
            </Link>
          </div>
        </div>
        <div className="card inactive">
          <div className="card-header">
            Alphabet Game
            {/* <img className="beta" src="/beta.png" /> */}
          </div>
          <div className="card-body">
            <p className="description">Info coming soon</p>
            <button disabled>Coming soon</button>
          </div>
        </div>
        <div className="card inactive">
          <div className="card-header">
            Memoria
            {/* <img className="beta" src="/beta.png" /> */}
          </div>
          <div className="card-body">
            <p className="description">Info coming soon</p>
            <button disabled>Coming soon</button>
          </div>
        </div>
      </div>
      <div className="home-footer">
        <Link to="/credits">Credits</Link>
      </div>
    </>
  );
}
