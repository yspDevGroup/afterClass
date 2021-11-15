/* eslint-disable no-param-reassign */
import React, { useRef, useState } from 'react';
import PageContainer from '@/components/PageContainer';
import { theme } from '@/theme-default';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { FormInstance } from 'antd';
import { Popconfirm } from 'antd';
import { Divider, Form, Input } from 'antd';
import { Button } from 'antd';
import type { Maintenance } from './data';
import styles from './index.less';
import Modal from 'antd/lib/modal/Modal';
import {
  createXXSJPZ,
  deleteXXSJPZ,
  getAllXXSJPZ,
  updateXXSJPZ,
} from '@/services/after-class/xxsjpz';
import { message } from 'antd';
import moment from 'moment';
import AsyncTimePeriodForm from './components/AsyncTimePeriodForm';
import type { ReactNode } from 'react';
import { enHenceMsg } from '@/utils/utils';
import { useModel } from 'umi';
import { sendMessageToParent } from '@/services/after-class/wechat';

const PeriodMaintenance = () => {
  const [currentStatus, setCurrentStatus] = useState<string | undefined>('enroll');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [amVisible, setAMVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Maintenance>();
  const [form, setForm] = useState<FormInstance<any>>();
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const formRef = React.createRef<any>();
  let requestType = ['1'];
  let formatType = 'YYYY-MM-DD';
  if (currentStatus === 'education') {
    requestType = ['2'];
  } else if (currentStatus === 'schedule') {
    requestType = ['0'];
    formatType = 'HH:mm:ss';
  }
  const getModelTitle = () => {
    if (current) {
      return '编辑信息';
    }
    return '新增';
  };
  const handleEdit = (data: Maintenance) => {
    if (currentStatus === 'schedule') {
      formatType = 'HH:mm';
    }
    const parpm = {
      XNXQId: data.XNXQ?.id,
      KSSJ: moment(data.KSSJ, formatType),
      JSSJ: moment(data.JSSJ, formatType),
    };
    setCurrent({ ...data, ...parpm });
    getModelTitle();
    setModalVisible(true);
  };

  const handleOperation = (type: string, data?: Maintenance) => {
    if (data) {
      setCurrent(data);
    } else {
      setCurrent(undefined);
    }
    getModelTitle();
    setModalVisible(true);
  };
  const handleSubmit = async () => {
    try {
      const values = await form?.validateFields();
      const { id, ...rest } = values;
      const KSSJ = moment(rest.KSSJ).format(formatType);
      const JSSJ = moment(rest.JSSJ).format(formatType);
      if (KSSJ > JSSJ) {
        message.warning('"开始时间"不能大于"结束时间"');
      } else {
        rest.KSSJ = moment(rest.KSSJ).format(formatType);
        rest.JSSJ = moment(rest.JSSJ).format(formatType);
        const result = id
          ? await updateXXSJPZ(
              { id },
              { ...rest, TYPE: requestType[0], XXJBSJId: currentUser?.xxId },
            )
          : await createXXSJPZ({ ...rest, TYPE: requestType[0], XXJBSJId: currentUser?.xxId });
        if (result.status === 'ok') {
          message.success(id ? '信息更新成功' : '信息新增成功');
          setModalVisible(false);
          actionRef.current?.reload();
        } else {
          enHenceMsg(result.message);
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const handleAMSubmit = async () => {
    formRef.current
      .validateFields()
      .then(async (values: any) => {
        const res = await sendMessageToParent({
          to: 'toall',
          text: values.info,
          ids: [],
        });
        setAMVisible(false);
        if (res.status === 'ok') {
          message.success('通知已成功发送');
        } else {
          message.error(res.message);
        }
        formRef.current.validateFields();
      })
      .catch((info: { errorFields: any }) => {
        console.log(info.errorFields);
      });
  };

  const columns: ProColumns<Maintenance>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '时段名称',
      dataIndex: 'TITLE',
      align: 'center',
      width: 200,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '所属学期',
      dataIndex: 'SSXQ',
      align: 'center',
      width: 200,
      render: (_: ReactNode, entity: Maintenance) => {
        return (
          <div>
            {entity.XNXQ?.XN}
            {entity.XNXQ?.XQ}
          </div>
        );
      },
    },
    {
      title: '开始时间',
      dataIndex: 'KSSJ',
      align: 'center',
      width: 160,
      ellipsis: true,
      render: (_, record: any) => {
        return currentStatus === 'schedule' ? record.KSSJ.slice(0, 5) : record.KSSJ;
      },
    },
    {
      title: '结束时间',
      dataIndex: 'JSSJ',
      align: 'center',
      width: 160,
      ellipsis: true,
      render: (_, record: any) => {
        return currentStatus === 'schedule' ? record.JSSJ.slice(0, 5) : record.JSSJ;
      },
    },
    {
      title: '备注',
      dataIndex: 'BZXX',
      align: 'center',
      ellipsis: true,
      width: 200,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 230,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title="删除之后，数据不可恢复，确定要删除吗?"
            onConfirm={async () => {
              try {
                if (record.id) {
                  const params = { id: record.id };
                  const res = deleteXXSJPZ(params);
                  new Promise((resolve) => {
                    resolve(res);
                  }).then((data: any) => {
                    if (data.status === 'ok') {
                      message.success('删除成功');
                      actionRef.current?.reload();
                    } else {
                      message.error('删除失败');
                    }
                  });
                }
              } catch (err) {
                message.error('删除失败，请联系管理员或稍后重试。');
              }
            }}
            okText="确定"
            cancelText="取消"
            placement="topRight"
          >
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => setAMVisible(true)}>开学通知</a>
        </>
      ),
    },
  ];
  return (
    <>
      <PageContainer cls={styles.periodWrapper}>
        <ProTable<Maintenance>
          columns={columns}
          actionRef={actionRef}
          toolbar={{
            menu: {
              type: 'tab',
              items: [
                {
                  label: '报名时段维护',
                  key: 'enroll',
                },
                {
                  label: '开课时段维护',
                  key: 'education',
                },
                {
                  label: '排课时段维护',
                  key: 'schedule',
                },
              ],
              onChange: (activeKey) => {
                setCurrentStatus(activeKey?.toString());
                actionRef.current?.reload();
              },
            },
          }}
          search={false}
          pagination={{
            showQuickJumper: true,
            pageSize: 10,
            defaultCurrent: 1,
          }}
          scroll={{ x: 900 }}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
          request={async () => {
            const opt = {
              XXJBSJId: currentUser.xxId,
              type: requestType,
            };
            const res = await getAllXXSJPZ(opt);
            return res;
          }}
          rowKey="id"
          dateFormatter="string"
          toolBarRender={() => [
            <span style={{ color: '#4884ff', marginRight: 10 }}>
              该页面所有时间维护，皆与本校课后服务密切相关，请谨慎操作
            </span>,
            <Button
              style={{ background: theme.btnPrimarybg, borderColor: theme.btnPrimarybg }}
              type="primary"
              key="add"
              onClick={() => handleOperation('add')}
            >
              <PlusOutlined />
              新增时段
            </Button>,
          ]}
        />
        <Modal
          title={getModelTitle()}
          destroyOnClose
          width="35vw"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={[
            <Button key="submit" type="primary" onClick={handleSubmit}>
              确定
            </Button>,
            <Button key="back" onClick={() => setModalVisible(false)}>
              取消
            </Button>,
          ]}
          centered
          maskClosable={false}
          bodyStyle={{
            maxHeight: '65vh',
            overflowY: 'auto',
          }}
        >
          <AsyncTimePeriodForm currentStatus={currentStatus} current={current} setForm={setForm} />
        </Modal>
        <Modal
          title={'报名通知'}
          destroyOnClose
          width="35vw"
          visible={amVisible}
          onCancel={() => setAMVisible(false)}
          footer={[
            <Button key="submit" type="primary" onClick={handleAMSubmit}>
              确定
            </Button>,
            <Button key="back" onClick={() => setAMVisible(false)}>
              取消
            </Button>,
          ]}
          centered
          maskClosable={false}
          bodyStyle={{
            maxHeight: '65vh',
            overflowY: 'auto',
          }}
        >
          <Form ref={formRef}>
            <Form.Item name="info" initialValue={'课后服务报名开始啦！'}>
              <Input.TextArea defaultValue={'课后服务报名开始啦！'} />
            </Form.Item>
          </Form>
        </Modal>
      </PageContainer>
    </>
  );
};

export default PeriodMaintenance;
