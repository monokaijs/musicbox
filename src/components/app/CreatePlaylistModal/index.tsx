import {Button, Form, Input, message, Modal} from "antd";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {setApp} from "@/redux/slices/app.slice";
import {v4} from "uuid";

export default function CreatePlaylistModal() {
  const dispatch = useAppDispatch();
  const {createPlaylistModal, playlists} = useAppSelector(state => state.app);
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    if (playlists.find(x => x.name.toLowerCase().trim() === values.name.toLowerCase().trim())) {
      return message.error('This name is already been used');
    } else {
      const newPlaylist: Playlist = {
        id: v4(),
        name: values.name.trim(),
        artwork: '',
        tracks: [],
        systemPlaylist: false,
      }
      dispatch(setApp({
        playlists: [
          ...playlists,
          newPlaylist
        ],
        createPlaylistModal: false,
      }));
      form.resetFields();
    }
  }
  return <Modal
    open={createPlaylistModal}
    title={'Create Playlist'}
    footer={null}
    onCancel={() => dispatch(setApp({
      createPlaylistModal: false,
    }))}
  >
    <Form
      form={form}
      layout={'vertical'}
      onFinish={onFinish}
    >
      <Form.Item
        name={'name'}
        label={'Name'}
        rules={[{
          required: true,
        }]}
      >
        <Input
          placeholder={'Playlist name...'}
        />
      </Form.Item>
      <Button type={'primary'} htmlType={'submit'}>
        Finish
      </Button>
    </Form>
  </Modal>
}
