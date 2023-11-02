import {AutoComplete, Button, Input, Layout} from "antd";
import {SearchOutlined, UsergroupAddOutlined} from "@ant-design/icons";
import styles from "@/styles/Home.module.css";
import {useState} from "react";
import apiService from "@/services/api.service";
import {useRouter} from "next/router";
import SearchInput from "@/components/shared/SearchInput";

export default function Home() {
  return (
    <Layout style={{padding: 16}}>
      <div className={styles.headerControls}>
        <SearchInput/>
        <Button
          icon={<UsergroupAddOutlined/>}
        />
      </div>
    </Layout>
  )
}
