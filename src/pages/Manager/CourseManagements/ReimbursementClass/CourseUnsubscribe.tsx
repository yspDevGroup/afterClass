/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { message, Modal, Radio, Input, Form, Space, Table, Tooltip } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { getKHTKSJ, updateKHTKSJ } from '@/services/after-class/khtksj';
import { createKHXSTK } from '@/services/after-class/khxstk';
import WWOpenDataCom from '@/components/WWOpenDataCom';
import { getTableWidth } from '@/utils/utils';
import SearchLayout from '@/components/Search/Layout';
import SemesterSelect from '@/components/Search/SemesterSelect';
import CourseSelect from '@/components/Search/CourseSelect';
import ClassSelect from '@/components/Search/ClassSelect';

const { TextArea, Search } = Input;
const CourseUnsubscribe = () => {
  // 获取到当前学校的一些信息
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  const [dataSource, setDataSource] = useState<API.KHTKSJ[] | undefined>();
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 当前课程
  const [curKCId, setCurKCId] = useState<any>();
  // 当前课程班
  const [curBJId, setBJId] = useState<any>();
  // 学生姓名选择
  const [name, setName] = useState<string>();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>();
  // 批量审批
  const [Examine, setExamine] = useState<any>();
  // 学年学期筛选
  const termChange = (val: string) => {
    setCurXNXQId(val);
  };
  // 课程筛选
  const courseChange = (val: string, data?: any) => {
    setCurKCId(val);
  };
  // 课程班筛选
  const classChange = (val: string, data?: any) => {
    setBJId(val);
  };
  const getData = async () => {
    const resAll = await getKHTKSJ({
      XXJBSJId: currentUser?.xxId,
      XNXQId: curXNXQId,
      KHBJSJId: curBJId,
      KHKCSJId: curKCId,
      XSXM: name,
      LX: 0,
    });
    if (resAll.status === 'ok') {
      setDataSource(resAll?.data?.rows);
    } else {
      setDataSource([]);
    }
  };
  useEffect(() => {
    getData();
  }, [curXNXQId, curKCId, curBJId, name]);
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
      title: '课程名称',
      dataIndex: 'KHBJSJ',
      key: 'KHBJSJ',
      align: 'center',
      render: (text: any) => {
        return text?.KHKCSJ?.KCMC;
      },
      width: 150,
    },
    {
      title: '课程班名称',
      dataIndex: 'KHBJSJ',
      key: 'KHBJSJ',
      align: 'center',
      render: (text: any) => {
        return text?.BJMC;
      },
      width: 150,
    },
    {
      title: '退课总课时',
      dataIndex: 'KSS',
      key: 'KSS',
      align: 'center',
      width: 100,
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
          <>
            {Examine && Examine?.length ? (
              <span style={{ color: '#666' }}>审批</span>
            ) : (
              <a
                onClick={() => {
                  setCurrent(record);
                  setVisible(true);
                }}
              >
                审批
              </a>
            )}
          </>
        ) : (
          ''
        );
      },
      width: 90,
    },
  ];

  const updateTK = async (value: any, ZT: number, BZ: string) => {
    const ids = { id: value.id };
    const body = { ZT, BZ, JZGJBSJId: currentUser.JSId };
    const res = await updateKHTKSJ(ids, body);
    if (res.status === 'ok') {
      if (ZT === 2) {
        return '退课申请已驳回';
      }
      if (value?.KHBJSJ?.FY !== 0) {
        const money = Number(((value?.KHBJSJ?.FY / value?.KHBJSJ?.KSS) * value?.KSS).toFixed(2));
        if (money !== 0.0) {
          const result = await createKHXSTK({
            KHTKSJId: value?.id,
            /** 退款金额 */
            TKJE: money,
            /** 退款状态 */
            TKZT: 0,
            /** 学生ID */
            XSJBSJId: value?.XSJBSJId,
            /** 班级ID */
            KHBJSJId: value?.KHBJSJId,
            /** 学校ID */
            XXJBSJId: currentUser?.xxId,
            JZGJBSJId: currentUser.JSId,
          });
          if (result.status === 'ok') {
            return '退课成功';
          }
          return `退课成功,退款流程由于${result.message}申请失败`;
        }
      } else {
        message.success('退课成功');
      }
      setVisible(false);
      setCurrent(undefined);
      getData();
      actionRef?.current?.clearSelected?.();
      return '退课成功';
    }
    message.error(res.message || '退课流程出现错误，请联系管理员或稍后重试。');
    return '退课失败';
  };

  // 批量退课
  const handleSubmitPL = async (param: any) => {
    const { ZT, BZ } = param;
    try {
      if (Examine && Examine?.length) {
        Promise.all(Examine.map(async (exa: any) => updateTK(exa, ZT, BZ))).then((values) => {
          message.success(values);
        });
      } else {
        message.error('退课流程出现错误，请联系管理员或稍后重试');
      }
    } catch (err) {
      message.error('退课流程出现错误，请联系管理员或稍后重试。');
    }
  };
  const handleSubmit = async (param: any) => {
    const { ZT, BZ } = param;
    try {
      if (current.id) {
        const ids = { id: current.id };
        const body = { ZT, BZ, JZGJBSJId: currentUser.JSId };
        const res = await updateKHTKSJ(ids, body);
        if (res.status === 'ok') {
          if (ZT === 2) {
            message.success('退课申请已驳回');
          } else if (current?.KHBJSJ?.FY !== 0) {
            const money = Number(
              ((current?.KHBJSJ?.FY / current?.KHBJSJ?.KSS) * current?.KSS).toFixed(2),
            );
            if (money !== 0.0) {
              const result = await createKHXSTK({
                KHTKSJId: current?.id,
                /** 退款金额 */
                TKJE: money,
                /** 退款状态 */
                TKZT: 0,
                /** 学生ID */
                XSJBSJId: current?.XSJBSJId,
                /** 班级ID */
                KHBJSJId: current?.KHBJSJId,
                /** 学校ID */
                XXJBSJId: currentUser?.xxId,
                JZGJBSJId: currentUser.JSId,
              });
              if (result.status === 'ok') {
                message.success('退课成功,已自动申请退款流程');
              } else {
                message.warning(`退课成功,退款流程由于${result.message}申请失败`);
              }
            } else {
              message.success('退课成功,退款余额为0，无需退款');
            }
          } else {
            message.success('退课成功');
          }
          setVisible(false);
          setCurrent(undefined);
          actionRef?.current?.clearSelected?.();
          getData();
        } else {
          message.error(res.message || '退课流程出现错误，请联系管理员或稍后重试。');
        }
      }
    } catch (err) {
      message.error('退课流程出现错误，请联系管理员或稍后重试。');
    }
  };
  return (
    <>
      <div>
        <ProTable<any>
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          pagination={{
            showQuickJumper: true,
            pageSize: 10,
            defaultCurrent: 1,
          }}
          rowSelection={{
            selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          }}
          tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
            <Space size={24}>
              <span>
                已选 {selectedRowKeys.length} 项
                <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                  取消选择
                </a>
              </span>
            </Space>
          )}
          tableAlertOptionRender={({ selectedRowKeys, selectedRows }) => {
            setExamine(selectedRows);
            const newArr = selectedRows.filter((value: { ZT: number }) => {
              return value.ZT !== 0;
            });
            return (
              <Space size={16}>
                {newArr.length === 0 ? (
                  <a
                    onClick={() => {
                      setExamine(selectedRows);
                      setVisible(true);
                    }}
                  >
                    批量审批
                  </a>
                ) : (
                  <Tooltip title="所选数据中包含已审批数据，不可再次审批">
                    <span style={{ color: '#666' }}>批量审批</span>
                  </Tooltip>
                )}
              </Space>
            );
          }}
          scroll={{ x: getTableWidth(columns) }}
          dataSource={dataSource}
          headerTitle={
            <>
              <SearchLayout>
                <SemesterSelect XXJBSJId={currentUser?.xxId} onChange={termChange} />
                <CourseSelect
                  XXJBSJId={currentUser?.xxId}
                  XNXQId={curXNXQId}
                  onChange={courseChange}
                />
                <ClassSelect XNXQId={curXNXQId} KHKCSJId={curKCId} onChange={classChange} />
                <div>
                  <label htmlFor="student">学生名称：</label>
                  <Search
                    allowClear
                    onSearch={(val) => {
                      setName(val);
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
        />
        <Modal
          title="课程退订审核"
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
            onFinish={Examine && Examine?.length ? handleSubmitPL : handleSubmit}
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
            注：同意退课后，如涉及退款，系统将自动发起退款申请。
          </p>
        </Modal>
      </div>
    </>
  );
};
export default CourseUnsubscribe;
