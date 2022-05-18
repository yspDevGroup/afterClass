/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2022-05-12 15:05:21
 * @LastEditTime: 2022-05-18 11:34:25
 * @LastEditors: Sissle Lynn
 */
import React from 'react';
import PageContainer from '@/components/PageContainer';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { Form, Modal, Radio, Select, Input, message, Divider } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ShowName from '@/components/ShowName';
import { getTableWidth } from '@/utils/utils';
import SearchLayout from '@/components/Search/Layout';
import SemesterSelect from '@/components/Search/SemesterSelect';
import { JSInforMation } from '@/components/JSInforMation';
import { getAllKHKQXG, getKHKQXG, updateKHKQXG } from '@/services/after-class/khkqxg';
import NewAdd from './NewAdd';

import styles from './index.less';
const { TextArea } = Input;
const { Option } = Select;

/**
 * 学生考勤更改管理
 * @returns
 */
const RecheckManagement = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  const [dataSource, setDataSource] = useState<any[]>([]);
  // 选择学年学期
  const [curXNXQ, setCurXNXQ] = useState<Record<string, string>>();
  // 状态
  const [BQZT, setBQZT] = useState<number[]>();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>();
  const [name, setName] = useState<string>();
  const [course, setCourse] = useState<any>();
  const termChange = (val: string, key?: string, start?: string, end?: string) => {
    setName(undefined);
    setCurXNXQ({
      KSRQ: start || '',
      JSRQ: end || '',
    });
  };
  const getData = async () => {
    const resAll = await getAllKHKQXG({
      XXJBSJId: currentUser?.xxId,
      // SQRId: name,
      ZT: BQZT,
      startDate: curXNXQ?.KSRQ,
      endDate: curXNXQ?.JSRQ,
    });
    if (resAll.status === 'ok' && resAll.data) {
      setDataSource(resAll.data);
    }
  };
  const handleSubmit = async (param: any) => {
    const { ZT, BZ } = param;
    try {
      const res = await updateKHKQXG(
        { id: current?.id },
        {
          ZT: ZT,
          SPBZXX: BZ,
          SPRId: currentUser?.JSId || testTeacherId,
        },
      );
      if (res.status === 'ok') {
        message.success('审批成功');
        setVisible(false);
        setCurrent(undefined);
        form.resetFields();
        getData();
      }
    } catch (err) {
      message.error('审批流程出现错误，请联系管理员或稍后重试。');
    }
  };
  useEffect(() => {
    if (curXNXQ) {
      getData();
    }
  }, [curXNXQ, BQZT, name]);
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
      title: '申请人',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
      width: 80,
      fixed: 'left',
      render: (_text: any, record: any) => (
        <ShowName type="userName" openid={record?.SQR?.WechatUserId} XM={record?.SQR?.XM} />
      ),
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
      title: '考勤日期',
      dataIndex: 'CQRQ',
      key: 'CQRQ',
      align: 'center',
      width: 120,
    },
    {
      title: '审批状态',
      dataIndex: 'ZT',
      key: 'ZT',
      valueType: 'select',
      width: 140,
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
        3: {
          text: '申请人撤销',
          status: 'Warning',
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
      render: (_text: any, record: any) => (
        <ShowName type="userName" openid={record?.SPR?.WechatUserId} XM={record?.SPR?.XM} />
      ),
    },
    {
      title: '审批说明',
      dataIndex: 'SPBZXX',
      key: 'SPBZXX',
      align: 'center',
      ellipsis: true,
      width: 180,
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
            {record.ZT === 0 ? (
              <a
                onClick={async () => {
                  if (JSInforMation(currentUser)) {
                    const res = await getKHKQXG({ id: record?.id });
                    if (res.status === 'ok') {
                      setCourse(res.data?.KHXSKQXGs);
                    }
                    setCurrent(record);
                    setVisible(true);
                  }
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
  const stuColumns: any = [
    {
      title: '姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
      render: (test: any, record: any) => {
        return (
          <ShowName type="userName" openid={record?.XSJBSJ?.WechatUserId} XM={record?.XSJBSJ?.XM} />
        );
      },
    },
    {
      title: '原考勤情况',
      dataIndex: 'SRCCQZT',
      key: 'SRCCQZT',
      align: 'center',
    },
    {
      title: '现考勤情况',
      dataIndex: 'NOWCQZT',
      key: 'NOWCQZT',
      align: 'center',
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
            {/* <div>
              <label htmlFor="type">申请人名称：</label>
              <Search
                placeholder="申请人姓名"
                allowClear
                onSearch={(value: string) => {
                  setName(value);
                }}
              />
            </div> */}
            <div>
              <label htmlFor="status">审批状态：</label>
              <Select
                allowClear
                value={BQZT?.[0]}
                onChange={(value: number) => {
                  setBQZT(value !== undefined ? [value] : value);
                }}
              >
                <Option key="待审批" value={0}>
                  待审批
                </Option>
                <Option key="已通过" value={1}>
                  已通过
                </Option>
                <Option key="已驳回" value={2}>
                  已驳回
                </Option>
                <Option key="申请人撤销" value={3}>
                  申请人撤销
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
        toolbar={{
          actions: [<NewAdd key="add" refresh={getData} />],
        }}
      />
      <Modal
        title="学生考勤变更审批"
        visible={visible}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
          setCurrent(undefined);
        }}
        className={styles.modalEdit}
        okText="确认"
        cancelText="取消"
      >
        <ProTable<any>
          dataSource={course}
          columns={stuColumns}
          headerTitle={'考勤更改明细'}
          rowKey="id"
          pagination={{
            defaultPageSize: 5,
            defaultCurrent: 1,
            pageSizeOptions: ['5'],
            showQuickJumper: false,
            showSizeChanger: false,
            showTotal: undefined,
          }}
          search={false}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
        />
        <Divider style={{ margin: '0 0 12px' }} />
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

export default RecheckManagement;
