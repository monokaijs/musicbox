import {AutoComplete, Button, Input, Layout} from "antd";
import {SearchOutlined, UsergroupAddOutlined} from "@ant-design/icons";
import styles from "@/styles/Home.module.css";
import {useState} from "react";
import apiService from "@/services/api.service";
import {useRouter} from "next/router";
import SearchInput from "@/components/shared/SearchInput";
import FavoriteSection from "@/components/app/Home/FavoriteSection";
import ExploreSection from "@/components/app/Home/ExploreSection";

export default function Home() {
  return (
    <Layout>
      <div className={styles.headerControls}>
        <SearchInput/>
        <Button
          icon={<UsergroupAddOutlined/>}
        />
      </div>
      <FavoriteSection/>
      <ExploreSection/>
    </Layout>
  )
}
