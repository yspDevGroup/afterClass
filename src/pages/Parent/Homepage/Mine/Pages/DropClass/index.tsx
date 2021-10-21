/* eslint-disable no-nested-ternary */
/*
 * @description: 退课
 * @author: wsl
 * @Date: 2021-09-04 14:33:06
 * @LastEditTime: 2021-10-21 15:01:43
 * @LastEditors: zpl
 */
import GoBack from '@/components/GoBack';
import { getKHTKSJ } from '@/services/after-class/khtksj';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';
import styles from './index.less';
import noOrder from '@/assets/noOrder.png';
import { createKHXSTK, getAllKHXSTK } from '@/services/after-class/khxstk';

const DropClass = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [Record, setRecord] = useState<any>([]);
  const { student } = currentUser || {};
  const StorageXSId = localStorage.getItem('studentId');
  const XSId = StorageXSId || (student && student[0].XSJBSJId) || testStudentId;
  const getKHTKSJData = async () => {
    const res = await getKHTKSJ({
      XSJBSJId: XSId,
      KHBJSJId: '',
      XXJBSJId: currentUser?.xxId,
      ZT: [0, 1, 2],
      page: 0,
      pageSize: 0,
    });
    const resAll = await getAllKHXSTK({
      XXJBSJId: currentUser?.xxId,
      XSJBSJId: XSId,
      page: 0,
      pageSize: 0,
    });
    if (resAll.data?.count && res.data?.rows?.length) {
      const oriList = res.data?.rows;
      const newList = resAll.data?.rows;
      const curList = [].map.call(oriList, (item: API.KHTKSJ) => {
        if (item.ZT !== 2) {
          const TKinfo = newList?.find((val: API.KHXSTK) => item.KHBJSJId === val.KHBJSJId);
          switch (TKinfo?.TKZT) {
            case 0:
            case 1:
              item.ZT = 3;
              break;
            case 2:
              item.ZT = 4;
              break;
            case 3:
              item.ZT = 5;
              break;
            case 4:
              item.ZT = 6;
              item.BZ = TKinfo.BZ;
              break;
            default:
              break;
          }
        }
        return item;
      });
      setRecord(curList);
    } else {
      setRecord(res.data?.rows);
    }
  };
  useEffect(() => {
    getKHTKSJData();
  }, [StorageXSId]);
  return (
    <div className={styles.DropClass}>
      <GoBack title={'退课退款'} onclick="/parent/home?index=mine" />
      <div className={styles.appBtn}>
        <Link to="/parent/mine/dropClass/apply">我要退课</Link>
      </div>
      {!Record?.length ? (
        <div className={styles.ZWSJ}>
          <img src={noOrder} alt="" />
          <p>暂无数据</p>
        </div>
      ) : (
        <div className={styles.Record}>
          <div>
            {Record?.map((value: any) => {
              const num = value!.KHBJSJ!.KSS! - value?.KSS;
              const color = value.ZT !== 2 ? '#FF6600' : '#FF0000';
              return (
                <div className={styles.cards}>
                  <p className={styles.title}>
                    {value.KHBJSJ?.KHKCSJ?.KCMC}
                    <span style={{ color: '#009688', fontWeight: 'normal' }}>
                      【{value.KHBJSJ?.BJMC}】
                    </span>
                  </p>
                  <p>
                    总课时：{value.KHBJSJ?.KSS}节 ｜ 已学课时：{num}节{' '}
                  </p>
                  <p>
                    未学课时：{value.KSS}节 ｜ 可退课时：{value.KSS}节
                  </p>
                  <p className={styles.state} style={{ color }}>
                    {value.ZT === 0 ? '申请中' : ''}
                    {value.ZT === 2 ? '退课失败' : ''}
                    {value.ZT === 1 || value.ZT === 3 ? '退款中' : ''}
                    {value.ZT === 4 ? '退款被驳回' : ''}
                    {value.ZT === 5 ? '退款成功' : ''}
                    {value.ZT === 6 ? '退款失败' : ''}
                  </p>
                  {value.ZT === 2 ? <p>退课说明：{value.BZ}</p> : ''}
                  {value.ZT === 4 ? <p>退款说明：{value.BZ}</p> : ''}
                  {value.ZT === 4 ? (
                    <button
                      onClick={async () => {
                        const result = await createKHXSTK({
                          /** 退款金额 */
                          TKJE: value?.TKJE || 0,
                          /** 退款状态 */
                          TKZT: 0,
                          /** 学生ID */
                          XSJBSJId: XSId,
                          /** 班级ID */
                          KHBJSJId: value?.KHBJSJId,
                          /** 学校ID */
                          XXJBSJId: currentUser?.xxId,
                        });
                        if (result.status === 'ok') {
                          message.success('退款申请成功');
                          getKHTKSJData();
                        }
                      }}
                    >
                      申请退款
                    </button>
                  ) : (
                    ''
                  )}
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
