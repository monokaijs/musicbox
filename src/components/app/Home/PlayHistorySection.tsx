import styles from "./PlayHistorySection.module.scss";
import SectionTitle from "@/components/app/Home/SectionTitle";
import {Button} from "antd";
import {useRouter} from "next/router";
import VerticalTracksList from "@/components/shared/VerticalTracksList";
import {useAppSelector} from "@/redux/hooks";
export default function PlayHistorySection() {
  const {playHistory} = useAppSelector(state => state.app);
  const router = useRouter();

  return <div className={styles.outer}>
    <SectionTitle
      title={'History'}
      extras={
        <Button onClick={() => {
          return router.push('/history');
        }} type={'text'}>View all</Button>
      }
    />
    <VerticalTracksList
      tracks={playHistory.filter((x, i) => i < 5)}
    />
  </div>
}
