import { useEffect, useState } from 'react';
import styles from './index.less';
import ListComp from '../ListComponent';
import type { ListData } from '../ListComponent/data';
import noData from '@/assets/today.png';
import noData1 from '@/assets/today1.png';
import moment from 'moment';
import { TodayCourse } from '@/services/local-services/mobileHome';
import { ClassStatus } from '@/utils/Timefunction';
import TimeRight from './TimeRight';

const EnrollClassTime = (props: { type: string; xxId?: string; userId?: string; njId?: string; }) => {
  const { type, xxId, userId, njId, } = props;
  const [resource, setResource] = useState<any>(); // 当日课程状态
  const [datasourse, setDatasourse] = useState<ListData>(); // 今日课程中的数据
  /**
   * 针对今日课程安排，筛选出今日节次的课程，并进行数据梳理
   */
  const getTodayData = (data: any) => {
    const day = new Date(); // 获取现在的时间  eg:day Thu Jun 24 2021 18:54:38 GMT+0800 (中国标准时间)
    const curCourse: any[] = []; // list中的数据
    data?.forEach((item: { courseInfo: any[]; }) => {
      const list = item.courseInfo.filter((val) => val.wkd === day.getDay());
      if (list?.length) {
        list.forEach(ele => {
          curCourse.push({
            title: ele.title,
            titleRight: {
              text: ClassStatus(ele.start, ele.end),
            },
            link: `${(type === 'teacher' ? '/teacher/home/courseDetails' : '/parent/home/courseTable')}` + `?classid=${ele.bjId}`,
            desc: [
              {
                left: [
                  `${ele.start}-${ele.end}`,
                  `${ele.address}`,
                ],
                right: ClassStatus(ele.start, ele.end) === '待上课' ?
                  <TimeRight startTimeHour={ele.start.substring(0, 2)} startTimeMin={ele.end.substring(3, 5)} /> : ''
                ,
              },
            ],
          });
        });
      }
    })
    return { curCourse };
  };
  useEffect(() => {
    (async () => {
      // 获取处理后的今日课程数据
      const { total, courseList } = await TodayCourse(type, xxId, userId, njId);
      const { curCourse } = getTodayData(courseList);
      setResource(total);
      const todayList: ListData = {
        type: 'descList',
        cls: 'descList',
        header: {
          title: '今日课程',
        },
        list: curCourse,
        noDataText: '今日没有课呦',
        noDataIcon: true,
        noDataImg: type === 'teacher' ? noData1 : noData,
      };
      setDatasourse(todayList);
    })()
  }, []);

  switch (resource?.courseStatus) {
    case 'unstart':
      return (
        <>
          <div className={styles.enrollText}>课后服务课程尚未开始！</div>
          <div className={styles.enrollDate}>
            课后服务课程将于{`${moment(resource?.bmkssj).format('YYYY.MM.DD')}`}开始报名！
          </div>
        </>
      );
      break;
    case 'enroll':
      return (
        <div>
          {type !== 'teacher' ? (
            <>
              <div className={styles.enrollText}>课后服务课程报名开始了！</div>
              <div className={styles.enrollDate}>
                报名时间：
                {`${moment(resource?.bmkssj).format('YYYY.MM.DD')}—${moment(resource?.bmjssj).format('YYYY.MM.DD')}`}
              </div>
            </>
          ) : (
            <div className={styles.enrollText}>
              课后服务课程将于{`${moment(resource?.skkssj).format('YYYY.MM.DD')}`}正式开课！
            </div>
          )}
        </div>
      );
      break;
    case 'education':
    case 'noTips':
      return (
        <div>
          {type !== 'teacher' ? (
            <div>
              {' '}
              <ListComp listData={datasourse} cls={styles.todayImg} />{' '}
            </div>
          ) : (
            <></>
          )}
          <>
            <div className={styles.enrollText}>
              课后服务课程{type === 'teacher' ? '已正式开课！' : '开课了！'}
            </div>
            {type !== 'teacher' ? '' : <ListComp listData={datasourse} cls={styles.todayImg} />}
          </>
        </div>
      );
      break;
    case 'enrolling':
      return (
        <div>
          {type !== 'teacher' ? (
            <>
              <div>
                <ListComp listData={datasourse} cls={styles.todayImg} />
              </div>
              <div className={styles.enrollText}>课后服务课程报名开始了！</div>
              <div className={styles.enrollDate}>
                报名时间：
                {`${moment(resource?.bmkssj).format('YYYY.MM.DD')}—${moment(resource?.bmjssj).format('YYYY.MM.DD')}`}
              </div>
            </>
          ) : (
            <>
              <div className={styles.enrollText}>课后服务课程已正式开课！</div>
              <div>
                <ListComp listData={datasourse} cls={styles.todayImg} />
              </div>
            </>
          )}
        </div>
      );
      break;
    case 'enrolled':
      return (
        <div>
          {type !== 'teacher' ? (
            <>
              <div className={styles.enrollText}>课后服务课程报名已结束！</div>
              <div className={styles.enrollDate}>
                开课时间：
                {`${moment(resource?.skkssj).format('YYYY.MM.DD')}—${moment(resource?.skjssj).format('YYYY.MM.DD')}`}{' '}
              </div>
            </>
          ) : (
            <div className={styles.enrollText}>
              课后服务课程将于{`${moment(resource?.skkssj).format('YYYY.MM.DD')}`}正式开课！
            </div>
          )}
        </div>
      );
      break;
    case 'end':
      return (
        <>
          <div className={styles.enrollText}>本学期课后服务课程已结束！</div>
          <div className={styles.enrollDate}>
            本学期课后服务课程已于{`${moment(resource?.skjssj).format('YYYY.MM.DD')}`}结课！
          </div>
        </>
      );
    default:
      return <></>;
      break;
  }
};
export default EnrollClassTime;
