/* eslint-disable no-console */
import React, { useRef, useState } from 'react';
import type { FormInstance } from 'antd';
import { Tooltip } from 'antd';
import { message, Popconfirm } from 'antd';
import { Button, Divider, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
import type { SearchDataType } from '@/components/Search/data';
import type { TableListParams } from './data';
import { theme } from '@/theme-default';
import PageContainer from '@/components/PageContainer';
import { paginationConfig } from '@/constant';
import { PlusOutlined } from '@ant-design/icons';
import SearchComponent from '@/components/Search';
import { createFJSJ, deleteFJSJ, getAllFJSJ, updateFJSJ } from '@/services/after-class/fjsj';
import styles from './index.less';
import { searchData } from './serarchConfig';
import AsyncAddRoom from './components/AsyncAddRoom';
import AsyncSiteMaintenance from './components/AsyncSiteMaintenance';
import PromptInformation from '@/components/PromptInformation';
import { enHenceMsg } from '@/utils/utils';
import { useModel } from 'umi';

const RoomManagement = () => {
  // 列表对象引用，可主动执行刷新等操作
  const actionRef = useRef<ActionType>();
  // 设置模态框显示状态
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // 模态框加载内容类型，add为编辑新增界面，uphold为场地类型维护界面
  const [modalType, setModalType] = useState<string>('add');
  // 模态框的新增或编辑form定义
  const [form, setForm] = useState<FormInstance<any>>();
  // 当前信息，用于回填表单
  const [current, setCurrent] = useState<RoomItem>();
  // 设置表单的查询更新
  const [name, setName] = useState<string>('');

  const [dataSource] = useState<SearchDataType>(searchData);
  const [opens, setopens] = useState<boolean>(false);
  const [xQLabelItem, setXQLabelItem] = useState('');
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const guanbi = () => {
    setopens(false);
    setModalVisible(true);
  };

  // 头部input事件
  const handlerSearch = (type: string, value: string) => {
    setName(value);
    actionRef.current?.reload();
  };
  /**
   * 实时设置模态框标题
   *
   * @return {*}
   */
  const getModelTitle = () => {
    if (modalType === 'uphold') {
      return '场地类型维护';
    }
    if (current) {
      return '编辑场地信息';
    }
    return '新增场地信息';
  };
  /**
   * 根据不同按钮显示不同模态框与title
   *
   * @return {*}
   */
  const handleOperation = (type: string, data?: RoomItem) => {
    if (data) {
      setCurrent(data);
    } else {
      setCurrent(undefined);
    }
    setModalType(type);
    getModelTitle();
    setModalVisible(true);
  };

  const eventclose = () => {
    setopens(false);
    setModalVisible(false);
    handleOperation('uphold');
  };
  /**
   * 更新或新增场地信息
   *
   * @return {*}
   */
  const handleSubmit = async () => {
    try {
      const values = await form?.validateFields();
      const { id, ...rest } = values;
      // 更新或新增场地信息
      const result = id
        ? await updateFJSJ({ id }, { ...rest, XQName: xQLabelItem, XXJBSJId: currentUser?.xxId })
        : await createFJSJ({ ...rest, XQName: xQLabelItem, XXJBSJId: currentUser?.xxId });
      if (result.status === 'ok') {
        message.success(id ? '场地信息更新成功' : '场地信息新增成功');
        setModalVisible(false);
        actionRef.current?.reload();
      } else {
        enHenceMsg(result.message);
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  const columns: ProColumns<RoomItem>[] = [
    {
      title: '名称',
      dataIndex: 'FJMC',
      align: 'center',
      width: 200,
      ellipsis: true,
    },
    {
      title: '编号',
      dataIndex: 'FJBH',
      align: 'center',
      width: 150,
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'FJLX',
      align: 'center',
      width: 150,
      ellipsis: true,
      render: (_, record) => {
        return (
          <div className="ui-table-col-elp">
            <Tooltip title={record.FJLX?.FJLX} arrowPointAtCenter>
              {record.FJLX?.FJLX}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: '所属校区',
      dataIndex: 'XQName',
      align: 'center',
      width: 200,
      ellipsis: true,
    },
    {
      title: '容纳人数',
      dataIndex: 'FJRS',
      align: 'center',
      width: 100,
    },
    {
      title: '地址',
      dataIndex: 'BZXX',
      align: 'center',
      ellipsis: true,
      width: 250,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 300,
      align: 'center',
      render: (_, record) => (
        <>
          <a onClick={() => handleOperation('add', record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title="删除之后，数据不可恢复，确定要删除吗?"
            onConfirm={async () => {
              try {
                if (record.id) {
                  const result = await deleteFJSJ({ id: record.id });
                  if (result.status === 'ok') {
                    message.success('场地信息删除成功');
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
      ),
    },
  ];
  return (
    <PageContainer cls={styles.roomWrapper}>
      <PromptInformation
        text="还没有设置场地类型，请先维护场地类型"
        open={opens}
        colse={guanbi}
        event={eventclose}
      />
      <ProTable<RoomItem>
        columns={columns}
        actionRef={actionRef}
        search={false}
        request={async (
          params: RoomItem & {
            pageSize?: number;
            current?: number;
            keyword?: string;
          },
          sort,
          filter,
        ): Promise<Partial<RequestData<RoomItem>>> => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const opts: TableListParams = {
            ...params,
            sorter: sort && Object.keys(sort).length ? sort : undefined,
            filter,
          };
          const res = await getAllFJSJ(
            { page: 0, pageSize: 0, name, XXJBSJId: currentUser?.xxId },
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
        headerTitle={
          <SearchComponent
            dataSource={dataSource}
            onChange={(type: string, value: string) => handlerSearch(type, value)}
          />
        }
        options={{
          setting: false,
          fullScreen: false,
          density: false,
          reload: false,
        }}
        pagination={paginationConfig}
        rowKey="id"
        dateFormatter="string"
        toolBarRender={() => [
          <Button key="uphold" onClick={() => handleOperation('uphold')}>
            场地类型维护
          </Button>,
          <Button
            style={{ background: theme.btnPrimarybg, borderColor: theme.btnPrimarybg }}
            type="primary"
            key="add"
            onClick={() => handleOperation('add')}
          >
            <PlusOutlined />
            新增场地
          </Button>,
        ]}
      />
      <Modal
        title={getModelTitle()}
        destroyOnClose
        width="35vw"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={
          modalType === 'uphold'
            ? null
            : [
              <Button key="submit" type="primary" onClick={handleSubmit}>
              确定
            </Button>,
                <Button key="back" onClick={() => setModalVisible(false)}>
                  取消
                </Button>,
               
              ]
        }
        style={{ maxHeight: '430px' }}
        centered
        maskClosable={false}
        bodyStyle={{
          maxHeight: '360px',
          // overflowY: 'auto',
        }}
      >
        {modalType === 'uphold' ? (
          <AsyncSiteMaintenance />
        ) : (
          <AsyncAddRoom
            current={current}
            setForm={setForm}
            setopens={setopens}
            setModalVisible={setModalVisible}
            setXQLabelItem={setXQLabelItem}
          />
        )}
      </Modal>
    </PageContainer>
  );
};

export default RoomManagement;
