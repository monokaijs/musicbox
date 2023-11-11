import styles from "./QueueModal.module.scss";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {Button, Checkbox, List, theme, Typography} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faPen, faPlay, faTimes} from "@fortawesome/free-solid-svg-icons";
import {getTrackThumbnail} from "@/utils/player.utils";
import {useState} from "react";
import {setPlayer} from "@/redux/slices/player.slice";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {StrictModeDroppable} from "@/components/shared/StrictModeDroppable";

export default function QueueModal() {
  const {queueModal, queue, playingIndex} = useAppSelector(state => state.player);
  const [editing, setEditing] = useState(false);
  const {token: {colorBgBase}} = theme.useToken();
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
        shape={'circle'}
        type={'text'}
        icon={<FontAwesomeIcon icon={editing ? faTimes : faPen}/>}
      />
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
          const newQueue = [...queue];
          const [removed] = newQueue.splice(result.source.index, 1);
          newQueue.splice(result.destination.index, 0, removed);
          dispatch(setPlayer({
            queue: newQueue,
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
                  >
                    <div
                      className={styles.artwork}
                      style={{
                        backgroundImage: `url('${getTrackThumbnail(item)}')`
                      }}
                    />
                    <div className={styles.itemMeta}>
                      <Typography.Text className={styles.title}>
                        {item.title.text}
                      </Typography.Text>
                      <Typography.Text className={styles.author}>
                        {item.author.name}
                      </Typography.Text>
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
