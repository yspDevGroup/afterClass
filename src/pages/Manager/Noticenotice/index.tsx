import PageContainer from '@/components/PageContainer';
import { paginationConfig } from '@/constant';
import { createXXGG, getAllXXGG, updateXXGG } from '@/services/after-class/xxgg';
import { theme } from '@/theme-default';
import { enHenceMsg } from '@/utils/utils';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { FormInstance } from 'antd';
import { Button, message, Modal } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useRef, useState } from 'react';
import Announcement from './components/Announcement';
import Choice from './components/Choice';
import type { NoticeItem } from './data';

const Noticenotice = () => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>();
  const [form, setForm] = useState<FormInstance<any>>();
  const [title, setTitle] = useState<string>('');
  const [refresh, setRefresh] = useState<number>(0);
  const getModelTitle = () => {
    if (title === 'current') {
      return '编辑公告';
    }
    return '新增公告';
  };
  useEffect(() => {
    actionRef.current?.reload();
  }, [refresh]);
  // 表单提交
  const handleSubmit = async () => {
    try {
      const values = await form?.validateFields();
      const { id, ...rest } = values;
      // 更新或新增场地信息
      const result = id ? await updateXXGG({ id }, { ...rest }) : await createXXGG({ ...rest });
      if (result.status === 'ok') {
        message.success(id ? '信息更新成功' : '信息新增成功');
        setModalVisible(false);
        actionRef.current?.reload();
      } else {
        enHenceMsg(result.message);
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  const handleOperation = (data?: any) => {
    if (data) {
      setCurrent(data);
      setTitle('current');
    } else {
      setCurrent(undefined);
      setTitle('');
    }
    getModelTitle();
    setModalVisible(true);
  };
  const columns: ProColumns<NoticeItem>[] = [
    {
      title: '标题',
      dataIndex: 'BT',
      key: 'BT',
      align: 'center',
      width: 250,
      ellipsis: true,
    },
    {
      title: '日期',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      align: 'center',
      width: 110,
      render: (_, record) => {
        const timeDate = moment(record.updatedAt).format('YYYY-MM-DD');
        return <span>{timeDate}</span>;
      },
    },
    {
      title: '内容',
      dataIndex: 'NR',
      key: 'NR',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'ZT',
      key: 'ZT',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      width: 150,
      render: (_, record) => {
        return (
          <Choice
            record={record}
            handleOperation={handleOperation}
            actionRef={actionRef}
            setRefresh={setRefresh}
          />
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
        request={() => {
          return getAllXXGG({ status: ['拟稿', '发布', '撤稿'] });
        }}
        options={{
          setting: false,
          fullScreen: false,
          density: false,
          reload: false,
        }}
        search={false}
        pagination={paginationConfig}
        // headerTitle={<SearchComponent dataSource={dataSource} />}
        toolBarRender={() => [
          <Button
            style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
            type="primary"
            key="add"
            onClick={() => handleOperation()}
          >
            <PlusOutlined />
            新增公告
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
          maxHeight: 334,
          overflowY: 'auto',
        }}
      >
        <Announcement current={current} setForm={setForm} />
      </Modal>
    </PageContainer>
  );
};

export default Noticenotice;
