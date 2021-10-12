import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { Select, Popconfirm, Divider, message, Modal, Radio, Input, Form, InputNumber } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import PageContainer from '@/components/PageContainer';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getKHTKSJ, updateKHTKSJ } from '@/services/after-class/khtksj';

import Style from './index.less';
import { createKHXSTK } from '@/services/after-class/khxstk';

const { Option } = Select;
const { TextArea } = Input;
// 退课
const ReimbursementClass = () => {
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
      width: 100,
    },
    {
      title: '课程名称',
      dataIndex: 'KHBJSJ',
      key: 'KHBJSJ',
      align: 'center',
      render: (text: any) => {
        return text?.KHKCSJ?.KCMC;
      },
      width: 170,
    },
    {
      title: '课程班名称',
      dataIndex: 'KHBJSJ',
      key: 'KHBJSJ',
      align: 'center',
      render: (text: any) => {
        return text?.BJMC;
      },
      width: 170,
    },
    {
      title: '退课总课时',
      dataIndex: 'KSS',
      key: 'KSS',
      align: 'center',
      width: 100,
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      render: (_, record) => {
        return record?.createdAt?.substring(0, 16)
      },
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'ZT',
      key: 'ZT',
      align: 'center',
      valueEnum: {
        0: {
          text: '申请中',
          status: 'Processing',
        },
        1: {
          text: '已完成',
          status: 'Success',
        },
        2: {
          text: '已驳回',
          status: 'Error',
        },
      },
      width: 90,
    },
    {
      title: '操作',
      dataIndex: '',
      key: '',
      align: 'center',
      render: (record: any) =>
        record.ZT === 0 ? (
          <a onClick={() => {
            setCurrent(record);
            setVisible(true);
          }}>
            审批
          </a>
        ) : (
          ''
        ),
      width: 90,
    },
  ];
  const handleSubmit = async (params: any) => {
    const { ZT, BZ } = params;
    try {
      if (current.id) {
        const params = { id: current.id };
        const body = { ZT, BZ };
        const res = await updateKHTKSJ(params, body);
        if (res.status === 'ok') {
          if (ZT === 2) {
            message.success('退课申请已驳回');
          } else {
            if (current?.KHBJSJ?.FY !== 0) {
              const money = (current?.KHBJSJ?.FY / current?.KHBJSJ?.KSS) * current?.KSS;
              const result = await createKHXSTK({
                /** 退款金额 */
                TKJE: 0.01 || money,
                /** 退款状态 */
                TKZT: 0,
                /** 学生ID */
                XSId: '61017999160006' || current?.XSId,
                /** 学生姓名 */
                XSXM: '高大强' || current?.XSXM,
                /** 班级ID */
                KHBJSJId: '135a04d7-ac43-464b-80b2-42c5d58ff470' || current?.KHBJSJId,
                /** 订单ID */
                KHXSDDId: 'f2e94e66-f63e-44df-bba6-fbec96f51f62',
                /** 学校ID */
                XXJBSJId: currentUser?.xxId
              });
              if (result.status === 'ok') {
                message.success('退课成功,已自动申请退款流程');
              }
            } else {
              message.success('退课成功');
            }
          }
          setVisible(false);
          setCurrent(undefined);
          actionRef.current?.reload();
        } else {
          message.error(res.message || '退课流程出现错误，请联系管理员或稍后重试。');
        }
      }
    } catch (err) {
      message.error('退课流程出现错误，请联系管理员或稍后重试。');
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
            const resAll = await getKHTKSJ({
              XXJBSJId: currentUser?.xxId,
              XNXQId: curXNXQId,
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
          title="退课审核"
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
          <p style={{ marginTop: 16, fontSize: 12, color: '#999' }}>注：如本流程涉及到退款将会自动发起退款申请。</p>
        </Modal>
      </div>
    </PageContainer>
  );
};
export default ReimbursementClass;
