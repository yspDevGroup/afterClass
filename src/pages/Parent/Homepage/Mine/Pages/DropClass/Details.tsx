/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
import GoBack from '@/components/GoBack';


const Details = (props: any) => {
  const { state } = props.location;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [Type, setType] = useState<string>();
  useEffect(() => {
    if (state.ZT === 0) {
      setType('申请中')
    } else if (state.ZT === 2 && state?.KHXSTKs?.length === 0) {
      setType('退订失败')
    } else if (state?.KHXSTKs?.length !== 0 && state?.KHXSTKs?.[0].TKZT === '0') {
      setType('退款中')
    } else if (state?.KHXSTKs?.length !== 0 && state?.KHXSTKs?.[0].TKZT === '2') {
      setType('退款被驳回')
    } else if ((state?.KHXSTKs?.length !== 0 && state?.KHXSTKs?.[0].TKZT === '3') || state?.KHXSTKs?.length === 0 && state?.ZT === 1) {
      setType('退款成功')
    } else if (state?.KHXSTKs?.length !== 0 && state?.KHXSTKs?.[0].TKZT === '4') {
      setType('退款失败')
    }
  }, [])
  return (
    <>
      <GoBack title={'退款详情'} />
      <div className={styles.OrderDetails}>
        <div className={styles.hender}>
          {Type === '退款成功' ? (
            <CheckCircleOutlined />
          ) : (
            <ExclamationCircleOutlined />
          )}
          {Type}
        </div>
        <div
          className={styles.content}
          style={{ marginTop: Type === '退款成功' ? '-38px' : '-20px' }}
        >
          {state?.KHXXZZFW ? (
            <div className={styles.FWXX}>
              <ul>
                <p className={styles.title}>{state?.KHXXZZFW?.FWMC}</p>
                <li>
                  服务类型：{state?.KHXXZZFW?.KHZZFW?.FWMC}
                </li>
                <li>
                  服务时段：{state?.KHXXZZFW?.KSRQ}~{state?.KHXXZZFW?.JSRQ}
                </li>
                <li>
                  学生：<span className={styles.xx}>{localStorage.getItem('studentName') || currentUser?.student?.[0].name}</span>
                </li>
              </ul>
            </div>
          ) : (
            <div className={styles.KCXX}>
              <p className={styles.title}>{state?.KHBJSJ?.KHKCSJ?.KCMC}</p>
              <ul>
                <li>班级：{state?.KHBJSJ?.BJMC}</li>
                <li>
                  学生：<span className={styles.xx}>{localStorage.getItem('studentName') || currentUser?.student?.[0].name}</span>
                </li>
                <li>总课时：{state?.KHBJSJ?.KSS}</li>
                <li>可退订时：{state?.KSS}</li>
              </ul>
            </div>
          )}

          {state?.KHXXZZFW ? (
            <div className={styles.KCZE}>
               <p>
                <span>申请时间</span><span>{state?.createdAt}</span>
              </p>
              {
                Type === '退款成功' ?
                  <p>
                    <span>退款时间</span><span>{state?.KHXSTKs?.[0].TKSJ}</span>
                  </p> : <></>
              }
              <p>
                <span>服务总额</span> <span>￥{Number(state?.KHXXZZFW?.FY).toFixed(2)}</span>
              </p>
              {
                Type === '退款成功' ?
                  <p>
                    <span>退款金额</span><span>￥{Number(state?.KHXSTKs?.[0].TKJE).toFixed(2)}</span>
                  </p> : <></>
              }
            </div>
          ) : (
            <div className={styles.KCZE}>
                <p>
                <span>申请时间</span><span>{state?.createdAt}</span>
              </p>
              {
                Type === '退款成功' ?
                  <p>
                    <span>退款时间</span><span>{state?.KHXSTKs?.[0].TKSJ}</span>
                  </p> : <></>
              }
              <p>
                <span>课程总额</span> <span>￥{Number(state?.KHBJSJ?.FY).toFixed(2)}</span>
              </p>
              {
                Type === '退款成功' ?
                  <p>
                    <span>退款金额</span><span>￥{Number(state?.KHXSTKs?.[0].TKJE).toFixed(2)}</span>
                  </p> : <></>
              }
            </div>
          )}
          {
            Type === '退订失败' || Type === '退款被驳回' ? <div className={styles.KCZE}>
              {state.ZT === 2 && state?.KHXSTKs?.length === 0 ? <p>退订说明：{state?.BZ}</p> : ''}
              {state?.KHXSTKs?.length !== 0 && state?.KHXSTKs?.[0].TKZT === '2' ? <p>退款说明：{state?.KHXSTKs?.[0].BZ}</p> : ''}
            </div> : <></>
          }
        </div>
      </div>
    </>
  )
};

export default Details;
