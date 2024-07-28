import "./aside.css";
import iconMusic from "/public/image/icon-music.png";
import iconPlay from "/public/image/icon-play.png";
import { useState } from "react";
import { Modal } from "../Modal/Modal";
import { Delete } from "../DeletePlaylist/DeletePlaylist";
import { useModal } from "../hook/useModal";
import { Link, useLocation } from "react-router-dom";
import deleteIcon from "/public/image/delete.png";
import {
  useAddPlaylistsMutation,
  useGetPlaylistsQuery,
} from "../store/action/actionApi";
import React from "react";

export function Aside() {
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState<string>("");
  const [addPlaylists] = useAddPlaylistsMutation();
  const { data: playlists, refetch } = useGetPlaylistsQuery();
  const {
    isOpen: isOpenLogin,
    openModal: openLoginModal,
    closeModal: closeLoginModal,
  } = useModal();

  const location = useLocation();
  const currentPath = location.pathname;

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName) {
      setHasError(true);
    } else {
      setHasError(false);
      try {
        await addPlaylists({ name: newPlaylistName }).unwrap();
        setNewPlaylistName("");
        refetch();
      } catch (error) {
        console.error("Failed to create playlist:", error);
      }
    }
  };

  const handleSetActive = (playlistId: string | null) => {
    setActivePlaylistId(playlistId);
  };

  return (
    <section className="aside">
      <div className="aside-body">
        <div className="aside-create__content">
          <input
            type="text"
            className={`aside-create__input ${hasError ? "input-error" : ""}`}
            value={newPlaylistName}
            onChange={(e) => {
              setNewPlaylistName(e.target.value);
              setHasError(false);
            }}
          />
          <button className="aside-create__btn" onClick={handleCreatePlaylist}>
            Создать плейлист
          </button>
        </div>
        <ul className="aside-list">
          <Link to="/playlists" className="aside-item__link">
            <li
              className={`aside-item ${
                currentPath === "/playlists" ? "aside-item__active" : ""
              }`}
              onClick={() => handleSetActive("playlists")}
            >
              <img
                className="aside-item__icon"
                src={iconMusic}
                alt="Иконка музыки"
              />
              Плейлисты
            </li>
          </Link>
          <Link to="/" className="aside-item__link">
            <li
              className={`aside-item ${
                currentPath === "/" ? "aside-item__active" : ""
              }`}
              onClick={() => handleSetActive("/")}
            >
              <img
                src={iconPlay}
                alt="Иконка воспроизведения"
                className="aside-item__icon"
              />
              Треки
            </li>
          </Link>
          <Link to="/favorites" className="aside-item__link">
            <li
              className={`aside-item ${
                currentPath === "/favorites" ? "aside-item__active" : ""
              }`}
              onClick={() => handleSetActive("favorites")}
            >
              Любимые песни
            </li>
          </Link>
          {playlists?.map((playlist) => (
            <Link
              to={`/playlists/${playlist.id}`}
              key={playlist.id}
              className="aside-item__link"
            >
              <li
                className={`aside-item aside-item__playlist ${
                  currentPath === `/playlists/${playlist.id}`
                    ? "aside-item__active"
                    : ""
                }`}
                onClick={() => handleSetActive(playlist.id)}
              >
                {playlist.name}
                <button
                  onClick={() => {
                    openLoginModal();
                  }}
                  className="aside-playlist__delete"
                >
                  <img
                    className="aside-playlist__delete-img"
                    src={deleteIcon}
                    alt="delete"
                  />
                </button>
              </li>
            </Link>
          ))}
        </ul>
      </div>
      {isOpenLogin && activePlaylistId !== null && (
        <Modal onClose={closeLoginModal}>
          <Delete closeLoginModal={closeLoginModal} id={activePlaylistId} />
        </Modal>
      )}
    </section>
  );
}
