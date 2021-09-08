/*
 * @description:
 * @author: wsl
 * @Date: 2021-08-31 10:08:34
 * @LastEditTime: 2021-09-08 18:59:40
 * @LastEditors: wsl
 */
import { useState, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Link, useModel } from 'umi';
import type { TableListItem } from '../data';
import styles from '../index.module.less';
import { getJYJGTZGG } from '@/services/after-class/jyjgtzgg';
import PageContainer from '@/components/PageContainer';

const TableList = () => {
  const [dataSource, setDataSource] = useState<API.JYJGTZGG[]>();
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '标题',
      dataIndex: 'BT',
      key: 'BT',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '副标题',
      dataIndex: 'FBT',
      key: 'FBT',
      ellipsis: true,
      align: 'center',
      search: false,
    },

    {
      title: '作者',
      dataIndex: 'ZZ',
      key: 'ZZ',
      width: '9em',
      align: 'center',
      search: false,
    },
    {
      title: '来源',
      dataIndex: 'LY',
      key: 'LY',
      width: '9em',
      align: 'center',
      search: false,
      render: (text, record) => {
        return <>{record.JYJGSJ.BMMC}</>;
      },
    },
    {
      title: '关键词',
      dataIndex: 'GJC',
      key: 'GJC',
      width: '9em',
      align: 'center',
      ellipsis: true,
      search: false,
    },
    {
      title: '发布时间',
      dataIndex: 'RQ',
      key: 'RQ',
      width: '12em',
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
      width: '15em',
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
        headerTitle={<div style={{ fontWeight: 'bold' }}>政策列表</div>}
        actionRef={actionRef}
        className={styles.proTableStyles}
        rowKey="id"
        request={async (params) => {
          if (params.ZT || params.BT) {
            const resgetXXTZGG = await getJYJGTZGG({
              BT: params.BT,
              LX: 1,
              XZQHM: currentUser?.XZQHM,
              ZT: params.ZT ? [params.ZT] : ['已发布'],
              page: 0,
              pageSize: 0,
            });
            if (resgetXXTZGG.status === 'ok') {
              setDataSource(resgetXXTZGG.data?.rows);
            }
          } else {
            const resgetXXTZGG = await getJYJGTZGG({
              BT: '',
              LX: 1,
              ZT: ['已发布'],
              XZQHM: currentUser?.XZQHM,
              page: 0,
              pageSize: 0,
            });
            if (resgetXXTZGG.status === 'ok') {
              setDataSource(resgetXXTZGG.data?.rows);
            }
          }

          return '';
        }}
        dataSource={dataSource}
        columns={columns}
      />
    </PageContainer>
  );
};

TableList.wrappers = ['@/wrappers/auth'];
export default TableList;
