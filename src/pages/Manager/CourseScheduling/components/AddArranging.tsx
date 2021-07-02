/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import ProForm, { ProFormSelect } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { DownOutlined, QuestionCircleOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Form, message, Spin, Modal, Tooltip, Empty } from 'antd';
import { getAllFJLX } from '@/services/after-class/fjlx';
import { getAllKHKCSJ } from '@/services/after-class/khkcsj';
import { getAllKHBJSJ } from '@/services/after-class/khbjsj';
import { createKHPKSJ } from '@/services/after-class/khpksj';
import { getFJPlan, getAllFJSJ } from '@/services/after-class/fjsj';
import styles from '../index.less';
import ExcelTable from '@/components/ExcelTable';
import type { SiteType, CourseType } from '../data';
import WWOpenDataCom from '../../ClassManagement/components/WWOpenDataCom';

const { confirm } = Modal;

type PropsType = {
  setState?: any;
  xn?: any;
  xq?: any;
  tableDataSource: any[];
  processingData: (value: any, timeSlot: any) => void;
  setTableDataSource: (value: any) => void;
  formValues?: Record<string, any>;
  xXSJPZData?: any;
  campus?: any;
  grade?: any;
  setCampus: (value: any) => void;
  sameClass?: any;
  setBJIDData?: any;
};

