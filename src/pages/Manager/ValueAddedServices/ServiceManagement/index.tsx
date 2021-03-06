/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import PageContainer from '@/components/PageContainer';
import { useEffect, useRef, useState } from 'react';
import { Link, useModel } from 'umi';
import { Button, Modal, Select, DatePicker, message, Form, Input, Popconfirm, Divider } from 'antd';
import { queryXNXQList } from '@/services/local-services/xnxq';
import styles from './index.less';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import type { TableListItem } from './data';
import ProTable from '@ant-design/pro-table';
import { getKHZZFW } from '@/services/after-class/khzzfw';
import { PlusOutlined } from '@ant-design/icons';
import { getAllXQSJ } from '@/services/after-class/xqsj';
import {
  createKHXXZZFW,
  deleteKHXXZZFW,
  getKHXXZZFW,
  updateKHXXZZFW,
} from '@/services/after-class/khxxzzfw';
import moment from 'moment';
import UploadImage from '@/components/CustomForm/components/UploadImage';
import SearchLayout from '@/components/Search/Layout';
import { getTableWidth } from '@/utils/utils';

const { Option } = Select;
const { Search } = Input;
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
  const [Disabled, setDisabled] = useState<string>();
  const [FbState, setFbState] = useState<string>();
  const [LbState, setLbState] = useState<string>();
  const [name, setName] = useState<string>();
  const [ImageUrl, setImageUrl] = useState<string>();
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 学年学期列表数据
  const [termList, setTermList] = useState<any>();

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
  }, []);
  const ongetKHXXZZFW = async () => {
    const data: any = {
      XXJBSJId: currentUser?.xxId,
      XNXQId: curXNXQId || '',
      FWMC: name,
      FWZT: FbState ? Number(FbState) : undefined,
      KHZZFWId: LbState || '',
    };
    const res = await getKHXXZZFW(data);
    if (res.status === 'ok') {
      setDataSource(res?.data?.rows);
    }
  };
  useEffect(() => {
    ongetKHXXZZFW();
  }, [curXNXQId, name, FbState, LbState]);
  useEffect(() => {
    // 获取校区数据
    (async () => {
      const res = await getAllXQSJ({ XXJBSJId: currentUser?.xxId });
      // 获取到的整个列表的信息
      if (res.status === 'ok') {
        setCampusData(res.data);
      }
      const result = await getKHZZFW({
        XXJBSJId: currentUser?.xxId,
        FWMC: '',
        FWZT: 1,
        page: 0,
        pageSize: 0,
      });
      if (result.status === 'ok') {
        setLBData(result?.data?.rows);
      }
    })();
  }, []);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      fixed: 'left',
      align: 'center',
    },
    {
      title: '服务名称',
      dataIndex: 'FWMC',
      key: 'FWMC',
      fixed: 'left',
      align: 'center',
      search: false,
      ellipsis: true,
      width: 120,
    },
    {
      title: '服务类别',
      dataIndex: 'KHZZFWId',
      key: 'KHZZFWId',
      align: 'center',
      search: false,
      ellipsis: true,
      width: 100,
      render: (text, record) => {
        return record.KHZZFW?.FWMC;
      },
    },
    {
      title: '报名时段',
      dataIndex: 'BMSJ',
      key: 'BMSJ',
      align: 'center',
      search: false,
      ellipsis: true,
      width: 190,
      render: (text, record) => {
        return `${moment(record.BMKSSJ).format('YYYY-MM-DD')} 至 ${moment(record.BMJSSJ).format(
          'YYYY-MM-DD',
        )}`;
      },
    },
    {
      title: '服务时段',
      dataIndex: 'FWSJ',
      key: 'FWSJ',
      align: 'center',
      search: false,
      ellipsis: true,
      width: 190,
      render: (text, record) => {
        return `${record.KSRQ} 至 ${record.JSRQ}`;
      },
    },
    {
      title: '服务费用',
      dataIndex: 'FY',
      key: 'FY',
      align: 'center',
      search: false,
      ellipsis: true,
      width: 80,
    },
    {
      title: '报名人数',
      dataIndex: 'xs_count',
      key: 'xs_count',
      align: 'center',
      search: false,
      ellipsis: true,
      width: 80,
    },
    {
      title: '发布状态',
      dataIndex: 'FWZT',
      key: 'FWZT',
      onFilter: true,
      search: false,
      valueType: 'select',
      align: 'center',
      width: 80,
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
      fixed: 'right',
      width: 210,
      render: (text, record) => {
        return (
          <div className={styles.operation}>
            {record.FWZT === 0 ? (
              <>
                {' '}
                <Popconfirm
                  title="确定发布该服务?"
                  onConfirm={async () => {
                    try {
                      if (record.id) {
                        const result = await updateKHXXZZFW({ id: record.id }, { FWZT: 1 });
                        if (result.status === 'ok') {
                          message.success('发布成功');
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
                  <a key="delete">发布</a>
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
                      XQSJId: XQSJ?.id,
                    };
                    form.setFieldsValue(data);
                    setIsModalVisible(true);
                    setImageUrl(record?.FWTP);
                    setDisabled('编辑');
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
                  <a key="delete">删除</a>
                </Popconfirm>
              </>
            ) : (
              <>
                <Popconfirm
                  title="确定撤销发布该服务?"
                  onConfirm={async () => {
                    try {
                      if (record.id) {
                        const result = await updateKHXXZZFW({ id: record.id }, { FWZT: 0 });
                        if (result.status === 'ok') {
                          message.success('撤销成功');
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
                  <a key="delete">撤销发布</a>
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
                      XQSJId: XQSJ?.id,
                    };
                    form.setFieldsValue(data);
                    setIsModalVisible(true);
                    setDisabled('查看');
                    setImageUrl(record?.FWTP);
                  }}
                >
                  查看
                </a>
                <Divider type="vertical" />
                <Link
                  to={{
                    pathname: '/valueAddedServices/serviceManagement/signUp',
                    state: record,
                  }}
                >
                  报名信息
                </Link>
              </>
            )}
          </div>
        );
      },
    },
  ];
  const submit = async (value: any) => {
    const { BMSD, FWSD, ...info } = value;
    const start = moment(BMSD?.[0]).format('YYYY-MM-DD');
    const end = moment(BMSD?.[1]).format('YYYY-MM-DD');
    const startTime = `${start  }T00:00:00.000Z`;
    const endTime = `${end  }T23:59:59.000Z`;

    if (ImageUrl === '') {
      message.info('请上传图片');
    } else {
      const data = {
        ...info,
        BMKSSJ: startTime,
        BMJSSJ: endTime,
        KSRQ: moment(FWSD[0]).format('YYYY-MM-DD'),
        JSRQ: moment(FWSD[1]).format('YYYY-MM-DD'),
        FWTP: ImageUrl || '',
      };
      if (typeof value.id === 'undefined') {
        const res = await createKHXXZZFW(data);
        if (res.status === 'ok') {
          message.success('保存成功');
          setIsModalVisible(false);
          setImageUrl('');
          form.resetFields();
          ongetKHXXZZFW();
        } else {
          message.error('保存失败，请联系管理员或稍后再试');
        }
      } else {
        const res = await updateKHXXZZFW({ id: value?.id }, data);
        if (res.status === 'ok') {
          message.success('修改成功');
          setIsModalVisible(false);
          setImageUrl('');
          form.resetFields();
          ongetKHXXZZFW();
        }
      }
    }
  };
  const showModal = () => {
    setIsModalVisible(true);
    setDisabled('新增');
    form.setFieldsValue({
      XNXQId: curXNXQId,
    });
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setImageUrl('');
    form.resetFields();
  };
  // 文件状态改变的回调
  const imageChange = (e?: any) => {
    if (e.file.status === 'done') {
      const mas = e.file.response.message;
      if (typeof e.file.response === 'object' && e.file.response.status === 'error') {
        message.error(`上传失败，${mas}`);
      } else {
        const res = e.file.response;
        if (res.status === 'ok') {
          message.success('上传成功');
          setImageUrl(res.data);
        }
      }
    } else if (e.file.status === 'error') {
      const mass = e.file.response.message;
      message.error(`上传失败，${mass}`);
    }
  };
  return (
    <PageContainer>
      <div className={styles.ToIntroduce}>
        <ProTable<any>
          columns={columns}
          rowKey="key"
          actionRef={actionRef}
          pagination={{
            showQuickJumper: true,
            pageSize: 10,
            defaultCurrent: 1,
          }}
          scroll={{ x: getTableWidth(columns) }}
          search={false}
          dataSource={DataSource}
          dateFormatter="string"
          headerTitle={
            <SearchLayout>
              <div>
                <label htmlFor="term">所属学年学期：</label>
                <Select
                  allowClear
                  value={curXNXQId}
                  onChange={(value: string) => {
                    setCurXNXQId(value);
                    setLbState(undefined);
                    setFbState(undefined);
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
              </div>
              <div>
                <label htmlFor="type">服务类别：</label>
                <Select
                  allowClear
                  value={LbState || ''}
                  placeholder="请选择"
                  onChange={(value: string) => {
                    setLbState(value);
                    setFbState(undefined);
                  }}
                >
                  {LBData?.length
                    ? LBData?.map((item: any) => {
                        return (
                          <Option value={item?.id} key={item?.id}>
                            {item?.FWMC}
                          </Option>
                        );
                      })
                    : ''}
                </Select>
              </div>
              <div>
                <label htmlFor="name">服务名称：</label>
                <Search
                  placeholder="服务名称"
                  allowClear
                  onSearch={(value: string) => {
                    setName(value);
                    actionRef.current?.reload();
                  }}
                />
              </div>
              <div>
                <label htmlFor="status">发布状态：</label>
                <Select
                  allowClear
                  value={FbState || ''}
                  onChange={(value: string) => {
                    setFbState(value);
                  }}
                >
                  <Option key="" value="">
                    全部
                  </Option>
                  <Option key="0" value="0">
                    未发布
                  </Option>
                  <Option key="1" value="1">
                    已发布
                  </Option>
                </Select>
              </div>
            </SearchLayout>
          }
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
          toolBarRender={() => [
            <Button type="primary" key="primary" onClick={showModal}>
              <PlusOutlined /> 新增服务
            </Button>,
          ]}
        />
      </div>
      <Modal
        title={Disabled === '新增' ? '新增服务' : Disabled === '编辑' ? '编辑服务' : '服务详情'}
        visible={isModalVisible}
        className={Disabled === '查看' ? styles.modal : styles.modals}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            确定
          </Button>,
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
        ]}
      >
        <Form name="basic" form={form} onFinish={submit} className={styles.Forms}>
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>
          <Form.Item label="服务图片" name="FWTP" key="FWTP">
            <UploadImage
              key="FWTP"
              disabled={Disabled === '查看'}
              imageurl={ImageUrl}
              upurl="/api/upload/uploadFile?type=badge&plat=school"
              accept=".jpg, .jpeg, .png"
              imagename="image"
              handleImageChange={imageChange}
            />
          </Form.Item>
          <Form.Item
            name="KHZZFWId"
            key="KHZZFWId"
            label="服务类别"
            rules={[{ required: true, message: '请选择服务类别' }]}
          >
            <Select style={{ width: '100%' }} placeholder="请选择" disabled={Disabled === '查看'}>
              {LBData?.length
                ? LBData?.map((item: any) => {
                    return (
                      <Option value={item?.id} key={item?.id}>
                        {item?.FWMC}
                      </Option>
                    );
                  })
                : ''}
            </Select>
          </Form.Item>
          <Form.Item
            label="服务名称"
            name="FWMC"
            key="FWMC"
            rules={[{ required: true, message: '请输入服务名称' }]}
          >
            <Input placeholder="建议以月份开头命名" disabled={Disabled === '查看'} />
          </Form.Item>
          <Form.Item
            label="服务费用"
            name="FY"
            key="FY"
            rules={[
              { required: true, message: '请输入服务费用' },
              { message: '请输入正确的服务费用', pattern: /^([1-9]\d{0,3}|0)(\.\d{1,2})?$/ },
            ]}
          >
            <Input type="text" placeholder="请输入" disabled={Disabled === '查看'} />
          </Form.Item>
          <Form.Item
            label="学年学期"
            name="XNXQId"
            key="XNXQId"
            rules={[
              {
                required: true,
                message: '请选择学年学期',
              },
            ]}
          >
            <Select placeholder="请选择" disabled={Disabled === '查看'}>
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
                message: '请选择所属校区',
              },
            ]}
          >
            <Select placeholder="请选择" disabled={Disabled === '查看'}>
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
                message: '请选择报名时间',
              },
            ]}
          >
            <RangePicker disabled={Disabled === '查看'} />
          </Form.Item>
          <Form.Item
            label="服务时段"
            name="FWSD"
            key="FWSD"
            rules={[
              {
                required: true,
                message: '请选择服务时间',
              },
            ]}
          >
            <RangePicker disabled={Disabled === '查看'} />
          </Form.Item>
          <Form.Item
            label="服务内容"
            name="FWNR"
            key="FWNR"
            rules={[
              {
                required: true,
                message: '请输入服务内容',
              },
            ]}
          >
            <Input.TextArea
              placeholder="请输入"
              showCount={Disabled !== '查看'}
              maxLength={200}
              disabled={Disabled === '查看'}
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};
export default ServiceManagement;
