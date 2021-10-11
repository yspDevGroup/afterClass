/* eslint-disable no-nested-ternary */
/*
 * @description:
 * @author: wsl
 * @Date: 2021-09-04 14:33:06
 * @LastEditTime: 2021-10-09 15:58:17
 * @LastEditors: Sissle Lynn
 */
import GoBack from '@/components/GoBack';
import { getStudentClasses } from '@/services/after-class/khbjsj';
import { createKHTKSJ, getKHTKSJ } from '@/services/after-class/khtksj';
import { getXXTZGG } from '@/services/after-class/xxtzgg';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { Button, Checkbox, message, Modal, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';
import styles from './index.less';
import noOrder from '@/assets/noOrder.png';

const { TabPane } = Tabs;

const DropClass = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [Record, setRecord] = useState<any>([]);
  const getKHTKSJData = async () => {
    const { student } = currentUser || {};
    const res = await getKHTKSJ({
      XSId:localStorage.getItem('studentId') ||  (student && student[0].student_userid) || '20210901',
      KHBJSJId: '',
      XXJBSJId: currentUser?.xxId,
      ZT: [0, 1, 2],
      page: 0,
      pageSize: 0,
    });
    setRecord(res.data?.rows);
  };
  useEffect(() => {
    getKHTKSJData();
  }, []);

  return (
    <div className={styles.DropClass}>
      <GoBack title={'退课退款'} onclick="/parent/home?index=mine" />
      <div className={styles.appBtn}>
        <Link to='/parent/mine/dropClass/apply'>我要退课</Link>
      </div>
      {Record?.length === 0 ? (
        <div className={styles.ZWSJ}>
          <img src={noOrder} alt="" />
          <p>暂无数据</p>
        </div>
      ) : (
        <div className={styles.Record}>
          <div>
            {Record.map((value: any) => {
              const num = value!.KHBJSJ!.KSS! - value?.KSS;
              const color = value.ZT !== 2 ? '#FF6600' : '#FF0000';
              return (
                <div className={styles.cards}>
                  <p className={styles.title}>
                    {value.KHBJSJ?.KHKCSJ?.KCMC}
                    <span style={{ color: '#009688',fontWeight:'normal'  }}>【{value.KHBJSJ?.BJMC}】</span>
                  </p>
                  <p>
                    总课时：{value.KHBJSJ?.KSS}节 ｜ 已学课时：{num}节{' '}
                  </p>
                  <p>
                    未学课时：{value.KSS}节 ｜ 可退课时：{value.KSS}节
                  </p>
                  <p
                    className={styles.state}
                    style={{ color }}
                  >
                    {value.ZT === 0 ? '退课中' : value.ZT === 1 ? '已退课待退款' : '退课失败'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropClass;
