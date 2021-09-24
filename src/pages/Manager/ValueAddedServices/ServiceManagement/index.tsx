import PageContainer from '@/components/PageContainer';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { Button, Modal, Select, Tag, message, Form, Input } from 'antd';
import { queryXNXQList } from '@/services/local-services/xnxq';
import styles from './index.less'
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import EllipsisHint from '@/components/EllipsisHint';
import type { TableListItem } from './data';
import ProTable from '@ant-design/pro-table';
import { createKHZZFW, getKHZZFW } from '@/services/after-class/khzzfw';

const { Option } = Select;

const ServiceManagement = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [DataSource, setDataSource] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);
   // 适用年级
  const [optionsNJ, setOptionsNJ] = useState<any[]>([]);
  const [NjId, setNjId] = useState<any[]>([])
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 学年学期列表数据
  const [termList, setTermList] = useState<any>();
  // 学期学年没有数据时提示的开关
  const [kai, setkai] = useState<boolean>(false);
  useEffect(() => {
    // 获取学年学期数据的获取
    (async () => {
      const res = await queryXNXQList(currentUser?.xxId);
      // 获取到的整个列表的信息
      const newData = res.xnxqList;
      const curTerm = res.current;
      if (newData?.length) {
        if (curTerm) {
          setCurXNXQId(curTerm.id);
          setTermList(newData);
        }
      } else {
        setkai(true);
      }
    })();

  }, [])
  // 学年学期变化
  const ongetKHZZFW = async() =>{
    const res = await getKHZZFW({
      XXJBSJId:currentUser?.xxId,
      FWMC:'',
      page:0,
      pageSize:0
    })
    if(res.status === 'ok'){
      console.log(res)
      setDataSource(res?.data?.rows)
    }
  }
  useEffect(() => {
    ongetKHZZFW();
  }, [])


  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center'
    },
    {
      title: '配餐名称',
      dataIndex: 'FWMC',
      key: 'FWMC',
      align: 'center',
      search: false,
      ellipsis: true
    },
    {
      title: '服务单位',
      dataIndex: 'FWJGMC',
      key: 'FWJGMC',
      align: 'center',
      search: false,
      ellipsis: true
    },
    {
      title: '适用年级',
      dataIndex: 'SYNJ',
      key: 'SYNJ',
      align: 'center',
      search: false,
      width: 250,
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
      title: '描述',
      dataIndex: 'MS',
      key: 'MS',
      width: 200,
      align: 'center',
      search: false,
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'state',
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
      width: 100,
      render: (text, record,) => {
        return (
          <div className={styles.operation}>
            <a
              key="editable"
              onClick={() => {
              }}
            >
              编辑
            </a>,
            <a key="delete">
              删除
            </a>,
          </div>
        );
      }
    }
  ];
  const submit = async (value: any) => {

    console.log(value)
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
  const handleChange = (value: any,key: any) => {
    const NewArr: any[] = [];
    key?.forEach((item: any)=>{
      NewArr.push(item.key)
    })
    setNjId(NewArr)
  }
  return (
    <PageContainer>
      {/* <div className={styles.ToIntroduce}>
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
            <div className={styles.TopSearchss}>
              <span style={{ fontSize: 14, color: '#666' }}>
                所属学年学期：
                <Select
                  value={curXNXQId}
                  style={{ width: 200 }}
                  onChange={(value: string) => {
                    setCurXNXQId(value);
                  }}
                >
                  {termList?.map((item: any) => {
                    return (
                      <Option key={item.value} value={item.value}>
                        {item.text}
                      </Option>
                    );
                  })}
                </Select>
              </span>
            </div>
          }
          toolBarRender={() => [
            <Button type="primary" key="primary" onClick={showModal}>
              新建配餐
            </Button>
          ]}
        />
      </div>
      <Modal title="新建配餐" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form name="basic" form={form} onFinish={submit} className={styles.Forms}>
          <Form.Item
            label="配餐名称"
            name="FWMC"
            key="FWMC"
            rules={[{ required: true, message: '请输入配餐名称' }]}
          >
            <Input placeholder='例：XX配餐' />
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
            <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="请选择"  onChange={handleChange}>
              {
                optionsNJ?.length ?  optionsNJ?.map((item: any)=>{
                  return <Option value={item?.label} key={item?.value}>{item?.label}</Option>
                }):''

              }
            </Select>
          </Form.Item>
          <Form.Item
            label="配餐描述"
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
      </Modal> */}服务管理
    </PageContainer>

  )
}
export default ServiceManagement
