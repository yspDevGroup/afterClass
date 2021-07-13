import React from "react";
import { Link } from "umi";
import IconFont from "../CustomIcon";
import styles from './index.less'


type backtye = {
    title: string;
    onclick?: string;
}


const GoBack = (props: backtye) => {
    const { title, onclick } = props;
    const toback = () => {
        window.history.go(-1)
    }
    return (
        <div className={styles.hz} >
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