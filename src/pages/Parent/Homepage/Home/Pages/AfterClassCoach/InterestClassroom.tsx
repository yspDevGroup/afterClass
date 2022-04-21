/*
 * @description: 课后服务选课
 * @author: wsl
 * @Date: 2021-12-23 14:26:31
 * @LastEditTime: 2022-04-21 13:53:24
 * @LastEditors: Wu Zhan
 */

import { queryXNXQList } from '@/services/local-services/xnxq';
import { Button, Checkbox, Divider, message, Modal, Radio, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useModel, history, Link } from 'umi';
import styles from './index.less';
import noPic from '@/assets/noPic.png';
import GoBack from '@/components/GoBack';
import noCourses from '@/assets/noCourses.png';
import { enHenceMsg } from '@/utils/utils';
import { ParentHomeData } from '@/services/local-services/mobileHome';
import { chooseKCByXSId } from '@/services/after-class/khfwbj';
import { createKHXSDD } from '@/services/after-class/khxsdd';
import GroupS from '@/assets/GroupS.png';
import {
  getKHFWBJ,
  getStudentListByBjid,
  getWBMXS,
  studentRegistration,
} from '@/services/after-class/khfwbj';
import moment from 'moment';
import MobileCon from '@/components/MobileCon';

const InterestClassroom = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const StorageBjId =
    localStorage.getItem('studentBJId') || currentUser?.student?.[0]?.BJSJId || testStudentBJId;
  const StorageXSId =
    localStorage.getItem('studentId') ||
    (currentUser?.student && currentUser?.student[0]?.XSJBSJId) ||
    testStudentId;
  const studentNjId =
    localStorage.getItem('studentNjId') ||
    (currentUser?.student && currentUser?.student[0]?.NJSJId) ||
    testStudentNJId;
  const StorageXQSJId =
    localStorage.getItem('studentXQSJId') ||
    (currentUser?.student && currentUser?.student[0]?.XQSJId) ||
    testStudentXQSJId;
  const [FWKCData, setFWKCData] = useState<any>();
  const [YXKC, setYXKC] = useState<any[]>([]);
  const [YXKCId, setYXKCId] = useState<any[]>([]);
  const [XNXQ, setXNXQ] = useState<any>();
  const [MouthId, setMouthId] = useState();
  const [ModalVisible, setModalVisible] = useState(false);
  const [IsModalVisible, setIsModalVisible] = useState(false);
  const [Times, setTimes] = useState<any[]>([]);
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const [orderInfo, setOrderInfo] = useState<any>();
  const [BaoMinData, setBaoMinData] = useState<any>();
  const [StudentFWBJId, setStudentFWBJId] = useState();
  const [KSRQ, setKSRQ] = useState();
  const [JSRQ, setJSRQ] = useState();
  // 付款状态
  const [FKType, setFKType] = useState(true);
  const [XKType, setXKType] = useState(true);
  // 是否开启付款
  const [PayType, setPayType] = useState(true);
  // 是否退课成功
  const [DropOutType, setDropOutType] = useState(true);
  // 我要报名弹窗
  const [BmModalVisible, setBmModalVisible] = useState(false);
  // 未报名时段
  const [WbmDatas, setWbmDatas] = useState<any>([]);
  // const [WbmIds, setWbmIds] = useState();
  // 选择报名的时段Id
  const [BmTimeIds, setBmTimeIds] = useState();
  // 辅导班Id
  const [FDBId, setFDBId] = useState<any[]>([]);
  const [BmCouse, setBmCouse] = useState<any>([]);
  // 选课并付款
  const [XKFKType, setXKFKType] = useState<boolean>();
  // 报名时段
  const [BMDate, setBMDate] = useState();

  useEffect(() => {
    (async () => {
      const resXNXQ = await queryXNXQList(currentUser?.xxId);
      if (resXNXQ) {
        setXNXQ(resXNXQ?.data?.find((items: any) => items.id === resXNXQ?.current?.id));
        const result = await getKHFWBJ({
          BJSJId: StorageBjId,
          XNXQId: resXNXQ?.current?.id || '',
          ZT: [1],
        });
        if (result.status === 'ok') {
          setFWKCData(result.data);
          setMouthId(result.data.KHFWSJPZs?.[0].id);
          setBMDate(result.data.KHFWSJPZs?.[0].JSRQ);
          const newIdArr: any[] = [];
          result.data?.KCFWBJs?.forEach((value: any) => {
            if (value?.LX === 1) {
              newIdArr.push(value?.KHBJSJId);
            }
          });
          setFDBId(newIdArr);
        }
      }
    })();
  }, [StorageXSId]);

  const xuankeState = async () => {
    if (StorageXSId) {
      const res = await getStudentListByBjid({
        BJSJId: StorageBjId,
        XSJBSJId: StorageXSId,
        ZT: [0, 1, 3],
        page: 0,
        pageSize: 0,
      });
      if (res.status === 'ok') {
        setBaoMinData(res.data.rows[0]);
        const newArr: any[] = [];
        res.data.rows[0]?.XSFWBJs?.forEach((value: any) => {
          if (
            value?.XSFWKHBJs.find((item: any) => item?.KHBJSJ?.KCFWBJs?.[0]?.LX === 0) === undefined
          ) {
            newArr.push(value?.KHFWSJPZId);
          }
        });
        setTimes(newArr);
        if (
          res.data.rows[0]?.XSFWBJs?.[res.data.rows[0]?.XSFWBJs.length - 1].XSFWKHBJs?.find(
            (item: any) => item?.KHBJSJ?.KCFWBJs?.[0]?.LX === 0,
          )
        ) {
          setXKType(false);
        } else {
          setXKType(true);
        }
      }
    }
  };
  const xuankeStates = async () => {
    setMouthId(MouthId);
    if (StorageXSId) {
      const res = await getStudentListByBjid({
        BJSJId: StorageBjId,
        XSJBSJId: StorageXSId,
        ZT: [0, 1, 3],
        page: 0,
        pageSize: 0,
      });
      if (res.status === 'ok') {
        const data = res.data.rows[0];
        setStudentFWBJId(data?.XSFWBJs.find((item: any) => item?.KHFWSJPZId === MouthId)?.id);
        setBaoMinData(data);
        const Datas = data?.XSFWBJs?.find((item: any) => item?.KHFWSJPZId === MouthId);
        setBmCouse(Datas.XSFWKHBJs);
        if (Datas) {
          setDropOutType(true);
        } else {
          setDropOutType(false);
        }
        const newArr: any[] = [];
        res.data.rows[0]?.XSFWBJs?.forEach((value: any) => {
          if (
            value?.XSFWKHBJs.find((item: any) => item?.KHBJSJ?.KCFWBJs?.[0]?.LX === 0) === undefined
          ) {
            newArr.push(value?.KHFWSJPZId);
          }
        });
        if (
          res.data.rows[0]?.XSFWBJs.find((item: any) => item.KHFWSJPZId === MouthId)?.KHFWSJPZ
            ?.isPay === 0
        ) {
          setPayType(false);
        } else {
          setPayType(true);
        }
        setTimes(newArr);
        setXKType(true);
        setFKType(true);
      }
    }
  };
  useEffect(() => {
    xuankeState();
  }, []);

  useEffect(() => {
    if (BaoMinData && MouthId === FWKCData?.KHFWSJPZs?.[0].id) {
      setBmCouse(
        BaoMinData?.XSFWBJs?.find((item: any) => item?.KHFWSJPZId === FWKCData?.KHFWSJPZs?.[0].id)
          ?.XSFWKHBJs,
      );
    }
  }, [BaoMinData, MouthId]);

  useEffect(() => {
    if (BaoMinData && FWKCData) {
      const FKZT = BaoMinData?.XSFWBJs.find(
        (item: any) => item?.KHFWSJPZId === FWKCData?.KHFWSJPZs?.[0].id,
      )?.ZT;
      if (FKZT === 0 || FKZT === 1) {
        setFKType(false);
      }
      if (FWKCData?.KHFWSJPZs?.[0].id === MouthId) {
        setStudentFWBJId(
          BaoMinData?.XSFWBJs.find((item: any) => item?.KHFWSJPZId === FWKCData?.KHFWSJPZs?.[0].id)
            ?.id,
        );
      }

      if (
        BaoMinData?.XSFWBJs.find((item: any) => item?.KHFWSJPZId === FWKCData?.KHFWSJPZs?.[0].id)
      ) {
        setDropOutType(true);
      } else {
        setDropOutType(false);
      }
      if (MouthId && MouthId !== FWKCData?.KHFWSJPZs?.[0].id) {
        if (
          BaoMinData?.XSFWBJs.find((item: any) => item.KHFWSJPZId === MouthId)?.KHFWSJPZ?.isPay ===
          0
        ) {
          setPayType(false);
        }
        if (BaoMinData?.XSFWBJs.find((item: any) => item.KHFWSJPZId === MouthId)?.ZT === 3) {
          setFKType(true);
        } else {
          setFKType(false);
        }
      } else {
        if (
          BaoMinData?.XSFWBJs.find((item: any) => item.KHFWSJPZId === FWKCData?.KHFWSJPZs?.[0].id)
            ?.ZT === 3
        ) {
          setFKType(true);
        } else {
          setFKType(false);
        }
        if (
          BaoMinData?.XSFWBJs.find((item: any) => item.KHFWSJPZId === FWKCData?.KHFWSJPZs?.[0].id)
            ?.KHFWSJPZ?.isPay === 0
        ) {
          setPayType(false);
        }
      }
    }
  }, [FWKCData, BaoMinData]);

  useEffect(() => {
    setStudentFWBJId(BaoMinData?.XSFWBJs.find((item: any) => item?.KHFWSJPZId === MouthId)?.id);
    setKSRQ(FWKCData?.KHFWSJPZs.find((item: any) => item.id === MouthId).KSRQ);
    setJSRQ(FWKCData?.KHFWSJPZs.find((item: any) => item.id === MouthId).JSRQ);
    setBMDate(FWKCData?.KHFWSJPZs.find((item: any) => item.id === MouthId).JSRQ);
  }, [MouthId]);

  useEffect(() => {
    if (orderInfo) linkRef.current?.click();
  }, [orderInfo]);

  const onChange = (checkedValues: any) => {
    setYXKC(checkedValues);
    const newArr: any[] = [];
    checkedValues.forEach((value: any) => {
      newArr.push(value.split('+')[0]);
    });
    setYXKCId(newArr);
  };

  // 月份切换
  const onchangeMonth = (e: any) => {
    setMouthId(e.target.value);
    const NewXSFWKHBJs = BaoMinData?.XSFWBJs?.find(
      (item: any) => item?.KHFWSJPZId === e.target.value,
    )?.XSFWKHBJs;
    setBmCouse(NewXSFWKHBJs);
    // 判断是否已退课
    if (BaoMinData?.XSFWBJs.find((item: any) => item.KHFWSJPZId === e.target.value)) {
      setDropOutType(true);
    } else {
      setDropOutType(false);
    }
    if (NewXSFWKHBJs?.find((item: any) => item?.KHBJSJ?.KCFWBJs?.[0]?.LX === 0)) {
      setXKType(false);
    } else {
      setXKType(true);
    }

    // 付款状态
    if (BaoMinData?.XSFWBJs.find((item: any) => item.KHFWSJPZId === e.target.value)?.ZT === 3) {
      setFKType(true);
    } else {
      setFKType(false);
    }
    // 是否开启支付
    if (
      BaoMinData?.XSFWBJs.find((item: any) => item.KHFWSJPZId === e.target.value)?.KHFWSJPZ
        ?.isPay === 0
    ) {
      setPayType(false);
    } else {
      setPayType(true);
    }
  };
  const onSelect = async (value: any) => {
    if (value === 'XKFK') {
      setXKFKType(true);
    } else {
      setXKFKType(false);
    }
    if (YXKC.length > FWKCData?.KXSL) {
      message.info(`最多可选择${FWKCData?.KXSL}门`);
    } else {
      setModalVisible(true);
    }
  };
  const onDetails = (item: any) => {
    history.push(`/parent/home/courseIntro?classid=${item.KHBJSJId}&index=all`);
  };

  // 付款
  const submit = async () => {
    if (StudentFWBJId) {
      const data: API.CreateKHXSDD = {
        XDSJ: new Date().toISOString(),
        ZFFS: '线上支付',
        DDZT: '待付款',
        DDFY: Number(FWKCData?.FWFY),
        XSJBSJId:
          localStorage.getItem('studentId') || currentUser?.student?.[0]?.XSJBSJId || testStudentId,
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
  // 选课确认弹框
  const handleOks = async () => {
    const res = await chooseKCByXSId({
      XSJBSJId: StorageXSId,
      KHFWBJId: FWKCData?.id,
      KHFWSJPZIds: Times,
      ZT: Number(FWKCData?.FWFY) === 0 ? 0 : 3,
      KHBJSJIds: YXKCId,
    });
    if (res.status === 'ok') {
      if (XKFKType === true) {
        submit();
      } else {
        message.success('选课成功');
        setModalVisible(false);
        xuankeState();
        window.location.reload();
      }
      // 数据信息重新更新获取
      await ParentHomeData(
        'student',
        currentUser?.xxId,
        StorageXSId,
        studentNjId,
        StorageBjId,
        StorageXQSJId,
        true,
      );
    } else {
      message.error('操作失败，请联系管理员');
    }
  };

  // 我要报名
  const BmSubmit = async () => {
    const res = await getWBMXS({
      XSJBSJId: StorageXSId,
      KHFWBJId: FWKCData?.id,
    });
    if (res.status === 'ok') {
      const arr = res.data?.filter((value: any) => {
        return moment(value?.JSRQ).format('YYYY/MM/DD') >= moment(new Date()).format('YYYY/MM/DD');
      });
      setWbmDatas(arr);
      setBmModalVisible(true);
      const newArr: any = [];
      arr?.forEach((value: any) => {
        newArr.push(value?.id);
      });
      setBmTimeIds(newArr);
    }
  };

  const BmHandleOk = async () => {
    const res = await studentRegistration({
      KHFWBJId: FWKCData?.id,
      XSJBSJIds: [StorageXSId],
      KHBJSJIds: FDBId || [],
      ZT: Number(FWKCData?.FWFY) === 0 ? 0 : 3,
      KHFWSJPZIds: BmTimeIds || [],
    });
    if (res.status === 'ok') {
      setIsModalVisible(true);
    } else {
      message.error('操作失败，请联系管理员');
    }
  };

  const handleClose = (removedTag: any) => {
    const newArr: any = [];
    const newArrId: any = [];
    WbmDatas.forEach((value: any) => {
      if (value !== removedTag) {
        newArr.push(value);
        newArrId.push(value?.id);
      }
    });
    setBmTimeIds(newArrId);
    setWbmDatas(newArr);
  };
  const forMap = (tag: any) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        <p className={styles.mouths}>{tag?.SDBM}</p>
        <span className={styles.times}>
          {moment(tag?.KSRQ).format('MM.DD')} ~ {moment(tag?.JSRQ).format('MM.DD')}
        </span>
      </Tag>
    );
    return (
      <span key={tag?.id} style={{ display: 'inline-block', marginBottom: '10px' }}>
        {tagElem}
      </span>
    );
  };
  const tagChild = WbmDatas?.map(forMap);

  return (
    <MobileCon>
      <div className={styles.InterestClassroom}>
        <GoBack title={'选课报名'} onclick="/parent/home?index=index" />

        <div className={styles.titles}>
          <div />
          <span>
            {XNXQ?.XN.replace('-', '~')}学年：{XNXQ?.XQ}
          </span>
        </div>
        <div style={{ padding: '0 10px' }}>
          {' '}
          <Divider dashed={true} />
        </div>
        <div className={styles.month}>
          {FWKCData ? (
            <Radio.Group
              defaultValue={MouthId || FWKCData?.KHFWSJPZs?.[0].id}
              onChange={onchangeMonth}
            >
              {FWKCData?.KHFWSJPZs &&
                FWKCData?.KHFWSJPZs?.map((values: any) => {
                  return (
                    <Radio.Button value={values?.id}>
                      <div className={styles.monthNumber}>{values?.KSRQ.substring(5, 7)}</div>
                      <span>月</span>
                    </Radio.Button>
                  );
                })}
            </Radio.Group>
          ) : (
            <></>
          )}
        </div>
        {BmCouse ? <p className={styles.FWMC}>{FWKCData?.FWMC}</p> : <></>}
        {FWKCData?.KCFWBJs?.length === 0 ? (
          <>
            <div className={styles.noData}>
              <img src={noCourses} alt="" />
              {BmCouse ? (
                <>
                  {' '}
                  {FKType === true && PayType === true ? (
                    <>
                      <p style={{ marginBottom: 3 }}>课后服务包含课业辅导和趣味课堂</p>
                      <p> 本课后服务暂未配置课程，您可以先进行缴费</p>
                    </>
                  ) : (
                    <p>您已报名成功，后续请留意首页的选课或付费提醒</p>
                  )}
                </>
              ) : (
                <>
                  {BMDate ? (
                    <>
                      {moment(BMDate).format('YYYY/MM/DD') >=
                      moment(new Date()).format('YYYY/MM/DD') ? (
                        <p>该时段暂未报名，请先报名</p>
                      ) : (
                        <p>该时段报名已结束，不可报名</p>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
            {DropOutType === false ? (
              <>
                {moment(BMDate).format('YYYY/MM/DD') >= moment(new Date()).format('YYYY/MM/DD') ? (
                  <div className={styles.footers}>
                    <button onClick={BmSubmit}>我要报名</button>
                  </div>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                {' '}
                {BaoMinData && FKType === true && PayType === true && DropOutType === true ? (
                  <div className={styles.footers}>
                    <button onClick={submit}>去付款</button>
                  </div>
                ) : (
                  <></>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {' '}
            {FWKCData?.KCFWBJs.find((item: any) => item.LX === 0) && FWKCData?.KXSL !== 0 ? (
              <>
                <div className={styles.Application}>
                  {BmCouse && XKType === true && PayType === false ? (
                    <div className={styles.Tips}>
                      课后服务包含课业辅导和趣味课堂，请为您的孩子选择趣味课堂课程
                    </div>
                  ) : (
                    <></>
                  )}
                  {BaoMinData && XKType === true && FKType === true && PayType === true ? (
                    <div className={styles.Tips}>
                      课后服务包含课业辅导和趣味课堂，请为您的孩子选择趣味课堂课程并缴费
                    </div>
                  ) : (
                    <></>
                  )}
                  {BmCouse && XKType === false && FKType === true && PayType === true ? (
                    <div className={styles.Tips}>您已报名成功并完成选课，请缴费</div>
                  ) : (
                    <></>
                  )}
                  {BmCouse && XKType === true && FKType === false && PayType === true ? (
                    <div className={styles.Tips}>
                      课后服务包含课业辅导和趣味课堂，请为您的孩子选择趣味课堂课程
                    </div>
                  ) : (
                    <></>
                  )}
                  {BmCouse && XKType === false && FKType === true && PayType === false ? (
                    <div className={styles.Tips}>
                      您已报名成功并完成选课，后续请留意首页的付费提醒{' '}
                    </div>
                  ) : (
                    <></>
                  )}

                  {BmCouse ? (
                    <>
                      {BaoMinData &&
                      XKType === false &&
                      FWKCData?.KCFWBJs.find((item: any) => item?.LX === 1) ? (
                        <>
                          <div className={styles.title}>
                            <div />
                            <span>课业辅1导</span>
                            <span>此服务默认配置的辅导课</span>
                          </div>
                          <div>
                            <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                              {BaoMinData &&
                                BaoMinData?.XSFWBJs[0].XSFWKHBJs.map((value: any) => {
                                  if (value?.KHBJSJ?.KCFWBJs?.[0]?.LX === 1) {
                                    return (
                                      <>
                                        <div className={styles.cards}>
                                          <img src={value?.KHBJSJ?.KHKCSJ?.KCTP || noPic} alt="" />
                                          <div className={styles.box}>
                                            <p>
                                              {value?.KHBJSJ?.KHKCSJ.KCMC}-{value?.KHBJSJ?.BJMC}
                                            </p>
                                            <span
                                              onClick={() => {
                                                onDetails(value);
                                              }}
                                            >
                                              查看详情
                                            </span>
                                          </div>

                                          <Checkbox value={value.KHBJSJId} disabled />
                                        </div>
                                      </>
                                    );
                                  }
                                  return <></>;
                                })}
                            </Checkbox.Group>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                      <div className={styles.title}>
                        <div />
                        <span>趣味课堂</span>
                        {BaoMinData && XKType === false ? (
                          <></>
                        ) : (
                          <span>最多可选择{FWKCData?.KXSL}门</span>
                        )}
                      </div>
                      <div>
                        <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                          {BaoMinData && XKType === false ? (
                            <>
                              {BmCouse &&
                                BmCouse?.map((value: any) => {
                                  if (value?.KHBJSJ?.KCFWBJs?.[0]?.LX === 0) {
                                    return (
                                      <>
                                        <div className={styles.cards}>
                                          <img src={value?.KHBJSJ?.KHKCSJ?.KCTP || noPic} alt="" />
                                          <div className={styles.box}>
                                            <p>
                                              {value?.KHBJSJ?.KHKCSJ.KCMC}-{value?.KHBJSJ?.BJMC}
                                            </p>
                                            <span
                                              onClick={() => {
                                                onDetails(value);
                                              }}
                                            >
                                              查看详情
                                            </span>
                                          </div>

                                          <Checkbox value={value.KHBJSJId} disabled />
                                        </div>
                                      </>
                                    );
                                  }
                                  return <></>;
                                })}
                            </>
                          ) : (
                            <>
                              {FWKCData &&
                                FWKCData?.KCFWBJs?.map((value: any) => {
                                  if (value?.LX === 0) {
                                    return (
                                      <>
                                        <div className={styles.cards}>
                                          <img src={value?.KHBJSJ?.KHKCSJ?.KCTP || noPic} alt="" />
                                          <div className={styles.box}>
                                            <p>
                                              {value?.KHBJSJ?.KHKCSJ.KCMC}-{value?.KHBJSJ?.BJMC}
                                            </p>
                                            <span
                                              onClick={() => {
                                                onDetails(value);
                                              }}
                                            >
                                              查看详情
                                            </span>
                                          </div>

                                          <Checkbox
                                            value={`${value.KHBJSJId}+${value?.KHBJSJ?.KHKCSJ?.KCMC}+${value?.KHBJSJ?.BJMC}`}
                                          />
                                        </div>
                                      </>
                                    );
                                  }
                                  return <></>;
                                })}
                            </>
                          )}
                        </Checkbox.Group>
                      </div>
                    </>
                  ) : (
                    <div className={styles.noData}>
                      <img src={noCourses} alt="" />
                      {BMDate ? (
                        <>
                          {moment(BMDate).format('YYYY/MM/DD') >=
                          moment(new Date()).format('YYYY/MM/DD') ? (
                            <p>该时段暂未报名，请先报名</p>
                          ) : (
                            <p>该时段报名已结束，不可报名</p>
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  )}
                </div>
                {DropOutType === false ? (
                  <>
                    {moment(BMDate).format('YYYY/MM/DD') >=
                    moment(new Date()).format('YYYY/MM/DD') ? (
                      <div className={styles.footers}>
                        <button onClick={BmSubmit}>我要报名</button>
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <>
                    {BaoMinData && XKType === true && FKType === true && PayType === true ? (
                      <div className={styles.footers}>
                        <button
                          onClick={() => {
                            onSelect('XKFK');
                          }}
                          disabled={YXKC.length === 0}
                        >
                          确认选课并付款
                        </button>
                        {/* <button onClick={submit} >确认付款</button> */}
                      </div>
                    ) : (
                      <></>
                    )}
                    {BaoMinData && XKType === true && FKType === true && PayType === false ? (
                      <div className={styles.footers}>
                        <button
                          onClick={() => {
                            onSelect('XK');
                          }}
                          disabled={YXKC.length === 0}
                        >
                          确认选课
                        </button>
                      </div>
                    ) : (
                      <></>
                    )}
                    {BaoMinData && XKType === true && FKType === false ? (
                      <div className={styles.footers}>
                        <button
                          onClick={() => {
                            onSelect('XK');
                          }}
                          disabled={YXKC.length === 0}
                        >
                          确认选课
                        </button>
                      </div>
                    ) : (
                      <></>
                    )}
                    {BaoMinData && XKType === false && FKType === true && PayType === true ? (
                      <div className={styles.footers}>
                        <button onClick={submit}>去付款</button>
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                {BmCouse ? (
                  <div className={styles.Application}>
                    {BmCouse && XKType === true && FKType === true && PayType === true ? (
                      <div className={styles.Tips}>
                        课后服务包含课业辅导和趣味课堂，本课后服务暂未配置趣味课堂课程，您可以先进行缴费
                      </div>
                    ) : (
                      <></>
                    )}
                    {BmCouse && XKType === true && FKType === true && PayType === false ? (
                      <div className={styles.Tips}>
                        您已报名成功，后续请留意首页的选课或付费提醒
                      </div>
                    ) : (
                      <></>
                    )}
                    {BmCouse && XKType === true && FKType === false ? (
                      <div className={styles.Tips}>
                        您已报名成功并完成缴费，后续请留意首页的选课提醒
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className={styles.title}>
                      <div />
                      <span>课业辅导</span>
                      <span>此服务默认配置的辅导课</span>
                    </div>
                    <div>
                      <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                        {FWKCData &&
                          FWKCData?.KCFWBJs?.map((value: any) => {
                            if (value?.LX === 1) {
                              return (
                                <>
                                  <div className={styles.cards}>
                                    <img src={value?.KHBJSJ?.KHKCSJ?.KCTP || noPic} alt="" />
                                    <div className={styles.box}>
                                      <p>
                                        {value?.KHBJSJ?.KHKCSJ.KCMC}-{value?.KHBJSJ?.BJMC}
                                      </p>
                                      <span
                                        onClick={() => {
                                          onDetails(value);
                                        }}
                                      >
                                        查看详情
                                      </span>
                                    </div>

                                    <Checkbox
                                      value={`${value.KHBJSJId}+${value?.KHBJSJ?.KHKCSJ?.KCMC}+${value?.KHBJSJ?.BJMC}`}
                                      disabled
                                    />
                                  </div>
                                </>
                              );
                            }
                            return <></>;
                          })}
                      </Checkbox.Group>
                    </div>
                  </div>
                ) : (
                  <div className={styles.noData}>
                    <img src={noCourses} alt="" />
                    {BMDate ? (
                      <>
                        {moment(BMDate).format('YYYY/MM/DD') >=
                        moment(new Date()).format('YYYY/MM/DD') ? (
                          <p>该时段暂未报名，请先报名</p>
                        ) : (
                          <p>该时段报名已结束，不可报名</p>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                )}
                {moment(BMDate).format('YYYY/MM/DD') >= moment(new Date()).format('YYYY/MM/DD') ? (
                  <>
                    {DropOutType === false ? (
                      <div className={styles.footers}>
                        <button onClick={BmSubmit}>我要报名</button>
                      </div>
                    ) : (
                      <>
                        {' '}
                        {BaoMinData &&
                        FKType === true &&
                        PayType === true &&
                        DropOutType === true ? (
                          <div className={styles.footers}>
                            <button onClick={submit}>去付款</button>
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </>
        )}

        <Modal
          title="确认报名"
          visible={BmModalVisible}
          onOk={BmHandleOk}
          onCancel={() => {
            setBmModalVisible(false);
          }}
          closable={false}
          className={styles.signUpModal}
          okText="确认"
          cancelText="取消"
        >
          <div>
            <p>系统将为您报名所有未报名时段，您也可以指定部分时段进行报名。</p>
            <div style={{ marginBottom: 16 }} className={styles?.TimeInterval}>
              {tagChild}
            </div>
          </div>
        </Modal>

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
                return (
                  <span>
                    【{value.split('+')[1]}】{value.split('+')[2]},
                  </span>
                );
              })}{' '}
              是否确认？
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
                JSRQ,
                KSRQ,
              },
              type: '服务班',
            },
          }}
        />
      </div>
      <Modal className={styles.SignIn} visible={IsModalVisible} footer={null} closable={false}>
        <img src={GroupS} alt="" />
        <h3>报名成功</h3>
        <Button
          type="primary"
          onClick={() => {
            setBmModalVisible(false);
            setIsModalVisible(false);
            xuankeStates();
            // window.location.reload()
          }}
        >
          我知道了
        </Button>
      </Modal>
    </MobileCon>
  );
};
export default InterestClassroom;
