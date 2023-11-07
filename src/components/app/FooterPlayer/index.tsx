import styles from "@/styles/FooterPlayer.module.scss";
import {useAppSelector} from "@/redux/hooks";
import {getTrackThumbnail} from "@/utils/player.utils";
import {Typography} from "antd";

export default function FooterPlayer() {
  const {queue, playingIndex} = useAppSelector(state => state.player);
  const currentTrack = queue?.[playingIndex];
  return <div
    className={styles.outer + ` ${queue.length === 0 ? styles.hidden: ''}`}
  >
    <div
      className={styles.blurredFigure}
      style={{
        backgroundImage: `url('${getTrackThumbnail(currentTrack)}')`
      }}
    />
    <div
      className={styles.figure}
      style={{
        backgroundImage: `url('${getTrackThumbnail(currentTrack)}')`
      }}
    />
    <div className={styles.meta}>
      <Typography.Text className={styles.title}>
        {currentTrack?.title.text}
      </Typography.Text>
      <Typography.Text className={styles.author}>
        {currentTrack?.author.name}
      </Typography.Text>
    </div>
  </div>
}
