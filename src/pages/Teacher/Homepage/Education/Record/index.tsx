import GoBack from "@/components/GoBack";
import {Rate } from "antd";
import styles from './index.less'
import { Link } from "umi";
import { RightOutlined } from "@ant-design/icons";
import noOrder from '@/assets/noOrder1.png';

const Record = (props: any) => {
  const { state } = props.location;
  return <div className={styles.Record}>
    课堂风采
  </div>
}
export default Record;
