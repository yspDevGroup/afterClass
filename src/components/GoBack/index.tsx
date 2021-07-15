import React from "react";
import { Link } from "umi";
import IconFont from "../CustomIcon";
import styles from './index.less'


type backtye = {
    title: string;
    onclick?: string;
    teacher?: boolean;
}


const GoBack = (props: backtye) => {
    const { title, onclick, teacher } = props;
    const toback = () => {
        window.history.go(-1)
    }
    return (
        <div className={teacher ? styles.th : styles.hz} >
            {
                onclick ? <>
                    <div className={styles.tp}>
                        <Link to={onclick}>
                            <IconFont type="icon-gengduo" />
                        </Link>
                    </div>
                    <div className={styles.wz}>{title}</div></>
                    :
                    <>
                        <div className={styles.tp} onClick={() => toback()}>
                            <IconFont type="icon-gengduo" />
                        </div>
                        <div className={styles.wz}>{title}</div>
                    </>
            }
        </div>
    )
}

export default GoBack