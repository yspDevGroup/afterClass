import React from "react";
import { history } from "umi";
import IconFont from "../CustomIcon";
import styles from './index.less'


type backtye = {
    title: string;
    onclick?: string;
    teacher?: boolean;
}


const GoBack = (props: backtye) => {
    const { title, onclick, teacher } = props;
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
        </div>
    )
}

export default GoBack