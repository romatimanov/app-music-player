export type Album = {
  name: string;
  image: string;
};

export type Artist = {
  name: string;
};

export type Track = {
  id: string;
  name: string;
  album: Album;
  artist: Artist;
  createdAt: string;
  author: string;
  duration: string;
  likes: string;
};

export type PlaylistsType = {
  id: string;
  name: string;
  songs: Track[];
};

export interface MusicState {
  loading: boolean;
  error: string;
  tracks: Track[];
  songLikes: Track[];
}
