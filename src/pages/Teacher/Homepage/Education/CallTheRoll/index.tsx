/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import React, { useEffect, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import { Modal, Table, Button, Switch, message, notification, Tooltip } from 'antd';
import { initWXAgentConfig, initWXConfig, showUserName } from '@/utils/wx';
import { enHenceMsg } from '@/utils/utils';
import GoBack from '@/components/GoBack';
import { getAllKHXSQJ } from '@/services/after-class/khxsqj';
import { getEnrolled, getKHBJSJ, } from '@/services/after-class/khbjsj';
import { createKHJSCQ, getAllKHJSCQ } from '@/services/after-class/khjscq';
import { createKHXSCQ, getAllKHXSCQ, getArrangement } from '@/services/after-class/khxscq';

import { theme } from '@/theme-default';
import styles from './index.less';
import WWOpenDataCom from '@/components/WWOpenDataCom';
import { ParentHomeData } from '@/services/local-services/mobileHome';

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
  // 当前课节数
  const [curNum, setCurNum] = useState<number>(0);
  // '缺席'
  const [absent, setAbsent] = useState<number>(0);
  const [leaveData, setLeaveData] = useState<number>(0);
  // '出勤'
  const [comeClass, setComeClass] = useState<number>(0);
  // 班级需要数据
  const [claName, setClaName] = useState<claNameType>();
  // 表格数据
  const [dataSource, setDataScouse] = useState<any>([]);
  // 当前课堂的排课ID
  const [pkId, setPkId] = useState<string>(props.location.state?.pkId);
  // 教师签到(undone,done,doing,todo,)
  const [btnDis, setBtnDis] = useState<string>('doing');
  // 学生点名(undone,done,doing,todo,)
  const [butDis, setButDis] = useState<string>('todo');
  // 获取当前日期
  const nowDate = new Date();
  const { bjId, jcId, date } = props.location.state;
  const pkDate = date?.replace(/\//g, '-'); // 日期

  const showConfirm = (tm?: boolean, title?: string, content?: string) => {
    let secondsToGo = 3;
    const modal = Modal.success({
      centered: true,
      title: tm ? '签到成功' : title,
      content: tm ? ` ${secondsToGo} 秒之后可以开始点名` : content,
    });
    if (tm) {
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
    } else {
      setTimeout(() => {
        modal.destroy();
      }, secondsToGo * 1000);
    }
  };
  const getData = async () => {
    // 计算签到或点名时间与当前时间的间隔（以周为单位）
    const nowSta = (nowDate.getTime() - new Date(pkDate).getTime()) / 7 / 24 / 60 / 60 / 1000;
    const futureSta = nowDate.getTime() - new Date(pkDate).getTime() < 0;
    // 查询教师出勤记录
    const resCheck = await getAllKHJSCQ({
      KHBJSJId: bjId,
      JZGJBSJId: currentUser.JSId || testTeacherId,
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
      bjId: bjId || undefined, // 班级ID
      CQRQ: pkDate, // 日期
      pkId: pkId || undefined, // 排课ID
    });
    if (resAll.status === 'ok') {
      const allData = resAll.data;
      // allData 有值时已点过名
      if (allData?.length) {
        notification.warning({
          message: '',
          description: '本节课已点名,请勿重复操作',
          duration: 4,
        });
        allData.forEach((item: any) => {
          item.isLeave = item.CQZT === '请假';
          item.isRealTo = item.CQZT;
        });
        setButDis('done');
        setDataScouse(allData);
      } else {
        if (resCheck?.data?.length) {
          setButDis('doing');
        }
        const resLeave = await getAllKHXSQJ({
          XNXQId: '',
          KHBJSJId: bjId,
          QJRQ: pkDate,
        });
        // 获取班级已报名人数
        const resStudent = await getEnrolled({ id: bjId || '' });
        if (resStudent.status === 'ok') {
          const studentData = resStudent.data;
          const leaveInfo = resLeave?.data?.rows || [];
          studentData?.forEach((item: any) => {
            const leaveItem = leaveInfo?.find((val: API.KHXSQJ) => val.XSJBSJ?.id === item.XSJBSJId);
            const leaveJudge = leaveItem && leaveItem?.QJZT !== 1;
            item.isRealTo = leaveJudge ? '缺席' : '出勤';
            item.isLeave = !!leaveJudge;
            item.leaveYY = leaveItem?.QJYY;
          });
          setDataScouse(studentData);
          if (nowSta >= 1) {
            setButDis('undone');
            showConfirm(false, '课堂点名', '本节课因考勤超时已默认点名');
          }
          if (futureSta) {
            setButDis('undo');
            notification.warning({
              message: '',
              description: '本节课尚未开始点名',
              duration: 4,
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
        WWOpenData?.bindAll(document.querySelectorAll('ww-open-data'));
      }
    })();
  }, [currentUser]);
  useEffect(() => {
    (async () => {
      if (pkId === undefined) {
        const res = await getArrangement({
          DATE: pkDate,
          KHBJSJId: bjId,
          XXSJPZId: jcId
        });
        if (res.status === 'ok') {
          setPkId(res.data?.id);
        }
      }
    })()
  }, [pkId]);
  useEffect(() => {
    (async () => {
      const oriData = await ParentHomeData('teacher', currentUser?.xxId, currentUser.JSId || testTeacherId);
      const { courseSchedule } = oriData;
      const classInfo = courseSchedule.find((item: { KHBJSJId: string; }) => {
        return item.KHBJSJId === bjId
      });
      if (classInfo) {
        const { days, detail } = classInfo;
        const curDate = days?.find((it: { day: any; }) => it.day === date);
        setCurNum(curDate?.index + 1);
        const name: claNameType = {
          BJMC: detail?.[0]?.BJMC || '',
          KSS: detail?.[0]?.KSS || 0,
          KCMC: detail?.[0].title || '',
        };
        setClaName(name);
      } else {
        const res = await getKHBJSJ({
          id: bjId
        });
        if (res.status === 'ok') {
          const { data } = res;
          setClaName({
            KCMC: data.KHKCSJ.KCMC,
            BJMC: data.BJMC,
            KSS: data.KSS,
          })
        }
      }
      getData();
    })()
  }, []);
  useEffect(() => {
    const absentData = dataSource.filter((item: any) => item.isRealTo === '缺席');
    const comeClassData = dataSource.filter((item: any) => item.isRealTo === '出勤');
    const lData = dataSource.filter((item: any) => item.isLeave === true);
    setLeaveData(lData.length);
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
      if (item.XSJBSJId === value.XSJBSJId) {
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
        XSJBSJId: item.XSJBSJId, // 学生ID
        KHBJSJId: bjId, // 班级ID
        KHPKSJId: pkId, // 排课ID
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
  const teacherCheckIn = async () => {
    const res = await createKHJSCQ([
      {
        XXSJPZId: jcId,
        JZGJBSJId: currentUser.JSId || testTeacherId,
        CQZT: '出勤',
        CQRQ: pkDate,
        KHBJSJId: bjId,
      },
    ]);
    if (res.status === 'ok') {
      showConfirm(true);
      setBtnDis('done');
    } else {
      message.error(res.message);
    }
  };
  const columns: any = [
    {
      title: '姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
      render: (test: any, record: any) => {
        const showWXName = record?.XSJBSJ?.XM === '未知' && record?.XSJBSJ?.WechatUserId;
        if (showWXName) {
          return <WWOpenDataCom type="userName" openid={record?.XSJBSJ.WechatUserId} />;
        }
        return record?.XSJBSJ?.XM;
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
    {
      title: '请假',
      dataIndex: 'isLeave',
      key: 'isLeave',
      align: 'center',
      render: (text: string, record: any) => {
        return text ? (
          <Tooltip title={record.leaveYY} trigger="click">
            <span style={{ color: 'red' }}>是</span>
          </Tooltip>
        ) : (
          <span>否</span>
        );
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
            <SwitchIndex
              realTo={text}
              record={record}
              onSwitchItem={onSwitchItem}
              butDis={butDis !== 'doing'}
            />
          </div>
        );
      },
    },
  ];
  return (
    <div className={styles.callTheRoll}>
      <GoBack title="课堂点名" teacher onclick="/teacher/home?index=education" />
      <div className={styles.rollHeader}>
        <div>
          <b>
            <span ref={userRef}>
              {currentUser?.UserId === '未知' && currentUser.wechatUserId ? (
                <WWOpenDataCom type="userName" openid={currentUser.wechatUserId} />
              ) : (
                currentUser?.UserId
              )}</span>
            老师
          </b>
          <span>
            <Button onClick={teacherCheckIn} disabled={btnDis !== 'doing'}>
              {btnDis === 'done' ? '已' : btnDis === 'undone' ? '未' : '立即'}签到
            </Button>
          </span>
        </div>
      </div>
      <div className={styles.classCourseName}>{claName?.KCMC}</div>
      <div className={styles.classCourseInfo}>
        {claName?.BJMC} {curNum ? `｜第 ${curNum}/${claName?.KSS} 课时` : ''}
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
          scroll={{ y: 'calc(100vh - 345px)' }}
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
          {butDis === 'done' ? '已' : butDis === 'undone' ? '已默认' : '确认'}点名
        </Button>
      </div>
    </div>
  );
};

export default CallTheRoll;
