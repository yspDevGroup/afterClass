/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
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
  VerticalAlignBottomOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { getAuthorization } from '@/utils/utils';
import ExcelTable from '@/components/ExcelTable';
import ShowName from '@/components/ShowName';
import {
  createKHPKSJ,
  deleteKHPKSJ,
  addKHPKSJ,
  judgeKHPKSJ,
  classSchedule,
} from '@/services/after-class/khpksj';
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
  curXNXQId?: string;
  processingData: (value: any, timeSlot: any, bjId: string | undefined) => void;
  formValues?: Record<string, any>;
  xXSJPZData?: any;
  campus?: any;
  cdmcData?: any[];
  kcmcData?: any[];
  currentUser?: CurrentUser | undefined;
  setRqDisable: React.Dispatch<any>;
  campusId: string | undefined;
  TimeData: any;
};

const AddArranging: FC<PropsType> = (props) => {
  const {
    curXNXQId,
    campus,
    xXSJPZData,
    currentUser,
    processingData,
    formValues,
    cdmcData,
    kcmcData,
    campusId,
    TimeData,
    setRqDisable,
  } = props;
  const [packUp, setPackUp] = useState(false);
  const [form] = Form.useForm();
  const [CDLoading, setCDLoading] = useState(false);
  const [NJID, setNJID] = useState<any>(undefined);
  const [cdmcValue, setCdmcValue] = useState<any>();
  const [newTableDataSource, setNewTableDataSource] = useState<DataSourceType>([]);
  // ????????????????????????
  const [Bj, setBj] = useState<any>(undefined);
  // ???????????????????????????
  const [bjData, setBjData] = useState<any>([]);
  const [tearchId, setTearchId] = useState(undefined);
  const [kcType, setKcType] = useState<any>(kcmcData);
  // ??????
  const [grade, setGrade] = useState<any>([]);
  // ????????????????????????
  const [CdFalg, setCdFalg] = useState<boolean>(false);
  // ??????
  const [uploadVisible, setUploadVisible] = useState<boolean>(false);
  // ????????????????????????????????????
  const [ImportData, setImportData] = useState<any>([]);
  // ?????????????????????
  const [Class, setClass] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  // ??????????????????
  const [oriSource, setOriSource] = useState<any>([]);

  const columns: {
    title: string;
    dataIndex: string;
    key: string;
    align: 'center' | 'left' | 'right';
    width: number;
  }[] = [
    {
      title: '?????????',
      dataIndex: 'room',
      key: 'room',
      align: 'center',
      width: 100,
    },
    {
      title: '??????',
      dataIndex: 'course',
      key: 'course',
      align: 'center',
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

  const CDgetPKData = async () => {
    setLoading(true);
    const res = await getAllPK({
      XNXQId: curXNXQId,
      XXJBSJId: currentUser?.xxId,
      FJSJId: cdmcValue,
    });
    if (res.status === 'ok') {
      setOriSource(res.data);
      setLoading(false);
    }
  };
  // ??????Table
  const refreshTable = () => {
    const newTableData: any = processingData(oriSource, xXSJPZData, Bj?.id);
    setNewTableDataSource(newTableData);
  };
  const getFirstDay = (date: any) => {
    const day = date.getDay() || 7;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - day);
  };
  const onExcelTableClick = async (value: any, record: any, pkData: any) => {
    setLoading(true);
    if (value) {
      // ?????? ????????????id
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
          endDate: moment(getFirstDay(new Date(pkData?.RQ)))
            .subtract(-6, 'days')
            .format('YYYY-MM-DD'),
        });
      } else {
        res = await judgeKHPKSJ({
          XNXQId: Bj?.XNXQId,
          KHBJSJId: Bj?.KHBJSJId,
          KSS: Class?.KSS,
        });
      }
      if (res?.status === 'ok') {
        const addRes = await addKHPKSJ({
          ...KHPKSJ,
        });
        if (addRes.status === 'ok') {
          CDgetPKData();
        } else {
          message.error(addRes.message);
          CDgetPKData();
        }
      } else {
        CDgetPKData();
        message.warning(res?.message);
      }
    } else {
      const pkId = oriSource.find(
        (item: any) =>
          item?.KHBJSJId === pkData?.KHBJSJId &&
          item?.RQ === pkData?.RQ &&
          item?.XXSJPZId === pkData?.XXSJPZId,
      );
      // ?????? ????????????Id????????????
      if (pkId?.id) {
        const res = await deleteKHPKSJ({
          id: pkId.id,
        });
        if (res?.status === 'ok') {
          CDgetPKData();
        } else {
          setLoading(false);
          message.error(res?.message);
        }
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
  const BjClick = async (value: any) => {
    setClass(value);
    setLoading(true);
    const result = await classSchedule({
      id: value.id,
    });
    if (result?.status === 'ok') {
      setLoading(false);
    }
    // ?????????????????????????????????
    setCdmcValue(undefined);
    const start = new Date(moment(value?.KKRQ).format('YYYY/MM/DD  00:00:00'));
    const end = new Date(moment(value?.JKRQ).format('YYYY/MM/DD  23:59:59'));
    const times = start.getTime() - getFirstDay(new Date(TimeData?.KSRQ)).getTime();
    const time2 = end.getTime() - getFirstDay(new Date(TimeData?.KSRQ)).getTime();
    const startWeek = Number(moment(value?.KKRQ).format('E'));
    const endWeek = Number(moment(value?.JKRQ).format('E'));
    // ????????????????????????????????????????????????????????????
    const startZhou = Math.ceil(times / (7 * 24 * 60 * 60 * 1000));
    const endZhou = Math.ceil(time2 / (7 * 24 * 60 * 60 * 1000));
    setRqDisable([startZhou, endZhou, startWeek, endWeek]);

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
        setCdmcValue(result?.data?.KHPKSJs?.[0]?.FJSJId || '');
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
        setCdmcValue(result?.data?.KHPKSJs?.[0]?.FJSJId || '');
        setCdFalg(false);
      }
    }
  };

  // ??????????????????
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

  // ???????????????????????????????????????
  const getBjData = async (kcName?: string) => {
    if (curXNXQId && campusId) {
      const bjmcResl = await getAllClasses({
        page: 0,
        pageSize: 0,
        NJSJId: NJID,
        KHKCSJId: kcName,
        XNXQId: curXNXQId,
        BJZT: '?????????',
        XQSJId: campusId,
      });
      if (bjmcResl.status === 'ok') {
        const bjRows = bjmcResl.data.rows;
        setBjData(bjRows);
        // ????????????????????? ????????????
        if (!Bj && formValues?.BJId) {
          const value = bjRows?.find((item: { id: string }) => item.id === formValues?.BJId);
          if (value) {
            BjClick(value);
          }
        }
        // ??????????????????????????????????????????bj ???????????? ?????? bj
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
    if (!formValues?.KC) {
      getBjData();
    }
  }, [NJID, curXNXQId, campusId]);
  // ??????????????????
  useEffect(() => {
    form.setFieldsValue({ XQ: campus?.[0]?.value });
  }, [props.campus]);

  // ??????????????????
  const getGradeData = () => {
    const response = getAllGrades({ XD: currentUser?.XD?.split(',') });
    Promise.resolve(response).then((res: any) => {
      if (res.status === 'ok') {
        const optNJ: any[] = [];
        const nj = ['?????????', '??????', '??????', '??????'];
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
  // ?????????????????????????????????
  useEffect(() => {
    getGradeData();
  }, []);

  // ??????
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
              message.success('??????????????????????????????');
              if (cdmcValue) {
                CDgetPKData();
              }
            }
          });
        }
      },
    });
  };

  // ??????????????????????????????
  useEffect(() => {
    if (Bj?.id) {
      refreshTable();
    }
  }, [cdmcValue, Bj]);

  useEffect(() => {
    if (formValues) {
      form.setFieldsValue(formValues);
      getBjData(formValues?.KC);
    }
  }, [formValues]);

  // ??????????????????????????????
  const error = () => {
    Modal.error({
      title: '??????????????????',
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

  useEffect(() => {
    if (ImportData?.length > 0) {
      error();
    }
  }, [ImportData]);

  useEffect(() => {
    if (curXNXQId && campusId) {
      // ????????????????????????
      if (cdmcValue) {
        CDgetPKData();
      }
    }
  }, [curXNXQId, campusId, cdmcValue]);
  useEffect(() => {
    refreshTable();
  }, [oriSource]);

  // ????????????
  const UploadProps: any = {
    name: 'xlsx',
    action: '/api/upload/importSchedule',
    headers: {
      authorization: getAuthorization(),
    },
    beforeUpload(file: any) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      const isType =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel';
      if (!isType) {
        message.error('???????????????????????????!');
        return Upload.LIST_IGNORE;
      }
      if (!isLt2M) {
        message.error('????????????????????????2M');
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    data: {
      XNXQId: curXNXQId,
      KHBJSJId: Bj?.id,
      FJSJId: cdmcValue,
      PKTYPE: 0,
    },
    onChange(info: {
      file: { status: string; name: any; response: any };
      fileList: any;
      event: any;
    }) {
      if (info.file.status === 'done') {
        const code = info.file.response;
        if (code.status === 'ok') {
          setImportData(code?.data);
          message.success(`????????????`);
          setUploadVisible(false);
          CDgetPKData();
        } else {
          message.error(`${code.message}`);
          event?.currentTarget?.onerror(code);
        }
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
        extra={
          <Button
            style={{
              border: '1px solid #F04D4D ',
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
                  label="??????????????????"
                  width="md"
                  name="NJ"
                  options={grade || []}
                  fieldProps={{
                    async onChange(value) {
                      // ???????????????????????????????????????
                      form.setFieldsValue({ KC: undefined });
                      setNJID(value);
                    },
                  }}
                />
              </Col>
              <Col span={6}>
                <ProFormSelect
                  label="??????"
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
              <span>????????????</span>
              {bjData && bjData.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <>
                  {bjData && bjData.length < 17 ? (
                    <ProCard ghost className="banjiCard">
                      {bjData.map((value: any) => {
                        const teacher =
                          value?.KHBJJs?.find((items: any) => items.JSLX === '?????????')?.JZGJBSJ ||
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
                                const zb = value?.KHBJJs.find(
                                  (item: any) => item.JSLX === '?????????',
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
                                const zb = value?.KHBJJs.find(
                                  (item: any) => item.JSLX === '?????????',
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
                </>
              )}
            </div>
            <Form.Item label="?????????">
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
            {Bj && cdmcValue ? (
              <Button
                className="ImportBtn"
                key="button"
                type="primary"
                onClick={() => setUploadVisible(true)}
              >
                <VerticalAlignBottomOutlined /> ??????
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
                    tearchId={tearchId}
                    TimeData={TimeData}
                    xXSJPZData={xXSJPZData}
                    style={{
                      height: 'calc(100vh - 400px)',
                    }}
                  />
                </Spin>
              ) : (
                <div className={styles.noContent}>
                  {' '}
                  <img src={noJF} alt="" /> <p>?????????????????????????????????????????????</p>{' '}
                </div>
              )}
            </div>
          </ProForm>
        </Spin>
      </Card>
      <Modal
        title="????????????"
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
              <Button icon={<UploadOutlined />}>????????????</Button>{' '}
              <span className={styles.messageSpan}>??????????????????</span>
            </Upload>
          </p>
          <div className={styles.messageDiv}>
            <Badge color="#aaa" />
            ?????????????????????????????????
            <a style={{ marginLeft: '16px' }} type="download" href="/template/importSchedule.xlsx">
              ????????????
            </a>
            <br />
            <Badge color="#aaa" />
            ?????????????????????????????????????????????????????????????????????????????????
            <br />
            <Badge color="#aaa" />
            ??????????????????????????????500?????????
          </div>
        </>
      </Modal>
    </div>
  );
};

export default AddArranging;
