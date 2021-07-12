import React, { useContext, useEffect, useState } from 'react';
import { Pie } from '@ant-design/charts';
import styles from '../index.less';
import { Badge } from 'antd';
import myContext from '@/utils/MyContext';
import noChart from '@/assets/noChart.png';
import Nodata from '@/components/Nodata';
import { getData } from '@/utils/utils';

const Statistical: React.FC = () => {
  const { currentUserInfo, yxkc } = useContext(myContext);
  const [satistics, setStatistics] = useState<any[]>();
  const children = currentUserInfo?.subscriber_info?.children || [
    {
      student_userid: currentUserInfo?.UserId || currentUserInfo?.id,
      njId: '1',
    },
  ];
  const convertData = (title: string, dataArr: any) => {
    if (dataArr && dataArr.length) {
      const nor = dataArr.filter((item: any) => item.status === '出勤');
      const abnor = dataArr.filter((item: any) => item.status === '缺席');
      const toDo = dataArr.filter((item: any) => item.status === '待上');
      return {
        title,
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
    return {}
  };
  useEffect(() => {
    async function fetchData() {
      if (yxkc) {
        const arr = [].map.call(yxkc, async (item: any) => {
          const { title, data } = await getData(item.id, children[0].student_userid!);
          if(data && title){
            return convertData(title, data);
          }
          return {status:'nothing'};
        });
        const result = await Promise.all(arr);
        const realResult = result.filter((item: any) => item.status !== 'nothing');
        setStatistics(realResult);
      }
    }
    fetchData();
  }, [yxkc]);

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
