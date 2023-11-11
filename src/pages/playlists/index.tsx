import React from "react";
import {useAppSelector} from "@/redux/hooks";
import {List, Typography} from "antd";
import styles from "./Playlists.module.scss";
import {getPlaylistThumbnail} from "@/utils/player.utils";

export default function Playlists() {
  const {playlists} = useAppSelector(state => state.app);
  return <div className={styles.outer}>
    <Typography.Title>
      Playlists
    </Typography.Title>
    <List
      dataSource={playlists || []}
      renderItem={(item) => {
        return <div className={styles.item}>
          <div
            className={styles.artwork}
            style={{
              backgroundImage: `url('${getPlaylistThumbnail(item)}')`
            }}
          />
          <Typography.Text>
            {item.name}
          </Typography.Text>
        </div>
      }}
    />
  </div>
}
