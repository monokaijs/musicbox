import styles from "./QueueModal.module.scss";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {Button, Checkbox, List, message, theme, Typography} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faChevronDown, faPen, faPlay, faSort, faTimes, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {getTrackThumbnail} from "@/utils/player.utils";
import {useState} from "react";
import {setPlayer} from "@/redux/slices/player.slice";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {StrictModeDroppable} from "@/components/shared/StrictModeDroppable";

export default function QueueModal() {
  const {queueModal, queue, playingIndex} = useAppSelector(state => state.player);
  const {isHost, mode, roomConnected} = useAppSelector(state => state.connect);
  const [editing, setEditing] = useState(false);
  const {token: {colorBgBase, colorPrimary}} = theme.useToken();
  const dispatch = useAppDispatch();

  return <div
    className={styles.outer + ` ${queueModal ? styles.open : ''}`}
    style={{
      backgroundColor: colorBgBase,
    }}
  >
    <div className={styles.controls}>
      <Button
        size={'large'}
        shape={'circle'}
        type={'text'}
        icon={<FontAwesomeIcon icon={faChevronDown}/>}
        onClick={() => dispatch(setPlayer({
          queueModal: false,
        }))}
      />
      <Button
        onClick={() => setEditing(!editing)}
        size={'large'}
        shape={editing ? 'round' : 'circle'}
        type={'text'}
        icon={<FontAwesomeIcon icon={editing ? faTimes : faPen}/>}
        disabled={roomConnected && mode === 'broadcast' && !isHost}
      >
        {editing && "Cancel"}
      </Button>
    </div>
    <div className={styles.meta}>
      <Typography.Title level={3} className={styles.title}>
        Queue
      </Typography.Title>
    </div>
    <div className={styles.content}>
      <DragDropContext
        onDragEnd={(result, provided) => {
          if (!result.destination) return;
          if (result.source.index === result.destination.index) return;
          if (roomConnected && (mode === 'broadcast' && !isHost)) {
            message.error(`Broadcast room does not allow you to modify the queue`).then(() => null);
            return;
          }
          const newQueue = [...queue];
          const [removed] = newQueue.splice(result.source.index, 1);
          newQueue.splice(result.destination.index, 0, removed);
          dispatch(setPlayer({
            queue: newQueue,
            playingIndex: result.destination.index === playingIndex ? result.source.index : result.source.index === playingIndex ? result.destination.index : playingIndex,
          }))
        }}
      >
        <StrictModeDroppable droppableId="list-container">
          {(provided) => (<div
            className="list-container"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {queue.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    className={styles.item}
                    ref={provided.innerRef}
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                    onClick={() => {
                      dispatch(setPlayer({
                        playingIndex: index,
                      }))
                    }}
                  >
                    <div
                      className={styles.artwork}
                      style={{
                        backgroundImage: `url('${getTrackThumbnail(item)}')`
                      }}
                    />
                    <div className={styles.itemMeta + ` ${playingIndex === index ? styles.active : ''}`}>
                      <Typography.Text className={styles.title}>
                        {item.title.text}
                      </Typography.Text>
                      <Typography.Text className={styles.author}>
                        {item.author.name}
                      </Typography.Text>
                    </div>
                    <div className={styles.itemControls}>
                      {!editing ? (
                        <FontAwesomeIcon icon={faBars}/>
                      ) : (
                        <Button disabled={playingIndex === index} type={'text'} danger onClick={() => {
                          // Remove track from queue
                          dispatch(setPlayer({
                            queue: queue.filter(x => x.id !== item.id),
                          }))
                        }}>
                          <FontAwesomeIcon icon={faTrashCan}/>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>)}
        </StrictModeDroppable>
      </DragDropContext>
    </div>
  </div>
}
