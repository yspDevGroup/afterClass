/* eslint-disable no-nested-ternary */
import { Badge, message, } from 'antd';
import React, { useEffect, useState, } from 'react';
import styles from './index.less';
import { getKHKCSJ } from '@/services/after-class/khkcsj';
import { getData, getQueryString } from '@/utils/utils';
import moment from 'moment';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import noData from '@/assets/noCourse1.png';
import Nodata from '@/components/Nodata';

const CourseDetails: React.FC = () => {
  const [KcDetail, setKcDetail] = useState<any>();
  const [timetableList, setTimetableList] = useState<any[]>();
  const classid = getQueryString('classid');
  const courseid = getQueryString('courseid');
  const myDate: Date = new Date();
  const currentDate = moment(myDate).format('MM/DD');
  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      if (await initWXConfig(['checkJsApi'])) {
        await initWXAgentConfig(['checkJsApi']);
      }
    })();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (classid) {
        const schedule = await getData(classid);
        setTimetableList(schedule.data);
      }
    };
    fetchData();
  }, [classid])


  useEffect(() => {
    if (courseid) {
      (async () => {
        const result = await getKHKCSJ({
          kcId: courseid,
          bjzt: '已发布',
        });
        if (result.status === 'ok' && result.data) {
          setKcDetail(result.data);
        } else {
          message.error(result.message);
        }
      })();
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
              return <> <li>上课时段：{value.KKRQ ? moment(value.KKRQ).format('YYYY.MM.DD') : moment(KcDetail?.KKRQ).format('YYYY.MM.DD')}~{value.JKRQ ? moment(value.JKRQ).format('YYYY.MM.DD') : moment(KcDetail?.JKRQ).format('YYYY.MM.DD')}</li>
                <li> 上课地点：{
                  tempfun(value.KHPKSJs)
                }</li>
                <li>总课时：{value.KSS}课时</li>
                <li>班级：{value.BJMC}</li>
              </>
            }
            return ''
          })
        }
      </ul>
    </div>
    <div className={styles.Timetable}>
      <p className={styles.title}>
        <span>课程表</span>
        <span>
          <Badge className={`${styles.legend} ${styles.legend1}`} color="#FFF" text="出勤" />
          <Badge className={styles.legend} color="#fd8b8b" text="缺勤" />
          <Badge className={styles.legend} color="#45C977" text="今日" />
          <Badge className={styles.legend} color="#d2ecdc" text="待上" />
        </span>
      </p>
      <div className={styles.cards}>
        {
          !(timetableList?.length === 0) ? timetableList?.map((value, index) => {
            return <div className={value.date === currentDate ? styles.card2 : (value.status === '缺席' ? styles.card1 : (value.status === '出勤' ? styles.card3 : styles.card))} >
              <p>第{index + 1}节</p>
              <p>{value.date}</p>
            </div>
          }) : <Nodata imgSrc={noData} desc='暂无课表' />
        }
      </div>
    </div>
  </div>
};

export default CourseDetails;
