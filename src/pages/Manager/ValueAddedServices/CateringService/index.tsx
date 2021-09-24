/* eslint-disable react-hooks/exhaustive-deps */
import PageContainer from '@/components/PageContainer';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { Button, Modal, Select, Tag, message, Form, Input, Popconfirm } from 'antd';
import styles from './index.less'
import type { ActionType, ProColumns } from '@ant-design/pro-table';
// import { Search } from '@ant-design/pro-table';
import EllipsisHint from '@/components/EllipsisHint';
import type { TableListItem } from './data';
import ProTable from '@ant-design/pro-table';
import { getAllGrades } from '@/services/after-class/khjyjg';
import { createKHZZFW, deleteKHZZFW, getKHZZFW, updateKHZZFW } from '@/services/after-class/khzzfw';

const { Option } = Select;
const { Search } = Input;

const MutualEvaluation = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [DataSource, setDataSource] = useState<API.KHZZFW[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 适用年级
  const [optionsNJ, setOptionsNJ] = useState<any[]>([]);
  const [NjId, setNjId] = useState<any[]>([])
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  // 课程名称查询
  const [CourseName, setCourseName] = useState();


  const ongetKHZZFW = async () => {
    const res = await getKHZZFW({
      XXJBSJId: currentUser?.xxId,
      FWMC: CourseName || '',
      page: 0,
      pageSize: 0
    })
    if (res.status === 'ok') {
      setDataSource(res!.data!.rows!)
    }
  }
  useEffect(() => {
    ongetKHZZFW();
  }, [CourseName])

  useEffect(() => {
    (
      async () => {
        const resNJ = await getAllGrades({ XD: currentUser?.XD?.split(',') });
        if (resNJ.status === 'ok') {
          const optNJ: any[] = [];
          const nj = ['幼儿园', '小学', '初中', '高中'];
          nj.forEach((itemNJ) => {
            resNJ.data?.forEach((item) => {
              if (item.XD === itemNJ) {
                optNJ.push({
                  label: item.XD === '初中' ? item.NJMC : `${item.XD}${item.NJMC}`,
                  value: item.id,
                });
              }
            });
          });
          setOptionsNJ(optNJ);
        }
      }
    )()
  }, [])
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
        XXJBSJId:currentUser?.xxId
      }
      const res = await createKHZZFW( data)
      if (res.status === 'ok') {
        message.success('保存成功')
        setIsModalVisible(false);
        ongetKHZZFW();
      }
    } else {
      const data = {
        ...value,
        njIds: NjId,
      }
      const res = await updateKHZZFW({ id: value?.id }, data)
      if (res.status === 'ok') {
        message.success('修改成功')
        setIsModalVisible(false);
        ongetKHZZFW();
      }
    }
  }
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.submit()
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };
  const handleChange = (value: any, key: any) => {
    const NewArr: any[] = [];
    key?.forEach((item: any) => {
      NewArr.push(item.key)
    })
    setNjId(NewArr)
  }
  const onSearch = (value: any) => {
    setCourseName(value)
  };
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center'
    },
    {
      title: '服务名称',
      dataIndex: 'FWMC',
      key: 'FWMC',
      width: 110,
      align: 'center',
      search: false,
      ellipsis: true
    },
    {
      title: '合作单位',
      dataIndex: 'FWJGMC',
      key: 'FWJGMC',
      align: 'center',
      width: 130,
      search: false,
      ellipsis: true
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
              return <Tag key={item.id}>{item.XD === '初中' ? `${item.NJMC}` : `${item.XD}${item.NJMC}`}</Tag>;
            })}
          />
        );
      }
    },
    {
      title: '内容描述',
      dataIndex: 'FWNR',
      key: 'FWNR',
      width: 180,
      align: 'center',
      search: false,
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'FWZT',
      key: 'FWZT',
      width: 100,
      onFilter: true,
      search: false,
      valueType: 'select',
      align: 'center',
      valueEnum: {
        0: {
          text: '未发布',
          status: 'Error',
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
      width: 130,
      render: (text, record) => {
        return (
          <div className={styles.operation}>
            {
              record.FWZT === 0 ?
              <Popconfirm
              title="确定发布该服务?"
              onConfirm={async () => {
                const NewArr: any[] = [];
                record?.NJSJs?.forEach((item: any) => {
                  NewArr.push(item.id)
                })
                const data = {
                  ...record,
                  njIds:NewArr,
                  FWZT:1,
                }
                try {
                  if (record.id) {
                    const res = await updateKHZZFW({ id: record?.id }, data)
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
              <a key='release' style={{ marginRight: '10px' }}>发布</a>
            </Popconfirm>:
             <Popconfirm
             title="确定撤销发布该服务?"
             onConfirm={async () => {
               const NewArr: any[] = [];
               record?.NJSJs?.forEach((item: any) => {
                 NewArr.push(item.id)
               })
               const data = {
                 ...record,
                 njIds:NewArr,
                 FWZT:0,
               }
               try {
                 if (record.id) {
                   const res = await updateKHZZFW({ id: record?.id }, data)
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
             <a key='release' style={{ marginRight: '10px' }}>撤销发布</a>
           </Popconfirm>
            }

            <a
              key="editable"
              onClick={() => {
                const NewArr: any[] = [];
                record?.NJSJs?.forEach((item: any) => {
                  NewArr.push(item.NJMC)
                })
                const data = {
                  ...record,
                  SYNJ:NewArr
                }
                form.setFieldsValue(data)
                setIsModalVisible(true);
              }}
              style={{ marginRight: '10px' }}
            >
              编辑
            </a>
            <Popconfirm
              title="确定删除该服务?"
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
              <a key='delete'>删除</a>
            </Popconfirm>

          </div>
        );
      }
    }
  ];
  return (
    <PageContainer>
      <div className={styles.ToIntroduce}>
        <ProTable<any>
          columns={columns}
          rowKey="key"
          actionRef={actionRef}
          pagination={{
            showQuickJumper: true
          }}
          search={false}
          dataSource={DataSource}
          dateFormatter="string"
          headerTitle={
            <Search placeholder="请输入配餐名称" onSearch={onSearch} style={{ width: 200 }} />
          }
          toolBarRender={() => [
            <Button type="primary" key="primary" onClick={showModal}>
              新增服务
            </Button>
          ]}
        />
      </div>
      <Modal title="新建服务" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form name="basic" form={form} onFinish={submit} className={styles.Forms}>
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="服务名称"
            name="FWMC"
            key="FWMC"
            rules={[{ required: true, message: '请输入服务名称' }]}
          >
            <Input placeholder='请输入' />
          </Form.Item>

          <Form.Item
            label="服务单位"
            name="FWJGMC"
            key="FWJGMC"
            rules={[{ required: true, message: '请输入服务单位' }]}
          >
            <Input placeholder='请输入' />
          </Form.Item>

          <Form.Item
            name="SYNJ"
            key="SYNJ"
            label="适用年级"
            rules={[
              {
                required: true,
                message: '请选择适用年级'
              }
            ]}
          >
            <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="请选择" onChange={handleChange}>
              {
                optionsNJ?.length ? optionsNJ?.map((item: any) => {
                  return <Option value={item?.label} key={item?.value}>{item?.label}</Option>
                }) : ''

              }
            </Select>
          </Form.Item>
          <Form.Item
            label="内容描述"
            name="FWNR"
            key="FWNR"
            rules={[
              {
                required: true,
                message: '请输入配餐描述'
              }
            ]}
          >
            <Input.TextArea placeholder='请输入' rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>

  )
}
export default MutualEvaluation