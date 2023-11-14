import {Button, List} from "antd";
import {useAppSelector} from "@/redux/hooks";
import styles from "./ParticipantsList.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLinkSlash} from "@fortawesome/free-solid-svg-icons";

export default function ParticipantsList() {
  const {connections, isHost} = useAppSelector(state => state.connect);
  return <List
    dataSource={connections}
    renderItem={(item) => {
      return <div className={styles.item}>
        <div className={styles.name}>
          {item.peer}
        </div>
        <div className={styles.controls}>
          <Button
            danger
            type={'text'}
            icon={<FontAwesomeIcon icon={faLinkSlash}/>}
          />
        </div>
      </div>
    }}
  />
}
