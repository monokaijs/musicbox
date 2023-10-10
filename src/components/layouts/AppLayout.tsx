import styles from "@/styles/AppLayout.module.scss";
import ThemeProvider from "@/components/providers/ThemeProvider";
import {ReactNode} from "react";
import FooterPlayer from "../app/FooterPlayer";
import {Layout} from "antd";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({children}: AppLayoutProps) {
  return <ThemeProvider>
    <Layout className={styles.outer}>
      <div className={styles.content}>
        {children}
      </div>
      <FooterPlayer/>
    </Layout>
  </ThemeProvider>
}
