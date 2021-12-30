import { getStudentListByBjid } from "@/services/after-class/khfwbj"
import { getQueryString } from "@/utils/utils";
import { Checkbox } from "antd";
import { useEffect, useState } from "react"
import { useModel, history } from "umi";
import styles from './index.less';
import noPic from '@/assets/noPic.png';
import GoBack from "@/components/GoBack";

/*
 * @description: 
 * @author: wsl
 * @Date: 2021-12-29 23:41:59
 * @LastEditTime: 2021-12-30 16:06:22
 * @LastEditors: wsl
 */
const AfterClassDetails = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const StorageBjId = localStorage.getItem('studentBJId') || currentUser?.student?.[0].BJSJId || testStudentBJId;
  const StorageXSId = localStorage.getItem('studentId') || currentUser?.student?.[0].XSJBSJId || testStudentId;
  // 获取报名的课后服务
  const [BaoMinData, setBaoMinData] = useState<any>();
  const classid = getQueryString('classid');
  const path = getQueryString('path');
  useEffect(() => {
    (
      async () => {
        if (classid) {
          const res = await getStudentListByBjid({
            BJSJId: StorageBjId,
            XSJBSJId: StorageXSId,
            KHFWSJPZId: classid,
            page: 0,
            pageSize: 0
          })
          if (res.status === 'ok') {
            console.log(res)
            setBaoMinData(res.data.rows)
          }
        }
      }
    )()
  }, [StorageXSId])
  const onDetails = (item: any) => {
    // history.push(`/parent/home/courseTable?classid=${item.id}&path=study`)
    history.push(`/parent/home/courseIntro?classid=${item.KHBJSJId}&index=all`)
  }
  return <div className={styles.InterestClassroom}>

    {
      path ? <GoBack title={'课后服务详情'} onclick={`/parent/home?index=${path}`} /> : <GoBack title={'课后服务详情'} />
    }
    <div className={styles.FWTP}>
      {
        BaoMinData?.[0]?.XSFWBJs?.[0]?.KHFWBJ?.FWTP ? <img src={BaoMinData?.[0]?.XSFWBJs?.[0]?.KHFWBJ?.FWTP} alt="" /> : <img style={{ width: '180px', height: '180px' }} src={noPic} alt="" />
      }
    </div>
    <p className={styles.FWMC}>{BaoMinData?.[0]?.XSFWBJs?.[0]?.KHFWBJ?.FWMC || ''}</p>
    <p className={styles.FWSD}>服务时段：{BaoMinData?.[0]?.XSFWBJs?.[0]?.KHFWSJPZ?.KSRQ}~{BaoMinData?.[0]?.XSFWBJs?.[0]?.KHFWSJPZ?.JSRQ}</p>
    <div className={styles.Application}>
      {
        BaoMinData && BaoMinData?.[0]?.XSFWBJs?.[0]?.XSFWKHBJs?.find((item: any) => item.KHBJSJ?.KCFWBJs?.[0]?.LX === 1) ? <>

          <div className={styles.title}>
            <div />
            <span>课业辅导</span>
          </div>
          <div>
            <Checkbox.Group
              style={{ width: '100%' }}
            // onChange={onChange}
            >
              {BaoMinData && BaoMinData?.[0]?.XSFWBJs?.[0]?.XSFWKHBJs?.map((value: any) => {
                if (value?.KHBJSJ?.KCFWBJs?.[0]?.LX === 1) {
                  return (
                    <>
                      <div className={styles.cards}>
                        <img src={value?.KHBJSJ?.KHKCSJ?.KCTP || noPic} alt="" />
                        <div className={styles.box}>
                          <p>{value?.KHBJSJ?.KHKCSJ.KCMC}-{value?.KHBJSJ?.BJMC}</p>
                          <span onClick={() => {
                            onDetails(value)
                          }} >查看详情</span>
                        </div>

                        <Checkbox
                          value={`${value.KHBJSJId}+${value?.KHBJSJ?.KHKCSJ?.KCMC}+${value?.KHBJSJ?.BJMC}`}
                          disabled
                        />
                      </div>
                    </>
                  );
                }
                return <></>
              })}
            </Checkbox.Group>

          </div></>
          : <></>
      }
      {
        BaoMinData && BaoMinData?.[0]?.XSFWBJs?.[0]?.XSFWKHBJs?.find((item: any) => item.KHBJSJ?.KCFWBJs?.[0]?.LX === 0) ? <>
          <div className={styles.title}>
            <div />
            <span>趣味课堂</span>
          </div>
          <div>
            <Checkbox.Group
              style={{ width: '100%' }}
            // onChange={onChange}
            >
              {BaoMinData && BaoMinData?.[0]?.XSFWBJs?.[0]?.XSFWKHBJs?.map((value: any) => {
                if (value?.KHBJSJ?.KCFWBJs?.[0]?.LX === 0) {
                  return (
                    <>
                      <div className={styles.cards}>
                        <img src={value?.KHBJSJ?.KHKCSJ?.KCTP || noPic} alt="" />
                        <div className={styles.box}>
                          <p>{value?.KHBJSJ?.KHKCSJ.KCMC}-{value?.KHBJSJ?.BJMC}</p>
                          <span onClick={() => {
                            onDetails(value)
                          }} >查看详情</span>
                        </div>

                        <Checkbox
                          value={`${value.KHBJSJId}+${value?.KHBJSJ?.KHKCSJ?.KCMC}+${value?.KHBJSJ?.BJMC}`}
                          disabled
                        />
                      </div>
                    </>
                  );
                }
                return <></>
              })}
            </Checkbox.Group>
          </div></>
          : <></>
      }

    </div>
  </div>
}

export default AfterClassDetails;