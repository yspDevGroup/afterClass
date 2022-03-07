import React, { useEffect, useState } from 'react';
import { Button, Input, Radio, Select, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import type { DataSourceType } from '@/components/ExcelTable';
import ExcelTable from '@/components/ExcelTable';
// 封装的弹框组件
import PromptInformation from '@/components/PromptInformation';
import { theme } from '@/theme-default';
import { getAllFJSJ, getFJPlan } from '@/services/after-class/fjsj';
import { getAllXXSJPZ } from '@/services/after-class/xxsjpz';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getQueryString } from '@/utils/utils';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import AddArranging from './components/AddArranging';
import styles from './index.less';
import { getAllCourses } from '@/services/after-class/khkcsj';
import { getAllXQSJ } from '@/services/after-class/xqsj';
import { useModel } from 'umi';

import { getAllClasses, getKHBJSJ } from '@/services/after-class/khbjsj';
import SearchLayout from '@/components/Search/Layout';

const { Option } = Select;
const { Search } = Input;
type selectType = { label: string; value: string };

// 课程排课
const CourseScheduling = () => {
  // 校区
  const [campus, setCampus] = useState<any>([]);
  const [campusId, setCampusId] = useState<string>();

  const [state, setState] = useState(true);
  const [curXNXQId, setCurXNXQId] = useState<any>();

  const [termList, setTermList] = useState<any>();

  // 排课数据信息
  const [oriSource, setOriSource] = useState<any>([]);
  // 筛选所用到的数据
  const [screenOriSource, setScreenOriSource] = useState<any>([]);

  // ExcelTable表格所需要的数据
  const [tableDataSource, setTableDataSource] = useState<DataSourceType>([]);
  const [radioValue, setRadioValue] = React.useState(false);
  const [xXSJPZData, setXXSJPZData] = useState<any>([]);
  const [recordValue, setRecordValue] = useState<any>({});

  // 学期学年没有数据时提示的开关
  const [kai, setkai] = useState<boolean>(false);
  // 排课时段的提示开关
  const [pKiskai, setPKiskai] = useState<boolean>(false);
  // 课程选择框的数据
  const [kcmcData, setKcmcData] = useState<selectType[] | undefined>([]);
  const [kcmcValue, setKcmcValue] = useState<any>();
  // 班级名称选择框的数据
  const [bjmcData, setBjmcData] = useState<selectType[] | undefined>([]);
  const [bjmcValue, setBjmcValue] = useState<any>();
  const [teacher, setTeacher] = useState<any>();
  // 场地名称选择框的数据
  const [cdmcData, setCdmcData] = useState<selectType[] | undefined>([]);
  const [cdmcValue, setCdmcValue] = useState<any>();

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [loading, setLoading] = useState<boolean>(false);

  // 控制学期学年数据提示框的函数
  const kaiguan = () => {
    setkai(false);
  };

  // 控制学期学年数据提示框的函数
  const onPkiskaiClick = () => {
    setPKiskai(false);
  };

  const showDrawer = () => {
    // 打开编辑页面
    setState(false);
    // 将选中的单元格数据清空 以免新增时数据又回显
    setRecordValue({ XQ: campusId });
  };

  /**
   * 把接口返回的数据处理成ExcelTable组件所需要的
   * @param data  接口返回的数据
   * @param timeData  课程时间段数据
   * @param bjId 班级id
   * @returns
   */
  const processingData = (data: any, timeData: any, bjId: string | undefined = undefined) => {
    // console.log('拼接数据');
    // setLoading(true);
    const week = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const tableData: any[] = [];
    const sameClassData: any[] = [];
    if (!timeData.length) {
      setPKiskai(true);
    } else {
      data.map((item: any) => {
        timeData.map((timeItem: any, timeKey: number) => {
          const table = {
            room: {
              cla: item?.FJMC,
              teacher: '',
              jsId: item.id,
              FJLXId: item?.FJLX?.id, // 场地类型ID
              rowspan: timeKey === 0 ? timeData?.length : 0,
            },
            course: {
              cla: timeItem?.TITLE,
              teacher: `${timeItem?.KSSJ?.slice(0, 5)} — ${timeItem?.JSSJ?.slice(0, 5)}`,
              hjId: timeItem?.id,
            },
          };
          if (item?.KHPKSJs?.length) {
            item.KHPKSJs.map((KHItem: any) => {
              if (KHItem?.XXSJPZId === timeItem?.id) {
                const currentTeacher = KHItem?.KHBJSJ?.KHBJJs?.find(
                  (items: any) => items?.JSLX === '主教师',
                );
                table[week[KHItem?.WEEKDAY]] = {
                  weekId: KHItem?.id, // 周
                  cla: KHItem?.KHBJSJ?.BJMC, // 班级名称
                  teacher: currentTeacher?.JZGJBSJ?.XM, // 主教师
                  teacherWechatId: currentTeacher?.JZGJBSJ?.WechatUserId, // 主教师微信用户ID
                  teacherID: currentTeacher?.JZGJBSJId, // 主教师ID
                  bjId: KHItem?.KHBJSJ?.id, // 班级ID
                  kcId: KHItem?.KHBJSJ?.KHKCSJ?.id, // 课程ID
                  njId: KHItem?.KHBJSJ?.KHKCSJ?.NJSJs?.[0]?.id, // 年级ID
                  bjzt: KHItem?.KHBJSJ?.BJZT, // 班级状态
                  xqId: KHItem?.KHBJSJ?.XQSJ?.id, // 校区ID
                  color: KHItem?.KHBJSJ?.KHKCSJ?.KBYS || 'rgba(62, 136, 248, 1)',
                  // dis: BJID
                  //   ? !(BJID === KHItem?.KHBJSJ?.id)
                  //   : !(recordValue?.BJId === KHItem?.KHBJSJ?.id),
                  dis: bjId !== KHItem?.KHBJSJ?.id,
                };
                if (
                  bjId === KHItem?.KHBJSJ?.id
                  // (!BJID && recordValue?.BJId === KHItem?.KHBJSJ?.id) ||
                  // (BJID && BJID === KHItem?.KHBJSJ?.id)
                ) {
                  sameClassData.push({
                    WEEKDAY: KHItem?.WEEKDAY, // 周
                    XXSJPZId: KHItem?.XXSJPZId, // 时间ID
                    KHBJSJId: KHItem?.KHBJSJ?.id, // 班级ID
                    FJSJId: item.id, // 教室ID
                    XNXQId: KHItem?.XNXQId, // 学年学期ID
                  });
                }
              }
            });
          }
          tableData.push(table);
        });
      });
    }
    return tableData;
  };

  // 筛选已有未有
  const onRadioChange = (e: any) => {
    setRadioValue(e.target.value);
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

  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      await initWXAgentConfig(['checkJsApi']);
    })();
    const bjId = getQueryString('courseId');
    const XQSJId = getQueryString('XQSJ');
    if (bjId !== null) {
      // console.log('1传参');
      (async () => {
        const njInfo = await getKHBJSJ({ id: bjId });
        if (njInfo.status === 'ok') {
          setRecordValue({
            BJId: njInfo.data.id,
            NJ: njInfo.data.KHKCSJ.NJSJs[0].id,
            KC: njInfo.data.KHKCSJId,
            KCMC: njInfo.data.KHKCSJ.KCMC,
            XQ: XQSJId,
          });
          setState(false);
        }
      })();
    }
  }, []);

  const columns: {
    title: string;
    dataIndex: string;
    key: string;
    align: 'center' | 'left' | 'right';
    width: number;
  }[] = [
    {
      title: '场地',
      dataIndex: 'room',
      key: 'room',
      align: 'center',
      width: 100,
    },
    {
      title: '时间',
      dataIndex: 'course',
      key: 'course',
      align: 'left',
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
   * 获取Excel表格中数据的方法
   * @param value 在type="edit" 的时候使用；选中将要排课的班级的数据
   * @param record 获取点击某个单元格的所有数据
   */
  const onExcelTableClick = (value: any, record: any) => {
    setRecordValue({ ...record, XQ: campusId });
  };

  /**
   *  筛选数据 根据 课程名称Id 课程班名称Id 教师名称主副班主任, 场地名称Id
   * @param valueScreenOriSource  需要筛选的数据
   */
  const getScreenOriSource = (valueScreenOriSource: any) => {
    // console.log('筛选，true');
    // 加载中
    // setLoading(true);

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
        return newDataSource.filter((item: any) => item.id === cdmcValue);
      }
      return newDataSource;
    };
    // 筛选课程名称
    const screenKC = (dataSource2: any) => {
      const newDataSource = [...dataSource2];
      if (kcmcValue) {
        newDataSource.forEach((item: any) => {
          const { KHPKSJs } = item;
          if (KHPKSJs?.length > 0) {
            item.KHPKSJs = KHPKSJs?.filter(
              (KHPKSJ: any) => KHPKSJ?.KHBJSJ?.KHKCSJ?.id === kcmcValue,
            );
          }
        });
        return newDataSource;
      }
      return newDataSource;
    };
    // 筛选课程班名称
    const screenBJ = (dataSource3: any) => {
      const newDataSource = [...dataSource3];
      if (bjmcValue) {
        newDataSource.forEach((item: any) => {
          const { KHPKSJs } = item;
          if (KHPKSJs?.length > 0) {
            item.KHPKSJs = KHPKSJs?.filter((KHPKSJ: any) => KHPKSJ?.KHBJSJId === bjmcValue);
          }
        });
        return newDataSource;
      }
      return newDataSource;
    };
    // 筛选教师(名称)
    const screenJSMC = (dataSource4: any) => {
      const newDataSource = [...dataSource4];

      if (teacher) {
        newDataSource.forEach((item: any) => {
          const { KHPKSJs } = item;
          // console.log('KHPKSJs',KHPKSJs)
          if (KHPKSJs?.length > 0) {
            item.KHPKSJs = KHPKSJs?.filter((KHPKSJ: any) => {
              // console.log('KHPKSJ',KHPKSJ)
              // 主教名称
              const jsxm = KHPKSJ?.KHBJSJ?.KHBJJs?.[0]?.JZGJBSJ?.XM;
              console.log('教师姓名', jsxm);
              if (jsxm) {
                return jsxm.indexOf(teacher) != -1;
              }
              return false;
            });
          }
        });
        return newDataSource;
      }
      return newDataSource;
    };

    newArr = screenRadio(newArr);
    newArr = screenCD(newArr);
    newArr = screenKC(newArr);
    newArr = screenBJ(newArr);
    newArr = screenJSMC(newArr);
    return newArr;
  };

  // 获取排课数据信息
  const getPKData = async () => {
    const bjId = getQueryString('courseId');
    console.log('获取排课true');
    setLoading(true);
    const res = await getFJPlan({
      isPk: false,
      XNXQId: curXNXQId,
      XXJBSJId: currentUser?.xxId,
      xqId: campusId,
    });
    if (res.status === 'ok') {
      // 设置初始排课数据
      setScreenOriSource(res.data);
      // 设置table展示的排课数据
      if (bjId === null) {
        setOriSource(res.data);
      }
      // console.log('获取排课flase',);
      setLoading(false);
    }
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
  // 选择校区后选择学年学期
  const getXNXQData = async () => {
    const xnxq = getQueryString('xnxqid');
    const res = await queryXNXQList(currentUser?.xxId);
    const newData = res.xnxqList;
    const curTerm = res.current;
    if (newData?.length) {
      if (curTerm) {
        if (xnxq === null) {
          setCurXNXQId(curTerm.id);
        } else {
          setCurXNXQId(xnxq);
        }
        setTermList(newData);
      }
    } else {
      setkai(true);
    }
  };
  // 获取课程信息
  const getKCData = async () => {
    const khkcResl = await getAllCourses({
      // 学校Id
      XXJBSJId: currentUser?.xxId,
      // 学年学期Id
      XNXQId: curXNXQId,
      /** 页数 */
      page: 0,
      /** 每页记录数 */
      pageSize: 0,
    });
    if (khkcResl.status === 'ok') {
      const KCMC = khkcResl.data.rows?.map((item: any) => ({
        label: item.KCMC,
        value: item.id,
      }));
      setKcmcData(KCMC);
    }
  };

  // 获取课程对应课程班数据信息
  const getBjData = async () => {
    // console.log('获取课程true',);
    setLoading(true);
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
      // console.log('获取课程false',);
      setLoading(false);
    }
  };

  const getCDData = async () => {
    const fjList = await getAllFJSJ({
      page: 1,
      pageSize: 0,
      name: '',
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

  // 初始化请求请求校区
  useEffect(() => {
    getCampus();
  }, []);
  // 获取学年学期信息 默认选择第一个学年
  useEffect(() => {
    if (campusId) {
      getXNXQData();
    }
  }, [campusId]);

  // 根据学年学期ID 获取学年课程名称数据，和班级名称数据， 获取当前学校学年的学期的场地排课情况
  useEffect(() => {
    const bjId = getQueryString('courseId');
    if (curXNXQId && campusId) {
      console.log('============');
      // 获取系统时间配置信息
      getSysTime();
      if (bjId === null) {
        // 课程名称数据
        getBjData();
        // 课程班数据
        getKCData();
      }
      // 场地数据
      getCDData();
      // 排课数据
      getPKData();
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
  }, [teacher, cdmcValue, kcmcValue, bjmcValue, radioValue]);

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
    console.log('oriSource', xXSJPZData);
    if (xXSJPZData.length > 0) {
      console.log('oriSource', oriSource);
      const tableData = processingData(oriSource, xXSJPZData);
      setTableDataSource(tableData);
      // setLoading(false);
    }
  }, [oriSource]);

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
        {state === true ? (
          <div>
            {/* 渲染的是四个选项框组件 */}
            <div className={styles.searchWrapper}>
              <SearchLayout>
                <div>
                  <label>所属校区：</label>
                  <Select
                    value={campusId}
                    style={{ width: 160 }}
                    onChange={(value: string) => {
                      setCampusId(value);

                      setCdmcValue(undefined);
                      setKcmcValue(undefined);
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
                <div>
                  <label>所属学年学期：</label>
                  <Select
                    value={curXNXQId}
                    style={{ width: 160 }}
                    onChange={(value: string) => {
                      setCurXNXQId(value);
                      setKcmcValue(undefined);
                      setCdmcValue(undefined);
                      setKcmcValue(undefined);
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
                <div>
                  <label>课程名称：</label>
                  <Select
                    style={{ width: 160 }}
                    value={kcmcValue}
                    allowClear
                    placeholder="请选择"
                    onChange={(value) => {
                      setKcmcValue(value);
                      // 已经选择的内容清除
                      setBjmcValue(undefined);
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
                </div>
                <div>
                  <label>课程班名称：</label>
                  <Select
                    style={{ width: 160 }}
                    value={bjmcValue}
                    allowClear
                    placeholder="请选择"
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
                </div>
                <div>
                  <label>教师姓名：</label>
                  <Search
                    allowClear
                    style={{ width: 160 }}
                    onSearch={(value) => {
                      setTeacher(value);
                    }}
                  />
                </div>
                <div>
                  <label>场地名称：</label>
                  <Select
                    style={{ width: 160 }}
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
              </SearchLayout>
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
            {/* 场地排课情况 单选按钮组件 */}
            <div style={{ padding: '24px 0 0 24px' }}>
              <span>场地排课情况：</span>
              <span>
                <Radio.Group onChange={onRadioChange} value={radioValue} style={{ marginLeft: 8 }}>
                  <Radio value={false}>全部</Radio>
                  <Radio value={true}>已有</Radio>
                </Radio.Group>
              </span>
            </div>
            {/* 课程表组件 */}
            <ExcelTable
              className={''}
              columns={columns}
              dataSource={tableDataSource}
              switchPages={showDrawer}
              onExcelTableClick={onExcelTableClick}
              radioValue={radioValue}
              style={{
                height: 'calc(100vh - 360px)',
              }}
            />
          </div>
        ) : (
          // AddArranging 组件是新增排课页面
          screenOriSource.length && (
            <AddArranging
              campus={campus}
              campusId={campusId}
              curXNXQId={curXNXQId}
              xXSJPZData={xXSJPZData}
              cdmcData={cdmcData}
              screenOriSource={screenOriSource}
              processingData={processingData}
              setState={setState}
              formValues={recordValue}
              kcmcData={kcmcData}
              currentUser={currentUser}
              setLoading={setLoading}
            />
          )
        )}
      </Spin>
    </>
  );
};
export default CourseScheduling;
