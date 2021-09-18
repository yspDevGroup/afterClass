/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { getAllKHXSCQ } from '@/services/after-class/khxscq';
import styles from './index.less';
import GoBack from '@/components/GoBack';
import { getKHBJSJ } from '@/services/after-class/khbjsj';

/**
 * 点名记录
 * @returns
 */

type claNameType = {
  BJMC?: string;
  KSS?: number;
  KCMC?: string;
};

const RollCallRecord = (props: any) => {
  // '缺席'
  const [absent, setAbsent] = useState<number>(0);
  const [leaveData, setLeaveData] = useState<number>(0);
  // '出勤'
  const [comeClass, setComeClass] = useState<number>(0);
  // 班级需要数据
  const [claName, setClaName] = useState<claNameType>();
  // 表格数据
  const [dataSource, setDataScouse] = useState<any>([]);

  const { pkid, bjids, date, kjs, sj } = props.location.state;
  const pkDate = date?.replace(/\//g, '-'); // 日期

  const wxad: any = [];
  sj.forEach((item: any) => {
    if (new Date(pkDate) > new Date(item)) {
      wxad.push(item);
    }
  });
  useEffect(() => {
    // 查询所有课后服务出勤记录
    const resAll = getAllKHXSCQ({
      bjId: bjids || undefined, // 班级ID
      CQRQ: pkDate, // 日期
      pkId: pkid || undefined, // 排课ID
    });
    Promise.resolve(resAll).then((datas) => {
      const allData = datas.data;
      allData?.forEach((item: any) => {
        item.isLeave = item.CQZT === '请假' ? true : false;
        item.isRealTo = item.CQZT === '请假'? '缺席' : item.CQZT;
      });
      setDataScouse(allData);
    });

    // 获取课后班级数据
    const resClass = getKHBJSJ({ id: bjids || '' });
    Promise.resolve(resClass).then((data) => {
      if (data.status === 'ok') {
        const name: claNameType = {
          BJMC: data.data?.BJMC || '',
          KSS: data.data?.KSS || 0,
          KCMC: data.data?.KHKCSJ?.KCMC || '',
        };
        setClaName(name);
      }
    });
  }, []);
  useEffect(() => {
    const absentData = dataSource.filter((item: any) => item.isRealTo === '缺席');
    const comeClassData = dataSource.filter((item: any) => item.isRealTo === '出勤');
    const leaveData = dataSource.filter((item: any) => item.isLeave === true);
    setLeaveData(leaveData.length);
    setAbsent(absentData.length);
    setComeClass(comeClassData.length);
  }, [dataSource]);
  const checkWorkInfo = [
    { shouldArrive: dataSource.length, text: '应到', key: 1 },
    { shouldArrive: comeClass, text: '到课', key: 2 },
    { shouldArrive: absent, text: '缺席', key: 4 },
    { shouldArrive: leaveData, text: '请假', key: 3 },
  ];

  const columns: any = [
    {
      title: '姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
    },
    {
      title: '班级',
      dataIndex: 'class',
      key: 'class',
      align: 'center',
      render: () => {
        return claName?.BJMC;
      },
    },
    {
      title: '请假',
      dataIndex: 'isLeave',
      key: 'isLeave',
      align: 'center',
      render: (text: string, record: any) => {
        return <span style={{ color: text ? 'red' : '#333' }}>{text ? '是' : '否'}</span>;
      },
    },
    {
      title: '到课',
      dataIndex: 'isRealTo',
      key: 'isRealTo',
      align: 'center',
      render: (text: any) => {
        if (text === '缺席') {
          return <div style={{ color: '#f04d4d' }}>{text}</div>;
        }
        return <div style={{ color: '#52c41a' }}>{text}</div>;
      },
    },
  ];
  return (
    <div className={styles.callTheRoll}>
      <GoBack title='考勤记录' teacher onclick='/teacher/home?index=education' />
      <div className={styles.classCourseName}>{claName?.KCMC}</div>
      <div className={styles.classCourseInfo}>
        {claName?.BJMC} ｜ 第 {wxad.length}/{kjs} 课时
      </div>
      <div className={styles.checkWorkAttendance}>
        {checkWorkInfo.map((item) => {
          return (
            <div className={styles.checkWorkInfo} key={item.key}>
              <div className={styles.number}>{item.shouldArrive}</div>
              <div className={styles.word}>{item.text}</div>
            </div>
          );
        })}
      </div>
      <div className={styles.studentList}>
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="id"
          pagination={false}
          scroll={{ y: 'calc(100vh - 239px)' }}
        />
      </div>
    </div>
  );
};

export default RollCallRecord;
