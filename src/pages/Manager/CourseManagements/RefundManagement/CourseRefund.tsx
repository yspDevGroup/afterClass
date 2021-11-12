import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { Select, message, Modal, Radio, Input, Form, InputNumber, Button, Spin } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { queryXNXQList } from '@/services/local-services/xnxq';
import Style from './index.less';
import { getAllKHXSTK, updateKHXSTK, exportTKJL } from '@/services/after-class/khxstk';
import WWOpenDataCom from '@/components/WWOpenDataCom';
import { getAllClasses } from '@/services/after-class/khbjsj';
import { getAllCourses2 } from '@/services/after-class/jyjgsj';
import { DownloadOutlined } from '@ant-design/icons';

type selectType = { label: string; value: string };

const { Option } = Select;
const { TextArea } = Input;
// 退款
const CourseRefund = () => {
  // 获取到当前学校的一些信息
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  // 学年学期列表数据
  const [termList, setTermList] = useState<any>();
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>();

  // 课程选择框的数据
  const [kcmcData, setKcmcData] = useState<selectType[] | undefined>([]);
  const [kcmcValue, setKcmcValue] = useState<any>();
  // 班级名称选择框的数据
  const [bjmcData, setBjmcData] = useState<selectType[] | undefined>([]);
  const [bjmcValue, setBjmcValue] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);


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
          //  拿到默认值 发送请求
        }
      }
    })();
  }, []);



  //获取课程
  const getKCData = async () => {
    if (curXNXQId) {
      const params = {
        page: 0,
        pageSize: 0,
        XNXQId: curXNXQId,
        XXJBSJId: currentUser?.xxId,
        XZQHM: currentUser?.XZQHM
      };
      const khkcResl = await getAllCourses2(params);

      if (khkcResl.status === 'ok') {
        const KCMC = khkcResl.data.rows?.map((item: any) => ({
          label: item.KCMC,
          value: item.id,
        }));
        setKcmcData(KCMC);
      }
    }
  }


  /**
   * 获取课程班集数据
   */
  const getClassesData = async () => {
    if (kcmcValue && curXNXQId) {
      const bjmcResl = await getAllClasses({
        page: 0,
        pageSize: 0,
        KHKCSJId: kcmcValue,
        XNXQId: curXNXQId,
      });
      if (bjmcResl.status === 'ok') {
        const BJMC = bjmcResl.data.rows?.map((item: any) => ({
          label: item.BJMC,
          value: item.id,
        }));
        setBjmcData(BJMC);
      }
    }
  }

  useEffect(() => {
    actionRef.current?.reload();
    getKCData();
  }, [curXNXQId]);

  useEffect(() => {
    actionRef.current?.reload();
    setBjmcValue(undefined);
    getClassesData();
  }, [kcmcValue]);

  useEffect(() => {
    actionRef.current?.reload();
  }, [bjmcValue]);

  /// table表格数据
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
        return record?.XSJBSJ?.XM
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
      title: '行政班名称',
      dataIndex: 'XZBJSJ',
      key: 'XZBJSJ',
      align: 'center',
      width: 120,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return `${record?.XSJBSJ?.BJSJ?.NJSJ?.NJMC}${record?.XSJBSJ?.BJSJ?.BJ}`
      },
    },
    {
      title: '课程名称',
      dataIndex: 'KHBJSJ',
      key: 'KHBJSJ',
      align: 'center',
      render: (text: any, record: any) => {
        return record?.KHBJSJ?.KHKCSJ?.KCMC;
      },
      ellipsis: true,
      width: 150,
    },
    {
      title: '课程班名称',
      dataIndex: 'KHBJSJ',
      key: 'KHBJSJ',
      align: 'center',
      render: (text: any, record: any) => {
        return record?.KHBJSJ?.BJMC;
      },
      ellipsis: true,
      width: 120,
    },
    {
      title: '退款金额',
      dataIndex: 'TKJE',
      key: 'TKJE',
      align: 'center',
      ellipsis: true,
      width: 100,
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      ellipsis: true,
      render: (_, record) => {
        return record?.createdAt?.substring(0, 16)
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
      render: (_, record) => {
        const showWXName = record?.JZGJBSJ?.XM === '未知' && record?.JZGJBSJ?.WechatUserId;
        if (showWXName) {
          return <WWOpenDataCom type="userName" openid={record?.JZGJBSJ?.WechatUserId} />;
        }
        return record?.JZGJBSJ?.XM;
      },
    },
    {
      title: '审批时间',
      dataIndex: 'SPSJ',
      key: 'SPSJ',
      align: 'center',
      ellipsis: true,
      render: (_, record) => {
        return record?.SPSJ?.replace(/T/, ' ').substring(0, 16)
      },
      width: 150,
    },
    {
      title: '退款时间',
      dataIndex: 'TKSJ',
      key: 'TKSJ',
      align: 'center',
      ellipsis: true,
      render: (_, record) => {
        return record?.TKSJ?.substring(0, 16)
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
          <a onClick={() => {
            setCurrent(record);
            setVisible(true);
          }}>
            确认
          </a>
        ) : (
          ''
        ),
    },
  ];

  const handleSubmit = async (paramsItem: any) => {
    const { TKJE, TKZT, BZ } = paramsItem;
    if (TKJE === 0 || TKJE === 0.00) {
      message.warning('退款金额为0，无需发起退款');
    } else {
      try {
        if (current.id) {
          const params = { id: current.id };
          const body = { TKJE, TKZT, BZ, deviceIp: '117.36.118.42', SPSJ: new Date().toISOString() };
          const res = await updateKHXSTK(params, body);
          if (res.status === 'ok') {
            if (TKZT === 2) {
              message.success('退款申请已驳回');
            } else {
              message.success('退款审核通过，已发起退款');
            }
            setVisible(false);
            setCurrent(undefined);
            actionRef.current?.reload();
          } else {
            message.error(res.message || '退款流程出现错误，请联系管理员或稍后重试。');
          }
        }
      } catch (err) {
        message.error('退款流程出现错误，请联系管理员或稍后重试。');
      }
    }
  }

  const onExportClick = () => {
    setLoading(true);
    (async () => {
      const res = await exportTKJL({
        LX: 0,
        XXJBSJId: currentUser?.xxId,
        XNXQId: curXNXQId,
        KHBJSJId: bjmcValue,
        // KHKCSJId: kcmcValue,
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
      <div className={Style.TopSearchs}>
        <Form layout='inline' labelCol={{ span: 8 }}>
          <Form.Item label=' 所属学年学期：' style={{ padding: '0 0 24px' }}>
            <Select
              value={curXNXQId}
              style={{ width: 160 }}
              onChange={(value: string) => {
                // 更新多选框的值
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
          </Form.Item>
          <Form.Item label=' 课程名称:' style={{ padding: '0 0 24px' }}>
            <Select
              style={{ width: 160 }}
              value={kcmcValue}
              allowClear
              placeholder="请选择"
              onChange={(value) => {
                setKcmcValue(value);
              }}
            >
              {kcmcData?.map((item: selectType) => {
                if (item.value) {
                  return (
                    <Option value={item.value} key={item.value}>
                      {item.label}
                    </Option>
                  );
                }
                return '';
              })}
            </Select>
          </Form.Item>
          <Form.Item label=' 课程班名称:' style={{ padding: '0 0 24px' }}>
            <Select
              style={{ width: 160 }}
              value={bjmcValue}
              allowClear
              placeholder="请选择"
              onChange={(value) => setBjmcValue(value)}
            >
              {bjmcData?.map((item: selectType) => {
                return (
                  <Option value={item.value} key={item.value}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item style={{ flex: 'auto' }}>
            <Button style={{ float: 'right' }} icon={<DownloadOutlined />} type="primary" onClick={onExportClick}>
              导出
            </Button>
          </Form.Item>
        </Form>
      </div>
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
            scroll={{ x: 1500 }}
            request={async () => {
              const resAll = await getAllKHXSTK({
                LX: 0,
                XXJBSJId: currentUser?.xxId,
                XNXQId: curXNXQId,
                KHKCSJId: kcmcValue,
                KHBJSJId: bjmcValue,
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
            options={{
              setting: false,
              fullScreen: false,
              density: false,
              reload: false,
            }}
            search={false}
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
            setCurrent(undefined);
          }}
          okText="确认"
          cancelText="取消"
        >
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 15 }}
            form={form}
            initialValues={{ TKZT: 1, TKJE: current?.TKJE }}
            onFinish={handleSubmit}
            layout="horizontal"
          >
            <Form.Item label="退款金额" name='TKJE'>
              <InputNumber
                min={Number(0)}
                formatter={value => `￥ ${value}`}
                parser={value => Number(value?.replace(/\￥\s?/g, ''))}
                onChange={(value) => {
                  if (value === 0) {
                    message.warning('退款金额为0，无需发起退款');
                  }
                }}
              />
            </Form.Item>
            <Form.Item label="审核意见" name="TKZT">
              <Radio.Group>
                <Radio value={1}>同意</Radio>
                <Radio value={2}>不同意</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="退款说明" name='BZ'>
              <TextArea rows={4} maxLength={100} />
            </Form.Item>
          </Form>
          <p style={{ marginTop: 16, fontSize: 12, color: '#999' }}>
            注：退款金额 = (课程费用/课程课时总数)*退课课时数
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如若退款金额有调整，请填写退款说明。</p>
        </Modal>
      </div>
    </>
  );
};
export default CourseRefund;
