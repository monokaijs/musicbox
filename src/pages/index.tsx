import {Button, Layout} from "antd";
import {UsergroupAddOutlined} from "@ant-design/icons";
import styles from "@/styles/Home.module.css";
import SearchInput from "@/components/shared/SearchInput";
import ExploreSection from "@/components/app/Home/ExploreSection";
import PlaylistsSection from "@/components/app/Home/PlaylistsSection";
import PlayerProvider from "@/components/app/PlayerProvider";

export default function Home() {

  return (
    <Layout>
      <div className={styles.headerControls}>
        <SearchInput/>
        <Button
          icon={<UsergroupAddOutlined/>}
        />
      </div>
      <ExploreSection/>
      <PlaylistsSection/>
    </Layout>
  )
}
