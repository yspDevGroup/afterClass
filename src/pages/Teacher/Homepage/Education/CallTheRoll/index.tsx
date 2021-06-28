/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import { Data } from './mock';
import styles from './index.less';
import { Table, Button, Switch, message } from 'antd';
import { getEnrolled, getKHBJSJ } from '@/services/after-class/khbjsj';
import WWOpenDataCom from '@/pages/Manager/ClassManagement/components/WWOpenDataCom';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import { createKHXSCQ } from '@/services/after-class/khxscq';

/**
 * 课堂点名
 * @returns
 */

const SwitchIndex: any = (props: {
  realTo: any;
  record: number;
  onSwitchItem: (value: any, checked?: boolean, refc?: any) => void;
}) => {
  const { realTo, record, onSwitchItem } = props;
  const [state, setstate] = useState<boolean>();
  useEffect(() => {
    if (realTo === '出勤') {
      setstate(true);
    } else {
      setstate(false);
    }
  }, []);
  const onSwitchChange: any = (checked: any) => {
    setstate(checked);
    onSwitchItem(record, checked);
  };
  return (
    <div>
      <Switch
        checkedChildren="出勤"
        unCheckedChildren="缺席"
        checked={state}
        onChange={(checked) => onSwitchChange(checked)}
      />
    </div>
  );
};

const CallTheRoll = () => {
  // '缺席'
  const [absent, setAbsent] = useState<number>(0);
  // '出勤'
  const [comeClass, setComeClass] = useState<number>(0);
  // 班级需要数据
  const [claName, setClaName] = useState<{ BJMC: string; KSS: number; KCMC: string }>();
  // 表格数据
  const [dataSource, setDataScouse] = useState<any>([]);

  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      await initWXAgentConfig(['checkJsApi']);
    })();
  }, []);
  useEffect(() => {
    const id = '1abc6708-648e-4d7c-87cc-88f54e747a4f';
    // 获取班级已报名人数
    const resStudent = getEnrolled({ id });
    Promise.resolve(resStudent).then((data: any) => {
      if (data.status === 'ok') {
        const studentData = data.data;
        studentData?.map((item: any) => {
          item.isRealTo = '出勤';
          return '';
        });
        setDataScouse(studentData);
      }
    });

    // 获取课后班级数据
    const resClass = getKHBJSJ({ id });
    Promise.resolve(resClass).then((data) => {
      if (data.status === 'ok') {
        const name:
          | {
              BJMC: string;
              KSS: number;
              KCMC: string;
            }
          | undefined = {
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
    setAbsent(absentData.length);
    setComeClass(comeClassData.length);
  }, [dataSource]);
  const checkWorkInfo = [
    { shouldArrive: dataSource.length, text: '应到', key: 1 },
    { shouldArrive: comeClass, text: '出勤', key: 2 },
    // { shouldArrive: Data.leave, text: '请假', key: 3 },
    { shouldArrive: absent, text: '缺席', key: 4 },
  ];

  const onSwitchItem = (value: any, checked: boolean) => {
    const newData = [...dataSource];
    newData.map((item: any) => {
      if (item.id === value.id) {
        if (checked) {
          item.isRealTo = '出勤';
        } else {
          item.isRealTo = '缺席';
        }
      }
      return '';
    });

    setDataScouse(newData);
  };

  const onButtonClick = async () => {
    const value: any[] = [];
    dataSource.map((item: any) => {
      value.push({
        CQZT: item.isRealTo, // 出勤 / 缺席
        CQRQ: '2021-06-30', // 日期
        XSId: item.XSId, // 学生ID
        KHBJSJId: '1abc6708-648e-4d7c-87cc-88f54e747a4f', // 班级ID
        KHPKSJId: '3e3b6360-7780-4234-9c4f-5f93913e55e4', // 排课ID
      });
      return '';
    });
    const res = await createKHXSCQ(value);
    if (res.status === 'ok') {
      message.success('操作成功');
    }
    console.log('res', res);
  };
  const columns: any = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (text: string, record: any) => {
        return <WWOpenDataCom type="userName" openid={record.XSId} />;
      },
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
    // {
    //   title: '请假',
    //   dataIndex: 'isLeave',
    //   key: 'isLeave',
    //   align: 'center',
    //   width: '25%',
    //   render: (text: any)=>{
    //     return <div style={{color: text === '是' ? '#FF4D4D': '#999'}}>{text}</div>
    //   }
    // },
    {
      title: '到课',
      dataIndex: 'isRealTo',
      key: 'isRealTo',
      align: 'center',
      render: (text: string, record: any) => {
        return (
          <div key={record.id}>
            <SwitchIndex realTo={text} record={record} onSwitchItem={onSwitchItem} />
          </div>
        );
      },
    },
  ];
  return (
    <div className={styles.callTheRoll}>
      <div className={styles.classCourseName}>{claName?.KCMC}</div>
      <div className={styles.classCourseInfo}>
        {claName?.BJMC} ｜ 第 {Data.classCurrent}/{claName?.KSS} 课时
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
      <div className={styles.footerButton}>
        <Button style={{ width: '100%' }} type="primary" shape="round" onClick={onButtonClick}>
          确认点名
        </Button>
      </div>
    </div>
  );
};

export default CallTheRoll;
