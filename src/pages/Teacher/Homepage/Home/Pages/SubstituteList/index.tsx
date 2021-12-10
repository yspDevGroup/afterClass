/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';
import moment from 'moment';
import GoBack from '@/components/GoBack';
import ShowName from '@/components/ShowName';
import { getAllKHJSTDK } from '@/services/after-class/khjstdk';
import noOrder1 from '@/assets/noOrder1.png';

import styles from './index.less';

const SubstituteList = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [Datas, setDatas] = useState<any>([]);
  const [LsDatas, setLsDatas] = useState<any>([]);
  const getData = async () => {
    const res = await getAllKHJSTDK({
      LX: [1],
      ZT: [0, 4],
      XXJBSJId: currentUser?.xxId,
      DKJSId: currentUser.JSId || testTeacherId,
    });
    if (res.status === 'ok') {
      setDatas(res.data?.rows);
    } else {
      setDatas([]);
    }
    // 历史记录
    const result = await getAllKHJSTDK({
      LX: [1],
      ZT: [1, 2, 3, 5],
      XXJBSJId: currentUser?.xxId,
      DKJSId: currentUser.JSId || testTeacherId,
    });
    if (result.status === 'ok') {
      setLsDatas(result.data?.rows);
    } else {
      setLsDatas([]);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className={styles.CourseAdjustment}>
      <GoBack title={'代课申请'} teacher onclick="/teacher/home?index=index" />
      <div className={styles.wrap}>
        {Datas.map((item: any) => {
          return (
            <Link
              to={{
                pathname: '/teacher/education/courseAdjustment/details',
                state: { id: item.id, type: 'edit' },
              }}
            >
              <div className={styles.Information}>
                <div>
                  <h4>
                    <ShowName
                      XM={item?.SKJS?.XM}
                      type="userName"
                      openid={item?.SKJS?.WechatUserId}
                    />
                    教师的代课申请
                    {item.ZT === 3 ? (
                      <span className={styles.cards}>已撤销</span>
                    ) : item.ZT === 4 ? (
                      <span
                        className={styles.cards}
                        style={{ color: '#FFB257', borderColor: '#FFB257' }}
                      >
                        审批中
                      </span>
                    ) : item.ZT === 0 ? (
                      <span
                        className={styles.cards}
                        style={{ color: '#fff', backgroundColor: '#FF7527', border: 'none' }}
                      >
                        待处理
                      </span>
                    ) : item.ZT === 1 ? (
                      <span
                        className={styles.cards}
                        style={{ color: '#45c977', borderColor: '#45c977' }}
                      >
                        已通过
                      </span>
                    ) : item.ZT === 2 || item.ZT === 5 ? (
                      <span
                        className={styles.cards}
                        style={{ color: '#FF4B4B', borderColor: '#FF4B4B' }}
                      >
                        已驳回
                      </span>
                    ) : (
                      ''
                    )}
                  </h4>
                  <span>{moment(item.updatedAt || item.createdAt).format('YYYY.MM.DD')}</span>
                </div>
                <p>
                  课程：{item.KHBJSJ?.KHKCSJ?.KCMC} — {item.KHBJSJ?.BJMC}
                </p>
                <p>
                  {`时间：${moment(item?.SKRQ).format('MM月DD日')}，${
                    item.SKJC?.TITLE
                  }【${item.SKJC?.KSSJ.substring(0, 5)}-
              ${item.SKJC?.JSSJ.substring(0, 5)}】`}
                </p>
                <p>代课原因：{item.BZ}</p>
              </div>
            </Link>
          );
        })}
      </div>
      <div className={styles.Divider}>
        {' '}
        <span>历史记录</span>
      </div>
      {LsDatas?.length === 0 ? (
        <div className={styles.Selected}>
          <div className={styles.noOrder}>
            <img src={noOrder1} alt="" />
            <p>暂无数据</p>
          </div>
        </div>
      ) : (
        <div className={styles.wrap}>
          {LsDatas.map((item: any) => {
            return (
              <Link
                to={{
                  pathname: '/teacher/education/courseAdjustment/details',
                  state: { id: item.id, type: 'view' },
                }}
              >
                <div className={styles.Information}>
                  <div>
                    <h4>
                      <ShowName
                        type="userName"
                        openid={item?.SKJS?.WechatUserId}
                        XM={item.SKJS?.XM}
                      />
                      教师的代课申请
                      {item.ZT === 3 ? (
                        <span>已撤销</span>
                      ) : item.ZT === 4 ? (
                        <span style={{ color: '#FFB257', borderColor: '#FFB257' }}>审批中</span>
                      ) : item.ZT === 0 ? (
                        <span style={{ color: '#fff', backgroundColor: '#FF7527' }}>待处理</span>
                      ) : item.ZT === 1 ? (
                        <span style={{ color: '#45c977', borderColor: '#45c977' }}>已通过</span>
                      ) : item.ZT === 2 || item.ZT === 5 ? (
                        <span style={{ color: '#FF4B4B', borderColor: '#FF4B4B' }}>已驳回</span>
                      ) : (
                        ''
                      )}
                    </h4>
                    <span>{moment(item.updatedAt || item.createdAt).format('YYYY.MM.DD')}</span>
                  </div>
                  <p>
                    {`时间：${moment(item?.SKRQ).format('MM月DD日')}，${
                      item.SKJC?.TITLE
                    }【${item.SKJC?.KSSJ.substring(0, 5)}-
              ${item.SKJC?.JSSJ.substring(0, 5)}】`}
                  </p>
                  <p>课程：{item.KHBJSJ?.KHKCSJ?.KCMC}</p>
                  <p>原因：{item.BZ}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubstituteList;
