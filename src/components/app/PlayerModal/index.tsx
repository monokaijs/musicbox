import styles from "./styles.module.scss";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {formatTime, getTrackThumbnail} from "@/utils/player.utils";
import {Button, ConfigProvider, Divider, Slider, Typography} from "antd";
import {CaretDownOutlined, CloseOutlined, HeartFilled, HeartOutlined} from "@ant-design/icons";
import {closePlayerModal, setPlayer} from "@/redux/slices/player.slice";
import {useEffect, useState} from "react";
import {addTrackToPlaylist, removeTrackFromPlaylist} from "@/redux/actions/playlist.actions";

export default function PlayerModal() {
  const [isFavorite, setIsFavorite] = useState(false);
  const dispatch = useAppDispatch();
  const [seekTime, setSeekTime] = useState(0);
  const {openModal, queue, playingIndex, currentTime} = useAppSelector(state => state.player);
  const favoritePlaylist = useAppSelector(state => state.app.playlists.find(x => x.id === 'FAVORITE'));
  const currentTrack = queue[playingIndex];

  useEffect(() => {
    const favoriteTracks = favoritePlaylist?.tracks || [];
    setIsFavorite(favoriteTracks.findIndex(x => x.id === currentTrack?.id) > -1);
  }, [favoritePlaylist]);

  useEffect(() => {
    setSeekTime(currentTime || 0);
  }, [currentTime]);

  if (!currentTrack) return;
  return <div
    className={styles.playerOuter + ` ${openModal ? styles.open : ''}`}
  >
    <div
      className={styles.bgArtwork}
      style={{
        backgroundImage: `url('${getTrackThumbnail(currentTrack)}')`
      }}
    />
    <div className={styles.controls}>
      <Button
        type={'text'}
        shape={"circle"}
        size={'large'}
        icon={<CloseOutlined/>}
        onClick={() => {
          dispatch(closePlayerModal());
        }}
      />
    </div>
    <div
      className={styles.figure}
      style={{
        backgroundImage: `url('${getTrackThumbnail(currentTrack)}')`
      }}
    />
    <div className={styles.meta}>
      <div className={styles.info}>
        <Typography.Text className={styles.title}>
          {currentTrack.title.text}
        </Typography.Text>
        <Typography.Text className={styles.author}>
          {currentTrack.author.name}
        </Typography.Text>
      </div>
      <div className={styles.favControl}>
        <Button
          type={'text'}
          size={'large'}
          icon={isFavorite ? <HeartFilled/> : <HeartOutlined/>}
          onClick={() => {
            if (!isFavorite) {
              dispatch(addTrackToPlaylist({
                track: currentTrack,
                playlistId: 'FAVORITE',
              }))
            } else {
              dispatch(removeTrackFromPlaylist({
                trackId: currentTrack.id,
                playlistId: 'FAVORITE',
              }))
            }
          }}
        />
      </div>
    </div>
    <div className={styles.playerControls}>
      <ConfigProvider theme={{token: {colorPrimary: 'white'}}}>
        <Slider
          max={currentTrack.duration.seconds}
          min={0}
          value={seekTime}
          tooltip={{
            formatter: (value) => formatTime(value || 0),
          }}
          onChange={value => {
            setSeekTime(value);
          }}
          onAfterChange={value => {
            dispatch(setPlayer({
              currentTime: value,
              shouldUpdateBySeek: true,
            }))
          }}
        />
      </ConfigProvider>
      <div className={styles.timer}>
        <Typography.Text className={styles.time}>
          {formatTime(currentTime)}
        </Typography.Text>
        <Typography.Text className={styles.time}>
          {formatTime(currentTrack.duration.seconds)}
        </Typography.Text>
      </div>
    </div>
  </div>
}
