import GoBack from "@/components/shared/GoBack";
import styles from "@/styles/History.module.scss";
import {Typography} from "antd";
import VerticalTracksList from "@/components/shared/VerticalTracksList";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay, faPlus} from "@fortawesome/free-solid-svg-icons";
import {setApp} from "@/redux/slices/app.slice";
import {enqueueTrack} from "@/redux/actions/player.actions";
import React from "react";

export default function History() {
  const dispatch = useAppDispatch();
  const {playHistory} = useAppSelector(state => state.app);

  return <div className={styles.outer}>
    <div className={styles.header}>
      <GoBack/>
      <Typography.Title>
        History
      </Typography.Title>
    </div>

    <VerticalTracksList
      tracks={playHistory}
      showFavorite={true}
      optionItems={[{
        key: 'add-to-playlist',
        label: 'Add to playlist',
        icon: <FontAwesomeIcon icon={faPlus}/>,
        onClick: (item: any) => {
          dispatch(setApp({
            addToPlaylistModal: {
              showModal: true,
              track: item,
            },
          }));
        }
      }, {
        key: 'enqueue',
        label: 'Add to queue',
        icon: <FontAwesomeIcon icon={faPlay}/>,
        onClick: (item: any) => {
          dispatch(enqueueTrack({
            track: item,
            playNow: false,
          }));
        }
      }]}
    />
  </div>
}
