import {useParams} from "next/navigation";
import styles from "./Playlist.module.scss";
import {Button, ConfigProvider, List, theme, Typography} from "antd";
import {ArrowLeftOutlined, BackwardOutlined, CaretRightFilled, OrderedListOutlined} from "@ant-design/icons";
import Link from "next/link";
import {useRouter} from "next/router";
import React, {useEffect} from "react";
import {useAppSelector} from "@/redux/hooks";
import VerticalTracksList from "@/components/shared/VerticalTracksList";
import {getPlaylistThumbnail} from "@/utils/player.utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faList, faPlay, faShuffle} from "@fortawesome/free-solid-svg-icons";

export default function Playlist() {
  const params = useParams();
  const router = useRouter();
  const playlist = useAppSelector(state => state.app.playlists.find(x => x.id === params?.playlistId));
  const {token: {
    colorBgBase,
  }} = theme.useToken();

  useEffect(() => {
    if (params?.playlistId && !playlist) router.replace('/').then(() => null);
  }, [playlist]);
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
        <button className={styles.playButton}>
          <FontAwesomeIcon icon={faPlay}/>
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
        />
      </div>
      <VerticalTracksList
        tracks={playlist?.tracks || []}
      />
    </div>
  </div>
}
