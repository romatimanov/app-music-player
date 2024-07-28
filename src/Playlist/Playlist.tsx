import { TrackList } from "../TrackList/TrackList";
import { Track } from "../models/models";
import React from "react";
import {
  useDeleteSongPlaylistsMutation,
  useGetPlaylistsIdQuery,
} from "../store/action/actionApi";
import { useParams } from "react-router-dom";

interface PlaylistProps {
  initialTracks: Track[];
  searchValue: string;
}

export function Playlist({ searchValue }: PlaylistProps) {
  const { playlistId: urlPlaylistId } = useParams<{ playlistId: string }>();
  const { data: playlists, refetch } = useGetPlaylistsIdQuery(
    {
      id: urlPlaylistId as string,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [triggerDeleteSong] = useDeleteSongPlaylistsMutation();

  const deleteSong = async (urlPlaylistId: string, trackId: string) => {
    await triggerDeleteSong({ id: urlPlaylistId, songId: trackId });
    refetch();
  };

  const handleDeleteSong = async (songId: string) => {
    try {
      await deleteSong(urlPlaylistId as string, songId);
      refetch();
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  return (
    <div className="playlist">
      <TrackList
        title={playlists?.name || "Tracks"}
        tracks={playlists?.songs || []}
        searchValue={searchValue}
        onDeleteSong={handleDeleteSong}
        refetchPlaylist={refetch}
      />
    </div>
  );
}
