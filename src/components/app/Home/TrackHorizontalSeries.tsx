import styles from "@/components/app/Home/TrackHorizontalSeries.module.scss";
import {Empty, Typography} from "antd";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {ReactNode, useEffect, useRef} from "react";
import {enqueueTrack} from "@/redux/actions/player.actions";
import apiService from "@/services/api.service";

interface TrackHorizontalSeriesProps {
  tracks: YouTubeTrack[];
}

export default function TrackHorizontalSeries({tracks}: TrackHorizontalSeriesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (scrollRef && scrollRef.current) {
      let isScrolling = false;
      let startX = 0;
      let scrollLeft = 0;
      let scrollContent = scrollRef.current;

      scrollContent.addEventListener("mousedown", (e) => {
        isScrolling = true;
        startX = e.pageX - scrollContent.offsetLeft;
        scrollLeft = scrollContent.scrollLeft;
        scrollContent.style.scrollBehavior = "auto"; // Disable smooth scrolling temporarily
      });

      scrollContent.addEventListener("mousemove", (e) => {
        if (!isScrolling) return;
        const x = e.pageX - scrollContent.offsetLeft;
        const walk = (x - startX); // Adjust the scroll speed as needed
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
  }, [scrollRef]);
  return <div className={styles.itemsList} ref={scrollRef}>
    {(tracks?.length === 0) && (
      <Empty
        description={'No tracks here...'}
      />
    )}
    {tracks && tracks.map((track, index) => {
      if (!track.title) return;
      if (!track.author) return;
      return (<div
        className={styles.item} key={track.id + "_" + index}
        onClick={() => {
          // TODO: load track info on click before enqueue
          apiService.getTrack(track.id).then(response => {
            dispatch(enqueueTrack({
              track: response.data,
              playNow: true,
            }));
          });
        }}
      >
        <div
          style={{
            backgroundImage: `url('${(track.thumbnails || track.thumbnail)?.[0].url}')`
          }}
          className={styles.itemArtwork}
        />
        <div className={styles.itemMeta}>
          <Typography.Text ellipsis={true} className={styles.trackTitle}>
            {track.title.text}
          </Typography.Text>
          <Typography.Text ellipsis={true} className={styles.trackArtist}>
            {track.author.name}
          </Typography.Text>
        </div>
      </div>);
    })}
  </div>
}
