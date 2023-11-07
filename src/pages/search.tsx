import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import apiService from "@/services/api.service";
import {Button, Layout, List, Typography} from "antd";
import styles from "@/styles/Search.module.scss";
import SearchInput from "@/components/shared/SearchInput";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import VerticalTracksList from "@/components/shared/VerticalTracksList";

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
      <VerticalTracksList
        tracks={results}
        showFavorite={true}
      />
    </div>
  </div>
}
