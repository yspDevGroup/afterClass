/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { Table, Button, Switch, message, notification } from 'antd';
import { getEnrolled, getKHBJSJ } from '@/services/after-class/khbjsj';
import { createKHXSCQ, getAllKHXSCQ } from '@/services/after-class/khxscq';
import { theme } from '@/theme-default';
import styles from './index.less';
import { enHenceMsg } from '@/utils/utils';
import GoBack from '@/components/GoBack';


/**
 * 课堂点名
 * @returns
 */

const SwitchIndex: any = (props: {
  butDis: boolean;
  realTo: any;
  record: number;
  onSwitchItem: (value: any, checked?: boolean, refc?: any) => void;
}) => {
  const { realTo, record, onSwitchItem, butDis } = props;
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
        disabled={butDis}
      />
    </div>
  );
};

type claNameType = {
  BJMC?: string;
  KSS?: number;
  KCMC?: string;
};

const CallTheRoll = (props: any) => {
  // '缺席'
  const [absent, setAbsent] = useState<number>(0);
  // '出勤'
  const [comeClass, setComeClass] = useState<number>(0);
  // 班级需要数据
  const [claName, setClaName] = useState<claNameType>();
  // 表格数据
  const [dataSource, setDataScouse] = useState<any>([]);
  const [butDis, setButDis] = useState<boolean>(false);
  // 获取当前日期
  const nowDate = new Date();
  const { pkid, bjids, date, kjs, sj } = props.location.state;
  const pkDate = date?.replace(/\//g, '-'); // 日期
  const wxad: any = []
  sj.forEach((item: any) => {
    if (new Date(pkDate) > new Date(item)) {
      wxad.push(item)
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
      // allData 有值时已点过名
      if (allData && allData?.length > 0) {
        notification.warning({
          message: '',
          description:
            '本节课已点名,请勿重复操作',
          duration: 3,
        });
        setButDis(true);
        allData.forEach((item: any) => {
          item.isRealTo = item.CQZT;
        })
        setDataScouse(allData);
      } else {
        const nowSta = (nowDate.getTime() - new Date(pkDate).getTime()) / 7 / 24 / 60 / 60 / 1000;
        const futureSta = (nowDate.getTime() - new Date(pkDate).getTime()) < 0;
        // 获取班级已报名人数
        const resStudent = getEnrolled({ id: bjids || '' });
        Promise.resolve(resStudent).then((data: any) => {
          if (data.status === 'ok') {
            const studentData = data.data;
            studentData?.forEach((item: any) => {
              item.isRealTo = '出勤';
            });
            setDataScouse(studentData);
            setButDis(nowSta >= 1 || futureSta);
            if (nowSta >= 1) {
              notification.warning({
                message: '',
                description:
                  '本节课因考勤超时已默认点名',
                duration: 3,
              });
            }
            if (futureSta) {
              notification.warning({
                message: '',
                description:
                  '本节课尚未开始点名',
                duration: 3,
              });
            }
          }
        });
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
    { shouldArrive: absent, text: '缺席', key: 4 },
  ];

  const onSwitchItem = (value: any, checked: boolean) => {
    const newData = [...dataSource];
    newData.forEach((item: any) => {
      if (item.XSId === value.XSId) {
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
        XSXM: item.XSXM // 学生姓名
      });
    });
    const res = await createKHXSCQ(value);
    if (res.status === 'ok') {
      message.success('点名成功');
      history.push('/teacher/home?index=education');
    } else {
      enHenceMsg(res.message);
    }
  };
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
      title: '到课',
      dataIndex: 'isRealTo',
      key: 'isRealTo',
      align: 'center',
      render: (text: string, record: any) => {
        return (
          <div key={record.id}>
            <SwitchIndex realTo={text} record={record} onSwitchItem={onSwitchItem} butDis={butDis} />
          </div>
        );
      },
    },
  ];
  return (
    <div className={styles.callTheRoll}>
      <GoBack title='课堂点名' teacher onclick='/teacher/home?index=education' />
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
      <div className={styles.footerButton}>
        <Button
          style={{ background: theme.primaryColor, borderColor: theme.primaryColor, width: '100%' }}
          type="primary"
          shape="round"
          onClick={onButtonClick}
          className={butDis ? styles.disabl : styles.xuanzhong}
          disabled={butDis}
        >
          确认点名
        </Button>
      </div>
    </div>
  );
};

export default CallTheRoll;
