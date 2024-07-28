import { PlaylistsType } from "../models/models";

type handleSelectType = {
  option: string | boolean;
  trackId: string;
  playlists?: PlaylistsType[];
  setOpenDropdowns: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  addSong: (playlistId: string, trackId: string) => void;
  deleteSong: (playlistId: string, trackId: string) => void;
  onDeleteSong?: (trackId: string) => Promise<void>;
  setNameMethod: React.Dispatch<React.SetStateAction<string>>;
  nameMethod: string;
};

export const handleOptionSelect = ({
  option,
  trackId,
  setOpenDropdowns,
  addSong,
  deleteSong,
  onDeleteSong,
  playlists,
  setNameMethod,
  nameMethod,
}: handleSelectType & { nameMethod: string }) => {
  if (typeof option === "boolean") {
    setNameMethod("");
    setOpenDropdowns((prevDropdowns) => ({
      ...prevDropdowns,
      [trackId]: false,
      [`add-${trackId}`]: false,
      [`remove-${trackId}`]: false,
    }));
  } else {
    if (playlists) {
      const selectedPlaylist = playlists.find(
        (playlist) => playlist.name === option
      );
      if (selectedPlaylist) {
        let trackAlreadyExists = false;

        playlists.forEach((playlist) => {
          if (playlist.id === selectedPlaylist.id) {
            playlist.songs.forEach((song) => {
              if (song.id === trackId) {
                trackAlreadyExists = true;
              }
            });
          }
        });

        if (!trackAlreadyExists && nameMethod === "add") {
          addSong(selectedPlaylist.id, trackId);
        } else if (trackAlreadyExists && nameMethod === "remove") {
          if (onDeleteSong) {
            onDeleteSong(trackId);
          }
          deleteSong(selectedPlaylist.id, trackId);
        }
      }
    }
    if (option === "Добавить в плейлист") {
      setNameMethod("add");
      setOpenDropdowns((prevDropdowns) => ({
        ...prevDropdowns,
        [trackId]: false,
        [`add-${trackId}`]: true,
      }));
    } else if (option === "Удалить из плейлиста") {
      setNameMethod("remove");
      setOpenDropdowns((prevDropdowns) => ({
        ...prevDropdowns,
        [trackId]: false,
        [`remove-${trackId}`]: true,
      }));
    } else {
      setOpenDropdowns((prevDropdowns) => ({
        ...prevDropdowns,
        [trackId]: false,
        [`add-${trackId}`]: false,
        [`remove-${trackId}`]: false,
      }));
    }
  }
};
