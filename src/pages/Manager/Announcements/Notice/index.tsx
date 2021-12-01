/* eslint-disable no-unneeded-ternary */
/*
 * @description:
 * @author: wsl
 * @Date: 2021-08-09 17:41:43
 * @LastEditTime: 2021-11-18 17:31:24
 * @LastEditors: Sissle Lynn
 */
import { useState, useRef, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Switch, message, Modal, Form, Select, Input, Popconfirm } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { history, useModel } from 'umi';
import Options from '../components/Option';
import type { TableListItem } from '../data';
import styles from '../index.module.less';
import moment from 'moment';
import PageContainer from '@/components/PageContainer';
import { getXXTZGG, updateXXTZGG } from '@/services/after-class/xxtzgg';
import { sendMessageToParent, sendMessageToTeacher } from '@/services/after-class/wechat';
import { getTableWidth } from '@/utils/utils';
import SearchLayout from '@/components/Search/Layout';

const { TextArea, Search } = Input;
const { Option } = Select;
const Notice = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<API.XXTZGG[]>();
  const [title, setTitle] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [visible, setVisible] = useState<boolean>(false);
  const getData = async () => {
    const resgetXXTZGG = await getXXTZGG({
      XXJBSJId: currentUser?.xxId,
      BT: title,
      LX: ['0', '1'],
      ZT: status ? [status] : ['已发布', '草稿'],
      page: 0,
      pageSize: 0,
    });
    if (resgetXXTZGG.status === 'ok') {
      setDataSource(resgetXXTZGG.data?.rows);
    }
  };
  useEffect(() => {
    getData();
  }, [title, status]);
  const handleSubmit = async (params: any) => {
    const { RQ, XXNR } = params;
    let res: any;
    if (RQ === '家长') {
      res = await sendMessageToParent({
        to: 'toall',
        text: XXNR,
        ids: [],
      });
    } else if (RQ === '教师') {
      res = await sendMessageToTeacher({
        to: 'touser',
        text: XXNR,
        ids: '@all',
      });
    } else {
      res = await sendMessageToParent({
        to: 'toall',
        text: XXNR,
        ids: [],
      });
      res = await sendMessageToTeacher({
        to: 'touser',
        text: XXNR,
        ids: '@all',
      });
    }
    if (res.status === 'ok') {
      message.success('发送成功');
      setVisible(false);
      form.resetFields();
    } else {
      message.error('发送失败，请稍后再试');
    }
  };
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      fixed: 'left',
      align: 'center',
    },
    {
      title: '标题',
      dataIndex: 'BT',
      key: 'BT',
      ellipsis: true,
      align: 'center',
      fixed: 'left',
      width: 180,
    },
    {
      title: '作者',
      dataIndex: 'ZZ',
      key: 'ZZ',
      ellipsis: true,
      align: 'center',
      width: 120,
      search: false,
    },
    {
      title: '发布时间',
      dataIndex: 'RQ',
      key: 'RQ',
      valueType: 'dateTime',
      hideInForm: true,
      align: 'center',
      width: 160,
      search: false,
    },
    {
      title: '发布状态',
      dataIndex: 'ZT',
      key: 'ZT',
      width: 120,
      align: 'center',
      valueEnum: {
        草稿: { text: '草稿', status: 'Default' },
        已发布: { text: '已发布', status: 'Success' },
      },
    },
    {
      title: '头条',
      dataIndex: 'SFTT',
      key: 'SFTT',
      defaultSortOrder: 'descend',
      search: false,
      align: 'center',
      width: 120,
      render: (text, record) => {
        return (
          <Switch
            key="SFTT"
            defaultChecked={!!text}
            size="small"
            onChange={async (checked: boolean) => {
              const data = {
                RQ: moment(record.RQ).format(),
                SFTT: checked === true ? 1 : 0,
              };
              try {
                const resUpdateJYJGTZGG = await updateXXTZGG({ id: record.id }, data);
                if (resUpdateJYJGTZGG.status === 'ok') {
                  message.success('设置成功');
                  actionRef?.current?.reload();
                } else {
                  message.error('设置失败，请联系管理员或稍后再试。');
                }
              } catch (err) {
                message.error('设置失败，请联系管理员或稍后再试。');
              }
            }}
          />
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      key: 'option',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <div className={styles.optionCol}>
          <Options
            id={record.id}
            ZT={record.ZT}
            record={record}
            refreshHandler={() => {
              getData();
            }}
          />
        </div>
      ),
      align: 'center',
    },
  ];
  return (
    <PageContainer>
      <ProTable<any>
        actionRef={actionRef}
        className={styles.proTableStyles}
        rowKey="id"
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
          defaultCurrent: 1,
        }}
        scroll={{ x: getTableWidth(columns) }}
        toolBarRender={() => [
          <Button
            key="xinjian"
            type="primary"
            onClick={() => {
              setVisible(true);
            }}
          >
            发送实时消息
          </Button>,
          <Button
            key="xinjian"
            type="primary"
            onClick={() => {
              history.push('/announcements/notice/editArticle');
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        dataSource={dataSource}
        columns={columns}
        search={false}
        options={{
          setting: false,
          fullScreen: false,
          density: false,
          reload: false,
        }}
        headerTitle={
          <SearchLayout>
            <div>
              <label htmlFor="title">标题：</label>
              <Search
                allowClear
                onSearch={(val) => {
                  setTitle(val);
                }}
              />
            </div>
            <div>
              <label htmlFor="status">发布状态：</label>
              <Select
                style={{ width: 160 }}
                allowClear
                value={status}
                onChange={(value: string) => {
                  setStatus(value);
                }}
              >
                <Option key="草稿" value="草稿">
                  草稿
                </Option>
                <Option key="已发布" value="已发布">
                  已发布
                </Option>
              </Select>
            </div>
          </SearchLayout>
        }
      />
      <Modal
        title="发送消息"
        visible={visible}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
        footer={[
          <Button
            key="back"
            style={{ borderRadius: 4 }}
            onClick={() => {
              setVisible(false);
              form.resetFields();
            }}
          >
            取消
          </Button>,
          <Popconfirm
            title="消息发送之后不可更改或撤销，确定发布吗？"
            onConfirm={() => {
              form.submit();
            }}
            okText="确定"
            cancelText="取消"
            placement="topRight"
          >
            <Button key="submit" type="primary" style={{ borderRadius: 4 }}>
              确定
            </Button>
          </Popconfirm>,
        ]}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          form={form}
          onFinish={handleSubmit}
          layout="horizontal"
        >
          <Form.Item label="发送人群" name="RQ">
            <Select defaultValue="全部">
              <Option value="全部">全部</Option>
              <Option value="教师">教师</Option>
              <Option value="家长">家长</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="消息内容"
            name="XXNR"
            rules={[
              {
                required: true,
                message: '请输入消息内容',
              },
            ]}
          >
            <TextArea rows={4} maxLength={100} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

Notice.wrappers = ['@/wrappers/auth'];
export default Notice;
