/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import ProForm, { ProFormSelect } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { DownOutlined, QuestionCircleOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Form, message, Spin, Modal, Tooltip, Empty } from 'antd';
import { getAllKHKCSJ } from '@/services/after-class/khkcsj';
import { createKHPKSJ } from '@/services/after-class/khpksj';
import { getFJPlan } from '@/services/after-class/fjsj';
import styles from '../index.less';
import ExcelTable from '@/components/ExcelTable';
import type { CourseType } from '../data';
import { history } from 'umi';
import { getQueryString } from '@/utils/utils';
import { getAllKHBJSJ } from '@/services/after-class/khbjsj';

const { confirm } = Modal;

type PropsType = {
  setState?: any;
  curXNXQId?: string;
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
  cdmcData?: any[];
  kcmcData?: any[];
  currentUser?: API.CurrentUser | undefined;
};

const AddArranging: FC<PropsType> = (props) => {
  const {
    setState,
    sameClass,
    curXNXQId,
    tableDataSource,
    processingData,
    setTableDataSource,
    formValues,
    xXSJPZData,
    campus,
    grade,
    setBJIDData,
    cdmcData,
    kcmcData,
    currentUser,
  } = props;
  const [packUp, setPackUp] = useState(false);
  const [Bj, setBj] = useState<any>(undefined);
  const [index, setIndex] = useState(formValues?.BJId);
  const [kcType, setKcType] = useState<any>(kcmcData);
  const [bjData, setBjData] = useState<any>([]);
  const [form] = Form.useForm();
  const [excelTableValue] = useState<any[]>([]);
  const sameClassDatas = [...sameClass];
  const [loading, setLoading] = useState(true);
  const [CDLoading, setCDLoading] = useState(false);
  const [XQID, setXQID] = useState<any>('');
  const [NJID, setNJID] = useState<any>('');
  const [tearchId, setTearchId] = useState('');
  const [basicData, setBasicData] = useState<any>([]);

  useEffect(() => {
    if (formValues) {
      // 如果后查询的课程列表不存在此记录，则加到第一个
      if (!kcmcData?.find(n => n.value === formValues.KHKCSJId)) {
        kcmcData?.unshift({
          label: formValues.KCMC,
          value: formValues.KC
        })
      }
      setKcType(kcmcData);
    }
  }, [kcmcData, formValues]);

  // 获取排课的接口
  const tableServers = () => {
    const Fjplan = getFJPlan({
      XNXQId: curXNXQId,
      XXJBSJId: currentUser?.xxId,
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

  // 将排好的课程再次点击可以取消
  const getSelectdata = (value: any) => {
    sameClassDatas.map((item: any, key: number) => {
      if (
        item.FJSJId === value.FJSJId && // 教室ID
        item.XXSJPZId === value.XXSJPZId && // 时间ID
        item.WEEKDAY === value.WEEKDAY // 周
      ) {
        sameClassDatas.splice(key, 1);
      }
      return item;
    });
  };

  const onExcelTableClick = (value: any, record: any, pkData: any) => {
    if (value === null) {
      excelTableValue.forEach((item: any, key) => {
        if (
          item.FJSJId === pkData.FJSJId && // 场地ID
          item.KHBJSJId === pkData.KHBJSJId && // 班级ID
          item.XXSJPZId === pkData.XXSJPZId && // 时间ID
          item.WEEKDAY === pkData.WEEKDAY // 周
        ) {
          excelTableValue.splice(key, 1);
        }
      });
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
    const ZJSID = value.KHBJJs?.find((items: any) => items.JSLX === '主教师')?.KHJSSJId;
    const ZJSName = value.KHBJJs?.find((items: any) => items.JSLX === '主教师')?.KHJSSJ?.XM;

    setTearchId(ZJSID);
    const chosenData = {
      cla: value.BJMC || '',
      teacher: ZJSName || '',
      teacherID: ZJSID || '',
      XNXQId: value.XNXQId || '',
      KHBJSJId: value.id || '',
      color: value.KHKCSJ.KBYS || 'rgba(62, 136, 248, 1)',
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
      if (cdmcData && cdmcData?.length > 0) {
        try {
          const data = [...excelTableValue].concat(sameClassDatas);
          const bjIdData: any[] = [index];
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
            setBJIDData('');
            return true;
          }
          if (result.status === 'error') {
            if (result.message === 'Validation error') {
              Modal.error({
                title: '保存失败',
                content: '在同一天的同一时间段内不能排同一个班',
              });
            }
          }
        } catch (err) {
          console.log(err);
          message.error('保存失败');
          return true;
        }
      } else {
        message.warning('请先添加场地在进行排课');
      }
    } else {
      message.warning('请先选择班级后再进行排课');
    }
    return true;
  };
  const onReset = (prop: any) => {
    const bjID = getQueryString('courseId');
    if (bjID) {
      history.goBack();
    } else {
      tableServers();
      setState(true);
      setBJIDData('');
    }
  };
  useEffect(() => {
    async function fetchData() {
      try {
        // 获取所有班级数据
        const bjList = await getAllKHBJSJ({
          XNXQId: curXNXQId,
          page: 1,
          pageSize: 0,
          name: '',
          bjzt: ['待开班'],
        });
        if (bjList.status === 'ok') {
          setBjData(bjList.data.rows);

          bjList.data.rows?.forEach((item: any) => {
            if (index === item.id) {
              BjClick(item);
            }
          });
        }
        // 获取所有课程数据
        const kcList = await getAllKHKCSJ({
          XNXQId: curXNXQId,
          XXJBSJId: currentUser?.xxId,
          page: 1,
          pageSize: 0,
          isRequired: false,
        });
        if (kcList.status === 'ok') {
          const data: any = [].map.call(kcList.data.rows, (item: CourseType) => {
            return {
              label: item.KCMC,
              value: item.id,
            };
          });
          setKcType(data);
        } else {
          message.error(kcList.message);
        }

        const Fjplan = await getFJPlan({
          XNXQId: curXNXQId,
          XXJBSJId: currentUser?.xxId,
          isPk: false,
        });
        if (Fjplan.status === 'ok') {
          setBasicData(Fjplan.data);
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
              XNXQId: curXNXQId,
              XXJBSJId: currentUser?.xxId,
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
                  <Button
                    key="submit"
                    style={{
                      border: '1px solid #3E88F8 ',
                      marginRight: 8,
                      background: '#3E88F8',
                      color: '#fff',
                    }}
                    onClick={() => Props.form?.submit?.()}
                  >
                    保存
                  </Button>,
                  <Button
                    style={{
                      border: '1px solid #F04D4D ',
                      marginRight: 8,
                      background: '#F04D4D',
                      color: '#fff',
                    }}
                    onClick={showDeleteConfirm}
                  >
                    清除
                  </Button>,
                  <Button
                    key="rest"
                    style={{ border: '1px solid #EAEDEE ', background: '#EAEDEE', color: '#999' }}
                    onClick={() => onReset(Props)}
                  >
                    取消
                  </Button>,
                ];
              },
            }}
          >
            <ProFormSelect
              label="校区"
              width="md"
              name="XQ"
              options={campus || []}
              fieldProps={{
                async onChange(value: any, option: any) {
                  form.setFieldsValue({ NJ: undefined, KC: undefined });
                  setXQID(value);
                  const params = {
                    xqId: value || '',
                    XNXQId: curXNXQId,
                    XXJBSJId: currentUser?.xxId,
                    page: 1,
                    pageSize: 0,
                    name: '',
                  };
                  // 获取课程的数据
                  const kcList = await getAllKHKCSJ({ ...params, isRequired: true });
                  if (kcList.status === 'ok') {
                    const data: any = [].map.call(kcList.data.rows, (item: CourseType) => {
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
                  const bjList = await getAllKHBJSJ({ ...params, bjzt: ['待开班'] });
                  if (bjList.status === 'ok') {
                    setBjData(bjList.data.rows);
                  }
                },
              }}
            />
            <ProFormSelect
              width="md"
              name="NJ"
              label="年级"
              options={grade || []}
              fieldProps={{
                async onChange(value) {
                  // 年级选择时将选中的课程清空
                  form.setFieldsValue({ KC: undefined });

                  setNJID(value);

                  const params = {
                    xqId: XQID || '',
                    njId: value || '',
                    XNXQId: curXNXQId,
                    XXJBSJId: currentUser?.xxId,
                    page: 1,
                    pageSize: 0,
                    name: '',
                  };

                  // 获取课程的数据
                  const kcList = await getAllKHKCSJ({ ...params, isRequired: true });
                  if (kcList.status === 'ok') {
                    const data: any = [].map.call(kcList.data.rows, (item: CourseType) => {
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
                  const bjList = await getAllKHBJSJ({ ...params, bjzt: ['待开班'] });
                  if (bjList.status === 'ok') {
                    setBjData(bjList.data.rows);
                  }
                },
              }}
            />
            <ProFormSelect
              width="md"
              options={kcType || []}
              name="KC"
              label="课程"
              showSearch
              fieldProps={{
                async onChange(value) {
                  const params = {
                    xqId: XQID || '',
                    njId: NJID || '',
                    kcId: value || '',
                    XNXQId: curXNXQId,
                    page: 1,
                    pageSize: 0,
                    name: '',
                  };
                  // 获取班级的数据
                  const bjList = await getAllKHBJSJ({ ...params, bjzt: ['待开班'] });
                  if (bjList.status === 'ok') {
                    setBjData(bjList.data?.rows);
                  }
                },
              }}
            />
            <div className="banji">
              <span>班级：</span>
              {bjData && bjData.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : bjData && bjData.length < 15 ? (
                <ProCard ghost className="banjiCard">
                  {bjData.map((value: any) => {
                    return (
                      <ProCard
                        className="banjiItem"
                        layout="center"
                        bordered
                        onClick={() => BjClick(value)}
                        style={{ borderColor: index === value.id ? 'rgba(62,136,248,1)' : '' }}
                      >
                        <Tooltip title={value.BJMC}>
                          <p>{value.BJMC}</p>
                        </Tooltip>
                        <span>
                          {value?.KHBJJs?.find((items: any) => items.JSLX === '主教师')?.KHJSSJ?.XM}
                          {/* <WWOpenDataCom
                              style={{ color: '#666' }}
                              type="userName"
                              openid={value.ZJS}
                            /> */}
                        </span>
                        {index === value.id ? <span className="douhao">√</span> : ''}
                      </ProCard>
                    );
                  })}
                </ProCard>
              ) : (
                <div>
                  {packUp === false ? (
                    <ProCard ghost className="banjiCard">
                      {bjData && bjData.length > 0
                        ? bjData.slice(0, 13).map((value: any, key: undefined) => {
                          return (
                            <ProCard
                              layout="center"
                              bordered
                              className="banjiItem"
                              onClick={() => BjClick(value)}
                              style={{
                                borderColor: index === value.id ? 'rgba(62,136,248,1)' : '',
                              }}
                            >
                              <p>{value.BJMC}</p>
                              <span>
                                {
                                  value?.KHBJJs.find((item: any) => item.JSLX === '主教师')
                                    ?.KHJSSJ?.XM
                                }
                                {/* <WWOpenDataCom
                                        style={{ color: '#666' }}
                                        type="userName"
                                        openid={value.ZJS}
                                      /> */}
                              </span>
                              {index === value.id ? <span className="douhao">√</span> : ''}
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
                        ? bjData.map((value: any, key: undefined) => {
                          return (
                            <ProCard
                              layout="center"
                              bordered
                              className="banjiItem"
                              onClick={() => BjClick(value)}
                              style={{
                                borderColor: index === value.id ? 'rgba(62,136,248,1)' : '',
                              }}
                            >
                              <p>{value.BJMC}</p>
                              <span>
                                {
                                  value?.KHBJJs.find((item: any) => item.JSLX === '主教师')
                                    ?.KHJSSJ?.XM
                                }
                                {/* <WWOpenDataCom
                                      style={{ color: '#666' }}
                                      type="userName"
                                      openid={value.ZJS}
                                    /> */}
                              </span>
                              {index === value.id ? <span className="douhao">√</span> : ''}
                            </ProCard>
                          );
                        })
                        : ''}
                      <ProCard layout="center" bordered onClick={unFold} className="unFold">
                        收起 <UpOutlined style={{ color: '#4884FF' }} />
                      </ProCard>
                    </ProCard>
                  )}
                </div>
              )}
            </div>
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
                    tearchId={tearchId}
                    basicData={basicData}
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
