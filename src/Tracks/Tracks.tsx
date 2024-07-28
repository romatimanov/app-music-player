import { useEffect, useState } from "react";
import { TrackList } from "../TrackList/TrackList";
import { Track } from "../models/models";
import { useFilterTrack } from "../hook/useFilterTrack";
import React from "react";
import { useGetTracksQuery } from "../store/action/actionApi";

interface TracksProps {
  initialTracks: Track[];
  searchValue: string;
}

export function Tracks({ initialTracks, searchValue }: TracksProps) {
  const [songs, setSongs] = useState<Track[]>(initialTracks);
  const { filteredSongs } = useFilterTrack(songs, searchValue);
  const { data } = useGetTracksQuery();

  useEffect(() => {
    if (data) {
      setSongs(data);
    }
  }, [data]);

  return (
    <TrackList title="Треки" tracks={filteredSongs} searchValue={searchValue} />
  );
}
