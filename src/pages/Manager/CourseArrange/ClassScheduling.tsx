/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Select, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import type { DataSourceType } from '@/components/ExcelTable2';
// 封装的弹框组件
import PromptInformation from '@/components/PromptInformation';
import { theme } from '@/theme-default';
import { getAllXXSJPZ } from '@/services/after-class/xxsjpz';
import { getQueryString } from '@/utils/utils';
import styles from './index.less';
import { getAllXQSJ } from '@/services/after-class/xqsj';
import noJF from '@/assets/noJF.png';
import ExcelTable2 from '@/components/ExcelTable2';
import { getAllFJSJ } from '@/services/after-class/fjsj';
import TeacherSelect from '@/components/TeacherSelect';
import { getAllFJLX } from '@/services/after-class/fjlx';
import { getAllPK } from '@/services/after-class/khpksj';

const { Option } = Select;
type selectType = { label: string; value: string };

// 课程排课
const CourseScheduling = (
  props: {
    processingDatas: (data: any, timeData: any, week: any, bjId?: string | undefined) => any[]
    campus: any,
    setCampus: React.Dispatch<any>,
    campusId: string | undefined,
    setCampusId: React.Dispatch<React.SetStateAction<string | undefined>>
    curXNXQId: any,
    setCurXNXQId: React.Dispatch<any>,
    xXSJPZData: any,
    setXXSJPZData: React.Dispatch<any>,
    currentUser: any,
    termList: any,
    showDrawer: () => void,
    onExcelTableClick: (value: any, record: any) => void,
    pKiskai: boolean,
    setPKiskai: React.Dispatch<React.SetStateAction<boolean>>
    type?: string | undefined;
    Weeks: any;
  }) => {

  const { processingDatas, campus, setCampus, campusId, setCampusId, xXSJPZData, curXNXQId, setCurXNXQId, setXXSJPZData, currentUser, termList, onExcelTableClick, showDrawer, pKiskai, setPKiskai, type, Weeks } = props;

  // ExcelTable表格所需要的数据
  const [tableDataSource, setTableDataSource] = useState<DataSourceType>([]);
  // const [radioValue, setRadioValue] = React.useState(false);
  const radioValue = false;

  // 学期学年没有数据时提示的开关
  const [kai, setkai] = useState<boolean>(false);
  // const teacher = '';
  const [cdmcValue, setCdmcValue] = useState<any>();
  // 场地名称选择框的数据
  const [cdmcData, setCdmcData] = useState<selectType[] | undefined>([]);
  const [teacherId, setTeacherId] = useState<any>();
  // 场地类型
  const [dataLX, setDataLX] = useState<any>([]);
  const [CDLXId, setCDLXId] = useState<any>();
  const [weekNum, setWeekNum] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  // 排课数据信息
  const [oriSource, setOriSource] = useState<any>([]);

  // 控制学期学年数据提示框的函数
  const kaiguan = () => {
    setkai(false);
  };

  // 控制学期学年数据提示框的函数
  const onPkiskaiClick = () => {
    setPKiskai(false);
  };

  // 获取系统时间配置信息
  const getSysTime = async () => {
    // 查询所有课程的时间段
    const resultTime = await getAllXXSJPZ({
      XNXQId: curXNXQId,
      XXJBSJId: currentUser?.xxId,
      type: ['0'],
    });
    if (resultTime.status === 'ok') {
      const timeSlot = resultTime.data;
      if (timeSlot?.length) {
        setXXSJPZData(timeSlot);
      } else {
        setPKiskai(true);
      }
    }
  };

  // 场地类型
  const getCDLXData = async () => {
    const response = await getAllFJLX({
      name: '',
      XXJBSJId: currentUser?.xxId,
    });
    if (response.status === 'ok') {
      if (response.data && response.data.length > 0) {
        const newData: any = [].map.call(response.data, (item: RoomType) => {
          return {
            label: item.FJLX,
            value: item.id,
          };
        });
        setDataLX(newData);
      }
    }
  };
  // 场地数据
  const getCDData = async () => {
    const fjList = await getAllFJSJ({
      page: 1,
      pageSize: 0,
      name: '',
      lxId: CDLXId,
      XXJBSJId: currentUser?.xxId,
      xqId: campusId,
    });
    if (fjList.status === 'ok') {
      if (fjList.data?.rows && fjList.data?.rows?.length > 0) {
        const data: any = [].map.call(fjList.data.rows, (item: any) => {
          return { label: item.FJMC, value: item.id };
        });
        setCdmcData(data);
      }
    }
  };

  useEffect(() => {
    setCdmcData(undefined);
    getCDData();
  }, [CDLXId]);

  const columns: {
    title: string;
    dataIndex: string;
    key: string;
    align: 'center' | 'left' | 'right';
    width: number;
  }[] = [
      {
        title: '教学周',
        dataIndex: 'room',
        key: 'room',
        align: 'center',
        width: 100,
      },
      {
        title: '节次',
        dataIndex: 'course',
        key: 'course',
        align: 'center',
        width: 136,
      },
      {
        title: '周一',
        dataIndex: 'monday',
        key: 'monday',
        align: 'center',
        width: 136,
      },
      {
        title: '周二',
        dataIndex: 'tuesday',
        key: 'tuesday',
        align: 'center',
        width: 136,
      },
      {
        title: '周三',
        dataIndex: 'wednesday',
        key: 'wednesday',
        align: 'center',
        width: 136,
      },
      {
        title: '周四',
        dataIndex: 'thursday',
        key: 'thursday',
        align: 'center',
        width: 136,
      },
      {
        title: '周五',
        dataIndex: 'friday',
        key: 'friday',
        align: 'center',
        width: 136,
      },
      {
        title: '周六',
        dataIndex: 'saturday',
        key: 'saturday',
        align: 'center',
        width: 136,
      },
      {
        title: '周日',
        dataIndex: 'sunday',
        key: 'sunday',
        align: 'center',
        width: 136,
      },
    ];
  // 获取校区信息 默认选择第一个校区
  const getCampus = async () => {
    // 获取年级信息
    const XQ: { label: any; value: any }[] = [];
    // 获取校区数据
    const resXQ: any = await getAllXQSJ({ XXJBSJId: currentUser?.xxId });
    if (resXQ.status === 'ok') {
      resXQ.data?.forEach((item: any) => {
        XQ.push({
          label: item.XQMC,
          value: item.id,
        });
      });
      if (resXQ.data?.length) {
        const XQSJ = getQueryString('XQSJ');
        if (XQSJ !== null) {
          setCampusId(XQSJ);
        } else {
          // 设置默认选择第一个校区
          let id = XQ?.find((item: any) => item.label === '本校')?.value;
          if (!id) {
            id = XQ[0].value;
          }
          setCampusId(id);
        }
      }
      setCampus(XQ);
    }
  };

  // 初始化请求请求校区
  useEffect(() => {
    getCampus();
  }, []);

  // 根据学年学期ID 获取学年课程名称数据，和班级名称数据， 获取当前学校学年的学期的场地排课情况
  useEffect(() => {
    // const bjId = getQueryString('courseId');
    if (curXNXQId && campusId) {
      // 获取系统时间配置信息
      getSysTime();
      // 场地数据
      getCDData();
      // 场地类型数据
      getCDLXData();
    }
  }, [curXNXQId, campusId]);


  // 筛选之后 table 排课数据信息 刷新table
  useEffect(() => {
    if (xXSJPZData.length > 0) {
      const tableData = processingDatas(oriSource, xXSJPZData, weekNum);
      setTableDataSource(tableData);
    }
  }, [oriSource, weekNum]);

  // 获取课程班排课数据信息
  const CDgetPKData = async () => {
    const bjId = getQueryString('courseId');
    setLoading(true);
    const res = await getAllPK({
      XNXQId: curXNXQId,
      XXJBSJId: currentUser?.xxId,
      FJSJId: cdmcValue
    });
    if (res.status === 'ok') {
      if (bjId === null) {
        setOriSource(res.data);
      }
      setLoading(false);
    }
  };
  // 获取行政班排课数据信息
  const JSgetPKData = async () => {
    const bjId = getQueryString('courseId');
    setLoading(true);
    const res = await getAllPK({
      XNXQId: curXNXQId,
      XXJBSJId: currentUser?.xxId,
      JZGJBSJId: teacherId,
    });
    if (res.status === 'ok') {
      if (bjId === null) {
        setOriSource(res.data);
      }
      setLoading(false);
    }
  };
  // 根据学年学期ID 获取学年课程名称数据，和班级名称数据， 获取当前学校学年的学期的场地排课情况
  useEffect(() => {
    if (curXNXQId && campusId) {
      // 排课数据
      if (type === '场地课表' && cdmcValue) {
        CDgetPKData();
      } else if (type === '教师课表' && teacherId) {
        JSgetPKData();
      }
    }
  }, [curXNXQId, campusId, cdmcValue, type, teacherId]);

  return (
    <>
      {/* 弹框提示 */}
      <PromptInformation
        text="未查询到学年学期数据，请设置学年学期后再来"
        link="/basicalSettings/termManagement"
        open={kai}
        colse={kaiguan}
      />
      <PromptInformation
        text="该学年学期未查询到排课时段数据，请先设置排课时段"
        link="/basicalSettings/periodMaintenance"
        open={pKiskai}
        colse={onPkiskaiClick}
      />
      <Spin spinning={loading}>
        {/* 默认state的来回切换 新增排课与排课管理页面 */}
        {/* {state === true ? ( */}
        <div>
          <div className={styles.SearchBoxs} >
            {/* 渲染的是四个选项框组件 */}
            <Row>
              <Col span={6}>
                <div className={styles.SearchBox}>
                  <label>学年学期：</label>
                  <Select
                    value={curXNXQId}
                    onChange={(value: string) => {
                      setCurXNXQId(value);
                      setCdmcValue(undefined);
                    }}
                  >
                    {termList?.map((item: any) => {
                      return (
                        <Option key={item.value} value={item.value}>
                          {item.text}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
              </Col>
              <Col span={1}> </Col>
              <Col span={6}>
                <div className={styles.SearchBox}>
                  <label>校区：</label>
                  <Select
                    value={campusId}
                    onChange={(value: string) => {
                      setCampusId(value);
                      setCdmcValue(undefined);
                    }}
                  >
                    {campus?.map((item: any) => {
                      return (
                        <Option key={item.value} value={item.value}>
                          {item.label}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
              </Col>
              <Col span={1}> </Col>
              <Col span={6}>
                {
                  type === '教师课表' ? <div className={styles.SearchBox}>
                    <label>教师姓名：</label>
                    <TeacherSelect
                      // value={ }
                      // isjg true 为机构课程 主班为单选 1 为校内课程 2为校外课程
                      type={1}
                      multiple={false}
                      xxId={currentUser?.xxId}
                      kcId={undefined}
                      onChange={(value: any) => {
                        setTeacherId(value)
                      }}
                    />
                  </div> : <></>
                }
                {
                  type === '场地课表' ? <div className={styles.SearchBox}>
                    <label>场地类型：</label>
                    <Select
                      value={CDLXId}
                      allowClear
                      placeholder="请选择"
                      onChange={(value) => {
                        setCdmcValue(undefined);
                        setCdmcData([]);
                        setCDLXId(value);
                      }}
                    >
                      {dataLX?.map((item: selectType) => {
                        return (
                          <Option value={item.value} key={item.value}>
                            {item.label}
                          </Option>
                        );
                      })}
                    </Select>
                  </div> : <></>
                }
              </Col>
            </Row>
            <Row>
              {
                type === '场地课表' ?
                  <>
                    <Col span={6}>
                      <div className={styles.SearchBox} style={{ marginTop: 10 }}>
                        <label>场地名称：</label>
                        <Select
                          value={cdmcValue}
                          allowClear
                          placeholder="请选择"
                          onChange={(value) => setCdmcValue(value)}
                        >
                          {cdmcData?.map((item: selectType) => {
                            return (
                              <Option value={item.value} key={item.value}>
                                {item.label}
                              </Option>
                            );
                          })}
                        </Select>
                      </div>
                    </Col>
                    <Col span={1}> </Col></>
                  : <></>}
              <Col span={6}>
                <div className={styles.SearchBox} style={{ marginTop: 10 }}>
                  <label>教学周：</label>
                  <Select
                    allowClear
                    value={weekNum?.toString()}
                    placeholder="请选择"
                    onChange={(value: string) => {
                      if (value) {
                        setWeekNum([value])
                      } else {
                        setWeekNum(undefined)
                      }
                    }}
                  >
                    {Weeks?.map((item: any) => {
                      return (
                        <Option value={item} >
                          {item}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
              </Col>
            </Row>

            {/*  添加新的课程 路由跳转 */}
            <div style={{ position: 'absolute', right: 0, top: 0 }}>
              <Button
                style={{ background: theme.btnPrimarybg, borderColor: theme.btnPrimarybg }}
                type="primary"
                key="add"
                onClick={() => showDrawer()}
              >
                {/* 加号组件 */}
                <PlusOutlined />
                新增排课
              </Button>
            </div>
          </div>
          {/* 课程表组件 */}
          {(type === '场地课表' && cdmcValue) || (type === '教师课表' && teacherId) ? (
            <ExcelTable2
              className={''}
              columns={columns}
              dataSource={tableDataSource}
              switchPages={showDrawer}
              onExcelTableClick={onExcelTableClick}
              radioValue={radioValue}
              bjmcValue=''
              xXSJPZData={xXSJPZData}
              KbType={type}
              style={{
                height: weekNum === undefined ? 'calc(100vh - 360px)' : 'auto',
              }}
            />
          ) : (
            <div className={styles.noDate}>
              {' '}
              <img src={noJF} alt="" /> <p> {type === '场地课表' ? '请选择场地' : '请选择教师'}查看课表</p>{' '}
            </div>
          )}

        </div>
      </Spin>

    </>
  );
};
export default CourseScheduling;
