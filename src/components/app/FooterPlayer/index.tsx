import styles from "@/styles/FooterPlayer.module.scss";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {getTrackThumbnail} from "@/utils/player.utils";
import {Button, Typography} from "antd";
import {PauseOutlined, StepForwardFilled} from "@ant-design/icons";
import {openPlayerModal} from "@/redux/slices/player.slice";

export default function FooterPlayer() {
  const {queue, playingIndex} = useAppSelector(state => state.player);
  const currentTrack = queue?.[playingIndex];
  const dispatch = useAppDispatch();
  return <div
    className={styles.outer + ` ${queue.length === 0 ? styles.hidden: ''}`}
    onClick={() => {
      if (currentTrack) {
        dispatch(openPlayerModal());
      }
    }}
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
    <div className={styles.controls}>
      <Button
        size={'large'}
        icon={<PauseOutlined/>}
        type={'text'}
      />
      <Button
        size={'large'}
        icon={<StepForwardFilled/>}
        type={'text'}
      />
    </div>
  </div>
}
