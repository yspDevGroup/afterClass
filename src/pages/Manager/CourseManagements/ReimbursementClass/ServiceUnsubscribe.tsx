import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { Select, message, Modal, Radio, Input, Form } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { getKHTKSJ, updateKHTKSJ } from '@/services/after-class/khtksj';
import { createKHXSTK } from '@/services/after-class/khxstk';
import ShowName from '@/components/ShowName';
import { getKHZZFW } from '@/services/after-class/khzzfw';
import { getKHXXZZFW } from '@/services/after-class/khxxzzfw';
import { getTableWidth } from '@/utils/utils';
import SearchLayout from '@/components/Search/Layout';
import SemesterSelect from '@/components/Search/SemesterSelect';
import { JSInforMation } from '@/components/JSInforMation';

const { Option } = Select;
const { TextArea, Search } = Input;

const ServiceUnsubscribe = () => {
  // 获取到当前学校的一些信息
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  const [dataSource, setDataSource] = useState<API.KHTKSJ[] | undefined>();
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 学生姓名选择
  const [name, setName] = useState<string>();
  const [fwlxList, setFwlxList] = useState<API.KHZZFW[]>();
  const [FWLX, setFWLX] = useState<string>();
  const [FWLXId, setFWLXId] = useState<string>();
  const [fwList, setFwList] = useState<API.KHXXZZFW[]>();
  const [FWMC, setFWMC] = useState<string>();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>();
  // 学年学期筛选
  const termChange = (val: string) => {
    setCurXNXQId(val);
  };
  const getData = async () => {
    const resAll = await getKHTKSJ({
      XXJBSJId: currentUser?.xxId,
      XNXQId: curXNXQId,
      XSXM: name,
      KHFWMC: FWMC,
      KHFWLX: FWLX,
      LX: 1,
    });
    if (resAll.status === 'ok') {
      setDataSource(resAll?.data?.rows);
    } else {
      setDataSource([]);
    }
  };
  useEffect(() => {
    // 获取学年学期数据的获取
    (async () => {
      // 服务类别的获取
      const result = await getKHZZFW({
        XXJBSJId: currentUser?.xxId,
        page: 0,
        pageSize: 0,
      });
      if (result.status === 'ok') {
        setFwlxList(result?.data?.rows);
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if (curXNXQId) {
        const data = {
          XXJBSJId: currentUser?.xxId,
          XNXQId: curXNXQId || '',
          KHZZFWId: FWLXId,
          FWZT: 1,
          page: 0,
          pageSize: 0,
        };
        const res = await getKHXXZZFW(data);
        if (res.status === 'ok') {
          setFwList(res?.data?.rows);
        }
      }
    })();
  }, [curXNXQId, FWLXId]);
  useEffect(() => {
    getData();
  }, [curXNXQId, name, FWMC, FWLX]);
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
      render: (_text: any, record: any) => (
        <ShowName type="userName" openid={record?.XSJBSJ?.WechatUserId} XM={record?.XSJBSJ?.XM} />
      ),
    },
    {
      title: '行政班名称',
      dataIndex: 'XZBJSJ',
      key: 'XZBJSJ',
      align: 'center',
      width: 120,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return `${record?.XSJBSJ?.BJSJ?.NJSJ?.NJMC}${record?.XSJBSJ?.BJSJ?.BJ}`;
      },
    },
    {
      title: '服务名称',
      dataIndex: 'KHXXZZFW',
      key: 'KHXXZZFW',
      align: 'center',
      render: (text: any) => {
        return text?.FWMC;
      },
      width: 150,
    },
    {
      title: '服务类别',
      dataIndex: 'KHXXZZFW',
      key: 'KHXXZZFW',
      align: 'center',
      render: (text: any) => {
        return text?.KHZZFW?.FWMC;
      },
      width: 150,
    },
    {
      title: '服务开始日期',
      dataIndex: 'KSRQ',
      key: 'KSRQ',
      align: 'center',
      render: (_, record) => {
        return record?.KHXXZZFW?.KSRQ;
      },
      width: 150,
    },
    {
      title: '服务结束日期',
      dataIndex: 'JSRQ',
      key: 'JSRQ',
      align: 'center',
      render: (_, record) => {
        return record?.KHXXZZFW?.JSRQ;
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
        if (record?.ZT !== 0) {
          return record?.updatedAt?.replace(/T/, ' ').substring(0, 16);
        }
        return '';
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
      title: '退订状态',
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
      width: 120,
    },
    {
      title: '退款状态',
      dataIndex: 'TKZT',
      key: 'TKZT',
      align: 'center',
      ellipsis: true,
      width: 120,
      render: (_, record) => {
        let TKZT: any = '';
        switch (record?.KHXSTKs?.[0]?.TKZT) {
          case '0':
            TKZT = '申请中';
            break;
          case '1':
            TKZT = '已通过';
            break;
          case '2':
            TKZT = '已驳回';
            break;
          case '3':
            TKZT = '退款成功';
            break;

          default:
            TKZT = '-';
            break;
        }
        return TKZT;
      },
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
              if (JSInforMation(currentUser)) {
                setCurrent(record);
                setVisible(true);
              }
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
    let DKFY: any;
    const a1 = new Date(current?.KHXXZZFW?.KSRQ).getTime();
    const a2 = new Date(current?.KHXXZZFW?.JSRQ).getTime();
    const a3 = new Date(current?.createdAt).getTime();
    if (a3 < a1) {
      DKFY = Number(current?.KHXXZZFW?.FY);
    } else {
      const days = Math.ceil((a3 - a1) / (1000 * 60 * 60 * 24));
      const FWTS = Math.ceil((a2 - a1) / (1000 * 60 * 60 * 24));
      DKFY = (Number(current?.KHXXZZFW?.FY) - (days / FWTS) * current?.KHXXZZFW?.FY).toFixed(2);
    }
    try {
      if (current.id) {
        const ids = { id: current.id };
        const body = { ZT, BZ, JZGJBSJId: currentUser?.JSId || testTeacherId };
        const res = await updateKHTKSJ(ids, body);
        if (res.status === 'ok') {
          if (ZT === 2) {
            message.success('服务退订申请已驳回');
          } else if (current?.KHBJSJ?.FY !== 0) {
            if (Number(DKFY) <= 0) {
              message.success('服务退订成功,退款金额为0元，无需退款');
            } else {
              const result = await createKHXSTK({
                KHTKSJId: current?.id,
                KHXXZZFWId: current?.KHXXZZFW?.id,
                /** 退款金额 */
                TKJE: Number(DKFY),
                /** 退款状态 */
                TKZT: 0,
                /** 学生ID */
                XSJBSJId: current?.XSJBSJId,
                /** 学校ID */
                XXJBSJId: currentUser?.xxId,
                JZGJBSJId: currentUser?.JSId || testTeacherId,
                XNXQId: curXNXQId,
              });
              if (result.status === 'ok') {
                message.success('服务退订成功,已自动申请退款流程');
              } else {
                message.warning(`服务退订成功,退款流程由于${result.message}申请失败`);
              }
            }
          } else {
            message.success('服务退订成功');
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
                  <label htmlFor="type">服务类别：</label>
                  <Select
                    style={{ width: 160 }}
                    allowClear
                    value={FWLX}
                    onChange={(value: string, option: any) => {
                      setFWLX(value);
                      setFWLXId(option?.key);
                      setFWMC(undefined);
                    }}
                  >
                    {fwlxList?.map((item: API.KHZZFW) => {
                      return (
                        <Option key={item.id} value={item.FWMC!}>
                          {item.FWMC}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
                <div>
                  <label htmlFor="name">服务名称：</label>
                  <Select
                    value={FWMC}
                    style={{ width: 160 }}
                    allowClear
                    onChange={(value: string) => {
                      setFWMC(value);
                    }}
                  >
                    {fwList?.map((item: API.KHXXZZFW) => {
                      return (
                        <Option key={item.FWMC} value={item.FWMC!}>
                          {item.FWMC}
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
          }}
          onCancel={() => {
            setVisible(false);
            setCurrent(undefined);
            form.resetFields();
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
export default ServiceUnsubscribe;
