/* eslint-disable react-hooks/exhaustive-deps */
import PageContainer from '@/components/PageContainer';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { Button, Modal, Select, DatePicker, message, Form, Input, Popconfirm, Divider } from 'antd';
import { queryXNXQList } from '@/services/local-services/xnxq';
import styles from './index.less'
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import type { TableListItem } from './data';
import ProTable from '@ant-design/pro-table';
import { getKHZZFW } from '@/services/after-class/khzzfw';
import { PlusOutlined } from '@ant-design/icons';
import { getAllXQSJ } from '@/services/after-class/xqsj';
import { createKHXXZZFW, deleteKHXXZZFW, getKHXXZZFW, updateKHXXZZFW } from '@/services/after-class/khxxzzfw';
import moment from 'moment';

const { Option } = Select;
// const { Search } = Input;
const { RangePicker } = DatePicker;

const ServiceManagement = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [LBData, setLBData] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [DataSource, setDataSource] = useState<API.KHXXZZFW[]>();
  const [CampusData, setCampusData] = useState<any>([]);
  const [Disabled, setDisabled] = useState(false);
  const [FbState, setFbState] = useState<string>();
  const [LbState, setLbState] = useState<string>();
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 学年学期列表数据
  const [termList, setTermList] = useState<any>();
  // 课程名称查询
  // const [ServiceName, setServiceName] = useState();

  useEffect(() => {
    // 获取学年学期数据的获取
    (async () => {
      const res = await queryXNXQList(currentUser?.xxId);
      // 获取到的整个列表的信息
      const newData = res.xnxqList;
      const curTerm = res.current;
      if (newData?.length) {
        if (curTerm) {
          setCurXNXQId(curTerm.id);
          setTermList(newData);
        }
      }
    })();
  }, [])
  const ongetKHXXZZFW = async () => {
    let data: any = {};
    if (typeof FbState === 'undefined') {
      data = {
        XXJBSJId: currentUser?.xxId,
        XNXQId: curXNXQId || '',
        // FWMC: ServiceName || '',
        KHZZFWId: LbState || ''
      }
    } else {
      data = {
        XXJBSJId: currentUser?.xxId,
        XNXQId: curXNXQId || '',
        // FWMC: ServiceName || '',
        FWZT: Number(FbState),
        KHZZFWId: LbState || ''
      }
    }
    const res = await getKHXXZZFW(data)
    if (res.status === 'ok') {
      setDataSource(res?.data?.rows)
    }
  }
  useEffect(() => {
    ongetKHXXZZFW()
  }, [curXNXQId, FbState, LbState]);
  useEffect(() => {
    // 获取校区数据
    (async () => {
      const res = await getAllXQSJ({ XXJBSJId: currentUser?.xxId });
      // 获取到的整个列表的信息
      if (res.status === 'ok') {
        setCampusData(res.data)
      }
      const result = await getKHZZFW({
        XXJBSJId: currentUser?.xxId,
        FWMC: '',
        FWZT: 1,
        page: 0,
        pageSize: 0
      })
      if (result.status === 'ok') {
        setLBData(result!.data!.rows!)
      }
    })();
  }, [])


  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center'
    },
    {
      title: '服务名称',
      dataIndex: 'FWMC',
      key: 'FWMC',
      align: 'center',
      search: false,
      ellipsis: true
    },
    {
      title: '服务类别',
      dataIndex: 'KHZZFWId',
      key: 'KHZZFWId',
      align: 'center',
      search: false,
      ellipsis: true,
      render: (text, record,) => {
        return record.KHZZFW?.FWMC
      }
    },
    {
      title: '报名时段',
      dataIndex: 'BMSJ',
      key: 'BMSJ',
      align: 'center',
      search: false,
      ellipsis: true,
      width: 190,
      render: (text, record,) => {
        return `${moment(record.BMKSSJ).format('YYYY-MM-DD')} 至 ${moment(record.BMJSSJ).format('YYYY-MM-DD')}`
      }
    },
    {
      title: '服务时段',
      dataIndex: 'FWSJ',
      key: 'FWSJ',
      align: 'center',
      search: false,
      ellipsis: true,
      width: '12rem',
      render: (text, record,) => {
        return `${record.KSRQ} 至 ${record.JSRQ}`
      }
    },
    {
      title: '服务费用',
      dataIndex: 'FY',
      key: 'FY',
      align: 'center',
      search: false,
      ellipsis: true
    },
    {
      title: '发布状态',
      dataIndex: 'FWZT',
      key: 'FWZT',
      onFilter: true,
      search: false,
      valueType: 'select',
      align: 'center',
      valueEnum: {
        0: {
          text: '未发布',
          status: 'Default',
        },
        1: {
          text: '已发布',
          status: 'Success',
          disabled: true,
        },
      },
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      align: 'center',
      width: 180,
      render: (text, record,) => {
        return (
          <div className={styles.operation}>
            {
              record.FWZT === 0 ? <> <Popconfirm
                title="确定发布该服务?"
                onConfirm={async () => {
                  try {
                    if (record.id) {
                      const result = await updateKHXXZZFW({ id: record.id }, { FWZT: 1 });
                      if (result.status === 'ok') {
                        message.success('删除成功');
                        ongetKHXXZZFW();
                      } else {
                        message.error(result.message);
                      }
                    }
                  } catch (err) {
                    message.error('发布失败，请联系管理员或稍后重试。');
                  }
                }}
                okText="确定"
                cancelText="取消"
                placement="topRight"
              >
                <a key='delete'>发布</a>
              </Popconfirm>
                <Divider type="vertical" />
                <a
                  key="editable"
                  onClick={() => {
                    const { BMJSSJ, BMKSSJ, KSRQ, JSRQ, XNXQ, KHZZFW, XQSJ, ...info } = record;
                    const data = {
                      ...info,
                      BMSD: [moment(BMKSSJ), moment(BMJSSJ)],
                      FWSD: [moment(KSRQ), moment(JSRQ)],
                      XNXQId: XNXQ?.id,
                      KHZZFWId: KHZZFW?.id,
                      XQSJId: XQSJ?.id
                    }
                    form.setFieldsValue(data)
                    setIsModalVisible(true);
                    setDisabled(false)
                  }}
                >
                  编辑
                </a>
                <Divider type="vertical" />
                <Popconfirm
                  title="确定删除该服务?"
                  onConfirm={async () => {
                    try {
                      if (record.id) {
                        const result = await deleteKHXXZZFW({ id: record.id });
                        if (result.status === 'ok') {
                          message.success('删除成功');
                          ongetKHXXZZFW();
                        } else {
                          message.error(result.message);
                        }
                      }
                    } catch (err) {
                      message.error('删除失败，请联系管理员或稍后重试。');
                    }
                  }}
                  okText="确定"
                  cancelText="取消"
                  placement="topRight"
                >
                  <a key='delete'>删除</a>
                </Popconfirm>
              </> :
                <>
                  <Popconfirm
                    title="确定撤销发布该服务?"
                    onConfirm={async () => {

                      try {
                        if (record.id) {
                          const result = await updateKHXXZZFW({ id: record.id }, { FWZT: 0 });
                          if (result.status === 'ok') {
                            message.success('删除成功');
                            ongetKHXXZZFW();
                          } else {
                            message.error(result.message);
                          }
                        }
                      } catch (err) {
                        message.error('撤销发布失败，请联系管理员或稍后重试。');
                      }
                    }}
                    okText="确定"
                    cancelText="取消"
                    placement="topRight"
                  >
                    <a key='delete'>撤销发布</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                  <a
                    key="editable"
                    onClick={() => {
                      const { BMJSSJ, BMKSSJ, KSRQ, JSRQ, XNXQ, KHZZFW, XQSJ, ...info } = record;
                      const data = {
                        ...info,
                        BMSD: [moment(BMKSSJ), moment(BMJSSJ)],
                        FWSD: [moment(KSRQ), moment(JSRQ)],
                        XNXQId: XNXQ?.id,
                        KHZZFWId: KHZZFW?.id,
                        XQSJId: XQSJ?.id
                      }
                      form.setFieldsValue(data)
                      setIsModalVisible(true);
                      setDisabled(true)
                    }}
                  >
                    查看
                  </a></>
            }


          </div>
        );
      }
    }
  ];
  const submit = async (value: any) => {
    const { BMSD, FWSD, ...info } = value;
    const data = {
      ...info,
      BMKSSJ: moment(BMSD[0]).format(),
      BMJSSJ: moment(BMSD[1]).format(),
      KSRQ: moment(FWSD[0]).format('YYYY-MM-DD'),
      JSRQ: moment(FWSD[1]).format('YYYY-MM-DD'),
    }
    if (typeof value.id === 'undefined') {
      const res = await createKHXXZZFW(data)
      if (res.status === 'ok') {
        message.success('保存成功')
        setIsModalVisible(false);
        ongetKHXXZZFW();
      }
    } else {
      const res = await updateKHXXZZFW({ id: value?.id }, data)
      if (res.status === 'ok') {
        message.success('修改成功')
        setIsModalVisible(false);
        ongetKHXXZZFW();
      }
    }
  }
  const showModal = () => {
    setIsModalVisible(true);
    setDisabled(false)
    form.setFieldsValue({
      XNXQId: curXNXQId,
    })
  };

  const handleOk = () => {
    form.submit()
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };
  // const onSearch = (value: any) => {
  //   setServiceName(value)
  // };
  return (
    <PageContainer>
      <div className={styles.ToIntroduce}>
        <ProTable<any>
          columns={columns}
          rowKey="key"
          actionRef={actionRef}
          pagination={{
            showQuickJumper: true
          }}
          search={false}
          dataSource={DataSource}
          dateFormatter="string"
          headerTitle={
            <div className={styles.TopSearchss}>
              <span style={{ fontSize: 14, color: '#666' }}>
                所属学年学期：
                <Select
                  value={curXNXQId}
                  style={{ width: 200 }}
                  onChange={(value: string) => {
                    setCurXNXQId(value);
                  }}
                >
                  {termList?.map((item: any) => {
                    return (
                      <Option key={item.value} value={item.value}>
                        {item.text}
                      </Option>
                    );
                  })}
                </Select>
              </span>
              <span style={{ fontSize: 14, color: '#666', marginLeft: 20 }}>
                服务类别：
                <Select
                  allowClear
                  value={LbState || ''}
                  style={{ width: 200 }}
                  placeholder="请选择"
                  onChange={(value: string) => {
                    setLbState(value);
                  }}>
                  {
                    LBData?.length ? LBData?.map((item: any) => {
                      return <Option value={item?.id} key={item?.id}>{item?.FWMC}</Option>
                    }) : ''
                  }
                </Select>
              </span>
              <span style={{ fontSize: 14, color: '#666', marginLeft: 20 }}>
                发布状态：
                <Select
                  allowClear
                  value={FbState || ''}
                  style={{ width: 200 }}
                  onChange={(value: string) => {
                    setFbState(value);
                  }}
                >
                  <Option key='0' value='0'>
                    未发布
                  </Option>
                  <Option key='1' value='1'>
                    已发布
                  </Option>
                </Select>
              </span>
              {/* <span style={{ fontSize: 14, color: '#666', marginLeft: 20 }}>
                服务名称：
                <Search placeholder="请输入服务名称" onSearch={onSearch} style={{ width: 200 }} />
              </span> */}

            </div>
          }
          toolBarRender={() => [
            <Button type="primary" key="primary" onClick={showModal}>
              <PlusOutlined /> 新增服务
            </Button>
          ]}
        />
      </div>
      <Modal title="新增服务" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} className={Disabled === true ? styles.modal : styles.modals}>
        <Form name="basic" form={form} onFinish={submit} className={styles.Forms}>
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="KHZZFWId"
            key="KHZZFWId"
            label="服务类别"
            rules={[{ required: true, message: '请选择服务类别' }]}
          >
            <Select style={{ width: '100%' }} placeholder="请选择" disabled={Disabled}>
              {
                LBData?.length ? LBData?.map((item: any) => {
                  return <Option value={item?.id} key={item?.id}>{item?.FWMC}</Option>
                }) : ''
              }
            </Select>
          </Form.Item>
          <Form.Item
            label="服务名称"
            name="FWMC"
            key="FWMC"
            rules={[{ required: true, message: '请输入服务名称' }]}
          >
            <Input placeholder='请输入' disabled={Disabled} />
          </Form.Item>


          <Form.Item
            label="服务费用"
            name="FY"
            key="FY"
            rules={[{ required: true, message: '请输入服务费用' }]}
          >
            <Input
              type="text"
              placeholder='请输入'
              disabled={Disabled}
            />
          </Form.Item>
          <Form.Item
            label="学年学期"
            name="XNXQId"
            key="XNXQId"
            rules={[
              {
                required: true,
                message: '请选择学年学期'
              }
            ]}
          >
            <Select
              placeholder='请选择'
              disabled={Disabled}
            >
              {termList?.map((item: any) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.text}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="所属校区"
            name="XQSJId"
            key="XQSJId"
            rules={[
              {
                required: true,
                message: '请选择所属校区'
              }
            ]}
          >
            <Select
              placeholder='请选择'
              disabled={Disabled}
            >
              {CampusData?.map((item: any) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.XQMC}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="报名时段"
            name="BMSD"
            key="BMSD"
            style={{ width: '100%' }}
            rules={[
              {
                required: true,
                message: '请选择报名时间'
              }
            ]}
          >
            <RangePicker disabled={Disabled} />
          </Form.Item>
          <Form.Item
            label="服务时段"
            name="FWSD"
            key="FWSD"
            rules={[
              {
                required: true,
                message: '请选择服务时间'
              }
            ]}
          >
            <RangePicker disabled={Disabled} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>

  )
}
export default ServiceManagement
