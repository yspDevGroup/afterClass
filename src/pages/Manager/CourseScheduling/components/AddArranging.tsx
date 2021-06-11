/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import ProForm, { ProFormSelect } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Form, message } from 'antd';

import { getAllFJLX } from '@/services/after-class/fjlx';
import { getAllNJSJ } from '@/services/after-class/njsj';
import { allKCsByNJ, allNJs, getAllKHKCSJ } from '@/services/after-class/khkcsj';
import { getAllKHBJSJ } from '@/services/after-class/khbjsj';
import { createKHPKSJ } from '@/services/after-class/khpksj';
import { getFJPlan, getAllFJSJ } from '@/services/after-class/fjsj';

import type { BJType, RoomType, GradeType, SiteType, CourseType } from '../data';
import ExcelTable from '@/components/ExcelTable';
import styles from '../index.less';

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
};

const AddArranging: FC<PropsType> = (props) => {
  const {
    setState,
    xn,
    xq,
    tableDataSource,
    processingData,
    setTableDataSource,
    formValues,
    xXSJPZData,
    campus,
    grade,
  } = props;
  const [packUp, setPackUp] = useState(false);
  const [Bj, setBj] = useState<any>(undefined);
  const [index, setIndex] = useState(formValues?.BJId);
  const [njId, setNjId] = useState(formValues?.NJ);
  const [kcId, setKcId] = useState(formValues?.KC);
  const [cdlxId, setCdlxId] = useState(formValues?.CDLX);
  const [cdmcData, setCdmcData] = useState<any>([]);
  const [roomType, setRoomType] = useState<any>([]);
  const [gradeType, setGradeType] = useState<any>([]);
  const [siteType, setSiteType] = useState<any>([]);
  const [kcType, setKcType] = useState<any>([]);
  const [bjData, setBjData] = useState<any>([]);
  const [form] = Form.useForm();
  const [xQItem, setXQItem] = useState<any>([]);
  const [excelTableValue] = useState<any[]>([]);
  const [bjIdData] = useState<any[]>([]);

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

  const onExcelTableClick = (value: any, record: any, bjId: any) => {
    bjIdData.push(bjId);
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
      color: value.KHKCSJ.KHKCLX.KBYS || 'rgb(81, 208, 129, 1)',
    };

    setBj(chosenData);
    setIndex(value.id);
  };

  const submit = async (params: any) => {
    try {
      // 所选班级ID
      const bj = Array.from(new Set(bjIdData));
      const result = await createKHPKSJ(excelTableValue);
      if (result.status === 'ok') {
        if (excelTableValue.length === 0) {
          message.info('请添加排课信息');
        } else {
          message.success('保存成功');
          window.location.reload();
          return true;
        }
      } else {
        message.error('保存失败');
      }
    } catch (err) {
      console.log(err);
      message.error('保存失败');
      return true;
    }

    return true;
  };
  const onReset = (prop: any) => {
    prop.form?.resetFields();
    window.location.reload();
  };
  useEffect(() => {
    async function fetchData() {
      try {
        // 获取所有年级数据
        const result = await getAllNJSJ();
        if (result.status === 'ok') {
          if (result.data && result.data.length > 0) {
            const data: any = [].map.call(result.data, (item: GradeType) => {
              return {
                label: item.NJMC,
                value: item.id,
              };
            });
            setGradeType(data);
          }
        } else {
          message.error(result.message);
        }

        // 获取所有班级数据
        const bjList = await getAllKHBJSJ({
          kcId: kcId === undefined ? '' : kcId,
          njId: njId === undefined ? '' : njId,
          xn,
          xq,
          page: 0,
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
          page: 0,
          pageCount: 0,
          name: '',
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
          page: 0,
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
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (formValues) {
      form.setFieldsValue(formValues);
    }
  }, [formValues]);
  return (
    <div style={{ background: '#FFFFFF' }}>
      <p className="xinzen"> {formValues ? '编辑排课' : '新增排课'}</p>
      <ProForm
        className="ArrangingFrom"
        name="validate_other"
        layout="horizontal"
        form={form}
        onFinish={submit}
        submitter={{
          render: (Props) => {
            return [
              <Button key="rest" onClick={() => onReset(Props)}>
                取消
              </Button>,
              <Button key="submit" onClick={() => Props.form?.submit?.()}>
                保存
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
            onChange(value) {
              console.log('setXQItem', value);

              setXQItem(value);
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
              if (!value) {
                // 获取所有年级数据
                const result = await getAllNJSJ();
                if (result.status === 'ok') {
                  if (result.data && result.data.length > 0) {
                    const data: any = [].map.call(result.data, (item: GradeType) => {
                      return {
                        label: item.NJMC,
                        value: item.id,
                      };
                    });
                    setGradeType(data);
                  }
                }
              }

              // 年级选择时将选中的课程清空
              form.setFieldsValue({ KC: undefined });

              // 获取班级的数据
              const bjList = await getAllKHBJSJ({
                kcId: value ? kcId : '',
                njId: value || '',
                xn,
                xq,
                page: 0,
                pageCount: 0,
                name: '',
              });
              setBjData(bjList.data);

              // 根据班级ID 获取课程数据
              const parma = {
                njId: value,
                xn,
                xq,
              };
              const kcList = await allKCsByNJ(parma);
              if (kcList.status === 'ok') {
                if (kcList.data?.length === 0) {
                  setKcType([]);
                  setNjId(undefined);
                } else if (kcList.data && kcList.data.length > 0) {
                  const kcData = kcList.data.map((item: any) => ({
                    label: item.KCMC,
                    value: item.id,
                  }));
                  setKcType(kcData);
                  setNjId(value);
                }
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
              // 获取班级的数据
              const bjList = await getAllKHBJSJ({
                kcId: value || '',
                njId: value ? njId : '',
                xn: value ? '' : xn,
                xq: value ? '' : xq,
                page: 0,
                pageCount: 0,
                name: '',
              });
              setBjData(bjList.data);

              if (value) {
                // 根据班级ID获取年级的数据
                const njList = await allNJs({ id: value });
                if (njList.status === 'ok') {
                  if (njList.data?.length === 0) {
                    setGradeType([]);
                    setKcId(undefined);
                  } else if (njList.data && njList.data.length > 0) {
                    const njData = njList.data.map((item: any) => ({
                      label: item.NJMC,
                      value: item.id,
                    }));
                    setGradeType(njData);
                    setKcId(value);
                  }
                }
              } else {
                // 获取所有年级数据
                const result = await getAllNJSJ();
                if (result.status === 'ok') {
                  if (result.data && result.data.length > 0) {
                    const data: any = [].map.call(result.data, (item: GradeType) => {
                      return {
                        label: item.NJMC,
                        value: item.id,
                      };
                    });
                    setGradeType(data);
                  }
                }
              }
            },
          }}
        />
        <div className="banji">
          <span>班级：</span>
          {bjData && bjData.length < 15 ? (
            <ProCard ghost className="banjiCard">
              {bjData.map(
                (value: { BJMC: any; ZJS: any; id?: string | undefined }, key: undefined) => {
                  return (
                    <ProCard
                      layout="center"
                      bordered
                      onClick={() => BjClick(value)}
                      style={{ borderColor: index === value.id ? '#51d081' : '' }}
                    >
                      <p>{value.BJMC}</p>
                      <span>{value.ZJS}</span>
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
                                style={{ borderColor: index === key ? '#51d081' : '' }}
                              >
                                <p>{value.BJMC}</p>
                                <span>{value.ZJS}</span>
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
                              style={{ borderColor: index === key ? '#51d081' : '' }}
                            >
                              <p>{value.BJMC}</p>
                              <span>{value.ZJS}</span>
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
                page: 0,
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
              setCdmcData(value);
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
            <ExcelTable
              className={styles.borderTable}
              columns={columns}
              dataSource={tableDataSource}
              chosenData={Bj}
              onExcelTableClick={onExcelTableClick}
              type="edit"
            />
          ) : (
            <div className={styles.noContent}>请先选择班级后再进行排课</div>
          )}
        </div>
      </ProForm>
    </div>
  );
};

export default AddArranging;
