import PageContainer from '@/components/PageContainer';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Divider } from 'antd';
import styles from './index.less';
import React, { useState } from 'react';
import type { RoomItem } from './data';
import { Button } from 'antd';
import { theme } from '@/theme-default';
import AddCourse from './components/AddCourse';

const CourseManagement = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  const columns: ProColumns<RoomItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
    },
    {
      title: '课程名称',
      dataIndex: 'CDMC',
      align: 'center',
    },
    {
      title: '类型',
      dataIndex: 'CDLX',
      align: 'center',
    },
    {
      title: '时长',
      dataIndex: 'SSXQ',
      align: 'center',
    },
    {
      title: '费用',
      dataIndex: 'RNRS',
      align: 'center',
    },
    {
      title: '课程封面',
      dataIndex: 'CDDZ',
      align: 'center',
    },
    {
      title: '简介',
      dataIndex: 'BZ',
      align: 'center',
      width: 220,
    },
    {
      title: '状态',
      dataIndex: 'BZ',
      align: 'center',
      width: 220,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: () => (
        <>
          <a>编辑</a>
          <Divider type="vertical" />
          <a>删除</a>
        </>
      ),
      align: 'center',
    },
  ];

  return (
    <>
      <PageContainer cls={styles.roomWrapper}>
        <ProTable<RoomItem>
          columns={columns}
          toolBarRender={() => [
            <Button
              style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
              type="primary"
              key="add"
              onClick={() => showDrawer()}
            >
              新增
            </Button>,
          ]}
        />
        <AddCourse visible={visible} onClose={onClose} />
      </PageContainer>
    </>
  );
};

export default CourseManagement;
