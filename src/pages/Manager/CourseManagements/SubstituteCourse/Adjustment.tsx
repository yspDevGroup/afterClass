import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { Form, Modal, Radio, Select, Input, message, Divider } from 'antd';
import styles from './index.less';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ShowName from '@/components/ShowName';
import { getAllKHJSTDK } from '@/services/after-class/khjstdk';
import { updateKHJSTDK } from '@/services/after-class/khjstdk';
import { getMainTeacher } from '@/services/after-class/khbjsj';
import { getClassDays } from '@/utils/TimeTable';
import { getTableWidth } from '@/utils/utils';
import SearchLayout from '@/components/Search/Layout';
import SemesterSelect from '@/components/Search/SemesterSelect';

const { TextArea } = Input;
const { Option } = Select;
const Adjustment = (props: { teacherData?: any }) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { teacherData } = props;
  const actionRef = useRef<ActionType>();
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<string>();
  // 审批状态
  const [SPZT, setSPZT] = useState<any[]>([0, 1, 2]);
  const [TKJS, setTKJS] = useState<string>();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Datas, setDatas] = useState<any>();
  // 数据
  const [dataSource, setDataSourse] = useState<any>();

  const getData = async () => {
    const obj = {
      LX: [0],
      ZT: typeof SPZT?.[0] === 'undefined' ? [0, 1, 2] : SPZT,
      XXJBSJId: currentUser?.xxId,
      XNXQId: curXNXQId,
      SKJSId: TKJS,
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
  };
  useEffect(() => {
    if (curXNXQId) {
      getData();
    }
  }, [SPZT, curXNXQId, TKJS]);

  const handleSubmit = async (param: any) => {
    const { ZT, BZ } = param;
    try {
      const res = await updateKHJSTDK(
        { id: current?.id },
        { ZT, XXJBSJId: currentUser.xxId, SPJSId: currentUser?.JSId || testTeacherId, DKBZ: BZ },
      );
      if (res.status === 'ok') {
        message.success('审批成功');
        setVisible(false);
        setCurrent(undefined);
        getData();
        // 处理主班调课后课时状态变更的情况，触发课时重新计算
        if (ZT === 1) {
          const result = await getMainTeacher({
            KHBJSJIds: [current.KHBJSJ.id],
            JZGJBSJId: current.SKJS.id,
            JSLX: '主教师',
          });
          if (result.status === 'ok') {
            const { data } = result;
            data?.forEach(async (ele: { KHBJSJId: string }) => {
              await getClassDays(ele.KHBJSJId, current.SKJS.id, currentUser?.xxId);
            });
          }
        }
      }
    } catch (err) {
      message.error('代课审批流程出现错误，请联系管理员或稍后重试。');
    }
  };
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
      render: (_text: any, record: any) => (
        <ShowName type="userName" openid={record?.SKJS?.WechatUserId} XM={record?.SKJS?.XM} />
      ),
    },
    {
      title: '课程名称',
      dataIndex: 'KHQJKCs',
      key: 'KHQJKCs',
      align: 'center',
      ellipsis: true,
      render: (text: any, record: any) => {
        return record?.KHBJSJ?.KHKCSJ?.KCMC;
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
        return record?.KHBJSJ?.BJMC;
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
        return record?.TKFJ?.FJMC;
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
      title: '调课后节次',
      dataIndex: 'TKJC',
      key: 'TKJC',
      align: 'center',
      width: 160,
      render: (text: any, record: any) => {
        return record?.TKJC.TITLE;
      },
    },
    {
      title: '调课后时段',
      dataIndex: 'TKRQ',
      key: 'TKRQ',
      align: 'center',
      width: 160,
      render: (text: any, record: any) => {
        return `${record?.TKJC.KSSJ.substring(0, 5)} ~ ${record?.TKJC.JSSJ.substring(0, 5)}`;
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
        return (
          <>
            {record.ZT === 0 ? (
              <>
                <a
                  onClick={() => {
                    setCurrent(record);
                    setVisible(true);
                  }}
                >
                  审批
                </a>
                <Divider type="vertical" />
              </>
            ) : (
              ''
            )}

            <a
              onClick={() => {
                setIsModalVisible(true);
                setDatas(record);
              }}
            >
              查看
            </a>
          </>
        );
      },
    },
  ];
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
          headerTitle={
            <SearchLayout>
              <SemesterSelect XXJBSJId={currentUser?.xxId} onChange={termChange} />
              <div>
                <label htmlFor="status">调课教师：</label>
                <Select
                  allowClear
                  showSearch
                  value={TKJS}
                  onChange={(value: string) => {
                    setTKJS(value);
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
                <label htmlFor="status">状态：</label>
                <Select
                  allowClear
                  onChange={(value: any) => {
                    setSPZT([value]);
                  }}
                >
                  <Option key="待审批" value={0}>
                    待审批
                  </Option>
                  <Option key="已通过" value={1}>
                    已通过
                  </Option>
                  <Option key="已驳回" value={2}>
                    已驳回
                  </Option>
                </Select>
              </div>
            </SearchLayout>
          }
          scroll={{ x: getTableWidth(columns) }}
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
          <Form.Item label="审批说明" name="BZ">
            <TextArea rows={4} maxLength={100} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="查看详情"
        className={styles.modals}
        visible={isModalVisible}
        footer={null}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      >
        {Datas ? (
          <div className={styles.TkDetails}>
            <p>
              申请教师：
              <ShowName type="userName" openid={Datas?.SKJS?.WechatUserId} XM={Datas?.SKJS?.XM} />
            </p>
            <p>申请时间：{Datas?.createdAt}</p>
            <p>申请原因：{Datas?.BZ}</p>
            <p>课程名称：{Datas?.KHBJSJ?.KHKCSJ?.KCMC}</p>
            <p>课程班名称：{Datas?.KHBJSJ?.BJMC}</p>
            <div className={styles.TkAfter}>
              <div>
                <p className={styles.title}>调课前</p>
                <p>日期：{Datas?.SKRQ}</p>
                <p>
                  时段：{Datas?.SKJC.KSSJ.substring(0, 5)} ~ {Datas?.SKJC.JSSJ.substring(0, 5)}
                </p>
                <p>场地：{Datas?.SKFJ?.FJMC}</p>
              </div>
              <div>
                <p className={styles.title}>调课后</p>
                <p>日期：{Datas?.TKRQ}</p>
                <p>
                  时段：{Datas?.TKJC.KSSJ.substring(0, 5)} ~ {Datas?.TKJC.JSSJ.substring(0, 5)}
                </p>
                <p>场地：{Datas?.TKFJ?.FJMC}</p>
              </div>
            </div>
            <div className={styles.Line} />
            {Datas?.ZT === 1 || Datas?.ZT === 2 ? (
              <div className={styles.reason}>
                <p className={styles.title}>
                  审批人：
                  <ShowName
                    type="userName"
                    openid={Datas?.SPJS?.WechatUserId}
                    XM={Datas?.SPJS?.XM}
                  />
                </p>
                <p>审批时间：{Datas?.updatedAt}</p>
                <p>审批意见：{Datas?.ZT === 1 ? '同意' : '不同意'}</p>
                <p>审批原因：{Datas?.DKBZ || '-'}</p>
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
      </Modal>
    </>
  );
};
export default Adjustment;
