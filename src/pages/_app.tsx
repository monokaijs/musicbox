import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import AppLayout from "@/components/layouts/AppLayout";
import PlayerLayout from "@/components/layouts/PlayerLayout";

export default function App({Component, pageProps}: AppProps) {
  console.log(pageProps);
  return <AppLayout>
    <PlayerLayout>
      <Component {...pageProps} />
    </PlayerLayout>
  </AppLayout>
}
