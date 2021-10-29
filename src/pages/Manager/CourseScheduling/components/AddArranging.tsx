/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import { history } from 'umi';
import { Button, Form, message, Spin, Modal, Tooltip, Empty, Select } from 'antd';
import ProForm, { ProFormSelect } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { DownOutlined, QuestionCircleOutlined, UpOutlined } from '@ant-design/icons';
import { getQueryString } from '@/utils/utils';
import ExcelTable from '@/components/ExcelTable';
import WWOpenDataCom from '@/components/WWOpenDataCom';
import { getAllCourses } from '@/services/after-class/khkcsj';
import { createKHPKSJ } from '@/services/after-class/khpksj';
import { getFJPlan, getAllFJSJ } from '@/services/after-class/fjsj';
import { getAllClasses } from '@/services/after-class/khbjsj';
import type { DataSourceType } from '@/components/ExcelTable';

const { Option } = Select;

import styles from '../index.less';

const { confirm } = Modal;
type selectType = { label: string; value: string };

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
    // tableDataSource,
    processingData,
    setTableDataSource,
    formValues,
    xXSJPZData,
    campus,
    grade,
    setBJIDData,
    // cdmcData,
    kcmcData,
    currentUser,
  } = props;

  const [packUp, setPackUp] = useState(false);
  const [Bj, setBj] = useState<any>(undefined);
  const [index, setIndex] = useState(formValues?.BJId);
  const [kcType, setKcType] = useState<any>(kcmcData);
  const [oriSource, setOriSource] = useState<any>();
  const [bjData, setBjData] = useState<any>([]);
  const [form] = Form.useForm();
  const [excelTableValue, setExcelTableValue] = useState<any[]>([]);
  const sameClassDatas = [...sameClass];
  const [loading] = useState(false);
  const [CDLoading, setCDLoading] = useState(false);
  const [XQID, setXQID] = useState<any>('');
  const [NJID, setNJID] = useState<any>(undefined);
  const [tearchId, setTearchId] = useState(undefined);
  // const [basicData, setBasicData] = useState<any>([]);
  const [cdmcData, setCdmcData] = useState<selectType[] | undefined>([]);
  const [cdmcValue, setCdmcValue] = useState<any>();
  const [newTableDataSource, setNewTableDataSource] = useState<DataSourceType>([]);

  // console.log('oriSource',oriSource);

  // 获取排课的接口
  const tableServers = () => {
    // const Fjplan = getFJPlan({
    //   XNXQId: curXNXQId,
    //   XXJBSJId: currentUser?.xxId,
    //   isPk: false,
    // });
    // Promise.resolve(Fjplan).then((FjplanData) => {
    //   if (FjplanData.status === 'ok') {

    //     // setTableDataSource(datad);
    //   }
    // });
    const datad: any = processingData(oriSource, xXSJPZData);
    setTableDataSource(datad);
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
    console.log('getSelectdata', value);
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
    console.log('onExcelTableClick', value);
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
  const BjClick = (value: any, flag: boolean = false) => {
    // console.log('sameClassDatas',sameClassDatas);
    if (flag) {
      const ZJSID = value.KHBJJs?.find((items: any) => items.JSLX === '主教师')?.JZGJBSJId;
      const ZJSName = value.KHBJJs?.find((items: any) => items.JSLX === '主教师')?.JZGJBSJ?.XM;
      setTearchId(ZJSID);
      const chosenData = {
        cla: value.BJMC || '',
        teacher: ZJSName || '',
        teacherID: ZJSID || '',
        XNXQId: curXNXQId || '',
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
    } else {
      console.log('formValues', formValues);
      if (formValues?.BJId) {
        return;
      }
      if (excelTableValue.length > 0) {
        confirm({
          title: '温馨提示',
          icon: <QuestionCircleOutlined style={{ color: 'red' }} />,
          content: '当前班级选择的排课数据请先保存',
          onOk() {},
        });
      } else {
        const ZJSID = value.KHBJJs?.find((items: any) => items.JSLX === '主教师')?.JZGJBSJId;
        const ZJSName = value.KHBJJs?.find((items: any) => items.JSLX === '主教师')?.JZGJBSJ?.XM;
        setTearchId(ZJSID);
        const chosenData = {
          cla: value.BJMC || '',
          teacher: ZJSName || '',
          teacherID: ZJSID || '',
          XNXQId: curXNXQId || '',
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
      }
    }
  };

  const getPKData = async () => {
    const res = await getFJPlan({
      // kcId: kcmcValue,
      // bjId: bjmcValue,
      fjId: cdmcValue,
      // JSXM: teacher,
      isPk: false,
      XNXQId: curXNXQId,
      XXJBSJId: currentUser?.xxId,
    });
    if (res.status === 'ok') {
      setCDLoading(false);
      setOriSource(res.data);
    }
  };

  // 保存
  const submit = async () => {
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
            //保存成功之后获取排课信息
            getPKData();
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
  const onReset = () => {
    const bjID = getQueryString('courseId');
    if (bjID) {
      history.go(-1);
    } else {
      tableServers();
      setState(true);
      setBJIDData('');
    }
  };
  // 获取课程对应课程班数据信息
  const getBjData = async (kcName?: string) => {
    const bjmcResl = await getAllClasses({
      page: 0,
      pageSize: 0,
      NJSJId: NJID,
      KHKCSJId: kcName,
      XNXQId: curXNXQId,
      BJZT: '待开班',
    });
    if (bjmcResl.status === 'ok') {
      const bjRows = bjmcResl.data.rows;
      setBjData(bjmcResl.data.rows);
      // 获取课程班老师 是否存在
      if (!Bj && index) {
        const value = bjRows?.find((item: { id: string }) => item.id === index);
        console.log('value', value);
        if (value) {
          BjClick(value, true);
        }
      }
      // 判断获取的新课程和当前选中的bj 不匹配时 清掉 bj
      if (Bj && index) {
        console.log('--------');

        const value = bjRows?.find((item: { id: string }) => item.id === index);
        if (!value) {
          setTearchId(undefined);
          setBj(undefined);
          setIndex(undefined);
          setBJIDData(undefined);
          setCDLoading(false);
        }
      }
    }
  };
  // 获取场地信息
  const getCDMCList = async () => {
    console.log('获取场地信息');

    const fjList = await getAllFJSJ({
      page: 1,
      pageSize: 0,
      name: '',
      XXJBSJId: currentUser?.xxId,
    });
    if (fjList.status === 'ok') {
      if (fjList.data?.rows && fjList.data?.rows?.length > 0) {
        const data: any = [].map.call(fjList.data.rows, (item: any) => {
          return { label: item.FJMC, value: item.id };
        });
        // console.log('场地信息',data);

        setCdmcData(data);
      }
    }
  };

  //查询房间占用 情况

  useEffect(() => {
    if (xXSJPZData?.length) {
      if (oriSource) {
        const tableData: any = processingData(oriSource, xXSJPZData);
        console.log('tableData', tableData);

        setNewTableDataSource(tableData);
        // setTableDataSource(tableData);
      }
    }
  }, [oriSource]);

  useEffect(() => {
    getPKData();
  }, [cdmcValue]);

  // 通过课程数据接口拿到所有的课程
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
  useEffect(() => {
    // async function fetchData() {
    //   try {
    //     const Fjplan = await getFJPlan({
    //       XNXQId: curXNXQId,
    //       XXJBSJId: currentUser?.xxId,
    //       isPk: false,
    //     });
    //     if (Fjplan.status === 'ok') {
    //       setBasicData(Fjplan.data);
    //     }
    //   } catch (error) {
    //     message.error('error');
    //   }
    //   setLoading(false);
    // }
    // fetchData();
    getCDMCList();
  }, []);
  useEffect(() => {
    if (formValues) {
      // 如果后查询的课程列表不存在此记录，则加到第一个
      // if (!kcmcData?.find((n) => n.value === formValues.KHKCSJId)) {
      //   kcmcData?.unshift({
      //     label: formValues.KCMC,
      //     value: formValues.KC,
      //   });
      // }
      // setKcType(kcmcData);
      // const selected = bjData?.find((item: { id: string }) => item.id === formValues.BJId);
      // const ZJSID = selected?.KHBJJs?.find((items: any) => items.JSLX === '主教师')?.id;
      // const ZJSName = selected?.KHBJJs?.find((items: any) => items.JSLX === '主教师')?.JZGJBSJ?.XM;
      // setTearchId(ZJSID);
      // const chosenData = {
      //   cla: selected?.BJMC || '',
      //   teacher: ZJSName || '',
      //   teacherID: ZJSID || '',
      //   XNXQId: curXNXQId || '',
      //   KHBJSJId: selected?.id || '',
      //   color: selected?.KHKCSJ?.KBYS || 'rgba(62, 136, 248, 1)',
      // };
      // console.log('chosenData',chosenData);

      // setBj(chosenData);
      form.setFieldsValue(formValues);
    }
  }, [kcmcData, formValues]);

  useEffect(() => {
    getKcData();
    getBjData();
  }, [XQID, NJID]);

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
        // setCDLoading(true);
        // getPKData();
        // setExcelTableValue([]);

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
                // const datad:any = processingData(FjplanData.data, xXSJPZData);
                setExcelTableValue([]);
                // setTableDataSource(datad);
                // setNewTableDataSource(datad)
                getPKData();

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
                    onClick={() => onReset()}
                  >
                    取消
                  </Button>,
                ];
              },
            }}
          >
            <div className={styles.screen} style={{ display: 'flex' }}>
              <ProFormSelect
                label="校区"
                width="md"
                name="XQ"
                disabled={formValues?.BJId}
                options={campus || []}
                fieldProps={{
                  async onChange(value: any) {
                    form.setFieldsValue({ NJ: undefined, KC: undefined });
                    setXQID(value);
                  },
                }}
              />
              <ProFormSelect
                label="年级"
                width="md"
                name="NJ"
                disabled={formValues?.BJId}
                options={grade || []}
                fieldProps={{
                  async onChange(value) {
                    // 年级选择时将选中的课程清空
                    form.setFieldsValue({ KC: undefined });
                    setNJID(value);
                  },
                }}
              />
              <ProFormSelect
                label="课程"
                width="md"
                options={kcType || []}
                name="KC"
                disabled={formValues?.BJId}
                showSearch
                fieldProps={{
                  async onChange(value) {
                    getBjData(value);
                  },
                }}
              />
            </div>
            <Form.Item label="场地名称">
              <Select
                style={{ width: 200 }}
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
            </Form.Item>
            {/* <div>
              <span>场地名称：</span>
                <div>
                 
                </div>
            </div> */}
            <div className="banji">
              <span>课程班：</span>
              {bjData && bjData.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : bjData && bjData.length < 15 ? (
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
                        style={{ borderColor: index === value.id ? 'rgba(62,136,248,1)' : '' }}
                      >
                        <Tooltip title={value.BJMC}>
                          <p>{value.BJMC}</p>
                        </Tooltip>
                        <span>
                          {teacher?.XM === '未知' && teacher?.WechatUserId ? (
                            <WWOpenDataCom
                              style={{ color: '#666' }}
                              type="userName"
                              openid={teacher.WechatUserId}
                            />
                          ) : (
                            teacher?.XM
                          )}
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
                        ? bjData.slice(0, 13).map((value: any) => {
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
                                      ?.JZGJBSJ?.XM
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
                        ? bjData.map((value: any) => {
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
                                      ?.JZGJBSJ?.XM
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
                    dataSource={newTableDataSource}
                    chosenData={Bj}
                    onExcelTableClick={onExcelTableClick}
                    type="edit"
                    getSelectdata={getSelectdata}
                    tearchId={tearchId}
                    basicData={oriSource}
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
