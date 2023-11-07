import {useParams} from "next/navigation";
import styles from "./Playlist.module.scss";
import {Typography} from "antd";

export default function Playlist() {
  const params = useParams();
  return <div className={styles.outer}>
    <div className={styles.header}>
      <div
        className={styles.figure}
      />
      <div className={styles.playlistMeta}>
        <Typography.Title level={2}>
          Playlist
        </Typography.Title>
      </div>
    </div>
    <div className={styles.content}>

    </div>
  </div>
}
