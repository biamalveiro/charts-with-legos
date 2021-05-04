import { useEffect, useState, React } from "react";
import { isEmpty, isNull } from "lodash";
import Select from "react-select";

import themes from "./top_themes.json";

import "./App.css";
import LegoSwarm from "./LegoSwarm";

function App() {
  const [theme, setTheme] = useState(null);
  const [sets, setSets] = useState([]);

  const getSets = async (theme_id) => {
    const res = await fetch("/api/getSets", {
      method: "POST",
      body: JSON.stringify({ theme_id }),
    });
    const setsData = await res.json();
    setSets(setsData);
  };

  useEffect(() => {
    if (!isNull(theme)) {
      getSets(theme.value);
    }
  }, [theme]);

  const updateTheme = (selectedTheme) => {
    if (theme?.value !== selectedTheme.value) {
      setTheme(selectedTheme);
    }
  };

  return (
    <div className="w-9/12 m-auto my-5">
      <Select
        value={theme}
        options={themes}
        isSearchable={true}
        onChange={updateTheme}
      />
      {!isEmpty(sets) ? <LegoSwarm sets={sets} /> : null}
    </div>
  );
}

export default App;
