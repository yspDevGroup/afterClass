/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-12-06 11:15:21
 * @LastEditTime: 2021-12-06 12:14:08
 * @LastEditors: Sissle Lynn
 */
import React from 'react';
import PageContainer from '@/components/PageContainer';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { Form, Modal, Radio, Select, Tag, Input, message } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import EllipsisHint from '@/components/EllipsisHint';
import { getAllKHJSQJ, updateKHJSQJ } from '@/services/after-class/khjsqj';
import WWOpenDataCom from '@/components/WWOpenDataCom';
import { getTableWidth } from '@/utils/utils';
import SearchLayout from '@/components/Search/Layout';
import SemesterSelect from '@/components/Search/SemesterSelect';

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
  // 请假状态
  const [BQZT, setBQZT] = useState<number[]>();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>();
  const [name, setName] = useState<string>();
  const termChange = (val: string) => {
    setName(undefined);
    setCurXNXQId(val);
  };
  const handleSubmit = async (param: any) => {
    const { ZT, BZ } = param;
    try {
      const res = await updateKHJSQJ({ id: current?.id },
        {
          QJZT: ZT,
          BZ,
          SPJSId: currentUser?.JSId || testTeacherId,
        });
      if (res.status === 'ok') {
        message.success('审批成功');
        setVisible(false);
        setCurrent(undefined);
        actionRef.current?.reload();
      }
    } catch (err) {
      message.error('退课流程出现错误，请联系管理员或稍后重试。');
    }
  };
  const getData = async () => {
    const obj = {
      XXJBSJId: currentUser?.xxId,
      XNXQId: curXNXQId,
      JSXM: name,
      QJZT: BQZT || [0, 1, 2],
      page: 0,
      pageSize: 0,
    };
    const resAll = await getAllKHJSQJ(obj);
    if (resAll.status === 'ok' && resAll.data) {
      setDataSource(resAll.data.rows)
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
        const showWXName = record?.JZGJBSJ?.XM === '未知' && record?.JZGJBSJ?.WechatUserId;
        if (showWXName) {
          return <WWOpenDataCom type="userName" openid={record?.JZGJBSJ?.WechatUserId} />;
        }
        return record?.JZGJBSJ?.XM;
      },
    },
    {
      title: '补签日期',
      dataIndex: 'QJRQ',
      key: 'QJRQ',
      align: 'center',
      width: 160,
      render: (_: any, record: any) => `${record.KHJSQJKCs[0].QJRQ}`,
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
      title: '课程班',
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
      title: '补签时间',
      dataIndex: 'KSSJ',
      key: 'KSSJ',
      align: 'center',
      width: 160,
      render: (_: any, record: any) => `${record.KSSJ} - ${record.JSSJ}`,
    },
    {
      title: '缺卡原因',
      dataIndex: 'QJYY',
      key: 'QJYY',
      align: 'center',
      ellipsis: true,
      width: 180,
    },
    {
      title: '审批状态',
      dataIndex: 'QJZT',
      key: 'QJZT',
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
      dataIndex: 'SPJS',
      key: 'SPJS',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (_text: any, record: any) => {
        const showWXName = record?.SPJS?.XM === '未知' && record?.SPJS?.WechatUserId;
        if (showWXName) {
          return <WWOpenDataCom type="userName" openid={record?.SPJS?.WechatUserId} />;
        }
        return record?.SPJS?.XM;
      },
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
      title: '审批时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      align: 'center',
      ellipsis: true,
      width: 160,
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
            {record.QJZT === 0 ? (
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
