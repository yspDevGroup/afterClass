/* eslint-disable no-param-reassign */
import React, { useRef, useState } from 'react';
import PageContainer from '@/components/PageContainer';
import { theme } from '@/theme-default';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { FormInstance } from 'antd';
import { Popconfirm } from 'antd';
import { Divider } from 'antd';
import { Button } from 'antd';
import type { Maintenance } from './data';
import styles from './index.less';
import Modal from 'antd/lib/modal/Modal';
import { paginationConfig } from '@/constant';
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

const PeriodMaintenance = () => {
  const [currentStatus, setCurrentStatus] = useState<string | undefined>('enroll');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Maintenance>();
  const [form, setForm] = useState<FormInstance<any>>();
  const actionRef = useRef<ActionType>();
  let requestType = "1";
  if (currentStatus === 'education') {
    requestType = "2";
  } else if (currentStatus === 'schedule') {
    requestType = "0";
  }
  const getModelTitle = () => {
    if (current) {
      return '编辑信息';
    }
    return '新增';
  };
  const handleEdit = (data: Maintenance) => {
    const parpm = {
      KSSJ: moment(data.KSSJ, 'HH:mm'),
      JSSJ: moment(data.JSSJ, 'HH:mm'),
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
      const KSSJ = moment(rest.KSSJ).format('HH:mm:ss');
      const JSSJ = moment(rest.JSSJ).format('HH:mm:ss');
      if (KSSJ > JSSJ) {
        message.warning('"开始时间"不能大于"结束时间"');
      } else {
        rest.KSSJ = moment(rest.KSSJ).format('HH:mm:ss');
        rest.JSSJ = moment(rest.JSSJ).format('HH:mm:ss');
        const result = id
          ? await updateXXSJPZ({ id }, { ...rest,TYPE: requestType })
          : await createXXSJPZ({ ...rest,TYPE: requestType });
        if (result.status === 'ok') {
          message.success(id ? '信息更新成功' : '信息新增成功');
          setModalVisible(false);
          actionRef.current?.reload();
        } else {
          message.error(`${result.message},请联系管理员或稍后再试`);
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const columns: ProColumns<Maintenance>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
      align: 'center',
    },
    {
      title: '时段名称',
      dataIndex: 'TITLE',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '所属学期',
      dataIndex: 'SSXQ',
      align: 'center',
      width: '15%',
      render: (_: ReactNode, entity: Maintenance) => {
        return (
          <div>{entity.XNXQ?.XN}{entity.XNXQ?.XQ}</div>
        )
      }
    },
    {
      title: '开始时间',
      dataIndex: 'KSSJ',
      align: 'center',
      width: '10%',
      ellipsis: true,
      render: (text, record: any) => {
        return record.KSSJ.slice(0, 5);
      },
    },
    {
      title: '结束时间',
      dataIndex: 'JSSJ',
      align: 'center',
      width: '10%',
      ellipsis: true,
      render: (text, record: any) => {
        return record.JSSJ.slice(0, 5);
      },
    },
    {
      title: '备注',
      dataIndex: 'BZXX',
      align: 'center',
      width: '10%',
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      align: 'center',
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
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
          request={async () => {
            const opt = {
              xn: '',
              xq: '',
              type: requestType
            };
            const res = await getAllXXSJPZ(opt);
            return res;
          }}
          rowKey="id"
          pagination={paginationConfig}
          dateFormatter="string"
          toolBarRender={() => [
            <Button
              style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
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
            <Button key="back" onClick={() => setModalVisible(false)}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={handleSubmit}>
              确定
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
      </PageContainer>
    </>
  );
};

export default PeriodMaintenance;
