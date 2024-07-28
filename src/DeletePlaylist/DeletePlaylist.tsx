import { useNavigate } from "react-router-dom";
import "./deletePlaylist.css";
import React from "react";
import {
  useDaeletePlaylistsMutation,
  useGetPlaylistsQuery,
} from "../store/action/actionApi";
type DeleteProps = {
  closeLoginModal: () => void;
  id: string;
};

export function Delete({ closeLoginModal, id }: DeleteProps) {
  const [deletePlaylist, { isError }] = useDaeletePlaylistsMutation();
  const navigate = useNavigate();
  const { refetch } = useGetPlaylistsQuery();

  const onDelete = async () => {
    await deletePlaylist({ id: id });
    closeLoginModal();
    refetch();
    navigate("/");
  };

  const onCancel = () => {
    closeLoginModal();
  };

  return (
    <div className="delete-playlist">
      <p className="delete-playlist__text">Удалить плейлист?</p>
      <div className="delete-btn__group">
        <button className="delete-btn delete-btn__yes" onClick={onDelete}>
          Да
        </button>
        <button className="delete-btn delete-btn__no" onClick={onCancel}>
          Отмена
        </button>
      </div>
      {isError && (
        <p className="delete-playlist__error">Ошибка при удалении плейлиста</p>
      )}
    </div>
  );
}
