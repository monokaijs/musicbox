import styles from "./styles.module.scss";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {formatTime, getTrackThumbnail} from "@/utils/player.utils";
import {Button, ConfigProvider, Slider, Spin, theme, Typography} from "antd";
import {
  CloseOutlined,
  HeartFilled,
  HeartOutlined,
  LoadingOutlined,
  PauseCircleFilled,
  PlayCircleFilled
} from "@ant-design/icons";
import {closePlayerModal, nextTrack, prevTrack, RepeatMode, setPlayer} from "@/redux/slices/player.slice";
import {useEffect, useState} from "react";
import {addTrackToPlaylist, removeTrackFromPlaylist} from "@/redux/actions/playlist.actions";
import {playerEl} from "@/components/providers/PlayerProvider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faForwardStep,
  faHeadphones,
  faListUl,
  faRepeat,
  faShuffle
} from "@fortawesome/free-solid-svg-icons";

export default function PlayerModal() {
  const [isFavorite, setIsFavorite] = useState(false);
  const dispatch = useAppDispatch();
  const [seekTime, setSeekTime] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const {connected, roomConnected, isHost, mode} = useAppSelector(state => state.connect);
  const {openModal, queue, playingIndex, currentTime, paused, loading, repeatMode, shuffle} = useAppSelector(state => state.player);
  const favoritePlaylist = useAppSelector(state => state.app.playlists.find(x => x.id === 'FAVORITE'));
  const currentTrack = queue[playingIndex];
  const {token: {colorPrimary}} = theme.useToken();

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
          disabled={connected && roomConnected && (mode === 'broadcast' && !isHost)}
          onChange={value => {
            setSeeking(true);
            setSeekTime(value);
          }}
          onAfterChange={async value => {
            setSeeking(false);
            dispatch(setPlayer({
              currentTime: value,
              shouldUpdateBySeek: true,
            }));
            const peerService = (await import('@/services/peer.service')).default;
            if (roomConnected && ((mode === 'broadcast' && isHost) || mode === 'group')) {
              peerService.sendAll({
                action: 'seek',
                data: value,
              });
            }
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
        <a
          className={styles.small}
          onClick={() => {
            let newMode = RepeatMode.FORWARD;
            if (repeatMode === RepeatMode.FORWARD) {
              newMode = RepeatMode.REPEAT_ALL;
            } else if (repeatMode === RepeatMode.REPEAT_ALL) {
              newMode = RepeatMode.REPEAT_ONE;
            }

            dispatch(setPlayer({
              repeatMode: newMode,
            }))
          }}
        >
          <FontAwesomeIcon
            icon={faRepeat}
            style={{
              color: (repeatMode === RepeatMode.REPEAT_ALL || repeatMode === RepeatMode.REPEAT_ONE) ? colorPrimary : 'white',
            }}
          />
          {repeatMode === RepeatMode.REPEAT_ONE && <div
            className={styles.repeatOne}
            style={{
              backgroundColor: colorPrimary,
              color: 'white'
            }}
          >1</div>}
        </a>
        <a
          className={styles.small}
          onClick={() => dispatch(prevTrack())}
        >
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
          style={{
            opacity: loading ? .5 : 1,
          }}
        >
          {paused ? <PlayCircleFilled/> : <PauseCircleFilled/>}
        </a>
        <a
          className={styles.small}
          onClick={() => dispatch(nextTrack())}
        >
          <FontAwesomeIcon icon={faForwardStep}/>
        </a>
        <a
          className={styles.small}
          style={{
            color: shuffle ? colorPrimary: undefined,
          }}
          onClick={() => dispatch(setPlayer({
            shuffle: !shuffle,
          }))}
        >
          <FontAwesomeIcon icon={faShuffle}/>
        </a>
        <a
          className={styles.small}
          onClick={() => {
            dispatch(setPlayer({
              queueModal: true,
            }));
          }}
        >
          <FontAwesomeIcon icon={faListUl}/>
        </a>
      </div>

    </div>
  </div>
}
