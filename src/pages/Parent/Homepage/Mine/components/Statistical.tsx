import React from 'react';
import { Pie } from '@ant-design/charts';
import styles from '../index.less';
import {statisticalList} from '../mock';
import { Badge } from 'antd';

const Statistical: React.FC= () => {
  const data = [
    {
      type: '正常',
      value: 12,
    },
    {
      type: '异常',
      value: 1,
    }, 
    {
      type: '待上',
      value: 3,
    },
  ];
  
  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    color: ({ type }: any) => {
      if(type === '正常'){
        return '#31D99F';
      }if(type === '异常'){
        return '#FF7171';
      }
      return '#DDDDDD';
    }, 
    innerRadius: 0.64,
    label: {
      content: '',
    },
    interactions:  [{ type: 'tooltip', enable: false }],
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
            statisticalList.map((value: any)=>{
              return <div className={styles.cards}> 
                <p>{value.KC}</p>
                <Pie className={styles.pies} {...config} />
                <div>
                    <span>正常:{value.data[0].value}课时</span>
                    <span>异常:{value.data[1].value}课时</span>
                    <span>待上:{value.data[2].value}课时</span>
                </div>
              </div>
            })
          }
        </div> 
    </div>
  );
};

export default Statistical;