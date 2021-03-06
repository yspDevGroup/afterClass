/* eslint-disable no-lonely-if */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
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
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { getAuthorization } from '@/utils/utils';
import ShowName from '@/components/ShowName';
import { createKHPKSJ } from '@/services/after-class/khpksj';
import { getAllClasses } from '@/services/after-class/khbjsj';
import type { DataSourceType } from '@/components/ExcelTable';
import { getAllGrades } from '@/services/after-class/khjyjg';
import { getAllCourses } from '@/services/after-class/khkcsj';
import { getAllPK } from '@/services/after-class/khpksj';
import styles from '../index.less';
import '../index.less';
import noJF from '@/assets/noJF.png';
import moment from 'moment';
import ExcelTable4 from '@/components/ExcelTable4';
import { classSchedule } from '@/services/after-class/khpksj';

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
  Weeks: any;
};

const AddArrangingZ: FC<PropsType> = (props) => {
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
    Weeks,
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
      width: 66,
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

  const showConfirm = () => {
    confirm({
      title: '????????????????????????????????????????????????????????????????????????????????? ',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        if (Bj?.id) {
          const parameter = {
            bjIds: [Bj?.id],
            data: [],
          };
          const result = createKHPKSJ(parameter);
          Promise.resolve(result).then((data) => {
            if (data.status === 'ok') {
              message.success('??????????????????????????????');
              setCDLoading(false);
              CDgetPKData();
            }
          });
        }
      },
      okButtonProps: {
        type: 'primary',
        danger: true,
      },
    });
  };
  /* ?????????????????????????????????(*)????????????
   * begin: ????????????
   * end???????????????
   * weekNum???????????? {number}
   */
  function getWeek(begin: any, end: any, weekNum: any) {
    const dateArr = new Array();
    const stimeArr = begin.split('-'); //= >["2018", "01", "01"]
    const etimeArr = end.split('-'); //= >["2018", "01", "30"]
    const stoday = new Date();
    stoday.setUTCFullYear(stimeArr[0], stimeArr[1] - 1, stimeArr[2]);
    const etoday = new Date();
    etoday.setUTCFullYear(etimeArr[0], etimeArr[1] - 1, etimeArr[2]);

    const unixDb = stoday.getTime(); // ????????????????????????
    const unixDe = etoday.getTime(); // ????????????????????????

    for (let k = unixDb; k <= unixDe; ) {
      const needJudgeDate = msToDate(parseInt(k, 10)).withoutTime;

      // ????????????if????????????push?????????????????????????????????????????????
      if (new Date(needJudgeDate).getDay() === Number(weekNum)) {
        dateArr.push(needJudgeDate);
      }
      k += 24 * 60 * 60 * 1000;
    }
    return dateArr;
  }

  // ???????????????????????????
  function msToDate(msec: string | number | Date) {
    const datetime = new Date(msec);
    const year = datetime.getFullYear();
    const month = datetime.getMonth();
    const date = datetime.getDate();
    const hour = datetime.getHours();
    const minute = datetime.getMinutes();
    const second = datetime.getSeconds();

    const result1 = `${year}-${month + 1 >= 10 ? month + 1 : `0${month + 1}`}-${
      date + 1 < 10 ? `0${date}` : date
    } ${hour + 1 < 10 ? `0${hour}` : hour}:${minute + 1 < 10 ? `0${minute}` : minute}:${
      second + 1 < 10 ? `0${second}` : second
    }`;

    const result2 = `${year}-${month + 1 >= 10 ? month + 1 : `0${month + 1}`}-${
      date + 1 < 11 ? `0${date}` : date
    }`;

    const result = {
      hasTime: result1,
      withoutTime: result2,
    };

    return result;
  }

  // ??????????????????????????????
  const fn = (arr: string | any[]) => {
    // eslint-disable-next-line no-var
    const results = [];
    let i;
    let j;
    for (i = 0; i < arr.length; i++) {
      for (j = i + 1; j < arr.length; j++) {
        if (arr[i].WEEKDAY === arr[j].WEEKDAY && arr[i].XXSJPZId === arr[j].XXSJPZId) {
          j = ++i;
        }
      }
      results.push(arr[i]);
    }
    return results;
  };
  const onExcelTableClick = async (value: any, record: any, pkData: any) => {
    // setLoading(true);
    const result = await classSchedule({
      id: Bj.KHBJSJId,
    });
    const newPkDatas: any[] = [];
    pkData.forEach((item: any) => {
      const newObj = {
        ...item,
        FJSJId: cdmcValue,
        XNXQId: curXNXQId,
        WEEKDAY: item.WEEKDAY === '0' ? '7' : item.WEEKDAY,
      };
      newPkDatas.push(newObj);
    });
    if (result?.status === 'ok') {
      // ?????????????????????????????????
      if (
        result?.data?.KHPKSJs?.find(
          (items: any) => items?.PKTYPE === 0 || items?.PKTYPE === 2 || items?.PKTYPE === 3,
        )
      ) {
        showConfirm();
      } else {
        if (value?.Type === '??????') {
          if (result?.data?.ISFW === 1) {
            const datas = fn(result?.data?.KHPKSJs);
            if (datas?.length < result?.data?.KSS) {
              const PkArr = newPkDatas;
              result?.data?.KHPKSJs?.forEach((item: any) => {
                const { FJSJId, KHBJSJId, PKBZ, XNXQId, RQ, XXSJPZId, WEEKDAY } = item;
                PkArr?.push({
                  FJSJId,
                  KHBJSJId,
                  PKBZ,
                  XNXQId,
                  RQ,
                  XXSJPZId,
                  WEEKDAY,
                  PKTYPE: value?.PKTYPE,
                });
              });
              PkArr.forEach((value1: any) => {
                if (value1.WEEKDAY === '7') {
                  value1.WEEKDAY = '0';
                }
              });
              const res = await createKHPKSJ({
                bjIds: [value?.KHBJSJId],
                data: PkArr,
              });
              if (res?.status === 'ok') {
                setLoading(false);
                CDgetPKData();
              } else {
                message.warning(res.message);
              }
            } else {
              message.warning('?????????????????????????????????');
            }
          } else {
            // ????????????????????????????????????????????????????????????????????????
            const datas = fn(result?.data?.KHPKSJs);
            if (datas?.length === 0) {
              // ????????????????????????????????????
              const surplusKs = result?.data?.KSS - result?.data?.KHPKSJs?.length;
              if (surplusKs > 0) {
                // ????????????????????????????????????????????????
                const PkArr = newPkDatas.slice(0, surplusKs);
                result?.data?.KHPKSJs?.forEach((item: any) => {
                  const { FJSJId, KHBJSJId, PKBZ, XNXQId, RQ, XXSJPZId, WEEKDAY } = item;
                  PkArr?.push({
                    FJSJId,
                    KHBJSJId,
                    PKBZ,
                    XNXQId,
                    RQ,
                    XXSJPZId,
                    WEEKDAY,
                    PKTYPE: value?.PKTYPE,
                  });
                });
                PkArr.forEach((value1: any) => {
                  if (value1.WEEKDAY === '7') {
                    value1.WEEKDAY = '0';
                  }
                });
                const res = await createKHPKSJ({
                  bjIds: [value?.KHBJSJId],
                  data: PkArr,
                });
                if (res?.status === 'ok') {
                  setLoading(false);
                  CDgetPKData();
                }
              }
            } else {
              // ?????????????????????????????????
              const YPKS = Math.floor(result?.data?.KSS / (datas?.length + 1));
              const DUKS = result?.data?.KSS % (datas?.length + 1);
              const PkArr = newPkDatas.slice(0, YPKS);
              datas.forEach((values: any) => {
                const arr1 = result?.data?.KHPKSJs?.filter((items: any) => {
                  return values.WEEKDAY === items.WEEKDAY && values.XXSJPZId === items.XXSJPZId;
                });
                arr1.forEach((value1: any, inx: number) => {
                  if (inx < YPKS) {
                    PkArr.push(value1);
                  }
                });
              });
              const datass = fn(PkArr);
              const sortArray = (n1: any, n2: any) => {
                return (
                  Number(
                    `${n1?.WEEKDAY === '0' ? '7' : n1.WEEKDAY}${n1?.XXSJPZ?.KSSJ.substring(
                      0,
                      5,
                    ).replace(':', '')}`,
                  ) -
                  Number(
                    `${n2?.WEEKDAY === '0' ? '7' : n2.WEEKDAY}${n2?.XXSJPZ?.KSSJ.substring(
                      0,
                      5,
                    ).replace(':', '')}`,
                  )
                );
              };
              datass.sort(sortArray);
              if (DUKS !== 0 && DUKS <= datass?.length && YPKS < pkData?.length) {
                datass.forEach((val3: any, index: number) => {
                  const { FJSJId, KHBJSJId, XNXQId, XXSJPZId, WEEKDAY, PKBZ } = val3;
                  if (index < DUKS) {
                    PkArr?.push({
                      FJSJId,
                      KHBJSJId,
                      PKBZ: `???${Number(PKBZ?.replace(/[^0-9]/gi, '')) + 1}???`,
                      XNXQId,
                      RQ: getWeek(
                        moment(result?.data?.KKRQ).format('YYYY-MM-DD'),
                        moment(result?.data?.JKRQ).format('YYYY-MM-DD'),
                        WEEKDAY,
                      )[YPKS],
                      XXSJPZId,
                      WEEKDAY: WEEKDAY === '7' ? '0' : WEEKDAY,
                      PKTYPE: 1,
                    });
                  }
                });
              }
              PkArr.forEach((value1: any) => {
                if (value1.WEEKDAY === '7') {
                  value1.WEEKDAY = '0';
                }
              });
              const res = await createKHPKSJ({
                bjIds: [value?.KHBJSJId],
                data: PkArr,
              });
              if (res?.status === 'ok') {
                CDgetPKData();
              }
            }
          }
        } else {
          // ????????????
          const PkArr: any[] = [];
          const newArr = result?.data?.KHPKSJs.filter((items: any) => {
            return items?.WEEKDAY !== value?.WEEKDAY || items?.XXSJPZId !== value?.XXSJPZId;
          });
          newArr?.forEach((item: any) => {
            const { FJSJId, KHBJSJId, PKBZ, XNXQId, RQ, XXSJPZId, WEEKDAY } = item;
            PkArr?.push({
              FJSJId,
              KHBJSJId,
              PKBZ,
              XNXQId,
              RQ,
              XXSJPZId,
              WEEKDAY,
              PKTYPE: value?.PKTYPE,
            });
          });
          const res = await createKHPKSJ({
            bjIds: [value?.KHBJSJId],
            data: PkArr,
          });
          if (res?.status === 'ok') {
            CDgetPKData();
          }
        }
      }
    } else {
      message.warning(result.message);
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
    // ???????????????????????????
    const result = await classSchedule({
      id: value.id,
    });
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
        KKRQ: value?.KKRQ,
        JKRQ: value?.JKRQ,
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
        KKRQ: value?.KKRQ,
        JKRQ: value?.JKRQ,
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
              message.success('??????????????????????????????');
              setCDLoading(false);
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
                  <ExcelTable4
                    className={styles.borderTable}
                    columns={columns}
                    dataSource={newTableDataSource}
                    chosenData={Bj}
                    onExcelTableClick={onExcelTableClick}
                    type="edit"
                    // getSelectdata={getSelectdata}
                    tearchId={tearchId}
                    TimeData={TimeData}
                    xXSJPZData={xXSJPZData}
                    Weeks={Weeks}
                    style={{
                      height: '100%',
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

export default AddArrangingZ;
