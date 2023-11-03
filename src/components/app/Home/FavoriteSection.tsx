import SectionTitle from "@/components/app/Home/SectionTitle";
import styles from "./FavoriteSection.module.scss";
import {useAppSelector} from "@/redux/hooks";
import {Typography} from "antd";
import TrackHorizontalSeries from "@/components/app/Home/TrackHorizontalSeries";

export default function FavoriteSection() {
  const {favoriteTracks} = useAppSelector(state => state.app);
  return <div className={styles.favoriteSection}>
    <SectionTitle title={'Favorites'}/>
    <TrackHorizontalSeries tracks={favoriteTracks}/>
  </div>
}
