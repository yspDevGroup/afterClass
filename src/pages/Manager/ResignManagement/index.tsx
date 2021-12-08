/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-12-06 11:15:21
 * @LastEditTime: 2021-12-08 17:21:18
 * @LastEditors: Sissle Lynn
 */
import React from 'react';
import PageContainer from '@/components/PageContainer';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { Form, Modal, Radio, Select, Input, message } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import WWOpenDataCom from '@/components/WWOpenDataCom';
import { getTableWidth } from '@/utils/utils';
import SearchLayout from '@/components/Search/Layout';
import SemesterSelect from '@/components/Search/SemesterSelect';
import { getAllJSCQBQ, updateJSCQBQ } from '@/services/after-class/jscqbq';

const { TextArea, Search } = Input;
const { Option } = Select;

/**
 * 补签管理
 * @returns
 */
const ResignManagement = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  const [dataSource, setDataSource] = useState<any[]>([]);
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<string>();
  // 状态
  const [BQZT, setBQZT] = useState<number[]>();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>();
  const [name, setName] = useState<string>();
  const termChange = (val: string) => {
    setName(undefined);
    setCurXNXQId(val);
  };
  const getData = async () => {
    const obj = {
      XXJBSJId: currentUser?.xxId,
      XNXQId: curXNXQId,
      BQRXM: name,
      SPZT: BQZT,
      page: 0,
      pageSize: 0,
    };
    const resAll = await getAllJSCQBQ(obj);
    if (resAll.status === 'ok' && resAll.data) {
      setDataSource(resAll.data);
    }
  };
  const handleSubmit = async (param: any) => {
    const { ZT, BZ } = param;
    try {
      const res = await updateJSCQBQ({ id: current?.id },
        {
          SPZT: ZT,
          SPSM: BZ,
          SPRId: currentUser?.JSId || testTeacherId,
        });
      if (res.status === 'ok') {
        message.success('审批成功');
        setVisible(false);
        setCurrent(undefined);
        getData();
      }
    } catch (err) {
      message.error('补签流程出现错误，请联系管理员或稍后重试。');
    }
  };
  useEffect(() => {
    if (curXNXQId) {
      getData();
    }
  }, [curXNXQId, BQZT, name]);
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
        const showWXName = record?.BQR?.XM === '未知' && record?.BQR?.WechatUserId;
        if (showWXName) {
          return <WWOpenDataCom type="userName" openid={record?.BQR?.WechatUserId} />;
        }
        return record?.BQR?.XM;
      },
    },
    {
      title: '课程名称',
      dataIndex: 'KHQJKCs',
      key: 'KHQJKCs',
      align: 'center',
      ellipsis: true,
      render: (text: any, record: any) => record.KHBJSJ?.KHKCSJ?.KCMC,
      width: 150,
    },
    {
      title: '课程班',
      dataIndex: 'KHQJKCs',
      key: 'KHQJKCs_BJMC',
      align: 'center',
      ellipsis: true,
      render: (text: any, record: any) => record.KHBJSJ?.BJMC,
      width: 120,
    },
    {
      title: '补签类型',
      dataIndex: 'SQNR',
      key: 'SQNR',
      align: 'center',
      width: 90,
    },
    {
      title: '补签日期',
      dataIndex: 'BQRQ',
      key: 'BQRQ',
      align: 'center',
      width: 120,
    },
    {
      title: '缺卡原因',
      dataIndex: 'QKYY',
      key: 'QKYY',
      align: 'center',
      ellipsis: true,
      width: 180,
    },
    {
      title: '审批状态',
      dataIndex: 'SPZT',
      key: 'SPZT',
      valueType: 'select',
      width: 80,
      align: 'center',
      valueEnum: {
        0: { text: '待审批', status: 'Processing' },
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
      title: '审批人',
      dataIndex: 'SPR',
      key: 'SPR',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (_text: any, record: any) => {
        const showWXName = record?.SPR?.XM === '未知' && record?.SPR?.WechatUserId;
        if (showWXName) {
          return <WWOpenDataCom type="userName" openid={record?.SPR?.WechatUserId} />;
        }
        return record?.SPR?.XM;
      },
    },
    {
      title: '审批说明',
      dataIndex: 'SPSM',
      key: 'SPSM',
      align: 'center',
      ellipsis: true,
      width: 180,
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      ellipsis: true,
      width: 160,
    },
    {
      title: '审批时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      align: 'center',
      ellipsis: true,
      width: 160,
      render: (text: any, record: any) => record.SPZT === 0 ? '' : record.updatedAt
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      width: 80,
      render: (_, record: any) => {
        return (
          <>
            {record.SPZT === 0 ? (
              <a
                onClick={() => {
                  setCurrent(record);
                  setVisible(true);
                }}
              >
                审批
              </a>
            ) : (
              ''
            )}
          </>
        );
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable<any>
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        dataSource={dataSource}
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
          defaultCurrent: 1,
        }}
        scroll={{ x: getTableWidth(columns) }}
        headerTitle={
          <SearchLayout>
            <SemesterSelect XXJBSJId={currentUser?.xxId} onChange={termChange} />
            <div>
              <label htmlFor='type'>教师名称：</label>
              <Search placeholder="教师名称" allowClear onSearch={(value: string) => {
                setName(value);
              }} />
            </div>
            <div>
              <label htmlFor='status'>审批状态：</label>
              <Select
                allowClear
                value={BQZT?.[0]}
                onChange={(value: number) => {
                  setBQZT(value !== undefined ? [value] : value);
                }}
              >
                <Option key='待审批' value={0}>
                  待审批
                </Option>
                <Option key='已通过' value={1}>
                  已通过
                </Option>
                <Option key='已驳回' value={2}>
                  已驳回
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
        search={false}
      />
      <Modal
        title="补签审批"
        visible={visible}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
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
          <Form.Item label="审批意见" name="ZT">
            <Radio.Group>
              <Radio value={1}>同意</Radio>
              <Radio value={2}>不同意</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="审批说明" name="BZ">
            <TextArea rows={4} maxLength={100} />
          </Form.Item>
        </Form>
      </Modal>

    </PageContainer>
  );
};

export default ResignManagement;
