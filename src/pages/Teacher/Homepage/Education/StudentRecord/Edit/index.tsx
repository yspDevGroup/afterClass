/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import React, { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { Modal, Switch, Tooltip, Space, message } from 'antd';
import { initWXAgentConfig, initWXConfig, showUserName } from '@/utils/wx';
import { enHenceMsg } from '@/utils/utils';
import GoBack from '@/components/GoBack';
import { getEnrolled, getKHBJSJ, getSerEnrolled } from '@/services/after-class/khbjsj';
import { getAllKHXSQJ } from '@/services/after-class/khxsqj';
import { getAllKHXSCQ } from '@/services/after-class/khxscq';
import styles from './index.less';
import ShowName from '@/components/ShowName';
import { ParentHomeData } from '@/services/local-services/mobileHome';
import MobileCon from '@/components/MobileCon';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { createKHKQXG } from '@/services/after-class/khkqxg';

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
        disabled={true}
      />
    </div>
  );
};

type claNameType = {
  BJMC?: string;
  KSS?: number;
  KCMC?: string;
  ISFW?: string;
};

const Edit = (props: any) => {
  const userRef = useRef(null);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
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
  // 考勤更改状态
  const [swtChecked, setSwtChecked] = useState<boolean>(true);

  const { bjId, jcId, date } = props.location.state;
  const userId = currentUser?.JSId || testTeacherId;
  const pkDate = date?.replace(/\//g, '-'); // 日期

  const getData = async (type?: string) => {
    setDataScouse([]);
    // 查询学生所有课后服务出勤记录
    const resAll = await getAllKHXSCQ({
      bjId: bjId || undefined, // 班级ID
      CQRQ: pkDate, // 日期
      XXSJPZId: jcId,
    });
    if (resAll.status === 'ok') {
      const allData = resAll.data;
      // allData 有值时已点过名
      if (allData?.length) {
        allData.forEach((item: any) => {
          item.isLeave = item.CQZT === '请假';
          item.isRealTo = item.CQZT;
        });
        setDataScouse(allData);
      } else {
        const resLeave = await getAllKHXSQJ({
          XNXQId: '',
          KHBJSJId: bjId,
          QJRQ: pkDate,
        });
        let resStudent;
        if (type) {
          // 获取班级已报名人数
          resStudent = await getSerEnrolled({ id: bjId || '' });
        } else {
          // 获取班级已报名人数
          resStudent = await getEnrolled({ id: bjId || '' });
        }
        if (resStudent.status === 'ok') {
          const studentData = resStudent.data;
          const leaveInfo = resLeave?.data?.rows || [];
          studentData?.forEach((item: any) => {
            const leaveItem = leaveInfo?.find(
              (val: API.KHXSQJ) => val.XSJBSJ?.id === item.XSJBSJId,
            );
            const leaveJudge = leaveItem && leaveItem?.QJZT !== 1;
            item.isRealTo = leaveJudge ? '缺席' : '出勤';
            item.isLeave = !!leaveJudge;
            item.leaveYY = leaveItem?.QJYY;
          });
          setDataScouse(studentData);
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
      const oriData = await ParentHomeData(
        'teacher',
        currentUser?.xxId,
        currentUser?.JSId || testTeacherId,
      );
      const { courseSchedule } = oriData;
      const classInfo = courseSchedule.find((item: { KHBJSJId: string }) => {
        return item.KHBJSJId === bjId;
      });
      if (classInfo) {
        const { days, detail } = classInfo;
        const curDate = days?.find((it: { day: any }) => it.day === date);
        setCurNum(curDate?.index + 1);
        const name: claNameType = {
          BJMC: detail?.[0]?.BJMC || '',
          KSS: detail?.[0]?.KSS || 0,
          KCMC: detail?.[0].title || '',
          ISFW: classInfo.ISFW,
        };
        setClaName(name);
        if (classInfo.ISFW) {
          getData('special');
        } else {
          getData();
        }
      } else {
        const res = await getKHBJSJ({
          id: bjId,
        });
        if (res.status === 'ok') {
          const { data } = res;
          setClaName({
            KCMC: data.KHKCSJ.KCMC,
            BJMC: data.BJMC,
            KSS: data.KSS,
            ISFW: data.ISFW,
          });
          if (data.ISFW && data.ISFW === 1) {
            getData('special');
          } else {
            getData();
          }
        } else {
          getData();
        }
      }
    })();
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
      if (item?.XSJBSJ?.id === value?.XSJBSJ?.id) {
        if (checked) {
          item.isRealTo = '出勤';
        } else {
          item.isRealTo = '缺席';
        }
      }
    });
    setDataScouse(newData);
  };

  const columns: any = [
    {
      title: '姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
      render: (test: any, record: any) => {
        return (
          <ShowName type="userName" openid={record?.XSJBSJ?.WechatUserId} XM={record?.XSJBSJ?.XM} />
        );
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
      title: '考勤情况',
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
    <MobileCon>
      <div className={styles.callTheRoll} id="DM">
        <GoBack title="学生考勤变更" teacher onclick="/teacher/education/studentRecord/apply" />
        <div className={styles.classCourseName}>{claName?.KCMC}</div>
        <div className={styles.classCourseInfo}>
          {claName?.BJMC} {/* ${claName?.KSS ? '/ ' + claName?.KSS : ''} */}
          {curNum ? `｜第 ${curNum}  课时` : ''}
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
          <ProTable<any>
            dataSource={dataSource}
            columns={columns}
            actionRef={actionRef}
            rowKey="id"
            pagination={{
              defaultPageSize: 5,
              defaultCurrent: 1,
              pageSizeOptions: ['5'],
              showQuickJumper: false,
              showSizeChanger: false,
              showTotal: undefined,
            }}
            rowSelection={{}}
            tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
              <Space size={12}>
                <span style={{ verticalAlign: 'middle' }}>
                  考勤：
                  <Switch
                    checkedChildren="出勤"
                    unCheckedChildren="缺席"
                    defaultChecked={true}
                    onChange={(checked) => setSwtChecked(checked)}
                  />
                </span>
                <span>
                  已选 {selectedRowKeys.length} 项
                  <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                    取消选择
                  </a>
                </span>
              </Space>
            )}
            tableAlertOptionRender={({ selectedRows, onCleanSelected }) => {
              return (
                <Space size={16}>
                  <a
                    onClick={() => {
                      Modal.confirm({
                        title: '考勤更改确认',
                        icon: <ExclamationCircleOutlined />,
                        width: '80%',
                        centered: true,
                        content: (
                          <div
                            style={{ lineHeight: '30px', textIndent: '2em', paddingTop: '12px' }}
                          >
                            您已选择{selectedRows?.length}名学生，是否确认统一更改学生考勤为
                            <span style={{ fontWeight: 'bold', fontSize: 16, padding: '0 4px' }}>
                              {swtChecked ? '出勤' : '缺席'}
                            </span>
                            状态？
                          </div>
                        ),
                        className: styles.editModal,
                        okText: '确认',
                        cancelText: '取消',
                        onOk: async () => {
                          let stuName = '';
                          const stu: any = [].map.call(selectedRows, (item: any, index: number) => {
                            if (index < 2) {
                              stuName +=
                                (index === 1 ? '、' : '') +
                                item?.XSJBSJ?.XM +
                                (index === 1 ? '等' : '');
                            }
                            return {
                              SRCCQZT: item?.CQZT,
                              NOWCQZT: swtChecked ? '出勤' : '缺席',
                              XSJBSJId: item?.XSJBSJ?.id,
                            };
                          });

                          const res = await createKHKQXG({
                            CQRQ: date,
                            /** 申请人ID */
                            SQRId: userId,
                            SQBZXX: stuName + '的考勤变更申请',
                            /** 节次ID */
                            XXSJPZId: jcId,
                            /** 班级ID */
                            KHBJSJId: bjId,
                            /** 学校ID */
                            XXJBSJId: currentUser?.xxId,
                            students: stu,
                          });
                          if (res.status === 'ok') {
                            message.success('学生考勤变更申请成功');
                            onCleanSelected();
                            if (claName?.ISFW && claName?.ISFW === '1') {
                              getData('special');
                            } else {
                              getData();
                            }
                          }
                        },
                      });
                    }}
                  >
                    批量更改
                  </a>
                </Space>
              );
            }}
            search={false}
            options={{
              setting: false,
              fullScreen: false,
              density: false,
              reload: false,
            }}
          />
        </div>
      </div>
    </MobileCon>
  );
};

export default Edit;
