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
  // ?????? ?????????????????????
  const [NJId, setNJId] = useState<string>();

  // ????????? ????????????
  const [XZBId, setXZBId] = useState<string>();
  const [XZBData, setXZBData] = useState<any[]>([]);
  const [cdmcValue, setCdmcValue] = useState<any>();
  const [newTableDataSource, setNewTableDataSource] = useState<DataSourceType>([]);

  // ????????????????????????
  const [Bj, setBj] = useState<any>(undefined);
  // ???????????????????????????
  const [bjData, setBjData] = useState<any>([]);
  const [tearchId, setTearchId] = useState(undefined);
  // ????????????????????????
  const [CdFalg, setCdFalg] = useState<boolean>(false);
  // ??????
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
      title: '??????',
      dataIndex: 'monday',
      key: 'monday',
      align: 'center',
      width: 100,
    },
    {
      title: '??????',
      dataIndex: 'tuesday',
      key: 'tuesday',
      align: 'center',
      width: 100,
    },
    {
      title: '??????',
      dataIndex: 'wednesday',
      key: 'wednesday',
      align: 'center',
      width: 100,
    },
    {
      title: '??????',
      dataIndex: 'thursday',
      key: 'thursday',
      align: 'center',
      width: 100,
    },
    {
      title: '??????',
      dataIndex: 'friday',
      key: 'friday',
      align: 'center',
      width: 100,
    },
    {
      title: '??????',
      dataIndex: 'saturday',
      key: 'saturday',
      align: 'center',
      width: 100,
    },
    {
      title: '??????',
      dataIndex: 'sunday',
      key: 'sunday',
      align: 'center',
      width: 100,
    },
  ];

  // ??????????????????????????????????????????
  const getSelectdata = () => {
    // console.log('getSelectdata', value);
    // sameClassDatas.map((item: any, key: number) => {
    //   if (
    //     item.FJSJId === value.FJSJId && // ??????ID
    //     item.XXSJPZId === value.XXSJPZId && // ??????ID
    //     item.WEEKDAY === value.WEEKDAY // ???
    //   ) {
    //     sameClassDatas.splice(key, 1);
    //   }
    //   return item;
    // });
  };

  // ??????Table
  const refreshTable = () => {
    if (screenOriSource?.length > 0) {
      const screenCD = (dataSource1: any) => {
        const newDataSource = [...dataSource1];
        if (cdmcValue) {
          return newDataSource.filter((item: any) => item.id === cdmcValue);
        }
        return newDataSource;
      };
      // ?????????????????????????????? ????????????
      const newCDData = screenCD(screenOriSource);
      const newTableData: any = processingData(newCDData, xXSJPZData, Bj?.id);
      setNewTableDataSource(newTableData);
      // console.log('??????add table');
      setLoading(false);
    }
  };

  const onExcelTableClick = async (value: any, record: any, pkData: any) => {
    // FJSJId ??????Id KHBJSJId: ??????????????????
    // ??????value ===null ??????
    // xuyao????????????????????? screenOriSource
    setLoading(true);
    if (value) {
      // ?????? ????????????id
      // console.log('??????')
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
      // ??????????????????
      KHPKSJ.KHBJSJ = bjData.find((bjItem: any) => {
        return bjItem.id === value.KHBJSJId;
      });
      if (addRes.status === 'ok') {
        screenOriSource.forEach((item: any) => {
          if (item.id === value.FJSJId) {
            KHPKSJ.id = addRes?.data?.id;
            item.KHPKSJs.push(KHPKSJ);
            // console.log('???????????????', item.KHPKSJs)
          }
        });
        setLoading(false);
      } else {
        message.error(addRes.message);
        refreshTable();
        setLoading(false);
      }
    } else {
      // ?????? ????????????Id????????????
      // console.log('??????')
      let id: string | undefined;
      screenOriSource.forEach((item: any) => {
        const { KHPKSJs } = item;
        if (KHPKSJs.length > 0) {
          item.KHPKSJs = KHPKSJs.filter((KHPKSJ: any) => {
            if (
              KHPKSJ.FJSJId === pkData.FJSJId && // ??????ID
              KHPKSJ.XXSJPZId === pkData.XXSJPZId && // ??????ID
              KHPKSJ.WEEKDAY === pkData.WEEKDAY // ???
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
  // ??????????????????
  const unFold = () => {
    if (packUp === false) {
      setPackUp(true);
    } else {
      setPackUp(false);
    }
  };
  // ????????????

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

  // ????????????
  const BjClick = (value: any) => {
    // ??????????????????
    const JS: any = value.KHBJJs?.find((items: any) => items.JSLX === '?????????');
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

  // ??????????????????
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
   * ???????????????????????????????????????
   *  */
  const getBjData = async (kcName?: string) => {
    const bjmcResl = await getAllClasses({
      page: 0,
      pageSize: 0,
      NJSJId: NJId,
      KHKCSJId: kcName,
      XNXQId: curXNXQId,
      BJZT: '?????????',
      ISFW: 1,
      KCTAG: '????????????',
      BJSJId: XZBId,
      XQSJId: campusId,
    });
    if (bjmcResl.status === 'ok') {
      const bjRows = bjmcResl.data.rows;
      setBjData(bjRows);
      // ????????????????????? ????????????

      if (!Bj && formValues?.BJId) {
        const value = bjRows?.find((item: { id: string }) => item.id === formValues?.BJId);
        // console.log('value', value);
        if (value) {
          BjClick(value);
        }
      }
      // ??????????????????????????????????????????bj ???????????? ?????? bj
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

  // ???????????????
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
      console.log('????????????');
      getBjData();
      getXZB();
    } else {
      setXZBData([]);
    }
  }, [NJId, XZBId]);

  // ??????????????????
  // const getGradeData = () => {
  //     const response = getAllGrades({ XD: currentUser?.XD?.split(',') });
  //     Promise.resolve(response).then((res: any) => {
  //         if (res.status === 'ok') {
  //             const optNJ: any[] = [];
  //             const nj = ['?????????', '??????', '??????', '??????'];
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
  // // ?????????????????????????????????
  // useEffect(() => {
  //     getGradeData();
  // }, []);

  /**
   * ??????
   */
  const showDeleteConfirm = () => {
    confirm({
      title: '??????',
      icon: <QuestionCircleOutlined style={{ color: 'red' }} />,
      content: Bj?.id ? '?????????????????????????????????????????????????????????' : '??????????????????????????????',
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
              // ?????????????????? ????????????
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

  // ??????????????????????????????
  useEffect(() => {
    if (Bj?.id) {
      // console.log('?????????????????????');
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
              ???????????????
            </Button>
            {`${formValues && formValues.BJId ? '????????????' : '????????????'}`}
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
            ????????????
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
              <Row justify="start" align="middle" style={{ background: '???#F5F5F5' }}>
                <Col span={6}>
                  <ProFormSelect
                    label="??????"
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
                    label="??????"
                    width="md"
                    name="NJ"
                    options={
                      NJData.map((item: any) => {
                        return { value: item.id, label: `${item.XD}${item.NJMC}` };
                      }) || []
                    }
                    fieldProps={{
                      async onChange(value) {
                        // ???????????????????????????????????????
                        form.setFieldsValue({ XZB: undefined });
                        setNJId(value);
                      },
                    }}
                  />
                </Col>
                <Col span={6}>
                  <ProFormSelect
                    label="?????????"
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
                <span>????????????</span>
                {bjData && bjData.length === 0 ? (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : bjData && bjData.length < 17 ? (
                  <ProCard ghost className="banjiCard">
                    {bjData.map((value: any) => {
                      const teacher =
                        value?.KHBJJs?.find((items: any) => items.JSLX === '?????????')?.JZGJBSJ ||
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
                          {Bj?.id === value.id ? <span className="douhao">???</span> : ''}
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
                              const zb = value?.KHBJJs.find((item: any) => item.JSLX === '?????????');
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
                                      value?.KHBJJs.find((item: any) => item.JSLX === '?????????')
                                        ?.JZGJBSJ?.XM
                                    } */}
                                    <ShowName
                                      style={{ color: '#666' }}
                                      type="userName"
                                      openid={zb?.WechatUserId}
                                      XM={zb?.JZGJBSJ?.XM}
                                    />
                                  </span>
                                  {Bj?.id === value.id ? <span className="douhao">???</span> : ''}
                                </ProCard>
                              );
                            })
                          : ''}
                        <ProCard layout="center" bordered onClick={unFold} className="unFold">
                          ?????? <DownOutlined style={{ color: '#4884FF' }} />
                        </ProCard>
                      </ProCard>
                    ) : (
                      <ProCard ghost className="banjiCard">
                        {bjData && bjData.length > 0
                          ? bjData.map((value: any) => {
                              const zb = value?.KHBJJs.find((item: any) => item.JSLX === '?????????');
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
                                      value?.KHBJJs.find((item: any) => item.JSLX === '?????????')
                                        ?.JZGJBSJ?.XM
                                    } */}
                                    <ShowName
                                      style={{ color: '#666' }}
                                      type="userName"
                                      openid={value.WechatUserId}
                                      XM={zb?.JZGJBSJ?.XM}
                                    />
                                  </span>
                                  {Bj?.id === value.id ? <span className="douhao">???</span> : ''}
                                </ProCard>
                              );
                            })
                          : ''}
                        <ProCard layout="center" bordered onClick={unFold} className="unFold">
                          ?????? <UpOutlined style={{ color: '#4884FF' }} />
                        </ProCard>
                      </ProCard>
                    )}
                  </>
                )}
              </div>
              <Row justify="start" align="middle">
                <Col span={6}>
                  <Form.Item label="????????????">
                    <Select
                      style={{ width: 200 }}
                      value={cdmcValue}
                      allowClear
                      placeholder="?????????"
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
                  <div className={styles.noContent}>????????????????????????????????????</div>
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