const AddArranging: FC<PropsType> = (props) => {
  const {
    setState,
    sameClass,
    xn,
    xq,
    tableDataSource,
    processingData,
    setTableDataSource,
    formValues,
    xXSJPZData,
    campus,
    grade,
    setBJIDData,
  } = props;
  const [packUp, setPackUp] = useState(false);
  const [Bj, setBj] = useState<any>(undefined);
  const [index, setIndex] = useState(formValues?.BJId);
  const [cdlxId, setCdlxId] = useState(formValues?.CDLX);
  const [roomType, setRoomType] = useState<any>([]);
  const [siteType, setSiteType] = useState<any>([]);
  const [kcType, setKcType] = useState<any>([]);
  const [bjData, setBjData] = useState<any>([]);
  const [form] = Form.useForm();
  const [xQItem, setXQLabelItem] = useState<any>([]);
  const [excelTableValue] = useState<any[]>([]);
  const sameClassDatas = [...sameClass];
  const [loading, setLoading] = useState(true);
  const [CDLoading, setCDLoading] = useState(false);
  const [XQID, setXQID] = useState<any>('');
  const [NJID, setNJID] = useState<any>('');
  // 获取排课的接口
  const tableServers = () => {
    const Fjplan = getFJPlan({
      xn,
      xq,
      isPk: false,
    });
    Promise.resolve(Fjplan).then((FjplanData) => {
      if (FjplanData.status === 'ok') {
        const datad = processingData(FjplanData.data, xXSJPZData);
        setTableDataSource(datad);
      }
    });
  };
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

  const getSelectdata = (value: any) => {
    sameClassDatas.map((item: any, key: number) => {
      if (
        item.FJSJId === value.FJSJId &&
        item.KHBJSJId === value.KHBJSJId &&
        item.WEEKDAY === value.WEEKDAY
      ) {
        sameClassDatas.splice(key, 1);
      }
      return '';
    });
  };

  const onExcelTableClick = (value: any, record: any, bjId: any) => {
    if (value === null) {
      excelTableValue.splice(excelTableValue.length - 1);
    } else {
      excelTableValue.push(value);
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
  const BjClick = (value: any) => {
    const chosenData = {
      cla: value.BJMC || '',
      teacher: value.ZJS || '',
      XNXQId: value.KHKCSJ.XNXQId || '',
      KHBJSJId: value.id || '',
      color: value.KHKCSJ.KHKCLX.KBYS || 'rgba(62, 136, 248, 1)',
    };

    setBj(chosenData);
    setIndex(value.id);
    setBJIDData(value.id);
    setCDLoading(true);
    setTimeout(() => {
      setCDLoading(false);
    }, 500);
  };

  // 保存
  const submit = async (params: any) => {
    if (Bj || index) {
      try {
        const data = [...excelTableValue].concat(sameClassDatas);
        const bjIdData: any[] = [];
        data.forEach((item: any) => {
          bjIdData.push(item.KHBJSJId);
        });
        // 所选班级ID
        const bj = Array.from(new Set(bjIdData));
        const parameter = {
          bjIds: bj,
          data,
        };
        const result = await createKHPKSJ(parameter);
        if (result.status === 'ok') {
          message.success('保存成功');
          tableServers();
          setState(true);
          return true;
        }
        if (result.status === 'error') {
          if (result.message === 'Validation error') {
            message.error('保存失败,排课冲突');
          }
        }
      } catch (err) {
        console.log(err);
        message.error('保存失败');
        return true;
      }
    } else {
      message.warning('请先选择班级后再进行排课');
    }
    return true;
  };
  const onReset = (prop: any) => {
    tableServers();
    setState(true);
    setBJIDData('');
    // window.location.reload();
  };
  useEffect(() => {
    async function fetchData() {
      try {
        // 获取所有班级数据
        const bjList = await getAllKHBJSJ({
          xn,
          xq,
          page: 1,
          pageCount: 0,
          name: '',
        });
        setBjData(bjList.data);
        if (bjList.status === 'ok') {
          bjList.data?.map((item: any) => {
            if (index === item.id) {
              BjClick(item);
            }
            return '';
          });
        }
        // 获取所有课程数据
        const kcList = await getAllKHKCSJ({
          xn,
          xq,
          page: 1,
          pageCount: 0,
          name: '',
          isReuired: false,
        });
        if (kcList.status === 'ok') {
          const data: any = [].map.call(kcList.data, (item: CourseType) => {
            return {
              label: item.KCMC,
              value: item.id,
            };
          });
          setKcType(data);
        } else {
          message.error(kcList.message);
        }

        // 获取所有场地类型
        const response = await getAllFJLX({
          name: '',
        });
        if (response.status === 'ok') {
          if (response.data && response.data.length > 0) {
            const data: any = [].map.call(response.data, (item: RoomType) => {
              return {
                label: item.FJLX,
                value: item.id,
              };
            });
            setRoomType(data);
          }
        } else {
          message.error(response.message);
        }

        // 获取所有场地数据
        const fjList = await getAllFJSJ({
          lxId: cdlxId === undefined ? '' : cdlxId,
          page: 1,
          pageCount: 0,
          name: '',
        });
        if (fjList.status === 'ok') {
          if (fjList.data && fjList.data.length > 0) {
            const data: any = [].map.call(fjList.data, (item: SiteType) => {
              return {
                label: item.FJMC,
                value: item.id,
              };
            });
            setSiteType(data);
          }
        } else {
          message.error(fjList.message);
        }

        // 查询房间占用情况
        const Fjplan = await getFJPlan({
          lxId: cdlxId === undefined ? '' : cdlxId,
          fjId: formValues?.CDMC,
          xn,
          xq,
          isPk: false,
        });
        if (Fjplan.status === 'ok') {
          const data = processingData(Fjplan.data, xXSJPZData);
          setTableDataSource(data);
        }
      } catch (error) {
        message.error('error');
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (formValues) {
      form.setFieldsValue(formValues);
    }
  }, [formValues]);

  // 清除
  const showDeleteConfirm = () => {
    confirm({
      title: '温馨提示',
      icon: <QuestionCircleOutlined style={{ color: 'red' }} />,
      content: '将会清除当前班级已排好的所有课程，您确定要继续吗？',
      onOk() {
        const parameter = {
          bjIds: [index],
          data: [],
        };
        const result = createKHPKSJ(parameter);
        setCDLoading(true);
        Promise.resolve(result).then((data) => {
          if (data.status === 'ok') {
            setCDLoading(false);
            const Fjplan = getFJPlan({
              xn,
              xq,
              isPk: false,
            });
            Promise.resolve(Fjplan).then((FjplanData) => {
              if (FjplanData.status === 'ok') {
                const datad = processingData(FjplanData.data, xXSJPZData);
                setTableDataSource(datad);
                message.success('清除成功');
              }
            });
          }
        });
      },
    });
  };
  return (
    <div style={{ background: '#FFFFFF' }}>
      <p className="xinzen"> {formValues && formValues.BJId ? '编辑排课' : '新增排课'}</p>
      <Spin spinning={loading} style={{ height: '100vh' }} size="large">
        {!loading ? (
          <ProForm
            className="ArrangingFrom"
            name="validate_other"
            layout="horizontal"
            form={form}
            onFinish={submit}
            submitter={{
              render: (Props) => {
                return [
                  <Button key="rest" style={{ marginRight: 8 }} onClick={() => onReset(Props)}>
                    取消
                  </Button>,
                  <Button
                    key="submit"
                    style={{ marginRight: 8 }}
                    onClick={() => Props.form?.submit?.()}
                  >
                    保存
                  </Button>,
                  <Button danger onClick={showDeleteConfirm}>
                    清除
                  </Button>,
                ];
              },
            }}
          >
            <ProFormSelect
              label="校区"
              width="md"
              name="XQ"
              options={campus}
              fieldProps={{
                async onChange(value: any, option: any) {
                  form.setFieldsValue({ NJ: undefined, KC: undefined });

                  setXQLabelItem(option?.label);
                  setXQID(value);

                  const params = {
                    xqId: value || '',
                    xn,
                    xq,
                    page: 1,
                    pageCount: 0,
                    name: '',
                  };
                  // 获取课程的数据
                  const kcList = await getAllKHKCSJ({ ...params, isReuired: true });
                  if (kcList.status === 'ok') {
                    const data: any = [].map.call(kcList.data, (item: CourseType) => {
                      return {
                        label: item.KCMC,
                        value: item.id,
                      };
                    });
                    setKcType(data);
                  } else {
                    message.error(kcList.message);
                  }
                  // 获取班级的数据
                  const bjList = await getAllKHBJSJ(params);
                  if (bjList.status === 'ok') {
                    setBjData(bjList.data);
                  }
                },
              }}
            />
            <ProFormSelect
              width="md"
              name="NJ"
              label="年级"
              options={grade ? grade[xQItem] : ''}
              fieldProps={{
                async onChange(value) {
                  // 年级选择时将选中的课程清空
                  form.setFieldsValue({ KC: undefined });

                  setNJID(value);

                  const params = {
                    xqId: XQID || '',
                    njId: value || '',
                    xn,
                    xq,
                    page: 1,
                    pageCount: 0,
                    name: '',
                  };

                  // 获取课程的数据
                  const kcList = await getAllKHKCSJ({ ...params, isReuired: true });
                  if (kcList.status === 'ok') {
                    const data: any = [].map.call(kcList.data, (item: CourseType) => {
                      return {
                        label: item.KCMC,
                        value: item.id,
                      };
                    });
                    setKcType(data);
                  } else {
                    message.error(kcList.message);
                  }
                  // 获取班级的数据
                  const bjList = await getAllKHBJSJ(params);
                  if (bjList.status === 'ok') {
                    setBjData(bjList.data);
                  }
                },
              }}
            />
            <ProFormSelect
              width="md"
              options={kcType}
              name="KC"
              label="课程"
              showSearch
              fieldProps={{
                async onChange(value) {
                  const params = {
                    xqId: XQID || '',
                    njId: NJID || '',
                    kcId: value || '',
                    xn,
                    xq,
                    page: 1,
                    pageCount: 0,
                    name: '',
                  };
                  // 获取班级的数据
                  const bjList = await getAllKHBJSJ(params);
                  setBjData(bjList.data);
                },
              }}
            />
            <div className="banji">
              <span>班级：</span>
              {bjData && bjData.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : bjData && bjData.length < 15 ? (
                <ProCard ghost className="banjiCard">
                  {bjData.map(
                    (value: { BJMC: any; ZJS: any; id?: string | undefined }, key: undefined) => {
                      return (
                        <ProCard
                          layout="center"
                          bordered
                          onClick={() => BjClick(value)}
                          style={{ borderColor: index === value.id ? 'rgba(36,54,81,1)' : '' }}
                        >
                          <Tooltip title={value.BJMC}>
                            <p>{value.BJMC}</p>
                          </Tooltip>
                          <span>
                            <WWOpenDataCom type="userName" openid={value.ZJS} />
                          </span>
                        </ProCard>
                      );
                    },
                  )}
                </ProCard>
              ) : (
                <div>
                  {packUp === false ? (
                    <ProCard ghost className="banjiCard">
                      {bjData && bjData.length > 0
                        ? bjData
                            .slice(0, 13)
                            .map(
                              (
                                value: { BJMC: any; ZJS: any; id?: string | undefined },
                                key: undefined,
                              ) => {
                                return (
                                  <ProCard
                                    layout="center"
                                    bordered
                                    onClick={() => BjClick(value)}
                                    style={{ borderColor: index === key ? 'rgba(36,54,81,1)' : '' }}
                                  >
                                    <p>{value.BJMC}</p>
                                    <span>
                                      <WWOpenDataCom type="userName" openid={value.ZJS} />
                                    </span>
                                  </ProCard>
                                );
                              },
                            )
                        : ''}
                      <ProCard layout="center" bordered onClick={unFold} className="unFold">
                        展开 <DownOutlined style={{ color: '#4884FF' }} />
                      </ProCard>
                    </ProCard>
                  ) : (
                    <ProCard ghost className="banjiCard">
                      {bjData && bjData.length > 0
                        ? bjData.map(
                            (
                              value: { BJMC: any; ZJS: any; id?: string | undefined },
                              key: undefined,
                            ) => {
                              return (
                                <ProCard
                                  layout="center"
                                  bordered
                                  onClick={() => BjClick(value)}
                                  style={{ borderColor: index === key ? 'rgba(36,54,81,1)' : '' }}
                                >
                                  <p>{value.BJMC}</p>
                                  <span>
                                    <WWOpenDataCom type="userName" openid={value.ZJS} />
                                  </span>
                                </ProCard>
                              );
                            },
                          )
                        : ''}
                      <ProCard layout="center" bordered onClick={unFold} className="unFold">
                        收起 <UpOutlined style={{ color: '#4884FF' }} />
                      </ProCard>
                    </ProCard>
                  )}
                </div>
              )}
            </div>
            <ProFormSelect
              width="md"
              options={roomType}
              name="CDLX"
              label="场地类型"
              fieldProps={{
                async onChange(value) {
                  // 场地类型选择时将选中的场地名称清空
                  form.setFieldsValue({ CDMC: undefined });

                  // 获取场地的数据
                  const fjList = await getAllFJSJ({
                    lxId: value,
                    page: 1,
                    pageCount: 0,
                    name: '',
                  });
                  if (fjList.status === 'ok') {
                    const data: any = [].map.call(fjList.data, (item: SiteType) => {
                      return {
                        label: item.FJMC,
                        value: item.id,
                      };
                    });
                    if (data.length > 0) {
                      setSiteType(data);
                      setCdlxId(value);
                    } else if (data.length === 0) {
                      setCdlxId(undefined);
                      setSiteType([]);
                    }
                  } else {
                    message.error(fjList.message);
                  }
                  const Fjplan = await getFJPlan({
                    lxId: value,
                    fjId: '',
                    xn,
                    xq,
                    isPk: false,
                  });
                  if (Fjplan.status === 'ok') {
                    const data = processingData(Fjplan.data, xXSJPZData);
                    setTableDataSource(data);
                  } else {
                    message.error(Fjplan.message);
                  }
                },
              }}
            />
            <ProFormSelect
              width="md"
              options={siteType}
              name="CDMC"
              label="场地名称"
              showSearch
              fieldProps={{
                async onChange(value) {
                  // 查询房间占用情况
                  const Fjplan = await getFJPlan({
                    lxId: cdlxId === undefined ? '' : cdlxId,
                    fjId: value,
                    xn,
                    xq,
                    isPk: false,
                  });
                  if (Fjplan.status === 'ok') {
                    const data = processingData(Fjplan.data, xXSJPZData);
                    setTableDataSource(data);
                  } else {
                    message.error(Fjplan.message);
                  }
                },
              }}
            />

            <div className="site">
              <span>场地：</span>

              {Bj || index ? (
                <Spin spinning={CDLoading}>
                  <ExcelTable
                    className={styles.borderTable}
                    columns={columns}
                    dataSource={tableDataSource}
                    chosenData={Bj}
                    onExcelTableClick={onExcelTableClick}
                    type="edit"
                    getSelectdata={getSelectdata}
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
    </div>
  );
};

export default AddArranging;
