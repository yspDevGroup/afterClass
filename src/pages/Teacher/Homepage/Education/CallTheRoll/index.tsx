/* eslint-disable no-param-reassign */
import React, { useEffect, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import { Modal, Table, Button, Switch, message, notification, Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { initWXAgentConfig, initWXConfig, showUserName } from '@/utils/wx';
import { enHenceMsg } from '@/utils/utils';
import GoBack from '@/components/GoBack';
import { getAllKHXSQJ } from '@/services/after-class/khxsqj';
import { getEnrolled, getKHBJSJ } from '@/services/after-class/khbjsj';
import { createKHJSCQ, getAllKHJSCQ } from '@/services/after-class/khjscq';
import { createKHXSCQ, getAllKHXSCQ } from '@/services/after-class/khxscq';

import { theme } from '@/theme-default';
import styles from './index.less';

const { confirm } = Modal;
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
  const userRef = useRef(null);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // '缺席'
  const [absent, setAbsent] = useState<number>(0);
  const [leaveData, setLeaveData] = useState<number>(0);
  // '出勤'
  const [comeClass, setComeClass] = useState<number>(0);
  // 班级需要数据
  const [claName, setClaName] = useState<claNameType>();
  // 表格数据
  const [dataSource, setDataScouse] = useState<any>([]);
  // 教师签到(undone,done,doing,todo,)
  const [btnDis, setBtnDis] = useState<string>('doing');
  // 学生点名(undone,done,doing,todo,)
  const [butDis, setButDis] = useState<string>('todo');
  // 获取当前日期
  const nowDate = new Date();
  const { pkid, bjids, date, kjs, sj } = props.location.state;
  const pkDate = date?.replace(/\//g, '-'); // 日期
  const wxad: any = [];
  sj.forEach((item: any) => {
    if (new Date(pkDate) > new Date(item)) {
      wxad.push(item);
    }
  });
  const getData = async () => {
    // 计算签到或点名时间与当前时间的间隔（以周为单位）
    const nowSta = (nowDate.getTime() - new Date(pkDate).getTime()) / 7 / 24 / 60 / 60 / 1000;
    const futureSta = (nowDate.getTime() - new Date(pkDate).getTime()) < 0;
    // 查询教师出勤记录
    const resCheck = await getAllKHJSCQ({
      KHBJSJId: bjids,
      KHJSSJId: currentUser.JSId || '1965a118-4b5b-4b58-bf16-d5f45e78b28c',
      CQRQ: pkDate,
    });
    if (resCheck.status === 'ok') {
      // data 有值时已点过名
      if (resCheck?.data?.length) {
        setBtnDis('done');
      } else if (nowSta >= 1) {
        setBtnDis('undone');
      } else if (futureSta) {
        setBtnDis('todo');
      }
    } else {
      enHenceMsg(resCheck.message);
    }

    // 查询学生所有课后服务出勤记录
    const resAll = await getAllKHXSCQ({
      bjId: bjids || undefined, // 班级ID
      CQRQ: pkDate, // 日期
      pkId: pkid || undefined, // 排课ID
    });
    if (resAll.status === 'ok') {
      const allData = resAll.data;
      // allData 有值时已点过名
      if (allData?.length) {
        notification.warning({
          message: '',
          description:
            '本节课已点名,请勿重复操作',
          duration: 3,
        });
        allData.forEach((item: any) => {
          item.isLeave = item.CQZT === '请假' ? true : false;
          item.isRealTo = item.CQZT;
        })
        setButDis('done');
        setDataScouse(allData);
      } else {
        if(resCheck?.data?.length){
          setButDis('doing');
        }
        const resLeave = await getAllKHXSQJ({
          XNXQId: '',
          KHBJSJId: bjids,
          QJRQ: pkDate
        });
        // 获取班级已报名人数
        const resStudent = await getEnrolled({ id: bjids || '' });
        if (resStudent.status === 'ok') {
          const studentData = resStudent.data;
          const leaveInfo = resLeave?.data?.rows || [];
          studentData?.forEach((item: any) => {
            const leaveItem = leaveInfo?.find((val) => val.XSId === item.XSId);
            const leaveJudge = leaveItem?.QJZT!=1;
            item.isRealTo = leaveJudge ? '缺席' : '出勤';
            item.isLeave = leaveJudge ? true : false;
            item.leaveYY = leaveItem?.QJYY;
          });
          setDataScouse(studentData);
          if (nowSta >= 1) {
            setButDis('undone');
            notification.warning({
              message: '',
              description:
                '本节课因考勤超时已默认点名',
              duration: 3,
            });
          }
          if (futureSta) {
            setButDis('undo');
            notification.warning({
              message: '',
              description:
                '本节课尚未开始点名',
              duration: 3,
            });
          }
        }
      }
    } else {
      enHenceMsg(resAll.message);
    }
  };
  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      if (await initWXAgentConfig(['checkJsApi'])) {
        showUserName(userRef?.current, currentUser?.UserId);
        // 注意: 只有 agentConfig 成功回调后，WWOpenData 才会注入到 window 对象上面
        WWOpenData.bindAll(document.querySelectorAll('ww-open-data'));
      }
    })();
  }, [currentUser]);
  useEffect(() => {
    getData();
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
        CQZT: item.isLeave ? '请假' : item.isRealTo, // 出勤 / 缺席
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
  const showConfirm = () => {
    let secondsToGo = 3;
    const modal = Modal.success({
      centered: true,
      title: '签到成功',
      content: ` ${secondsToGo} 秒之后可以开始点名`,
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: `${secondsToGo} 秒之后可以开始点名`,
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      setButDis('doing');
      modal.destroy();
    }, secondsToGo * 1000);
  }
  const teacherCheckIn = async () => {
    const res = await createKHJSCQ([{
      KHJSSJId: currentUser.JSId || '1965a118-4b5b-4b58-bf16-d5f45e78b28c',
      CQZT: '出勤',
      CQRQ: pkDate,
      KHBJSJId: bjids
    }]);
    if (res.status === 'ok') {
      showConfirm();
      setBtnDis('done');
    } else {
      message.error(res.message)
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
      title: '请假',
      dataIndex: 'isLeave',
      key: 'isLeave',
      align: 'center',
      render: (text: string, record: any) => {
        return text ? <Tooltip title={record.leaveYY} trigger='click'>
          <span style={{ color: 'red' }}>是</span>
        </Tooltip> : <span>否</span>;
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
            <SwitchIndex realTo={text} record={record} onSwitchItem={onSwitchItem} butDis={butDis !== 'doing'} />
          </div>
        );
      },
    },
  ];
  return (
    <div className={styles.callTheRoll}>
      <GoBack title='课堂点名' teacher onclick='/teacher/home?index=education' />
      <div className={styles.rollHeader}>
        <div>
          <b>
            <span ref={userRef}>
              {currentUser?.UserId}
            </span>
            老师
          </b>
          <span>
            <Button onClick={teacherCheckIn} disabled={btnDis !== 'doing'}>{btnDis === 'done' ? '已' : (btnDis === 'undone' ? '未' : '立即')}签到</Button>
          </span>
        </div>
      </div>
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
          disabled={butDis !== 'doing'}
        >
          {butDis === 'done' ? '已' : (butDis === 'undone' ? '已默认' : '确认')}点名
        </Button>
      </div>

    </div>
  );
};

export default CallTheRoll;
