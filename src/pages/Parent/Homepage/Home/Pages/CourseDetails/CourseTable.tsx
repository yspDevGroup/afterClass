/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Badge, Modal } from 'antd';
import { getQueryObj } from '@/utils/utils';
import moment from 'moment';
import styles from './index.less';
import noData from '@/assets/noCourse.png';
import Nodata from '@/components/Nodata';
import GoBack from '@/components/GoBack';
import { ParentHomeData } from '@/services/local-services/mobileHome';
import { getAllKHXSCQ } from '@/services/after-class/khxscq';
import {
  getAllKHBJKSSJ,
  getMobileClassDetail,
  getTeachersByBJId,
} from '@/services/after-class/khbjsj';
import ShowName from '@/components/ShowName';
import MobileCon from '@/components/MobileCon';

const CourseTable: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { student } = currentUser || {};
  const [KcDetail, setKcDetail] = useState<any>();
  const [mainTeacher, setMainTeacher] = useState<any>();
  const [teacherList, setTeacherList] = useState<any[]>([]);
  const [timetableList, setTimetableList] = useState<any[]>();
  const { classid, path } = getQueryObj();
  const myDate: Date = new Date();
  const currentDate = moment(myDate).format('YYYY-MM-DD');
  const StorageXSId =
    localStorage.getItem('studentId') || (student && student[0].XSJBSJId) || testStudentId;
  const StorageNjId =
    localStorage.getItem('studentNjId') || (student && student[0].NJSJId) || testStudentNJId;
  const StorageXQSJId =
    localStorage.getItem('studentXQSJId') || currentUser?.student?.[0].XQSJId || testStudentXQSJId;

  useEffect(() => {
    async function fetchData() {
      if (classid) {
        const bjId =
          localStorage.getItem('studentBJId') ||
          currentUser?.student?.[0].BJSJId ||
          testStudentBJId;
        const oriData = await ParentHomeData(
          'student',
          currentUser?.xxId,
          StorageXSId,
          StorageNjId,
          bjId,
          StorageXQSJId,
        );
        const { courseSchedule } = oriData;
        const classInfo = courseSchedule.find((item: { KHBJSJId: string }) => {
          return item.KHBJSJId === classid;
        });
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
        // ?????????????????????????????????
        const res = await getAllKHXSCQ({
          bjId: classid,
          xsId: StorageXSId,
        });
        if (classInfo) {
          setKcDetail(classInfo.detail?.[0]);
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
        if (res.status === 'ok' && res.data) {
          let totalDays = classInfo?.days || [];
          const results = await getAllKHBJKSSJ({
            KHBJSJIds: [classid],
          });
          if (results.status === 'ok' && results.data) {
            const { rows } = results.data;
            if (rows?.length) {
              totalDays = JSON.parse(rows[0].DATA);
            }
          }
          const dataTable = totalDays?.map((ele: any) => {
            const { day, status, ...rest } = ele;
            let stuStatus: string = '';
            let style: any = {};
            if (new Date(day).getTime() > new Date(currentDate).getTime()) {
              stuStatus = '??????';
              style = {
                background: 'rgba(137, 218, 140, 0.4)',
                color: '#333',
              };
            }
            if (new Date(day).getTime() === new Date(currentDate).getTime()) {
              stuStatus = '??????';
              style = {
                background: '#2196F3',
                color: '#FFF',
              };
            }
            if (new Date(day).getTime() < new Date(currentDate).getTime()) {
              stuStatus = '??????';
              style = {
                background: '#FFF',
                color: '#999',
                border: '1px solid #DDD',
              };
            }
            if (res.data?.length) {
              const curCQ = res.data.find((item: any) => item.CQRQ === day);
              if (curCQ) {
                switch (curCQ?.CQZT) {
                  case '??????':
                    style = {
                      background: 'rgba(242, 200, 98, 0.4)',
                      color: '#666',
                    };
                    break;
                  case '??????':
                    style = {
                      background: 'rgba(244, 138, 130, 0.4)',
                      color: '#666',
                    };
                    break;
                  default:
                    break;
                }
                stuStatus = curCQ?.CQZT || '??????';
              }
            }
            if (status === '?????????') {
              style = {
                background: 'rgba(122, 137, 144, 0.2)',
                color: '#666',
              };
            }
            if (status === '??????' || status === '?????????') {
              style = {
                background: 'rgba(172, 144, 251, 0.2)',
                color: '#666',
              };
            }
            return {
              day: moment(day).format('MM/DD'),
              status: status || stuStatus,
              style,
              ...rest,
            };
          });
          setTimetableList(dataTable);
        }
      }
    }
    fetchData();
  }, [classid]);

  const handleModal = (val: any) => {
    let content = {};
    if (val.tag) {
      if (val.tag === '???') {
        content = {
          title: '????????????',
          content: ` ??????????????????????????????????????????????????????`,
        };
      } else {
        content = {
          title: '????????????',
          content: `????????????????????????${val.realDate}??? ${val.start?.substring(
            0,
            5,
          )}-${val.end?.substring(0, 5)} ,????????????`,
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
        {path ? (
          <GoBack title={'????????????'} onclick={`/parent/home?index=${path}`} />
        ) : (
          <GoBack title={'????????????'} />
        )}
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
              {KcDetail?.BJZT !== '?????????' ? (
                <li>
                  <span>???????????????</span>
                  {KcDetail?.xq} | {KcDetail?.address}
                </li>
              ) : (
                <></>
              )}

              {KcDetail?.KSS === 0 || KcDetail?.KSS === null ? (
                ''
              ) : (
                <li>
                  <span>{KcDetail?.ISFW === 1 ? '????????????' : '????????????'}</span>
                  {KcDetail?.KSS}??????
                </li>
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
                      type="userName"
                      openid={mainTeacher?.JZGJBSJ?.WechatUserId}
                      XM={mainTeacher?.JZGJBSJ?.XM}
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
                          type="userName"
                          openid={ele?.JZGJBSJ?.WechatUserId}
                          XM={ele?.JZGJBSJ?.XM}
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
              <Badge className={styles.legend} color="#AC90FB" text="????????????" />
              <Badge className={styles.legend} color="#7A8990" text="????????????" />
              <br />
              <Badge className={`${styles.legend} ${styles.legend1}`} color="#FFF" text="??????" />
              <Badge className={styles.legend} color="#F48A82" text="??????" />
              <Badge className={styles.legend} color="#F2C862" text="??????" />
              <Badge className={styles.legend} color="#2196F3" text="??????" />
              <Badge className={styles.legend} color="#89DA8C" text="??????" />
            </span>
          </p>
          <div className={styles.cards}>
            {!(timetableList?.length === 0) ? (
              timetableList?.map((value) => {
                return (
                  <div
                    key={value.index}
                    className={styles.card}
                    style={value?.style}
                    onClick={() => handleModal(value)}
                  >
                    <p>
                      {value.tag && value.tag === '???'
                        ? `???${value.tag}???`
                        : `???${value.index + 1}???`}
                    </p>
                    <p>{value.day}</p>
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

export default CourseTable;
