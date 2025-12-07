import "./App.css";

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
          <a href="./silabas">
            <button>Play today's puzzle</button>
          </a>
        </div>
      </div>
      <div className="card inactive">
        <div className="card-header">Hidden Object</div>
        <div className="card-body">
          <p className="description">Find images that match Spanish words</p>
          <a href="./silabas" aria-disabled>
            <button disabled>Coming soon</button>
          </a>
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
