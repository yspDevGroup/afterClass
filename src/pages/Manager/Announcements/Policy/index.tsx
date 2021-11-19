/*
 * @description:
 * @author: wsl
 * @Date: 2021-08-31 10:08:34
 * @LastEditTime: 2021-11-18 17:30:51
 * @LastEditors: Sissle Lynn
 */
import { useState, useRef, useEffect } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Link, useModel } from 'umi';
import type { TableListItem } from '../data';
import styles from '../index.module.less';
import { getJYJGTZGG } from '@/services/after-class/jyjgtzgg';
import PageContainer from '@/components/PageContainer';
import { getTableWidth } from '@/utils/utils';
import SearchLayout from '@/components/Search/Layout';
import { Input } from 'antd';

const { Search } = Input;
const TableList = () => {
  const [dataSource, setDataSource] = useState<API.JYJGTZGG[]>();
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [title, setTitle] = useState<string>();
  const getData = async () => {
    const resgetXXTZGG = await getJYJGTZGG({
      BT: title,
      LX: 1,
      ZT: ['已发布'],
      XZQHM: currentUser?.XZQHM,
      page: 0,
      pageSize: 0,
    });
    if (resgetXXTZGG.status === 'ok') {
      setDataSource(resgetXXTZGG.data?.rows);
    }
  };
  useEffect(() => {
    getData()
  }, [title]);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      fixed: 'left',
      align: 'center',
    },
    {
      title: '标题',
      dataIndex: 'BT',
      key: 'BT',
      ellipsis: true,
      align: 'center',
      fixed: 'left',
      width: 180,
    },
    {
      title: '副标题',
      dataIndex: 'FBT',
      key: 'FBT',
      ellipsis: true,
      align: 'center',
      search: false,
      width: 120,
    },
    {
      title: '作者',
      dataIndex: 'ZZ',
      key: 'ZZ',
      ellipsis: true,
      align: 'center',
      width: 100,
      search: false
    },
    {
      title: '来源',
      dataIndex: 'LY',
      key: 'LY',
      align: 'center',
      width: 120,
      search: false,
      ellipsis: true,
      render: (text, record) => {
        return <>{record.JYJGSJ?.BMMC || ''}</>;
      },
    },
    {
      title: '关键词',
      dataIndex: 'GJC',
      key: 'GJC',
      width: 120,
      align: 'center',
      ellipsis: true,
      search: false,
    },
    {
      title: '发布时间',
      dataIndex: 'RQ',
      key: 'RQ',
      width: 160,
      valueType: 'dateTime',
      hideInForm: true,
      align: 'center',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      key: 'option',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (text, record) => {
        return (
          <Link
            key="ck"
            to={{
              pathname: '/announcements/policy/articleDetails',
              state: record,
            }}
          >
            查看
          </Link>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<any>
        actionRef={actionRef}
        className={styles.proTableStyles}
        rowKey="id"
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
          defaultCurrent: 1,
        }}
        scroll={{ x: getTableWidth(columns) }}
        dataSource={dataSource}
        columns={columns}
        search={false}
        options={{
          setting: false,
          fullScreen: false,
          density: false,
          reload: false,
        }}
        headerTitle={<SearchLayout>
          <div>
            <label htmlFor='title'>标题：</label>
            <Search
              allowClear
              onSearch={(val) => {
                setTitle(val)
              }}
            />
          </div>
        </SearchLayout>}
      />
    </PageContainer>
  );
};

TableList.wrappers = ['@/wrappers/auth'];
export default TableList;
