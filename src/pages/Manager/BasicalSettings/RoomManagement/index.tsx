/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
import React, { useRef, useState, useEffect } from 'react';
import { useModel } from 'umi';
import type { FormInstance } from 'antd';
import {
  Input,
  Tooltip,
  message,
  Popconfirm,
  Button,
  Divider,
  Modal,
  Select,
  Upload,
  Badge,
} from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
import { PlusOutlined, UploadOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import type { TableListParams } from './data';
import { theme } from '@/theme-default';
import { createFJSJ, deleteFJSJ, getAllFJSJ, updateFJSJ } from '@/services/after-class/fjsj';
import PageContainer from '@/components/PageContainer';
import AsyncAddRoom from './components/AsyncAddRoom';
import AsyncSiteMaintenance from './components/AsyncSiteMaintenance';
import PromptInformation from '@/components/PromptInformation';
import { enHenceMsg, getTableWidth } from '@/utils/utils';
import { getAllFJLX } from '@/services/after-class/fjlx';
import { getAllXXJBSJ } from '@/services/after-class/xxjbsj';
import { getAuthorization } from '@/utils/utils';

import SearchLayout from '@/components/Search/Layout';

import styles from './index.less';

const { Search } = Input;
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
  // 设置场地信息
  const [CDLXId, setCDLXId] = useState<string>('');
  const [dataLX, setDataLX] = useState<any>([]);
  const [opens, setopens] = useState<boolean>(false);
  const [xQLabelItem, setXQLabelItem] = useState<{ label?: string; value?: string }>({});
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [uploadVisible, setUploadVisible] = useState<boolean>(false);

  useEffect(() => {
    (
      async () => {
        const response = await getAllFJLX({
          name: '',
          XXJBSJId: currentUser?.xxId,
        });
        if (response.status === 'ok') {
          if (response.data && response.data.length === 0) {
            setopens(true);
          }
        }
      }
    )()
  }, [])
  /**
   * 实时设置模态框标题
   *
   * @return {*}
   */
  const getModelTitle = () => {
    if (modalType === 'uphold') {
      return '场地类型维护';
    }
    if (current && current?.type === 'add') {
      return '编辑场地信息';
    }
    if (current && current?.type === 'copy') {
      return '复制场地信息';
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
      const list = { ...data, type };
      setCurrent(list);
      setXQLabelItem({ label: data?.XQSJ?.XQMC, value: data?.XQSJ?.id });
    } else {
      setCurrent(undefined);
      setXQLabelItem({});
    }
    setModalType(type);
    getModelTitle();
    setModalVisible(true);
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
      const result = id && current?.type === 'add'
        ? await updateFJSJ(
          { id },
          {
            ...rest,
            XQName: xQLabelItem?.label,
            XQSJId: xQLabelItem.value,
            XXJBSJId: currentUser?.xxId,
          },
        )
        : await createFJSJ({
          ...rest,
          XQName: xQLabelItem?.label,
          XQSJId: xQLabelItem.value,
          XXJBSJId: currentUser?.xxId,
        });
      if (result.status === 'ok') {
        // eslint-disable-next-line no-nested-ternary
        message.success(id ? (current?.type === 'add' ? '场地信息更新成功' : '场地信息复制成功') : '场地信息新增成功');
        setModalVisible(false);
        actionRef.current?.reload();
      } else {
        enHenceMsg(result.message);
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  /**
   * 控制场地类型未配置时提示框的展示与隐藏
   */
  const closePromt = () => {
    setopens(false);
    setModalVisible(false);
  };
  const columns: ProColumns<RoomItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '名称',
      dataIndex: 'FJMC',
      align: 'center',
      width: 200,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '编号',
      dataIndex: 'FJBH',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'FJLX',
      align: 'center',
      width: 120,
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
      render: (_, record) => {
        return record?.XQSJ?.XQMC;
      },
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
      width: 150,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <>
          <a onClick={() => handleOperation('add', record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => handleOperation('copy', record)}>复制</a>
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

  useEffect(() => {
    (async () => {
      // 获取校区列表
      const res1: any = await getAllXXJBSJ({
        xxId: currentUser?.xxId,
        page: 0,
        pageSize: 0,
      });
      if (res1.status === 'ok') {
        // console.log('res1', res1);

        const v = res1?.data?.rows.map((item: any) => {
          return { label: item.XXMC, value: item.id };
        });
        if (v?.length > 0) {
          // setSSXQId(v[0].value);
          // setSSXQData(v);
        }
      }

      const response = await getAllFJLX({
        name: '',
        XXJBSJId: currentUser?.xxId,
      });
      if (response.status === 'ok') {
        if (response.data && response.data.length > 0) {
          const newData: any = [].map.call(response.data, (item: RoomType) => {
            return {
              label: item.FJLX,
              value: item.id,
            };
          });
          setDataLX(newData);
        }
      }
    })();
  }, [modalVisible, uploadVisible]);

  const UploadProps: any = {
    name: 'xlsx',
    action: '/api/upload/importSites?xxId=53091f16-e723-4910-aca9-9741cd75a14f',
    headers: {
      authorization: getAuthorization(),
      // 'Content-Type':'multipart/form-data;',
    },
    data: {
      xxId: '53091f16-e723-4910-aca9-9741cd75a14f',
    },
    // accept={''}
    beforeUpload(file: any) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      console.log('isLt2M', isLt2M);
      if (!isLt2M) {
        message.error('文件大小不能超过2M');
      }
      return isLt2M;
    },
    onChange(info: {
      file: { status: string; name: any; response: any };
      fileList: any;
      event: any;
    }) {
      if (info.file.status === 'done') {
        const code = info.file.response;
        if (code.status === 'ok') {
          // message.success(`上传成功`);
          setUploadVisible(false);
          actionRef?.current?.reload();
        } else {
          message.error(`${code.message}`);
          event?.currentTarget?.onerror(code);
        }
      } else if (info.file.status === 'error') {
        console.log('info.file.response', info.file);
      }
    },
  };
  // const onClose = () => {
  //   setUploadVisible(false);
  //   actionRef.current?.reload();
  // };

  return (
    <PageContainer cls={styles.roomWrapper}>
      <PromptInformation
        text="还没有设置场地类型，请先维护场地类型"
        open={opens}
        colse={closePromt}
        type={true}
      />
      <ProTable<RoomItem>
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
          params: RoomItem & {
            pageSize?: number;
            current?: number;
            keyword?: string;
          },
          sort,
          filter,
        ): Promise<Partial<RequestData<RoomItem>>> => {
          // 表单搜索项会从 params 传入，传递给后端接口。.
          const opts: TableListParams = {
            ...params,
            sorter: sort && Object.keys(sort).length ? sort : undefined,
            filter,
          };
          const res = await getAllFJSJ(
            { page: 0, pageSize: 0, name, XXJBSJId: currentUser?.xxId, lxId: CDLXId },
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
          <>
            <SearchLayout>
              <div>
                <label htmlFor="type">场地类型：</label>
                <Select
                  allowClear
                  placeholder="场地类型"
                  onChange={(value) => {
                    setCDLXId(value);
                    actionRef.current?.reload();
                  }}
                  value={CDLXId}
                  style={{ width: '120px' }}
                >
                  {dataLX &&
                    dataLX.length &&
                    dataLX?.map((op: any) => (
                      <Select.Option value={op.value} key={op.value}>
                        {op.label}
                      </Select.Option>
                    ))}
                </Select>
              </div>
              <div>
                <label htmlFor="type">场地名称：</label>
                <Search
                  placeholder="场地名称"
                  allowClear
                  onSearch={(value: string) => {
                    setName(value);
                    actionRef.current?.reload();
                  }}
                />
              </div>

            </SearchLayout>
          </>
        }
        options={{
          setting: false,
          fullScreen: false,
          density: false,
          reload: false,
        }}
        rowKey="id"
        dateFormatter="string"
        toolBarRender={() => [
          <Button ghost key="uphold" onClick={() => handleOperation('uphold')}>
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
          <Button key="button" type="primary" onClick={() => setUploadVisible(true)}>
            <VerticalAlignBottomOutlined /> 导入
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
          maxHeight: '50vh',
          overflowY: 'auto',
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
            xQLabelItem={xQLabelItem}
          />
        )}
      </Modal>

      <Modal
        title="导入场地"
        destroyOnClose
        width="35vw"
        visible={uploadVisible}
        onCancel={() => setUploadVisible(false)}
        footer={null}
        centered
        maskClosable={false}
        bodyStyle={{
          maxHeight: '65vh',
          overflowY: 'auto',
        }}
      >
        <>
          <p>
            <Upload {...UploadProps}>
              <Button icon={<UploadOutlined />}>上传文件</Button>{' '}
              <span className={styles.messageSpan}>批量导入场地</span>
            </Upload>
          </p>
          <div className={styles.messageDiv}>
            <Badge color="#aaa" />
            上传文件仅支持模板格式
            <a style={{ marginLeft: '16px' }} type="download" href="/template/sitesImport.xlsx">
              下载模板
            </a>
            <br />
            <Badge color="#aaa" />
            确保表格内只有一个工作薄，如果有多个只有第一个会被处理
            <br />
            <Badge color="#aaa" />
            场地单次最大支持导入500条数据
          </div>
        </>
      </Modal>
    </PageContainer>
  );
};

export default RoomManagement;
