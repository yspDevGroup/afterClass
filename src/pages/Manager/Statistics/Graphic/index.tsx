import { useModel } from 'umi';
import { Row, Col } from 'antd';
import NumberCollect from './component/NumberCollect';
import { textColor1, textColor2 } from './component/utils';
import PieChart from './component/PieChart';
import List from './component/List';
import ColumnChart from './component/ColumnChart';
import BarChart from './component/BarChart';
import { useEffect, useState } from 'react';
// import { getScreenInfo } from '@/services/after-class-qxjyj/jyjgsj';

import bgImg from '@/assets/dispalyBgc.jpg';
import headerImg from '@/assets/headLine.png';
import should from '@/assets/should.png';
import real from '@/assets/real.png';
import leave from '@/assets/leave.png';

import styles from './index.less';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { homePage } from '@/services/after-class/xxjbsj';

const ChartsPage = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [currentData, setCurrentData] = useState<any>();
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  const getData = async (XNXQId: string) => {
    const defaultData: any = {
      serviceNum: [],
      courseCollect: [],
      checkOut: [],
      numCollect: [],
      schoolNum: [],
      courseNum: [],
      enrollNum: [],
      checkOutTeacher: [],
    };
    const result = await homePage({
      XNXQId,
      XXJBSJId: currentUser?.xxId,
    });
    if (result?.status === 'ok') {
      const { data } = result;
      if (data) {
        defaultData.serviceNum = [
          {
            title: '教师总数',
            num: data?.js_count || 0,
          },
          {
            title: '学生总数',
            num: data?.xs_count || 0,
          },
          {
            title: '收款总额',
            num: Number((data?.bjdd_amount || 0) + (data?.zzfw_amount || 0)).toFixed(2),
          },
          {
            title: '退款总额',
            num: data?.tk_amount || 0,
          },
        ];
        defaultData.checkOut = [
          {
            icon: should,
            title: '应到人数',
            num: data.ydxs_count || 0,
          },
          {
            icon: real,
            title: '实到人数',
            num: data.sdxs_count || 0,
          },
          {
            icon: leave,
            title: '请假人数',
            num: data.qjxs_count || 0,
          },
        ];
        defaultData.numCollect = [
          {
            title: '课程总数',
            num: data.kc_count || 0,
          },
          {
            title: '课程班总数',
            num: data.bj_count || 0,
          },
          {
            title: '学校教师数',
            num: Number((data.js_count || 0) - (data.jgjs_count || 0)),
          },
          {
            title: '合作机构数',
            num: data.jg_count || 0,
          },
          {
            title: '合作课程数',
            num: data.jgkc_count || 0,
          },
          {
            title: '机构教师数',
            num: data.jgjs_count || 0,
          },
        ];
        if (data.lxs?.length) {
          data.lxs.forEach((item: { KCTAG: any; xxkc_count: number; jgkc_count: number }) => {
            const counts = Number((item.xxkc_count || 0) + (item.jgkc_count || 0));
            if (counts !== 0) {
              defaultData.courseCollect.push({
                type: item.KCTAG,
                value: counts,
              });
            }
          });
        }
        defaultData.schoolNum = data.kcbm?.length
          ? [].map.call(data.kcbm, (item: any) => {
              return item.KCMC;
            })
          : [];
        if (data.kcbm?.length) {
          data.kcbm.forEach((item: any) => {
            defaultData.courseNum.push({
              type: '收款情况',
              school: item.KCMC,
              value: Number(item.dd_amount),
            });
            defaultData.courseNum.push({
              type: '退款情况',
              school: item.KCMC,
              value: Number(item.tk_amount),
            });
          });
        }
        defaultData.enrollNum = data.kcbm?.length
          ? [].map.call(data.kcbm, (item: any) => {
              return {
                school: item.KCMC,
                value: item.xs_count,
              };
            })
          : [];
        defaultData.checkOutTeacher = [
          {
            icon: should,
            title: '应到人数',
            num: data.ydjs_count || 0,
          },
          {
            icon: real,
            title: '实到人数',
            num: data.sdjs_count || 0,
          },
          {
            icon: leave,
            title: '请假人数',
            num: data.qjjs_count || 0,
          },
        ];
      }
    }
    setCurrentData(defaultData);
  };
  useEffect(() => {
    // 获取学年学期数据的获取
    (async () => {
      const res = await queryXNXQList(currentUser?.xxId);
      // 获取到的整个列表的信息
      const newData = res.xnxqList;
      const curTerm = res.current;
      if (newData?.length) {
        if (curTerm) {
          setCurXNXQId(curTerm.id);
        }
      }
    })();
  }, []);
  useEffect(() => {
    if (curXNXQId) {
      getData(curXNXQId);
    }
    // setCurrentData(mock);
  }, [curXNXQId]);

  return (
    <div className={styles.diaplayBox} style={{ backgroundImage: `url(${bgImg})` }}>
      {/* 头部 */}
      <div className={styles.diaplayTop} style={{ backgroundImage: `url(${headerImg})` }}>
        本学期课后服务数据大屏
      </div>
      <div className={styles.content} style={{ marginTop: '2vh', padding: '0 1vh' }}>
        <Row className={styles.bodyRow}>
          <Col span={7} className={styles.diaplay1}>
            <div>
              <span className={styles.boxfoot} />
              <header>课后服务情况</header>
              <div className={styles.container}>
                <NumberCollect data={currentData?.serviceNum} color={textColor1} />
              </div>
            </div>
            <div>
              <span className={styles.boxfoot} />
              <header>各类课程开设情况</header>
              <div className={styles.container}>
                <PieChart data={currentData?.courseCollect} />
              </div>
            </div>
            <div>
              <span className={styles.boxfoot} />
              <header>今日学生出勤情况</header>
              <div className={styles.container}>
                <NumberCollect data={currentData?.checkOut} col={3} color={textColor2} />
              </div>
            </div>
          </Col>
          <Col span={10} className={styles.diaplay2}>
            <div>
              <span className={styles.boxfoot} />
              <div className={styles.container}>
                <NumberCollect data={currentData?.numCollect} col={3} reverse={true} />
              </div>
            </div>
            <div>
              <span className={styles.boxfoot} />
              <header>本学期开设课程</header>
              <div className={styles.container}>
                <List data={currentData?.schoolNum} />
              </div>
            </div>
            <div>
              <span className={styles.boxfoot} />
              <header>各课程收退款情况</header>
              <div className={styles.container}>
                <ColumnChart data={currentData?.courseNum} />
              </div>
            </div>
          </Col>
          <Col span={7} className={styles.diaplay3}>
            <div>
              <span className={styles.boxfoot} />
              <header>课程报名情况</header>
              <div className={styles.container}>
                <BarChart data={currentData?.enrollNum} />
              </div>
            </div>
            <div>
              <span className={styles.boxfoot} />
              <header>今日教师出勤情况</header>
              <div className={styles.container}>
                <NumberCollect data={currentData?.checkOutTeacher} col={3} color={textColor2} />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
ChartsPage.wrappers = ['@/wrappers/auth'];
export default ChartsPage;
