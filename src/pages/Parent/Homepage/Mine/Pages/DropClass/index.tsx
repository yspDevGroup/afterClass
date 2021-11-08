/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/*
 * @description: 退订
 * @author: wsl
 * @Date: 2021-09-04 14:33:06
 * @LastEditTime: 2021-10-25 11:26:56
 * @LastEditors: Sissle Lynn
 */
import GoBack from '@/components/GoBack';
import { Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel, history, Link } from 'umi';
import styles from './index.less';
import noOrder from '@/assets/noOrder.png';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { createKHXSTK } from '@/services/after-class/khxstk';
import { getAllRefunds } from '@/services/after-class/khtksj';
import { RightOutlined } from '@ant-design/icons';

const DropClass = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [Record, setRecord] = useState<any>([]);
  const { student } = currentUser || {};
  const StorageXSId = localStorage.getItem('studentId');
  const XSId = StorageXSId || (student && student[0].XSJBSJId) || testStudentId;

  const getTD = async () => {
    const result = await queryXNXQList(currentUser?.xxId, undefined);
    const res = await getAllRefunds({
      XSJBSJId: XSId,
      XNXQId: result.current.id,
    })
    if (res.status === 'ok') {
      setRecord(res.data?.rows);
    }
  }


  useEffect(() => {
    getTD();
  }, [StorageXSId]);
  return (
    <div className={styles.DropClass}>
      <GoBack title={'我的退订'} onclick="/parent/home?index=mine" />

      {!Record?.length ? (
        <div className={styles.ZWSJ}>
          <img src={noOrder} alt="" />
          <p>暂无数据</p>
        </div>
      ) : (
        <div className={styles.Record}>
          <div>
            {Record?.map((value: any) => {
              const num = value?.KHBJSJ?.KSS - value?.KSS;
              return (
                <Link
                key="ck"
                to={{
                  pathname: '/parent/mine/dropClass/details',
                  state: value,
                }}
              >
                <div className={styles.cards}>
                  <p className={styles.title}>
                    {
                      value?.KHXXZZFW ? <>
                        {value?.KHXXZZFW?.FWMC}
                        <span style={{ color: '#009688', fontWeight: 'normal' }}>
                          【{value?.KHXXZZFW?.KHZZFW?.FWMC}】
                        </span>
                      </> : <>
                        {value.KHBJSJ?.KHKCSJ?.KCMC}
                        <span style={{ color: '#009688', fontWeight: 'normal' }}>
                          【{value.KHBJSJ?.BJMC}】
                        </span>
                      </>
                    }

                  </p>
                  {
                    value?.KHXXZZFW ? <>
                      <p>服务时段：{value?.KHXXZZFW?.KSRQ} ~ {value?.KHXXZZFW?.JSRQ}</p>
                      <p>申请日期：{value?.createdAt?.split(' ')[0]}</p>
                    </> : <>
                      <p>
                        总课时：{value.KHBJSJ?.KSS}节 ｜ 已学课时：{num}节{' '}
                      </p>
                      <p>
                        未学课时：{value.KSS}节 ｜ 可退课时：{value.KSS}节
                      </p>
                    </>
                  }
                  <p className={styles.state}>
                    {value.ZT === 0 ? <span style={{ color: '#FF6600' }}>申请中</span> : ''}
                    {value.ZT === 2 && value?.KHXSTKs?.length === 0 ? <span style={{ color: '#FF0000' }}>退订失败</span> : ''}
                    {value?.KHXSTKs?.length !== 0 && value?.KHXSTKs?.[0].TKZT === '0' ? <span style={{ color: '#FF6600' }}>退款中</span> : ''}
                    {value?.KHXSTKs?.length !== 0 && value?.KHXSTKs?.[0].TKZT === '2' ? <span style={{ color: '#FF0000' }}>退款被驳回</span> : ''}
                    {(value?.KHXSTKs?.length !== 0 && value?.KHXSTKs?.[0].TKZT === '3') || value?.KHXSTKs?.length === 0 && value?.ZT === 1 ? <span style={{ color: '#45c977' }}>退款成功</span> : ''}
                    {value?.KHXSTKs?.length !== 0 && value?.KHXSTKs?.[0].TKZT === '4' ? <span style={{ color: '#FF0000' }}>退款失败</span> : ''}
                    <RightOutlined />
                  </p>
                  {value.ZT === 2 && value?.KHXSTKs?.length === 0 ? <p>退订说明：{value?.BZ}</p> : ''}
                  {value?.KHXSTKs?.length !== 0 && value?.KHXSTKs?.[0].TKZT === '2' ? <p>退款说明：{value?.KHXSTKs?.[0].BZ}</p> : ''}

                  {value?.KHXSTKs?.length !== 0 && value?.KHXSTKs?.[0].TKZT === '2' ? (
                    <button
                      onClick={async () => {
                        let data: any = {};
                        if (value?.KHXXZZFW === null) {
                          data = {
                            TKJE: value?.KHXSTKs?.[0].TKJE || 0,
                            TKZT: 0,
                            XSJBSJId: XSId,
                            KHBJSJId: value?.KHBJSJId,
                            XXJBSJId: currentUser?.xxId,
                            KHTKSJId: value?.id
                          }
                        } else {
                          data = {
                            TKJE: value?.KHXSTKs?.[0].TKJE || 0,
                            TKZT: 0,
                            XSJBSJId: XSId,
                            KHXXZZFWId: value?.KHXXZZFW?.id,
                            XXJBSJId: currentUser?.xxId,
                            KHTKSJId: value?.id
                          }
                        }
                        const result = await createKHXSTK(data);
                        if (result.status === 'ok') {
                          message.success('退款申请成功');
                          getTD();
                        }
                      }}
                    >
                      申请退款
                    </button>
                  ) : (
                    ''
                  )}
                </div>
              </Link>

              );
            })}
          </div>
        </div>
      )}
      <div className={styles.btns}>
        <Button onClick={() => {
          history.push("/parent/mine/dropClass/apply")
        }} disabled={false}>申请退订</Button>
      </div>
    </div>
  );
};

export default DropClass;
