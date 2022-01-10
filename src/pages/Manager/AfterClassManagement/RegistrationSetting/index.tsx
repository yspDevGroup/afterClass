
import PageContain from '@/components/PageContainer';
import ProTable, { EditableProTable } from '@ant-design/pro-table';
import { Select, Space, Form, Spin, Card, Checkbox, Tag, Radio, Button, message, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, useModel } from 'umi';
import { getKHFWBJXSbm } from '@/services/after-class/bjsj';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { queryXNXQList } from '@/services/local-services/xnxq';
import SearchLayout from '@/components/Search/Layout';
import { getAllXQSJ } from '@/services/after-class/xqsj';
import React from 'react';
import { CreateXXJTPZ, getAllXXJTPZ } from '@/services/after-class/xxjtpz';
import { bulkEditIsPay, getKHFWBBySJ } from '@/services/after-class/khfwbj';
import moment from 'moment';
import { getGradesByCampus } from '@/services/after-class/njsj';
import { ExclamationCircleOutlined } from '@ant-design/icons';




type selectType = { label: string; value: string };
const { Option } = Select;


type DataSourceType = {
  id: React.Key;
  name: string;
  KSRQ?: string;
  JSRQ?: string;
  type?: number;
  isEnable: number;
};

const RegistrationSetting = () => {

  // 校区
  const [campusId, setCampusId] = useState<string>();
  const [campusData, setCampusData] = useState<any[]>();
  // 学年学期
  const [curXNXQId, setCurXNXQId] = useState<string | undefined>(undefined);
  const [curXNXQData, setCurXNXQData] = useState<any[]>();
  const actionRef = useRef<ActionType>();
  const actionRefEdit = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [JFLX, setJFLX] = useState<number>(0);
  const [dataSource, setDataSource] = useState<DataSourceType[]>();
  const [dataSourcePay, setDataSourcePay] = useState<any[]>();

  const [initDataSource, setInitDataSource] = useState<DataSourceType[]>();
  const [formRef] = Form.useForm();

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 缴费管理所需的删选 数据
  const [NjId, setNjId] = useState<string>();
  const [NjData, setNjData] = useState<any>();
  const [SDMCValue, setSDMCValue] = useState<string>()
  const [JFZT, setJFZT] = useState<number>();
  // 是否可编辑时间配置   true 不可编辑 false可编辑
  const [disable, setDisable] = useState<boolean>(true);

  const [editDisable, setEditDisable] = useState<boolean>();

  const [isEdit, setIsEdit] = useState<boolean>(false);

  // 获取年级数据
  const getNJSJ = async () => {
    if (campusId) {
      const res = await getGradesByCampus({
        XQSJId: campusId,
      });
      if (res.status === 'ok') {
        setNjData(res.data);
      }
    }
  };

  //获取学年学期
  const getXNXQ = async () => {
    const result = await queryXNXQList(currentUser?.xxId);
    if (result?.current) {
      setCurXNXQId(result?.current?.id);
      setCurXNXQData(result?.data);
    }
  }

  const getCampusData = async () => {
    const res = await getAllXQSJ({
      XXJBSJId: currentUser?.xxId,
    });
    if (res?.status === 'ok') {
      const arr = res?.data?.map((item: any) => {
        return {
          label: item.XQMC,
          value: item.id,
        };
      });
      if (arr?.length) {
        let id = arr?.find((item: any) => item.label === '本校')?.value;
        if (!id) {
          id = arr[0].value;
        }
        setCampusId(id);
      }
      setCampusData(arr);
    }
  };
  useEffect(() => {
    getXNXQ();
    getCampusData()
  }, []);

  const onCampusChange = (value: any) => {
    setCampusId(value);
    setNjId(undefined);
    setJFZT(undefined);
    setSDMCValue(undefined);
  };


  // 学年学期筛选
  const onXNXQChange = (value: string) => {
    curXNXQData?.forEach((item: any) => {
      if (item.id === value) {
        setCurXNXQId(value);
        setNjId(undefined);
        setJFZT(undefined);
        setSDMCValue(undefined);
      }
    })
  }


  // 获取排课时间配置
  const getDetail = async () => {
    setLoading(true);
    const res = await getAllXXJTPZ({
      XNXQId: curXNXQId,
      XQSJId: campusId,
    });
    if (res.status === 'ok') {
      if (res.data?.length === 0) {
        setinitDetail();
      } else {
        const { sjpzstr } = res.data?.[0]
        if (sjpzstr) {
          const str = JSON.parse(sjpzstr); // str:{JFLX:0/1,list:[]}
          if (str) {
            setJFLX(str.JFLX);
            if (str.JFLX === 1) {
              setDataSource(str.list.filter((item: DataSourceType) => item.type === 1))
            }
            setInitDataSource(str.list);
          }
        }
        setLoading(false);
      }
    }
  }
  const getTimeString = (value: any) => {
    if (value) {
      return moment(value).format('YYYY-MM-DD');
    }
    return '';
  }
  const setDetail = async (value: any, JFLXvalue: number) => {
    if (value) {
      setLoading(true);
      const newValue = { JFLX: JFLXvalue, list: value }
      const str = JSON.stringify(newValue);
      const res = await CreateXXJTPZ({
        XQSJId: campusId,
        XNXQId: curXNXQId,
        sjpzstr: str,
      })
      if (res.status === 'ok') {
        getDetail();
        setLoading(false);
      }
    }
  }
  // 初始化 按月配置 时段数据
  const setinitDetail = () => {
    const fwb = curXNXQData?.find((item: any) => item.id === curXNXQId);
    if (fwb) {
      const arr: any = [];
      let KSRQ = new Date(fwb.KSRQ);
      const JSRQ = new Date(fwb.JSRQ);
      while (KSRQ < JSRQ) {
        const tempJSRQ = new Date(KSRQ.getFullYear(), KSRQ.getMonth() + 1, 0);//本月最后一天
        arr.push({ KSRQ: getTimeString(KSRQ), isEnable: 1, type: 0, JSRQ: getTimeString(tempJSRQ), id: (Math.random() * 1000000).toFixed(0), name: `${(moment(KSRQ).month()) + 1}月` })
        if (KSRQ.getMonth() < 11) {
          KSRQ = new Date(KSRQ.setMonth(KSRQ.getMonth() + 1));
          KSRQ = new Date(KSRQ.setDate(1))
        } else if (KSRQ.getMonth() === 11) {
          KSRQ = new Date(KSRQ.setFullYear(KSRQ.getFullYear() + 1))
          KSRQ = new Date(KSRQ.setMonth(0))
          KSRQ = new Date(KSRQ.setDate(1))
        }
      }
      if (KSRQ.getMonth() === JSRQ.getMonth() && KSRQ < JSRQ) {
        //月份相同，补充该月份的记录
        arr.push({ KSRQ: getTimeString(KSRQ), type: 0, isEnable: 1, JSRQ: getTimeString(JSRQ), id: (Math.random() * 1000000).toFixed(0), name: `${(moment(KSRQ).month()) + 1}月` })
      }

      setDetail(arr, 0);
    }
  }

  /**
    * 获取缴费设置列表详情
    */
  const getDataSourcePay = async () => {
    if (curXNXQId && campusId) {
      const obj = {
        XNXQId: curXNXQId,
        XQSJId: campusId,
        NJSJId: NjId,
        isPay: JFZT,
        SDBM: SDMCValue,
        /** 页数 */
        page: 0,
        /** 每页记录数 */
        pageSize: 0,
      };
      const res = await getKHFWBBySJ(obj);
      if (res.status === 'ok') {
        if (res?.data?.rows?.length) {
          setDataSourcePay(res.data.rows);
          if (!NjId && !SDMCValue && !JFZT) {
            setEditDisable(true);
            // setDisable(true);
          }

        } else {
          setDataSourcePay([])
          if (!NjId && !SDMCValue && !JFZT) {
            // setDisable(false);
            setEditDisable(false);
          }
        }
      }
    }
    return [];
  }

  useEffect(() => {
    if (campusId && curXNXQId) {
      getDetail();
      getNJSJ();
      getDataSourcePay();
      setDisable(true);
      setIsEdit(false);
    }
  }, [campusId, curXNXQId])

  useEffect(() => {
    if (campusId && curXNXQId) {
      actionRef.current.clearSelected();
      getDataSourcePay();
    }
  }, [JFZT, SDMCValue, NjId])


  const onEditTableChange = (editableRows: DataSourceType[]) => {
    if (editableRows?.length && initDataSource?.length) {
      const initarr = [...initDataSource];
      editableRows.forEach((item: DataSourceType) => {
        if (!initarr.some((v: DataSourceType) => item.id === v.id)) {
          initarr.push(item);
        } else {
          initarr.forEach((v: DataSourceType) => {
            if (v.id === item.id) {
              // eslint-disable-next-line no-param-reassign
              v = item;
            }
          })
        }
      })
      if (JFLX === 1) {
        setDataSource(initarr.filter((item: DataSourceType) => item.type === 1))
      }

      setInitDataSource(initarr);
    }
  }

  // 按时段配置
  const getEditFromSetting = () => {
    return (
      <EditableProTable<DataSourceType>
        rowKey="id"
        actionRef={actionRefEdit}
        // maxLength={5}
        recordCreatorProps={
          !disable ? {
            position: 'top',
            record: (value: any) => ({ id: (Math.random() * 1000000).toFixed(0), type: 1, ...value }),
          } : false
        }
        options={{
          setting: false,
          fullScreen: false,
          density: false,
          reload: false,
        }}
        search={false}
        headerTitle={
          false
        }
        columns={columns}
        // request={async () => ({
        // 	data: defaultData,
        // 	total: 3,
        // 	success: true,
        // })}
        value={dataSource}
        onChange={onEditTableChange}
        editable={{
          type: 'single',
          form: formRef,
          editableKeys: editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
            // await waitTime(2000);
          },
          // actionRender: (row, config, dom) => [dom.save, dom.cancel]
          onChange: (value: any) => {
            setEditableRowKeys(value);
          }
        }}
      />
    )
  }

  const onCheckBoxClick = (value: boolean, id: React.Key) => {
      console.log('value',value);
    if (initDataSource?.length) {
      const newArr: DataSourceType[]=[];
      initDataSource?.forEach((item: DataSourceType) => {
        const v = { ...item };
        if (item.id === id) {
          v.isEnable = value ? 1 : 0
        } 
        newArr.push(v);
      })
      console.log('newArr',newArr);
      setInitDataSource(newArr);
    }

  }
  // 按月配置
  const getmonthSetting = () => {
    return (
      <Space wrap>
        {
          initDataSource?.filter((item: DataSourceType) => item.type === JFLX).map((item: DataSourceType) =>
            <Checkbox disabled={disable} checked={item?.isEnable === 1} onChange={(value: any) => {
              onCheckBoxClick(value.target.checked, item.id);
            }}><Tag>
                <span style={{ fontSize: '16px' }}>{item.name}</span>
                <span style={{color:'#999'}}>{` ${moment(item.KSRQ).format('MM-DD')}~${moment(item.KSRQ).format('MM-DD')}`}</span>
                </Tag></Checkbox>
          )
        }
      </Space>
    )
  }
  const getSetting = () => {
    if (JFLX === 0) {
      return getmonthSetting()
    } else {
      return getEditFromSetting()
    }
  }

  const onPayClick = async (arr: any[], falg: boolean) => {
    if (!arr.length) {
      message.warning(falg ? '没有可开启缴费的服务' : '没有可关闭缴费的服务');
      return;
    }
    const params = {
      KHFWSJPZIds: arr.map((item) => item.id),
      isPay: falg ? 1 : 0,
    }
    const res = await bulkEditIsPay(params);
    if (res?.status === 'ok') {
      message.success(falg ? '已开启' : '已关闭');
      getDataSourcePay();
    } else {
      message.error(res.message)
    }
    actionRef.current.clearSelected();
  }

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: 100,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入名称',
          }
        ]
      }
    },
    {
      title: '开始日期',
      dataIndex: 'KSRQ',
      key: 'KSRQ',
      align: 'center',
      width: 150,
      valueType: 'date',
      formItemProps: {
        rules: [
          {
            required: true,
            type: 'date',
            message: '请选择开始日期',
          }
        ]
      }
    },
    {
      title: '结束日期',
      dataIndex: 'JSRQ',
      key: 'JSRQ',
      align: 'center',
      width: 150,
      valueType: 'date',
      formItemProps: {
        rules: [
          {
            required: true,
            type: 'date',
            message: '请选择结束日期',
          }
        ]
      }
    },
    {
      title: '缴费类型',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      width: 80,
      valueType: 'select',
      fieldProps: {
        options: [
          {
            label: '按月',
            value: 0,
          },
          {
            label: '按时段',
            value: 1,
          }
        ]
      },
      formItemProps: {
        rules: [
          {
            required: true,
            type: 'number',
            message: '请选择缴费类型',
          }
        ]
      },
      editable: false
    },

    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 150,
      render: (_, record, _v, action) => {
        if (!disable) {
          return (<Space>
            <a
              key="editable"
              onClick={() => {
                action?.startEditable?.(record.id);
              }}

            >
              编辑
            </a>
            <a
              key="delete"
              onClick={() => {
                const arr = initDataSource?.filter((item: any) => {
                  return item.id !== record.id;
                })
                setDetail(arr, JFLX);
              }}
            >
              删除
            </a>
          </Space>);
        }
        return ''

      },
    },
  ];
  const columnsPay: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center',
    },
    {
      title: '年级',
      dataIndex: 'KHFWBJ',
      key: 'KHFWBJ',
      align: 'center',
      width: 100,
      render: (text: any) => {
        return `${text?.BJSJ?.NJSJ?.NJMC}`
      }
    },
    {
      title: '班级',
      dataIndex: 'KHFWBJ',
      key: 'KHFWBJ2',
      align: 'center',
      width: 100,
      render: (text: any) => {
        return `${text?.BJSJ?.BJ}`
      }
    },
    {
      title: '时段名称',
      dataIndex: 'SDBM',
      key: 'SDBM',
      align: 'center',
      width: 100,
    },
    {
      title: '开始日期',
      dataIndex: 'KSRQ',
      key: 'KSRQ',
      align: 'center',
      width: 150,
    },
    {
      title: '结束日期',
      dataIndex: 'JSRQ',
      key: 'JSRQ',
      align: 'center',
      width: 150,

    },
    {
      title: '缴费状态',
      dataIndex: 'isPay',
      key: 'isPay',
      align: 'center',
      width: 80,
      render: (text) => text === 1 ? <span style={{ color: '#41BC00' }}>已开启</span> : <span style={{ color: '#999' }}>已关闭</span>
    },

    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 150,
      render: (_text, record) => {
        return (<Space>
          <a
            key="editable"
            onClick={() => {
              onPayClick([record], record?.isPay ? false : true)
            }}
          >
            {record.isPay ? '关闭缴费' : '开启缴费'}
          </a>

        </Space>);
      },
    },
  ];


  return (
    <div>
      <PageContain type='homepage'>
        <Card size='small' style={{ marginBottom: '16px' }} bordered={false}>
          <SearchLayout>
            <div>
              <label htmlFor="grade">校区名称：</label>
              <Select value={campusId} placeholder="请选择" onChange={onCampusChange}>
                {campusData?.map((item: any) => {
                  return <Option value={item.value}>{item.label}</Option>;
                })}
              </Select>
            </div>
            <div>
              <label htmlFor="grade">学年学期：</label>
              <Select value={curXNXQId} placeholder="请选择" onChange={onXNXQChange}>
                {curXNXQData?.map((item: any) => {
                  return <Option value={item.id}>{`${item.XN}-${item.XQ}`}</Option>;
                })}
              </Select>
            </div>
            {/* <div>
              <label htmlFor="grade">类型：</label>
              <Select value={JFLX} placeholder="请选择" onChange={onJFLXChange}>
                <Option value={0}>按月</Option>;
                <Option value={1}>按时段</Option>;
              </Select>
            </div> */}

          </SearchLayout>
        </Card>
        <Spin spinning={loading}>
          <Card
            style={{ marginBottom: '16px' }}
            bordered={false}
            headStyle={{ fontSize: '16px', fontWeight: 'bold' }}
            title='收费模式设置'
            extra={
              <Space>
                <div style={{ color: '#4884ff' }}>报名模式设置适用于全校课后服务报名</div>
                {
                  isEdit ? <Button type='primary' onClick={() => {
                    Modal.confirm({
                      icon: <ExclamationCircleOutlined />,
                      title: '应用报名设置',
                      content: '确定将更改后的报名模式设置应用于全校课后服务？',
                      onOk: async () => {
                        setDetail(initDataSource, JFLX);
                        setDisable(true);
                        setIsEdit(false);
                        getDetail()
                      },
                      onCancel:()=>{
                        setDisable(true);
                        setIsEdit(false);
                        getDetail()
                      }
                    });

                  }}>应用</Button> :
                    <Button
                      type={editDisable ? 'ghost' : 'primary'}
                      disabled={editDisable}
                      onClick={() => {
                        setDisable(false);
                        setIsEdit(true);
                      }}>编辑</Button>
                }


              </Space>
            }>
            <Form>
              <Form.Item label='报名模式：'>
                <Radio.Group
                  onChange={async (value: any) => {
                    setJFLX(value.target.value);
                  }}
                  disabled={disable}
                  value={JFLX}
                  style={{ marginLeft: 8 }}
                >
                  <Radio value={0}>按月收费</Radio>
                  <Radio value={1}>自定义时段收费</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
            {
              getSetting()
            }

          </Card>
          {
            // 未配置课后服务
            editDisable && <Card bordered={false} headStyle={{ fontSize: '16px', fontWeight: 'bold' }} title='缴费管理'>
              <ProTable<any>
                actionRef={actionRef}
                columns={columnsPay}
                rowKey="id"
                pagination={{
                  showQuickJumper: true,
                  pageSize: 10,
                  defaultCurrent: 1,
                }}
                dataSource={dataSourcePay}
                rowSelection={{}}
                options={{
                  setting: false,
                  fullScreen: false,
                  density: false,
                  reload: false,
                }}
                search={false}
                headerTitle={
                  <SearchLayout>
                    <div>
                      <label htmlFor="grade">年级名称：</label>
                      <Select value={NjId} allowClear placeholder="请选择" onChange={(value: string) => {
                        setNjId(value)
                      }}>
                        {NjData?.map((item: any) => {
                          return <Option value={item.id}>{`${item.XD}${item.NJMC}`}</Option>;
                        })}
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="grade">时段名称：</label>
                      <Select allowClear value={SDMCValue} placeholder="请选择" onChange={(value: string) => {
                        setSDMCValue(value);
                      }}>
                        {initDataSource?.filter((item: DataSourceType) => item?.type === JFLX).map((item: DataSourceType) => {
                          return <Option value={item.name}>{item.name}</Option>;
                        })}
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="grade">缴费状态：</label>
                      <Select value={JFZT} allowClear placeholder="请选择" onChange={(value: any) => {
                        setJFZT(value);
                      }}>
                        <Option value={1}>已开启</Option>;
                        <Option value={0}>已关闭</Option>;
                      </Select>
                    </div>
                  </SearchLayout>
                }
                tableAlertOptionRender={({ selectedRows }) => {
                  return (
                    <Space>
                      <Button
                        type="primary"
                        onClick={() => {
                          const list = selectedRows.filter((item: any) => item?.isPay === 0)
                          onPayClick(list, true);
                        }}>
                        开启缴费
                      </Button>

                      <Button
                        type="primary"
                        onClick={() => {
                          const list = selectedRows.filter((item: any) => item?.isPay === 1)
                          onPayClick(list, false);
                        }}
                      >
                        关闭缴费
                      </Button>
                      {/* <ConfigureServiceBatch XNXQId= BJSJId, NJSJ, actionRef, XQSJId, key ></ConfigureServiceBatch>              */}
                    </Space>
                  );

                }}
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
                  <Space size={24}>
                    <span>
                      已选 {selectedRowKeys.length} 项
                      <a style={{ marginLeft: 8, width: '30px' }} onClick={onCleanSelected}>
                        取消选择
                      </a>
                    </span>
                  </Space>
                )}
              />
            </Card>
          }

        </Spin>
      </PageContain>
    </div>
  )
}

export default RegistrationSetting
