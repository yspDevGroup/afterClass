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

import { getAllClasses } from '@/services/after-class/khbjsj';
import SearchLayout from '@/components/Search/Layout';
// import { getAllPK } from '@/services/after-class/khpksj';
import noJF from '@/assets/noJF.png';
import ExcelTable2 from '@/components/ExcelTable2';
import { getAllGrades } from '@/services/after-class/khjyjg';
import { getAllBJSJ } from '@/services/after-class/bjsj';

const { Option } = Select;
type selectType = { label: string; value: string };

// 课程排课
const CourseScheduling = (
  props: {
    state: boolean,
    setState: React.Dispatch<React.SetStateAction<boolean>>,
    setRecordValue: React.Dispatch<any>,
    kcmcData: selectType[] | undefined
    setKcmcData: React.Dispatch<React.SetStateAction<selectType[] | undefined>>,
    processingDatas: (data: any, timeData: any, week: any, bjId?: string | undefined) => any[]
    campus: any,
    setCampus: React.Dispatch<any>,
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    campusId: string | undefined,
    setCampusId: React.Dispatch<React.SetStateAction<string | undefined>>
    curXNXQId: any,
    setCurXNXQId: React.Dispatch<any>,
    xXSJPZData: any,
    setXXSJPZData: React.Dispatch<any>,
    screenOriSource: any,
    setScreenOriSource: React.Dispatch<any>,
    currentUser: any,
    TimeData: any,
    termList: any,
    oriSource: any,
    setOriSource: React.Dispatch<any>,
    showDrawer: () => void,
    onExcelTableClick: (value: any, record: any) => void,
    pKiskai: boolean,
    setPKiskai: React.Dispatch<React.SetStateAction<boolean>>
    type?: string | undefined;
    Weeks: any;
  }) => {

  const { state, kcmcData, processingDatas, campus, setCampus, loading, setLoading, campusId, setCampusId, xXSJPZData, curXNXQId, setCurXNXQId, setXXSJPZData, screenOriSource, currentUser, termList, oriSource, setOriSource, onExcelTableClick, showDrawer, pKiskai, setPKiskai, type, Weeks } = props;

  // ExcelTable表格所需要的数据
  const [tableDataSource, setTableDataSource] = useState<DataSourceType>([]);
  // const [radioValue, setRadioValue] = React.useState(false);
  const radioValue = false;

  // 学期学年没有数据时提示的开关
  const [kai, setkai] = useState<boolean>(false);
  // 课程选择框的数据
  const [kcmcValue, setKcmcValue] = useState<any>();
  // 班级名称选择框的数据
  const [bjmcData, setBjmcData] = useState<selectType[] | undefined>([]);
  const [bjmcValue, setBjmcValue] = useState<any>([]);
  const teacher = '';
  const [cdmcValue, setCdmcValue] = useState<any>();
  const [njValue, setNjValue] = useState<any>();
  // 年级
  const [grade, setGrade] = useState<any>([]);
  const [bjData, setBjData] = useState<any>([]);
  // 行政班 名称筛选
  const [XZBId, setXZBId] = useState<string>();
  const [XZBData, setXZBData] = useState<any[]>();
  const [weekNum, setWeekNum] = useState<any>();

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

  /**
   *  筛选数据 根据 课程名称Id 课程班名称Id 教师名称主副班主任, 场地名称Id
   * @param valueScreenOriSource  需要筛选的数据
   */
  const getScreenOriSource = (valueScreenOriSource: any) => {
    const _obj = JSON.stringify(valueScreenOriSource);
    let newArr = JSON.parse(_obj);
    //
    const screenRadio = (dataSource0: any) => {
      const newDataSource = [...dataSource0];
      if (radioValue) {
        return newDataSource?.filter((item: any) => item?.KHPKSJs?.length > 0);
      }
      return newDataSource;
    };
    // 筛选场地方法
    const screenCD = (dataSource1: any) => {
      const newDataSource = [...dataSource1];
      if (cdmcValue) {
        return newDataSource.filter((item: any) => item.FJSJId === cdmcValue);
      }
      return newDataSource;
    };
    // 筛选课程名称
    const screenKC = (dataSource2: any) => {
      const newDataSource = [...dataSource2];
      if (kcmcValue) {
        return newDataSource.filter((item: any) => item?.KHBJSJ?.KHKCSJ?.id === kcmcValue);
      }
      return newDataSource;
    };
    // 筛选课程班名称
    const screenBJ = (dataSource3: any) => {
      const newDataSource = [...dataSource3];
      if (bjmcValue?.length) {
        const FilterData = (a: any, b: any) => {
          const result = new Array();
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < a.length; i++) {
            if (b.indexOf(a[i]?.KHBJSJId) !== -1) {
              result.push(a[i]);
            }
          }
          return result;
        };
        return FilterData(newDataSource, bjmcValue);
      }
      return newDataSource;
    };
    // 筛选行政班
    const screenXZB = (dataSource4: any) => {
      const newDataSource = [...dataSource4];
      if (XZBId) {
        const newdata = newDataSource.filter((item: any) => {
          if (item?.KHBJSJ?.BJSJs?.find((items: any) => items?.id === XZBId)) {
            return item
          }
          return ''
        });
        return newdata;
      }
      return newDataSource;
    };

    newArr = screenRadio(newArr);
    newArr = screenCD(newArr);
    newArr = screenKC(newArr);
    newArr = screenBJ(newArr);
    newArr = screenXZB(newArr);
    return newArr;
  };

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


  // 获取课程对应课程班数据信息
  const getBjData = async () => {
    const bjmcResl = await getAllClasses({
      page: 0,
      pageSize: 0,
      KHKCSJId: kcmcValue,
      XNXQId: curXNXQId,
      XQSJId: campusId,
    });
    if (bjmcResl.status === 'ok') {
      const BJMC = bjmcResl.data.rows?.map((item: any) => ({
        label: item.BJMC,
        value: item.id,
      }));
      setBjmcData(BJMC);
    }
  };

  // 获取年级信息
  const getGradeData = () => {
    const response = getAllGrades({ XD: currentUser?.XD?.split(',') });
    Promise.resolve(response).then((res: any) => {
      if (res.status === 'ok') {
        const optNJ: any[] = [];
        const nj = ['幼儿园', '小学', '初中', '高中'];
        nj.forEach((itemNJ) => {
          res.data?.forEach((item: any) => {
            if (item.XD === itemNJ) {
              optNJ.push({
                label: `${item.XD}${item.NJMC}`,
                value: item.id,
              });
            }
          });
        });
        setGrade(optNJ);
      }
    });
  };

  // 获取行政班
  const getXZB = async () => {
    const res = await getAllBJSJ({ XQSJId: campusId, njId: njValue, page: 0, pageSize: 0 });
    if (res.status === 'ok') {
      const data = res.data?.rows?.map((item: any) => {
        return { label: item.BJ, value: item.id };
      });
      setXZBData(data);
    }
  };

  // 初始化请求获取年级信息
  useEffect(() => {
    if (type === '行政班课表') {
      getGradeData();
    }
  }, [type]);

  useEffect(() => {
    if (njValue) {
      setXZBId(undefined);
      getXZB();
    }
  }, [njValue]);

  // 初始化请求请求校区
  useEffect(() => {
    getCampus();
  }, []);

  // 根据学年学期ID 获取学年课程名称数据，和班级名称数据， 获取当前学校学年的学期的场地排课情况
  useEffect(() => {
    const bjId = getQueryString('courseId');
    if (curXNXQId && campusId) {
      // 获取系统时间配置信息
      getSysTime();
      if (bjId === null) {
        // 课程名称数据
        getBjData();
        // 课程班数据
        // getKCData();
      }
      // 场地数据
      // getCDData();
      // 排课数据
      // getPKData();
    }
  }, [curXNXQId, campusId]);

  // 监听课程名称 发生改变时 刷新课程班数据
  useEffect(() => {
    const bjId = getQueryString('courseId');
    if (curXNXQId) {
      if (bjId === null) {
        getBjData();
      }
    }
  }, [kcmcValue]);

  useEffect(() => {
    const bjId = getQueryString('courseId');
    if (bjId === null && screenOriSource && screenOriSource.length > 0) {
      // 筛选数据
      const screenData = getScreenOriSource(screenOriSource);
      setOriSource(screenData);
    }
  }, [teacher, cdmcValue, kcmcValue, bjmcValue, radioValue, XZBId]);

  // 切换主页 和编辑页时刷新场地排课情况
  useEffect(() => {
    if (state) {
      if (screenOriSource && screenOriSource.length > 0) {
        // 筛选数据
        const screenData = getScreenOriSource(screenOriSource);
        setOriSource(screenData);
      }
    }
  }, [state]);

  // 筛选之后 table 排课数据信息 刷新table
  useEffect(() => {
    if (xXSJPZData.length > 0) {
      const tableData = processingDatas(oriSource, xXSJPZData, weekNum);
      setTableDataSource(tableData);
    }
  }, [oriSource, weekNum]);


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
        <div >
          {/* 渲染的是四个选项框组件 */}
          <div className={styles.SearchBoxs}>
            <Row>
              <Col span={6}> <div className={styles.SearchBox}>
                <label>学年学期：</label>
                <Select
                  value={curXNXQId}
                  onChange={(value: string) => {
                    setCurXNXQId(value);
                    setKcmcValue(undefined);
                    setCdmcValue(undefined);
                    setKcmcValue(undefined);
                    setBjmcValue([]);
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
              </div></Col>
              <Col span={1}> </Col>
              <Col span={6}>  <div className={styles.SearchBox}>
                <label>校区：</label>
                <Select
                  value={campusId}
                  onChange={(value: string) => {
                    setCampusId(value);
                    setCdmcValue(undefined);
                    setKcmcValue(undefined);
                    setBjmcValue([]);
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
              </div></Col>
              <Col span={1}> </Col>
              <Col span={6}>
                {
                  type === '课程班课表' ? <div className={styles.SearchBox}>
                    <label>课程：</label>
                    <Select
                      value={kcmcValue}
                      allowClear
                      placeholder="请选择"
                      onChange={(value) => {
                        setKcmcValue(value);
                        // 已经选择的内容清除
                        setBjmcValue([]);
                        setWeekNum(undefined)
                      }}
                    >
                      {kcmcData?.map((item: selectType) => {
                        if (item.value) {
                          return (
                            <Option value={item.value} key={item.value}>
                              {item.label}
                            </Option>
                          );
                        }
                        return '';
                      })}
                    </Select>
                  </div> : <></>
                }
                {
                  type === '行政班课表' ?
                    <>
                      <div className={styles.SearchBox}>
                        <label>年级：</label>
                        <Select
                          value={kcmcValue}
                          allowClear
                          placeholder="请选择"
                          onChange={(value) => {
                            setNjValue(value);
                            // 已经选择的内容清除
                            setXZBId(undefined);
                            setXZBData([]);
                            setWeekNum(undefined)
                          }}
                        >
                          {grade?.map((item: selectType) => {
                            if (item.value) {
                              return (
                                <Option value={item.value} key={item.value}>
                                  {item.label}
                                </Option>
                              );
                            }
                            return '';
                          })}
                        </Select>
                      </div></>
                    : <></>
                }
              </Col>
            </Row>
            {
              type === '课程班课表' ?
                <Row>
                  <Col span={13}>
                    <div className={styles.SearchBox} style={{ marginTop: 10 }}>
                      <label >课程班：</label>
                      <Select
                        mode="multiple"
                        allowClear
                        style={{ width: 'calc(100% - 70px)' }}
                        placeholder="请选择"
                        value={bjmcValue}
                        onChange={(value) => setBjmcValue(value)}
                      >
                        {bjmcData?.map((item: selectType) => {
                          return (
                            <Option value={item.value} key={item.value}>
                              {item.label}
                            </Option>
                          );
                        })}
                      </Select>
                    </div> </Col>
                  <Col span={1}> </Col>
                  <Col span={6}>
                    <div className={styles.SearchBox} style={{ marginTop: 10 }}>
                      <label>教学周：</label>
                      <Select
                        value={weekNum?.toString()}
                        allowClear
                        placeholder="请选择"
                        onChange={(value: string) => {
                          if(value){
                            setWeekNum([value])
                          }else{
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
                </Row> : <></>
            }
            {
              type === '行政班课表' ?
                <Row>
                  <Col span={6}>
                    <div className={styles.SearchBox} style={{ marginTop: 10 }}>
                      <label htmlFor="kcly">行政班：</label>
                      <Select
                        value={XZBId}
                        allowClear
                        placeholder="请选择"
                        onChange={(value: string) => {
                          setXZBId(value);
                        }}
                      >
                        {XZBData?.map((item: any) => {
                          return (
                            <Option value={item.value} key={item.value}>
                              {item.label}
                            </Option>
                          );
                        })}
                      </Select>
                    </div>
                  </Col>
                  <Col span={1}> </Col>
                  <Col span={6}>
                    <div className={styles.SearchBox} style={{ marginTop: 10 }}>
                      <label>教学周：</label>
                      <Select
                        allowClear
                        value={weekNum?.toString()}
                        placeholder="请选择"
                        onChange={(value: string) => {
                          if(value){
                            setWeekNum([value])
                          }else{
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
                </Row> : <></>
            }

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

          {(bjmcValue?.length && type === '课程班课表') || (XZBId && type === '行政班课表') ? (
            <ExcelTable2
              className={''}
              columns={columns}
              dataSource={tableDataSource}
              switchPages={showDrawer}
              onExcelTableClick={onExcelTableClick}
              radioValue={radioValue}
              bjmcValue={bjmcValue}
              xXSJPZData={xXSJPZData}
              KbType={type}
              style={{
                height: weekNum === undefined ? 'calc(100vh - 360px)' : 'auto',
              }}
            />
          ) : (
            <div className={styles.noDate}>
              {' '}
              <img src={noJF} alt="" /> <p>请选择{type === '课程班课表' ? '课程班' : "行政班"}查看课表</p>{' '}
            </div>
          )}


        </div>
      </Spin>

    </>
  );
};
export default CourseScheduling;
