import {
  Alert,
  Badge,
  Button,
  Card,
  Collapse,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Select,
  Tabs,
  Typography
} from "antd";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {setConnectSlice} from "@/redux/slices/connect.slice";
import styles from "./ConnectDrawer.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faWarning} from "@fortawesome/free-solid-svg-icons";
import peerService from "@/services/peer.service";
import {useState} from "react";
import ParticipantsList from "@/components/app/ConnectDrawer/ParticipantsList";
import Conversation from "@/components/app/ConnectDrawer/Conversation";

export default function ConnectDrawer() {
  const dispatch = useAppDispatch();
  const [createMode, setCreateMode] = useState<ConnectMode>('broadcast');
  const {showDrawer, connected, roomConnected, username, isHost, hostId, mode, connections} = useAppSelector(state => state.connect);
  const [connecting, setConnecting] = useState(false);

  const onClose = () => {
    dispatch(setConnectSlice({
      showDrawer: false,
    }))
  }

  const doConnect = ({id}: { id: string }) => {
    setConnecting(true);
    peerService.connect(id).then((r: any) => {
      dispatch(setConnectSlice({
        joining: true,
      }))
      setTimeout(() => {
        setConnecting(false);
      },300);
    }).catch(e => {
      setConnecting(false);
      return message.error("Failed to connect");
    });
  }

  const createRoom = () => {
    dispatch(setConnectSlice({
      roomConnected: true,
      isHost: true,
      mode: createMode,
    }));
  }


  return <Drawer
    placement="right"
    closable={false}
    onClose={onClose}
    open={showDrawer}
    getContainer={false}
    bodyStyle={{
      display: 'flex',
      flexDirection: 'column'
    }}
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
    {roomConnected && !isHost && (
      <Collapse
        bordered={false}
        defaultActiveKey={['1']}
        expandIcon={({isActive}) => <FontAwesomeIcon icon={faWarning}/>}
        items={[{
          key: 'warning',
          label: `You're currently in a room`,
          children: <Typography.Text>
            You're currently in a room hosted by {hostId} this is a {mode} room.{' '}
            {mode === 'broadcast' ? `You cannot control the queue (seek or navigate), however you still can pause the music.`:
            `You can control the player (seek or navigate) as you like.`}
          </Typography.Text>
        }]}
        style={{
          marginTop: 16,
        }}
      />
    )}
    {!roomConnected && (
      <Card
        className={styles.connectCard}
        bodyStyle={{padding: 0}}
      >
        <Tabs
          tabBarStyle={{
            paddingLeft: 16,
            paddingRight: 16,
          }}
          items={[{
            key: 'join',
            label: 'Join Room',
            children: <div className={styles.tabContent}>
              <Typography.Text>
                Join a room by connect to host's ID.
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

                <Button type={'primary'} htmlType={'submit'} loading={connecting}>
                  Connect
                </Button>
              </Form>
            </div>
          }, {
            key: 'create',
            label: 'Create Room',
            children: <div className={styles.tabContent}>
              <div>
                <Alert
                  message={<>
                    {createMode === 'broadcast' ? (<small>
                      This mode prevent members from controlling the player.
                    </small>) : (<small>
                      This mode allow members to control the player simultaneously.
                    </small>)}
                  </>}
                />
              </div>
              <div className={styles.createRoomForm}>
                <Select
                  value={createMode}
                  onChange={value => setCreateMode(value as ConnectMode)}
                >
                  <Select.Option value={'broadcast'}>
                    Broadcast
                  </Select.Option>
                  <Select.Option value={'group'}>
                    Group
                  </Select.Option>
                </Select>
                <Button type={'primary'} block onClick={createRoom}>
                  Create Room
                </Button>
              </div>
            </div>
          }]}
        />
      </Card>
    )}

    {roomConnected && (
      <Tabs
        className={'full-height-tabs'}
        style={{
          flex: 1,
          minHeight: 0,
        }}
        items={[{
          key: 'peers',
          label: `Participants (${connections.length})`,
          children: <ParticipantsList/>
        }, {
          key: 'chat',
          label: 'Conversation',
          children: <Conversation/>
        }]}
      />
    )}

  </Drawer>;
}
