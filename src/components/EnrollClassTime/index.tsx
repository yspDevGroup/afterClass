/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import moment from 'moment';
import dayjs from 'dayjs';
import ShowName from '@/components/ShowName';
import TimeRight from './TimeRight';
import ListComp from '../ListComponent';
import type { ListData } from '../ListComponent/data';
import { ClassStatus } from '@/utils/Timefunction';
import { CurdayCourse } from '@/services/local-services/mobileHome';

import styles from './index.less';
import noData from '@/assets/today.png';
import noData1 from '@/assets/today1.png';

const EnrollClassTime = (props: {
  type: string;
  xxId?: string;
  userId?: string;
  njId?: string;
  bjId?: string;
  XQSJId?: string;
}) => {
  const { type, xxId, userId, njId, bjId, XQSJId } = props;
  const [resource, setResource] = useState<any>(); // 当日课程状态
  const [datasourse, setDatasourse] = useState<ListData>(); // 今日课程中的数据
  const myDate = dayjs().format('YYYY-MM-DD');
  /**
   * 针对今日课程安排进行数据梳理
   */
  const resetList = (data: any) => {
    const curCourse: any[] = []; // list中的数据
    data?.forEach((ele: any) => {
      const { status, otherInfo } = ele;
      let domRight: string | JSX.Element = '';
      if (otherInfo) {
        if (status === '代课') {
          domRight = (
            <ShowName
              XM={otherInfo?.DKJS?.XM}
              type="userName"
              openid={otherInfo?.DKJS?.wechatUserId}
            />
          );
        }
        if (status === '已调课') {
          domRight = ` ${otherInfo.TKRQ} ${otherInfo.KSSJ}`;
        }
        if (status === '已请假') {
          domRight = '';
        }
        if (status === '班主任已请假') {
          domRight = '无需上课';
        }
        if (status === '代上课') {
          domRight = <TimeRight startTime={ele.start} />;
        }
      } else if (status === '班主任已请假') {
        domRight = '无需上课';
      } else if (ClassStatus(ele.start, ele.end) === '待上课') {
        domRight = <TimeRight startTime={ele.start} />;
      }
      curCourse.push({
        title: `${ele.title} 【${ele.BJMC}】`,
        titleRight: {
          text: status || ClassStatus(ele.start, ele.end),
        },
        link:
          status !== '代上课'
            ? `${
                type === 'teacher' ? '/teacher/home/courseDetails' : '/parent/home/courseTable'
              }?classid=${ele.bjId}&status=${status}`
            : null,
        desc: [
          {
            left: [`${ele.start}-${ele.end}`, `${ele.address ? ele.address : ''}`],
            right: domRight,
          },
        ],
      });
    });
    return { curCourse };
  };

  useEffect(() => {
    (async () => {
      // 获取处理后的今日课程数据
      const { total, courseList } = await CurdayCourse(
        type,
        xxId,
        userId,
        myDate,
        njId,
        bjId,
        XQSJId,
      );
      const { curCourse } = resetList(courseList);
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
    })();
  }, [userId]);

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
                {`${moment(resource?.bmkssj).format('YYYY.MM.DD')}—${moment(
                  resource?.bmjssj,
                ).format('YYYY.MM.DD')}`}
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
                {`${moment(resource?.bmkssj).format('YYYY.MM.DD')}—${moment(
                  resource?.bmjssj,
                ).format('YYYY.MM.DD')}`}
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
                {`${moment(resource?.skkssj).format('YYYY.MM.DD')}—${moment(
                  resource?.skjssj,
                ).format('YYYY.MM.DD')}`}{' '}
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
