import {Badge, Button, Card, Divider, Drawer, Form, Input, message, Typography} from "antd";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {setConnectSlice} from "@/redux/slices/connect.slice";
import styles from "./ConnectDrawer.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy} from "@fortawesome/free-solid-svg-icons";
import peerService from "@/services/peer.service";

export default function ConnectDrawer() {
  const dispatch = useAppDispatch();
  const {showDrawer, connected, roomConnected, username} = useAppSelector(state => state.connect);

  const onClose = () => {
    dispatch(setConnectSlice({
      showDrawer: false,
    }))
  }
  const doConnect = ({id}: { id: string }) => {
    peerService.connect(id).then((r: any) => {
      dispatch(setConnectSlice({
        joining: true,
      }))
    }).catch(e => {
      return message.error("Failed to connect");
    });
  }

  const createRoom = () => {
    dispatch(setConnectSlice({
      roomConnected: true,
      isHost: true,
    }));
  }


  return <Drawer
    placement="right"
    closable={false}
    onClose={onClose}
    open={showDrawer}
    getContainer={false}
  >
    <Typography.Title level={4} className={styles.title}>
      Listen Together
    </Typography.Title>
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
            navigator.clipboard.writeText(username!).then(() => {
              return message.success('Copied');
            });
          }}
          icon={<FontAwesomeIcon icon={faCopy}/>}
        >Copy</Button>}
      />
    </div>
    {!roomConnected && (
      <Card
        className={styles.connectCard}
        bodyStyle={{padding: 16}}
      >
        <Typography.Text>
          Join a room by connect anyone currently a participant.
        </Typography.Text>
        <Form
          className={styles.connectForm}
          onFinish={doConnect}
        >
          <Form.Item
            name={'id'}
            required
            rules={[{
              required: true,
              message: 'ID is required'
            }]}
            style={{marginBottom: 0}}
          >
            <Input
              placeholder={'Friend ID...'}
            />
          </Form.Item>

          <Button type={'primary'} htmlType={'submit'}>
            Connect
          </Button>
        </Form>
        <Divider/>
        <Typography.Text>
          Or click below button to create a new room...
        </Typography.Text>
        <Button type={'primary'} block style={{marginTop: 8}} onClick={createRoom}>
          Create Room
        </Button>
      </Card>
    )}

  </Drawer>;
}
