import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { Select, message, Modal, Radio, Input, Form, InputNumber } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { queryXNXQList } from '@/services/local-services/xnxq';

import Style from './index.less';
import { getAllKHXSTK, updateKHXSTK } from '@/services/after-class/khxstk';
import WWOpenDataCom from '@/components/WWOpenDataCom';

const { Option } = Select;
const { TextArea } = Input;
// 退款
const ServiceRefund = () => {
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
          //  拿到默认值 发送请求
        }
      }
    })();
  }, []);
  useEffect(() => {
    actionRef.current?.reload();
  }, [curXNXQId]);
  /// table表格数据
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
      title: '学生姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
      width: 100,
      fixed: 'left',
      render: (_text: any, record: any) => {
        return record?.XSJBSJ?.XM;
      },
    },
    {
      title: '订单编号',
      dataIndex: 'TKBH',
      key: 'TKBH',
      align: 'center',
      ellipsis: true,
      width: 180,
    },
    {
      title: '行政班名称',
      dataIndex: 'XZBJSJ',
      key: 'XZBJSJ',
      align: 'center',
      width: 120,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return `${record?.XSJBSJ?.BJSJ?.NJSJ?.NJMC}${record?.XSJBSJ?.BJSJ?.BJ}`;
      },
    },
    {
      title: '服务名称',
      dataIndex: 'KHXXZZFW',
      key: 'KHXXZZFW',
      align: 'center',
      render: (text: any, record: any) => {
        return record?.KHXXZZFW?.FWMC;
      },
      ellipsis: true,
      width: 150,
    },
    {
      title: '服务类型',
      dataIndex: 'FWLX',
      key: 'FWLX',
      align: 'center',
      render: (text: any, record: any) => {
        return record?.KHXXZZFW?.KHZZFW?.FWMC;
      },
      ellipsis: true,
      width: 120,
    },
    {
      title: '退款金额',
      dataIndex: 'TKJE',
      key: 'TKJE',
      align: 'center',
      ellipsis: true,
      width: 100,
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      ellipsis: true,
      render: (_, record) => {
        return record?.createdAt?.substring(0, 16);
      },
      width: 150,
    },
    {
      title: '审批人',
      dataIndex: 'JZGJBSJ',
      key: 'JZGJBSJ',
      align: 'center',
      ellipsis: true,
      width: 120,
      render: (_, record) => {
        const showWXName = record?.JZGJBSJ?.XM === '未知' && record?.JZGJBSJ?.WechatUserId;
        if (showWXName) {
          return <WWOpenDataCom type="userName" openid={record?.JZGJBSJ?.WechatUserId} />;
        }
        return record?.JZGJBSJ?.XM;
      },
    },
    {
      title: '审批时间',
      dataIndex: 'SPSJ',
      key: 'SPSJ',
      align: 'center',
      ellipsis: true,
      render: (_, record) => {
        return record?.SPSJ?.replace(/T/, ' ').substring(0, 16);
      },
      width: 150,
    },
    {
      title: '退款时间',
      dataIndex: 'TKSJ',
      key: 'TKSJ',
      align: 'center',
      ellipsis: true,
      render: (_, record) => {
        return record?.TKSJ?.substring(0, 16);
      },
      width: 150,
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
      ellipsis: true,
      width: 120,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 80,
      fixed: 'right',
      render: (_: any, record: any) =>
        record.TKZT === 0 ? (
          <a
            onClick={() => {
              setCurrent(record);
              setVisible(true);
            }}
          >
            确认
          </a>
        ) : (
          ''
        ),
    },
  ];
  const handleSubmit = async (params: any) => {
    const { TKJE, TKZT, BZ } = params;
    try {
      if (current.id) {
        const ids = { id: current.id };
        const body = {
          TKJE,
          TKZT,
          BZ,
          deviceIp: '117.36.118.42',
          SPSJ: new Date().toISOString(),
          JZGJBSJId: currentUser?.JSId || testTeacherId,
        };
        const res = await updateKHXSTK(ids, body);
        if (res.status === 'ok') {
          if (TKZT === 2) {
            message.success('退款申请已驳回');
          } else {
            message.success('退款审核通过，已发起退款');
          }
          setVisible(false);
          setCurrent(undefined);
          actionRef.current?.reload();
        } else {
          message.error(res.message || '退款流程出现错误，请联系管理员或稍后重试。');
        }
      }
    } catch (err) {
      message.error('退款流程出现错误，请联系管理员或稍后重试。');
    }
  };
  return (
    <>
      <div className={Style.TopSearchs}>
        <span>
          所属学年学期：
          <Select
            value={curXNXQId}
            style={{ width: 200 }}
            onChange={(value: string) => {
              // 更新多选框的值
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
          pagination={{
            showQuickJumper: true,
            pageSize: 10,
            defaultCurrent: 1,
          }}
          scroll={{ x: 1500 }}
          request={async () => {
            const resAll = await getAllKHXSTK({
              LX: 1,
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
            initialValues={{ TKZT: 1, TKJE: current?.TKJE }}
            onFinish={handleSubmit}
            layout="horizontal"
          >
            <Form.Item label="退款金额" name="TKJE">
              <InputNumber
                formatter={(value) => `￥ ${value}`}
                parser={(value) => Number(value?.replace(/\￥\s?/g, ''))}
              />
            </Form.Item>
            <Form.Item label="审核意见" name="TKZT">
              <Radio.Group>
                <Radio value={1}>同意</Radio>
                <Radio value={2}>不同意</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="退款说明" name="BZ">
              <TextArea rows={4} maxLength={100} />
            </Form.Item>
          </Form>
          <p style={{ marginTop: 16, fontSize: 12, color: '#999' }}>
            注：退款金额 = (服务费用/服务天数)*服务剩余天数
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如若退款金额有调整，请填写退款说明。
          </p>
        </Modal>
      </div>
    </>
  );
};
export default ServiceRefund;
