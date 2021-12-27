/*
 * @description: 
 * @author: wsl
 * @Date: 2021-12-23 14:26:31
 * @LastEditTime: 2021-12-25 16:20:15
 * @LastEditors: wsl
 */

import { getKHFWBJ, getStudentListByBjid, studentRegistration } from "@/services/after-class/khfwbj";
import { queryXNXQList } from "@/services/local-services/xnxq";
import { Checkbox, Divider, message, Modal, Radio } from "antd";
import { useEffect, useRef, useState } from "react";
import { useModel, history, Link } from "umi";
import styles from './index.less'
import noPic from '@/assets/noPic.png';
import GoBack from "@/components/GoBack";
import { chooseKCByXSId } from "@/services/after-class/khfwbj";
import noCourses from '@/assets/noCourses.png';
import { createKHXSDD } from "@/services/after-class/khxsdd";
import { enHenceMsg } from '@/utils/utils';

const InterestClassroom = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const StorageBjId = localStorage.getItem('studentBJId') || currentUser?.student?.[0].BJSJId || testStudentBJId;
  const StorageXSId = localStorage.getItem('studentId') || (currentUser?.student && currentUser?.student[0].XSJBSJId) || testStudentId;
  const [FWKCData, setFWKCData] = useState<any>();
  const [YXKC, setYXKC] = useState<any[]>([]);
  const [YXKCId, setYXKCId] = useState<any[]>([]);
  const [XNXQ, setXNXQ] = useState<any>();
  const [MouthId, setMouthId] = useState();
  const [ModalVisible, setModalVisible] = useState(false);
  const [Times, setTimes] = useState<any[]>([]);
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const [orderInfo, setOrderInfo] = useState<any>();
  const [BaoMinData, setBaoMinData] = useState<any>();
  const [StudentFWBJId, setStudentFWBJId] = useState();
  const [KSRQ, setKSRQ] = useState();
  const [JSRQ, setJSRQ] = useState();
  //付款状态
  const [FKType, setFKType] = useState(true)


  useEffect(() => {
    (
      async () => {
        const resXNXQ = await queryXNXQList(currentUser?.xxId);
        if (resXNXQ) {
          setXNXQ(resXNXQ.data.find((items: any) => items.id === resXNXQ?.current?.id));
          const result = await getKHFWBJ({
            BJSJId: StorageBjId,
            XNXQId: resXNXQ?.current?.id || '',
          })
          if (result.status === 'ok') {
            setFWKCData(result.data)
            setMouthId(result.data.KHFWSJPZs?.[0].id)

            const newArr: any[] = [];
            result.data?.KHFWSJPZs?.forEach((value: any) => {
              newArr.push(value?.id)
            })
            setTimes(newArr)
          }
        }
      }
    )()
  }, [StorageXSId])

  useEffect(() => {
    (async () => {
      if (StorageXSId) {
        const res = await getStudentListByBjid({
          BJSJId: StorageBjId,
          XSJBSJId: StorageXSId,
          page: 0,
          pageSize: 0
        })
        if (res.status === 'ok') {
          setBaoMinData(res.data.rows[0])
        }
      }
    })()
  }, []);


  useEffect(() => {
    if (BaoMinData && FWKCData) {
      setStudentFWBJId(BaoMinData?.XSFWBJs.find((item: any) => item?.KHFWSJPZId === FWKCData?.KHFWSJPZs?.[0].id).id)
    }

  }, [FWKCData, BaoMinData])
  useEffect(() => {
    setStudentFWBJId(BaoMinData?.XSFWBJs.find((item: any) => item?.KHFWSJPZId === MouthId).id)
    setKSRQ(FWKCData?.KHFWSJPZs.find((item: any) => item.id === MouthId).KSRQ)
    setJSRQ(FWKCData?.KHFWSJPZs.find((item: any) => item.id === MouthId).JSRQ)
  }, [MouthId])

  useEffect(() => {
    if (orderInfo) linkRef.current?.click();
  }, [orderInfo]);

  const onChange = (checkedValues: any) => {
    setYXKC(checkedValues);
    const newArr: any[] = [];
    checkedValues.forEach((value: any) => {
      newArr.push(value.split('+')[0])
    })
    FWKCData?.KCFWBJs?.forEach((value: any) => {
      if (value?.LX === 1) {
        newArr.push(value?.KHBJSJId)
      }
    })
    setYXKCId(newArr);
  };

  // 月份切换
  const onchangeMonth = (e: any) => {
    setMouthId(e.target.value);
    if (BaoMinData?.XSFWBJs.find((item: any) => item.KHFWSJPZId === e.target.value).ZT === 3) {
      setFKType(true)
    } else {
      setFKType(false)
    }
  }
  const onSelect = async () => {
    if (YXKC.length > FWKCData?.KXSL) {
      message.info(`最多可选择${FWKCData?.KXSL}门`)
    } else {
      setModalVisible(true);
    }
  }
  const onDetails = (item: any) => {
    history.push(`/parent/home/courseIntro?classid=${item.KHBJSJId}&index=all`)
  }
  // 选课确认弹框
  const handleOks = async () => {
    setModalVisible(false);
    const res = await chooseKCByXSId({
      XSJBSJId: StorageXSId,
      KHFWBJId: FWKCData?.id,
      KHFWSJPZIds: Times,
      ZT: 3,
      KHBJSJIds: YXKCId
    })
    if (res.status === 'ok') {
      message.success('选课成功')
      // history.push('/parent/home/afterClassCoach/interestClassroom')
    } else {
      message.error('操作失败，请联系管理员')
    }
  };

  // 付款
  const submit = async () => {
    if (StudentFWBJId) {
      const data: API.CreateKHXSDD = {
        XDSJ: new Date().toISOString(),
        ZFFS: '线上支付',
        DDZT: '待付款',
        DDFY: Number(FWKCData?.FWFY),
        XSJBSJId: localStorage.getItem('studentId') || currentUser?.student?.[0]?.XSJBSJId || testStudentId,
        DDLX: 2,
        XSFWBJId: StudentFWBJId,
      };
      const res = await createKHXSDD(data);
      if (res.status === 'ok') {
        setOrderInfo(res.data);
      } else {
        enHenceMsg(res.message);
      }
    }
  };

  return <>
    <div className={styles.InterestClassroom}>
      <GoBack title={'选课报名'}  />

      <div className={styles.titles}>
        <div />
        <span>{XNXQ?.XN.replace('-', '~')}学年：{XNXQ?.XQ}</span>
      </div>
      <div style={{ padding: '0 10px' }}> <Divider dashed={true} /></div>
      <div className={styles.month}>
        {
          FWKCData ? <Radio.Group defaultValue={FWKCData?.KHFWSJPZs?.[0].id} onChange={onchangeMonth}>
            {
              FWKCData?.KHFWSJPZs && FWKCData?.KHFWSJPZs?.map((values: any) => {
                return <Radio.Button value={values?.id}><div className={styles.monthNumber}>{values?.KSRQ.substring(5, 7)}</div><span>月</span></Radio.Button>
              })
            }
          </Radio.Group> : <></>
        }

      </div>
      {
        FWKCData?.KCFWBJs.find((item: any) => item.LX === 1) ? <>
          <div className={styles.Application}>
            <div className={styles.title}>
              <div />
              <span>趣味课堂</span>
              <span>最多可选择{FWKCData?.KXSL}门</span>
            </div>
            <div>
              <Checkbox.Group
                style={{ width: '100%' }}
                // defaultValue={['a24f9e83-cddb-4dbb-b055-ea858008bef0+4年级2班测试课+测试课1-2']}
                onChange={onChange}>
                {
                  BaoMinData && BaoMinData?.XSFWBJs?.[0].XSFWKHBJs?.length === 0 ?
                    <>
                      {FWKCData && FWKCData?.KCFWBJs?.map((value: any) => {
                        if (value?.LX === 0) {
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
                    </> : <> {
                      BaoMinData && BaoMinData?.XSFWBJs[0].XSFWKHBJs.map((value: any) => {
                        if (value?.KHBJSJ?.KCFWBJs?.[0].LX === 0) {
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
                                  value={value.KHBJSJId}
                                  disabled
                                />
                              </div>
                            </>
                          );
                        }
                        return <></>
                      })
                    }</>
                }


              </Checkbox.Group>

            </div>
          </div>
          {
            BaoMinData && BaoMinData?.XSFWBJs?.[0].XSFWKHBJs?.length === 0 && FKType === true ? <div className={styles.footer}>
              <button onClick={onSelect} disabled={YXKC.length === 0}>确认选课</button>
              <button onClick={submit} >确认付款</button>
            </div> : <></>
          }
          {
            BaoMinData && BaoMinData?.XSFWBJs?.[0].XSFWKHBJs?.length === 0 && FKType === false ? <div className={styles.footers}>
              <button onClick={onSelect} disabled={YXKC.length === 0}>确认选课</button>
            </div> : <></>
          }
          {
            BaoMinData && BaoMinData?.XSFWBJs?.[0].XSFWKHBJs?.length !== 0 && FKType === true ? <div className={styles.footers}>
              <button onClick={submit} >去付款</button>
            </div> : <></>
          }
        </> : <>
          <div className={styles.noData}>
            <img src={noCourses} alt="" />
            <p>该课后服务暂未配置课程</p>
            <p>您可以先行缴费﹐随后选课</p>
          </div>
          <div className={styles.footers}>
            <button
              onClick={submit} >去付款</button>
          </div></>
      }

      <Modal
        title="选课信息确认"
        visible={ModalVisible}
        onOk={handleOks}
        onCancel={() => {
          setModalVisible(false);
        }}
        closable={false}
        className={styles.XuanKeModal}
        okText="确认"
        cancelText="取消"
      >
        <div>
          <p>您选择的课程是：</p>
          <p>
            {YXKC.map((value: any) => {
              return <span>【{value.split('+')[1]}】{value.split('+')[2]},</span>
            })} 是否确认？
          </p>

        </div>
      </Modal>
      <Link
        style={{ visibility: 'hidden' }}
        ref={linkRef}
        to={{
          pathname: '/parent/mine/orderDetails',
          state: {
            title: FWKCData?.FWMC,
            detail: '',
            payOrder: orderInfo,
            user: currentUser,
            KKRQ: '',
            JKRQ: '',
            fwdetail: {
              ...FWKCData,
              JSRQ: JSRQ,
              KSRQ: KSRQ,
            },
            type: '服务班',
          },
        }}
      />
    </div>
  </>
}
export default InterestClassroom;