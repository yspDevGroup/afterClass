/* eslint-disable no-param-reassign */
import { deleteXXGG, updateXXGG } from '@/services/after-class/xxgg';
import { enHenceMsg } from '@/utils/utils';
import { DownOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-table';
import { Divider, Dropdown, Menu, message, Popconfirm } from 'antd';
import React from 'react';
import type { NoticeItem } from '../data';

type propstype = {
  handleOperation: (data: NoticeItem) => void;
  record: NoticeItem;
  actionRef: React.MutableRefObject<ActionType | undefined>;
};

const Choice = (props: propstype) => {
  const { handleOperation, record, actionRef } = props;
  const release = async (data: NoticeItem) => {
    data.ZT = '发布';
    const reustle = await updateXXGG({ id: data.id! }, { ...data });
    if (reustle.status === 'ok') {
      message.success('发布成功');
      actionRef.current?.reload();
    } else {
      enHenceMsg(reustle.message);
    }
  };
  const withdraw = async (data: NoticeItem) => {
    data.ZT = '撤稿';
    const reustle = await updateXXGG({ id: data.id! }, { ...data });
    if (reustle.status === 'ok') {
      message.success('撤除成功');
      actionRef.current?.reload();
    } else {
      message.error(`${reustle.message},请联系管理员或稍后再试`);
    }
  };
  const menu = (
    <Menu>
      <Menu.Item>
        <a onClick={() => handleOperation(record)}>编辑</a>
      </Menu.Item>
      <Menu.Item>
        <Popconfirm
          title="删除之后，数据不可恢复，确定要删除吗?"
          onConfirm={async () => {
            try {
              if (record.id) {
                const result = await deleteXXGG({ id: record.id });
                if (result.status === 'ok') {
                  message.success('信息删除成功');
                  actionRef.current?.reload();
                } else {
                  message.error(`${result.message},请联系管理员或稍后再试`);
                }
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
  switch (record.ZT) {
    case '拟稿':
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
      break;
    case '发布':
      return (
        <>
          <a onClick={() => withdraw(record)}>撤稿</a>
          <Divider type="vertical" />
          <Popconfirm
            title="删除之后，数据不可恢复，确定要删除吗?"
            onConfirm={async () => {
              try {
                if (record.id) {
                  const result = await deleteXXGG({ id: record.id });
                  if (result.status === 'ok') {
                    message.success('信息删除成功');
                    actionRef.current?.reload();
                  } else {
                    enHenceMsg(result.message);
                  }
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
      );
      break;
    default:
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
  }
};

export default Choice;
