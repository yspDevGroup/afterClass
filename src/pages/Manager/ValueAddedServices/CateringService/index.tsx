/* eslint-disable react-hooks/exhaustive-deps */
import PageContainer from '@/components/PageContainer';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { Button, Modal, Select, Tag, message, Form, Input, Popconfirm, Divider } from 'antd';
import styles from './index.less';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
// import { Search } from '@ant-design/pro-table';
import EllipsisHint from '@/components/EllipsisHint';
import type { TableListItem } from './data';
import ProTable from '@ant-design/pro-table';
import { getAllGrades } from '@/services/after-class/khjyjg';
import { createKHZZFW, deleteKHZZFW, getKHZZFW, updateKHZZFW } from '@/services/after-class/khzzfw';
import { PlusOutlined } from '@ant-design/icons';
import SearchLayout from '@/components/Search/Layout';
import { getTableWidth } from '@/utils/utils';

const { Option } = Select;
const { Search } = Input;

const MutualEvaluation = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [DataSource, setDataSource] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 适用年级
  const [optionsNJ, setOptionsNJ] = useState<any[]>([]);
  const [NjId, setNjId] = useState<any[]>([]);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  // 类别名称查询
  const [CategoryName, setCategoryName] = useState();
  const [modalTitle, setModalTitle] = useState<string>('新增类别');

  const ongetKHZZFW = async () => {
    const res = await getKHZZFW({
      XXJBSJId: currentUser?.xxId,
      FWMC: CategoryName || '',
      page: 0,
      pageSize: 0,
    });
    if (res.status === 'ok') {
      setDataSource(res!.data!.rows!);
    }
  };
  useEffect(() => {
    ongetKHZZFW();
  }, [CategoryName]);

  useEffect(() => {
    (async () => {
      const resNJ = await getAllGrades({ XD: currentUser?.XD?.split(',') });
      if (resNJ.status === 'ok') {
        const optNJ: any[] = [];
        const nj = ['幼儿园', '小学', '初中', '高中'];
        nj.forEach((itemNJ) => {
          resNJ.data?.forEach((item) => {
            if (item.XD === itemNJ) {
              optNJ.push({
                label: `${item.XD}${item.NJMC}`,
                value: item.id,
              });
            }
          });
        });
        setOptionsNJ(optNJ);
      }
    })();
  }, []);
  useEffect(() => {
    if (isModalVisible === false) {
      setTimeout(() => {
        form.resetFields();
      }, 50);
    }
  }, [isModalVisible]);

  const submit = async (value: any) => {
    if (typeof value.id === 'undefined') {
      const data = {
        ...value,
        njIds: NjId,
        XXJBSJId: currentUser?.xxId,
      };
      const res = await createKHZZFW(data);
      if (res.status === 'ok') {
        message.success('保存成功');
        setIsModalVisible(false);
        ongetKHZZFW();
      }
    } else {
      const data = {
        ...value,
        njIds: NjId,
      };
      const res = await updateKHZZFW({ id: value?.id }, data);
      if (res.status === 'ok') {
        message.success('修改成功');
        setIsModalVisible(false);
        ongetKHZZFW();
      }
    }
  };
  const showModal = () => {
    setIsModalVisible(true);
    setModalTitle('新增类别');
  };

  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };
  const handleChange = (value: any, key: any) => {
    const NewArr: any[] = [];
    key?.forEach((item: any) => {
      NewArr.push(item.key);
    });
    setNjId(NewArr);
  };
  const onSearch = (value: any) => {
    setCategoryName(value);
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
      title: '服务类别',
      dataIndex: 'FWMC',
      key: 'FWMC',
      width: 100,
      fixed: 'left',
      align: 'center',
      search: false,
      ellipsis: true,
    },
    {
      title: '合作单位',
      dataIndex: 'FWJGMC',
      key: 'FWJGMC',
      align: 'center',
      width: 130,
      search: false,
      ellipsis: true,
    },
    {
      title: '适用年级',
      dataIndex: 'NJSJs',
      key: 'NJSJs',
      align: 'center',
      search: false,
      width: 200,
      render: (text: any) => {
        return (
          <EllipsisHint
            width="100%"
            text={text?.map((item: any) => {
              return <Tag key={item.id}>{`${item.XD}${item.NJMC}`}</Tag>;
            })}
          />
        );
      },
    },
    {
      title: '类别描述',
      dataIndex: 'FWNR',
      key: 'FWNR',
      width: 160,
      align: 'center',
      search: false,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'FWZT',
      key: 'FWZT',
      width: 80,
      onFilter: true,
      search: false,
      valueType: 'select',
      align: 'center',
      valueEnum: {
        0: {
          text: '未发布',
          status: 'Default',
        },
        1: {
          text: '已发布',
          status: 'Success',
          disabled: true,
        },
      },
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (text, record) => {
        return (
          <div className={styles.operation}>
            {record.FWZT === 0 ? (
              <>
                <Popconfirm
                  title="确定发布该服务类别?"
                  onConfirm={async () => {
                    const NewArr: any[] = [];
                    record?.NJSJs?.forEach((item: any) => {
                      NewArr.push(item.id);
                    });
                    const data = {
                      ...record,
                      njIds: NewArr,
                      FWZT: 1,
                    };
                    try {
                      if (record.id) {
                        const res = await updateKHZZFW({ id: record?.id }, data);
                        if (res.status === 'ok') {
                          message.success('发布成功');
                          ongetKHZZFW();
                        } else {
                          message.error(res.message);
                        }
                      }
                    } catch (err) {
                      message.error('发布失败，请联系管理员或稍后重试。');
                    }
                  }}
                  okText="确定"
                  cancelText="取消"
                  placement="topRight"
                >
                  <a key="release">发布</a>
                </Popconfirm>{' '}
                <Divider type="vertical" />
                <a
                  key="editable"
                  onClick={() => {
                    const NewArr: any[] = [];
                    const NewIdArr: any[] = [];
                    record?.NJSJs?.forEach((item: any) => {
                      NewArr.push(`${item.XD}${item.NJMC}`);
                      NewIdArr.push(item.id);
                    });
                    setNjId(NewIdArr);
                    const data = {
                      ...record,
                      SYNJ: NewArr,
                    };
                    form.setFieldsValue(data);
                    setIsModalVisible(true);
                    setModalTitle('编辑类别');
                  }}
                >
                  编辑
                </a>
                <Divider type="vertical" />
                <Popconfirm
                  title="确定删除该服务类别?"
                  onConfirm={async () => {
                    try {
                      if (record.id) {
                        const result = await deleteKHZZFW({ id: record.id });
                        if (result.status === 'ok') {
                          message.success('删除成功');
                          ongetKHZZFW();
                        } else {
                          message.error(result.message);
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
                  <a key="delete">删除</a>
                </Popconfirm>{' '}
              </>
            ) : (
              <>
                <Popconfirm
                  title="确定撤销发布该服务类别?"
                  onConfirm={async () => {
                    const NewArr: any[] = [];
                    record?.NJSJs?.forEach((item: any) => {
                      NewArr.push(item.id);
                    });
                    const data = {
                      ...record,
                      njIds: NewArr,
                      FWZT: 0,
                    };
                    try {
                      if (record.id) {
                        const res = await updateKHZZFW({ id: record?.id }, data);
                        if (res.status === 'ok') {
                          message.success('撤销成功');
                          ongetKHZZFW();
                        } else {
                          message.error(res.message);
                        }
                      }
                    } catch (err) {
                      message.error('发布失败，请联系管理员或稍后重试。');
                    }
                  }}
                  okText="确定"
                  cancelText="取消"
                  placement="topRight"
                >
                  <a key="release">撤销发布</a>
                </Popconfirm>
              </>
            )}
          </div>
        );
      },
    },
  ];
  return (
    <PageContainer>
      <div className={styles.ToIntroduce}>
        <ProTable<any>
          columns={columns}
          rowKey="key"
          actionRef={actionRef}
          pagination={{
            showQuickJumper: true,
            pageSize: 10,
            defaultCurrent: 1,
          }}
          scroll={{ x: getTableWidth(columns) }}
          search={false}
          dataSource={DataSource}
          dateFormatter="string"
          headerTitle={
            <SearchLayout>
              <div>
                <label htmlFor="kcname">服务类别：</label>
                <Search placeholder="服务类别" allowClear onSearch={onSearch} />
              </div>
            </SearchLayout>
          }
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
          toolBarRender={() => [
            <Button type="primary" key="primary" onClick={showModal}>
              <PlusOutlined />
              新增类别
            </Button>,
          ]}
        />
      </div>
      <Modal
        title={modalTitle}
        visible={isModalVisible}
        onCancel={() => {
          handleCancel();
        }}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            确定
          </Button>,
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
        ]}
      >
        <Form name="basic" form={form} onFinish={submit} className={styles.Forms}>
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="服务类别"
            name="FWMC"
            key="FWMC"
            rules={[{ required: true, message: '请输入服务类别' }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            name="SYNJ"
            key="SYNJ"
            label="适用年级"
            rules={[
              {
                required: true,
                message: '请选择适用年级',
              },
            ]}
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="请选择"
              onChange={handleChange}
            >
              {optionsNJ?.length
                ? optionsNJ?.map((item: any) => {
                    return (
                      <Option value={item?.label} key={item?.value}>
                        {item?.label}
                      </Option>
                    );
                  })
                : ''}
            </Select>
          </Form.Item>
          <Form.Item
            label="合作单位"
            name="FWJGMC"
            key="FWJGMC"
            rules={[{ required: true, message: '请输入服务单位' }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item label="类别描述" name="FWNR" key="FWNR">
            <Input.TextArea placeholder="请输入" showCount maxLength={200} rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};
export default MutualEvaluation;
