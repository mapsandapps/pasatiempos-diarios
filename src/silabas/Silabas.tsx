import Game from "./Game";
import "./Silabas.scss";

export default function Silabas() {
  const date = new Date().toLocaleDateString();

  return (
    <div id="silabas">
      <div>
        <h1>Sílabas</h1>
        <div>{date}</div>
        <div>
          Form Spanish words from their syllables and English definitions
        </div>
      </div>
      <div className="game">
        <Game />
      </div>
    </div>
  );
}
