import React from "react";
import { history, Link } from "umi";
import IconFont from "../CustomIcon";
import styles from './index.less';

type backtye = {
  title: string;
  onclick?: string;
  teacher?: boolean;
  showReFund?: boolean;
}
const GoBack = (props: backtye) => {
  const { title, onclick, teacher, showReFund } = props;
  const toback = (url?: string) => {
    if (url) {
      history.replace(url);
    } else {
      history.go(-1);
    }
  };
  return (
    <div className={teacher ? `${styles.hz} ${styles.th}` : styles.hz} >
      <div className={styles.tp} onClick={() => toback(onclick)}>
        <IconFont type="icon-gengduo" />
      </div>
      <div className={styles.wz}>{title}</div>
      {showReFund ? <Link to={'/parent/mine/dropClass'}><span className={styles.td}>退订<IconFont type="icon-gengduo" /></span></Link> : ''}
    </div>
  )
}
export default GoBack
