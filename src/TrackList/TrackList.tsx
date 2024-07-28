import "./trackList.css";
import dataIcon from "/public/image/data.png";
import timeIcon from "/public/image/time.png";
import { formatDate, formatTimeTrack } from "../utils/format";
import favotireSvg from "/public/image/icon/favorite.svg";
import { useState } from "react";
import dropIcon from "/public/image/drop-icon.png";
import { Dropdown } from "../DropDown/DropDown";
import { handleOptionSelect } from "../utils/handleSelect";
import { useLikeContext } from "../hook/useLikeContext";
import { useTrackContext } from "../hook/useTrackContext";
import { Track } from "../models/models";
import { useFilterTrack } from "../hook/useFilterTrack";
import React from "react";
import {
  useAddSongPlaylistsMutation,
  useDeleteSongPlaylistsMutation,
  useGetPlaylistsQuery,
} from "../store/action/actionApi";

interface TrackListProps {
  searchValue: string;
  tracks: Track[];
  title: string;
  onDeleteSong?: (songId: string) => Promise<void>;
  refetchPlaylist?: () => void;
}

export function TrackList({
  searchValue,
  tracks,
  title,
  onDeleteSong,
  refetchPlaylist,
}: TrackListProps) {
  const { filteredSongs } = useFilterTrack(tracks, searchValue);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );
  const { playTrack } = useTrackContext();
  const { likedTracks, toggleLike } = useLikeContext();
  const { data: playlists, refetch } = useGetPlaylistsQuery();
  const [triggerAddSong] = useAddSongPlaylistsMutation();
  const [triggerDeleteSong] = useDeleteSongPlaylistsMutation();

  const deleteSong = async (playlistId: string, trackId: string) => {
    await triggerDeleteSong({ id: playlistId, songId: trackId });
    refetch();
    if (refetchPlaylist) {
      refetchPlaylist();
    }
  };

  const addSong = async (playlistId: string, trackId: string) => {
    await triggerAddSong({ id: playlistId, songId: trackId });
    refetch();
    if (refetchPlaylist) {
      refetchPlaylist();
    }
  };

  const playSong = (song: Track) => {
    playTrack(song);
  };

  const handleDropdownToggle = (id: string) => {
    setOpenDropdowns((prevDropdowns) => ({
      ...prevDropdowns,
      [id]: !prevDropdowns[id],
    }));
    if (refetchPlaylist) {
      refetchPlaylist();
    }
  };

  return (
    <div className="tracks-list">
      <div className="tracks-title">{title}</div>
      <div className="tracks-content">
        <div className="tracks-header">
          <div className="tracks-header__title header-number">№</div>
          <div className="tracks-header__title header-name">НАЗВАНИЕ</div>
          <div className="tracks-header__title header-album">АЛЬБОМ</div>
          <div className="tracks-header__title header-data">
            <img src={dataIcon} alt="data" />
          </div>
          <div className="tracks-header__title header-time">
            <img src={timeIcon} alt="time" />
          </div>
        </div>
        <ul className="tracks-list">
          {filteredSongs.map((track) => {
            const isLiked = likedTracks.has(track.id);
            return (
              <li className="tracks-item" key={track.id}>
                <p className="tracks-item__number header-number">{track.id}</p>
                <div
                  className="tracks-item__name header-name"
                  onClick={() => playSong(track)}
                >
                  <img src={track.album.image} alt="album" />
                  <div className="tracks-item__name-group">
                    <p className="tracks-item__title">{track.name}</p>
                    <p className="tracks-item__time">{track.artist.name}</p>
                  </div>
                </div>
                <p className="tracks-item__album header-album">
                  {track.album.name}
                </p>
                <p className="tracks-item__data header-data">
                  {formatDate(track.createdAt)}
                </p>
                <div className="tracks-item__group header-time">
                  <svg
                    className={`favorite-icon ${
                      isLiked ? "favorite-icon__active" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(track.id, track.name);
                    }}
                  >
                    <use xlinkHref={`${favotireSvg}#favorite`} />
                  </svg>
                  <p className="tracks-item__time">
                    {formatTimeTrack(track.duration)}
                  </p>
                  <button
                    className="tracks-item__button"
                    onClick={() => handleDropdownToggle(track.id)}
                  >
                    <img src={dropIcon} alt="drop" />
                  </button>
                  {openDropdowns[track.id] && (
                    <Dropdown
                      key={`main-dropdown-${track.id}`}
                      options={["Добавить в плейлист", "Удалить из плейлиста"]}
                      onSelect={(option) =>
                        handleOptionSelect({
                          option,
                          trackId: track.id,
                          playlists: playlists,
                          nameMethod: "remove",
                          setNameMethod: () => {},
                          setOpenDropdowns,
                          addSong,
                          deleteSong,
                          onDeleteSong: onDeleteSong,
                        })
                      }
                      isOpen={true}
                      selectedOption={null}
                    />
                  )}
                  {openDropdowns[`add-${track.id}`] && playlists && (
                    <div className="nested-dropdown">
                      <Dropdown
                        key={`add-dropdown-${track.id}`}
                        options={playlists.map((playlist) => playlist.name)}
                        onSelect={(option) =>
                          handleOptionSelect({
                            option,
                            trackId: track.id,
                            playlists: playlists,
                            nameMethod: "add",
                            setNameMethod: () => {},
                            setOpenDropdowns,
                            addSong,
                            deleteSong,
                            onDeleteSong: onDeleteSong,
                          })
                        }
                        isOpen={true}
                        selectedOption={null}
                      />
                    </div>
                  )}
                  {openDropdowns[`remove-${track.id}`] && playlists && (
                    <div className="nested-dropdown">
                      <Dropdown
                        key={`remove-dropdown-${track.id}`}
                        options={playlists
                          .filter((playlist) =>
                            playlist.songs.some((t) => t.id === track.id)
                          )
                          .map((playlist) => playlist.name)}
                        onSelect={(option) =>
                          handleOptionSelect({
                            option,
                            trackId: track.id,
                            playlists: playlists,
                            nameMethod: "remove",
                            setNameMethod: () => {},
                            setOpenDropdowns,
                            addSong,
                            deleteSong,
                            onDeleteSong: onDeleteSong,
                          })
                        }
                        isOpen={true}
                        selectedOption={null}
                      />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
