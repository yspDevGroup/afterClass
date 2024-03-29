/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import { history } from 'umi';
import { Button, Form, message, Spin, Modal, Tooltip, Empty, Select, Card, Row, Col } from 'antd';
import ProForm, { ProFormSelect } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { DownOutlined, QuestionCircleOutlined, UpOutlined, LeftOutlined } from '@ant-design/icons';
import { getQueryObj } from '@/utils/utils';
import ExcelTable from '@/components/ExcelTable';
import ShowName from '@/components/ShowName';
import { createKHPKSJ, deleteKHPKSJ, addKHPKSJ } from '@/services/after-class/khpksj';
// import { getFJPlan, getAllFJSJ } from '@/services/after-class/fjsj';
import { getAllClasses } from '@/services/after-class/khbjsj';
import type { DataSourceType } from '@/components/ExcelTable';

import { getAllBJSJ } from '@/services/after-class/bjsj';
import styles from '../index.less';

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
  campusId?: string;
  // setBJIDData?: any;
  cdmcData?: any[];
  kcmcData?: any[];
  currentUser?: API.CurrentUser | undefined;
  screenOriSource: any;
  setLoading: any;
  NJData?: any;
};

const AddArranginClass: FC<PropsType> = (props) => {
  const {
    screenOriSource,
    curXNXQId,
    campus,
    campusId,
    xXSJPZData,
    setState,
    processingData,
    formValues,
    setLoading,
    // setBJIDData,
    cdmcData,
    NJData,
    // setTableDataSource,
    // sameClass,
    // tableDataSource,
  } = props;

  const [packUp, setPackUp] = useState(false);
  const [form] = Form.useForm();
  const [loading] = useState(false);
  const [CDLoading, setCDLoading] = useState(false);

  // const [NJID, setNJID] = useState<any>(undefined);
  // 年级 名称选择框数据
  const [NJId, setNJId] = useState<string>();

  // 行政班 名称筛选
  const [XZBId, setXZBId] = useState<string>();
  const [XZBData, setXZBData] = useState<any[]>([]);
  const [cdmcValue, setCdmcValue] = useState<any>();
  const [newTableDataSource, setNewTableDataSource] = useState<DataSourceType>([]);

  // 选择的班级的数据
  const [Bj, setBj] = useState<any>(undefined);
  // 请求的班级列表数据
  const [bjData, setBjData] = useState<any>([]);
  const [tearchId, setTearchId] = useState(undefined);
  // 场地是否可以编辑
  const [CdFalg, setCdFalg] = useState<boolean>(false);
  // 年级
  // const [grade, setGrade] = useState<any>([]);

  const columns: {
    title: string;
    dataIndex: string;
    key: string;
    align: 'center' | 'left' | 'right';
    width: number;
  }[] = [
    {
      title: '',
      dataIndex: 'room',
      key: 'room',
      align: 'center',
      width: 66,
    },
    {
      title: '',
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
    // console.log('getSelectdata', value);
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
    if (screenOriSource?.length > 0) {
      const screenCD = (dataSource1: any) => {
        const newDataSource = [...dataSource1];
        if (cdmcValue) {
          return newDataSource.filter((item: any) => item.id === cdmcValue);
        }
        return newDataSource;
      };
      // 根据场地名称筛选出来 场地数据
      const newCDData = screenCD(screenOriSource);
      const newTableData: any = processingData(newCDData, xXSJPZData, Bj?.id);
      setNewTableDataSource(newTableData);
      // console.log('刷新add table');
      setLoading(false);
    }
  };

  const onExcelTableClick = async (value: any, record: any, pkData: any) => {
    // FJSJId 房间Id KHBJSJId: 课后班级数据
    // 如果value ===null 移除
    // xuyao改变的原始数据 screenOriSource
    setLoading(true);
    if (value) {
      // 添加 根据房间id
      // console.log('添加')
      const KHPKSJ: any = {
        FJSJId: value.FJSJId,
        WEEKDAY: value.WEEKDAY,
        XNXQId: curXNXQId,
        KHBJSJId: value.KHBJSJId,
        XXSJPZId: value.XXSJPZId,
      };

      const addRes = await addKHPKSJ({
        ...KHPKSJ,
      });
      // 添加班级数据
      KHPKSJ.KHBJSJ = bjData.find((bjItem: any) => {
        return bjItem.id === value.KHBJSJId;
      });
      if (addRes.status === 'ok') {
        screenOriSource.forEach((item: any) => {
          if (item.id === value.FJSJId) {
            KHPKSJ.id = addRes?.data?.id;
            item.KHPKSJs.push(KHPKSJ);
            // console.log('添加的位置', item.KHPKSJs)
          }
        });
        setLoading(false);
      } else {
        message.error(addRes.message);
        refreshTable();
        setLoading(false);
      }
    } else {
      // 移除 根据房间Id移除数据
      // console.log('移除')
      let id: string | undefined;
      screenOriSource.forEach((item: any) => {
        const { KHPKSJs } = item;
        if (KHPKSJs.length > 0) {
          item.KHPKSJs = KHPKSJs.filter((KHPKSJ: any) => {
            if (
              KHPKSJ.FJSJId === pkData.FJSJId && // 教室ID
              KHPKSJ.XXSJPZId === pkData.XXSJPZId && // 时间ID
              KHPKSJ.WEEKDAY === pkData.WEEKDAY // 周
            ) {
              id = KHPKSJ.id;
              return false;
            }
            return true;
          });
        }
      });
      if (id) {
        const res = await deleteKHPKSJ({
          id,
        });
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
    const bjID = getQueryObj().courseId;
    if (bjID) {
      history.go(-1);
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
      if (value?.FJSJ?.id) {
        setCdmcValue(value?.FJSJ?.id);
        setCdFalg(true);
      } else {
        setCdFalg(false);
      }
      setBj(chosenData);
    }
    // setIndex(value.id);
    // setBJIDData(value.id);
  };

  // 获取课程数据
  // const getKcData = async () => {
  //     const khkcResl = await getAllCourses({
  //         page: 0,
  //         pageSize: 0,
  //         NJId: NJId,
  //         XNXQId: curXNXQId,
  //         XXJBSJId: currentUser?.xxId,
  //     });
  //     if (khkcResl.status === 'ok') {
  //         const KCMC = khkcResl.data.rows?.map((item: any) => ({
  //             label: item.KCMC,
  //             value: item.id,
  //         }));
  //         setKcType(KCMC);
  //     }
  // };

  /**
   * 获取课程对应课程班数据信息
   *  */
  const getBjData = async (kcName?: string) => {
    const bjmcResl = await getAllClasses({
      page: 0,
      pageSize: 0,
      NJSJId: NJId,
      KHKCSJId: kcName,
      XNXQId: curXNXQId,
      BJZT: '未开班',
      ISFW: 1,
      KCTAG: '校内辅导',
      BJSJId: XZBId,
      XQSJId: campusId,
    });
    if (bjmcResl.status === 'ok') {
      const bjRows = bjmcResl.data.rows;
      setBjData(bjRows);
      // 获取课程班老师 是否存在

      if (!Bj && formValues?.BJId) {
        const value = bjRows?.find((item: { id: string }) => item.id === formValues?.BJId);
        // console.log('value', value);
        if (value) {
          BjClick(value);
        }
      }
      // 判断获取的新课程和当前选中的bj 不匹配时 清掉 bj
      if (Bj?.id) {
        console.log('--------');

        const value = bjRows?.find((item: { id: string }) => item.id === Bj?.id);
        if (!value) {
          setTearchId(undefined);
          setBj(undefined);
          setCDLoading(false);
          setCdmcValue(undefined);
        }
      }
    }
  };

  // 获取行政班
  const getXZB = async () => {
    const res = await getAllBJSJ({ XQSJId: campusId, njId: NJId, page: 0, pageSize: 0 });
    if (res.status === 'ok') {
      const data: any = res.data?.rows?.map((item: any) => {
        return { label: item.BJ, value: item.id };
      });
      setXZBData(data);
    }
  };

  useEffect(() => {
    // getKcData();
    if (NJId) {
      console.log('获取班级');
      getBjData();
      getXZB();
    } else {
      setXZBData([]);
    }
  }, [NJId, XZBId]);

  // 获取年级信息
  // const getGradeData = () => {
  //     const response = getAllGrades({ XD: currentUser?.XD?.split(',') });
  //     Promise.resolve(response).then((res: any) => {
  //         if (res.status === 'ok') {
  //             const optNJ: any[] = [];
  //             const nj = ['幼儿园', '小学', '初中', '高中'];
  //             nj.forEach((itemNJ) => {
  //                 res.data?.forEach((item: any) => {
  //                     if (item.XD === itemNJ) {
  //                         optNJ.push({
  //                             label: `${item.XD}${item.NJMC}`,
  //                             value: item.id,
  //                         });
  //                     }
  //                 });
  //             });
  //             setGrade(optNJ);
  //         }
  //     });
  // };
  // // 初始化请求获取年级信息
  // useEffect(() => {
  //     getGradeData();
  // }, []);

  /**
   * 清除
   */
  const showDeleteConfirm = () => {
    confirm({
      title: '提示',
      icon: <QuestionCircleOutlined style={{ color: 'red' }} />,
      content: Bj?.id ? '确定要清除当前所选课程班的排课信息吗？' : '请先选择要清除的班级',
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
              screenOriSource.forEach((item: any) => {
                const { KHPKSJs } = item;
                if (KHPKSJs.length > 0) {
                  item.KHPKSJs = KHPKSJs.filter((KHPKSJ: any) => KHPKSJ.KHBJSJId !== Bj.id);
                }
              });
              refreshTable();
            }
          });
        }
      },
    });
  };

  // 场地改变重新筛选表格
  useEffect(() => {
    if (Bj?.id) {
      // console.log('监听场地和班级');
      setLoading(true);
      refreshTable();
    }
  }, [cdmcValue, Bj]);

  useEffect(() => {
    if (formValues) {
      // console.log('formValues',formValues);
      if (formValues?.XZBId) {
        setXZBId(formValues?.XZBId);
      }
      if (formValues?.NJ) {
        setNJId(formValues.NJ);
      }

      form.setFieldsValue(formValues);
    }
  }, [formValues]);

  return (
    <>
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
              {/* <div className={styles.screen} style={{ display: 'flex', justifyContent:'center', background:'red' }}> */}
              <Row justify="start" align="middle" style={{ background: ' #F5F5F5' }}>
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
                    options={
                      NJData.map((item: any) => {
                        return { value: item.id, label: `${item.XD}${item.NJMC}` };
                      }) || []
                    }
                    fieldProps={{
                      async onChange(value) {
                        // 年级选择时将选中的课程清空
                        form.setFieldsValue({ XZB: undefined });
                        setNJId(value);
                      },
                    }}
                  />
                </Col>
                <Col span={6}>
                  <ProFormSelect
                    label="行政班"
                    width="md"
                    name="XZBId"
                    options={XZBData || []}
                    fieldProps={{
                      async onChange(value) {
                        setXZBId(value);
                      },
                    }}
                  />
                </Col>
              </Row>

              {/* </div> */}

              <div className="banji">
                <span>课程班：</span>
                {bjData && bjData.length === 0 ? (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : bjData && bjData.length < 17 ? (
                  <ProCard ghost className="banjiCard">
                    {bjData.map((value: any) => {
                      const teacher =
                        value?.KHBJJs?.find((items: any) => items.JSLX === '主教师')?.JZGJBSJ ||
                        value?.KHBJJs?.[0]?.JZGJBSJ;
                      return (
                        <ProCard
                          key={value.id}
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
                              const zb = value?.KHBJJs.find((item: any) => item.JSLX === '主教师');
                              return (
                                <ProCard
                                  key={value.id}
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
                              const zb = value?.KHBJJs.find((item: any) => item.JSLX === '主教师');
                              return (
                                <ProCard
                                  key={value.id}
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
              </div>
              <Row justify="start" align="middle">
                <Col span={6}>
                  <Form.Item label="场地名称">
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
                </Col>
              </Row>
              <div className="site">
                {Bj ? (
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
                      style={{
                        height: 'calc(100vh - 500px)',
                      }}
                      // basicData={oriSource}
                    />
                  </Spin>
                ) : (
                  <div className={styles.noContent}>请先选择班级后再进行排课</div>
                )}
              </div>
            </ProForm>
          ) : (
            ''
          )}
        </Spin>
      </Card>
    </>
  );
};

export default AddArranginClass;
