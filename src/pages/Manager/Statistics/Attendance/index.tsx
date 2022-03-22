import PageContainer from '@/components/PageContainer';
import { Tabs, Spin, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import Table from './compoents/TableList';
import type { ProColumns } from '@ant-design/pro-table';
import {
  getTeachersAttendanceByDate,
  getStudentsAttendanceByDate,
  exportTeachersAttendanceByDate,
  exportStudentsAttendanceByDate,
} from '@/services/after-class/reports';

import personImg from '@/assets/person.png';
import classImg from '@/assets/class.png';
import normalImg from '@/assets/normal.png';
import abnormalImg from '@/assets/abnormal.png';
import allHoursImg from '@/assets/allHours.png';
import ShowName from '@/components/ShowName';

import { Link } from 'umi';
import moment, { isMoment } from 'moment';
import { getAllXXSJPZ } from '@/services/after-class/xxsjpz';
import FormSelect from './compoents/FormSelect';
import { DownloadOutlined } from '@ant-design/icons';

import Style from './index.less';

const { TabPane } = Tabs;
const LeaveManagement = () => {
  const [key, setKey] = useState<string>('1');
  const [curXNXQIdJS, setCurXNXQIdJS] = useState<any>();
  const [newDateJS, setNewDateJS] = useState<any[]>([]);
  const [JSXM, setJSXM] = useState<string>();
  const [curXNXQIdXS, setCurXNXQIdXS] = useState<any>();
  const [newDateXS, setNewDateXS] = useState<any[]>([]);
  const [XSXM, setXSXM] = useState<string>();
  // 学年学期列表数据
  const [dataSource, setDataSource] = useState<API.KHXSDD[] | undefined>([]);
  // 统计数据源
  const [collectData, setCollectData] = useState<any>();
  const [duration, setDuration] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const getDuration = async (id: string) => {
    const res = await getAllXXSJPZ({ XNXQId: id, type: ['0'] });
    if (res.status === 'ok') {
      const value: any = res?.data;
      if (value) {
        const date1 = moment(value[0]?.KSSJ, 'HH:mm:ss');
        const date2 = moment(value[0]?.JSSJ, 'HH:mm:ss');
        const date3 = date2.diff(date1, 'minute'); // 计算相差的分钟数
        setDuration(date3);
      }
    }
  };
  const teacher: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
      width: 58,
      fixed: 'left',
    },
    {
      title: '姓名',
      dataIndex: 'XM',
      key: 'XM',
      align: 'center',
      fixed: 'left',
      width: 100,
      render: (_, record) => (
        <ShowName type="userName" openid={record.WechatUserId} XM={record.XM} />
      ),
    },
    {
      title: '授课班级数',
      dataIndex: 'BJS',
      key: 'BJS',
      align: 'center',
      width: 110,
      render: (text, record) => record.bj_count,
    },
    {
      title: '已排课时总数',
      dataIndex: 'KSS',
      key: 'KSS',
      width: 120,
      align: 'center',
      render: (text, record) => record.all_KSS || 0,
    },
    {
      title: '出勤次数',
      dataIndex: 'CQS',
      key: 'CQS',
      align: 'center',
      width: 100,
      render: (text, record) => record.attendance || 0,
    },
    {
      title: '缺勤次数',
      dataIndex: 'QQS',
      key: 'QQS',
      align: 'center',
      width: 100,
      render: (_: any, record: any) => {
        return Number(record.absenteeism) + Number(record.leave) + Number(record.substitute) || 0;
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <>
          <Link
            to={{
              pathname: '/statistics/attendance/detail',
              state: {
                type: 'detail',
                data: record,
                XNXQId: curXNXQIdJS,
                position: '老师',
                startDate: newDateJS[0]?.format('YYYY-MM-DD'),
                endDate: newDateJS[1]?.format('YYYY-MM-DD'),
                duration,
              },
            }}
          >
            详情
          </Link>
        </>
      ),
    },
  ];
  const student: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
      width: 58,
      fixed: 'left',
    },
    {
      title: '姓名',
      dataIndex: 'XM',
      key: 'XM',
      align: 'center',
      fixed: 'left',
      width: 100,
      render: (_text: any, record: any) => (
        <ShowName type="userName" openid={record.WechatUserId} XM={record.XM} />
      ),
    },
    {
      title: '行政班名称',
      dataIndex: 'XZBJSJ',
      key: 'XZBJSJ',
      align: 'center',
      width: 120,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return `${record?.XD}${record?.NJMC}${record?.BJ}`;
      },
    },
    {
      title: '报名课程班数',
      dataIndex: 'bj_count',
      key: 'bj_count',
      align: 'center',
      width: 120,
    },
    {
      title: '出勤次数',
      dataIndex: 'attendance',
      key: 'attendance',
      align: 'center',
      width: 100,
      // render:(_,record)=>record
    },
    {
      title: '缺勤次数',
      dataIndex: 'absenteeism',
      key: 'absenteeism',
      align: 'center',
      width: 100,
      render: (_: any, record: any) => {
        return Number(record.absenteeism) + Number(record.leave);
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <>
          <Link
            to={{
              pathname: '/statistics/attendance/detail',
              state: {
                type: 'detail',
                data: record,
                XNXQId: curXNXQIdXS,
                position: '学生',
                startDate: newDateXS[0]?.format('YYYY-MM-DD'),
                endDate: newDateXS[1]?.format('YYYY-MM-DD'),
                duration,
              },
            }}
          >
            详情
          </Link>
        </>
      ),
    },
  ];
  const getDataSource = async (curXNXQId: string, newDate: any, name?: string) => {
    let startDate;
    let endDate;
    if (newDate.length > 0) {
      if (isMoment(newDate[0])) {
        startDate = newDate[0].format('YYYY-MM-DD');
      }
      if (isMoment(newDate[1])) {
        endDate = newDate[1].format('YYYY-MM-DD');
      }
    }
    const params = {
      XNXQId: curXNXQId,
      startDate,
      endDate,
    };
    let res;
    setLoading(true);
    if (key === '1') {
      setCurXNXQIdJS(curXNXQId);
      setNewDateJS(newDate);
      setJSXM(name);
      res = await getTeachersAttendanceByDate({ ...params, JSXM: name });
    } else {
      setCurXNXQIdXS(curXNXQId);
      setNewDateXS(newDate);
      setXSXM(name);
      res = await getStudentsAttendanceByDate({ ...params, XSXM: name });
    }
    if (res?.status === 'ok' && res.data) {
      const { rows, ...rest } = res.data;
      setLoading(false);
      setCollectData({ ...rest });
      setDataSource(rows);
    }
  };
  useEffect(() => {
    if (key === '1') {
      if (curXNXQIdJS) {
        getDataSource(curXNXQIdJS, newDateJS, JSXM);
      }
    } else if (curXNXQIdXS) {
      getDataSource(curXNXQIdXS, newDateXS, XSXM);
    }
  }, [key]);
  // 教师导出
  const onExportJSClick = async () => {
    let startDate;
    let endDate;
    if (newDateJS.length > 0) {
      if (isMoment(newDateJS[0])) {
        startDate = newDateJS[0].format('YYYY-MM-DD');
        // console.log('startDate',startDate);
      }
      if (isMoment(newDateJS[1])) {
        endDate = newDateJS[1].format('YYYY-MM-DD');
        // console.log('endDate',endDate);
      }
    }
    const params = {
      XNXQId: curXNXQIdJS,
      startDate,
      endDate,
      JSXM,
    };
    setLoading(true);
    const res = await exportTeachersAttendanceByDate(params);
    if (res?.status === 'ok') {
      setLoading(false);
      window.location.href = res.data;
    } else {
      setLoading(false);
      message.error(res.message);
    }
  };
  // 学生导出
  const onExportXSClick = async () => {
    setLoading(true);
    let startDate;
    let endDate;
    if (newDateXS.length > 0) {
      if (isMoment(newDateXS[0])) {
        startDate = newDateXS[0].format('YYYY-MM-DD');
      }
      if (isMoment(newDateXS[1])) {
        endDate = newDateXS[1].format('YYYY-MM-DD');
      }
    }
    const params = {
      XNXQId: curXNXQIdJS,
      startDate,
      endDate,
      XSXM,
    };
    const res = await exportStudentsAttendanceByDate(params);
    if (res?.status === 'ok') {
      setLoading(false);
      window.location.href = res.data;
    } else {
      setLoading(false);
      message.error(res.message);
    }
  };
  return (
    <PageContainer>
      <Spin spinning={loading}>
        <Tabs
          onChange={(value) => {
            setKey(value);
            setDataSource([]);
          }}
          defaultActiveKey={key}
        >
          <TabPane tab="教师考勤统计" key="1">
            <FormSelect
              getDataSource={getDataSource}
              type="teacher"
              exportButton={
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  style={{ float: 'right' }}
                  onClick={onExportJSClick}
                >
                  导出
                </Button>
              }
              getDuration={getDuration}
            />
            <div className={Style.TopCards}>
              <div>
                <div>
                  <span>
                    <img src={personImg} />
                  </span>
                  <div>
                    <h3>{collectData?.js_count || 0}</h3>
                    <p>考勤教师总数</p>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <span>
                    <img src={classImg} />
                  </span>
                  <div>
                    <h3>{collectData?.allJS_bj_count || 0}</h3>
                    <p>授课班级总数</p>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <span>
                    <img src={allHoursImg} />
                  </span>
                  <div>
                    <h3>{collectData?.allJS_KSS || 0}</h3>
                    <p>已排课时总数</p>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <span>
                    <img src={normalImg} />
                  </span>
                  <div>
                    <h3>{collectData?.allJS_attendance || 0}</h3>
                    <p>出勤总次数</p>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <span>
                    <img src={abnormalImg} />
                  </span>
                  <div>
                    <h3>
                      {collectData?.allJS_absenteeism +
                        collectData?.allJS_leave +
                        collectData?.allJS_substitute || 0}
                    </h3>
                    <p>缺勤总次数</p>
                  </div>
                </div>
              </div>
            </div>
            <Table TableList={{ position: '老师' }} dataSource={dataSource} columns={teacher} />
          </TabPane>
          <TabPane tab="学生考勤统计" key="2">
            <FormSelect
              getDataSource={getDataSource}
              type="student"
              exportButton={
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  style={{ float: 'right' }}
                  onClick={onExportXSClick}
                >
                  导出
                </Button>
              }
              getDuration={getDuration}
            />
            <div className={Style.TopCards}>
              <div>
                <div>
                  <span>
                    <img src={personImg} />
                  </span>
                  <div>
                    <h3>{collectData?.AllXS_count || 0}</h3>
                    <p>考勤学生总数</p>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <span>
                    <img src={classImg} />
                  </span>
                  <div>
                    <h3>{collectData?.AllXSBJ_count || 0}</h3>
                    <p>课程班总数</p>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <span>
                    <img src={normalImg} />
                  </span>
                  <div>
                    <h3>{collectData?.AllXSCQ_count || 0}</h3>
                    <p>出勤总次数</p>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <span>
                    <img src={abnormalImg} />
                  </span>
                  <div>
                    <h3>{collectData?.AllXSQQ_count || 0}</h3>
                    <p>缺勤总次数</p>
                  </div>
                </div>
              </div>
            </div>
            <Table TableList={{ position: '学生' }} dataSource={dataSource} columns={student} />
          </TabPane>
        </Tabs>
      </Spin>
    </PageContainer>
  );
};

export default LeaveManagement;
