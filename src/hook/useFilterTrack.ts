import { useEffect, useState } from "react";
import { Track } from "../models/models";

export function useFilterTrack(
  initialTracks: Track[],
  searchValue: string,
  songs: Track[] = initialTracks
) {
  const [filteredSongs, setFilteredSongs] = useState<Track[]>(initialTracks);

  useEffect(() => {
    setFilteredSongs(
      songs.filter(
        (song) =>
          song.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          song.album.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          song.artist.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [songs, searchValue]);

  return { filteredSongs };
}
