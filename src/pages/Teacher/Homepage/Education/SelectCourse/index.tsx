/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-11-29 17:16:51
 * @LastEditTime: 2022-04-20 11:22:20
 * @LastEditors: Wu Zhan
 */
import React, { useEffect, useState } from 'react';
import { useModel, history } from 'umi';
import { List } from 'antd';
import GoBack from '@/components/GoBack';
import { getAll } from '@/services/after-class/khbjjsrl';
import { ParentHomeData } from '@/services/local-services/mobileHome';

import noOrder from '@/assets/noOrder1.png';
import icon_select from '@/assets/icon_classroom.png';
import styles from './index.less';
import MobileCon from '@/components/MobileCon';

const Index = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const userId = currentUser.JSId || testTeacherId;
  const [XNXQId, setXNXQId] = useState<string>();
  // 认领数据
  const [dataSource, setDataSource] = useState<API.KHBJJSRL[]>([]);
  // 获取已有认领数据
  const getData = async () => {
    const res = await getAll({
      XXJBSJId: currentUser.xxId,
      JZGJBSJId: userId,
      XNXQId,
      page: 0,
      pageSize: 0,
    });
    if (res.status === 'ok' && res.data) {
      const { rows } = res.data;
      setDataSource(rows || []);
    }
  };
  useEffect(() => {
    (async () => {
      const oriData = await ParentHomeData('teacher', currentUser?.xxId, userId);
      const { xnxqId } = oriData.data;
      setXNXQId(xnxqId);
    })();
  }, []);
  useEffect(() => {
    getData();
  }, [XNXQId]);
  return (
    <MobileCon>
      <div className={styles.selectedPage}>
        <GoBack title="选课记录" teacher onclick="/teacher/home?index=education" />
        <div className={styles.listWrapper}>
          {dataSource?.length ? (
            <List
              style={{ background: '#fff', paddingLeft: '10px' }}
              itemLayout="horizontal"
              dataSource={dataSource}
              renderItem={(item: any) => {
                const { XXSJPZ, KHBJSJ } = item;
                return (
                  <List.Item key={`${item.id}+${XXSJPZ?.KSSJ}`}>
                    <List.Item.Meta
                      title={`${KHBJSJ?.KHKCSJ?.KCMC}【${KHBJSJ?.BJMC}】`}
                      description={`上课时间：${item.RQ} ${XXSJPZ?.KSSJ?.substring?.(
                        0,
                        5,
                      )} - ${XXSJPZ?.JSSJ?.substring?.(0, 5)}`}
                    />
                    <span
                      style={{
                        background: '#3e88f8',
                        padding: '4px 14px',
                        borderRadius: '14px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    >
                      {item.JSLX === 0 ? '副班' : '主班'}
                    </span>
                  </List.Item>
                );
              }}
            />
          ) : (
            <div className={styles.noData}>
              <img src={noOrder} alt="" />
              <p>暂无数据</p>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div
            className={styles.apply}
            onClick={() => {
              history.push('/teacher/education/selectCourse/apply');
            }}
          >
            <div>
              <img src={icon_select} />
            </div>
            我要选课
          </div>
        </div>
      </div>
    </MobileCon>
  );
};

export default Index;
