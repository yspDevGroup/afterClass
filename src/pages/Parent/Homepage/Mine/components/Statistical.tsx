import React, { useContext, useEffect, useState } from 'react';
import { Pie } from '@ant-design/charts';
import styles from '../index.less';
import { Badge } from 'antd';
import myContext from '@/utils/MyContext';
import { getAllKHXSCQ } from '@/services/after-class/khxscq';
import IconFont from '@/components/CustomIcon';

const Statistical: React.FC = () => {

  const { currentUserInfo, yxkc } = useContext(myContext);
  const [checkIn, setCheckIn] = useState<any>();
  const [satistics, setStatistics] = useState<any[]>();

  const statistics = (data: any, checkInfo: any) => {
    const checkData: any[] = [];
    for (let i = 0; i < data.length; i += 1) {
      const record = data[i];
      if (checkInfo && checkInfo[record.id]) {
        const Attendance = [];
        const absence = [];
        checkInfo[record.id].map((item: any) => {
          if (item.CQZT === '出勤') {
            Attendance.push(item);
          } else {
            absence.push(item);
          }
          return true
        })
        checkData.push({
          id: data[i].id,
          title: data[i].KHKCSJ.KCMC,
          kss: data[i].KSS,
          list: checkInfo[record.id],
          zc: Attendance.length,
          yc: absence.length,
          ds: data[i].KSS - Attendance.length - absence.length,
          data: [
            {
              type: '正常',
              value: Attendance.length,
            },
            {
              type: '异常',
              value: absence.length,
            },
            {
              type: '待上',
              value: data[i].KSS - Attendance.length - absence.length,
            },
          ]
        })
      }
    }
    return {
      checkData
    }
  }

  useEffect(() => {
    async function fetchData() {
      if (yxkc) {
        const res = await getAllKHXSCQ({
          xsId: currentUserInfo?.userId || currentUserInfo?.id,
          bjId: '',
          CQZT: '',
          CQRQ: '',
        });
        if (res.status === 'ok' && res.data) {
          const ras = res.data;
          const listDate = {};
          for (let i = 0; i < ras.length; i += 1) {
            const { CQZT, CQRQ, KHBJSJ } = ras[i];
            const id = KHBJSJ!.id!;
            if (listDate[id]) {
              listDate[id] = listDate[id].concat([{
                CQZT,
                CQRQ
              }])
            } else {
              listDate[id] = [{
                CQZT,
                CQRQ
              }];
            }
          }
          setCheckIn(listDate);
        }
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    const { checkData } = statistics(yxkc, checkIn);
    setStatistics(checkData)
  }, [checkIn, yxkc])


  const config = {
    data:'',
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
            config.data=value.data 
            return <div className={styles.cards}>
              <p>{value.title}</p>
              <Pie className={styles.pies} {...config} />
              <div>
                <span>正常:{value.zc}课时</span>
                <span>异常:{value.yc}课时</span>
                <span>待上:{value.ds}课时</span>
              </div>
            </div>
          }) :
          <IconFont type='icon-zanwu' style={{fontSize: '80px',display:'block',margin:'20px auto'}} />
        }
      </div>
    </div>
  );
};

export default Statistical;
