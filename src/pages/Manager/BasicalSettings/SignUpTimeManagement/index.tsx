/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-16 17:09:29
 * @LastEditTime: 2021-06-17 15:05:37
 * @LastEditors: txx
 */
import React, { useRef, useState } from 'react';
import type { TypeSignUpTime } from './data';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Modal, } from 'antd';
import { theme } from '@/theme-default';
import { PlusOutlined } from '@ant-design/icons';
import AlertFrom from './compoents/AlertFrom';
import PageContainer from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table';
import styles from "./index.less";


const SignUpTimeManagement = () => {
  // 设置model框是否显示  默认事否
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 点击新增报名  显示model框
  const handleOperation = () => {
    setModalVisible(true);
  };
  // model 框标题
  const getModelTitle = () => {
    return '新增'
  };
  // 点击model 确定按钮
  
  const handleSubmit = async () => {
    
  }
  // 报名时间管理页面字段
  const columns: ProColumns<TypeSignUpTime>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      key: "id",
      align: 'center',
    },
    {
      title: '报名名称',
      dataIndex: 'BMMC',
      key: 'BMMC',
      align: 'center',
    },
    {
      title: '报名开始时间',
      key: 'BMKSSJ',
      dataIndex: 'BMKSSJ',
      align: 'center',
    },
    {
      title: '报名结束时间',
      key: 'BMJSSJ',
      dataIndex: 'BMJSSJ',
      align: 'center',
    },
    {
      title: '开课时间',
      dataIndex: 'KKSJ',
      key: 'KKSJ',
      align: 'center',
    },
    {
      title: '结课时间',
      key: 'JKSJ',
      dataIndex: 'JKSJ',
      align: 'center',
    },
  ]

  return (
    <PageContainer cls={styles.SignUpTimeBox}>
      <ProTable<TypeSignUpTime>
        columns={columns}
        search={false}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button
            style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
            type="primary"
            key="add"
            onClick={() => handleOperation()}
          >
            <PlusOutlined />新增报名
          </Button>,
        ]}
        options={{
          setting: false,
          density: false,
          reload: false,
        }}
      />
      <Modal
        title={getModelTitle()}
        destroyOnClose
        width="35vw"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        centered
        footer={[
          <Button key="back" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            确定
          </Button>
        ]}
      >
        <AlertFrom />
      </Modal>

    </PageContainer>
  )
}

export default SignUpTimeManagement
