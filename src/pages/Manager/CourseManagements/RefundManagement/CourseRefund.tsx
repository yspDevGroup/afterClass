/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-10-29 12:21:42
 * @LastEditTime: 2021-11-19 09:07:11
 * @LastEditors: Please set LastEditors
 */
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { message, Modal, Radio, Input, Form, InputNumber, Button, Spin } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { getAllKHXSTK, updateKHXSTK, exportTKJL } from '@/services/after-class/khxstk';
import WWOpenDataCom from '@/components/WWOpenDataCom';
import { DownloadOutlined } from '@ant-design/icons';
import { getTableWidth } from '@/utils/utils';
import SearchLayout from '@/components/Search/Layout';
import SemesterSelect from '@/components/Search/SemesterSelect';
import CourseSelect from '@/components/Search/CourseSelect';
import ClassSelect from '@/components/Search/ClassSelect';

const { TextArea } = Input;
// 退款
const CourseRefund = () => {
  // 获取到当前学校的一些信息
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  const [dataSource, setDataSource] = useState<API.KHXSTK[] | undefined>([]);
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 当前课程
  const [curKCId, setCurKCId] = useState<any>();
  // 当前课程班
  const [curBJId, setBJId] = useState<any>();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  // 学年学期筛选
  const termChange = (val: string) => {
    setCurXNXQId(val);
  };
  // 课程筛选
  const courseChange = (val: string) => {
    setCurKCId(val);
  };
  // 课程班筛选
  const classChange = (val: string) => {
    setBJId(val);
  };
  const getData = async () => {
    const resAll = await getAllKHXSTK({
      LX: 0,
      XXJBSJId: currentUser?.xxId,
      XNXQId: curXNXQId,
      KHKCSJId: curKCId,
      KHBJSJId: curBJId,
      page: 0,
      pageSize: 0,
    });
    if (resAll.status === 'ok' && resAll?.data) {
      setDataSource(resAll.data?.rows);
    } else {
      setDataSource([]);
    }
  };
  useEffect(() => {
    if (curXNXQId) {
      getData();
    }
  }, [curXNXQId, curKCId, curBJId]);

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
      title: '课程名称',
      dataIndex: 'KHBJSJ',
      key: 'KHBJSJ',
      align: 'center',
      render: (text: any, record: any) => {
        return record?.KHBJSJ?.KHKCSJ?.KCMC;
      },
      ellipsis: true,
      width: 150,
    },
    {
      title: '课程班名称',
      dataIndex: 'KHBJSJ',
      key: 'KHBJSJ',
      align: 'center',
      render: (text: any, record: any) => {
        return record?.KHBJSJ?.BJMC;
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
      title: '审批说明',
      dataIndex: 'BZ',
      key: 'BZ',
      align: 'center',
      ellipsis: true,
      width: 180,
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

  const handleSubmit = async (paramsItem: any) => {
    const { TKJE, TKZT, BZ } = paramsItem;
    if (TKJE === 0 || TKJE === 0.0) {
      message.warning('退款金额为0，无需发起退款');
    } else {
      try {
        if (current.id) {
          const params = { id: current.id };
          const body = {
            TKJE,
            TKZT,
            BZ,
            deviceIp: '117.36.118.42',
            SPSJ: new Date().toISOString(),
          };
          const res = await updateKHXSTK(params, body);
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
    }
  };

  const onExportClick = () => {
    setLoading(true);
    (async () => {
      const res = await exportTKJL({
        LX: 0,
        XXJBSJId: currentUser?.xxId,
        XNXQId: curXNXQId,
        KHBJSJId: curBJId,
        page: 0,
        pageSize: 0,
      });
      if (res.status === 'ok') {
        window.location.href = res.data;
        setLoading(false);
      } else {
        message.error(res.message);
        setLoading(false);
      }
    })();
  };
  return (
    <>
      <div>
        <Spin spinning={loading}>
          <ProTable<any>
            actionRef={actionRef}
            columns={columns}
            rowKey="id"
            pagination={{
              showQuickJumper: true,
              pageSize: 10,
              defaultCurrent: 1,
            }}
            scroll={{ x: getTableWidth(columns) }}
            dataSource={dataSource}
            headerTitle={
              <>
                <SearchLayout>
                  <SemesterSelect XXJBSJId={currentUser?.xxId} onChange={termChange} />
                  <CourseSelect XXJBSJId={currentUser?.xxId} onChange={courseChange} />
                  <ClassSelect XNXQId={curXNXQId} KHKCSJId={curKCId} onChange={classChange} />
                </SearchLayout>
              </>
            }
            options={{
              setting: false,
              fullScreen: false,
              density: false,
              reload: false,
            }}
            search={false}
            toolBarRender={() => [
              <Button icon={<DownloadOutlined />} type="primary" onClick={onExportClick}>
                导出
              </Button>,
            ]}
          />
        </Spin>
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
                min={Number(0)}
                formatter={(value) => `￥ ${value}`}
                parser={(value) => Number(value?.replace(/￥\s?/g, ''))}
                onChange={(value) => {
                  if (value === 0) {
                    message.warning('退款金额为0，无需发起退款');
                  }
                }}
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
            注：退款金额 = (课程费用/课程课时总数)*退课课时数
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如若退款金额有调整，请填写退款说明。
          </p>
        </Modal>
      </div>
    </>
  );
};
export default CourseRefund;
