import {useSearchParams} from "next/navigation";
import React, {useEffect, useState} from "react";
import apiService from "@/services/api.service";
import {Button, Layout, List, Typography} from "antd";
import styles from "@/styles/Search.module.scss";
import SearchInput from "@/components/shared/SearchInput";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import VerticalTracksList from "@/components/shared/VerticalTracksList";
import GoBack from "@/components/shared/GoBack";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList, faPlay, faPlus} from "@fortawesome/free-solid-svg-icons";
import {enqueueTrack} from "@/redux/actions/player.actions";
import {addTrackToPlaylist} from "@/redux/actions/playlist.actions";
import {setApp} from "@/redux/slices/app.slice";

export default function SearchPage() {
  const dispatch = useAppDispatch();
  const favoritePlaylist = useAppSelector(state => state.app.playlists.find(x => x.id === 'FAVORITE'));
  const {queue} = useAppSelector(state => state.player);
  const [results, setResults] = useState([]);
  const searchParams = useSearchParams()
  const query = decodeURIComponent(searchParams.get('q') || "");

  useEffect(() => {
    if (query) apiService.search(decodeURIComponent(query)).then(r => {
      setResults(r.results.filter((item: any) => item.type === 'Video'));
    });
  }, [query]);

  return <div className={styles.searchPage}>
    <div className={styles.header}>
      <div className={styles.controls}>
        <GoBack size={'middle'}/>
        <SearchInput value={query}/>
      </div>
      <Typography.Title level={3} style={{marginBottom: 16}}>
        Search Results
      </Typography.Title>
    </div>
    <div className={styles.searchResults}>
      <VerticalTracksList
        tracks={results}
        showFavorite={true}
        style={{
          paddingBottom: queue.length === 0 ? 0 : 90,
        }}
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
  </div>
}
