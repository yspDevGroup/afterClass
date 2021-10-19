/* eslint-disable no-param-reassign */
import React from 'react';
import { history } from 'umi';
import { Popconfirm, message, Divider } from 'antd';
import type { ActionType } from '@ant-design/pro-table';
import { deleteKHBJSJ, updateKHBJSJ } from '@/services/after-class/khbjsj';
import type { CourseItem } from '../data';
import { enHenceMsg } from '@/utils/utils';

type propstype = {
  handleEdit: (data: CourseItem) => void;
  record: any;
  actionRef: React.MutableRefObject<ActionType | undefined>;
};

const ActionBar = (props: propstype) => {
  const { handleEdit, record, actionRef } = props;
  const shelf = (recorde: any) => {
    if (recorde.xs_count === 0) {
      const res = updateKHBJSJ({ id: recorde.id }, { BJZT: '待开班' });
      new Promise((resolve) => {
        resolve(res);
      }).then((data: any) => {
        if (data.status === 'ok') {
          message.success('取消成功');
          actionRef.current?.reload();
        } else if (data.message!.indexOf('token') > -1 || data.message!.indexOf('Token') > -1) {
          history.replace('/auth_callback/overDue');
        } else {
          message.error('取消失败，请联系管理员或稍后重试');
          actionRef.current?.reload();
        }
      });
    } else {
      message.warning('有学生报名时，此课程班不能取消开班');
    }
  };
  const release = (records: any) => {
    const res = updateKHBJSJ({ id: records.id }, { BJZT: '已开班' });
    new Promise((resolve) => {
      resolve(res);
    }).then((data: any) => {
      if (data.status === 'ok') {
        message.success('开班成功');
        actionRef.current?.reload();
      } else if (data.message!.indexOf('token') > -1 || data.message!.indexOf('Token') > -1) {
        history.replace('/auth_callback/overDue');
      } else {
        message.error('开班失败，请联系管理员或稍后重试');
        actionRef.current?.reload();
      }
    });
  };

  switch (record.BJZT) {
    case '待开班':
    case '已取消':
      return (
        <>
          {record.pk_count ? (
            <>
              <a onClick={() => release(record)}>开班</a>
              <Divider type="vertical" />
              <a onClick={() => handleEdit(record)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm
                title="删除之后，数据不可恢复，确定要删除吗?"
                onConfirm={async () => {
                  try {
                    if (record.id) {
                      const params = { id: record.id };
                      const res = deleteKHBJSJ(params);
                      new Promise((resolve) => {
                        resolve(res);
                      }).then((data: any) => {
                        if (data.status === 'ok') {
                          message.success('删除成功');
                          actionRef.current?.reload();
                        } else {
                          enHenceMsg(data.message);
                        }
                      });
                    }
                  } catch (err) {
                    message.error('删除失败，请联系管理员或稍后重试。');
                  }
                }}
                okText="确定"
                cancelText="取消"
                placement="topRight"
              >
                <a>删除</a>
              </Popconfirm>
            </>
          ) : (
            <>
              <a onClick={() => handleEdit(record)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm
                title="删除之后，数据不可恢复，确定要删除吗?"
                onConfirm={async () => {
                  try {
                    if (record.id) {
                      const params = { id: record.id };
                      const res = deleteKHBJSJ(params);
                      new Promise((resolve) => {
                        resolve(res);
                      }).then((data: any) => {
                        if (data.status === 'ok') {
                          message.success('删除成功');
                          actionRef.current?.reload();
                        } else {
                          enHenceMsg(data.message);
                        }
                      });
                    }
                  } catch (err) {
                    message.error('删除失败，请联系管理员或稍后重试。');
                  }
                }}
                okText="确定"
                cancelText="取消"
                placement="topRight"
              >
                <a>删除</a>
              </Popconfirm>
            </>
          )}
        </>
      );
      break;
    case '已开班':
      return (
        <>
          <a onClick={() => shelf(record)}>取消开班</a>
          <Divider type="vertical" />
          <a onClick={() => handleEdit(record)}>查看</a>
        </>
      );
      break;
    default:
      return (
        <>
          <a onClick={() => handleEdit(record)}>查看</a>
        </>
      );
  }
};
export default ActionBar;
