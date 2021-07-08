/* eslint-disable no-nested-ternary */
import { Badge, message, } from 'antd';
import React, { useEffect, useState,} from 'react';
import { useModel } from 'umi';
import styles from './index.less';
import { getKHKCSJ } from '@/services/after-class/khkcsj';
import { getQueryString } from '@/utils/utils';
import { getAllKHXSCQ } from '@/services/after-class/khxscq';
import { DateRange, Week } from '@/utils/Timefunction';
import moment from 'moment';
import { getKHPKSJByBJID } from '@/services/after-class/khpksj';
import { getEnrolled, getKHBJSJ } from '@/services/after-class/khbjsj';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import WWOpenDataCom from '@/pages/Manager/ClassManagement/components/WWOpenDataCom';
import noData from '@/assets/noCourse1.png';
import Nodata from '@/components/Nodata';

const CourseDetails: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>();
  const [KcDetail, setKcDetail] = useState<any>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [timetableList, setTimetableList] = useState<any[]>();
  const classid = getQueryString('classid');
  const courseid = getQueryString('courseid');
  const [userID, setUserID] = useState<any>([]);
  const [weekd, setWeekd] = useState<any[]>();
  const [gl, setGl] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      if(await initWXConfig(['checkJsApi'])){
        await initWXAgentConfig(['checkJsApi']);
      }
    })();
  }, []);

  const Learning = async (bjid: any, attend: any[]) => {
    const res1 = await getAllKHXSCQ(
      {
        xsId: currentUser!.id,
        bjId: bjid!,
        CQZT: '',
        CQRQ: '',
      }
    );
    if (res1.status === 'ok' && res1.data) {
      const classbegins: any[] = [];
      res1.data.forEach((item: any) => {
        const datex = DateRange(item.KHBJSJ.KKRQ, item.KHBJSJ.JKRQ)
        datex.forEach((record: any) => {
          for (let i = 0; i < attend.length; i += 1) {
            if (Week(record) === attend[i] && !classbegins.includes(record)) {
              classbegins.push(record);
            }
          }
        })
      })
      const Attendancedate: any[] = [];
      for (let i = 0; i < classbegins.length; i += 1) {
        Attendancedate.push(moment(classbegins[i]).format('MM/DD'))
      }
      const absence: any[] = [];
      const myDate = new Date();
      const nowtime = moment(myDate.toLocaleDateString()).format('MM/DD')
      Attendancedate.forEach((record: any, index: number) => {
        if (res1.data) {
          for (let i = 0; i < res1.data.length; i += 1) {
            const chuqindate = moment(res1.data[i].CQRQ).format('MM/DD');
            if (res1.data[i].CQZT === '出勤' && chuqindate === record) {
              absence.push({
                id: `kc${index}`,
                JC: `第${index + 1}节`,
                data: record,
                type: '出勤'
              })
            } else if ((res1.data[i].CQZT === '请假' || res1.data[i].CQZT === '缺席') && chuqindate === record) {
              absence.push({
                id: `kc${index}`,
                JC: `第${index + 1}节`,
                data: record,
                type: `缺勤`
              })
            } else if (nowtime === record) {
              absence.push({
                id: `kc${index}`,
                JC: `第${index + 1}节`,
                data: record,
                type: `今日`
              })
            }
            else {
              absence.push({
                id: `kc${index}`,
                JC: `第${index + 1}节`,
                data: record,
                type: ``
              })
            }
          }
        }
      })
      // 获取课程表数据
      const Section = [];
      const intercept = {};
      for (let i = 0; i < absence.length; i += 1) {
        if (!intercept[absence[i].id]) {
          Section.push(absence[i]);
          intercept[absence[i].id] = true;
        }
        if (Section[(Section.length - 1)].id === absence[i].id && Section[Section.length - 1].type === '') {
          Section[(Section.length - 1)] = absence[i]
        }
      }
      return Section;
    }
    return [];
  }
  const ksssj = async (bjid: string) => {
    const res = await getKHPKSJByBJID({ id: bjid });
    if (res.status === 'ok' && res.data) {
      const attend = [...new Set(res.data.map(n => n.WEEKDAY))]
      setWeekd(attend)
      return await Learning(bjid, attend);
    }
    return []
  }
  const usename = async (kcId: string) => {
    const res = await getEnrolled({ id: kcId });
    if (res.status === 'ok' && res.data) {
      const XSid: any[] = []
      res.data.forEach((item: any) => {
        // return <WWOpenDataCom type="userName" openid={item.XSId} />;
        XSid.push(item.XSId)
      })
      setUserID(XSid);
    }

  }

  useEffect(() => {
    if (gl && classid && weekd) {
      const bjpk = async () => {
        const res = await getKHBJSJ({ id: classid })
        if (res.status === 'ok' && res.data) {
          const classbegins: any[] = [];
          const absence: any[] = [];
          const datex = DateRange(res.data.KKRQ!, res.data.JKRQ!);
          const myDate = new Date();
          const nowtime = moment(myDate.toLocaleDateString()).format('MM/DD')
          datex.forEach((record: any) => {
            for (let i = 0; i < weekd.length; i += 1) {
              if (Week(record) === weekd[i] && !classbegins.includes(record)) {
                classbegins.push(record);
              }
            }
          });
          classbegins.forEach((record: any, index: number) => {
            if (record > nowtime) {
              absence.push({
                id: `kc${index}`,
                JC: `第${index + 1}节`,
                data: moment(record).format('MM/DD'),
                type: '出勤'
              })
            } else {
              absence.push({
                id: `kc${index}`,
                JC: `第${index + 1}节`,
                data: moment(record).format('MM/DD'),
                type: ``
              })
            }
          })
          setTimetableList(absence);
        }
      }
      bjpk()
    }
  }, [Learning, weekd])

  useEffect(() => {
    async function fetchData() {
      if (classid) {
        const schedule = await ksssj(classid);
        if (schedule.length === 0) {
          setGl(true)
        }
        setGl(false)
        setTimetableList(schedule);
        usename(classid);
      }
    };
    fetchData();
  }, [classid])

  useEffect(() => {
    if (courseid) {
      (async () => {
        const result = await getKHKCSJ({
          kcId: courseid,
          bjzt: '已发布'
        });
        if (result.status === 'ok') {
          setKcDetail(result.data);
        } else {
          message.error(result.message);
        }
      })();
      const myDate = new Date().toLocaleDateString().slice(5, 9);
      setCurrentDate(myDate);
    }
  }, [courseid]);

  const tempfun = (arr: any) => {
    const fjname: string[] = [];
    arr.forEach((item: any) => {
      if (!fjname.includes(item.FJSJ.FJMC)) {
        fjname.push(item.FJSJ.FJMC)
      }
    });
    return fjname.map((values: any) => {
      return <span>{values}</span>
    })
  }
  return <div className={styles.CourseDetails2}>
    <div className={styles.KCXX}>
      {/* 上课时段 */}
      <p className={styles.title}>{KcDetail?.KCMC}</p>
      <ul>
        {
          KcDetail?.KHBJSJs?.map((value: { id: string, KSS: string, KHPKSJs: any, KKRQ: string, JKRQ: string, BJMC: string }) => {
            if (value.id === classid) {
              return <> <li>上课时段：{value.KKRQ}~{value.JKRQ}</li>
                <li> 上课地点：{
                  tempfun(value.KHPKSJs)
                }</li>
                <li>总课时：{value.KSS}</li>
                <li>班级：{value.BJMC}</li>
              </>
            }
            return ''
          })
        }
      </ul>
    </div>
    <div className={styles.Timetable}>
      <p className={styles.title}><span>课程表</span>
        <span>
          <Badge className={styles.legend} color="#45C977" text="今日" />
          <Badge className={styles.legend} color="#fd8b8b" text="缺勤" />
          <Badge className={styles.legend} color="##FF7171" text="出勤" />
          <Badge className={styles.legend} color="#d2ecdc" text="待上" />
        </span>  </p>
      <div className={styles.cards}>
        {
          !(timetableList?.length === 0) ? timetableList?.map((value) => {
            return <div className={value.data === currentDate ? styles.card2 : (value.type === '缺勤' ? styles.card1 : (value.type === '出勤' ? styles.card3 : (value.type === '今日' ? styles.card4 : styles.card)))} >
              <p>{value.JC}</p>
              <p>{value.data}</p>
            </div>
          }) : <Nodata imgSrc={noData} desc='暂无课表' />
        }
      </div>


    </div>
  </div>

};

export default CourseDetails;
