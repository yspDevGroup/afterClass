/*
 * @description: 老师管理
 * @author: Sissle Lynn
 * @Date: 2021-09-06 11:16:22
 * @LastEditTime: 2021-10-29 08:23:19
 * @LastEditors: zpl
 */
import React, { useRef, useState } from 'react';
import { Link, useModel } from 'umi';
import { Button, Divider, message, Modal, Popconfirm, Upload } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns, RequestData } from '@ant-design/pro-table';
import { UploadOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';

import type { TableListParams } from '@/constant';
import PageContain from '@/components/PageContainer';

import { getAuthorization } from '@/utils/utils';
import { deleteJZGJBSJ, getAllJZGJBSJ } from '@/services/after-class/jzgjbsj';
import { syncWechatTeachers } from '@/services/after-class/upload';
import WWOpenDataCom from '@/components/WWOpenDataCom';

import styles from './index.less';

const TeacherManagement = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // 设置模态框显示状态
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // 列表对象引用，可主动执行刷新等操作
  const actionRef = useRef<ActionType>();
  const onClose = () => {
    setModalVisible(false);
    actionRef.current?.reload();
  };
  // 上传配置
  const UploadProps: any = {
    name: 'xlsx',
    action: '/api/upload/importWechatTeachers?plat=school',
    headers: {
      authorization: getAuthorization(),
    },
    beforeUpload(file: any) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('文件大小不能超过2M');
      }
      return isLt2M;
    },
    onChange(info: { file: { status: string; name: any; response: any }; fileList: any }) {
      if (info.file.status === 'done') {
        const code = info.file.response;
        if (code.status === 'ok') {
          message.success(`上传成功`);
          setModalVisible(false);
        } else {
          message.error(`${code.message}`);
        }
      } else if (info.file.status === 'error') {
        const code = info.file.response;
        message.error(`${code.message}`);
      }
    },
  };
  const handleConfirm = async (id: any) => {
    const res = await deleteJZGJBSJ({ id });
    if (res.status === 'ok') {
      message.success('删除成功');
      actionRef.current?.reload();
    } else {
      message.error(res.message);
    }
  };

  const syncTeachers = async () => {
    const res = await syncWechatTeachers();
    if (res.status === 'ok') {
      message.success('同步完成');
      actionRef.current?.reload();
    }
  };

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '姓名',
      dataIndex: 'XM',
      key: 'XM',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (_, record) => {
        const showWXName = record?.XM === '未知' && record?.WechatUserId;
        if (showWXName) {
          return <WWOpenDataCom type="userName" openid={record?.WechatUserId} />;
        }
        return record?.XM;
      },
      fixed: 'left',
    },
    {
      title: '性别',
      dataIndex: 'XBM',
      key: 'XBM',
      align: 'center',
      width: 80,
      render: (_, record) => record?.XBM?.substring(0, 1),
    },
    {
      title: '联系电话',
      key: 'LXDH',
      dataIndex: 'LXDH',
      align: 'center',
      width: 150,
    },
    {
      title: '教授科目',
      key: 'JSKM',
      dataIndex: 'JSKM',
      align: 'center',
      ellipsis: true,
      width: 200,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <>
          <Link
            to={{
              pathname: '/basicalSettings/teacherManagement/detail',
              state: {
                type: 'detail',
                data: record,
              },
            }}
          >
            详情
          </Link>
          <Divider type="vertical" />
          <Link
            to={{
              pathname: '/basicalSettings/teacherManagement/detail',
              state: {
                type: 'edit',
                data: record,
              },
            }}
          >
            编辑
          </Link>
          <Divider type="vertical" />
          <Popconfirm
            title={`确定要删除 “${record?.XM}” 数据吗?`}
            onConfirm={() => handleConfirm(record?.id)}
          >
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <PageContain>
      <ProTable<any>
        title={() => (
          <div style={{ color: '#4884ff' }}>
            <div>
              未同步到本系统中的成员无法使用老师端，系统每天凌晨自动同步一次，如需手动更新，请点击【立即同步】按钮
            </div>
            {authType === 'wechat' && (
              <div>
                由于企业微信对用户敏感信息的限制，未激活的用户仅可显示部分信息，如需显示更多，可通知老师激活账号或使用本界面【导入】功能进行完善。
              </div>
            )}
          </div>
        )}
        columns={columns}
        actionRef={actionRef}
        search={false}
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
          defaultCurrent: 1,
        }}
        scroll={{ x: 800 }}
        request={async (
          params: any & {
            pageSize?: number;
            current?: number;
            keyword?: string;
          },
          sort,
          filter,
        ): Promise<Partial<RequestData<any>>> => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const opts: TableListParams = {
            ...params,
            sorter: sort && Object.keys(sort).length ? sort : undefined,
            filter,
          };
          const res = await getAllJZGJBSJ(
            { XXJBSJId: currentUser?.xxId, keyWord: opts.keyword, page: 0, pageSize: 0 },
            opts,
          );
          if (res.status === 'ok') {
            return {
              data: res.data?.rows,
              total: res.data?.count,
              success: true,
            };
          }
          return {};
        }}
        options={{
          setting: false,
          fullScreen: false,
          density: false,
          reload: false,
          search: {
            placeholder: '教师名称/联系电话',
            allowClear: true,
          },
        }}
        // eslint-disable-next-line react/no-unstable-nested-components
        toolBarRender={() => [
          <Button style={{ color: '#4884ff', borderColor: '#4884ff' }} onClick={syncTeachers}>
            立即同步
          </Button>,
          <Button key="button" type="primary" onClick={() => setModalVisible(true)}>
            <VerticalAlignBottomOutlined /> 导入
          </Button>,
        ]}
        rowKey="id"
        dateFormatter="string"
      />
      <Modal
        title="批量导入"
        destroyOnClose
        width="35vw"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={onClose}>
            确定
          </Button>,
        ]}
        centered
        maskClosable={false}
        bodyStyle={{
          maxHeight: '65vh',
          overflowY: 'auto',
        }}
      >
        <p className={styles.uploadBtn}>
          <Upload {...UploadProps}>
            <Button icon={<UploadOutlined />}>上传文件</Button>
          </Upload>
          <span className={styles.uploadText}>进行批量导入用户</span>
        </p>
        <p className={styles.uploadDescription}>上传文件需从企业微信管理后台通讯录导出</p>
      </Modal>
    </PageContain>
  );
};

TeacherManagement.wrappers = ['@/wrappers/auth'];

export default TeacherManagement;
