import styles from "@/styles/AppLayout.module.scss";
import FooterPlayer from "@/components/app/FooterPlayer";
import {Layout} from "antd";
import React, {lazy, ReactNode, useEffect, useState} from "react";
import PlayerModal from "@/components/app/PlayerModal";
import AudioControlModal from "@/components/app/AudioControlModal";
import QueueModal from "@/components/app/QueueModal";
import CreatePlaylistModal from "@/components/app/CreatePlaylistModal";
import AddTrackToPlaylistModal from "@/components/app/AddTrackToPlaylistModal";

interface PlayerLayoutProps {
  children: ReactNode;
}

const PeerProvider = lazy(() => import('@/components/providers/PeerProvider'));

export default function PlayerLayout({children}: PlayerLayoutProps) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return <>
    <Layout className={styles.playerOuter}>
      <div className={styles.content}>
        {children}
        <FooterPlayer/>
        <PlayerModal/>
        <QueueModal/>
        <AddTrackToPlaylistModal/>
        <AudioControlModal/>
        <CreatePlaylistModal/>
      </div>
      {isClient && <PeerProvider/>}
    </Layout>
  </>
}
