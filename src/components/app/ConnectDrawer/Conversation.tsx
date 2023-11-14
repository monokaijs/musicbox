import styles from "./Conversation.module.scss";
import { Comment } from '@ant-design/compatible';
import {Button, Divider, Form, Input, List, message, Typography} from "antd";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import peerService from "@/services/peer.service";
import {setConnectSlice} from "@/redux/slices/connect.slice";
import dayjs from "dayjs";
import {useEffect, useRef} from "react";

export default function Conversation() {
  const dispatch = useAppDispatch();
  const {messages, peerId} = useAppSelector(state => state.connect);
  const [form] = Form.useForm();
  const ref = useRef<HTMLDivElement>(null);

  const sendMessage = (values: any) => {
    if (!values.message || values.message.trim() === '') {
      return message.error('Please enter message');
    } else {
      const newMessage: ChatMessage = {
        author: peerId!,
        message: values.message,
        timestamp: new Date().getTime(),
        type: 'text',
      }
      peerService.sendAll({
        action: 'newMessage',
        data: newMessage
      });
      dispatch(setConnectSlice({
        messages: [
          ...messages,
          newMessage,
        ]
      }));
      form.resetFields();
    }
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = 9999;
    }
    if (messages.length > 20) {
      let last20Messages = messages.slice(-20);
      dispatch(setConnectSlice({
        messages: last20Messages,
      }))
    }
  }, [messages]);

  return <div className={styles.outer}>
    <div
      className={styles.listContainer}
      ref={ref}
    >
      <List
        dataSource={messages}
        className={styles.list}
        renderItem={(item) => {
          return <Comment
            className={styles.commentItem}
            style={{
              backgroundColor: 'transparent',
            }}
            content={<Typography.Text className={styles.text}>{item.message}</Typography.Text>}
            author={
              <Typography.Text className={styles.name}>
                {item.author}
              </Typography.Text>
            }
            datetime={
              <Typography.Text className={styles.date}>
                {dayjs(item.timestamp).format('HH:mm')}
              </Typography.Text>
            }
          />
        }}
      />
    </div>
    <Divider style={{marginTop: 0, marginBottom: 8}}/>
    <Form
      form={form}
      className={styles.form}
      onFinish={sendMessage}
    >
      <Form.Item style={{margin: 0, flex: 1}} name={'message'}>
        <Input
          placeholder={'Enter message...'}
        />
      </Form.Item>
      <Button icon={<FontAwesomeIcon icon={faPaperPlane}/>} type={'primary'} htmlType={'submit'}>
        Send
      </Button>
    </Form>
  </div>
}
