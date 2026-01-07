import { Link } from "react-router";
import "./Home.scss";
import { isTodayInLocalStorage } from "./utils/localstorage";

export default function Home() {
  return (
    <div className="main">
      <div className="card">
        <div className="card-header">Sílabas</div>
        <div className="card-body">
          <p className="description">
            Form Spanish words from their syllables and English definitions
            {/* Construct words based on syllables and definitions */}
          </p>
          <Link to="/silabas">
            <button>
              Play today's puzzle{isTodayInLocalStorage("silabas") && " again"}
            </button>
            {isTodayInLocalStorage("silabas") && " ✅"}
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
              {isTodayInLocalStorage("objeto-oculto") && " again"}
            </button>
            {isTodayInLocalStorage("objeto-oculto") && " ✅"}
          </Link>
        </div>
      </div>
      <div className="card inactive">
        <div className="card-header">Alphabet Game</div>
        <div className="card-body">
          <p className="description">Info coming soon</p>
          <button disabled>Coming soon</button>
        </div>
      </div>
    </div>
  );
}
