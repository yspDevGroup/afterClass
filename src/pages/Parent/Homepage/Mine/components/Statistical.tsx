import React, { useEffect, useState } from 'react';
import { Badge } from 'antd';
import { Pie } from '@ant-design/charts';
import { countKHXSCQ } from '@/services/after-class/khxscq';
import { queryXNXQList } from '@/services/local-services/xnxq';
import noChart from '@/assets/noChart.png';
import Nodata from '@/components/Nodata';

import styles from '../index.less';

const Statistical = (props: { userId?: string; xxId?: string }) => {
  const { userId, xxId } = props;
  const [satistics, setStatistics] = useState<any[]>();

  const convertData = (data: any, type: string) => {
    if (data && type === 'kcb') {
      return {
        title: `${data.KCMC}/${data.BJMC}`,
        zc: Number(data.normal),
        yc: Number(data.abnormal),
        ds: Number(data.remain),
        ISFW: data.ISFW,
        data: [
          {
            type: '正常',
            value: Number(data.normal),
          },
          {
            type: '异常',
            value: Number(data.abnormal),
          },
          {
            type: '待上',
            value: Number(data.remain),
          },
        ],
      };
    }
    return {
      title: `${data.KCMC}/${data.BJMC}`,
      zc: Number(data.normal),
      yc: Number(data.abnormal),
      ISFW: data.ISFW,
      data: [
        {
          type: '正常',
          value: Number(data.normal),
        },
        {
          type: '异常',
          value: Number(data.abnormal),
        },
      ],
    };

  };

  useEffect(() => {
    (async () => {
      const result = await queryXNXQList(xxId);
      if (result.current) {
        const res = await countKHXSCQ({
          XNXQId: result.current.id,
          XSJBSJId: userId,
        });
        if (res.status === 'ok') {
          const KcArr = [].map.call(res.data.SKBJs, (item: any) => {
            return convertData(item, 'kcb');
          });
          const FwArr = [].map.call(res.data.KHFWs, (item: any) => {
            return convertData(item, 'fwb');
          });
          const TkArr = [].map.call(res.data.TKBJs, (item: any) => {
            return convertData(item, 'tkb');
          });
          const arr = [...KcArr, ...FwArr, ...TkArr]
          setStatistics(arr || []);
        }
      }
    })();
  }, [userId]);

  const config: any = {
    data: '',
    angleField: 'value',
    colorField: 'type',
    color: ({ type }: any) => {
      if (type === '正常') {
        return '#31D99F';
      }
      if (type === '异常') {
        return '#FF7171';
      }
      return '#DDD';
    },
    innerRadius: 0.64,
    label: {
      content: '',
    },
    interactions: [{ type: 'tooltip', enable: false }],
    legend: false,
    statistic: {
      // title: false,
      // title: {
      //   offsetY: -4,
      //   style: { fontSize: '14px' },
      //   content: '已排课时',
      //   customHtml: () => {
      //     return '已排课时';
      //   }
      // },
      // content: false,
      content: {
        offsetY: 4,
        style: { fontSize: '16px' },
      },
    },
  };

  return (
    <div className={styles.statistical}>
      <p>
        <div className={styles.title}>
          <div />
          <span>出勤统计</span>
        </div>
        <span>
          <Badge className={styles.legend} color="#31D99F" text="正常" />
          <Badge className={styles.legend} color="#FF7171" text="异常" />
          <Badge className={styles.legend} color="#DDD" text="待上" />
        </span>
      </p>
      <div className={styles.diagram}>
        {satistics && satistics.length ? (
          satistics.map((value: any) => {
            config.data = value.data;
            return (
              <>
                {value.data ? (
                  <div className={styles.cards}>
                    <p
                      style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {value.title}
                    </p>
                    <Pie className={styles.pies} {...config} />
                    <div>
                      <span>正常:{value.zc}课时</span>
                      <span>异常:{value.yc}课时</span>
                      {
                        value?.ISFW === 0 ? <span>待上:{value.ds}课时</span> : <></>
                      }

                    </div>
                  </div>
                ) : (
                  ''
                )}
              </>
            );
          })
        ) : (
          <Nodata imgSrc={noChart} desc="暂无数据" />
        )}
      </div>
    </div>
  );
};

export default Statistical;
