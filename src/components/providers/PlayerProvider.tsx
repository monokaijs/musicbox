import {ReactNode, useEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import apiService from "@/services/api.service";
import {RepeatMode, setPlayer} from "@/redux/slices/player.slice";

interface PlayerProviderProps {
  children: ReactNode;
}

export let playerEl: HTMLAudioElement | null = null;

export default function PlayerProvider({children}: PlayerProviderProps) {
  const dispatch = useAppDispatch();
  const [playingTrack, setPlayingTrack] = useState<YouTubeTrack | null>(null);
  const {repeatMode, queue, playingIndex, currentTime, shouldUpdateBySeek, volumeLevel} = useAppSelector(state => state.player);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef && audioRef.current) {
      const el = audioRef.current;
      playerEl = el;
      el.onpause = () => {
        dispatch(setPlayer({
          paused: el.paused,
        }))
      }
      el.ontimeupdate = () => {
        dispatch(setPlayer({
          currentTime: el.currentTime
        }))
      }
      el.onended = () => {
        if (playingIndex === queue.length - 1) {
          if (repeatMode === RepeatMode.REPEAT_ALL) {
            // Go to begin of the queue
            dispatch(setPlayer({
              playingIndex: 0,
            }))
          } else if (repeatMode === RepeatMode.REPEAT_ONE) {
            el.currentTime = 0;
            el.play();
          } else {
            // nothing
          }
        } else {
          dispatch(setPlayer({
            playingIndex: playingIndex + 1,
          }));
        }
      };
      el.onpause = () => dispatch(setPlayer({paused: el.paused}));
      el.onplay = () => dispatch(setPlayer({paused: el.paused}));
      el.onplaying = () => dispatch(setPlayer({paused: el.paused}));
      el.onloadstart = () => dispatch(setPlayer({loading: true}));
      el.oncanplay = () => dispatch(setPlayer({loading: false}));
    }
  }, [audioRef.current]);

  useEffect(() => {
    const el = audioRef.current;
    if (queue && queue.length > 0 && playingIndex > -1 && queue[playingIndex] && queue[playingIndex].id !== playingTrack?.id && el) {
      el.pause();
      const currentTrack = queue[playingIndex];
      apiService.getPlayableUrl(currentTrack.id).then(response => {
        const track = response.data[0];
        const url = track.url;
        if (!audioRef.current) return;
        audioRef.current.src = url;
        audioRef.current.play().then(() => {
          setPlayingTrack(track);
        });
      });
    }
  }, [queue, playingIndex]);

  useEffect(() => {
    const el = audioRef.current;
    if (shouldUpdateBySeek && el && el.currentTime !== currentTime) {
      el.currentTime = currentTime;
      dispatch(setPlayer({
        shouldUpdateBySeek: false,
      }))
    }
  }, [shouldUpdateBySeek]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (volumeLevel !== audioRef.current.volume) {
      audioRef.current.volume = volumeLevel / 100;
    }
  }, [volumeLevel]);

  return <>
    <audio
      ref={audioRef}
    />
    {children}
  </>
}
