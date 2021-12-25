/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-12-06 09:46:54
 * @LastEditTime: 2021-12-07 17:22:20
 * @LastEditors: Sissle Lynn
 */
import React, { useEffect, useState } from 'react';
import { Button, List } from 'antd';
import moment from 'moment';
import { useModel, history } from 'umi';
import { ParentHomeData } from '@/services/local-services/mobileHome';
import { computedMonth } from '@/services/after-class/khjscq';
import GoBack from '@/components/GoBack';

import noOrder from '@/assets/noOrder1.png';
import icon_stuEvaluate from '@/assets/icon_stuEvaluate.png';
import styles from './index.less';
import { getAllJSCQBQ } from '@/services/after-class/jscqbq';

const Resign: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const userId = currentUser.JSId || testTeacherId;
  const [XNXQId, setXNXQId] = useState<string>();
  const [dataSource, setDataSource] = useState<API.KHBJJSRL[]>([]);
  const getData = async () => {
    const obj = {
      XXJBSJId: currentUser?.xxId,
      XNXQId,
      BQRId: userId,
      page: 0,
      pageSize: 0,
    };
    const resAll = await getAllJSCQBQ(obj);
    if (resAll.status === 'ok' && resAll.data) {
      setDataSource(resAll.data);
    }
  };
  useEffect(() => {
    (async () => {
      const oriData = await ParentHomeData(
        'teacher',
        currentUser?.xxId,
        userId,
      );
      const { xnxqId } = oriData.data;
      setXNXQId(xnxqId);
    })();
  }, []);
  useEffect(() => {
    getData();
  }, [XNXQId]);

  return (
    <>
      <GoBack title={'补签记录'} teacher onclick="/teacher/home?index=education" />
      <div className={styles.resignList} style={{background: '#fff'}}>
        <div className={styles.listWrapper}>
          {dataSource?.length ? (
            <List
              style={{ background: '#fff', paddingLeft: '10px' }}
              itemLayout="horizontal"
              dataSource={dataSource}
              renderItem={(item: any) => {
                const { XXSJPZ, KHBJSJ } = item;
                let color = '#ec8205';
                let bgColor = '#ffe9cf';
                if(item.SPZT === 1){
                  color = '#198061';
                  bgColor = '#c3f3cb';
                }
                if(item.SPZT === 2){
                  color = '#f00';
                  bgColor = '#fdcdd0';
                }
                return (
                  <List.Item
                    key={`${item.id}+${XXSJPZ?.KSSJ}`}
                  >
                    <List.Item.Meta
                      title={`${KHBJSJ?.KHKCSJ?.KCMC}【${KHBJSJ?.BJMC}】`}
                      description={`补签日期：${item.BQRQ} | 补签类型：${item.SQNR}`}
                    />
                    <span style={{
                      color,
                      background:bgColor,
                      padding: '2px 4px',
                      borderRadius: '4px'
                    }}>{item.SPZT === 0 ? '审批中' : (item.SPZT === 1 ? '已通过':'已驳回')}</span>
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
        <div
          className={styles.apply}
          onClick={() => {
            history.push('/teacher/education/resign/dealList');
          }}
        >
          <div>
            <img src={icon_stuEvaluate} />
          </div>
          我要补签
        </div>
      </div>
    </>
  );
};

export default Resign;
