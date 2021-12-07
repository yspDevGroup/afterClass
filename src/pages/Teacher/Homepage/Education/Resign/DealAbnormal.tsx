/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-12-06 15:46:41
 * @LastEditTime: 2021-12-06 16:49:33
 * @LastEditors: Sissle Lynn
 */
import React, { useState } from 'react';
import { Button, Divider, Input, List, Modal } from 'antd';
import GoBack from '@/components/GoBack';
import styles from './index.less';

const { TextArea } = Input;
const dataSource = [{
  title: '少儿美术【少儿美术1班】',
  date: '2021-11-13',
  time: '15:50-16:20',
},
{
  title: '少儿美术【少儿美术1班】',
  date: '2021-11-19',
  time: '15:50-16:20',
}];
const DealAbnormal: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>();
  const showModal = () => {
    setVisible(true);
  };
  return (
    <>
      <GoBack title={'教师补签'} teacher onclick="/teacher/education/resign" />
      <div className={styles.dealWrapper}>
        <div className={styles.card}>
          <h3>11月汇总</h3>
          <div className={styles.flexWrapper}>
            <div>
              <h3>16</h3>
              <span className={styles.light}>考勤总数</span>
            </div>
            <div>
              <h3>2</h3>
              <span className={styles.light}>缺卡总数</span>
            </div>
          </div>
        </div>
        <List
          className={styles.dealList}
          itemLayout="horizontal"
          dataSource={dataSource}
          renderItem={item =>
          (
            <List.Item
              actions={[<a key="list-more" onClick={() => {
                setCurrent(item);
                showModal();
              }}>去处理</a>]}
            >
              <List.Item.Meta
                title={<span>{item.title}</span>}
                description={<p>{item.date} {item.time}</p>}
              />
            </List.Item>
          )
          }
        />
        <Modal
          title="我要补签"
          centered
          closable={false}
          visible={visible}
          onOk={() => setVisible(false)}
          onCancel={() => setVisible(false)}
          footer={[
            <Button key="back" onClick={() => setVisible(false)}>
              取消
            </Button>,
            <Divider type='vertical' />,
            <Button key="submit" type='link' onClick={() => setVisible(false)}>
              确认
            </Button>,
          ]}
        >
          <p>{current?.title}</p>
          <p><span>缺卡原因：</span><TextArea style={{marginTop: 16}} rows={4} /></p>
        </Modal>
      </div>
    </>
  );
};

export default DealAbnormal;
