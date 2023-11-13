import {Button} from "antd";
import styles from "@/pages/playlists/Playlist.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {useRouter} from "next/router";

export default function GoBack() {
  const router = useRouter();
  return (<Button
    className={styles.backButton}
    icon={<FontAwesomeIcon icon={faChevronLeft}/>}
    shape={'round'}
    size={'large'}
    onClick={() => router.back()}
  >
    Go Back
  </Button>)
}
