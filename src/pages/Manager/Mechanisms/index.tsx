/* eslint-disable no-else-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-params */
import React, { useRef } from 'react';
import { Space, Tag, message } from 'antd';
import { history, useModel } from 'umi';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getCourses } from '@/services/after-class/khjyjg';
import EllipsisHint from '@/components/EllipsisHint';
import { updateKHKCSJ } from '@/services/after-class/khkcsj';
import PageContainer from '@/components/PageContainer';
import classes from './index.less';
/**
 * 机构端-课程列表
 * @returns
 */
const MechanismCourse = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  const columns: any[] = [
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      key: 'KCMC',
      align: 'center',
      search: false,
    },
    {
      title: '适用年级',
      key: 'NJSJs',
      dataIndex: 'NJSJs',
      align: 'center',
      render: (text: any) => {
        return (
          <EllipsisHint
            width="100%"
            text={text?.map((item: any) => {
              return (
                <Tag key={item.id}>
                  {item.XD === '初中' ? `${item.NJMC}` : `${item.XD}${item.NJMC}`}
                </Tag>
              );
            })}
          />
        );
      },
    },
    {
      title: '任课老师',
      key: 'KHKCJs',
      dataIndex: 'KHKCJs',
      align: 'center',
      render: (text: any) => {
        return (
          <EllipsisHint
            width="100%"
            text={text?.map((item: any) => {
              return <Tag key={item.KHJSSJ.id}>{item.KHJSSJ.XM}</Tag>;
            })}
          />
        );
      },
    },
    {
      title: '课程状态',
      key: 'KCZT',
      dataIndex: 'KCZT',
      align: 'center',
      render: (text: any) => {
        switch (text) {
          case 0:
            return '未引入';
          case 1:
            return '已引入';
          default:
            return '';
        }
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (text: any, record: any, index: any, action: any) => (
        <Space size="middle">
          <a
            onClick={() => {
              history.push({
                pathname: `/courseManagements/mechanismCourse/edit`,
                state: { ...record, type: 'info' },
              });
            }}
          >
            详情
          </a>
          {record.KCZT === 0 ? (
            <a
              onClick={async () => {
                const res = await updateKHKCSJ({ id: record?.id }, { KCZT: 1 });
                if (res.status === 'ok') {
                  message.success('操作成功');
                  action?.reload();
                } else {
                  message.error('操作失败');
                }
              }}
            >
              引入
            </a>
          ) : record.KCZT === 1 ? (
            <a
              onClick={async () => {
                const res = await updateKHKCSJ({ id: record?.id }, { KCZT: 0 });
                if (res.status === 'ok') {
                  message.success('操作成功');
                  action?.reload();
                } else {
                  message.error('操作失败');
                }
              }}
            >
              取消引入
            </a>
          ) : (
            ''
          )}
        </Space>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable
        className={classes.proTableStyle}
        actionRef={actionRef}
        columns={columns}
        search={false}
        rowKey="id"
        dateFormatter="string"
        request={async (param = {}, sort, filter) => {
          const params = {
            ...sort,
            ...filter,
            page: param.current,
            pageSize: param.pageSize,
            JGId: currentUser?.jgId,
            KCMC: param.keyword,
          };
          const res = await getCourses(params);
          if (res.status === 'ok') {
            return {
              data: res.data.rows,
              success: true,
              total: res.data.count,
            };
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        options={{
          setting: false,
          fullScreen: false,
          density: false,
          reload: false,
          search: {
            placeholder: '课程名称',
          },
        }}
      />
    </PageContainer>
  );
};

export default MechanismCourse;
