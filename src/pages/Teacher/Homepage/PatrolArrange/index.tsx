/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-25 09:20:56
 * @LastEditTime: 2021-09-30 15:47:49
 * @LastEditors: Sissle Lynn
 */
import { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';
import { ConfigProvider, DatePicker, List } from 'antd';
import dayjs from 'dayjs';
// 默认语言为 en-US，如果你需要设置其他语言，推荐在入口文件全局设置 locale
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/locale/zh_CN';

import styles from './index.less';
import GoBack from '@/components/GoBack';
import Nodata from '@/components/Nodata';
import noData from '@/assets/noCourses1.png';
import { getScheduleByDate } from '@/services/after-class/khxksj';
const PatrolArrange = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [day, setDay] = useState<string>(dayjs().format('YYYY/MM/DD'));
  // 课表中选择课程后的数据回显
  const [dateData, setDateData] = useState<any>([]);
  const getData = async (day: string) => {
    const res = await getScheduleByDate({
      JZGJBSJId: currentUser.JSId || '1965a118-4b5b-4b58-bf16-d5f45e78b28c',
      RQ: day,
      WEEKDAY: new Date(day).getDay().toString(),
      XXJBSJId: currentUser?.xxId,
    });
    if (res.status === 'ok' && res.data) {
      const { flag, rows } = res.data;
      if (flag) {
        setDateData(rows);
      } else {
        setDateData([]);
      }
    }
  };
  useEffect(() => {
    getData(day);
  }, []);
  const onChange = (date: any, dateString: any) => {
    setDay(dateString);
    getData(dateString);
  }
  return (
    <>
      <GoBack title={'巡课安排'} onclick='/teacher/home?index=index' teacher />
      <div className={styles.patrolWrapper}>
        <header>
          <ConfigProvider locale={locale}>
            <DatePicker bordered={false} allowClear={false} inputReadOnly={true} value={moment(day)} onChange={onChange} />
          </ConfigProvider>
        </header>
        <div className={styles.patrolContent}>
          {dateData?.length ? <List
            className={styles.patrolList}
            itemLayout="horizontal"
            dataSource={dateData}
            renderItem={(item: any) => (
              <Link key={item.id} to={{
                pathname: '/teacher/patrolArrange/classes',
                state: {
                  id: item.id,
                  day: day,
                  xxId: currentUser?.xxId,
                  kcmc: item.KCMC
                }
              }}>
                <List.Item
                  actions={[<span
                    style={{ color: item.SFXK === 1 ? '#0066FF' : (item.SFXK === 2 ? '#45C977' : '#FF6600'), fontSize: 12 }}
                  >
                    {item.SFXK === 1 ? '部分' : (item.SFXK === 2 ? '已' : '未')}巡课
                  </span>]}
                >
                  <List.Item.Meta
                    title={item.KCMC}
                    description={item.SSJGLX}
                  />
                </List.Item>
              </Link>
            )}
          /> : <div className={styles.noData}>
            <Nodata imgSrc={noData} desc='暂无巡课安排' />
          </div>}
        </div>
      </div>
    </>
  );
};

export default PatrolArrange;
