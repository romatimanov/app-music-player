import { useEffect, useState } from "react";
import { TrackList } from "../TrackList/TrackList";
import { Track } from "../models/models";
import { useFilterTrack } from "../hook/useFilterTrack";
import React from "react";
import { useGetFavoritreSongsQuery } from "../store/action/actionApi";

interface FavoritesProps {
  initialTracks: Track[];
  searchValue: string;
}

export function Favorites({ initialTracks, searchValue }: FavoritesProps) {
  const [songs, setSongs] = useState<Track[]>(initialTracks);
  const { filteredSongs } = useFilterTrack(songs, searchValue);
  const { data, refetch } = useGetFavoritreSongsQuery();

  useEffect(() => {
    if (data) {
      setSongs(data.songLikes);
    }
    refetch();
  }, [data, refetch]);

  return (
    <div className="favorites">
      <TrackList
        title="Любимые треки"
        tracks={filteredSongs}
        searchValue={searchValue}
      />
    </div>
  );
}
