import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { Form, Modal, Radio, Select, Input, message, Divider } from 'antd';
import styles from './index.less';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import WWOpenDataCom from '@/components/WWOpenDataCom';
import { getAllKHJSTDK } from '@/services/after-class/khjstdk';
import { updateKHJSTDK } from '@/services/after-class/khjstdk';
import { getTableWidth } from '@/utils/utils';
import SearchLayout from '@/components/Search/Layout';
import SemesterSelect from '@/components/Search/SemesterSelect';

const { TextArea } = Input;
const { Option } = Select;
const SubstituteFor = (props: { teacherData?: any }) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { teacherData } = props;
  const actionRef = useRef<ActionType>();
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<string>();
  // 审批状态
  const [SPZT, setSPZT] = useState<any[]>([0, 1, 2, 4, 5]);
  const [SQJS, setSQJS] = useState<string>();
  const [DKJS, setDKJS] = useState<string>();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Datas, setDatas] = useState<any>();
  // 数据
  const [dataSource, setDataSourse] = useState<any>();

  const getData = async () => {
    const obj = {
      LX: [1],
      ZT: typeof SPZT?.[0] === 'undefined' ? [0, 1, 2, 4, 5] : SPZT,
      XXJBSJId: currentUser?.xxId,
      XNXQId: curXNXQId,
      DKJSId: DKJS,
      SKJSId: SQJS,
      page: 0,
      pageSize: 0,
    };
    const resAll = await getAllKHJSTDK(obj);
    if (resAll.status === 'ok') {
      setDataSourse(resAll?.data?.rows);
    } else {
      setDataSourse([]);
    }
  };
  const termChange = (val: string) => {
    setCurXNXQId(val);
  }
  useEffect(() => {
    if (curXNXQId) {
      getData();
    }
  }, [SPZT, SQJS, DKJS, curXNXQId]);
  const handleSubmit = async (param: any) => {
    const { ZT, BZ } = param;
    try {
      const res = await updateKHJSTDK({ id: current?.id },
        {
          ZT,
          SPJSId: currentUser?.JSId || testTeacherId,
          DKBZ: BZ
        });
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
      title: '代课教师',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
      width: 80,
      render: (_text: any, record: any) => {
        const showWXName = record?.DKJS?.XM === '未知' && record?.DKJS?.WechatUserId;
        if (showWXName) {
          return <WWOpenDataCom type="userName" openid={record?.DKJS?.WechatUserId} />;
        }
        return record?.DKJS?.XM;
      },
    },
    {
      title: '代课教师意见',
      dataIndex: 'YJ',
      key: 'YJ',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (text: any, record: any) => {
        return <>{record.ZT === 4 || record.ZT === 1 ? '同意' : <>{record.ZT === 5 ? '不同意' : '-'}</>}</>
      }
    },
    {
      title: '审批时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      width: 160,
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
          text: '审批中',
          status: 'Default',
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
        4: { text: '待审批', status: 'Processing' },
        5: {
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
          {record.ZT === 4 ? (
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
  const DkshowWXName = Datas?.DKJS?.XM === '未知' && Datas?.DKJS?.WechatUserId;
  const showWXName = Datas?.SKJS?.XM === '未知' && Datas?.SKJS?.WechatUserId;
  const SPshowWXName = Datas?.SPJS?.XM === '未知' && Datas?.SPJS?.WechatUserId;
  return (
    <>
      <div className={styles.leaveWrapper}>
        <ProTable<any>
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          pagination={{
            showQuickJumper: true,
            pageSize: 10,
            defaultCurrent: 1,
          }}
          dataSource={dataSource}
          scroll={{ x: getTableWidth(columns) }}
          headerTitle={
            <SearchLayout>
              <SemesterSelect XXJBSJId={currentUser?.xxId} onChange={termChange} />
              <div>
                <label htmlFor='status'>申请教师：</label>
                <Select
                  allowClear
                  showSearch
                  value={SQJS}
                  onChange={(value: string) => {
                    setSQJS(value);
                  }}
                  filterOption={(input, option) =>
                    option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
                  }
                >
                  {teacherData?.map((item: any) => {
                    return (
                      <Option key={item.value} value={item.value}>
                        {item.label}
                      </Option>
                    );
                  })}
                </Select>
              </div>
              <div>
                <label htmlFor='status'>代课教师：</label>
                <Select
                  allowClear
                  showSearch
                  value={DKJS}
                  onChange={(value: string) => {
                    setDKJS(value);
                  }}
                  filterOption={(input, option) =>
                    option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
                  }
                >
                  {teacherData?.map((item: any) => {
                    return (
                      <Option key={item.value} value={item.value}>
                        {item.label}
                      </Option>
                    );
                  })}
                </Select>
              </div>
              <div>
                <label htmlFor='status'>状态：</label>
                <Select
                  allowClear
                  onChange={(value: any) => {
                    if (value === 2) {
                      setSPZT([2, 5])
                    } else {
                      setSPZT([value]);
                    }

                  }}
                >
                  <Option key='审批中' value={0}>
                    审批中
                  </Option>
                  <Option key='待审批' value={4}>
                    待审批
                  </Option>
                  <Option key='已通过' value={1}>
                    已通过
                  </Option>
                  <Option key='已驳回' value={2}>
                    已驳回
                  </Option>
                </Select>
              </div>
            </SearchLayout>
          }
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
        title="代课审批"
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
          Datas ? <div className={styles.DkDetails}>
            <p>课程名称：{Datas?.KHBJSJ?.KHKCSJ?.KCMC}</p>
            <p>课程班名称：{Datas?.KHBJSJ?.BJMC}</p>
            <p>代课日期：{Datas?.SKRQ}</p>
            <p>代课时段：{Datas?.XXSJPZ?.KSSJ.substring(0, 5)}~{Datas?.XXSJPZ?.JSSJ.substring(0, 5)}</p>
            <p>代课场地：{Datas?.SKFJ?.FJMC}</p>
            <div className={styles.TkAfter}>
              <div>
                <p className={styles.title}>代课前</p>
                <p>申请教师：{showWXName ? <WWOpenDataCom type="userName" openid={Datas?.SKJS?.WechatUserId} /> : Datas?.SKJS?.XM}</p>
                <p>申请时间：{Datas?.createdAt}</p>
                <p>申请原因：{Datas?.BZ}</p>
              </div>
              <div>
                <p className={styles.title}>代课后</p>
                <p>代课教师： {DkshowWXName ? <WWOpenDataCom type="userName" openid={Datas?.DKJS?.WechatUserId} /> : Datas?.DKJS?.XM}</p>
                <p>审批时间：{Datas?.DKSPSJ || '-'}</p>
                <p>代课意见：{Datas.ZT === 4 || Datas.ZT === 1 || Datas.ZT === 2 ? '同意' : <>{Datas.ZT === 5 ? '不同意' : '-'}</>}</p>
                {
                  Datas.ZT === 4 || Datas.ZT === 1 || Datas.ZT === 2 ? <></> : <p>代课原因：{Datas?.ZT === 5 ? Datas?.DKBZ : '-'}</p>
                }
              </div>
            </div>
            <div className={styles.Line} />
            {
              Datas?.ZT === 1 || Datas?.ZT === 2 ? <div className={styles.reason}>
                <p className={styles.title}>审批人：{SPshowWXName ? <WWOpenDataCom type="userName" openid={Datas?.SPJS?.WechatUserId} /> : Datas?.SPJS?.XM}</p>
                <p>审批时间：{Datas?.updatedAt}</p>
                <p>审批意见：{Datas?.ZT === 1 ? '同意' : '不同意'}</p>
                <p>审批原因：{Datas?.DKBZ || '-'}</p>
              </div> : <></>
            }

          </div> : <></>
        }
      </Modal>
    </>
  );
};
export default SubstituteFor;
