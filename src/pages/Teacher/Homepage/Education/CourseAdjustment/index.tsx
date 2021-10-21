/* eslint-disable no-nested-ternary */
import GoBack from "@/components/GoBack";
import styles from './index.less'
import noOrder1 from '@/assets/noOrder1.png';
import { history, useModel } from 'umi'
import { useEffect, useState } from "react";
import { getAllKHJSTDK } from "@/services/after-class/khjstdk";
import WWOpenDataCom from "@/components/WWOpenDataCom";
import { Button, message } from "antd";
import moment from "moment";
import { compareNow } from "@/utils/Timefunction";
import { enHenceMsg } from "@/utils/utils";

const CourseAdjustment = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [Datas, setDatas] = useState<any>([]);
  useEffect(() => {
    (
      async () => {
        const res = await getAllKHJSTDK({
          LX: [0, 1],
          ZT: [0, 1, 2],
          XXJBSJId: currentUser?.xxId
        })
        if (res.status === 'ok') {
          setDatas(res.data?.rows)
        }
      }
    )()
    setDatas([])
  }, [])
  const handleCancle = async (d: any) => {
    // const res = await updateKHJSQJ({ id: d.id }, { QJZT: 3 });
    // if (res.status === 'ok') {
    //   message.success(`申请已撤销`);
    //   getData();
    // } else {
    //   enHenceMsg(res.message);
    // }
  };
  return <div className={styles.CourseAdjustment}>
    <GoBack title={'教师调代课'} teacher onclick='/teacher/home?index=education' />
    {
      Datas?.length === 0 ? <div className={styles.Selected}>
        <div className={styles.noOrder}>
          <div>
            <p>您当前没有任何记录</p>
          </div>
          <img src={noOrder1} alt="" />
        </div>
      </div> :
      <div className={styles.wrap}>
        {
          Datas.map((item: any) => {
            const con1 = compareNow(item.KHJSQJKCs?.[0].QJRQ, item.KSSJ);
            const showWXName = item?.SKJS?.XM === '未知' && item?.SKJS?.WechatUserId;
            return (
              <div className={styles.Information}>
                <div>
                  <h4>
                    {
                      showWXName ? <WWOpenDataCom type="userName" openid={item?.SKJS?.WechatUserId} /> : item.SKJS?.XM
                    }教师的{item?.LX === 1 ? '代课':'调课' }申请{item.ZT === 3 ? <span>已撤销</span> :
                      item.ZT === 0 ? <span style={{ color: '#FFB257', borderColor: '#FFB257' }}>审批中</span> :
                        item.ZT === 1 ? <span style={{ color: '#45c977', borderColor: '#45c977' }}>已通过</span> :
                          item.ZT === 2 ? <span style={{ color: '#FF4B4B', borderColor: '#FF4B4B' }}>已驳回</span> : ''}</h4>
                  <span>
                    {moment(item.updatedAt || item.createdAt).format('YYYY.MM.DD')}
                  </span>
                </div>
                <p>时间：{moment(item?.SKRQ).format('MM月DD日')}， {item.XXSJPZ?.KSSJ.substring(0,5)}-{item.XXSJPZ?.JSSJ.substring(0,5)}</p>
                <p>课程：{item.KHBJSJ?.KHKCSJ?.KCMC}</p>
                <p>原因：{item.BZ}</p>
                {item.ZT === 0 && con1 ? (
                  <Button onClick={() => handleCancle(item)}>
                    撤销
                  </Button>
                ) : ('')}
              </div>
            );
          })
        }
        </div>
    }

    <div className={styles.apply} onClick={() => {
      history.push('/teacher/education/courseAdjustment/applys')
    }}><div>+</div>发起申请</div>
  </div>
}

export default CourseAdjustment;
