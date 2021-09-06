import type { FC } from "react";
import { Button, Modal } from "antd";
import { history } from "umi";

import styles from './index.less';

type propttype = {
  text: string;
  link?: string;
  open: boolean;
  colse: () => void;
  event?: () => void;
}


const PromptInformation: FC<propttype> = (
  { text,
    link,
    open,
    colse,
    event
  }
) => {

  return (
    <Modal
      title={null}
      footer={null}
      visible={open}
      maskClosable={true}
      keyboard
      closable={false}
      width='500px'
      centered
    >
      <div className={styles.box}>
        <h2 style={{ textAlign: 'center', fontWeight: 'bold', color: 'rgba(36, 54, 81, 1)', fontSize: '14px' }}>系统提示</h2>
        <div className={styles.text}>{text}</div>
        <div className={styles.link}>
          <Button style={{ marginRight: '16px' }} type='primary' onClick={() => {
            if (link && link !== '') {
              history.push(link)
            };
            event;
          }}>现在去设置</Button>
          <Button onClick={colse}>关闭</Button>

        </div>
      </div>
    </Modal>
  )
}

export default PromptInformation
