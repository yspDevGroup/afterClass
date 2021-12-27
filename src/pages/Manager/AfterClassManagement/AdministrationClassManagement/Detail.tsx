import PageContain from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Space, Tag, Form, Input, Modal, message, Select, Spin, } from 'antd';
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import EllipsisHint from '@/components/EllipsisHint';
import { ExclamationCircleOutlined, LeftOutlined } from '@ant-design/icons';
import SearchLayout from '@/components/Search/Layout';
import { getStudentListByBjid } from '@/services/after-class/khfwbj';
import { getTableWidth } from '@/utils/utils';
import { getKHFWBJ } from '@/services/after-class/khfwbj';
import type { SelectType } from './SignUpClass';
import SignUpClass from './SignUpClass';
import moment from 'moment';
import { sendMessageToParent } from '@/services/after-class/wechat';
import { createKHTKSJ } from '@/services/after-class/khtksj';
import ReplacePayClass from './pay/ReplacePayClass';

const { TextArea } = Input;
const { Option } = Select;
const {Search}=Input;

const Detail = (props: any) => {
  const signUpClassRef = useRef();
  const { state } = props.location;
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState(false);
  //  true 催缴 false 选课提醒，
  const [flag, setFlag] = useState<boolean>(false);
  const [XSList, setXSList] = useState<string[]>();
  const [XSId, setXSId] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [KHFWSJPZIdData, setKHFWSJPZIdData] = useState<SelectType[]>();
  const [KHFWSJPZId, setKHFWSJPZId] = useState<string>();
  const [title, setTitle] = useState<string>();
  const { KHFWBJs } = state;
  const [searchValue,setSearchValue]=useState<string>('');
  const [ZT,setZT]=useState<string|undefined>(undefined);

  const getDetailValue = async () => {
    if (KHFWBJs?.[0]) {
      setLoading(true);
      const res = await getKHFWBJ({
        BJSJId: KHFWBJs?.[0].BJSJId,
        XNXQId: KHFWBJs?.[0].XNXQId,
      });
      if (res.status === 'ok') {
        const newKHFWSJPZIdData: any = [];
        const { data } = res;
        if (data) {
          // 时段数据
          data?.KHFWSJPZs?.forEach((item: any, index: number) => {
            newKHFWSJPZIdData.push({
              label: `${item.KSRQ} ~ ${item.JSRQ}`,
              value: item.id,
              data: `${moment(item.KSRQ, 'YYYY-MM-DD').format('YYYY年MM月DD日')} 至 ${moment(
                item.JSRQ,
                'YYYY-MM-DD',
              ).format('YYYY年MM月DD日')}`,
            });
            if (index === 0) {
              setKHFWSJPZId(item.id);
            }
          });
          if (newKHFWSJPZIdData.length) {
            setKHFWSJPZIdData(newKHFWSJPZIdData);
          }
        }
      }
      setLoading(false);
    }
  };

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center',
    },
    {
      title: '学号',
      dataIndex: 'XH',
      key: 'XH',
      align: 'center',
      width: 180,
    },
    {
      title: '学生姓名',
      dataIndex: 'XM',
      key: 'XM',
      align: 'center',
      width: 120,
    },
    {
      title: '辅导班',
      dataIndex: 'XSFWBJs',
      key: 'XSFWBJs',
      align: 'center',
      width: 300,
      render: (text: any) => {
        if (text?.length) {
          const list = text?.[0].XSFWKHBJs?.filter(
            (item: any) => item?.KHBJSJ?.KCFWBJs?.[0]?.LX === 1,
          ).map((item: any) => {
            return <Tag key={item?.KHBJSJ?.id}> {item?.KHBJSJ?.BJMC}</Tag>;
          });

          if (list) {
            return <EllipsisHint width="100%" text={list} />;
          }
          return '待选课';
        }
        return '——';
      },
    },
    {
      title: '课程班',
      dataIndex: 'XSFWBJs',
      key: 'XSFWBJs',
      align: 'center',
      width: 300,
      render: (text: any) => {
        if (text?.length) {
          const list = text?.[0].XSFWKHBJs?.filter(
            (item: any) => item?.KHBJSJ?.KCFWBJs?.[0]?.LX === 0,
          ).map((item: any) => {
            return <Tag key={item?.KHBJSJ?.id}> {item?.KHBJSJ?.BJMC}</Tag>;
          });
          if (list?.length) {
            return <EllipsisHint width="100%" text={list} />;
          }
          return '待选课';
        }
        return '——';
      },
    },
    {
      title: '报名状态',
      dataIndex: 'XSFWBJs',
      key: 'XSFWBJs',
      align: 'center',
      width: 120,
      render: (text: any) => {
        if (text?.length) {
          // if(text?.[0]?.ZT===3){
          //   return '已报名未交费';
          // }
          // if(text?.[0]?.ZT===0){
          //   return '报名已缴费'
          // }
          if(text?.[0]?.ZT===1){
            return '退课中'
          }
          return '已报名';
        } else {
          return '未报名';
        }
      },
    },
   
  ];

  // 退课
  const onTKData = (list: any[]) => {
    if (list?.length) {
      Modal.confirm({
        icon: <ExclamationCircleOutlined />,
        title: '退课',
        content: '退课提示',
        onOk: async () => {
          const newlist = list.map((item: any) => {
            return {
              LX: 2,
              XSJBSJId: item?.XSJBSJId,
              ZT: 0,
              XSFWBJId: item?.XSFWBJId,
            };
          });
          // console.log('退了课列表', newlist);
          const res = await createKHTKSJ(newlist);
          if (res.status === 'ok') {
            message.success('申请成功');
            actionRef?.current?.reload();
          } else {
            message.error(res.message);
          }
        },
      });
    } else {
      message.error('请先选择学生');
    }
  };

  // 代报名
  const getDBM = (record: any) => {
    if (!record?.XSFWBJs?.length) {
      return (
        <a
          onClick={() => {
            setTitle(`代报名-${record.XM}~${record.XH}`);
            setXSId(record?.id);
          }}
        >
          代报名
        </a>
      );
    }
    return '';
  };
  // 退课
  const getTK = (record: any) => {
    if (record?.XSFWBJs?.[0]?.ZT === 3) {
      return (
        <a
          onClick={() => {
            if (record?.id) {
              onTKData([{ XSJBSJId: record?.id, XSFWBJId: record?.XSFWBJs?.[0]?.id }]);
            }
          }}
        >
          退课
        </a>
      );
    }
    return '';
  };
  // 催缴费
  const getCJF = (record: any) => {
    if (record?.XSFWBJs?.[0]?.ZT === 3) {
      return (
        <a
          onClick={() => {
            setXSList([record?.WechatUserId]);
            setVisible(true);
            setFlag(true);
          }}
        >
          催缴费
        </a>
      );
    }
    return '';
  };
  // 代缴费
  const getDJF = (record: any) => {
    if (record?.XSFWBJs?.[0]?.ZT === 3) {
      return (
        <ReplacePayClass
          XSFWKHBJs={record?.XSFWKHBJs}
          XM={record.XM}
          key={record.id}
          XSFWBJ={record?.XSFWBJs?.[0]}
          XSJBSJId={record.id}
          onload={()=>{
            actionRef?.current?.reloadAndRest();
          }}
        />
      );
    }
    return '';
  };
  // 选课提醒
  const getXKTX = (record: any) => {
    if (record?.XSFWBJs?.[0]?.ZT === 3) {
      if (
        !record?.XSFWBJs?.[0]?.XSFWKHBJs?.some((item: any) => item?.KHBJSJ?.KCFWBJs?.[0]?.LX === 0)
      ) {
        return (
          <a
            onClick={() => {
              setXSList([record?.WechatUserId]);
              setVisible(true);
              setFlag(false);
            }}
          >
            选课提醒
          </a>
        );
      }
      return '';
    }

    return '';
  };
  // 代选课
  const getDXK = (record: any) => {
    if (record?.XSFWBJs?.[0]?.ZT === 3) {
      if (
        !record?.XSFWBJs?.[0]?.XSFWKHBJs?.some((item: any) => item?.KHBJSJ?.KCFWBJs?.[0]?.LX === 0)
      ) {
        return (
          <a
            onClick={() => {
              setTitle('代选课');
              setXSId(record?.id);
            }}
          >
            代选课
          </a>
        );
      }
      return '';
    }

    return '';
  };
  const option: ProColumns<any>[] = [
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 300,
      fixed: 'right',
      render: (_, record) => {
        return (
          <Space>
            {getDBM(record)}
            {getTK(record)}
            {getCJF(record)}
            {getDJF(record)}
            {getXKTX(record)}
            {getDXK(record)}
          </Space>
        );
      },
    },
  ];

  const handleCJSubmit = async (param: any) => {
    console.log(param, XSList);
    if (XSList?.length) {
      try {
        const res = await sendMessageToParent({
          to: 'to_student_userid',
          text: param.MSG,
          ids: XSList,
        });
        if (res?.status === 'ok') {
          message.success(flag ? '已催缴' : '已通知');
        } else {
          message.error(res.message);
        }
        setVisible(false);
        setXSList([]);
      } catch {
        setVisible(false);
        message.error(`${flag ? '催缴' : '通知'}出现错误，请联系管理员或稍后重试。`);
      }
    } else {
      message.error('请选择学生');
    }
  };
  useEffect(() => {
    getDetailValue();
  }, []);

  useEffect(() => {
    if (KHFWSJPZId) {
      actionRef?.current?.reloadAndRest();
    }
  }, [KHFWSJPZId,ZT]);

  useEffect(() => {
    let data;
    if (flag && KHFWSJPZId) {
      data = KHFWSJPZIdData?.find((item: SelectType) => item.value === KHFWSJPZId);
    }
    const MSG = flag
      ? `【缴费提醒】您的${KHFWBJs?.[0]?.FWMC}（${data?.data}）还未缴费，请及时处理。`
      : `【选课提醒】您报名的${KHFWBJs?.[0]?.FWMC}还未选课，请及时处理。`;
    form.setFieldsValue({ MSG: MSG });
  }, [flag]);

  const getColumns = () => {
    if (KHFWBJs?.[0]) {
      return [...columns, ...option];
    } else {
      return columns;
    }
  };
  useEffect(() => {
    if (XSId) {
      signUpClassRef?.current?.onSetVisible(true);
    }
  }, [XSId]);

  const onSearchChange=(value: string)=>{
    setSearchValue(value);
    actionRef?.current?.reloadAndRest();
  }
 

  return (
    <div className={styles.AdministrativeClass}>
      <PageContain>
        <Button
          type="primary"
          onClick={() => {
            history.go(-1);
          }}
          style={{
            marginBottom: '24px',
          }}
        >
          <LeftOutlined />
          返回上一页
        </Button>
        <Spin spinning={loading}>
          <ProTable<any>
            actionRef={actionRef}
            rowSelection={{}}
            scroll={{ x: getTableWidth(getColumns()) }}
            tableAlertOptionRender={({ selectedRows }) => {
              // console.log('selectedRows23', selectedRows, selectedRowKeys);
              if (KHFWBJs?.[0]) {
                return (
                  <Space>
                    <Button
                      type="primary"
                      onClick={() => {
                        // 筛选未交费学生 ZT===3的学生
                        const list = selectedRows
                          .filter((item: any) => {
                            // 判断学生是否报名
                            return item?.XSFWBJs?.length;
                          })
                          .map((item: any) => {
                            return { XSJBSJId: item.id, XSFWBJId: item?.XSFWBJs?.[0]?.id };
                          });
                        if (list?.length) {
                          onTKData(list);
                        } else {
                          message.error('没有要退课的学生');
                        }
                      }}
                    >
                      批量退课
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => {
                        // 筛选未交费学生 ZT===3的学生
                        const list = selectedRows.filter((item: any) => {
                          // 判断学生是否报名
                          if (item?.XSFWBJs?.length) {
                            // 下标为0 的数据是报名服务班的详情
                            const XSFWBJ = item.XSFWBJs[0];
                            return XSFWBJ.ZT === 3;
                          }
                          return false;
                        });
                        if (list?.length) {
                          setXSList(list.filter((item: any) => item?.WechatUserId));
                          setVisible(true);
                          setFlag(true);
                        } else {
                          message.error('没有要催缴的学生');
                        }
                      }}
                    >
                      批量催缴
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => {
                        // 筛选未选课的学生
                        // 筛选未交费学生 LX===1的学生 选择课程班
                        const list = selectedRows.filter((item: any) => {
                          // 判断学生是否报名
                          if (item?.XSFWBJs?.length) {
                            // 下标为0 的数据是报名服务班-课程数据
                            const XSFWKHBJs = item?.XSFWBJs?.[0].XSFWKHBJs;
                            return !XSFWKHBJs?.some(
                              (XSFWKHBJ: any) => XSFWKHBJ.KHBJSJ.KCFWBJs[0].LX === 0,
                            );
                          }
                          return false;
                        });
                        if (list?.length) {
                          setXSList(list.map((item: any) => item?.WechatUserId));
                          setVisible(true);
                          setFlag(false);
                        } else {
                          message.error('没有要选课提醒学生');
                        }
                      }}
                    >
                      选课提醒
                    </Button>
                  </Space>
                );
              } else {
                return '';
              }
            }}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
              <Space size={24}>
                <span>
                  已选 {selectedRowKeys.length} 项
                  <a style={{ marginLeft: 8, width: '30px' }} onClick={onCleanSelected}>
                    取消选择
                  </a>
                </span>
              </Space>
            )}
            columns={getColumns()}
            rowKey="id"
            pagination={{
              showQuickJumper: true,
              pageSize: 10,
              defaultCurrent: 1,
            }}
            request={async (param) => {
              // 表单搜索项会从 params 传入，传递给后端接口。
              let arrZT: any[] = [];
              if(ZT){
                arrZT=[ZT]
              }
            
              if(ZT === '0'){
                arrZT=['0', '1','2','3']
              }
              if (state.id && KHFWSJPZId) {
                const res = await getStudentListByBjid({
                  BJSJId: state.id,
                  page: param.current,
                  pageSize: param.pageSize,
                  KHFWSJPZId: KHFWSJPZId,
                  ZT:arrZT,
                  XSXMORXH:searchValue,
                });

                if (res.status === 'ok') {
                  return {
                    data: res.data.rows,
                    success: true,
                    total: res.data.count,
                  };
                }
              }

              return [];
            }}
            options={{
              setting: false,
              fullScreen: false,
              density: false,
              reload: false,
            }}
            search={false}
            headerTitle={
              <SearchLayout>
                {KHFWBJs?.[0] && (
                  <div>
                    <label htmlFor="course">报名时段：</label>
                    <Select
                      style={{ width: 200 }}
                      value={KHFWSJPZId}
                      placeholder="请选择"
                      onChange={(value: string) => {
                        setKHFWSJPZId(value);
                      }}
                      showSearch
                    >
                      {KHFWSJPZIdData?.map((item: any) => {
                        return <Option value={item.value}>{item.label}</Option>;
                      })}
                    </Select>
                  </div>
                )}
                {
                  <Search
                  value={searchValue}
                  onChange={(e: any) => {
                    setSearchValue(e?.target?.value);
                  }}
                  placeholder="姓名/学号"
                  allowClear
                  onSearch={onSearchChange}
                />
                }
                <div>
                  <label htmlFor="service">报名类型：</label>
                  <Select
                    style={{ width: 160 }}
                    value={ZT}
                    allowClear
                   placeholder='请选择'
                    onChange={(value)=>{
                      setZT(value);
                    }}
                  >
                    
                       <Option value={0}>已报名</Option>;
                       <Option value={1}>退课中</Option>;
                       <Option value={2}>已退课</Option>;
                       <Option value={3}>未缴费</Option>;
                       <Option value={4}>未报名</Option>;
               
                  </Select>
                </div>
              </SearchLayout>
            }
            toolBarRender={() => {
              // 未配置
              if (KHFWBJs?.[0]) {
                return [
                  <SignUpClass
                    actionRef={actionRef}
                    type={1}
                    BJSJId={KHFWBJs?.[0]?.BJSJId}
                    XNXQId={KHFWBJs?.[0]?.XNXQId}
                  />,
                ];
              }
              return [];
            }}
          />
        </Spin>
        <Modal
          title={flag ? '催缴费通知' : '选课提醒'}
          visible={visible}
          onOk={() => {
            form.submit();
          }}
          onCancel={() => {
            setVisible(false);
          }}
          okText="确认"
          cancelText="取消"
        >
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 15 }}
            form={form}
            // initialValues={{
            //   MSG: flag ? `【缴费提醒】您于xx年xx月xx日报的xx课还未缴费，请及时处理。` : `【选课提醒】您于xx年xx月xx日报的xx服务还未选课，请及时处理。`,
            // }}
            onFinish={handleCJSubmit}
            layout="horizontal"
          >
            <Form.Item
              label="通知内容"
              name="MSG"
              rules={[
                {
                  required: true,
                  message: `请输入${flag ? '催缴' : '提醒'}说明`,
                },
              ]}
            >
              <TextArea rows={4} maxLength={200} />
            </Form.Item>
          </Form>
        </Modal>
      </PageContain>
      <SignUpClass
        setXSId={setXSId}
        title={title}
        ref={signUpClassRef}
        XSJBSJId={XSId}
        actionRef={actionRef}
        type={2}
        BJSJId={KHFWBJs?.[0]?.BJSJId}
        XNXQId={KHFWBJs?.[0]?.XNXQId}
      />
    </div>
  );
};

export default Detail;
