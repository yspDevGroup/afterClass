import { useEffect, useRef, useState } from 'react';
import { queryXNXQList } from '@/services/local-services/xnxq';
// import { message } from 'antd';
import { useModel } from 'umi';
import { Form, Modal, Radio, Select, Input, message, Divider } from 'antd';
import styles from './index.less';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import WWOpenDataCom from '@/components/WWOpenDataCom';
import { getAllKHJSTDK } from '@/services/after-class/khjstdk';
import { updateKHJSTDK } from '@/services/after-class/khjstdk';

const { TextArea } = Input;
const { Option } = Select;
const Adjustment: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  // 学年学期列表数据
  const [termList, setTermList] = useState<any>();
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<string>();
  // 审批状态
  const [SPZT, setSPZT] = useState<any[]>([0, 1, 2]);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Datas, setDatas] = useState<any>();

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
      }
    })();
  }, []);

  const handleSubmit = async (param: any) => {
    const { ZT, BZ } = param;
    try {
      const res = await updateKHJSTDK({ id: current?.id }, { ZT, SPJSId: currentUser?.JSId || testTeacherId, DKBZ: BZ });
      if (res.status === 'ok') {
        message.success('审批成功');
        setVisible(false);
        setCurrent(undefined);
        actionRef.current?.reload();
      }
    } catch (err) {
      message.error('代课审批流程出现错误，请联系管理员或稍后重试。');
    }
  }
  // table表格数据
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
      width: 58,
      fixed: 'left',
    },
    {
      title: '申请教师',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
      width: 80,
      fixed: 'left',
      render: (_text: any, record: any) => {
        const showWXName = record?.SKJS?.XM === '未知' && record?.SKJS?.WechatUserId;
        if (showWXName) {
          return <WWOpenDataCom type="userName" openid={record?.SKJS?.WechatUserId} />;
        }
        return record?.SKJS?.XM;
      },
    },
    {
      title: '课程名称',
      dataIndex: 'KHQJKCs',
      key: 'KHQJKCs',
      align: 'center',
      ellipsis: true,
      render: (text: any, record: any) => {
        return (
          record?.KHBJSJ?.KHKCSJ?.KCMC
        )
      },
      width: 120,
    },
    {
      title: '课程班名称',
      dataIndex: 'KHQJKCs',
      key: 'KHQJKCs_BJMC',
      align: 'center',
      ellipsis: true,
      render: (text: any, record: any) => {
        return (
          record?.KHBJSJ?.BJMC
        )
      },
      width: 120,
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      width: 160,
    },
    {
      title: '调课后场地',
      dataIndex: 'TJHCD',
      key: 'TJHCD',
      align: 'center',
      width: 160,
      render: (text: any, record: any) => {
        return (
          record?.TKFJ?.FJMC
        )
      },
    },
    {
      title: '调课后日期',
      dataIndex: 'TKRQ',
      key: 'TKRQ',
      align: 'center',
      width: 160,
    },
    {
      title: '调课后时段',
      dataIndex: 'TKRQ',
      key: 'TKRQ',
      align: 'center',
      width: 160,
      render: (text: any, record: any) => {
        return (
          `${record?.KSSJ} ~ ${record?.JSSJ}`
        )
      },
    },

    {
      title: '状态',
      dataIndex: 'ZT',
      key: 'ZT',
      valueType: 'select',
      width: 80,
      align: 'center',
      valueEnum: {
        0: {
          text: '待审批',
          status: 'Processing',
        },
        1: {
          text: '已通过',
          status: 'Success',
        },
        2: {
          text: '已驳回',
          status: 'Error',
          disabled: true,
        },
      },
    },

    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      width: 100,
      render: (_, record: any) => {
        return <>
          {record.ZT === 0 ? (
            <>
              <a onClick={() => {
                setCurrent(record);
                setVisible(true);
              }}>
                审批
              </a>
              <Divider type="vertical" />
            </>
          ) : (
            ''
          )}

          <a onClick={() => {
            setIsModalVisible(true);
            setDatas(record);
          }}>查看</a>
        </>
      }
    },
  ];
  useEffect(() => {
    actionRef.current?.reload();
  }, [SPZT, curXNXQId])
  const showWXName = Datas?.SKJS?.XM === '未知' && Datas?.SKJS?.WechatUserId;
  const SPshowWXName = Datas?.SPJS?.XM === '未知' && Datas?.SPJS?.WechatUserId;
  return (
    <>
      <div className={styles.TopSearchs}>
        <span>
          所属学年学期：
          <Select
            value={curXNXQId}
            style={{ width: 200 }}
            onChange={(value: string) => {
              // 选择不同学期从新更新页面的数据
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

        <span style={{ marginLeft: 16 }}>
          状态：
          <Select
            style={{ width: 200 }}
            allowClear
            onChange={(value: any) => {
              setSPZT([value]);
            }}
          >
            <Option key='待审批' value={0}>
              待审批
            </Option>
            <Option key='已通过' value={1}>
              已通过
            </Option>
            <Option key='已驳回' value={2}>
              已驳回
            </Option>
          </Select>
        </span>
      </div>
      <div className={styles.leaveWrapper}>
        <ProTable<any>
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          request={async (param) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            if (curXNXQId) {
              const obj = {
                LX: [0],
                ZT: typeof SPZT?.[0] === 'undefined' ? [0, 1, 2] : SPZT,
                XXJBSJId: currentUser?.xxId,
                XNXQId: curXNXQId,
                page: param.current,
                pageSize: param.pageSize,
              };
              const res = await getAllKHJSTDK(obj);
              if (res.status === 'ok') {
                return {
                  data: res.data?.rows,
                  success: true,
                  total: res.data?.count,
                };
              }
            }
            return [];
          }}
          pagination={{
            showQuickJumper: true,
            pageSize: 10,
            defaultCurrent: 1,
          }}
          scroll={{ x: 1300 }}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
          search={false}
        />
      </div>
      <Modal
        title="调课审批"
        visible={visible}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setVisible(false);
          setCurrent(undefined);
        }}
        okText="确认"
        cancelText="取消"
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          form={form}
          initialValues={{ ZT: 1 }}
          onFinish={handleSubmit}
          layout="horizontal"
        >
          <Form.Item label="审批意见" name="ZT">
            <Radio.Group>
              <Radio value={1}>同意</Radio>
              <Radio value={2}>不同意</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="审批说明" name='BZ'>
            <TextArea rows={4} maxLength={100} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal title='查看详情'
        className={styles.modals}
        visible={isModalVisible}
        footer={null}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      >
        {
          Datas ? <div className={styles.TkDetails}>
            <p>申请教师：{showWXName ? <WWOpenDataCom type="userName" openid={Datas?.SKJS?.WechatUserId} /> : Datas?.SKJS?.XM}</p>
            <p>申请时间：{Datas?.createdAt}</p>
            <p>课程名称：{Datas?.KHBJSJ?.KHKCSJ?.KCMC}</p>
            <p>课程班名称：{Datas?.KHBJSJ?.BJMC}</p>
            <div className={styles.TkAfter}>
              <div>
                <p className={styles.title}>调课前</p>
                <p>日期：{Datas?.SKRQ}</p>
                <p>时段：{Datas?.XXSJPZ?.KSSJ.substring(0, 5)}~{Datas?.XXSJPZ?.JSSJ.substring(0, 5)}</p>
                <p>场地：{Datas?.SKFJ?.FJMC}</p>
              </div>
              <div>
                <p className={styles.title}>调课后</p>
                <p>日期：{Datas?.TKRQ}</p>
                <p>时段：{Datas?.KSSJ} ~ {Datas?.JSSJ}</p>
                <p>场地：{Datas?.TKFJ?.FJMC}</p>
              </div>
              </div>
              <div className={styles.Line} />
              {
                Datas?.ZT === 1 || Datas?.ZT === 2 ?  <div className={styles.reason}>
                <p className={styles.title}>审批人：{SPshowWXName ? <WWOpenDataCom type="userName" openid={Datas?.SPJS?.WechatUserId} /> : Datas?.SPJS?.XM}</p>
                <p>审批时间：{Datas?.updatedAt}</p>
                <p>审批意见：{Datas?.ZT === 1 ? '同意':'不同意'}</p>
                <p>审批原因：{Datas?.DKBZ || '-'}</p>
              </div>:<></>
              }

            </div> : <></>
        }
          </Modal>
    </>
      );
};
      export default Adjustment;
