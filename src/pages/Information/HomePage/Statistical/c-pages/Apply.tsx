import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Bar } from '@ant-design/charts';

import { getTerm, barConfig } from '../utils';
import { homePage } from '@/services/after-class/xxjbsj';

import noData from '@/assets/noData.png';

import styles from '../index.less';
import ModuleTitle from '../components/ModuleTitle';
import NumberCollect from '../components/NumberCollect';
import { Empty } from 'antd';
import { queryXNXQList } from '@/services/local-services/xnxq';



const apply = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [currentData, setCurrentData] = useState<any>({
    applyNum: [{
      num: '--',
      title: '报名人次'
    }, {
      num: '--',
      title: '参与学生'
    }]
  });

  const getData = async (res: any) => {
    const defaultData: any = {
      serviceNum: [],
      courseCollect: [],
      checkOut: [],
      numCollect: [],
      schoolNum: [],
      courseNum: [],
      enrollNum: [],
      agentNum: [],
      applyNum: [],
      conditionNum: [],
    };
    const xnxqResult = await queryXNXQList(currentUser?.xxId);

    const applyRes = await homePage({
      XXJBSJId: currentUser?.xxId,
      XNXQId: xnxqResult.current?.id
    });
    if (applyRes.status === 'ok') {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      applyRes.data.kcbm?.length && applyRes.data.kcbm.forEach((item: any) => {
        defaultData.conditionNum.push({
          label: item.KCMC,
          type: '报名人次',
          value:Number((parseInt(item.xsbj_count, 10) || 0) + (parseInt(item.khfwxsbj_count, 10) || 0)) ,
        });
      });
      defaultData.applyNum = [{
        num: applyRes.data.xsbj_count + applyRes.data?.khfwxsbj_count,
        title: '报名人次'
      }, {
        num: applyRes.data.xs_count + applyRes.data?.khfwxs_count,
        title: '参与学生'
      }];
      barConfig.data = defaultData.conditionNum;
      setCurrentData(defaultData);

    }
  };

  useEffect(() => {
    const res = getTerm();
    getData(res);
  }, []);

  return (
    <div className={styles.apply}>
      <div className={styles.container} style={{ height: '136px' }}>
        <ModuleTitle data='报名统计' showRight={false} />
        <NumberCollect data={currentData?.applyNum} col={currentData?.applyNum.length} />
      </div>
      <div className={styles.container} style={{ height: '482px' }}>
        <ModuleTitle data='各课程报名情况' showRight={false} />
        <div className={styles.chartsContainer}>
          {
            (barConfig.data && barConfig.data?.length !== 0) ? <Bar {...barConfig} /> : <Empty
              image={noData}
              imageStyle={{
                minHeight: 230
              }}
              style={{ minHeight: 355 }}
              description={'暂无报名信息'} />
          }
        </div>
      </div>
    </div>)
}

export default apply;
