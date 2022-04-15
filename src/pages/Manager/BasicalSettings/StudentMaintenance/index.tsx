/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
import React, { useRef, useState, useEffect } from 'react';
import { useModel } from 'umi';
import { Tag } from 'antd';
import { Input } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import PageContainer from '@/components/PageContainer';
import { getTableWidth } from '@/utils/utils';
import SearchLayout from '@/components/Search/Layout';
import styles from './index.less';
import { getAllXSJBSJ } from '@/services/after-class/xsjbsj';
import EllipsisHint from '@/components/EllipsisHint';
import SelectParent from './selectParent';

const { Search } = Input;
const StudentMaintenance = () => {
  // 列表对象引用，可主动执行刷新等操作
  const actionRef = useRef<ActionType>();
  const [dataSource, setDataSource] = useState<API.XSJBSJ[]>([]);
  // 模态框的新增或编辑form定义
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [name, setName] = useState<string>();
  const [Telephone, setTelephone] = useState<string>();
  const getData = async () => {
    const obj = {
      XXJBSJId: currentUser?.xxId,
      keyWord: name,
      // LXDH: Telephone,
      page: 0,
      pageSize: 0,
    };
    // const res = await getParent({});
    const resAll = await getAllXSJBSJ(obj);
    if (resAll.status === 'ok' && resAll.data?.rows) {
      setDataSource(resAll.data.rows);
    } else {
      setDataSource([]);
    }
  };

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
      title: '校区',
      dataIndex: 'XQSJ',
      key: 'XQSJ',
      align: 'center',
      width: 80,
      fixed: 'left',
      render: (text: any) => {
        return text?.XQMC;
      },
    },
    {
      title: '学生姓名',
      dataIndex: 'XM',
      key: 'XM',
      align: 'center',
      width: 80,
      fixed: 'left',
    },
    {
      title: '行政班名称',
      dataIndex: 'BJSJ',
      key: 'BJSJ',
      align: 'center',
      width: 160,
      render: (text: any) => {
        return `${text?.NJSJ?.XD}${text?.NJSJ?.NJMC}${text.BJ}`;
      },
    },
    {
      title: '家长姓名',
      dataIndex: 'Parents',
      key: 'Parents',
      align: 'center',
      width: 160,
      render: (text: any) => {
        return (
          <EllipsisHint
            width="100%"
            text={text?.map((item: any) => {
              return <Tag key={item.id}>{item.XM}</Tag>;
            })}
          />
        );
      },
    },
    // {
    //   title: '家长电话',
    //   dataIndex: 'parent',
    //   key: 'parent',
    //   align: 'center',
    //   width: 160,
    //   render: (text: any, record: any) => {
    //     return (
    //       <EllipsisHint
    //         width="100%"
    //         text={[].map((item: any) => {
    //           return <Tag key={item.id}>{item.LXDH}</Tag>;
    //         })}
    //       />
    //     );
    //   },
    // },

    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      width: 80,
      render: (_, record) => {
        return (
          <SelectParent
            id={record.id}
            onRefresh={getData}
            XXJBSJId={currentUser?.xxId}
            ParentIds={record?.Parents?.map((item: any) => item.id)}
          />
        );
      },
    },
  ];

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
              <label htmlFor="type">学生姓名：</label>
              <Search
                placeholder="学生姓名"
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
                  setTelephone(value.replace(/^\s*|\s*$/g, ''));
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

export default StudentMaintenance;
