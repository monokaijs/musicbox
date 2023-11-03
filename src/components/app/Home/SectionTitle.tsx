import {Typography} from "antd";
import styles from "./SectionTitle.module.scss";

interface SectionTitleProps {
  title: string;
}

export default function SectionTitle({title}: SectionTitleProps) {
  return <div className={styles.sectionTitle}>
    <Typography.Title level={4}>
      {title}
    </Typography.Title>
  </div>
}
