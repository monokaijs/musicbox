import styles from "./styles.module.scss";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {getTrackThumbnail} from "@/utils/player.utils";
import {Button, ConfigProvider, Slider, Typography} from "antd";
import {CaretDownOutlined, CloseOutlined, HeartOutlined} from "@ant-design/icons";
import {closePlayerModal} from "@/redux/slices/player.slice";

export default function PlayerModal() {
  const dispatch = useAppDispatch();
  const {openModal, queue, playingIndex} = useAppSelector(state => state.player);
  const currentTrack = queue[playingIndex];
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
          icon={<HeartOutlined/>}
        />
      </div>
    </div>
    <div className={styles.playerControls}>
      <ConfigProvider theme={{token: {colorPrimary: 'white'}}}>
        <Slider/>
      </ConfigProvider>
      <div className={styles.timer}>
        <Typography.Text className={styles.time}>00:00</Typography.Text>
        <Typography.Text className={styles.time}>11:11</Typography.Text>
      </div>
    </div>
  </div>
}
