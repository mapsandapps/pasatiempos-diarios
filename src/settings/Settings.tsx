import { useEffect, useState } from "react";
import "../Home.scss";
import {
  addSettingToLocalStorage,
  getSettingFromLocalStorage,
} from "../utils/localstorage";

export default function Settings() {
  // colorblind mode
  const [prefersColorblindMode, setPrefersColorblindMode] = useState(
    getSettingFromLocalStorage("prefersColorblindMode") == "true",
  );
  const handleColorblindOnChange = () => {
    setPrefersColorblindMode(!prefersColorblindMode);
  };
  // save colorblind preference to localstorage whenever it changes
  useEffect(() => {
    addSettingToLocalStorage("prefersColorblindMode", prefersColorblindMode);
  }, [prefersColorblindMode]);

  // argentinian bias
  const [hasArgentinianBias, setArgentinianBias] = useState(
    getSettingFromLocalStorage("hasArgentinianBias") == "true",
  );
  const handleArgentinianBiasChange = () => {
    setArgentinianBias(!hasArgentinianBias);
  };
  // save colorblind preference to localstorage whenever it changes
  useEffect(() => {
    addSettingToLocalStorage("hasArgentinianBias", hasArgentinianBias);
  }, [hasArgentinianBias]);

  return (
    <div className="home-settings">
      <h1>Settings</h1>
      <label>
        <input
          type="checkbox"
          name="colorblind-mode"
          checked={prefersColorblindMode}
          onChange={handleColorblindOnChange}
        />
        Colorblind Mode
      </label>
      <label>
        <input
          type="checkbox"
          name="argentinian-bias"
          checked={hasArgentinianBias}
          onChange={handleArgentinianBiasChange}
        />
        Prefer Using Argentinian Vocabulary
      </label>
    </div>
  );
}
