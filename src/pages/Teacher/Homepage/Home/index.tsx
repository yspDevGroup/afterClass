import React, { useEffect, useContext, useRef } from 'react';
import imgPop from '@/assets/teacherBg.png';
import ListComp from '@/components/ListComponent';
import { annoceData } from '../listData';
import styles from './index.less';
import { initWXAgentConfig, initWXConfig, showUserName } from '@/utils/wx';
import IconFont from '@/components/CustomIcon';
import EnrollClassTime from '@/components/EnrollClassTime';
import myContext from '@/utils/MyContext';

const Home = () => {
  const { courseStatus,currentUserInfo, rjkc } = useContext(myContext);
  const userRef = useRef(null);

  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      await initWXAgentConfig(['checkJsApi']);
      showUserName(userRef?.current, currentUserInfo?.userId);
      // 注意: 只有 agentConfig 成功回调后，WWOpenData 才会注入到 window 对象上面
      WWOpenData.bindAll(document.querySelectorAll('ww-open-data'));
    })();
  }, [currentUserInfo]);

  return (
    <div className={styles.indexPage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }}></div>
        <div className={styles.headerText}>
          <h4>
            <span ref={userRef}></span>
            老师，你好！
          </h4>
          <div>欢迎使用课后帮，课后服务选我就对了！ </div>
        </div>
      </header>
      <div className={styles.pageContent}>
        <div className={styles.noticeArea}>
          <IconFont type="icon-gonggao" className={styles.noticeImg} />
          <div className={styles.noticeText}>
            <span>学校公告</span>
            <span>2021秋季课后服务将于2021.09.02正式开课...</span>
          </div>
          <IconFont type="icon-gengduo" className={styles.gengduo} />
        </div>
        <div className={styles.enrollArea}>
          {courseStatus === 'education' ?
            (<>
              <div className={styles.enrollText}>课后服务已正式开课！</div>
            </>) : (<>
              <div className={styles.enrollText}>课后服务将正式开课！</div>
            </>)}
        </div>

        <div className={styles.todayCourses}>
          <EnrollClassTime teacher={true} />
        </div>
        <div className={styles.teachCourses}>
          {/* <ListComp listData={courseData} /> */}
          {rjkc?.map((item: any) => {
            // eslint-disable-next-line no-param-reassign
            item.yy = {
              type: 'picList',
              cls: 'picList',
              list: [
                {
                  id: item.id,
                  title: item.KHKCSJ.KCMC,
                  img: item.KCTP ? item.KCTP : item.KHKCSJ.KCTP,
                  link: `/parent/home/courseDetails?id=${item.KHKCSJ.id}&type=false`,
                  desc: [
                    {
                      left: [`课程时段：${item.KKRQ ? item.KKRQ : item.KHKCSJ.KKRQ}-${item.JKRQ ? item.JKRQ : item.KHKCSJ.JKRQ}`],
                    },
                    {
                      left: [`共${item.KSS}课时`],
                    },
                  ],
                  introduction: item.KHKCSJ.KCMS,
                },
              ]
            }
            return <ListComp listData={item.yy} />
          })}
        </div>
        <div className={styles.announceArea}>
          <ListComp listData={annoceData} cls={styles.announceList} />
        </div>
      </div>
    </div>
  );
};

export default Home;
