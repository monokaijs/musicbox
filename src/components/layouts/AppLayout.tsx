import styles from "@/styles/AppLayout.module.scss";
import ThemeProvider from "@/components/providers/ThemeProvider";
import {ReactNode} from "react";
import PlayerProvider from "@/components/providers/PlayerProvider";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({children}: AppLayoutProps) {
  return <ThemeProvider>
    <PlayerProvider>
      <div className={styles.outer}>
        {children}
      </div>
    </PlayerProvider>
  </ThemeProvider>
}
