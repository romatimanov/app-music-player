import { useEffect, useState, useRef } from "react";
import favotireSvg from "/public/image/icon/favorite.svg";
import "./player.css";
import { useLikeContext } from "../hook/useLikeContext";
import { useTrackContext } from "../hook/useTrackContext";
import play from "/public/image/play.png";
import pause from "/public/image/play.png";
import repeat from "/public/image/repeat.png";
import next from "/public/image/next.png";
import prev from "/public/image/prev.png";
import shuffle from "/public/image/shuffle.png";
import { formatPlayTime } from "../utils/format";
import volumeImg from "/public/image/volume.png";
import defaultAlbum from "/public/image/notphoto.png";
import {
  handleNext,
  handlePlayPause,
  handlePrev,
  handleProgressChange,
  handleRepeat,
  handleShuffle,
  loadTrack,
} from "../utils/playerUtils";
import { Track } from "../models/models";
import { useGetTracksQuery } from "../store/action/actionApi";
import React from "react";

export function Player() {
  const { currentTrack, playTrack } = useTrackContext();
  const { likedTracks, toggleLike } = useLikeContext();
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioSource = useRef<AudioBufferSourceNode | null>(null);
  const startTimeRef = useRef(0);
  const currentIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [sliderValue, setSliderValue] = useState(0);
  const [volume, setVolume] = useState(1);
  const gainNode = useRef<GainNode | null>(null);
  const { data } = useGetTracksQuery();

  useEffect(() => {
    if (data) {
      setTracks(data.tracks);
    }
  }, [data]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(event.target.value);
    setVolume(newVolume);

    if (gainNode.current) {
      gainNode.current.gain.value = newVolume;
    }
  };

  const findCurrentTrackIndex = () => {
    if (currentTrack) {
      return tracks.findIndex((item) => item.id === currentTrack.id);
    }
    return -1;
  };

  useEffect(() => {
    const songStr = localStorage.getItem("currentTrack");
    if (songStr && !currentTrack) {
      playTrack(JSON.parse(songStr));
    }
    if (currentIntervalRef.current && audioSource.current) {
      clearInterval(currentIntervalRef.current);
      currentIntervalRef.current = null;
      audioSource.current.stop();
      setCurrentTime(0);
    }
    setIsPlaying(false);
  }, [playTrack, currentTrack]);

  useEffect(() => {
    if (currentTrack) {
      loadTrack(audioContext, setAudioBuffer, currentTrack, setAudioContext);
    }
  }, [currentTrack, audioContext]);

  useEffect(() => {
    if (audioContext) {
      const newGainNode = audioContext.createGain();
      newGainNode.gain.value = volume;
      newGainNode.connect(audioContext.destination);
      gainNode.current = newGainNode;

      return () => {
        newGainNode.disconnect();
      };
    }
  }, [audioContext]);

  useEffect(() => {
    if (gainNode.current) {
      gainNode.current.gain.value = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      if (currentIntervalRef.current) {
        clearInterval(currentIntervalRef.current);
      }
    };
  }, []);

  const remainingTime = currentTrack
    ? Math.max(Number(currentTrack.duration) / 1000 - currentTime, 0)
    : 0;
  const trackDurationInSeconds = Number(currentTrack?.duration) / 1000;
  const progressPercentage = currentTrack
    ? (currentTime / trackDurationInSeconds) * 100
    : 0;

  return (
    <div className="player-container">
      <div className="player">
        <div className="player-header">
          {currentTrack ? (
            <div className="song-content">
              <div className="song-image">
                <img src={currentTrack.album.image} alt="Альбом" />
              </div>
              <div className="song-group">
                <div className="song-artist__group">
                  <p className="song-artist">{currentTrack.artist.name}</p>
                  <svg
                    className={`favorite-icon ${
                      likedTracks.has(currentTrack.id)
                        ? "favorite-icon__active"
                        : ""
                    }`}
                    onClick={() =>
                      toggleLike(currentTrack.id, currentTrack.name)
                    }
                  >
                    <use xlinkHref={`${favotireSvg}#favorite`} />
                  </svg>
                </div>
                <p className="song-name">{currentTrack.name}</p>
              </div>
            </div>
          ) : (
            <div className="song-content">
              <div className="song-image">
                <img src={defaultAlbum} alt="Альбом" />
              </div>
              <p>Трек не выбран</p>
            </div>
          )}
          <div className="player-content">
            <div className="player-navigate">
              <button
                className="player__navigate__btn player-btn__dop"
                onClick={() =>
                  handleShuffle({
                    findCurrentTrackIndex,
                    tracks,
                    playTrack,
                  })
                }
              >
                <img src={shuffle} alt="shuffle" />
              </button>
              <button
                className="player__navigate__btn player-btn__dop"
                onClick={() =>
                  handlePrev({ findCurrentTrackIndex, tracks, playTrack })
                }
              >
                <img src={prev} alt="prev" />
              </button>
              <button
                className="player__navigate__btn"
                onClick={() =>
                  handlePlayPause(
                    audioContext,
                    audioBuffer,
                    isPlaying,
                    audioSource,
                    startTimeRef,
                    currentIntervalRef,
                    setCurrentTime,
                    setIsPlaying,
                    currentTime,
                    volume,
                    gainNode
                  )
                }
              >
                <img src={isPlaying ? pause : play} alt="play/pause" />
              </button>
              <button
                className="player__navigate__btn player-btn__dop"
                onClick={() =>
                  handleNext({ findCurrentTrackIndex, tracks, playTrack })
                }
              >
                <img src={next} alt="next" />
              </button>
              <button
                className="player__navigate__btn player-btn__dop"
                onClick={() =>
                  handleRepeat(
                    audioSource,
                    currentIntervalRef,
                    setCurrentTime,
                    setIsPlaying
                  )
                }
              >
                <img src={repeat} alt="repeat" />
              </button>
            </div>
          </div>
        </div>
        <div className="player-pos">
          <div className="player-status">
            <div className="player-time">{formatPlayTime(currentTime)}</div>
            <div className="player-progress__container">
              <input
                className="player-progress__input"
                type="range"
                min="0"
                max="1000"
                value={sliderValue}
                onChange={(event) =>
                  handleProgressChange(
                    event,
                    setSliderValue,
                    currentTrack,
                    audioContext,
                    audioBuffer,
                    audioSource,
                    setCurrentTime,
                    startTimeRef,
                    gainNode
                  )
                }
              />
              <div
                className="player-progress__bar"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="player-time">{formatPlayTime(remainingTime)}</div>
          </div>
          <div className="player-volume">
            <img src={volumeImg} alt="volume" />
            <input
              className="player-volume__input"
              type="range"
              id="radius"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
