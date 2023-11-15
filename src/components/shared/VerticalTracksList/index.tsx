import styles from "@/styles/Search.module.scss";
import apiService from "@/services/api.service";
import playerService from "@/services/player.service";
import {Button, Dropdown, List, Tooltip} from "antd";
import {HeartFilled, HeartOutlined, PlusOutlined} from "@ant-design/icons";
import {addTrackToPlaylist, removeTrackFromPlaylist} from "@/redux/actions/playlist.actions";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {formatTime, getTrackThumbnail} from "@/utils/player.utils";
import {enqueueTrack} from "@/redux/actions/player.actions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisVertical, faList, faPlay, faPlus, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {setPlayer} from "@/redux/slices/player.slice";
import {ItemType} from "antd/es/menu/hooks/useItems";

interface VerticalTracksListProps {
  tracks: YouTubeTrack[];
  showFavorite?: boolean;
  optionItems?: ItemType[];
  style?: {};
}

export default function VerticalTracksList({tracks, showFavorite, optionItems, style}: VerticalTracksListProps) {
  const favoritePlaylist = useAppSelector(state => state.app.playlists.find(x => x.id === 'FAVORITE'));
  const favoriteTracks = favoritePlaylist?.tracks || [];
  const dispatch = useAppDispatch();

  return <List
    rootClassName={styles.searchResultsOuter}
    style={{minHeight: 0, ...style}}
    dataSource={tracks}
    renderItem={(item: YouTubeTrack) => {
      const isPrevFavorite = favoriteTracks.findIndex(x => x.id === item.id) >= 0;
      return <>
        <div className={styles.searchResultItem}>
          <div
            className={styles.searchResultItemInfo}
            onClick={e => {
              dispatch(enqueueTrack({
                track: item,
                playNow: true,
              }));
            }}
          >
            <div
              className={styles.searchResultItemThumbnail}
              style={{
                backgroundImage: `url(${getTrackThumbnail(item)})`
              }}
            />
            <div className={styles.searchResultItemMeta}>
              <div className={styles.searchResultItemTitle}>
                {item.title?.text}
              </div>
              <div className={styles.searchResultItemTimer}>
                {formatTime(item.duration.seconds || 0)}
              </div>
            </div>
          </div>
          <div className={styles.searchResultItemControls}>
            {showFavorite && (
              <Button
                icon={isPrevFavorite ? <HeartFilled/> : <HeartOutlined/>}
                shape={'circle'}
                type={'text'}
                onClick={async () => {
                  try {
                    if (isPrevFavorite) {
                      await dispatch(removeTrackFromPlaylist({
                        trackId: item.id,
                        playlistId: 'FAVORITE'
                      }));
                    } else {
                      await dispatch(addTrackToPlaylist({
                        track: item,
                        playlistId: 'FAVORITE'
                      }))
                    }
                  } catch (e) {
                    console.log(e);
                  }
                }}
              />
            )}
            <div className={optionItems ? styles.itemRevealableControls: ''}>
              <Tooltip title={'Play now'}>
                <Button
                  onClick={() => {
                    dispatch(enqueueTrack({
                      track: item,
                      playNow: true,
                      clearQueue: true,
                    }));
                  }}
                  icon={<FontAwesomeIcon icon={faPlay}/>}
                  shape={'circle'}
                  type={'text'}
                />
              </Tooltip>
              {optionItems && (
                <Dropdown menu={{
                  items: [
                    ...optionItems.map((opt: any) => {
                      return {
                        ...opt,
                        onClick: () => {
                          if (opt && opt.onClick) opt.onClick(item);
                        }
                      }
                    })
                  ],
                }} placement="bottomRight" arrow>
                  <Button
                    icon={<FontAwesomeIcon icon={faEllipsisVertical}/>}
                    shape={'circle'}
                    type={'text'}
                  />
                </Dropdown>
              )}
            </div>
          </div>
        </div>
      </>}}
  />;
}
