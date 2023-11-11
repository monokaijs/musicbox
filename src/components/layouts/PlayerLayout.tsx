import styles from "@/styles/AppLayout.module.scss";
import FooterPlayer from "@/components/app/FooterPlayer";
import {Layout} from "antd";
import {ReactNode} from "react";
import PlayerModal from "@/components/app/PlayerModal";
import AudioControlModal from "@/components/app/AudioControlModal";
import QueueModal from "@/components/app/QueueModal";

interface PlayerLayoutProps {
  children: ReactNode;
}

export default function PlayerLayout({children}: PlayerLayoutProps) {
  return <>
    <Layout className={styles.playerOuter}>
      <div className={styles.content}>
        {children}
        <FooterPlayer/>
        <PlayerModal/>
        <QueueModal/>
        <AudioControlModal/>
      </div>
    </Layout>
  </>
}
