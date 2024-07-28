import { SongType } from "../hook/useFilterTrack";

export const handlePlayPause = (
  audioContext: AudioContext | null,
  audioBuffer: AudioBuffer | null,
  isPlaying: boolean,
  audioSource: React.MutableRefObject<AudioBufferSourceNode | null>,
  startTimeRef: React.MutableRefObject<number>,
  currentIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>,
  setCurrentTime: (time: number) => void,
  setIsPlaying: (isPlaying: boolean) => void,
  currentTime: number,
  volume: number,
  gainNode: React.MutableRefObject<GainNode | null>
) => {
  if (audioContext && audioBuffer) {
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    if (isPlaying) {
      if (audioSource.current) {
        audioSource.current.stop();
        const elapsedTime = audioContext.currentTime - startTimeRef.current;
        setCurrentTime(elapsedTime);
      }
      if (currentIntervalRef.current) {
        clearInterval(currentIntervalRef.current);
      }

      setIsPlaying(false);
    } else {
      if (audioSource.current) {
        audioSource.current.stop();
      }

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      // Ensure GainNode is connected
      if (gainNode.current) {
        source.connect(gainNode.current);
      } else {
        const newGainNode = audioContext.createGain();
        newGainNode.gain.value = volume;
        newGainNode.connect(audioContext.destination);
        gainNode.current = newGainNode;
        source.connect(gainNode.current);
      }

      source.start(0, currentTime % audioBuffer.duration);
      audioSource.current = source;
      startTimeRef.current = audioContext.currentTime - currentTime;
      setIsPlaying(true);
      currentIntervalRef.current = setInterval(() => {
        setCurrentTime(audioContext.currentTime - startTimeRef.current);
      }, 1000);
    }
  }
};

export const loadTrack = async (
  audioContext: AudioContext | null,
  setAudioBuffer: React.Dispatch<React.SetStateAction<AudioBuffer | null>>,
  currentTrack: SongType,
  setAudioContext: React.Dispatch<React.SetStateAction<AudioContext | null>>
) => {
  if (!audioContext) {
    const context = new AudioContext();
    setAudioContext(context);
  }

  if (audioContext) {
    try {
      const response = await fetch(
        `http://localhost:3000/songs/${
          currentTrack.artist.name + " " + currentTrack.name
        }.mp3`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = await audioContext.decodeAudioData(arrayBuffer);
      setAudioBuffer(buffer);
    } catch (error) {
      console.error("Error loading track:", error);
    }
  }
};

interface handleSelectType {
  findCurrentTrackIndex: () => number;
  tracks: SongType[];
  playTrack: (song: SongType) => void;
}

export const handleNext = ({
  findCurrentTrackIndex,
  tracks,
  playTrack,
}: handleSelectType) => {
  const currentIndex = findCurrentTrackIndex();
  if (currentIndex !== -1) {
    const nextIndex = (currentIndex + 1) % tracks.length;
    playTrack(tracks[nextIndex]);
  }
};

export const handlePrev = ({
  findCurrentTrackIndex,
  tracks,
  playTrack,
}: handleSelectType) => {
  const currentIndex = findCurrentTrackIndex();
  if (currentIndex !== -1) {
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    playTrack(tracks[prevIndex]);
  }
};
export const handleShuffle = ({
  findCurrentTrackIndex,
  tracks,
  playTrack,
}: handleSelectType) => {
  const currentIndex = findCurrentTrackIndex();
  if (currentIndex !== -1) {
    const randomIndex = Math.floor(Math.random() * tracks.length);
    playTrack(tracks[randomIndex]);
  }
};

export const handleRepeat = (
  audioSource: React.MutableRefObject<AudioBufferSourceNode | null>,
  currentIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>,
  setCurrentTime: (time: number) => void,
  setIsPlaying: (isPlaying: boolean) => void
) => {
  if (audioSource.current && currentIntervalRef.current) {
    audioSource.current.stop();
    audioSource.current = null;
    setCurrentTime(0);
    clearInterval(currentIntervalRef.current);
    currentIntervalRef.current = null;
  }
  setIsPlaying(false);
};

export const handleProgressChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  setSliderValue: React.Dispatch<React.SetStateAction<number>>,
  currentTrack: SongType | null,
  audioContext: AudioContext | null,
  audioBuffer: AudioBuffer | null,
  audioSource: React.MutableRefObject<AudioBufferSourceNode | null>,
  setCurrentTime: (time: number) => void,
  startTimeRef: React.MutableRefObject<number>,
  gainNode: React.MutableRefObject<GainNode | null>
) => {
  const newSliderValue = Number(event.target.value);
  setSliderValue(newSliderValue);

  if (currentTrack && audioContext && audioBuffer) {
    const newCurrentTime =
      (newSliderValue / 1000) * Number(currentTrack.duration);

    if (audioSource.current) {
      audioSource.current.stop();
    }

    const newAudioSource = audioContext.createBufferSource();
    newAudioSource.buffer = audioBuffer;
    newAudioSource.connect(gainNode.current || audioContext.destination);
    newAudioSource.start(0, newCurrentTime % audioBuffer.duration);

    audioSource.current = newAudioSource;
    setCurrentTime(newCurrentTime / 1000);
    startTimeRef.current = audioContext.currentTime - newCurrentTime / 1000;
  }
};
// useEffect(() => {
//   if (isPlaying && audioSource.current && trackDurationInSeconds) {
//     currentIntervalRef.current = setInterval(() => {
//       setCurrentTime((prevTime) => {
//         const newTime = Math.min(prevTime + 1, trackDurationInSeconds);
//         setSliderValue((newTime / trackDurationInSeconds) * 1000);
//         return newTime;
//       });
//     }, 1000);
//   } else {
//     if (currentIntervalRef.current) {
//       clearInterval(currentIntervalRef.current);
//       currentIntervalRef.current = null;
//     }
//   }

//   return () => {
//     if (currentIntervalRef.current) {
//       clearInterval(currentIntervalRef.current);
//     }
//   };
// }, [isPlaying, currentTrack, trackDurationInSeconds]);
