import "../Home.scss";

export default function Credits() {
  return (
    <div className="home-credits">
      <h1>Credits</h1>
      <ul>
        <li>
          App code, game design, & UI design by{" "}
          <a href="https://github.com/mapsandapps" target="_blank">
            Shawn Taylor
          </a>
        </li>
        <li>
          Emoji from{" "}
          <a href="https://github.com/twitter/twemoji" target="_blank">
            twemoji
          </a>
          , licensed CC-BY-4.0
        </li>
        <li>
          Fonts from{" "}
          <a
            href="https://fonts.google.com/specimen/Barriecito"
            target="_blank"
          >
            Google Fonts
          </a>
        </li>
        <li>
          <img className="header" src="/wordmark.png" alt="" /> app logo by
          Shawn Taylor
        </li>
      </ul>
    </div>
  );
}
