import {Badge, Button, Layout} from "antd";
import {UsergroupAddOutlined} from "@ant-design/icons";
import styles from "@/styles/Home.module.css";
import SearchInput from "@/components/shared/SearchInput";
import ExploreSection from "@/components/app/Home/ExploreSection";
import PlaylistsSection from "@/components/app/Home/PlaylistsSection";
import PlayHistorySection from "@/components/app/Home/PlayHistorySection";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {setConnectSlice} from "@/redux/slices/connect.slice";
import {lazy, useEffect, useState} from "react";

const ConnectDrawer = lazy(() => import('@/components/app/ConnectDrawer'));

export default function Home() {
  const {connected, connections} = useAppSelector(state => state.connect);
  const dispatch = useAppDispatch();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Layout style={{minWidth: 0}}>
      <div className={styles.headerControls}>
        <Button
          type={'text'}
          icon={<FontAwesomeIcon icon={faBars}/>}
        />
        <SearchInput/>
        <Badge
          dot={!connected || connections.length === 0}
          count={connections.length > 0 ? connections.length : undefined}
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
      {isClient && <ConnectDrawer/>}
    </Layout>
  )
}
