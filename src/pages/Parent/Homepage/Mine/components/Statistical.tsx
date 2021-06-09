import React from 'react';
import { Pie } from '@ant-design/charts';
import '../index.less';
import {statisticalList} from '../mock';

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
    appendPadding: 0,
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
    radius: 1,
    innerRadius: 0.64,
    meta: {
      value: {
        formatter: function formatter(v: string) {
          return ''.concat(v, ' \xA5');
        },
      },
    },
    label: {
      type: 'inner',
      offset: '-50%',
      style: { textAlign: 'center' },
      autoRotate: false,
      content: '',
    },
    interactions:  [{ type: 'tooltip', enable: false }],
  };
  return (
    <div className='statistical'>
      <p>出勤统计</p>
          <div className='diagram'>
            {
              statisticalList.map((value: any)=>{
                return <div className='cards'> 
                  <p>{value.KC}</p>
                  <Pie className='pies' {...config} />
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