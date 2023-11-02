import styles from "@/styles/AppLayout.module.scss";
import FooterPlayer from "@/components/app/FooterPlayer";
import {Layout} from "antd";
import {ReactNode} from "react";

interface PlayerLayoutProps {
  children: ReactNode;
}

export default function PlayerLayout({children}: PlayerLayoutProps) {
  return <>
    <Layout className={styles.playerOuter}>
      <div className={styles.content}>
        {children}
      </div>
      <FooterPlayer/>
    </Layout>
  </>
}
