import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Col, ConfigProvider, DatePicker, Empty, Row, Space } from 'antd';
import locale from 'antd/lib/locale/zh_CN';
import { Bar } from '@ant-design/charts';
import moment from 'moment';

import { getTerm, barConfig } from '../utils';
import { getScreenInfo , getTotalCost } from '@/services/after-class/jyjgsj';
import { homePage, getRefund } from '@/services/after-class/xxjbsj';

import noData from '@/assets/noData.png';

import styles from '../index.less';
import ModuleTitle from '../components/ModuleTitle';
import NumberCollect from '../components/NumberCollect';
import { queryXNXQList } from '@/services/local-services/xnxq';


const Toll = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [startTime, setStartTime] = useState<any>(moment().subtract(30, "days").format("YYYY-MM-DD"));
  const [endTime, setEndTime] = useState<any>(moment().format("YYYY-MM-DD"));
  const [currentData, setCurrentData] = useState<any>([
    {
      title: '收款金额（元）',
      num: '--'
    },
    {
      title: '退款金额（元）',
      num: '--'
    }]);
  const [intervalData, setIntervalData] = useState<any>([
    {
      num: '--',
      title: '收款金额（元）'
    }, {
      num: '--',
      title: '退款金额（元）'
    }
  ]);

const handleStartTime = (date: any) => {
  setStartTime(moment(date).format('YYYY-MM-DD'));
}
const handleEndTime = async (date: any) => {
  setEndTime(moment(date).format('YYYY-MM-DD'));
}

useEffect(()=>{
    const res = getTerm();
  console.log('res: ', res);
    getData(res);
},[endTime])



  const getData = async (res: any) => {

    const defaultData: any = {
      serviceNum: [],
      courseNum: [],
    };

    const xnxqResult = await queryXNXQList(currentUser?.xxId);

    const fundRes = await getRefund({
      XXJBSJId: currentUser?.xxId,
      startDate: startTime,
      endDate: endTime,
    });
    if(fundRes.status === 'ok'){
      setIntervalData([
        {
          num: fundRes.data.sk_amount,
          title: '收款金额（元）'
        }, {
          num: fundRes.data.tk_amount,
          title: '退款金额（元）'
        }
      ]);
    }
    const tollRes = await homePage({
      XXJBSJId: currentUser?.xxId,
      XNXQId: xnxqResult.current?.id
    });
    console.log('applyRes: ', tollRes);
    if(tollRes.status === 'ok'){
      defaultData.serviceNum = [
      {
        title: '收款金额（元）',
        num: tollRes.data?.bjdd_amount || 0
      },
      {
        title: '退款金额（元）',
        num: tollRes.data?.tk_amount || 0
      }];
      tollRes.data.kcbm.forEach((item: any)=>{
        console.log('item: ', item);
        defaultData.courseNum.push({
          type: '收款',
          label: item.KCMC,
          value: item.dd_amount,
        });
        defaultData.courseNum.push({
          type: '退款',
          label: item.KCMC,
          value: item.tk_amount,
        })
        barConfig.data = defaultData.courseNum;
      })
    }


    // const result = await getScreenInfo({
    //   ...res,
    //   XZQHM: currentUser?.XZQHM
    // });
    // if (result.status === 'ok') {
    //   const { data } = result;
    //   if (data) {
    //     }) : [];
    //   }
    // }
    setCurrentData(defaultData.serviceNum);
  };

  useEffect(() => {
    const res = getTerm();
    getData(res);
  }, []);

  return (
    <div className={styles.toll}>
      <div className={styles.container} style={{ height: '136px' }}>
        <ModuleTitle data='本学期收费总计' />
        <NumberCollect data={currentData} col={currentData?.length} />
      </div>
      <div className={styles.container} style={{ height: '374px' }}>
        <ModuleTitle data='各课程收退款情况' />
        <div className={styles.chartsContainer}>
          {
            (barConfig.data && barConfig.data?.length!==0) ? <Bar {...barConfig} /> : <Empty
            image={noData}
            imageStyle={{
              minHeight: 200
            }}
            style={{minHeight: 355}}
            description={'暂无收退款信息'} />
          }
        </div>
      </div>
      <div className={styles.container} style={{ height: '192px' }}>
        <ModuleTitle data='收费统计查询' showRight={false} />
        <Space direction="vertical" style={{marginTop: '20px'}} size={12}>
          <Row>
            <ConfigProvider locale={locale}>
              <Col span={11}>
                <DatePicker placeholder='请选择开始日期' defaultValue={moment(moment().subtract(30, "days"), 'YYYY-MM-DD')} onChange={handleStartTime} format="YYYY-MM-DD"/>
              </Col>
              <Col span={2}>-</Col>
              <Col span={11}>
                <DatePicker placeholder='请选择结束日期' defaultValue={moment(moment(), 'YYYY-MM-DD')} onChange={handleEndTime} format="YYYY-MM-DD"/>
              </Col>
            </ConfigProvider>
          </Row>
        </Space>
        <Row>
          <Col span={24}>
          <NumberCollect data={intervalData} col={intervalData?.length} />
          </Col>
        </Row>
      </div>
    </div>)
}

export default Toll;
