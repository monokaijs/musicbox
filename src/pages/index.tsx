import {Button, Input, Layout} from "antd";
import {SearchOutlined, UsergroupAddOutlined} from "@ant-design/icons";
import styles from "@/styles/Home.module.css";

export default function Home() {
  return (
    <Layout style={{padding: 16}}>
      <div className={styles.headerControls}>
        <Input
          placeholder={'Search for songs...'}
          addonAfter={
            <Button type={'text'} size={'small'}>
              <SearchOutlined/>
            </Button>
          }
        />
        <Button
          icon={<UsergroupAddOutlined/>}
        />
      </div>
    </Layout>
  )
}
