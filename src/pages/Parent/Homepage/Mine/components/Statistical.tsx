import React, { useEffect, useState } from 'react';
import { Pie } from '@ant-design/charts';
import styles from '../index.less';
import { Badge } from 'antd';
import noChart from '@/assets/noChart.png';
import Nodata from '@/components/Nodata';
import { countKHXSCQ } from '@/services/after-class/khxscq';
import { useModel } from 'umi';
import { queryXNXQList } from '@/services/local-services/xnxq';

const Statistical: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { xxId,student } = currentUser || {};
  const StorageXSId = localStorage.getItem('studentId') || (student && student[0].XSJBSJId) || testStudentId;
  const [satistics, setStatistics] = useState<any[]>();

  const convertData = (data: any) => {
    if (data) {
      return {
        title: `${data.KCMC}/${data.BJMC}`,
        zc: data.normal,
        yc: data.abnormal,
        ds: data.remain,
        data: [
          {
            type: '正常',
            value: data.normal,
          },
          {
            type: '异常',
            value: data.abnormal,
          },
          {
            type: '待上',
            value: data.remain,
          },
        ]
      }
    }
    return {}
  };

  useEffect(() => {
    (async () => {
      const result = await queryXNXQList(xxId);
      if (result.current) {
        const res = await countKHXSCQ({
          XNXQId: result.current.id,
          XSJBSJId: StorageXSId
        });
        if(res.status === 'ok'){
          const arr = [].map.call(res.data,(item)=>{
            return convertData(item);
          })
          setStatistics(arr || []);
        }
      }
    })()
  }, [StorageXSId]);
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
