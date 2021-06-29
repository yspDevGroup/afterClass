/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Table, Button, Switch, message, Modal } from 'antd';
import { getEnrolled, getKHBJSJ } from '@/services/after-class/khbjsj';
import WWOpenDataCom from '@/pages/Manager/ClassManagement/components/WWOpenDataCom';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import { createKHXSCQ, getAllKHXSCQ } from '@/services/after-class/khxscq';
import { theme } from '@/theme-default';
import { getQueryString } from '@/utils/utils';

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

type claNameType = {
  BJMC?: string;
  KSS?: number;
  KCMC?: string;
};

const CallTheRoll = () => {
  // '缺席'
  const [absent, setAbsent] = useState<number>(0);
  // '出勤'
  const [comeClass, setComeClass] = useState<number>(0);
  // 班级需要数据
  const [claName, setClaName] = useState<claNameType>();
  // 表格数据
  const [dataSource, setDataScouse] = useState<any>([]);
  const [butDis, setButDis] = useState<boolean>(false);

  const pkid = getQueryString('id'); // 排课ID
  const bjids = getQueryString('bjid'); // 班级ID
  const pkDate = getQueryString('date')?.replace(/\//g, '-'); // 日期
  const kjs = getQueryString('kjs'); // 课时数

  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      await initWXAgentConfig(['checkJsApi']);
    })();
  }, []);
  useEffect(() => {
    // 查询所有课后服务出勤记录
    const resAll = getAllKHXSCQ({
      bjId: bjids || undefined, // 班级ID
      CQRQ: pkDate, // 日期
      pkId: pkid || undefined, // 排课ID
    });
    Promise.resolve(resAll).then((datas) => {
      const allData = datas.data;
      // allData 有值时已点过名
      if (allData && allData?.length > 0) {
        Modal.warning({
          title: '本节课已点过名',
        });
        setButDis(true);
      }
    });
    // 获取班级已报名人数
    const resStudent = getEnrolled({ id: bjids || '' });
    Promise.resolve(resStudent).then((data: any) => {
      if (data.status === 'ok') {
        const studentData = data.data;
        studentData?.forEach((item: any) => {
          item.isRealTo = '出勤';
        });
        setDataScouse(studentData);
      }
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
    setAbsent(absentData.length);
    setComeClass(comeClassData.length);
  }, [dataSource]);
  const checkWorkInfo = [
    { shouldArrive: dataSource.length, text: '应到', key: 1 },
    { shouldArrive: comeClass, text: '到课', key: 2 },
    // { shouldArrive: Data.leave, text: '请假', key: 3 },
    { shouldArrive: absent, text: '缺席', key: 4 },
  ];

  const onSwitchItem = (value: any, checked: boolean) => {
    const newData = [...dataSource];
    newData.forEach((item: any) => {
      if (item.id === value.id) {
        if (checked) {
          item.isRealTo = '出勤';
        } else {
          item.isRealTo = '缺席';
        }
      }
    });

    setDataScouse(newData);
  };

  const onButtonClick = async () => {
    const value: any[] = [];
    dataSource.forEach((item: any) => {
      value.push({
        CQZT: item.isRealTo, // 出勤 / 缺席
        CQRQ: pkDate, // 日期
        XSId: item.XSId, // 学生ID
        KHBJSJId: bjids, // 班级ID
        KHPKSJId: pkid, // 排课ID
      });
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
        {claName?.BJMC} ｜ 第 {kjs}/{claName?.KSS} 课时
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
        <Button
          style={{ background: theme.primaryColor, borderColor: theme.primaryColor, width: '100%' }}
          type="primary"
          shape="round"
          onClick={onButtonClick}
          disabled={butDis}
        >
          确认点名
        </Button>
      </div>
    </div>
  );
};

export default CallTheRoll;
