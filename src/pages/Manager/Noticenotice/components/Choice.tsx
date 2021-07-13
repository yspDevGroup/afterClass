/* eslint-disable no-param-reassign */
import { deleteXXGG, updateXXGG } from '@/services/after-class/xxgg';
import type { ActionType } from '@ant-design/pro-table';
import { Divider, message, Popconfirm } from 'antd';
import React from 'react';
import type { NoticeItem } from '../data';

type propstype = {
  handleOperation: (data: NoticeItem) => void;
  record: NoticeItem;
  actionRef: React.MutableRefObject<ActionType | undefined>;
  setRefresh: (data: number) => void;
};

const Choice = (props: propstype) => {
  const { handleOperation, record, actionRef, setRefresh } = props;
  const release = async (data: NoticeItem) => {
    data.ZT = '发布';
    const reustle = await updateXXGG({ id: data.id! }, { ...data });
    if (reustle.status === 'ok') {
      message.success('发布成功');
      setRefresh(+1);
    } else if (reustle.message!.indexOf('Cannot') > -1) {
      message.error(`删除失败，请先删除关联数据，请联系管理员或稍后再试`);
    } else {
      message.error(`${reustle.message},请联系管理员或稍后再试`);
    }
  };
  const withdraw = async (data: NoticeItem) => {
    data.ZT = '撤稿';
    const reustle = await updateXXGG({ id: data.id! }, { ...data });
    if (reustle.status === 'ok') {
      message.success('撤除成功');
      setRefresh(-1);
    } else {
      message.error(`${reustle.message},请联系管理员或稍后再试`);
    }
  };
  switch (record.ZT) {
    case '拟稿':
      return (
        <>
          <a onClick={() => release(record)}>发布</a>
          <Divider type="vertical" />
          <a onClick={() => handleOperation(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title="删除之后，数据不可恢复，确定要删除吗?"
            onConfirm={async () => {
              try {
                if (record.id) {
                  console.log(666);
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
                  console.log(666);
                  const result = await deleteXXGG({ id: record.id });
                  if (result.status === 'ok') {
                    message.success('信息删除成功');
                    actionRef.current?.reload();
                  } else if (result.message!.indexOf('Cannot') > -1) {
                    message.error(`删除失败，请先删除关联数据，请联系管理员或稍后再试`);
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
        </>
      );
      break;
    default:
      return (
        <>
          <a onClick={() => release(record)}>发布</a>
          <Divider type="vertical" />
          <a onClick={() => handleOperation(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title="删除之后，数据不可恢复，确定要删除吗?"
            onConfirm={async () => {
              try {
                if (record.id) {
                  console.log(666);
                  const result = await deleteXXGG({ id: record.id });
                  if (result.status === 'ok') {
                    message.success('信息删除成功');
                    actionRef.current?.reload();
                  } else if (result.message!.indexOf('Cannot') > -1) {
                    message.error(`删除失败，请先删除关联数据，请联系管理员或稍后再试`);
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
        </>
      );
  }
};

export default Choice;
