import styles from "@/components/app/Home/TrackHorizontalSeries.module.scss";
import {Typography} from "antd";
import {useAppSelector} from "@/redux/hooks";

interface TrackHorizontalSeriesProps {
  tracks: YouTubeTrack[];
}

export default function TrackHorizontalSeries({tracks}: TrackHorizontalSeriesProps) {
  return <div className={styles.itemsList}>
    {tracks.map((track, index) => {
      if (!track.title) return;
      if (!track.author) return;
      console.log(track.id);
      return (<div className={styles.item} key={track.id + "_" + index}>
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
