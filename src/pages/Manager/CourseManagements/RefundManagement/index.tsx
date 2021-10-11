import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { Select, message, Modal, Radio, Input, Form, InputNumber } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import PageContainer from '@/components/PageContainer';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getKHTKSJ, updateKHTKSJ } from '@/services/after-class/khtksj';

import Style from './index.less';
import { createKHXSTK, getAllKHXSTK, updateKHXSTK } from '@/services/after-class/khxstk';

const { Option } = Select;
const { TextArea } = Input;
// 退款
const RefundManagement = () => {
  // 获取到当前学校的一些信息
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  // 学年学期列表数据
  const [termList, setTermList] = useState<any>();
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>();
  useEffect(() => {
    //获取学年学期数据的获取
    (async () => {
      const res = await queryXNXQList(currentUser?.xxId);
      // 获取到的整个列表的信息
      const newData = res.xnxqList;
      const curTerm = res.current;
      if (newData?.length) {
        if (curTerm) {
          setCurXNXQId(curTerm.id);
          setTermList(newData);
          //  拿到默认值 发送请求
        }
      }
    })();
  }, []);
  useEffect(() => {
    actionRef.current?.reload();
  }, [curXNXQId]);
  ///table表格数据
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
      width: 60,
    },
    {
      title: '学生姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
    },
    {
      title: '课程名称',
      dataIndex: 'KHBJSJ',
      key: 'KHBJSJ',
      align: 'center',
      render: (text: any) => {
        return text?.KHKCSJ?.KCMC;
      },
    },
    {
      title: '课程班名称',
      dataIndex: 'KHBJSJ',
      key: 'KHBJSJ',
      align: 'center',
      render: (text: any) => {
        return text?.BJMC;
      },
    },
    {
      title: '退款金额',
      dataIndex: 'TKJE',
      key: 'TKJE',
      align: 'center',
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
    },
    {
      title: '审批人',
      dataIndex: 'SPSJ',
      key: 'SPSJ',
      align: 'center',
    },
    {
      title: '审批时间',
      dataIndex: 'SPSJ',
      key: 'SPSJ',
      align: 'center',
    },
    {
      title: '退款时间',
      dataIndex: 'TKSJ',
      key: 'TKSJ',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'TKZT',
      key: 'TKZT',
      align: 'center',
      valueEnum: {
        0: {
          text: '申请中',
          status: 'Processing',
        },
        1: {
          text: '审批通过',
          status: 'Processing',
        },
        2: {
          text: '已驳回',
          status: 'Error',
        },
        3: {
          text: '退款成功',
          status: 'Success',
        },
        4: {
          text: '退款失败',
          status: 'Error',
        },
      },
    },
    {
      title: '操作',
      dataIndex: '',
      key: '',
      align: 'center',
      render: (record: any) =>
        record.TKZT === 0 ? (
          <a onClick={() => {
            setCurrent(record);
            setVisible(true);
          }}>
            确认
          </a>
        ) : (
          ''
        ),
    },
  ];
  const handleSubmit = async (params: any) => {
    const { TKJE, TKZT } = params;
    try {
      if (current.id) {
        const params = { id: current.id };
        const body = { TKJE, TKZT };
        const res = await updateKHXSTK(params, body);
        if (res.status === 'ok') {
          if (TKZT === 2) {
            message.success('退款申请已驳回');
          } else {
            message.success('退款审核通过，已发起退款');
          }
          actionRef.current?.reload();
        } else {
          message.error(res.message || '退课课程出现错误，请联系管理员或稍后重试。');
        }
      }
    } catch (err) {
      message.error('退课课程出现错误，请联系管理员或稍后重试。');
    }
  }
  return (
    ///PageContainer组件是顶部的信息
    <PageContainer>
      <div className={Style.TopSearchs}>
        <span>
          所属学年学期：
          <Select
            value={curXNXQId}
            style={{ width: 200 }}
            onChange={(value: string) => {
              //更新多选框的值
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
      </div>
      <div>
        <ProTable<any>
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          request={async () => {
            const resAll = await getAllKHXSTK({
              XXJBSJId: currentUser?.xxId,
              XNXQId: curXNXQId,
              page: 0,
              pageSize: 0,
            });
            if (resAll.status === 'ok') {
              return {
                data: resAll?.data?.rows,
                success: true,
                total: resAll?.data?.count,
              };
            }
            return {
              data: [],
              success: false,
              total: 0,
            };
          }}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
          search={false}
        />
        <Modal
          title="退款确认"
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
            <Form.Item label="退款金额" name='TKJE'>
              <InputNumber
                formatter={value => `￥ ${value}`}
                parser={value => Number(value?.replace(/\￥\s?/g, ''))}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageContainer>
  );
};
export default RefundManagement;