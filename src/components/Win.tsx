import "./Win.scss";
import "animate.css";
import { useEffect } from "react";
import { Link } from "react-router";

interface WinProps {
  closeWinScreen?: () => void; // should exist if `canBeHidden` is true
  canBeHidden: boolean; // true if the user can close the win screen to view the completed puzzle
}

export default function Win(props: WinProps) {
  const setTitleClass = () => {
    document
      .getElementById("title")
      ?.classList.add("animate__animated", "animate__tada");
  };

  useEffect(() => {
    setTimeout(() => setTitleClass(), 1000);
  }, []);

  return (
    <div className="win animate__animated animate__bounceInDown">
      <div className="close-button">
        {props.canBeHidden && <button onClick={props.closeWinScreen}>✖</button>}
      </div>
      <div id="title">You won!</div>
      <div>
        <Link to="/">
          <button className="return-button">Return to Menu</button>
        </Link>
      </div>
    </div>
  );
}
