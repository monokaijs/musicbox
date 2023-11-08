import styles from "./styles.module.scss";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {formatTime, getTrackThumbnail} from "@/utils/player.utils";
import {Button, ConfigProvider, Divider, Slider, Spin, Typography} from "antd";
import {
  CaretDownOutlined,
  CloseOutlined,
  HeartFilled,
  HeartOutlined, LoadingOutlined,
  PauseCircleFilled, PlayCircleFilled, RetweetOutlined, RollbackOutlined, SoundOutlined,
  StepBackwardFilled, StepForwardFilled, UnorderedListOutlined
} from "@ant-design/icons";
import {closePlayerModal, setPlayer} from "@/redux/slices/player.slice";
import {useEffect, useState} from "react";
import {addTrackToPlaylist, removeTrackFromPlaylist} from "@/redux/actions/playlist.actions";
import {playerEl} from "@/components/providers/PlayerProvider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBackwardStep, faForwardStep, faHeadphones, faListUl, faRepeat, faShuffle} from "@fortawesome/free-solid-svg-icons";

export default function PlayerModal() {
  const [isFavorite, setIsFavorite] = useState(false);
  const dispatch = useAppDispatch();
  const [seekTime, setSeekTime] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const {openModal, queue, playingIndex, currentTime, paused, loading} = useAppSelector(state => state.player);
  const favoritePlaylist = useAppSelector(state => state.app.playlists.find(x => x.id === 'FAVORITE'));
  const currentTrack = queue[playingIndex];

  useEffect(() => {
    const favoriteTracks = favoritePlaylist?.tracks || [];
    setIsFavorite(favoriteTracks.findIndex(x => x.id === currentTrack?.id) > -1);
  }, [favoritePlaylist, currentTrack]);

  useEffect(() => {
    if(!seeking) setSeekTime(currentTime || 0);
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
            setSeeking(true);
            setSeekTime(value);
          }}
          onAfterChange={value => {
            setSeeking(false);
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

      <div className={styles.controlButtons}>
        <a className={styles.small} onClick={() => {
          dispatch(setPlayer({
            audioControlModal: true,
          }))
        }}>
          <FontAwesomeIcon icon={faHeadphones}/>
        </a>
        <a className={styles.small}>
          <FontAwesomeIcon icon={faRepeat}/>
        </a>
        <a className={styles.small}>
          <FontAwesomeIcon icon={faBackwardStep}/>
        </a>
        <a
          className={styles.large}
          onClick={() => {
            if (!playerEl || loading) return;
            if (playerEl.paused) {
              return playerEl.play()
            } else return playerEl.pause();
          }}
        >
          {loading ? (
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          ): (
            paused ? <PlayCircleFilled/> : <PauseCircleFilled/>
          )}
        </a>
        <a className={styles.small}>
          <FontAwesomeIcon icon={faForwardStep}/>
        </a>
        <a className={styles.small}>
          <FontAwesomeIcon icon={faShuffle}/>
        </a>
        <a className={styles.small}>
          <FontAwesomeIcon icon={faListUl}/>
        </a>
      </div>

    </div>
  </div>
}
