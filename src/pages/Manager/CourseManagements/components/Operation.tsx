/* eslint-disable no-param-reassign */
import { deleteKHKCSJ, updateKHKCSJ } from '@/services/after-class/khkcsj';
import { enHenceMsg } from '@/utils/utils';
import { DownOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-table';
import { Divider, Dropdown, Menu, message, notification } from 'antd';
import Popconfirm from 'antd/es/popconfirm';
import React from 'react';

type PropsType = {
  record: any;
  handleOperation: (type: string, data: any) => void;
  actionRef?: React.MutableRefObject<ActionType | undefined>;
};

const Operation = (props: PropsType) => {
  const { actionRef, handleOperation, record } = props;
  // 发布按钮事件
  const release = async (recorde: any) => {
    const classes = [];
    recorde.KHBJSJs?.forEach((item: any) => {
      if (item.BJZT === '已发布') {
        classes.push(item);
      }
    });
    if (classes.length === 0) {
      return notification.warning({
        message: '没有班级可以发布',
        description: '当前没有已经排课的班级可以发布，请维护班级后再来发布课程.',
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
    }
    const res = await updateKHKCSJ(
      { id: recorde.id },
      {
        ...recorde,
        KCZT: '已发布',
        BMKSSJ: new Date(recorde.BMKSSJ),
        BMJSSJ: new Date(recorde.BMJSSJ),
      },
    );
    if (res.status === 'ok') {
      actionRef?.current?.reload();
    } else {
      message.error(`${res.message},请联系管理员或稍后再试`);
    }
    return '';
  };
  //  下架事件s
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const Offtheshelf = async (_ites: any) => {
    const sj: any = [];
    // eslint-disable-next-line @typescript-eslint/no-shadow
    await record.KHBJSJs.forEach((ites: any) => {
      if (ites.BJZT === '已发布') {
        sj.push(ites);
      }
    });
    if (sj.length === 0) {
      const res = await updateKHKCSJ({ id: record.id }, { KCZT: '已下架' });
      if (res.status === 'ok') {
        actionRef?.current?.reload();
      }
    } else {
      notification.warning({
        message: '有已排课班级',
        description: '当前课程有已排课的班级，请删除后再下架.',
      });
    }
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <a onClick={() => handleOperation('add', record)}>编辑</a>
      </Menu.Item>
      <Menu.Item>
        <Popconfirm
          title="删除之后，数据不可恢复，确定要删除吗?"
          onConfirm={async () => {
            try {
              if (record.id) {
                const result = await deleteKHKCSJ({ id: record.id });
                if (result.status === 'ok') {
                  message.success('信息删除成功');
                  actionRef?.current?.reload();
                } else {
                  enHenceMsg(result.message);
                }
              }
            } catch (err) {
              message.error('删除失败，请联系管理员或稍后重试');
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

  switch (record.KCZT) {
    case '待发布':
      return (
        <>
          <a onClick={() => release(record)}>发布</a>
          <Divider type="vertical" />
          <Dropdown overlay={menu}>
            <a onClick={(e) => e.preventDefault()}>
              更多 <DownOutlined />
            </a>
          </Dropdown>
        </>
      );
    case '已发布':
      return (
        <>
          <a onClick={() => Offtheshelf(record)}>下架</a>
          <Divider type="vertical" />
          <a onClick={() => handleOperation('chakan', record)}>查看</a>
        </>
      );
    case '未排课':
    case '已下架':
      return (
        <>
          <a onClick={() => release(record)}>发布</a>
          <Divider type="vertical" />
          <Dropdown overlay={menu}>
            <a onClick={(e) => e.preventDefault()}>
              更多 <DownOutlined />
            </a>
          </Dropdown>
        </>
      );
    default:
      return (
        <>
          <a onClick={() => handleOperation('chakan', record)}>查看</a>
        </>
      );
  }
};

export default Operation;
