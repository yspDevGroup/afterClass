import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { Select, message, Modal, Radio, Input, Form, InputNumber, Button, Spin } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { DownloadOutlined } from '@ant-design/icons';
import { getTableWidth } from '@/utils/utils';
import ShowName from '@/components/ShowName';
import SearchLayout from '@/components/Search/Layout';
import SemesterSelect from '@/components/Search/SemesterSelect';
import { exportTKJL, getAllKHXSTK, updateKHXSTK } from '@/services/after-class/khxstk';
import { getAllXQSJ } from '@/services/after-class/xqsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getGradesByCampus } from '@/services/after-class/njsj';
import { getAllBJSJ } from '@/services/after-class/bjsj';

type selectType = { label: string; value: string };
const { Option } = Select;
const { TextArea, Search } = Input;
// 退款
const ServiceRefund = () => {
  // 获取到当前学校的一些信息
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 学生姓名选择
  const [XM, setXM] = useState<string>();
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
  useEffect(() => {
    if (curXNXQId) {
      actionRef.current?.reload();
    }
  }, [curXNXQId, XM, campusId, NjId, BJId]);

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
      render: (_text: any, record: any) => {
        return record?.XSJBSJ?.XM;
      },
    },
    {
      title: '订单编号',
      dataIndex: 'TKBH',
      key: 'TKBH',
      align: 'center',
      ellipsis: true,
      width: 180,
    },

    {
      title: '退款金额',
      dataIndex: 'TKJE',
      key: 'TKJE',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (_, record) => {
        return record?.TKZT === 0 ? '' : record?.TKJE;
      },
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      ellipsis: true,
      render: (_, record) => {
        return record?.createdAt?.substring(0, 16);
      },
      width: 150,
    },
    {
      title: '审批人',
      dataIndex: 'JZGJBSJ',
      key: 'JZGJBSJ',
      align: 'center',
      ellipsis: true,
      width: 120,
      render: (_, record) => (
        <ShowName type="userName" openid={record?.JZGJBSJ?.WechatUserId} XM={record?.JZGJBSJ?.XM} />
      ),
    },
    {
      title: '审批时间',
      dataIndex: 'SPSJ',
      key: 'SPSJ',
      align: 'center',
      ellipsis: true,
      render: (_, record) => {
        return record?.SPSJ?.replace(/T/, ' ').substring(0, 16);
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
      title: '退款时间',
      dataIndex: 'TKSJ',
      key: 'TKSJ',
      align: 'center',
      ellipsis: true,
      render: (_, record) => {
        return record?.TKSJ?.substring(0, 16);
      },
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'TKZT',
      key: 'TKZT',
      align: 'center',
      valueEnum: {
        0: {
          text: '申请中',
          status: 'Processing',
        },
        1: {
          text: '审批通过',
          status: 'Processing',
        },
        2: {
          text: '已驳回',
          status: 'Error',
        },
        3: {
          text: '退款成功',
          status: 'Success',
        },
        4: {
          text: '退款失败',
          status: 'Error',
        },
      },
      ellipsis: true,
      width: 120,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 80,
      fixed: 'right',
      render: (_: any, record: any) =>
        record.TKZT === 0 ? (
          <a
            onClick={() => {
              setCurrent(record);
              setVisible(true);
              form.setFieldsValue({
                TKJE: record?.TKJE,
                TKZT: 1,
                BZ: '',
              });
            }}
          >
            确认
          </a>
        ) : (
          ''
        ),
    },
  ];
  const handleSubmit = async (params: any) => {
    const { TKJE, TKZT, BZ } = params;
    try {
      if (current.id) {
        const ids = { id: current.id };
        const body = {
          TKJE,
          TKZT,
          BZ,
          deviceIp: '117.36.118.42',
          SPSJ: new Date().toISOString(),
          JZGJBSJId: currentUser?.JSId || testTeacherId,
        };
        const res = await updateKHXSTK(ids, body);
        if (res.status === 'ok') {
          if (TKZT === 2) {
            message.success('退款申请已驳回');
          } else {
            message.success('退款审核通过，已发起退款');
          }
          setVisible(false);
          setCurrent(undefined);
          form.resetFields();
          actionRef.current?.reload();
        } else {
          message.error(res.message || '退款流程出现错误，请联系管理员或稍后重试。');
        }
      }
    } catch (err) {
      message.error('退款流程出现错误，请联系管理员或稍后重试。');
    }
  };
  const onExportClick = () => {
    setLoading(true);
    (async () => {
      const res = await exportTKJL({
        LX: 2,
        XXJBSJId: currentUser?.xxId,
        XNXQId: curXNXQId,
        page: 0,
        pageSize: 0,
      });
      if (res.status === 'ok') {
        window.location.href = res.data;
        setLoading(false);
      } else {
        message.error(res.message);
        setLoading(false);
      }
    })();
  };
  return (
    <>
      <div>
        <Spin spinning={loading}>
          <ProTable<any>
            actionRef={actionRef}
            columns={columns}
            rowKey="id"
            pagination={{
              showQuickJumper: true,
              pageSize: 10,
              defaultCurrent: 1,
            }}
            scroll={{ x: getTableWidth(columns) }}
            request={async () => {
              const resAll = await getAllKHXSTK({
                LX: 2,
                XXJBSJId: currentUser?.xxId,
                XNXQId: curXNXQId,
                XSXM: XM,
                BJSJId: BJId,
                NJSJId: NjId,
                XQSJId: campusId,
                page: 0,
                pageSize: 0,
              });
              if (resAll.status === 'ok') {
                return {
                  data: resAll?.data?.rows,
                  success: true,
                  total: resAll?.data?.count,
                };
              }
              return {
                data: [],
                success: false,
                total: 0,
              };
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
                    <label htmlFor="name">学生姓名：</label>
                    <Search
                      allowClear
                      onSearch={(value) => {
                        setXM(value);
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
            search={false}
            toolBarRender={() => [
              <Button icon={<DownloadOutlined />} type="primary" onClick={onExportClick}>
                导出
              </Button>,
            ]}
          />
        </Spin>
        <Modal
          title="退款确认"
          visible={visible}
          onOk={() => {
            form.submit();
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
            initialValues={{ TKZT: 1 }}
            onFinish={handleSubmit}
            layout="horizontal"
          >
            <Form.Item label="缴费金额" name="JFJE">
              {current?.XSFWBJ?.KHFWBJ?.FWFY}
            </Form.Item>
            <Form.Item label="退款金额" name="TKJE">
              <InputNumber
                formatter={(value) => `￥ ${value}`}
                parser={(value) => Number(value?.replace(/￥\s?/g, ''))}
                max={current?.XSFWBJ?.KHFWBJ?.FWFY}
              />
            </Form.Item>
            <Form.Item label="审核意见" name="TKZT">
              <Radio.Group>
                <Radio value={1}>同意</Radio>
                <Radio value={2}>不同意</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="退款说明" name="BZ">
              <TextArea rows={4} maxLength={100} />
            </Form.Item>
          </Form>
          <p style={{ marginTop: 16, fontSize: 12, color: '#999' }}>
            注：退款金额 = (服务费用/服务天数)*服务剩余天数
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如若退款金额有调整，请填写退款说明。
          </p>
        </Modal>
      </div>
    </>
  );
};
export default ServiceRefund;
