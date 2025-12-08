import { Link } from "react-router";
import "./Home.scss";

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
            <button>Play today's puzzle</button>
          </Link>
        </div>
      </div>
      <div className="card inactive">
        <div className="card-header">Hidden Object</div>
        <div className="card-body">
          <p className="description">Find images that match Spanish words</p>
          <button disabled>Coming soon</button>
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
