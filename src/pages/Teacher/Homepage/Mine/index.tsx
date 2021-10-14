import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useModel } from 'umi';
import { Col, Image, Row } from 'antd';
import moment from 'moment';
import CheckOnChart from './components/CheckOnChart';
import IconFont from '@/components/CustomIcon';
import myContext from '@/utils/MyContext';
import { DateRange, Week } from '@/utils/Timefunction';
import { initWXAgentConfig, initWXConfig, showUserName } from '@/utils/wx';
import imgPop from '@/assets/teacherBg.png';
import Nodata from '@/components/Nodata';
import noChart from '@/assets/noChart1.png';
// import icon_attRecord from '@/assets/icon_attRecord.png';
// import icon_tchLeave from '@/assets/icon_tchLeave.png';
// import icon_Rgo from '@/assets/icon_Rgo.png';
import styles from './index.less';
import { defUserImg } from '@/constant';

const Mine = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { yxkc, weekSchedule } = useContext(myContext);

  const [checkIn, setCheckIn] = useState<any[]>();
  const [wekDay, setWekDay] = useState<any>();
  // 当前时间
  const nowdate = moment(new Date().toLocaleDateString()).format('YYYY-MM-DD');
  const userRef = useRef(null);
  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      if (await initWXAgentConfig(['checkJsApi'])) {
        showUserName(userRef?.current, currentUser?.UserId);
        // 注意: 只有 agentConfig 成功回调后，WWOpenData 才会注入到 window 对象上面
        WWOpenData?.bindAll(document.querySelectorAll('ww-open-data'));
      }
    })();
  }, [currentUser]);

  const getChechIn = (data?: any[]) => {
    const courseData: any = [];
    const newskrq = {};
    // 教授的课程有几门，每门下有几个班
    data?.forEach((item: any) => {
      const newkec = {
        KCMC: (
          <div>
            <div>{item.KHKCSJ.KCMC}</div>
            <div style={{ color: '#aaa', fontSize: '.9em' }}>{item.BJMC}</div>
          </div>
        ),
        class: [item],
      };
      // if (courseData[index - 1] && courseData[index - 1].KCMC === item.KHKCSJ.KCMC) {
      //   courseData[index - 1].class.push(item);
      // } else {
      courseData.push(newkec);
      // }
    });
    // 周几上课
    weekSchedule?.forEach((item: any) => {
      if (Object.keys(newskrq).indexOf(`${item.KHBJSJ.id}`) === -1) {
        newskrq[item.KHBJSJ.id] = [];
      }
      newskrq[item.KHBJSJ.id].push(item.WEEKDAY);
    });
    return {
      courseData,
      newskrq,
    };
  };

  const getKcData = (item: any) => {
    const kcData: { label: string; type?: string | undefined; value: number; color: string }[] = [];
    for (let i = 0; i < item.class.length; i += 1) {
      const record = item.class[i];
      // 获取上课区间
      const datelist = DateRange(record.KKRQ, record.JKRQ);
      // 上课日期数组
      const Classdate: any = [];

      datelist?.forEach((list: any) => {
        // 获取周几上课，在上课区间拿出上课日期
        wekDay[record.id]?.forEach((ite: any) => {
          if (Week(list) === ite) {
            Classdate.push(list);
          }
        });
      });
      // 已上课程
      const oldclass = [];
      // 未上课程
      const newclass = [];
      Classdate.forEach((it: any) => {
        if (new Date(nowdate) > new Date(it)) {
          oldclass.push(it);
        } else {
          newclass.push(it);
        }
      });
      // 出勤数据
      kcData.push(
        {
          label: record.BJMC,
          type: '正常',
          value: oldclass.length,
          color: 'l(180) 0:rgba(49, 217, 159, 1) 1:rgba(49, 217, 159, 0.2)',
        },
        {
          label: record.BJMC,
          type: '异常',
          value: 0,
          color: 'l(180) 0:rgba(255, 113, 113, 0.2) 1:rgba(255, 113, 113, 1)',
        },
        {
          label: record.BJMC,
          type: '待上',
          value: newclass.length,
          color: 'l(180) 0:rgba(0, 102, 255, 1) 1:rgba(0, 102, 255, 0.2)',
        },
      );
    }
    return kcData;
  };
  useEffect(() => {
    if (yxkc && yxkc.length) {
      const { courseData, newskrq } = getChechIn(yxkc);
      setCheckIn(courseData);
      setWekDay(newskrq);
    }
  }, [yxkc]);

  return (
    <div className={styles.minePage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }} />
        <div className={styles.header}>
          <Image width={46} height={46} src={currentUser?.avatar} fallback={defUserImg} />
          <div className={styles.headerName}>
            <h4>
              <span ref={userRef}>{currentUser?.UserId}</span>
              老师
            </h4>
          </div>
        </div>
      </header>

      <div className={styles.funWrapper}>
        {/* <div className={styles.operation}>
          <Link to="" className={styles.tchLeave}>
            <img src={icon_tchLeave} alt="" />
            <span className={styles.tchLeaveSpan}>我要请假</span>
            <img src={icon_Rgo} alt="" className={styles.icon_Rgo} />
          </Link>
          <Link to="" className={styles.attRecord}>
            <img src={icon_attRecord} alt="" />
            <span className={styles.attRecordSpan}>出勤纪律</span>
            <img src={icon_Rgo} alt="" className={styles.icon_Rgo} />
          </Link>
        </div> */}
        <div className={styles.titleBar}>
          出勤统计
          <div>
            <span />
            正常
            <span />
            异常
            <span />
            待上
          </div>
        </div>
        {checkIn && checkIn.length ? (
          <Row gutter={8}>
            {checkIn.map((item: any) => {
              const kcData = getKcData(item);
              return (
                <Col span={12}>
                  <CheckOnChart data={kcData} title={item.KCMC} key={item.KCMC} />
                </Col>
              );
            })}
          </Row>
        ) : (
          <Nodata imgSrc={noChart} desc="暂无数据" />
        )}
      </div>

      <div className={styles.linkWrapper}>
        <ul>
          <li>
            <IconFont type="icon-fuwugonggao" style={{ fontSize: '18px' }} />
            <Link to="/teacher/home/notice/announcement?articlepage=serveAnnounce">
              服务公告
              <IconFont type="icon-gengduo" />
            </Link>
          </li>
          <li>
            <IconFont type="icon-guanyu" style={{ fontSize: '18px' }} />
            <Link to="/teacher/home/notice/announcement?articlepage=about">
              关于
              <IconFont type="icon-gengduo" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Mine;
