import {Badge, Button, Drawer, Input, Typography} from "antd";
import {useState} from "react";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {setConnectSlice} from "@/redux/slices/connect.slice";
import styles from "./ConnectDrawer.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy} from "@fortawesome/free-solid-svg-icons";

export default function ConnectDrawer() {
  const dispatch = useAppDispatch();
  const {showDrawer, connected, roomConnected, peerId, username} = useAppSelector(state => state.connect);

  const onClose = () => {
    dispatch(setConnectSlice({
      showDrawer: false,
    }))
  }

  return <Drawer
    title="Listen Together"
    placement="right"
    closable={false}
    onClose={onClose}
    open={showDrawer}
    getContainer={false}
  >
    <div className={styles.peerInfo}>
      <div className={styles.label}>
        <Typography.Text className={styles.text}>
          Your ID
        </Typography.Text>
        <Badge
          status={connected ? 'success' : 'processing'}
          className={styles.status}
          text={connected ? 'Connected' : 'Connecting...'}
        />
      </div>
      <Input
        disabled={true}
        value={username}
        addonAfter={<Button
          size={'small'} type={'text'}
          onClick={() => {
            // TODO: Copy ID
          }}
          icon={<FontAwesomeIcon icon={faCopy}/>}
        >Copy</Button>}
      />
    </div>
  </Drawer>;
}
