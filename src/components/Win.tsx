import "./Win.scss";
import { Link } from "react-router";

interface WinProps {
  closeWinScreen?: () => void; // should exist if `canBeHidden` is true
  canBeHidden: boolean; // true if the user can close the win screen to view the completed puzzle
}

export default function Win(props: WinProps) {
  return (
    <div className="win">
      <div className="close-button">
        {props.canBeHidden && <button onClick={props.closeWinScreen}>✖</button>}
      </div>
      <div>You won!</div>
      <div>
        <Link to="/">
          <button className="return-button">Return to Menu</button>
        </Link>
      </div>
    </div>
  );
}
