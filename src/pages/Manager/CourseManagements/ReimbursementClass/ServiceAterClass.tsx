import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { Select, message, Modal, Radio, Input, Form } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ShowName from '@/components/ShowName';
import { getTableWidth } from '@/utils/utils';
import SearchLayout from '@/components/Search/Layout';
import SemesterSelect from '@/components/Search/SemesterSelect';
import { getKHTKSJ, updateKHTKSJ } from '@/services/after-class/khtksj';
import { getAllBJSJ } from '@/services/after-class/bjsj';
import { createKHXSTK } from '@/services/after-class/khxstk';
import { getGradesByCampus } from '@/services/after-class/njsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getAllXQSJ } from '@/services/after-class/xqsj';
import { getAllKHXSDD } from '@/services/after-class/khxsdd';

type selectType = { label: string; value: string };

const { Option } = Select;
const { TextArea, Search } = Input;

const ServiceAterClass = () => {
  // 获取到当前学校的一些信息
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  const [dataSource, setDataSource] = useState<API.KHTKSJ[] | undefined>();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>();
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 学生姓名选择
  const [name, setName] = useState<string>();
  // 校区
  const [campusId, setCampusId] = useState<string>();
  const [campusData, setCampusData] = useState<any[]>();
  const [NjId, setNjId] = useState<any>();
  const [NjData, setNjData] = useState<any>();
  const [BJId, setBJId] = useState<string | undefined>(undefined);
  const [bjData, setBJData] = useState<selectType[] | undefined>([]);
  // 学年学期筛选
  const termChange = (val: string) => {
    setCurXNXQId(val);
  };
  const getCampusData = async () => {
    const res = await getAllXQSJ({
      XXJBSJId: currentUser?.xxId,
    });
    if (res?.status === 'ok') {
      const arr = res?.data?.map((item) => {
        return {
          label: item.XQMC,
          value: item.id,
        };
      });
      if (arr?.length) {
        let id = arr?.find((item: any) => item.label === '本校')?.value;
        if (!id) {
          id = arr[0].value;
        }
        setCampusId(id);
      }
      setCampusData(arr);
    }
  };

  useEffect(() => {
    (async () => {
      const result = await queryXNXQList(currentUser?.xxId);
      if (result?.current) {
        setCurXNXQId(result?.current?.id);
      }
    })();
    getCampusData();
  }, []);

  const getNJSJ = async () => {
    if (campusId) {
      const res = await getGradesByCampus({
        XQSJId: campusId,
      });
      if (res.status === 'ok') {
        setNjData(res.data);
      }
    }
  };
  useEffect(() => {
    if (campusId) {
      getNJSJ();
      setBJId(undefined);
      setNjId(undefined);
    }
  }, [campusId]);
  const onCampusChange = (value: any) => {
    setCampusId(value);
  };
  const onBjChange = async (value: any) => {
    setBJId(value);
  };
  const onNjChange = async (value: any) => {
    setNjId(value);
  };

  const getBJSJ = async () => {
    const res = await getAllBJSJ({ XQSJId: campusId, njId: NjId, page: 0, pageSize: 0 });
    if (res.status === 'ok') {
      const data = res.data?.rows?.map((item: any) => {
        return { label: item.BJ, value: item.id };
      });
      setBJData(data);
    }
  };

  useEffect(() => {
    if (NjId) {
      setBJId(undefined);
      getBJSJ();
    }
  }, [NjId, campusId]);
  const getData = async () => {
    const resAll = await getKHTKSJ({
      XXJBSJId: currentUser?.xxId,
      XNXQId: curXNXQId,
      XSXM: name,
      BJSJId: BJId,
      NJSJId: NjId,
      XQSJId: campusId,
      LX: 2,
    });
    if (resAll.status === 'ok') {
      setDataSource(resAll?.data?.rows);
    } else {
      setDataSource([]);
    }
  };
  useEffect(() => {
    getData();
  }, [curXNXQId, campusId, NjId, BJId, name]);
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
      title: '学生姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
      width: 100,
      fixed: 'left',
      render: (_text: any, record: any) => (
        <ShowName type="userName" openid={record?.XSJBSJ?.WechatUserId} XM={record?.XSJBSJ?.XM} />
      ),
    },
    {
      title: '课后服务名称',
      dataIndex: 'XSJBSJ',
      key: 'XSJBSJ',
      align: 'center',
      width: 200,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return `${record?.XSFWBJ?.KHFWBJ?.FWMC}`;
      },
    },
    {
      title: '行政班名称',
      dataIndex: 'XSJBSJ',
      key: 'XSJBSJ',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return `${record?.XSFWBJ?.KHFWBJ?.BJSJ?.NJSJ?.NJMC}${record?.XSFWBJ?.KHFWBJ?.BJSJ?.BJ}`;
      },
    },
    {
      title: '服务开始日期',
      dataIndex: 'KSRQ',
      key: 'KSRQ',
      align: 'center',
      render: (_, record) => {
        return record?.XSFWBJ?.KHFWSJPZ?.KSRQ;
      },
      width: 150,
    },
    {
      title: '服务结束日期',
      dataIndex: 'JSRQ',
      key: 'JSRQ',
      align: 'center',
      render: (_, record) => {
        return record?.XSFWBJ?.KHFWSJPZ?.JSRQ;
      },
      width: 150,
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      render: (_, record) => {
        return record?.createdAt?.substring(0, 16);
      },
      width: 150,
    },
    {
      title: '审批人',
      dataIndex: 'SPR',
      key: 'SPR',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (_, record) => (
        <ShowName type="userName" openid={record?.JZGJBSJ?.WechatUserId} XM={record?.JZGJBSJ?.XM} />
      ),
    },
    {
      title: '审批时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      align: 'center',
      ellipsis: true,
      render: (_, record) => {
        return record?.updatedAt?.replace(/T/, ' ').substring(0, 16);
      },
      width: 150,
    },
    {
      title: '审批说明',
      dataIndex: 'BZ',
      key: 'BZ',
      align: 'center',
      ellipsis: true,
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'ZT',
      key: 'ZT',
      align: 'center',
      filters: true,
      onFilter: true,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '申请中',
          status: 'Processing',
        },
        1: {
          text: '已完成',
          status: 'Success',
        },
        2: {
          text: '已驳回',
          status: 'Error',
        },
      },
      width: 90,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      render: (_: any, record: any) => {
        return record.ZT === 0 ? (
          <a
            onClick={() => {
              setCurrent(record);
              setVisible(true);
            }}
          >
            审批
          </a>
        ) : (
          ''
        );
      },
      width: 90,
    },
  ];
  const handleSubmit = async (param: any) => {
    const { ZT, BZ } = param;
    try {
      if (current.id) {
        const ids = { id: current.id };
        const body = { ZT, BZ, JZGJBSJId: currentUser?.JSId || testTeacherId };
        const res = await updateKHTKSJ(ids, body);
        if (res.status === 'ok') {
          if (ZT === 2) {
            message.success('服务退订申请已驳回');
          } else {
            const response = await getAllKHXSDD({
              XXJBSJId: currentUser?.xxId,
              XSFWBJId: current?.XSFWBJ?.id,
              XSJBSJId: current?.XSJBSJId,
              DDZT: ['已付款'],
              DDLX: 2,
            });
            if (response.status === 'ok' && response.data) {
              if (response.data?.length) {
                const result = await createKHXSTK({
                  KHTKSJId: current?.id,
                  KHXXZZFWId: current?.KHXXZZFW?.id,
                  /** 退款金额 */
                  // TKJE: 0,
                  /** 退款状态 */
                  TKZT: 0,
                  /** 学生ID */
                  XSJBSJId: current?.XSJBSJId,
                  /** 学校ID */
                  XXJBSJId: currentUser?.xxId,
                  JZGJBSJId: currentUser?.JSId || testTeacherId,
                });
                if (result.status === 'ok') {
                  message.success('服务退订成功,已自动申请退款流程');
                } else if (result.message === '零元及以下订单无需退款!') {
                  message.success('服务退订成功');
                } else {
                  message.warning(`服务退订成功,退款流程由于${result.message}申请失败`);
                }
              } else {
                message.success('服务退订成功');
              }
            }
          }
          setVisible(false);
          setCurrent(undefined);
          form.resetFields();
          getData();
        } else {
          message.error(res.message || '服务退订流程出现错误，请联系管理员或稍后重试。');
        }
      }
    } catch (err) {
      message.error('服务退订流程出现错误，请联系管理员或稍后重试。');
    }
  };
  return (
    <>
      <div>
        <ProTable<any>
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          dataSource={dataSource}
          pagination={{
            showQuickJumper: true,
            pageSize: 10,
            defaultCurrent: 1,
          }}
          scroll={{ x: getTableWidth(columns) }}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
          headerTitle={
            <>
              <SearchLayout>
                <SemesterSelect XXJBSJId={currentUser?.xxId} onChange={termChange} />
                <div>
                  <label htmlFor="grade">校区名称：</label>
                  <Select value={campusId} placeholder="请选择" onChange={onCampusChange}>
                    {campusData?.map((item: any) => {
                      return <Option value={item.value}>{item.label}</Option>;
                    })}
                  </Select>
                </div>
                <div>
                  <label htmlFor="grade">年级名称：</label>
                  <Select value={NjId} allowClear placeholder="请选择" onChange={onNjChange}>
                    {NjData?.map((item: any) => {
                      return <Option value={item.id}>{`${item.XD}${item.NJMC}`}</Option>;
                    })}
                  </Select>
                </div>
                <div>
                  <label htmlFor="kcly">班级名称：</label>
                  <Select value={BJId} allowClear placeholder="班级名称" onChange={onBjChange}>
                    {bjData?.map((item: any) => {
                      return (
                        <Option value={item.value} key={item.value}>
                          {item.label}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
                <div>
                  <label htmlFor="student">学生名称：</label>
                  <Search
                    allowClear
                    style={{ width: 160 }}
                    onSearch={(val) => {
                      setName(val);
                    }}
                  />
                </div>
              </SearchLayout>
            </>
          }
          search={false}
        />
        <Modal
          title="服务退订审核"
          visible={visible}
          onOk={() => {
            form.submit();
            form.resetFields();
          }}
          onCancel={() => {
            setVisible(false);
            form.resetFields();
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
            <Form.Item label="审核意见" name="ZT">
              <Radio.Group>
                <Radio value={1}>同意</Radio>
                <Radio value={2}>不同意</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="审核说明" name="BZ">
              <TextArea rows={4} maxLength={100} />
            </Form.Item>
          </Form>
          <p style={{ marginTop: 16, fontSize: 12, color: '#999' }}>
            注：同意退订后，如涉及退款，系统将自动发起退款申请。
          </p>
        </Modal>
      </div>
    </>
  );
};
export default ServiceAterClass;
