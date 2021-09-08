/** !
 * @description: 表格操作列
 * @author: zpl
 * @Date: 2020-09-12 17:13:00
 * @LastEditTime: 2020-09-12 17:31:45
 * @LastEditors: zpl
 */
import React from 'react';
import { Divider, Popconfirm, message, Tooltip } from 'antd';
import { history, Link } from 'umi';
import styles from '../index.module.less';
import type { TableListItem } from '../data';

import moment from 'moment';
import { ClearOutlined, EyeOutlined } from '@ant-design/icons';
import { deleteXXTZGG, updateXXTZGG } from '@/services/after-class/xxtzgg';
import { deleteKHJYTZGG } from '@/services/after-class/khjytzgg';

type OptType = {
  id: string;
  refreshHandler: () => void;
  record?: TableListItem;
};

const EditOpt = ({ id }: { id: string }) => (
  <a
    onClick={() => {
      history.push(`/announcements/notice/EditArticle?id=${id}`);
    }}
  >
    <Tooltip title="编辑">
      <a>编辑</a>
    </Tooltip>
  </a>
);

const PubOpt = ({ refreshHandler, record }: OptType) => (
  <a
    onClick={async () => {
      const data = {
        ...record,
        ZT: '已发布',
        RQ: moment(record?.RQ).format(),
      };
      try {
        const resupdateKHJYTZGG = await updateXXTZGG({ id: record!.id }, data);
        if (resupdateKHJYTZGG.status === 'ok') {
          message.success('发布成功');
          refreshHandler();
        } else {
          message.error('发布失败，请联系管理员或稍后重试。');
        }
      } catch (err) {
        message.error('发布失败，请联系管理员或稍后重试。');
      }
    }}
  >
    <Tooltip title="发布">
      <a>发布</a>
    </Tooltip>
  </a>
);

const UnPubOpt = ({ refreshHandler, record }: OptType) => (
  <a
    onClick={async () => {
      const data = {
        ...record,
        ZT: '草稿',
        RQ: moment(record!.RQ).format(),
      };
      try {
        const resupdateKHJYTZGG = await updateXXTZGG({ id: record!.id }, data);
        if (resupdateKHJYTZGG.status === 'ok') {
          message.success('撤稿成功');
          refreshHandler();
        } else {
          message.error('撤稿失败，请联系管理员或稍后重试。');
        }
      } catch (err) {
        message.error('撤稿失败，请联系管理员或稍后重试。');
      }
    }}
  >
    <Tooltip title="撤稿">
      <a>撤稿</a>
    </Tooltip>
  </a>
);
const View = ({ record }: OptType) => (
  <Link
    key="ck"
    to={{
      pathname: '/announcements/notice/noticeDetails',
      state: record,
    }}
  >
    <Tooltip title="查看">
      <a>查看</a>
    </Tooltip>
  </Link>
);

const UnDelOpt = ({ refreshHandler, record }: OptType) => (
  <a
    href="#"
    onClick={async () => {
      const data = {
        ...record,
        ZT: '草稿',
        RQ: moment(record!.RQ).format(),
      };
      try {
        const resupdateKHJYTZGG = await updateXXTZGG({ id: record!.id }, data);
        if (resupdateKHJYTZGG.status === 'ok') {
          message.success('恢复成功');
          refreshHandler();
        } else {
          message.error('恢复失败，请联系管理员或稍后重试。');
        }
      } catch (err) {
        message.error('恢复失败，请联系管理员或稍后重试。');
      }
    }}
  >
    <Tooltip title="恢复">
      <a>恢复</a>
    </Tooltip>
  </a>
);

const DelOpt = ({ id, refreshHandler }: OptType) => (
  <Popconfirm
    title="彻底删除后数据将不可恢复，是否删除?"
    onConfirm={async () => {
      try {
        const result = await deleteXXTZGG({ id });
        if (result.status === 'ok') {
          message.success('删除成功');
          refreshHandler();
        } else {
          message.error('删除失败，请联系管理员或稍后重试。');
        }
      } catch (err) {
        message.error('删除失败，请联系管理员或稍后重试。');
      }
    }}
    okText="Yes"
    cancelText="No"
    placement="topLeft"
  >
    <a href="#" style={{ color: 'red' }}>
      <Tooltip title="删除">
        <a>删除</a>
      </Tooltip>
    </a>
  </Popconfirm>
);

const RealDelOpt = ({ id, refreshHandler }: OptType) => (
  <Popconfirm
    title="彻底删除后数据将不可恢复，是否删除?"
    onConfirm={async () => {
      try {
        const result = await deleteKHJYTZGG({ id });
        if (result.status === 'ok') {
          message.info('删除成功');
          refreshHandler();
        } else {
          message.error('删除失败，请联系管理员或稍后重试。');
        }
      } catch (err) {
        message.error('删除失败，请联系管理员或稍后重试。');
      }
    }}
    okText="Yes"
    cancelText="No"
    placement="topLeft"
  >
    <a href="#" style={{ color: 'red' }}>
      <Tooltip title="彻底删除">
        <a>彻底删除</a>
      </Tooltip>
    </a>
  </Popconfirm>
);

type Props = {
  id: string;
  ZT: string;
  refreshHandler: () => void;
  record?: TableListItem;
};

const Option: React.FC<Props> = (props) => {
  const { id, ZT, refreshHandler, record } = props;
  switch (ZT) {
    case '已发布':
      return (
        <>
          <View id={id} refreshHandler={refreshHandler} record={record} />
          <Divider type="vertical" />
          <UnPubOpt id={id} refreshHandler={refreshHandler} record={record} />
        </>
      );
    case '已删除':
      return (
        <>
          <UnDelOpt id={id} refreshHandler={refreshHandler} record={record} />
          <Divider type="vertical" />
          <RealDelOpt id={id} refreshHandler={refreshHandler} record={record} />
        </>
      );
    default:
      return (
        <>
          <EditOpt id={id} />
          <Divider type="vertical" />
          <PubOpt id={id} refreshHandler={refreshHandler} record={record} />
          <Divider type="vertical" />
          <DelOpt id={id} refreshHandler={refreshHandler} record={record} />
        </>
      );
  }
};

export default Option;
