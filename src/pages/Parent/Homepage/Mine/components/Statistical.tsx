import React, { useContext, useEffect, useState } from 'react';
import { Pie } from '@ant-design/charts';
import styles from '../index.less';
import { Badge } from 'antd';
import myContext from '@/utils/MyContext';
import { getAllKHXSCQ } from '@/services/after-class/khxscq';
import noChart from '@/assets/noChart.png';
import Nodata from '@/components/Nodata';
import moment from 'moment';
import { DateRange, Week } from '@/utils/Timefunction';
import { getKHPKSJByBJID } from '@/services/after-class/khpksj';
import { getKHBJSJ } from '@/services/after-class/khbjsj';

const Statistical: React.FC = () => {
  const { currentUserInfo, yxkc } = useContext(myContext);
  const [checkIn, setCheckIn] = useState<any>();
  const [satistics, setStatistics] = useState<any[]>();

  const getCqDay = async (wkd?: any[], start?: string, end?: string, bjid?: string) => {
    const myDate = new Date();
    const nowDate = new Date(moment(myDate).format('YYYY/MM/DD'));
    const res = await getAllKHXSCQ({
      xsId: currentUserInfo?.UserId || currentUserInfo?.id,
      bjId: bjid || '',
      CQZT: '',
      CQRQ: '',
    });
    if (res.status === 'ok') {
      if (start && end && wkd) {
        const arr = DateRange(start, end);
        const classbegins: any[] = [];
        arr.forEach((record: any) => {
          for (let i = 0; i < wkd.length; i += 1) {
            if (Week(record) === wkd[i] && !classbegins.includes(record)) {
              const current = new Date(moment(record).format('YYYY/MM/DD'));
              let status = current < nowDate ? '出勤' : '待上';
              if (res.data && res.data.length) {
                res.data.forEach((date: any) => {
                  if (date.CQRQ === record) {
                    status = date.CQZT;
                  }
                })
              }
              classbegins.push({ status })
            }
          }
        });
        return classbegins;
      }
    }
    return [];
  };
  const getData = async (bjid: string) => {
    const res1 = await getKHPKSJByBJID({ id: bjid });
    if (res1.status === 'ok' && res1.data) {
      const attend = [...new Set(res1.data.map(n => n.WEEKDAY))];
      const res = await getKHBJSJ({ id: bjid });
      if (res.status === 'ok' && res.data && attend) {
        const start = res.data.KKRQ ? res.data.KKRQ : res.data.KHKCSJ!.KKRQ;
        const end = res.data.JKRQ ? res.data.JKRQ : res.data.KHKCSJ!.JKRQ;
        const dataArr = await getCqDay(attend, start, end, bjid);
        if (dataArr && dataArr.length) {
          const nor = dataArr.filter((item) => item.status === '出勤');
          const abnor = dataArr.filter((item) => item.status === '缺席');
          const toDo = dataArr.filter((item) => item.status === '待上');
          return {
            title: res.data.BJMC,
            zc: nor && nor.length,
            yc: abnor && abnor.length,
            ds: toDo && toDo.length,
            data: [
              {
                type: '正常',
                value: nor && nor.length,
              },
              {
                type: '异常',
                value: abnor && abnor.length,
              },
              {
                type: '待上',
                value: toDo && toDo.length,
              },
            ]
          }
        }
      }
    }
    return {
      status: 'nothing'
    };
  };
  useEffect(() => {
    async function fetchData() {
      if (yxkc) {
        const arr = [].map.call(yxkc, (item: any) => {
          return getData(item.id);
        });
        const result = await Promise.all(arr);
        setCheckIn(result.filter((item: any) => item.status !== 'nothing'));
      }
    }
    fetchData();
  }, [yxkc]);
  useEffect(() => {
    setStatistics(checkIn);
  }, [checkIn, yxkc])

  const config: any = {
    data: '',
    angleField: 'value',
    colorField: 'type',
    color: ({ type }: any) => {
      if (type === '正常') {
        return '#31D99F';
      } if (type === '异常') {
        return '#FF7171';
      }
      return '#DDDDDD';
    },
    innerRadius: 0.64,
    label: {
      content: '',
    },
    interactions: [{ type: 'tooltip', enable: false }],
    legend: false,
  };
  return (
    <div className={styles.statistical}>
      <p><span>出勤统计</span>
        <span>
          <Badge className={styles.legend} color="#31D99F" text="正常" />
          <Badge className={styles.legend} color="#FF7171" text="异常" />
          <Badge className={styles.legend} color="#DDDDDD" text="待上" />
        </span>
      </p>
      <div className={styles.diagram}>
        {
          satistics && satistics.length ? satistics.map((value: any) => {
            config.data = value.data;
            return <>{value.data ? <div className={styles.cards}>
              <p>{value.title}</p>
              <Pie className={styles.pies} {...config} />
              <div>
                <span>正常:{value.zc}课时</span>
                <span>异常:{value.yc}课时</span>
                <span>待上:{value.ds}课时</span>
              </div>
            </div> : ''}</>
          }) :
            <Nodata imgSrc={noChart} desc='暂无数据' />
        }
      </div>
    </div>
  );
};

export default Statistical;
