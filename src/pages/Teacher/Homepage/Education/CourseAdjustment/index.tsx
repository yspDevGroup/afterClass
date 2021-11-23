/* eslint-disable no-nested-ternary */
import GoBack from "@/components/GoBack";
import styles from './index.less'
import noOrder1 from '@/assets/noOrder1.png';
import { history, Link, useModel } from 'umi'
import { useEffect, useState } from "react";
import { getAllKHJSTDK, updateKHJSTDK } from "@/services/after-class/khjstdk";
import WWOpenDataCom from "@/components/WWOpenDataCom";
import { Button, message } from "antd";
import moment from "moment";
import { enHenceMsg } from "@/utils/utils";
import { PlusOutlined } from "@ant-design/icons";

const CourseAdjustment = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [Datas, setDatas] = useState<any>([]);
  const getData = async () => {
    const res = await getAllKHJSTDK({
      LX: [0, 1],
      ZT: [0, 1, 2, 3, 4, 5],
      XXJBSJId: currentUser?.xxId,
      SKJSId: currentUser.JSId || testTeacherId,
    })
    if (res.status === 'ok') {
      setDatas(res.data?.rows)
    } else {
      setDatas([])
    }
  }
  useEffect(() => {
    getData();
  }, [])
  const handleCancle = async (item: any) => {
    const res = await updateKHJSTDK({ id: item.id }, { ZT: 3, XXJBSJId: currentUser.xxId, });
    if (res.status === 'ok') {
      message.success(`申请已撤销`);
      getData();
    } else {
      enHenceMsg(res.message);
    }

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
              const showWXName = item?.SKJS?.XM === '未知' && item?.SKJS?.WechatUserId;
              return (

                <div className={styles.Information}>
                  <Link
                    to={{
                      pathname: '/teacher/education/courseAdjustment/details',
                      state: { id: item.id, type: 'view' }
                    }}>
                    <div>
                      <h4>
                        {
                          showWXName ? <WWOpenDataCom type="userName" openid={item?.SKJS?.WechatUserId} /> : item.SKJS?.XM
                        }教师的{item?.LX === 1 ? '代课' : '调课'}申请{item.ZT === 3 ? <span>已撤销</span> :
                          item.ZT === 0 || item.ZT === 4 ? <span style={{ color: '#FFB257', borderColor: '#FFB257' }}>审批中</span> :
                            item.ZT === 1 ? <span style={{ color: '#45c977', borderColor: '#45c977' }}>已通过</span> :
                              item.ZT === 2 || item.ZT === 5 ? <span style={{ color: '#FF4B4B', borderColor: '#FF4B4B' }}>已驳回</span> : ''}</h4>
                      <span>
                        {moment(item.updatedAt || item.createdAt).format('YYYY.MM.DD')}
                      </span>
                    </div>
                    <p>时间：{moment(item?.SKRQ).format('MM月DD日')}， {item.XXSJPZ?.KSSJ.substring(0, 5)}-{item.XXSJPZ?.JSSJ.substring(0, 5)}</p>
                    <p>课程：{item.KHBJSJ?.KHKCSJ?.KCMC}</p>
                    <p>原因：{item.BZ}</p>
                  </Link>
                  {item.ZT === 0 ? (
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
    }}><div><PlusOutlined /></div>发起申请</div>
  </div>
}

export default CourseAdjustment;
