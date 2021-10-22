import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Pie, Bar } from '@ant-design/charts';

import { getTerm, pieConfig, proportionConfig} from '../utils';
import { homePage } from '@/services/after-class/xxjbsj';

import noData from '@/assets/noData.png';

import styles from '../index.less';
import ModuleTitle from '../components/ModuleTitle';
import { Empty } from 'antd';
import { queryXNXQList } from '@/services/local-services/xnxq';

const course = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [currentData, setCurrentData] = useState<any>();

  const getData = async (res: any) => {
    const defaultData: any = {
      courseCollect: [],
      proportionNum: []
    };
    const xnxqResult = await queryXNXQList(currentUser?.xxId);
    const resProportion  = await homePage({
      XXJBSJId: currentUser?.xxId,
      XNXQId: xnxqResult.current?.id
    });
    if (resProportion.status === 'ok') {
      resProportion.data.lxs.forEach((item: any)=>{
        defaultData.courseCollect.push({
          type: item.KCTAG,
          value: item.xxkc_count + item.jgkc_count
        })
      });
      pieConfig.data = defaultData.courseCollect;
      const { xxkc_count, jgkc_count} = resProportion.data;
      console.log('xxkc_count, jgkc_count: ', xxkc_count, jgkc_count);
      const sum = xxkc_count + jgkc_count;
      defaultData.proportionNum.push({
        type: '学校课程',
        value: parseFloat((xxkc_count / sum * 100).toFixed(2)),
      });
      defaultData.proportionNum.push({
        type: '机构课程',
        value: parseFloat((jgkc_count / sum * 100).toFixed(2)),
      });
      proportionConfig.data = defaultData.proportionNum;
    };
    setCurrentData(defaultData);
  };

  useEffect(() => {
    const res = getTerm();
    getData(res);
  }, []);

  return (
  <div className={styles.course}>
    <div className={styles.container} style={{height: '290px'}}>
      <ModuleTitle data='课程类型分布'/>
      <div className={styles.chartsContainer}>
      {
          (pieConfig.data && pieConfig.data?.length!==0) ? <Pie {...pieConfig} /> : <Empty
          image={noData}
          imageStyle={{
            minHeight: 150
          }}
          style={{minHeight: '282px'}}
          description={'暂无课程类型信息'} />
        }
      </div>
    </div>
    <div className={styles.container} style={{height: '355px'}}>
      <ModuleTitle data='学校、机构课程对比'/>
      <div className={styles.chartsContainer}>
      {
          (proportionConfig.data && proportionConfig.data?.length!==0) ? <Pie {...proportionConfig} /> : <Empty
          image={noData}
          imageStyle={{
            minHeight: 200
          }}
          style={{minHeight: 355}}
          description={'暂无课程对比信息'} />
        }
      </div>
    </div>
    {/* <div className={styles.container} style={{height: '413px'}}>
      <ModuleTitle data='各校课程数' showRight={false}/>
      <div className={styles.chartsContainer}>
        {
          (barConfig.data && barConfig.data?.length!==0) ? <Bar {...barConfig} /> : <Empty
          image={noData}
          imageStyle={{
            minHeight: 230
          }}
          style={{minHeight: 355}}
          description={'暂无课程数信息'} />
        }
      </div>
    </div> */}
  </div>)
}

export default course;
