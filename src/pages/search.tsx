import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import apiService from "@/services/api.service";
import {Button, Layout, List, Typography} from "antd";
import styles from "@/styles/Search.module.scss";
import {CaretRightFilled, HeartFilled, HeartOutlined, PlusOutlined, UnorderedListOutlined} from "@ant-design/icons";
import SearchInput from "@/components/shared/SearchInput";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {toggleFavoriteTrack} from "@/redux/actions/track.actions";
import {addTrackToPlaylist, removeTrackFromPlaylist} from "@/redux/actions/playlist.actions";
import playerService from "@/services/player.service";

export default function SearchPage() {
  const favoritePlaylist = useAppSelector(state => state.app.playlists.find(x => x.id === 'FAVORITE'));
  const favoriteTracks = favoritePlaylist?.tracks || [];
  const [results, setResults] = useState([]);
  const searchParams = useSearchParams()
  const query = decodeURIComponent(searchParams.get('q') || "");
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (query) apiService.search(decodeURIComponent(query)).then(r => {
      setResults(r.results.filter((item: any) => item.type === 'Video'));
    });
  }, [query]);

  return <div className={styles.searchPage}>
    <div className={styles.header}>
      <Button onClick={() => router.push('/')}>
        Back
      </Button>
      <SearchInput value={query}/>
    </div>
    <div className={styles.searchResults}>
      <Typography.Title level={3} style={{margin: '0 16px'}}>
        Search Results
      </Typography.Title>
      <List
        rootClassName={styles.searchResultsOuter}
        style={{minHeight: 0}}
        dataSource={results}
        renderItem={(item: YouTubeTrack) => {
          const isPrevFavorite = favoriteTracks.findIndex(x => x.id === item.id) >= 0;
          return <>
          <div className={styles.searchResultItem}>
            <div
              className={styles.searchResultItemInfo}
              onClick={e => {
                apiService.getPlayableUrl(item.id).then(({data}) => {
                  console.log(data);

                  playerService.playAudio(data[0].url);
                });
              }}
            >
              <div
                className={styles.searchResultItemThumbnail}
                style={{
                  backgroundImage: `url(${item.thumbnails[0].url})`
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
              <Button
                icon={<PlusOutlined/>}
                shape={'circle'}
                type={'text'}
              />
            </div>
          </div>
        </>}}
      />
    </div>
  </div>
}
