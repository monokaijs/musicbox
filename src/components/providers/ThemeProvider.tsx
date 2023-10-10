import {ConfigProvider, theme} from "antd";
import {ReactNode} from "react";

interface ThemeProviderProps {
  children: ReactNode
}

export default function ThemeProvider({children}: ThemeProviderProps) {
  return <ConfigProvider theme={{
    token: {
    },
    algorithm: theme.darkAlgorithm,
  }}>
    {children}
  </ConfigProvider>
}
