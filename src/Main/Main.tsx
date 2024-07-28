import { Route, Routes } from "react-router-dom";
import { Playlist } from "../Playlist/Playlist";
import { Tracks } from "../Tracks/Tracks";
import { Favorites } from "../Favorites/Favorites";
import { useTokenContext } from "../hook/useTokenContext";
import { Playlists } from "../Playlists/Playlists";
import { Aside } from "../Aside/Aside";
import "./main.css";
import { Track } from "../models/models";
import React from "react";

interface MainProps {
  initialTracks: Track[];
  searchValue: string;
}

export function Main({ initialTracks, searchValue }: MainProps) {
  const { token } = useTokenContext();
  return (
    <section className="main">
      <Aside />
      <div className="main__body-content">
        {!token ? (
          <h1 className="main-title">
            Авторизуйтесь, чтобы увидеть список песен
          </h1>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <Tracks
                  initialTracks={initialTracks}
                  searchValue={searchValue}
                />
              }
            />
            <Route path="/playlists" element={<Playlists />} />
            <Route
              path="/favorites"
              element={
                <Favorites
                  initialTracks={initialTracks}
                  searchValue={searchValue}
                />
              }
            />
            <Route
              path="/playlists/:playlistId"
              element={
                <Playlist
                  initialTracks={initialTracks}
                  searchValue={searchValue}
                />
              }
            />
          </Routes>
        )}
      </div>
    </section>
  );
}
