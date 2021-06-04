import Modal from "antd/lib/modal/Modal"
import type { FC} from "react";
import { useState } from "react"
import { Link } from "umi"
import styles from './index.less'



type propttype = {
    text: string;
    link?: string;
}


const PromptInformation: FC<propttype> = (
    { text,
        link,
     }
) => {
    const [open, setopen] = useState<boolean>(true)
    const colse=()=>{
        setopen(false)
    }
   
    return (
        <>
            <Modal
                title={null}
                footer={null}
                visible={open}
                maskClosable={true}
                keyboard
                closable={false}
                width='35vw'
                centered
            >
                <div className={styles.box}>
                    <h2 style={{textAlign:'center',color:'rgba(81, 208, 129, 1)'}}>系统提示</h2>
                    <div className={styles.text}>{text}</div>
                    <div className={styles.link}>
                       
                    <span style={{marginRight:'10px'}} onClick={colse}>关闭</span>
                    <Link to={link!}>
                            <span style={{color:'rgba(81, 208, 129, 1)',opacity:0.7}}>现在去设置</span>
                    </Link>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default PromptInformation