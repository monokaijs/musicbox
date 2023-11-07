import {useParams} from "next/navigation";
import styles from "./Playlist.module.scss";
import {Button, ConfigProvider, List, theme, Typography} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import Link from "next/link";
import {useRouter} from "next/router";
import React, {useEffect} from "react";
import {useAppSelector} from "@/redux/hooks";
import VerticalTracksList from "@/components/shared/VerticalTracksList";
import {getPlaylistThumbnail} from "@/utils/player.utils";

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
        icon={<ArrowLeftOutlined/>}
        shape={'circle'}
        size={'large'}
        onClick={() => router.back()}
      />
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
      <VerticalTracksList
        tracks={playlist?.tracks || []}
      />
    </div>
  </div>
}
