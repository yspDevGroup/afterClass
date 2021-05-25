/* eslint-disable no-console */
import PageContainer from '@/components/PageContainer';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Divider } from 'antd';
import styles from './index.less';
import type { RoomItem } from './data';
import { Button } from 'antd';
import { theme } from '@/theme-default';
import { listData } from './mock';
import { paginationConfig } from '@/constant';
import { Popconfirm } from 'antd';
import { useState } from 'react';
import StudentInformation from './components/StudentInformation';
import AddClass from './components/AddClass';

const ClassManagement = () => {
  const [modalType, setModalType] = useState<string>('add');
  const [current, setCurrent] = useState<RoomItem | null>(null);

  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  const getModelTitle = () => {
    if (modalType === 'preview') {
      return '作息时间表预览';
    }
    if (modalType === 'classReset') {
      return '节次维护';
    }
    if (current) {
      return '编辑信息';
    }
    return '新增';
  };

  const handleEdit = (data: RoomItem) => {
    setModalType('add');
    setCurrent(data);
    getModelTitle();
  };

  const columns: ProColumns<RoomItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
    },
    {
      title: '班级名称',
      dataIndex: 'BJMC',
      align: 'center',
    },
    {
      title: '上课地点',
      dataIndex: 'SKDD',
      align: 'center',
    },
    {
      title: '授课老师',
      dataIndex: 'SKLS',
      align: 'center',
    },
    {
      title: `助教老师`,
      dataIndex: 'ZJLS',
      align: 'center',
      ellipsis: true,
      // render:(dom,index)=>{
      //     console.log(index.ZJLS)
      //     return(
      //         <>
      //        {
      //            index.ZJLS?.map((item)=>{
      //                return (
      //                ` ${item};`
      //                )
      //            })
      //        }
      //         </>
      //     )
      // }
    },
    {
      title: '学生人数',
      dataIndex: 'XSRS',
      align: 'center',
      render: (dom) => {
        return (
          <a>
            <StudentInformation dom={dom} />
          </a>
        );
      },
    },
    {
      title: '简介',
      dataIndex: 'JJ',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'ZT',
      align: 'center',
      width: 220,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (_, record) => (
        <>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除吗？" okText="是" cancelText="否">
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
        <ProTable<RoomItem>
          columns={columns}
          search={false}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
          pagination={paginationConfig}
          dataSource={listData}
          toolBarRender={() => [
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
        <AddClass visible={visible} onClose={onClose} />
      </PageContainer>
    </>
  );
};
export default ClassManagement;
