/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Badge, Modal } from 'antd';
import { getQueryObj } from '@/utils/utils';
import moment from 'moment';
import Nodata from '@/components/Nodata';
import GoBack from '@/components/GoBack';
import ShowName from '@/components/ShowName';
import { getAllKHJSCQ } from '@/services/after-class/khjscq';
import { convertTimeTable, ParentHomeData } from '@/services/local-services/mobileHome';
import { getMobileClassDetail, getTeachersByBJId } from '@/services/after-class/khbjsj';
import noData from '@/assets/noCourse.png';

import styles from './index.less';
import { getKCBSKSJ } from '@/services/after-class/kcbsksj';
import { getAll } from '@/services/after-class/khbjjsrl';
import MobileCon from '@/components/MobileCon';

const CourseDetails = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [KcDetail, setKcDetail] = useState<any>();
  const [timetableList, setTimetableList] = useState<any[]>();
  const [mainTeacher, setMainTeacher] = useState<any>();
  const [teacherList, setTeacherList] = useState<any[]>([]);
  const [FJMC, setFJMC] = useState();
  const claim = getQueryObj().status;
  const { classid, path, date, cdname } = getQueryObj('classid');
  const userId = currentUser?.JSId || testTeacherId;

  useEffect(() => {
    async function fetchData() {
      if (classid) {
        const oriData = await ParentHomeData(
          'teacher',
          currentUser?.xxId,
          currentUser?.JSId || testTeacherId,
        );
        const { courseSchedule } = oriData;
        const classInfo = courseSchedule.find((item: { KHBJSJId: string }) => {
          return item.KHBJSJId === classid;
        });
        if (classInfo) {
          setKcDetail(classInfo.detail[0]);
        } else {
          const resBJ = await getMobileClassDetail({
            id: classid,
          });
          if (resBJ.status === 'ok') {
            const { data } = resBJ;
            setKcDetail({
              title: data.KHKCSJ.KCMC,
              xq: '??????',
              address: data.KHPKSJs?.[0]?.FJSJ?.FJMC,
              ...data,
            });
          }
        }
        const result = await getTeachersByBJId({ KHBJSJId: classid });
        if (result.status === 'ok') {
          const list = result.data?.rows;
          if (list?.length) {
            const main = list?.find((item: { JSLX: string }) => item.JSLX === '?????????');
            setMainTeacher(main);
            const otherTeacher = list?.filter((item: { JSLX: string }) => item.JSLX === '?????????');
            setTeacherList(otherTeacher);
          }
        }

        if (claim && (claim === '?????????' || claim === '?????????') && classid) {
          let resSKSJ: { status: string; data: { rows: any } };
          if (claim === '?????????') {
            resSKSJ = await getKCBSKSJ({
              KHBJSJId: [classid],
            });
          } else {
            resSKSJ = await getKCBSKSJ({
              KHBJSJId: [classid],
              JZGJBSJId: userId,
            });
          }
          console.log(resSKSJ, 'resSKSJ---');
          if (resSKSJ.status === 'ok' && resSKSJ.data) {
            setFJMC(resSKSJ?.data?.rows?.[0]?.FJSJ?.FJMC);
            const { rows } = resSKSJ.data;
            console.log(rows, 'rows----');
            let days: any[] = [];
            if (rows?.length) {
              days = [].map.call(rows, (v: { XXSJPZId: string; SKRQ: string }, index) => {
                return {
                  index: index + 1,
                  jcId: v.XXSJPZId,
                  day: v.SKRQ,
                };
              });
            }
            // ?????????????????????????????????
            const resCQ = await getAllKHJSCQ({
              KHBJSJId: classid,
              JZGJBSJId: userId,
            });
            if (resCQ.status === 'ok' && resCQ.data) {
              let newData: any = [];
              if (claim === '?????????') {
                const ZXres = await getAll({
                  KHBJSJId: classid,
                  JZGJBSJId: userId,
                });
                if (ZXres?.status === 'ok') {
                  days.forEach((item: any) => {
                    ZXres?.data?.rows?.forEach((item2: any) => {
                      if (item?.day === item2?.RQ && item?.jcId === item2?.XXSJPZId) {
                        newData.push(item);
                      }
                    });
                  });
                }
              } else {
                newData = days;
              }

              const newTime = await convertTimeTable(
                userId,
                classid,
                resCQ.data,
                newData,
                currentUser?.xxId,
              );
              console.log(newTime, 'newTime----');
              setTimetableList(newTime);
            }
          }
        } else {
          // ?????????????????????????????????
          const res = await getAllKHJSCQ({
            KHBJSJId: classid,
            JZGJBSJId: userId,
          });
          if (res.status === 'ok' && res.data) {
            const xxId = currentUser?.xxId;
            const newTime = await convertTimeTable(
              userId,
              classid,
              res.data,
              classInfo?.days,
              xxId,
            );
            setTimetableList(newTime);
          }
        }
      }
    }

    fetchData();
  }, [classid, claim]);

  const handleModal = (val: any) => {
    let content = {};
    if (val.otherInfo) {
      const { LX, TKJC, TKRQ, DKJS } = val.otherInfo;
      if (LX === 1) {
        content = {
          title: '????????????',
          content: `????????????????????????${DKJS.XM}????????????,?????????.`,
        };
      } else {
        content = {
          title: '????????????',
          content: `????????????????????????${TKRQ}???${TKJC?.KSSJ?.substring(0, 5)}-${TKJC?.JSSJ?.substring(
            0,
            5,
          )}??????,?????????.`,
        };
      }
      Modal.info({
        width: '90vw',
        ...content,
      });
    } else if (val.tag) {
      if (val.tag === '???') {
        content = {
          title: '????????????',
          content: ` ????????????????????????????????????????????????????????????,?????????.`,
        };
      } else {
        content = {
          title: '????????????',
          content: `????????????????????????${val.realDate}???${val.start?.substring(
            0,
            5,
          )}-${val.end?.substring(0, 5)}??????,?????????.`,
        };
      }
      Modal.info({
        width: '90vw',
        ...content,
      });
    }
  };
  return (
    <MobileCon>
      <div className={styles.CourseDetails2}>
        <GoBack
          title={'????????????'}
          onclick={`/teacher/home?index=${path || 'index'}&date=${date}`}
          teacher
        />
        <div className={styles.KCXX}>
          {/* ???????????? */}
          <p className={styles.title}>{KcDetail?.title}</p>
          <ul>
            <ul>
              <li>
                <span>???????????????</span>
                {moment(KcDetail?.KKRQ).format('YYYY.MM.DD')}~
                {moment(KcDetail?.JKRQ).format('YYYY.MM.DD')}
              </li>
              <li>
                <span>???????????????</span>
                {KcDetail?.xq} | {cdname === 'undefined' ? FJMC : cdname}
              </li>
              {KcDetail?.KSS ? (
                <li>
                  {KcDetail?.ISFW === 1 ? <span>????????????</span> : <span>????????????</span>}
                  {KcDetail?.KSS}??????
                </li>
              ) : (
                ''
              )}
              <li>
                <span>???????????????</span>
                {KcDetail?.BJMC}
              </li>
              {mainTeacher ? (
                <li>
                  <span>?????????</span>
                  <span className={styles.teacherName}>
                    <ShowName
                      XM={mainTeacher?.JZGJBSJ?.XM}
                      type="userName"
                      openid={mainTeacher?.JZGJBSJ?.WechatUserId}
                    />
                  </span>
                </li>
              ) : (
                ''
              )}
              {teacherList && teacherList?.length ? (
                <li>
                  <span>?????????</span>
                  {teacherList.map((ele) => {
                    return (
                      <span key={ele.id} className={styles.teacherName}>
                        <ShowName
                          XM={ele?.JZGJBSJ?.XM}
                          type="userName"
                          openid={ele?.JZGJBSJ?.WechatUserId}
                        />
                      </span>
                    );
                  })}
                </li>
              ) : (
                ''
              )}
            </ul>
          </ul>
        </div>
        <div className={styles.Timetable}>
          <p className={styles.title}>
            <span>?????????</span>
            <span style={{ textAlign: 'right' }}>
              <Badge className={`${styles.legend} ${styles.legend1}`} color="#FFF" text="??????" />
              <Badge className={styles.legend} color="#2196F3" text="??????" />
              <Badge className={styles.legend} color="#89DA8C" text="??????" />
              <br />
              <Badge className={styles.legend} color="#F48A82" text="??????" />
              <Badge className={styles.legend} color="#AC90FB" text="??????" />
              <Badge className={styles.legend} color="#7A8990" text="??????" />
              <Badge className={styles.legend} color="#F2C862" text="??????" />
            </span>
          </p>
          <div className={styles.cards}>
            {!(timetableList?.length === 0) ? (
              timetableList?.map((value) => {
                let style: any;
                switch (value.status) {
                  case '??????':
                    style = {
                      background: 'rgba(244, 138, 130, 0.2)',
                      color: '#666',
                    };
                    break;
                  case '??????':
                  case '?????????':
                    style = {
                      background: 'rgba(172, 144, 251, 0.2)',
                      color: '#666',
                    };
                    break;
                  case '??????':
                    style = {
                      background: 'rgba(122, 137, 144, 0.2)',
                      color: '#666',
                    };
                    break;
                  case '??????':
                  case '?????????':
                    style = {
                      background: 'rgba(242, 200, 98, 0.2)',
                      color: '#666',
                    };
                    break;
                  case '??????':
                    style = {
                      background: '#2196F3',
                      color: '#fff',
                    };
                    break;
                  case '??????':
                    style = {
                      background: '#fff',
                      color: '#999',
                    };
                    break;
                  default:
                    break;
                }
                return (
                  <div
                    key={value.index}
                    className={styles.card}
                    style={style}
                    onClick={() => handleModal(value)}
                  >
                    <p>
                      {value.tag && value.tag === '???'
                        ? `???${value.tag}???`
                        : `???${value.index + 1}???`}
                    </p>
                    <p>{moment(value.day).format('MM/DD')}</p>
                  </div>
                );
              })
            ) : (
              <Nodata imgSrc={noData} desc="????????????" />
            )}
          </div>
        </div>
      </div>
    </MobileCon>
  );
};

export default CourseDetails;
