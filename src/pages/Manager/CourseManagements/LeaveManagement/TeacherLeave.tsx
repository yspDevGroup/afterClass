import { useEffect, useRef, useState } from 'react';
import { queryXNXQList } from '@/services/local-services/xnxq';
// import { message } from 'antd';
import { useModel } from 'umi';
import { Form, Modal, Radio, Select, Tag, Input, message } from 'antd';
import Style from './index.less';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import EllipsisHint from '@/components/EllipsisHint';
import { getAllKHJSQJ, updateKHJSQJ } from '@/services/after-class/khjsqj';
import WWOpenDataCom from '@/components/WWOpenDataCom';

const { TextArea } = Input;
const { Option } = Select;
const StudentsLeave: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  // 学年学期列表数据
  const [termList, setTermList] = useState<any>();
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<string>();
  // 请假状态
  const [QJZT, setQJZT] = useState<number[]>([-1]);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>();

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

  const handleSubmit = async (param: any) => {
    const { ZT, BZ } = param;
    try {
      const res = await updateKHJSQJ({ id: current?.id }, { QJZT: ZT, QJYY: BZ });
      if (res.status === 'ok') {
        message.success('审批成功');
        setVisible(false);
        setCurrent(undefined);
        actionRef.current?.reload();
      }
    } catch (err) {
      message.error('退课流程出现错误，请联系管理员或稍后重试。');
    }
  }
  // table表格数据
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
      width: 58,
      fixed: 'left',
    },
    {
      title: '教师姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
      width: 80,
      fixed: 'left',
      render: (_text: any, record: any) => {
        const showWXName = record?.JZGJBSJ?.XM === '未知' && record?.JZGJBSJ?.WechatUserId;
        if (showWXName) {
          return <WWOpenDataCom type="userName" openid={record?.JZGJBSJ?.WechatUserId} />;
        }
        return record?.JZGJBSJ?.XM;
      },
    },
    {
      title: '课程名称',
      dataIndex: 'KHQJKCs',
      key: 'KHQJKCs',
      align: 'center',
      ellipsis: true,
      render: (text: any, record: any) => {
        return (
          <EllipsisHint
            width="100%"
            text={record.KHJSQJKCs?.map((item: any) => {
              return (
                <Tag key={item.KCMC}>
                  {item.KCMC}
                </Tag>
              );
            })}
          />
        )
      },
      width: 150,
    },
    {
      title: '课程班名称',
      dataIndex: 'KHQJKCs',
      key: 'KHQJKCs_BJMC',
      align: 'center',
      ellipsis: true,
      render: (text: any, record: any) => {
        return (
          <EllipsisHint
            width="100%"
            text={record.KHJSQJKCs?.map((item: any) => {
              return (
                <Tag key={item.KHBJSJ?.id}>
                  {item.KHBJSJ?.BJMC}
                </Tag>
              );
            })}
          />
        )
      },
      width: 120,
    },
    {
      title: '请假原因',
      dataIndex: 'QJYY',
      key: 'QJYY',
      align: 'center',
      ellipsis: true,
      width: 180,
    },
    {
      title: '请假状态',
      dataIndex: 'QJZT',
      key: 'QJZT',
      valueType: 'select',
      width: 80,
      align: 'center',
      valueEnum: {
        0: { text: '申请中', status: 'Processing' },
        1: {
          text: '已通过',
          status: 'Success',
        },
        2: {
          text: '已驳回',
          status: 'Error',
          disabled: true,
        },
      },
    },
    {
      title: '请假开始时间',
      dataIndex: '',
      key: '',
      align: 'center',
      width: 160,
      render: (text: any, record: any) => `${text.KHJSQJKCs[0].QJRQ}  ${record.KSSJ}`,
    },
    {
      title: '请假结束时间',
      dataIndex: '',
      key: '',
      align: 'center',
      width: 160,
      render: (text: any, record: any) => `${text.KHJSQJKCs[0].QJRQ}  ${record.JSSJ}`,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      width: 80,
      render: (_, record: any) => {
        return <>
          {record.QJZT === 0 ? (
            <a onClick={() => {
              setCurrent(record);
              setVisible(true);
            }}>
              审批
            </a>
          ) : (
            ''
          )}
        </>
      }
    },
  ];
  return (
    <>
      <div className={Style.TopSearchs}>
        <span>
          所属学年学期：
          <Select
            value={curXNXQId}
            style={{ width: 200 }}
            onChange={(value: string) => {
              // 选择不同学期从新更新页面的数据
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

        <span style={{ marginLeft: 16 }}>
          请假状态：
          <Select
            style={{ width: 200 }}
            allowClear
            value={QJZT?.[0]}
            onChange={(value: number) => {
              setQJZT([value]);
            }}
          >
            <Option key='全部' value={-1}>
              全部
            </Option>
            <Option key='申请中' value={0}>
              申请中
            </Option>
            <Option key='已通过' value={1}>
              已通过
            </Option>
            <Option key='已驳回' value={2}>
              已取销
            </Option>
          </Select>
        </span>
      </div>
      <div className={Style.leaveWrapper}>
        <ProTable<any>
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          request={async (param) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            if (curXNXQId) {
              const obj = {
                XXJBSJId: currentUser?.xxId,
                XNXQId: curXNXQId,
                QJZT: QJZT?.[0] === -1 ? [0, 1, 2] : QJZT,
                page: param.current,
                pageSize: param.pageSize,
              };
              const res = await getAllKHJSQJ(obj);
              if (res.status === 'ok') {
                return {
                  data: res.data?.rows,
                  success: true,
                  total: res.data?.count,
                };
              }
            }
            return [];
          }}
          pagination={{
            showQuickJumper: true,
            pageSize: 10,
            defaultCurrent: 1,
          }}
          scroll={{ x: 1300 }}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
          search={false}
        />
      </div>
      <Modal
        title="请假审核"
        visible={visible}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setVisible(false);
          setCurrent(undefined);
        }}
        okText="确认"
        cancelText="取消"
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          form={form}
          initialValues={{ ZT: 1 }}
          onFinish={handleSubmit}
          layout="horizontal"
        >
          <Form.Item label="审核意见" name="ZT">
            <Radio.Group>
              <Radio value={1}>同意</Radio>
              <Radio value={2}>不同意</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="审核说明" name='BZ'>
            <TextArea rows={4} maxLength={100} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default StudentsLeave;
