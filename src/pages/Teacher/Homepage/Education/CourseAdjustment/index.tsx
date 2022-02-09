/* eslint-disable no-nested-ternary */
import GoBack from '@/components/GoBack';
import styles from './index.less';
import noOrder1 from '@/assets/noOrder1.png';
import { history, Link, useModel } from 'umi';
import { useEffect, useState } from 'react';
import { getAllKHJSTDK, updateKHJSTDK } from '@/services/after-class/khjstdk';
import ShowName from '@/components/ShowName';
import { Button, message, Tabs } from 'antd';
import moment from 'moment';
import { enHenceMsg } from '@/utils/utils';
import { PlusOutlined } from '@ant-design/icons';
import TDKList from './TDKList';

const { TabPane } = Tabs;
const CourseAdjustment = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [Datas, setDatas] = useState<any>([]);
  const [state, setstate] = useState('DCL');
  const [DCLDatas, setDCLDatas] = useState<any>([]);
  const [YCLDatas, setYCLDatas] = useState<any>([]);

  // 待处理和已处理的调代课
  const getData = async () => {
    // 待处理
    const res = await getAllKHJSTDK({
      LX: [1, 2],
      ZT: [0],
      XXJBSJId: currentUser?.xxId,
      DKJSId: currentUser.JSId || testTeacherId,
    });
    if (res.status === 'ok') {
      setDCLDatas(res.data?.rows);
    } else {
      setDCLDatas([]);
    }
    // 已处理
    const result = await getAllKHJSTDK({
      LX: [1, 2],
      ZT: [1, 2, 3, 4, 5],
      XXJBSJId: currentUser?.xxId,
      DKJSId: currentUser.JSId || testTeacherId,
    });
    if (result.status === 'ok') {
      setYCLDatas(result.data?.rows);
    } else {
      setYCLDatas([]);
    }
    //已发起
    const resYFQ = await getAllKHJSTDK({
      LX: [0, 1, 2],
      ZT: [0, 1, 2, 3, 4, 5],
      XXJBSJId: currentUser?.xxId,
      SKJSId: currentUser.JSId || testTeacherId,
    });
    if (resYFQ.status === 'ok') {
      setDatas(resYFQ.data?.rows);
    } else {
      setDatas([]);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const handleCancle = async (item: any) => {
    const res = await updateKHJSTDK({ id: item.id }, { ZT: 3, XXJBSJId: currentUser.xxId });
    if (res.status === 'ok') {
      message.success(`申请已撤销`);
      getData();
    } else {
      enHenceMsg(res.message);
    }
  };

  const onchange = (key: any) => {
    setstate(key);
  };
  return (
    <div className={styles.CourseAdjustment}>
      <GoBack title={'教师调代课'} teacher onclick="/teacher/home?index=education" />
      <Tabs type="card" activeKey={state} onChange={onchange}>
        <TabPane tab="待处理" key="DCL">
          <TDKList data={DCLDatas} type="edit" />
        </TabPane>
        <TabPane tab="已处理" key="YCL">
          <TDKList data={YCLDatas} type="view" />
        </TabPane>
        <TabPane tab="已发起" key="YFQ">
          {Datas?.length === 0 ? (
            <div className={styles.Selected}>
              <div className={styles.noOrder}>
                <div>
                  <p>您当前没有任何记录</p>
                </div>
                <img src={noOrder1} alt="" />
              </div>
            </div>
          ) : (
            <div className={styles.wrap}>
              {Datas.map((item: any) => {
                return (
                  <div className={styles.Information}>
                    <Link
                      to={{
                        pathname: '/teacher/education/courseAdjustment/details',
                        state: { id: item.id, type: 'view' },
                      }}
                    >
                      <div>
                        <h4>
                          <ShowName
                            type="userName"
                            openid={item?.SKJS?.WechatUserId}
                            XM={item.SKJS?.XM}
                          />
                          教师的{item?.LX === 1 ? '代课' : '调课'}申请
                          {item.ZT === 3 ? (
                            <span className={styles.cards}>已撤销</span>
                          ) : item.ZT === 0 || item.ZT === 4 ? (
                            <span
                              className={styles.cards}
                              style={{ color: '#FFB257', borderColor: '#FFB257' }}
                            >
                              审批中
                            </span>
                          ) : item.ZT === 1 ? (
                            <span
                              className={styles.cards}
                              style={{ color: '#15B628', borderColor: '#15B628' }}
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
                        {`${item?.LX === 0 ? '原上课' : ''}时间：${moment(item?.SKRQ).format(
                          'MM月DD日',
                        )}，${item.SKJC?.TITLE}【${item.SKJC?.KSSJ.substring(0, 5)}-
              ${item.SKJC?.JSSJ.substring(0, 5)}】`}
                      </p>
                      <p>
                        {item?.LX === 0
                          ? `调课后时间：${moment(item?.TKRQ).format('MM月DD日')}，${
                              item.TKJC?.TITLE
                            }【${item.TKJC?.KSSJ.substring(0, 5)}-
              ${item.TKJC?.JSSJ.substring(0, 5)}】`
                          : ''}
                      </p>
                      <p>
                        {item?.LX === 1 ? '代课' : '调课'}原因：{item.BZ}
                      </p>
                    </Link>
                    {item.ZT === 0 ? <Button onClick={() => handleCancle(item)}>撤销</Button> : ''}
                  </div>
                );
              })}
            </div>
          )}
        </TabPane>
      </Tabs>

      <div
        className={styles.apply}
        onClick={() => {
          history.push('/teacher/education/courseAdjustment/applys');
        }}
      >
        <div>
          <PlusOutlined />
        </div>
        发起申请
      </div>
    </div>
  );
};

export default CourseAdjustment;
