import React from 'react';
import { Data } from './mock';
import styles from './index.less';
import { Table } from 'antd';

/**
 * 课堂点名
 * @returns
 */

const CallTheRoll = () => {
  const checkWorkInfo = [
    { shouldArrive: Data.shouldArrive, text: '应到', key: 1 },
    { shouldArrive: Data.realTo, text: '到课', key: 2 },
    { shouldArrive: Data.leave, text: '请假', key: 3 },
    { shouldArrive: Data.absent, text: '缺席', key: 4 },
  ];
  const columns: any = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '班级',
      dataIndex: 'class',
      key: 'class',
      align: 'center',
    },
    {
      title: '请假',
      dataIndex: 'isLeave',
      key: 'isLeave',
      align: 'center',
    },
    {
      title: '到课',
      dataIndex: 'isRealTo',
      key: 'isRealTo',
      align: 'center',
    },
  ];
  return (
    <div className={styles.callTheRoll}>
      <div className={styles.classCourseName}>{Data.classCourseName}</div>
      <div className={styles.classCourseInfo}>
        {Data.className} ｜ 第 {Data.classCurrent}/{Data.classTotal} 课时
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
          dataSource={Data.studentList}
          columns={columns}
          rowKey={() => Math.random()}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default CallTheRoll;
