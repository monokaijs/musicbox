import {useParams} from "next/navigation";
import styles from "./Playlist.module.scss";
import {Button, ConfigProvider, List, Spin, theme, Typography} from "antd";
import {
  ArrowLeftOutlined,
  BackwardOutlined,
  CaretRightFilled,
  LoadingOutlined,
  OrderedListOutlined
} from "@ant-design/icons";
import Link from "next/link";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import VerticalTracksList from "@/components/shared/VerticalTracksList";
import {getPlaylistThumbnail} from "@/utils/player.utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faList, faPlay, faShuffle} from "@fortawesome/free-solid-svg-icons";
import apiService from "@/services/api.service";
import {setPlayer} from "@/redux/slices/player.slice";

export default function Playlist() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const playlist = useAppSelector(state => state.app.playlists.find(x => x.id === params?.playlistId));
  const {token: {
    colorBgBase,
  }} = theme.useToken();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params?.playlistId && !playlist) router.replace('/').then(() => null);
  }, [playlist]);

  const enqueuePlaylist = async () => {
    setLoading(true);
    dispatch(setPlayer({
      queue: playlist?.tracks || [],
      playingIndex: 0,
    }));

    setLoading(false);
  }

  const shufflePlaylist = async () => {
    // shuffle before enqueue
    let array = [...(playlist?.tracks || [])];
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    dispatch(setPlayer({
      queue: array,
      playingIndex: 0,
    }));
  }

  return <div className={styles.outer}>
    <div
      className={styles.header}
      style={{
        backgroundImage: `url('${getPlaylistThumbnail(playlist)}')`,
      }}
    >
      <div
        className={styles.figure}
      />
      <Button
        className={styles.backButton}
        icon={<FontAwesomeIcon icon={faChevronLeft}/>}
        shape={'round'}
        size={'large'}
        onClick={() => router.back()}
      >
        Go Back
      </Button>
      <div className={styles.playlistMeta}>
        <Typography.Title level={2} className={styles.title}>
          {playlist?.name}
        </Typography.Title>
      </div>
    </div>
    <div
      className={styles.content}
      style={{
        backgroundColor: colorBgBase
      }}
    >
      <div className={styles.playlistControls}>
        <button className={styles.playButton} onClick={enqueuePlaylist}>
          {loading ? <Spin
            spinning={true}
            indicator={<LoadingOutlined spin/>}
          /> : <FontAwesomeIcon icon={faPlay}/>}
        </button>
      </div>
      <div className={styles.exControls}>
        <Button
          type={'text'}
          icon={<FontAwesomeIcon icon={faList}/>}
        >
          Sort by name
        </Button>
        <Button
          type={'text'}
          shape={'circle'}
          icon={<FontAwesomeIcon icon={faShuffle}/>}
          onClick={shufflePlaylist}
        />
      </div>
      <VerticalTracksList
        tracks={playlist?.tracks || []}
      />
    </div>
  </div>
}
