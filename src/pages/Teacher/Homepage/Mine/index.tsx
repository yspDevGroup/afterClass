import React, { useContext, useEffect, useRef } from 'react';
import { Link, useModel } from 'umi';
import styles from './index.less';
import imgPop from '@/assets/teacherBg.png';
import { initWXAgentConfig, initWXConfig, showUserName } from '@/utils/wx';
import CheckOnChart from './components/CheckOnChart';
import IconFont from '@/components/CustomIcon';
import myContext from '@/utils/MyContext';
import { DateRange, Week } from '@/utils/Timefunction';
import moment from 'moment';

const Mine = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { yxkc, weekSchedule } = useContext(myContext);
  const userRef = useRef(null);
  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      if (await initWXAgentConfig(['checkJsApi'])) {
        showUserName(userRef?.current, currentUser?.userId);
        // 注意: 只有 agentConfig 成功回调后，WWOpenData 才会注入到 window 对象上面
        WWOpenData.bindAll(document.querySelectorAll('ww-open-data'));
      }
    })();
  }, [currentUser]);


  // 教授的课程有几门，每门下有几个班
  let newkec = {};
  yxkc?.forEach((item: any) => {
    if (Object.keys(newkec).indexOf('' + item.KHKCSJ.KCMC) === -1) {
      newkec[item.KHKCSJ.KCMC] = []
    }
    newkec[item.KHKCSJ.KCMC].push(item);
  })
  const arry = [];
  for (let i in newkec) {
    let o = {};
    o[i] = newkec[i];
    arry.push(o)
  }
  // 周几上课
  let newskrq = {};
  weekSchedule.forEach((item: any) => {
    if (Object.keys(newskrq).indexOf('' + item.KHBJSJ.id) === -1) {
      newskrq[item.KHBJSJ.id] = []
    }
    newskrq[item.KHBJSJ.id].push(item.WEEKDAY);
  })
  // 当前时间
  const nowdate = moment(new Date().toLocaleDateString()).format('YYYY-MM-DD');

  return (
    <div className={styles.minePage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }}></div>
        <div className={styles.header}>
          <img src={currentUser?.avatar} />
          <div className={styles.headerName}>
            <h4>
              <span ref={userRef}></span>老师
            </h4>
          </div>
        </div>
      </header>
      <div className={styles.funWrapper}>
        <div className={styles.titleBar}>
          出勤统计
          <div>
            <span></span>正常
            <span></span>异常
            <span></span>待上
          </div>
        </div>
        {
          arry.map((item: any) => {
            // 取出数组的键值对
            for (let i in item) {
              const kcData: { label: string; type?: string | undefined; value: number; color: string; }[] = [];
              //  遍历值获取日期数据
              item[i].forEach((record: any) => {
                // 获取上课区间
                const datelist = DateRange(record.KKRQ, record.JKRQ);
                // 上课日期数组
                const Classdate: any = [];
                datelist.forEach((list: any) => {
                  // 获取周几上课，在上课区间拿出上课日期
                  newskrq[record.id].forEach((ite: any) => {
                    if (Week(list) === ite) {
                      Classdate.push(list)
                    }
                  })
                })
                // 已上课程
                const oldclass = [];
                // 未上课程
                const newclass = [];
                Classdate.forEach((item: any) => {
                  if (new Date(nowdate) > new Date(item)) {
                    oldclass.push(item);
                  } else {
                    newclass.push(item);
                  }
                })
                // 出勤数据 
                kcData.push({
                  label: record.BJMC,
                  type: '正常',
                  value: oldclass.length,
                  color: 'l(180) 0:rgba(49, 217, 159, 1) 1:rgba(49, 217, 159, 0.04)',
                },
                  {
                    label: record.BJMC,
                    type: '异常',
                    value: 0,
                    color: 'l(180) 0:rgba(255, 113, 113, 1) 1:rgba(255, 113, 113, 0.04)',
                  },
                  {
                    label: record.BJMC,
                    type: '待上',
                    value: newclass.length,
                    color: 'l(180) 0:rgba(221, 221, 221, 1) 1:rgba(221, 221, 221, 0.04)',
                  })

              });
              return <CheckOnChart data={kcData} title={i} />
            }
            return ''
          })
        }
      </div>
      <div className={styles.linkWrapper}>
        <ul>
          <li>
          <IconFont type='icon-fuwugonggao' style={{ 'fontSize': '18px' }} />
            <Link to='/teacher/home/emptyArticle?articlepage=serveAnnounce'>
              服务公告
              <IconFont type='icon-xiayiye' />
            </Link>
          </li>
          <li>
            <IconFont type="icon-guanyu" style={{ fontSize: '18px' }} />
            <Link to='/teacher/home/emptyArticle?articlepage=about'>
              关于
              <IconFont type="icon-xiayiye" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Mine;
