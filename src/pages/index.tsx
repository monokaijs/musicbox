import {Badge, Button, Layout} from "antd";
import {UsergroupAddOutlined} from "@ant-design/icons";
import styles from "@/styles/Home.module.css";
import SearchInput from "@/components/shared/SearchInput";
import ExploreSection from "@/components/app/Home/ExploreSection";
import PlaylistsSection from "@/components/app/Home/PlaylistsSection";
import PlayHistorySection from "@/components/app/Home/PlayHistorySection";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import ConnectDrawer from "@/components/app/ConnectDrawer";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {setConnectSlice} from "@/redux/slices/connect.slice";

export default function Home() {
  const {connected} = useAppSelector(state => state.connect);
  const dispatch = useAppDispatch();

  return (
    <Layout style={{minWidth: 0}}>
      <div className={styles.headerControls}>
        <Button
          type={'text'}
          icon={<FontAwesomeIcon icon={faBars}/>}
        />
        <SearchInput/>
        <Badge
          dot={true}
          status={connected ? 'success' : 'processing'}
        >
          <Button
            type={'text'}
            icon={<UsergroupAddOutlined/>}
            onClick={() => {
              dispatch(setConnectSlice({
                showDrawer: true,
              }));
            }}
          />
        </Badge>
      </div>
      <ExploreSection/>
      <PlaylistsSection/>
      <PlayHistorySection/>
      <ConnectDrawer/>
    </Layout>
  )
}
