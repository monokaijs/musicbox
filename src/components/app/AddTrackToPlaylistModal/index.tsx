import {Button, Checkbox, List, message, Modal, Typography} from "antd";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {setApp} from "@/redux/slices/app.slice";
import styles from "./AddTrackToPlaylistModal.module.scss";
import {useEffect, useState} from "react";
import {formatTime, getTrackThumbnail} from "@/utils/player.utils";
import {addTrackToPlaylist} from "@/redux/actions/playlist.actions";

export default function AddTrackToPlaylistModal() {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<string[]>([]);
  const {addToPlaylistModal, playlists} = useAppSelector(state => state.app);

  const toggleItem = (id: string) => {
    if (!selected.includes(id)) {
      // add
      const newList = [...selected];
      newList.push(id);
      setSelected(newList);
    } else {
      // remove from selected list
      setSelected([...selected.filter(x => x !== id)]);
    }
  }

  const closeModal = () => dispatch(setApp({
    addToPlaylistModal: {
      showModal: false,
      track: undefined,
    }
  }));

  useEffect(() => {
    if (!addToPlaylistModal.showModal) setSelected([]);
  }, [addToPlaylistModal.showModal]);

  return <Modal
    open={addToPlaylistModal.showModal}
    title={null}
    footer={false}
    onCancel={closeModal}
  >
    {(addToPlaylistModal.showModal && addToPlaylistModal.track) && (
      <div
        className={styles.header}
      >
        <div
          className={styles.cover}
          style={{
            backgroundImage: `url('${getTrackThumbnail(addToPlaylistModal.track)}')`
          }}
        />
        <div
          className={styles.artwork}
          style={{
            backgroundImage: `url('${getTrackThumbnail(addToPlaylistModal.track)}')`
          }}
        />
        <div className={styles.meta}>
          <Typography.Text className={styles.title}>
            {addToPlaylistModal.track.title.text}
          </Typography.Text>
          <Typography.Text className={styles.description}>
            {formatTime(addToPlaylistModal.track.duration.seconds)}
          </Typography.Text>
        </div>
      </div>
    )}
    <div className={styles.listHeader}>
      <Typography.Title level={5} className={styles.title}>
        Add to Playlist
      </Typography.Title>
      <div className={styles.controls}>
        <Button
          type={'text'}
          size={'small'}
          icon={<FontAwesomeIcon icon={faPlus}/>}
          onClick={() => dispatch(setApp({
            createPlaylistModal: true,
          }))}
        >
          Create
        </Button>
        <Button
          disabled={selected.length === 0}
          type={'primary'}
          size={'small'}
          onClick={() => {
            if (!addToPlaylistModal.track) return;
            for (let list of selected) {
              dispatch(addTrackToPlaylist({
                track: addToPlaylistModal.track,
                playlistId: list,
              }));
            }
            message.success('Added to ' + selected.length + ' playlists').then(() => null);
            closeModal();
          }}
        >
          Add to {selected.length} playlists
        </Button>
      </div>
    </div>
    <List
      dataSource={playlists}
      renderItem={(item) => (
        <div
          className={styles.item}
          onClick={_ => toggleItem(item.id)}
        >
          <div className={styles.selector}>
            <Checkbox
              checked={selected.includes(item.id)}
              onClick={e => e.stopPropagation()}
              onChange={_ => toggleItem(item.id)}
            />
          </div>
          <div className={styles.meta}>
            <div className={styles.title}>
              {item.name}
            </div>
            <div className={styles.description}>
              {item.tracks.length} tracks
            </div>
          </div>
        </div>
      )}
    />
  </Modal>
}
