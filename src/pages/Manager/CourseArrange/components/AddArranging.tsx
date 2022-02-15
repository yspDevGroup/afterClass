/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import { history } from 'umi';
import {
  Button,
  Form,
  message,
  Spin,
  Modal,
  Tooltip,
  Empty,
  Select,
  Card,
  Row,
  Col,
  Badge,
  Upload,
} from 'antd';
import ProForm, { ProFormSelect } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import {
  DownOutlined,
  QuestionCircleOutlined,
  UpOutlined,
  LeftOutlined,
  VerticalAlignBottomOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { getQueryString, getAuthorization } from '@/utils/utils';
import ExcelTable from '@/components/ExcelTable';
import ShowName from '@/components/ShowName';
import { createKHPKSJ, deleteKHPKSJ, addKHPKSJ, judgeKHPKSJ } from '@/services/after-class/khpksj';
// import { getFJPlan, getAllFJSJ } from '@/services/after-class/fjsj';
import { getAllClasses } from '@/services/after-class/khbjsj';
import type { DataSourceType } from '@/components/ExcelTable';
import { getAllGrades } from '@/services/after-class/khjyjg';
import { getAllCourses } from '@/services/after-class/khkcsj';

import { getAllPK } from '@/services/after-class/khpksj';
import styles from '../index.less';
import '../index.less';
import noJF from '@/assets/noJF.png';
import moment from 'moment';

const { Option } = Select;

const { confirm } = Modal;
type selectType = { label: string; value: string };

type PropsType = {
  setState?: any;
  curXNXQId?: string;
  processingData: (value: any, timeSlot: any, bjId: string | undefined) => void;
  formValues?: Record<string, any>;
  xXSJPZData?: any;
  campus?: any;
  cdmcData?: any[];
  kcmcData?: any[];
  currentUser?: API.CurrentUser | undefined;
  screenOriSource: any;
  setScreenOriSource: React.Dispatch<any>;
  setRqDisable: React.Dispatch<any>;
  setLoading: any;
  campusId: string | undefined;
  TimeData: any;
};

const AddArranging: FC<PropsType> = (props) => {
  const {
    screenOriSource,
    setScreenOriSource,
    curXNXQId,
    campus,
    xXSJPZData,
    currentUser,
    setState,
    processingData,
    formValues,
    setLoading,
    // setBJIDData,
    cdmcData,
    kcmcData,
    campusId,
    TimeData,
    setRqDisable
    // setTableDataSource,
    // sameClass,
    // tableDataSource,
  } = props;

  const [packUp, setPackUp] = useState(false);
  const [form] = Form.useForm();
  const [loading] = useState(false);
  const [CDLoading, setCDLoading] = useState(false);
  // const [XQID, setXQID] = useState<any>('');
  const [NJID, setNJID] = useState<any>(undefined);
  const [cdmcValue, setCdmcValue] = useState<any>();
  const [newTableDataSource, setNewTableDataSource] = useState<DataSourceType>([]);

  // 选择的班级的数据
  const [Bj, setBj] = useState<any>(undefined);
  // 请求的班级列表数据
  const [bjData, setBjData] = useState<any>([]);
  const [tearchId, setTearchId] = useState(undefined);
  const [kcType, setKcType] = useState<any>(kcmcData);
  // 年级
  const [grade, setGrade] = useState<any>([]);
  // 场地是否可以编辑
  const [CdFalg, setCdFalg] = useState<boolean>(false);
  // 导入
  const [uploadVisible, setUploadVisible] = useState<boolean>(false);
  // 导入排课后返回的冲突数据
  const [ImportData, setImportData] = useState<any>([]);
  // 课程班的课时数
  const [Class, setClass] = useState<any>();


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
        width: 66,
      },
      {
        title: '节次',
        dataIndex: 'course',
        key: 'course',
        align: 'left',
        width: 100,
      },
      {
        title: '周一',
        dataIndex: 'monday',
        key: 'monday',
        align: 'center',
        width: 100,
      },
      {
        title: '周二',
        dataIndex: 'tuesday',
        key: 'tuesday',
        align: 'center',
        width: 100,
      },
      {
        title: '周三',
        dataIndex: 'wednesday',
        key: 'wednesday',
        align: 'center',
        width: 100,
      },
      {
        title: '周四',
        dataIndex: 'thursday',
        key: 'thursday',
        align: 'center',
        width: 100,
      },
      {
        title: '周五',
        dataIndex: 'friday',
        key: 'friday',
        align: 'center',
        width: 100,
      },
      {
        title: '周六',
        dataIndex: 'saturday',
        key: 'saturday',
        align: 'center',
        width: 100,
      },
      {
        title: '周日',
        dataIndex: 'sunday',
        key: 'sunday',
        align: 'center',
        width: 100,
      },
    ];

  // 将排好的课程再次点击可以取消
  const getSelectdata = () => {
    // sameClassDatas.map((item: any, key: number) => {
    //   if (
    //     item.FJSJId === value.FJSJId && // 教室ID
    //     item.XXSJPZId === value.XXSJPZId && // 时间ID
    //     item.WEEKDAY === value.WEEKDAY // 周
    //   ) {
    //     sameClassDatas.splice(key, 1);
    //   }
    //   return item;
    // });
  };

  // 刷新Table
  const refreshTable = () => {
    if (screenOriSource) {
      const screenCD = (dataSource1: any) => {
        const newDataSource = [...dataSource1];
        if (cdmcValue) {
          return newDataSource.filter((item: any) => item.FJSJId === cdmcValue);
        }
        return newDataSource;
      };
      // 根据场地名称筛选出来 场地数据
      const newCDData = screenCD(screenOriSource);
      const newTableData: any = processingData(newCDData, xXSJPZData, Bj?.id);
      setNewTableDataSource(newTableData);
      setLoading(false);
    }
  };
  const getFirstDay = (date: any) => {
    const day = date.getDay() || 7;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - day);
  };
  const onExcelTableClick = async (value: any, record: any, pkData: any) => {
    // FJSJId 房间Id KHBJSJId: 课后班级数据
    // 如果value ===null 移除
    // xuyao改变的原始数据 screenOriSource
    setLoading(true);
    if (value) {
      // 添加 根据房间id
      const KHPKSJ: any = {
        FJSJId: cdmcValue,
        WEEKDAY: value.WEEKDAY,
        XNXQId: curXNXQId,
        KHBJSJId: value.KHBJSJId,
        XXSJPZId: value.XXSJPZId,
        PKTYPE: 0,
        RQ: pkData?.RQ,
        IsDSZ: pkData?.IsDSZ,
        PKBZ: pkData?.PKBZ,
      };
      let res: any;
      if (Class?.ISFW === 1) {
        res = await judgeKHPKSJ({
          XNXQId: Bj?.XNXQId,
          KHBJSJId: Bj?.KHBJSJId,
          KSS: Class?.KSS,
          startDate: moment(getFirstDay(new Date(pkData?.RQ))).format('YYYY-MM-DD'),
          endDate: moment(getFirstDay(new Date(pkData?.RQ))).subtract(-6, "days").format("YYYY-MM-DD")
        })
      } else {
        res = await judgeKHPKSJ({
          XNXQId: Bj?.XNXQId,
          KHBJSJId: Bj?.KHBJSJId,
          KSS: Class?.KSS,
        })
      }
      if (res?.status === 'ok') {
        const addRes = await addKHPKSJ({
          ...KHPKSJ,
        });
        // 添加班级数据
        KHPKSJ.KHBJSJ = bjData.find((bjItem: any) => {
          return bjItem.id === value.KHBJSJId;
        });
        // 添加场地数据
        KHPKSJ.FJSJ = cdmcData?.find((item: any) => item.value === cdmcValue);

        if (addRes.status === 'ok') {
          KHPKSJ.id = addRes?.data?.id;
          screenOriSource.push(KHPKSJ);
          setLoading(false);
        } else {
          message.error(addRes.message);
          refreshTable();
          setLoading(false);
        }
      } else {
        refreshTable();
        message.warning(res?.message)
        setLoading(false);
      }
    } else {
      // 移除 根据房间Id移除数据
      let id: string | undefined;
      screenOriSource.filter((KHPKSJ: any) => {
        if (
          KHPKSJ.FJSJId === cdmcValue && // 教室ID
          KHPKSJ.XXSJPZId === pkData.XXSJPZId && // 时间ID
          KHPKSJ.WEEKDAY === pkData.WEEKDAY // 周
        ) {
          id = KHPKSJ.id;
          return false;
        }
        return true;
      });
      if (id) {
        const res = await deleteKHPKSJ({
          id,
        });
        if (res?.status === 'ok') {
          setScreenOriSource(
            screenOriSource.filter((values: any) => {
              return values?.id !== id;
            }),
          );
        }
        if (res?.status === 'error') {
          message.error(res?.message);
        }
        setLoading(false);
      }
    }
  };
  // 班级展开收起
  const unFold = () => {
    if (packUp === false) {
      setPackUp(true);
    } else {
      setPackUp(false);
    }
  };
  // 班级选择
  const onReset = () => {
    const bjID = getQueryString('courseId');
    if (bjID) {
      history.go(-1);
      setState(true);
    } else {
      setState(true);
    }
  };

  const getKCStyle = (id: string) => {
    if (id === Bj?.id) {
      return { borderColor: 'rgba(62,136,248,1)' };
    }
    if (formValues?.BJId) {
      return {};
    }
    return {};
  };

  // 班级选择
  const BjClick = (value: any) => {
    setClass(value);
    // 更换课程班后将场地清空
    setCdmcValue(undefined);
    const start = new Date(moment(value?.KKRQ).format('YYYY/MM/DD  00:00:00'));
    const end = new Date(moment(value?.JKRQ).format('YYYY/MM/DD  23:59:59'));
    const times = start.getTime() - getFirstDay(new Date(TimeData?.KSRQ)).getTime();
    const time2 = end.getTime() - getFirstDay(new Date(TimeData?.KSRQ)).getTime();
    const startWeek = Number(moment(value?.KKRQ).format('E'));
    const endWeek = Number(moment(value?.JKRQ).format('E'));
    // 获取开始时间到结束时间中间有多少个自然周
    const startZhou = Math.ceil(times / (7 * 24 * 60 * 60 * 1000));
    const endZhou = Math.ceil(time2 / (7 * 24 * 60 * 60 * 1000));
    setRqDisable([startZhou, endZhou, startWeek, endWeek])

    // 选择班级教师
    const JS: any = value.KHBJJs?.find((items: any) => items.JSLX === '主教师');
    if (JS) {
      const { JZGJBSJId, XM } = JS;
      setTearchId(JZGJBSJId);
      const chosenData = {
        id: value.id,
        cla: value.BJMC || '',
        teacher: XM || '',
        teacherID: JZGJBSJId || '',
        XNXQId: curXNXQId || '',
        KHBJSJId: value.id || '',
        color: value.KHKCSJ.KBYS || 'rgba(62, 136, 248, 1)',
      };

      setBj(chosenData);
      if (value?.FJSJ?.id) {
        setCdmcValue(value?.FJSJ?.id);
        setCdFalg(true);
      } else {
        setCdFalg(false);
      }
    } else {
      const chosenData = {
        id: value.id,
        cla: value.BJMC || '',
        XNXQId: curXNXQId || '',
        KHBJSJId: value.id || '',
        color: value.KHKCSJ.KBYS || 'rgba(62, 136, 248, 1)',
      };
      setBj(chosenData);
      if (value?.FJSJ?.id) {
        setCdmcValue(value?.FJSJ?.id);
        setCdFalg(true);
      } else {
        setCdFalg(false);
      }
    }
  };

  // 获取课程数据
  const getKcData = async () => {
    const khkcResl = await getAllCourses({
      page: 0,
      pageSize: 0,
      NJId: NJID,
      XNXQId: curXNXQId,
      XXJBSJId: currentUser?.xxId,
    });
    if (khkcResl.status === 'ok') {
      const KCMC = khkcResl.data.rows?.map((item: any) => ({
        label: item.KCMC,
        value: item.id,
      }));
      setKcType(KCMC);
    }
  };

  // 获取课程对应课程班数据信息
  const getBjData = async (kcName?: string) => {
    if (curXNXQId && campusId) {
      const bjmcResl = await getAllClasses({
        page: 0,
        pageSize: 0,
        NJSJId: NJID,
        KHKCSJId: kcName,
        XNXQId: curXNXQId,
        BJZT: '未开班',
        XQSJId: campusId,
      });
      if (bjmcResl.status === 'ok') {
        const bjRows = bjmcResl.data.rows;
        setBjData(bjRows);
        // 获取课程班老师 是否存在
        if (!Bj && formValues?.BJId) {
          const value = bjRows?.find((item: { id: string }) => item.id === formValues?.BJId);
          if (value) {
            BjClick(value);
          }
        }
        // 判断获取的新课程和当前选中的bj 不匹配时 清掉 bj
        if (Bj?.id) {
          const value = bjRows?.find((item: { id: string }) => item.id === Bj?.id);
          if (!value) {
            setTearchId(undefined);
            setBj(undefined);
            setCDLoading(false);
          }
        }
      }
    }

  };

  useEffect(() => {
    getKcData();
    getBjData();
  }, [NJID, curXNXQId, campusId]);

  // 默认选择本校
  useEffect(() => {
    form.setFieldsValue({ XQ: campus?.[0]?.value });
  }, [props.campus]);

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
  // 初始化请求获取年级信息
  useEffect(() => {
    getGradeData();
  }, []);

  // 清除
  const showDeleteConfirm = () => {
    confirm({
      title: '提示',
      icon: <QuestionCircleOutlined style={{ color: 'red' }} />,
      content: '确定要清除当前所选课程班的排课信息吗？',
      onOk() {
        if (Bj?.id) {
          const parameter = {
            bjIds: [Bj?.id],
            data: [],
          };
          const result = createKHPKSJ(parameter);
          Promise.resolve(result).then((data) => {
            if (data.status === 'ok') {
              setCDLoading(false);
              // 移除当前班级 所有排课
              if (screenOriSource) {
                const screenCD = (dataSource1: any) => {
                  const newDataSource = [...dataSource1];
                  if (cdmcValue) {
                    return newDataSource.filter((item: any) => item.FJSJId === cdmcValue);
                  }
                  return newDataSource;
                };
                // 根据场地名称筛选出来 场地数据
                const newCDData = screenCD(
                  screenOriSource.filter((item: any) => item.KHBJSJId !== Bj.id),
                );
                const newTableData: any = processingData(newCDData, xXSJPZData, Bj?.id);
                setNewTableDataSource(newTableData);
                setLoading(false);
              }
            }
          });
        }
      },
    });
  };

  // 场地改变重新筛选表格
  useEffect(() => {
    if (Bj?.id) {
      setLoading(true);
      refreshTable();
    }
  }, [cdmcValue, Bj]);

  useEffect(() => {
    if (formValues) {
      form.setFieldsValue(formValues);
    }
  }, [formValues]);

  // 导入冲突后的弹窗提示
  const error = () => {
    Modal.error({
      title: '部分导入失败',
      className: 'imporModel',
      content: (
        <div>
          {ImportData?.map((value: any) => {
            return <p>{value}</p>;
          })}
        </div>
      ),
      onOk: () => {
        setImportData([]);
      },
    });
  };

  // 获取排课数据信息
  const getPKData = async () => {
    setLoading(true);
    const res = await getAllPK({
      XNXQId: curXNXQId,
      XXJBSJId: currentUser?.xxId,
    });
    if (res.status === 'ok') {
      setScreenOriSource(res?.data);
      if (res?.data?.length > 0) {
        const screenCD = (dataSource1: any) => {
          const newDataSource = [...dataSource1];
          if (cdmcValue) {
            return newDataSource.filter((item: any) => item.FJSJId === cdmcValue);
          }
          return newDataSource;
        };
        // 根据场地名称筛选出来 场地数据
        const newCDData = screenCD(res?.data);
        const newTableData: any = processingData(newCDData, xXSJPZData, Bj?.id);
        setNewTableDataSource(newTableData);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (ImportData?.length > 0) {
      error();
    }
  }, [ImportData]);

  // 上传配置
  const UploadProps: any = {
    name: 'xlsx',
    action: '/api/upload/importSchedule',
    headers: {
      authorization: getAuthorization(),
    },
    beforeUpload(file: any) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('文件大小不能超过2M');
      }
      return isLt2M;
    },
    data: {
      XNXQId: curXNXQId,
      KHBJSJId: Bj?.id,
      FJSJId: cdmcValue,
      PKTYPE: 0,
    },
    onChange(info: { file: { status: string; name: any; response: any }; fileList: any }) {
      if (info.file.status === 'done') {
        const code = info.file.response;
        if (code.status === 'ok') {
          setImportData(code?.data);
          message.success(`上传成功`);
          setUploadVisible(false);
          getPKData();
        } else {
          message.error(`${code.message}`);
        }
      } else if (info.file.status === 'error') {
        const code = info.file.response;
        message.error(`${code.message}`);
      }
    },
  };

  return (
    <div className={styles.AddArranging}>
      <Card
        size="small"
        bordered={false}
        headStyle={{
          fontSize: 16,
          fontWeight: 700,
        }}
        bodyStyle={{
          background: '#FFF',
        }}
        title={
          <>
            <Button
              type="primary"
              onClick={onReset}
              style={{
                marginRight: '24px',
              }}
            >
              <LeftOutlined />
              返回上一页
            </Button>
            {`${formValues && formValues.BJId ? '编辑排课' : '新增排课'}`}
          </>
        }
        extra={
          <Button
            style={{
              border: '1px solid #F04D4D ',
              marginRight: 8,
              background: '#F04D4D',
              color: '#fff',
            }}
            danger
            onClick={showDeleteConfirm}
          >
            清除排课
          </Button>
        }
      >
        <Spin spinning={loading} style={{ height: '100vh' }} size="large">
          {!loading ? (
            <ProForm
              className="ArrangingFrom"
              name="validate_other"
              layout="horizontal"
              form={form}
              // onFinish={submit}
              submitter={false}
            >
              <Row justify="start" align="middle" style={{ background: '#F5F5F5' }}>
                <Col span={6}>
                  <ProFormSelect
                    label="校区"
                    width="md"
                    name="XQ"
                    style={{
                      margin: '12px 0',
                    }}
                    disabled={true}
                    options={campus || []}
                  />
                </Col>
                <Col span={6}>
                  <ProFormSelect
                    label="年级"
                    width="md"
                    name="NJ"
                    options={grade || []}
                    fieldProps={{
                      async onChange(value) {
                        // 年级选择时将选中的课程清空
                        form.setFieldsValue({ KC: undefined });
                        setNJID(value);
                      },
                    }}
                  />
                </Col>
                <Col span={6}>
                  <ProFormSelect
                    label="课程"
                    width="md"
                    options={kcType || []}
                    name="KC"
                    showSearch
                    fieldProps={{
                      async onChange(value) {
                        getBjData(value);
                      },
                    }}
                  />
                </Col>
              </Row>

              <div className="banji">
                <span>课程班：</span>
                {bjData && bjData.length === 0 ? (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : (
                  <>
                    {bjData && bjData.length < 17 ? (
                      <ProCard ghost className="banjiCard">
                        {bjData.map((value: any) => {
                          const teacher =
                            value?.KHBJJs?.find((items: any) => items.JSLX === '主教师')?.JZGJBSJ ||
                            value?.KHBJJs?.[0]?.JZGJBSJ;
                          return (
                            <ProCard
                              className="banjiItem"
                              layout="center"
                              bordered
                              onClick={() => BjClick(value)}
                              style={getKCStyle(value.id)}
                            >
                              <Tooltip title={value.BJMC}>
                                <p>{value.BJMC}</p>
                              </Tooltip>
                              <span>
                                <ShowName
                                  style={{ color: '#666' }}
                                  type="userName"
                                  openid={teacher?.WechatUserId}
                                  XM={teacher?.XM}
                                />
                              </span>
                              {Bj?.id === value.id ? <span className="douhao">√</span> : ''}
                            </ProCard>
                          );
                        })}
                      </ProCard>
                    ) : (
                      <>
                        {packUp === false ? (
                          <ProCard ghost className="banjiCard">
                            {bjData && bjData.length > 0
                              ? bjData.slice(0, 15).map((value: any) => {
                                const zb = value?.KHBJJs.find(
                                  (item: any) => item.JSLX === '主教师',
                                );
                                return (
                                  <ProCard
                                    layout="center"
                                    bordered
                                    className="banjiItem"
                                    onClick={() => BjClick(value)}
                                    style={getKCStyle(value.id)}
                                  >
                                    <Tooltip title={value.BJMC}>
                                      <p>{value.BJMC}</p>
                                    </Tooltip>
                                    <span>
                                      {/* {
                                      value?.KHBJJs.find((item: any) => item.JSLX === '主教师')
                                        ?.JZGJBSJ?.XM
                                    } */}
                                      <ShowName
                                        style={{ color: '#666' }}
                                        type="userName"
                                        openid={zb?.WechatUserId}
                                        XM={zb?.JZGJBSJ?.XM}
                                      />
                                    </span>
                                    {Bj?.id === value.id ? <span className="douhao">√</span> : ''}
                                  </ProCard>
                                );
                              })
                              : ''}
                            <ProCard layout="center" bordered onClick={unFold} className="unFold">
                              展开 <DownOutlined style={{ color: '#4884FF' }} />
                            </ProCard>
                          </ProCard>
                        ) : (
                          <ProCard ghost className="banjiCard">
                            {bjData && bjData.length > 0
                              ? bjData.map((value: any) => {
                                const zb = value?.KHBJJs.find(
                                  (item: any) => item.JSLX === '主教师',
                                );
                                return (
                                  <ProCard
                                    layout="center"
                                    bordered
                                    className="banjiItem"
                                    onClick={() => BjClick(value)}
                                    style={getKCStyle(value.id)}
                                  >
                                    <Tooltip title={value.BJMC}>
                                      <p>{value.BJMC}</p>
                                    </Tooltip>
                                    <span>
                                      {/* {
                                      value?.KHBJJs.find((item: any) => item.JSLX === '主教师')
                                        ?.JZGJBSJ?.XM
                                    } */}
                                      <ShowName
                                        style={{ color: '#666' }}
                                        type="userName"
                                        openid={value.WechatUserId}
                                        XM={zb?.JZGJBSJ?.XM}
                                      />
                                    </span>
                                    {Bj?.id === value.id ? <span className="douhao">√</span> : ''}
                                  </ProCard>
                                );
                              })
                              : ''}
                            <ProCard layout="center" bordered onClick={unFold} className="unFold">
                              收起 <UpOutlined style={{ color: '#4884FF' }} />
                            </ProCard>
                          </ProCard>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
              <Form.Item label="场地：">
                <Select
                  style={{ width: 200 }}
                  value={cdmcValue}
                  allowClear
                  placeholder="请选择"
                  disabled={CdFalg}
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
              </Form.Item>
              {Bj && cdmcValue ? (
                <Button
                  className="ImportBtn"
                  key="button"
                  type="primary"
                  onClick={() => setUploadVisible(true)}
                >
                  <VerticalAlignBottomOutlined /> 导入
                </Button>
              ) : (
                ''
              )}
              <div className="site">
                {Bj && cdmcValue ? (
                  <Spin spinning={CDLoading}>
                    <ExcelTable
                      className={styles.borderTable}
                      columns={columns}
                      dataSource={newTableDataSource}
                      chosenData={Bj}
                      onExcelTableClick={onExcelTableClick}
                      type="edit"
                      getSelectdata={getSelectdata}
                      tearchId={tearchId}
                      TimeData={TimeData}
                      xXSJPZData={xXSJPZData}
                      style={{
                        height: 'calc(100vh - 500px)',
                      }}
                    // basicData={oriSource}
                    />
                  </Spin>
                ) : (
                  <div className={styles.noContent}>
                    {' '}
                    <img src={noJF} alt="" /> <p>请先选择班级和场地后再进行排课</p>{' '}
                  </div>
                )}
              </div>
            </ProForm>
          ) : (
            ''
          )}
        </Spin>
      </Card>
      <Modal
        title="导入排课"
        destroyOnClose
        width="35vw"
        visible={uploadVisible}
        onCancel={() => setUploadVisible(false)}
        footer={null}
        centered
        maskClosable={false}
        bodyStyle={{
          maxHeight: '65vh',
          overflowY: 'auto',
        }}
      >
        <>
          <p>
            <Upload {...UploadProps}>
              <Button icon={<UploadOutlined />}>上传文件</Button>{' '}
              <span className={styles.messageSpan}>批量导入排课</span>
            </Upload>
          </p>
          <div className={styles.messageDiv}>
            <Badge color="#aaa" />
            上传文件仅支持模板格式
            <a style={{ marginLeft: '16px' }} type="download" href="/template/importSchedule.xlsx">
              下载模板
            </a>
            <br />
            <Badge color="#aaa" />
            确保表格内只有一个工作薄，如果有多个只有第一个会被处理
            <br />
            <Badge color="#aaa" />
            排课单次最大支持导入500条数据
          </div>
        </>
      </Modal>
    </div>
  );
};

export default AddArranging;
