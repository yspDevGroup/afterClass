import React from 'react';
import { useRef, useState } from 'react';
import { message, Popconfirm, Divider, Button, Modal } from 'antd';
import PageContainer from '@/components/PageContainer';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { theme } from '@/theme-default';
import { paginationConfig } from '@/constant';
import SearchComponent from '@/components/Search';
import { deleteKHKCSJ, getAllKHKCSJ } from '@/services/after-class/khkcsj';
import AddCourse from './components/AddCourse';
import CourseType from './components/CourseType';
import type { CourseItem } from './data';
import styles from './index.less';

const CourseManagement = () => {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<CourseItem>();
  const [openes, setopenes] = useState(false);
  const actionRef = useRef<ActionType>();

  const showDrawer = () => {
    setVisible(true);
    setCurrent(undefined);
  };

  const handleEdit = (data: CourseItem) => {
    setVisible(true);
    setCurrent(data);
  };

  const onClose = () => {
    setVisible(false);
  };
  const maintain = () => {
    setopenes(true);
  };
  const showmodal = () => {
    setopenes(false);
  };
  const columns: ProColumns<CourseItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
    },
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      align: 'center',
      width: '12%',
    },
    {
      title: '类型',
      dataIndex: 'KCLX',
      align: 'center',
      width: '10%',
    },
    {
      title: '时长',
      dataIndex: 'KCSC',
      align: 'center',
      width: '10%',
    },
    {
      title: '费用(元)',
      dataIndex: 'KCFY',
      align: 'center',
      width: '10%',
    },
    {
      title: '课程封面',
      dataIndex: 'KCTP',
      align: 'center',
      ellipsis: true,
      width: 100,

      render: (dom, index) => {
        return (
          <a href={index.KCTP} target="view_window">
            课程封面.png
          </a>
        );
      },
    },
    {
      title: '简介',
      dataIndex: 'KCMS',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'CKZT',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
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
                  const res = deleteKHKCSJ(params);
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
            placement="topLeft"
          >
            <a>删除</a>
          </Popconfirm>
        </>
      ),
      align: 'center',
    },
  ];

  return (
    <>
      <PageContainer cls={styles.roomWrapper}>
        <ProTable<CourseItem>
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          request={(param, sorter, filter) => {
            const obj = {
              param,
              sorter,
              filter,
              njId: 'dd149420-7d4b-4191-8ddc-6b686a2bd63f',
              xn: '2021学年',
              xq: '第一学期',
              xxId: 'd18f9105-9dfb-4373-9c76-bc68f670fff5',
              name: '',
            };
            return getAllKHKCSJ(obj);
          }}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
          search={false}
          pagination={paginationConfig}
          headerTitle={
            <SearchComponent
              placeholder="课程名称"
              fieldOne="学年学期 :"
              one="2020-2021"
              two="第一学期"
              HeaderFieldTitleNum={true}
              onlySearch={false}
            />
          }
          toolBarRender={() => [
            <Button key="wh" onClick={() => maintain()}>
              课程类型维护
            </Button>,
            <Button
              style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
              type="primary"
              key="add"
              onClick={() => showDrawer()}
            >
              新增课程
            </Button>,
          ]}
        />
        <AddCourse actionRef={actionRef} visible={visible} onClose={onClose} formValues={current} />
        <Modal
          visible={openes}
          onCancel={showmodal}
          title="课程类型维护"
          centered
          bodyStyle={{
            maxHeight: '65vh',
            overflowY: 'auto',
          }}
          width="40vw"
          footer={[
            <Button key="back" onClick={() => setopenes(false)}>
              取消
            </Button>,
            <Button key="submit" type="primary">
              确定
            </Button>,
          ]}
        >
          <CourseType />
        </Modal>
      </PageContainer>
    </>
  );
};

export default CourseManagement;
