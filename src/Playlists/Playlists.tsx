import { Link } from "react-router-dom";
import "./playlists.css";
import React from "react";
import { useGetPlaylistsQuery } from "../store/action/actionApi";

export function Playlists() {
  const { data: playlists } = useGetPlaylistsQuery();
  return (
    <div className="playlists">
      <h2 className="playlists-title">Плейлисты</h2>
      <ul className="playlists-list">
        {playlists?.map((playlist) => (
          <Link to={`/playlists/${playlist.id}`} key={playlist.id}>
            <li className="playlists-item">
              <div className="playlists-image">
                <img
                  className="playlists-img"
                  src={
                    playlist.songs && playlist.songs.length > 0
                      ? playlist.songs[0]?.album.image
                      : "./public/image/notphoto.png"
                  }
                  alt="playlist"
                />
              </div>
              <h2 className="playlists-title__name">{playlist.name}</h2>
              <p className="playlists-text">
                {playlist.songs.length + " треков"}
              </p>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
