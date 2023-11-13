import {useAppSelector} from "@/redux/hooks";
import SectionTitle from "@/components/app/Home/SectionTitle";
import {Button, Typography} from "antd";
import styles from "./PlaylistsSection.module.scss";
import {HeartFilled} from "@ant-design/icons";
import {useEffect, useRef} from "react";
import Link from "next/link";
import {useRouter} from "next/router";

const PlaylistArtwork = ({playlist}: { playlist: Playlist }) => {
  const tracks = playlist.tracks;
  return <div className={styles.playlistImageWrapper}>
    <div
      className={styles.playlistArtwork}
      style={{
        backgroundImage: tracks.length > 0 ? `url('${(tracks[0].thumbnails || tracks[0].thumbnail)[0].url}')` : undefined
      }}
    />
    {playlist.tracks.length === 0 && (
      <HeartFilled/>
    )}
  </div>
}

export default function PlaylistsSection() {
  const {playlists} = useAppSelector(state => state.app);
  const renderPlaylists = [...playlists].sort((a, b) => a.systemPlaylist ? 1 : 0);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    if (ref && ref.current) {
      let isScrolling = false;
      let startX = 0;
      let scrollLeft = 0;
      let scrollContent = ref.current;

      scrollContent.addEventListener("mousedown", (e) => {
        isScrolling = true;
        startX = e.pageX - scrollContent.offsetLeft;
        scrollLeft = scrollContent.scrollLeft;
        scrollContent.style.scrollBehavior = "auto"; // Disable smooth scrolling temporarily
      });

      scrollContent.addEventListener("mousemove", (e) => {
        if (!isScrolling) return;
        const x = e.pageX - scrollContent.offsetLeft;
        const walk = (x - startX) * 2; // Adjust the scroll speed as needed
        scrollContent.scrollLeft = scrollLeft - walk;
      });

      scrollContent.addEventListener("mouseup", () => {
        isScrolling = false;
        scrollContent.style.scrollBehavior = "smooth"; // Re-enable smooth scrolling
      });

      scrollContent.addEventListener("mouseleave", () => {
        isScrolling = false;
        scrollContent.style.scrollBehavior = "smooth"; // Re-enable smooth scrolling
      });
    }
  }, [ref]);
  return <div>
    <SectionTitle
      title={'Playlists'}
      extras={
        <Button onClick={() => {
          return router.push('/playlists');
        }} type={'text'}>All Playlists</Button>
      }
    />
    <div
      ref={ref}
      className={styles.listOuter}
    >
      {renderPlaylists.map(playlist => {
        let playlistDescription = '';
        if (playlist.tracks.length > 0) {
          playlistDescription = playlist.tracks.filter((x, i) => i < 2).map(t => t.author.name).join(', ');
        }
        return (
          <div
            className={styles.item}
            onClick={() => {
              return router.push(`/playlists/${playlist.id}`);
            }}
          >
            <PlaylistArtwork playlist={playlist}/>
            <div className={styles.meta}>
              <Typography.Text className={styles.name}>
                {playlist.name}
              </Typography.Text>
              <Typography.Text className={styles.desc}>
                {playlist.tracks.length > 0 && playlistDescription}
              </Typography.Text>
            </div>
          </div>
        );
      })}
    </div>
  </div>
}
