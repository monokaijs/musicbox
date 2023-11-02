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
    <div className={styles.outer}>
      {children}
    </div>
  </ThemeProvider>
}
