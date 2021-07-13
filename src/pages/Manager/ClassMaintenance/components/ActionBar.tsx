/* eslint-disable no-param-reassign */
import React from 'react';
import { Dropdown, Menu, Popconfirm,message, Divider } from 'antd';
import { history } from 'umi';
import { DownOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-table';
import { deleteKHBJSJ, updateKHBJSJ } from '@/services/after-class/khbjsj';
import type { CourseItem } from '../data';
import { enHenceMsg } from '@/utils/utils';

type propstype = {
  handleEdit: (data: CourseItem) => void;
  record: CourseItem;
  actionRef: React.MutableRefObject<ActionType | undefined>;
  // setnames: () => void;
};

const ActionBar = (props: propstype) => {
  const { handleEdit, record, actionRef } = props;
  const shelf = (records: any) => {
    if (records.KHXSBJs.length === 0) {
      // records.BJZT = '已下架'
      // records.BMKSSJ = new Date(records.BMKSSJ);
      // records.BMJSSJ = new Date(records.BMJSSJ);
      const res = updateKHBJSJ({ id: records.id }, { BJZT: '已下架' });
      new Promise((resolve) => {
        resolve(res);
      }).then((data: any) => {
        if (data.status === 'ok') {
          message.success('下架成功');
          actionRef.current?.reload();
        } else if (data.message!.indexOf('token') > -1||(data.message!).indexOf('Token') > -1) {
          history.replace('/auth_callback/overDue');
        } else {
          message.error('下架失败，请联系管理员或稍后重试');
          actionRef.current?.reload();
        }
      });
    } else {
      message.warning('有学生报名时，此班级不能下架');
    }
  };
  const release = (recorde: any) => {
    // recorde.BJZT = '已发布';
    // recorde.BMKSSJ = new Date(recorde.BMKSSJ);
    // recorde.BMJSSJ = new Date(recorde.BMJSSJ);
    const res = updateKHBJSJ({ id: recorde.id }, { BJZT: '已发布' });
    new Promise((resolve) => {
      resolve(res);
    }).then((data: any) => {
      if (data.status === 'ok') {
        message.success('发布成功');
        actionRef.current?.reload();
      } else {
        message.error('发布失败，请联系管理员或稍后重试');
        actionRef.current?.reload();
      }
    });
  };
  const menu = (
    <Menu>
      <Menu.Item>
        <a onClick={() => handleEdit(record)}>编辑</a>
      </Menu.Item>
      <Menu.Item>
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
                  } else{
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
      </Menu.Item>
    </Menu>
  );
  switch (record.BJZT) {
    case '待发布':
    case '已下架':
      return (
        <>
          {record.KHPKSJs && record.KHPKSJs?.length > 0 ? (
            <>
              <a onClick={() => release(record)}>发布</a>
              <Divider type="vertical" />
              <Dropdown overlay={menu}>
                <a onClick={(e) => e.preventDefault()}>
                  更多 <DownOutlined />
                </a>
              </Dropdown>
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
                        }else{
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
    case '已发布':
      return (
        <>
          <a onClick={() => shelf(record)}>下架</a>
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
