/*
 * @description: 老师管理
 * @author: Sissle Lynn
 * @Date: 2021-09-06 11:16:22
 * @LastEditTime: 2022-04-15 17:45:14
 * @LastEditors: Wu Zhan
 */
import React, { useRef, useState } from 'react';
import { Link, useAccess, useModel } from 'umi';
import { Button, Divider, message, Modal, Spin, Upload } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns, RequestData } from '@ant-design/pro-table';
import { UploadOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';

import type { TableListParams } from '@/constant';
import PageContain from '@/components/PageContainer';
import ShowName from '@/components/ShowName';

import { getTableWidth } from '@/utils/utils';
import { getAllJZGJBSJ } from '@/services/after-class/jzgjbsj';
// import { syncWechatStudents, syncWechatTeachers } from '@/services/after-class/upload';

import styles from './index.less';
import { importWechatTeachers } from '@/services/after-class/upload';

const TeacherManagement = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { isSso } = useAccess();
  const [newFileList, setNewFileList] = useState<any[]>();
  // 设置模态框显示状态
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // 列表对象引用，可主动执行刷新等操作
  const actionRef = useRef<ActionType>();
  const [state, setstate] = useState<boolean>(false);
  const onClose = async () => {
    const formData = new FormData();

    if (newFileList?.length) {
      const file = newFileList?.[0];
      if (file.status === 'error') {
        message.error('请重新选择文件!');
        return;
      }
      // console.log('newFileList', newFileList?.[0]);
      formData.append('xlsx', file);
      if (isSso && currentUser?.CorpId) {
        formData.append('CorpId', currentUser?.CorpId);
      }

      const res = await importWechatTeachers({ plat: 'school' }, { body: formData });
      if (res.status === 'ok') {
        if (res?.data?.fail_count === 0) {
          message.success(`上传成功`);
          setModalVisible(false);
          actionRef.current?.reload();
        } else {
          message.success(`上传成功${res?.data?.success_count}条,失败${res?.data?.fail_count}条`);
        }
      } else {
        message.error(res.message);
        // console.log('========', file, { file, status: 'error', response: res.message });
        setNewFileList([
          { uid: file.uid, name: file.name, status: 'error', response: res.message },
        ]);
      }
    } else {
      message.warning('请选择文件上传!');
    }
  };
  // 上传配置
  // const UploadProps: any = {
  //   name: 'xlsx',
  //   action: '/api/upload/importWechatTeachers?plat=school',
  //   headers: {
  //     authorization: getAuthorization(),
  //   },
  //   beforeUpload(file: any) {
  //     const isLt2M = file.size / 1024 / 1024 < 2;
  //     const isType =
  //       file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
  //       file.type === 'application/vnd.ms-excel';
  //     if (!isType) {
  //       message.error('请上传正确表格文件!');
  //       return Upload.LIST_IGNORE;
  //     }
  //     if (!isLt2M) {
  //       message.error('文件大小不能超过2M');
  //       return Upload.LIST_IGNORE;
  //     }
  //     return true;
  //   },
  //   onChange(info: { file: { status: string; name: any; response: any }; fileList: any }) {
  //     if (info.file.status === 'done') {
  //       const code = info.file.response;
  //       if (code.status === 'ok') {
  //         message.success(`上传成功`);
  //         setModalVisible(false);
  //       } else {
  //         message.error(`${code.message}`);
  //       }
  //     } else if (info.file.status === 'error') {
  //       const code = info.file.response;
  //       message.error(`${code.message}`);
  //     }
  //   },
  // };
  const UploadProps: any = {
    maxCount: 1,
    onRemove: (file: any) => {
      if (newFileList?.length) {
        const index: number = newFileList.indexOf(file);
        const list = newFileList?.slice();
        list?.splice(index, 1);
        setNewFileList(list);
      }
    },
    beforeUpload: (file: any) => {
      const isType =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel';
      if (!isType) {
        message.error('请上传正确表格文件!');
        return Upload.LIST_IGNORE;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('文件大小不能超过2M');
        return Upload.LIST_IGNORE;
      }
      setNewFileList([file]);
      return true;
    },
    fileList: newFileList,
  };
  // const handleConfirm = async (id: any) => {
  //   const res = await deleteJZGJBSJ({ id });
  //   if (res.status === 'ok') {
  //     message.success('删除成功');
  //     actionRef.current?.reload();
  //   } else {
  //     message.error(res.message);
  //   }
  // };

  // const syncTeachers = async () => {
  //   const params = {
  //     suiteID: currentUser.suiteID,
  //     CorpId: currentUser.CorpId,
  //     xxId: currentUser.xxId,
  //   };

  //   syncWechatStudents(params);
  //   const res = await syncWechatTeachers(params);
  //   if (res.status === 'ok') {
  //     setstate(true);
  //     setTimeout(() => {
  //       setstate(false);
  //       message.success('同步完成');
  //       actionRef.current?.reload();
  //     }, 1000);
  //   }
  // };

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
          return <ShowName XM={record?.XM} type="userName" openid={record?.WechatUserId} />;
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
      title: '工号',
      key: 'GH',
      dataIndex: 'GH',
      align: 'center',
      width: 150,
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
      hideInTable: true,
      width: 200,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      fixed: 'right',
      hideInTable: true,
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
          {/* <Divider type="vertical" />
          <Popconfirm
            title={`确定要删除 “${record?.XM}” 数据吗?`}
            onConfirm={() => handleConfirm(record?.id)}
          >
            <a>删除</a>
          </Popconfirm> */}
        </>
      ),
    },
  ];
  const isComWx = /wxwork/i.test(navigator.userAgent);
  return (
    <PageContain>
      <Spin spinning={state}>
        <ProTable<any>
          className={styles.pageContain}
          // title={() => (
          //   <div style={{ color: '#4884ff' }}>
          //     {/* <div>
          //       未同步到本系统中的成员无法使用老师端，系统每天凌晨自动同步一次，如需手动更新，请点击【立即同步】按钮
          //     </div> */}
          //     {authType === 'wechat' && (
          //       <div>
          //         由于企业微信对用户敏感信息的限制，未激活的用户仅可显示部分信息，如需显示更多，可通知老师激活账号或使用本界面【导入】功能进行完善。
          //       </div>
          //     )}
          //   </div>
          // )}
          columns={columns}
          actionRef={actionRef}
          search={false}
          pagination={{
            showQuickJumper: true,
            pageSize: 10,
            defaultCurrent: 1,
          }}
          scroll={{ x: getTableWidth(columns) }}
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
            setstate(true);
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
              setstate(false);
              return {
                data: res.data?.rows,
                total: res.data?.count,
                success: true,
              };
            }
            setstate(false);
            return {};
          }}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
            search: {
              placeholder: '教师姓名/联系电话',
              allowClear: true,
            },
          }}
          // eslint-disable-next-line react/no-unstable-nested-components
          toolBarRender={() => {
            return (
              <>
                {/* <Button
                 style={{ color: '#4884ff', borderColor: '#4884ff', marginRight: '8px' }}
                 onClick={syncTeachers}
               >
                 同步企业微信人员信息
               </Button> */}
                {isComWx === true ? (
                  <></>
                ) : (
                  <Button key="button" type="primary" onClick={() => setModalVisible(true)}>
                    <VerticalAlignBottomOutlined /> 导入
                  </Button>
                )}
              </>
            );
          }}
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
            <Button
              key="back"
              onClick={() => {
                setModalVisible(false);
                // setModalVisible(false);
                actionRef.current?.reload();
              }}
            >
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
      </Spin>
    </PageContain>
  );
};

TeacherManagement.wrappers = ['@/wrappers/auth'];

export default TeacherManagement;

