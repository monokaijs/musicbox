import styles from "@/styles/Search.module.scss";
import apiService from "@/services/api.service";
import playerService from "@/services/player.service";
import {Button, List} from "antd";
import {HeartFilled, HeartOutlined, PlusOutlined} from "@ant-design/icons";
import {addTrackToPlaylist, removeTrackFromPlaylist} from "@/redux/actions/playlist.actions";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {getTrackThumbnail} from "@/utils/player.utils";
import {enqueueTrack} from "@/redux/actions/player.actions";

interface VerticalTracksListProps {
  tracks: YouTubeTrack[];
  showFavorite?: boolean;
}

export default function VerticalTracksList({tracks, showFavorite}: VerticalTracksListProps) {
  const favoritePlaylist = useAppSelector(state => state.app.playlists.find(x => x.id === 'FAVORITE'));
  const favoriteTracks = favoritePlaylist?.tracks || [];
  const dispatch = useAppDispatch();

  return <List
    rootClassName={styles.searchResultsOuter}
    style={{minHeight: 0}}
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
                {item.duration.text}
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
            <Button
              icon={<PlusOutlined/>}
              shape={'circle'}
              type={'text'}
            />
          </div>
        </div>
      </>}}
  />;
}
