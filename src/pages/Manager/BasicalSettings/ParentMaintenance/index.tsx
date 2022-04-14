/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
import React, { useRef, useState, useEffect } from 'react';
import { useModel } from 'umi';
import type { FormInstance } from 'antd';
import {
  Input,
  Select,
} from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import PageContainer from '@/components/PageContainer';
import { getTableWidth } from '@/utils/utils';

import SearchLayout from '@/components/Search/Layout';

import styles from './index.less';
import { getParent } from '@/services/after-class/parent';

const {  Search } = Input;
const ParentMaintenance = () => {
  // 列表对象引用，可主动执行刷新等操作
  const actionRef = useRef<ActionType>();
  const [dataSource, setDataSource] = useState<API.Parent[]>([]);
  // 设置模态框显示状态
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // 模态框的新增或编辑form定义
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [name, setName] = useState<string>();
  const [Telephone, setTelephone] = useState<string>();

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
      title: '家长姓名',
      dataIndex: 'XM',
      key: 'XM',
      align: 'center',
      width: 80,
      fixed: 'left',
    },
    {
      title: '联系电话',
      dataIndex: 'LXDH',
      key: 'LXDH',
      align: 'center',
      width: 160,
    },
    {
      title: '孩子',
      dataIndex: 'QJRQ',
      key: 'QJRQ',
      align: 'center',
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
        return <>编辑</>;
      },
    },
  ];
 const getData = async () => {
   const obj = {
     XXJBSJId: currentUser?.xxId,
     XM: name,
     LXDH: Telephone,
   };
   const resAll = await getParent(obj);
   if (resAll.status === 'ok' && resAll.data) {
     setDataSource(resAll.data);
   }
 };
  useEffect(() => {
    getData();
  }, [name, Telephone]);

  return (
    <PageContainer cls={styles.roomWrapper}>
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
            <div>
              <label htmlFor="type">家长姓名：</label>
              <Search
                placeholder="家长姓名"
                allowClear
                onSearch={(value: string) => {
                  setName(value);
                }}
              />
            </div>
            <div>
              <label htmlFor="type">联系电话：</label>
              <Search
                placeholder="联系电话"
                allowClear
                onSearch={(value: string) => {
                  setTelephone((value.replace(/^\s*|\s*$/g, '')));
                }}
              />
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
    </PageContainer>
  );
};

export default ParentMaintenance;




















