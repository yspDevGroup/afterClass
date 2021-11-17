/* eslint-disable no-unneeded-ternary */
/*
 * @description:
 * @author: wsl
 * @Date: 2021-08-09 17:41:43
 * @LastEditTime: 2021-10-19 16:39:19
 * @LastEditors: Sissle Lynn
 */
import { useState, useRef } from 'react';
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

const { TextArea } = Input;
const { Option } = Select;
const Notice = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [dataSource, setDataSource] = useState<API.XXTZGG[]>();
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      fixed: 'left',
      align: 'center'
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
      search: false
    },
    {
      title: '发布时间',
      dataIndex: 'RQ',
      key: 'RQ',
      valueType: 'dateTime',
      hideInForm: true,
      align: 'center',
      width: 160,
      search: false
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
              if (actionRef.current) {
                actionRef?.current?.reload();
              }
            }}
          />
        </div>
      ),
      align: 'center',
    },
  ];
  const handleSubmit = async (params: any) => {
    const { RQ, XXNR } = params;
    let res: any;
    if (RQ === '家长') {
      res = await sendMessageToParent({
        to: 'toall',
        text: XXNR,
        ids: []
      })
    } else if (RQ === '教师') {
      res = await sendMessageToTeacher({
        to: 'touser',
        text: XXNR,
        ids: '@all'
      })
    } else {
      res = await sendMessageToParent({
        to: 'toall',
        text: XXNR,
        ids: []
      })
      res = await sendMessageToTeacher({
        to: 'touser',
        text: XXNR,
        ids: '@all'
      })
    }
    if (res.status === 'ok') {
      message.success('发送成功')
      setVisible(false)
      setCurrent(undefined)
      form.resetFields();
    } else {
      message.error('发送失败，请稍后再试')
    }
  }

  return (
    <PageContainer>
      <ProTable<any>
        headerTitle={<div style={{ fontWeight: 'bold' }}>通知列表</div>}
        actionRef={actionRef}
        className={styles.proTableStyles}
        rowKey="id"
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
          defaultCurrent: 1,
        }}
        scroll={{ x: 1000 }}
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
          </Button>
        ]}
        request={async (params) => {
          if (params.ZT || params.BT) {
            const resgetXXTZGG = await getXXTZGG({
              XXJBSJId: currentUser?.xxId,
              BT: params.BT,
              ZT: params.ZT ? [params.ZT] : ['已发布', '草稿'],
              LX: ['0', '1'],
              page: 0,
              pageSize: 0,
            });
            if (resgetXXTZGG.status === 'ok') {
              setDataSource(resgetXXTZGG.data?.rows);
            }
          } else {
            const resgetXXTZGG = await getXXTZGG({
              XXJBSJId: currentUser?.xxId,
              BT: '',
              LX: ['0', '1'],
              ZT: ['已发布', '草稿'],
              page: 0,
              pageSize: 0,
            });
            if (resgetXXTZGG.status === 'ok') {
              setDataSource(resgetXXTZGG.data?.rows);
            }
          }
          return '';
        }}
        dataSource={dataSource}
        columns={columns}
      />
      <Modal
        title="发送消息"
        visible={visible}

        footer={[
          <Button
            key="back"
            style={{ borderRadius: 4 }}
            onClick={() => {
              setVisible(false);
              setCurrent(undefined);
              form.resetFields();
            }}>
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
            <Button key="submit" type="primary" style={{ borderRadius: 4 }} >
              确定
            </Button>
          </Popconfirm>

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
            ]} >
            <TextArea rows={4} maxLength={100} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

Notice.wrappers = ['@/wrappers/auth'];
export default Notice;
