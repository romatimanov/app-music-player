import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Header } from "./Header/Header";
import { Main } from "./Main/Main";
import { Player } from "./Player/Player";
import React from "react";

function App() {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchInputChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <>
      <div className="container">
        <Routes>
          <Route
            path="*"
            element={
              <>
                <div className="main-body">
                  <Header onSearchInputChange={handleSearchInputChange} />
                  <Main searchValue={searchValue} initialTracks={[]} />
                </div>
              </>
            }
          />
        </Routes>
      </div>
      <Player />
    </>
  );
}

export default App;
