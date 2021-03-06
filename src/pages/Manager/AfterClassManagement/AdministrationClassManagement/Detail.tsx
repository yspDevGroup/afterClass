/* eslint-disable no-nested-ternary */
import PageContain from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  Button,
  Space,
  Tag,
  Form,
  Input,
  Modal,
  message,
  Select,
  Spin,
  Tabs,
  Switch,
  Checkbox,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import EllipsisHint from '@/components/EllipsisHint';
import { LeftOutlined } from '@ant-design/icons';
import SearchLayout from '@/components/Search/Layout';
import { getStudentListByBjid, updateKHFWBJisPay } from '@/services/after-class/khfwbj';
import { getTableWidth } from '@/utils/utils';
import { getKHFWBJ } from '@/services/after-class/khfwbj';
import SignUpClass from './SignUpClass';
import type { SelectType } from './SignUpClass';
import moment from 'moment';
import { sendMessageToParent } from '@/services/after-class/wechat';
import ReplacePayClass from './pay/ReplacePayClass';
import { bulkCreateKHFWTK } from '@/services/after-class/khtksj';

const { TextArea } = Input;
const { Option } = Select;
const { Search } = Input;

const Detail = (props: any) => {
  const signUpClassRef = useRef<any>();
  const { state } = props.location;
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState(false);
  //  true 催缴 false 选课提醒，
  const [flag, setFlag] = useState<boolean>(false);
  const [XSList, setXSList] = useState<string[]>();
  const [XSId, setXSId] = useState<string>();
  const [XSData, setXSData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [KHFWSJPZIdData, setKHFWSJPZIdData] = useState<SelectType[]>();
  const [KHFWSJPZId, setKHFWSJPZId] = useState<string>();
  const [title, setTitle] = useState<string>();
  const { KHFWBJs } = state;
  const [searchValue, setSearchValue] = useState<string>('');
  const [ZT, setZT] = useState<number | undefined>();
  const [detailZT, setDetailZT] = useState<string | undefined>(undefined);
  const [isPay, setIsPay] = useState<boolean>();
  const [kHFWBJId, setkHFWBJId] = useState<string | undefined>(undefined);
  const [isOperation, setIsOperation] = useState<boolean>(true);

  // 退课数据
  const [TKXSList, setTKXSList] = useState<any[]>();
  const [TKVisible, setTKVisible] = useState<boolean>(false);
  const [TKSD, setTKSD] = useState<any[]>([]);
  const [TKSDData, setTKSDData] = useState<any>();

  // 判断当前时间 是否在 范围内
  const getFlagTime = (KSQR: any, JSQR: any) => {
    if (KSQR && JSQR) {
      const nowTime = moment().valueOf();
      // const beginTime = moment(KSQR, 'YYYY-MM-DD').valueOf();
      const endTime = moment(JSQR, 'YYYY-MM-DD').add(1, 'days').valueOf();
      if (nowTime <= endTime) {
        return true;
      }
      return false;

    }
    return false;

  };

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
          data?.KHFWSJPZs?.forEach((item: any) => {
            newKHFWSJPZIdData.push({
              label: `${item.KSRQ} ~ ${item.JSRQ}`,
              value: item.id,
              data: `${moment(item.KSRQ, 'YYYY-MM-DD').format('YYYY年MM月DD日')} 至 ${moment(
                item.JSRQ,
                'YYYY-MM-DD',
              ).format('YYYY年MM月DD日')}`,
              title: (
                <>
                  <span style={{ fontSize: '16px' }}>{item.SDBM}</span>
                  <span style={{ color: '#999' }}>{` ${moment(item.KSRQ).format('MM-DD')}~${moment(
                    item.JSRQ,
                  ).format('MM-DD')}`}</span>
                </>
              ),
              KSRQ: item.KSRQ,
              JSRQ: item.JSRQ,
              isPay: item?.isPay,
            });
          });
          if (newKHFWSJPZIdData.length) {
            setKHFWSJPZIdData(newKHFWSJPZIdData);
          }
          setkHFWBJId(data?.id);

          setDetailZT(data?.ZT);
        }
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    // 刷新后 设置isPay
    if (KHFWSJPZId) {
      const KHFWSJPZ: any = KHFWSJPZIdData?.find((item: any) => item.value === KHFWSJPZId);

      if (KHFWSJPZ) {
        setIsPay(KHFWSJPZ?.isPay === 1);
        setIsOperation(getFlagTime(KHFWSJPZ.KSRQ, KHFWSJPZ.JSRQ));
      }
    }
  }, [KHFWSJPZId]);

  useEffect(() => {
    if (KHFWSJPZIdData?.length) {
      if (!KHFWSJPZId) {
        console.log('KHFWBJs?.[0].KHFWSJPZ', KHFWBJs?.[0]?.KHFWSJPZs?.[0]?.id);
        if (KHFWBJs?.[0]?.KHFWSJPZs?.[0]?.id) {
          setKHFWSJPZId(KHFWBJs?.[0]?.KHFWSJPZs?.[0]?.id);
        } else {
          setKHFWSJPZId(KHFWSJPZIdData?.[0]?.value);
        }
      }
      if (KHFWSJPZId) {
        const KHFWSJPZ: any = KHFWSJPZIdData?.find((item: any) => item.value === KHFWSJPZId);
        if (KHFWSJPZ) {
          setIsPay(KHFWSJPZ?.isPay === 1);
        }
      }
    }
  }, [KHFWSJPZIdData]);

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
            (item: any) => item?.KHBJSJ?.ISZB === 0,
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
            (item: any) => item?.KHBJSJ?.ISZB === 1,
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
          if (text?.[0]?.ZT === 2) {
            return '已退课';
          }
          if (text?.[0]?.ZT === 1) {
            return '退课中';
          }
          return '已报名';
        }
        return '未报名';

      },
    },
  ];

  const getXSTKData = async (XSJBSJId: string) => {
    if (XSJBSJId) {
      const res = await getStudentListByBjid({
        XSJBSJId,
        ZT: [0, 3],
        BJSJId: state.id,
        page: 0,
        pageSize: 0,
      });
      if (res.status === 'ok' && res.data) {
        // 可退已经报过名时间的课程
        setTKSDData(
          res.data.rows?.[0]?.XSFWBJs?.map((item: any) => {
            console.log('item', item);
            return {
              value: item?.KHFWSJPZ?.id,
              title: (
                <>
                  <span style={{ fontSize: '16px' }}>{item?.KHFWSJPZ?.SDBM}</span>
                  <span style={{ color: '#999' }}>{` ${moment(item?.KHFWSJPZ?.KSRQ).format(
                    'MM-DD',
                  )}~${moment(item?.KHFWSJPZ?.JSRQ).format('MM-DD')}`}</span>
                </>
              ),
            };
          }),
        );
        setTKVisible(true);
      }
    }
  };
  useEffect(() => {
    if (TKSDData?.length) {
      setTKSD(TKSDData.map((item: any) => item.value));
    }
  }, [TKSDData]);
  // 退课
  const onTKData = (list: any[]) => {
    if (list?.length) {
      // 学生只有一人
      if (list?.length === 1) {
        getXSTKData(list?.[0]?.XSJBSJId);
      } else {
        const arr = KHFWSJPZIdData;
        // ?.filter((value: any) => {
        //   return moment(value.JSRQ).format('YYYY/MM/DD') > moment(new Date()).format('YYYY/MM/DD');
        // });
        if (arr) {
          setTKSDData(arr);
          setTKVisible(true);
        }
      }
      setTKXSList(list);
      // Modal.confirm({
      //   // icon: <ExclamationCircleOutlined />,
      //   title: '退课',
      //   content: '是否对该学生进行退课？',
      //   onOk: async () => {
      //     const newlist = list.map((item: any) => {
      //       return {
      //         LX: 2,
      //         XSJBSJId: item?.XSJBSJId,
      //         ZT: 0,
      //         XSFWBJId: item?.XSFWBJId,
      //       };
      //     });
      //     // console.log('退了课列表', newlist);
      //     const res = await createKHTKSJ(newlist);
      //     if (res.status === 'ok') {
      //       message.success('申请成功');
      //       actionRef?.current?.reload();
      //     } else {
      //       message.error(res.message);
      //     }
      //   },
      // });
    } else {
      message.error('请先选择学生');
    }
  };

  // 代报名
  const getDBM = (record: any) => {
    if (isOperation && (!record?.XSFWBJs?.length || record?.XSFWBJs?.[0]?.ZT === 2)) {
      return (
        <a
          onClick={() => {
            setTitle(`代报名`);
            setXSId(record?.id);
            setXSData(record);
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
    if (record?.XSFWBJs?.[0]?.ZT === 3 || record?.XSFWBJs?.[0]?.ZT === 0) {
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
    if (isPay && record?.XSFWBJs?.[0]?.ZT === 3) {
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
    if (record?.XSFWBJs?.[0]?.ZT === 3 && isPay) {
      return (
        <ReplacePayClass
          XSFWKHBJs={record?.XSFWKHBJs}
          XM={record.XM}
          key={record.id}
          XSFWBJ={record?.XSFWBJs?.[0]}
          XSJBSJId={record.id}
          onload={() => {
            actionRef?.current?.reloadAndRest?.();
          }}
        />
      );
    }
    return '';
  };
  // 选课提醒
  const getXKTX = (record: any) => {
    if (isOperation && record?.XSFWBJs?.[0]?.ZT === 3) {
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
    if (isOperation && (record?.XSFWBJs?.[0]?.ZT === 3 || record?.XSFWBJs?.[0]?.ZT === 0)) {
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
      actionRef?.current?.reloadAndRest?.();
    }
  }, [KHFWSJPZId, ZT]);

  useEffect(() => {
    let data;
    if (flag && KHFWSJPZId) {
      data = KHFWSJPZIdData?.find((item: SelectType) => item.value === KHFWSJPZId);
    }
    const MSG = flag
      ? `【缴费提醒】您的${KHFWBJs?.[0]?.FWMC}（${data?.data}）还未缴费，请及时处理。`
      : `【选课提醒】您报名的${KHFWBJs?.[0]?.FWMC}还未选课，请及时处理。`;
    form.setFieldsValue({ MSG });
  }, [visible]);

  const getColumns = () => {
    if (KHFWBJs?.[0] && detailZT) {
      return [...columns, ...option];
    }
    return columns;

  };
  useEffect(() => {
    if (XSId) {
      signUpClassRef?.current?.onSetVisible(true);
    }
  }, [XSId]);

  const onSearchChange = (value: string) => {
    setSearchValue(value);
    actionRef?.current?.reloadAndRest?.();
  };

  const onIsPayClick = async (bool: boolean) => {
    const res = await updateKHFWBJisPay({
      KHFWBJId: kHFWBJId || '',
      KHFWSJPZId: KHFWSJPZId || '',
      isPay: bool ? 1 : 0,
    });
    if (res.status === 'ok') {
      message.success(bool ? '开启成功' : '关闭成功');
      getDetailValue();
    } else {
      message.error(res.message);
    }
  };

  // 退课关闭
  const onTKCancel = () => {
    setTKXSList([]);
    setTKVisible(false);
    setTKSD([]);
    setTKSDData([]);
    actionRef?.current?.reloadAndRest?.();
  };

  const onTkSubmit = async () => {
    if (TKSD?.length) {
      const res = await bulkCreateKHFWTK({
        XSJBSJIds: TKXSList?.map((item: any) => item?.XSJBSJId),
        /** 退课状态,0:申请中;1:已退课;2:不同意退课 */
        ZT: 0,
        /** 课后服务班级id */
        KHFWBJId: kHFWBJId,
        KHFWSJPZIds: TKSD,
        XNXQId: KHFWBJs?.[0].XNXQId,
      });
      if (res.status === 'ok') {
        message.success('申请成功');
        onTKCancel();
      } else {
        message.error(res.message);
        onTKCancel();
      }
    } else {
      message.warning('请选择退订时段');
    }
  };

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
        <span style={{ fontSize: '18px', marginLeft: '24px', fontWeight: 'bold' }}>
          {`${state?.NJSJ?.XD}${state?.NJSJ?.NJMC}${state?.BJ}`}
        </span>

        {KHFWBJs?.[0] && KHFWBJs?.[0]?.ZT === 1 && (
          <>
            <Tabs
              activeKey={KHFWSJPZId}
              onChange={(value: any) => {
                setKHFWSJPZId(value);
              }}
            >
              {KHFWSJPZIdData?.map((item: any) => {
                return <Tabs.TabPane key={item.value} tab={item.title} />;
              })}
            </Tabs>
            <Spin spinning={loading}>
              <ProTable<any>
                actionRef={actionRef}
                rowSelection={{}}
                scroll={{ x: getTableWidth(getColumns()) }}
                tableAlertOptionRender={({ selectedRows }) => {
                  // console.log('selectedRows23', selectedRows, selectedRowKeys);
                  if (KHFWBJs?.[0] && detailZT) {
                    return (
                      <Space>
                        <Button
                          type="primary"
                          onClick={() => {
                            // 筛选未交费学生 ZT===3的学生 //已缴费的学生
                            const list = selectedRows?.map((item: any) => {
                              return { XSJBSJId: item.id, XSFWBJId: item?.XSFWBJs?.[0]?.id };
                            });
                            // .filter((item: any) => {
                            //   // 判断学生是否报名
                            //   return item?.XSFWBJs?.[0]?.ZT === 3 || item?.XSFWBJs?.[0]?.ZT === 0;
                            // })

                            if (list?.length) {
                              onTKData(list);
                            } else {
                              message.error('没有要退课的学生');
                            }
                          }}
                        >
                          批量退课
                        </Button>
                        {isPay && (
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
                        )}

                        {isOperation && (
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
                        )}
                      </Space>
                    );
                  }
                  return '';

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
                  if (state.id && KHFWSJPZId) {
                    const res = await getStudentListByBjid({
                      BJSJId: state.id,
                      page: param.current || 1,
                      pageSize: param.pageSize || 10,
                      KHFWSJPZId,
                      ZT: ZT === undefined ? [] : (ZT === 0 ? [0, 3] : [ZT]),
                      XSXMORXH: searchValue,
                    });
                    if (res?.status === 'ok') {

                      return {
                        data:res.data.rows,
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
                    {/* {KHFWBJs?.[0] && (
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
                )} */}
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
                      <label htmlFor="service">报名状态：</label>
                      <Select
                        style={{ width: 160 }}
                        value={ZT}
                        allowClear
                        placeholder="请选择"
                        onChange={(value) => {
                          setZT(value);
                        }}
                      >
                        <Option value={0}>已报名</Option>;
                        {/* <Option value={1}>退课中</Option>;
                    <Option value={2}>已退课</Option>;
                    <Option value={3}>未缴费</Option>; */}
                        <Option value={4}>未报名</Option>;
                      </Select>
                    </div>
                  </SearchLayout>
                }
                toolBarRender={() => {
                  // 未配置
                  if (KHFWBJs?.[0] && detailZT && isOperation) {
                    return [
                      <>
                        开启缴费:
                        <Switch
                          checkedChildren="开启"
                          unCheckedChildren="关闭"
                          checked={isPay}
                          onChange={(value: boolean) => {
                            onIsPayClick(value);
                          }}
                        />
                      </>,
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
          </>
        )}
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
        <SignUpClass
          setXSId={setXSId}
          title={title}
          ref={signUpClassRef}
          XSJBSJId={XSId}
          XH={XSData?.XH}
          XM={XSData?.XM}
          actionRef={actionRef}
          type={2}
          BJSJId={KHFWBJs?.[0]?.BJSJId}
          XNXQId={KHFWBJs?.[0]?.XNXQId}
        />

        <Modal
          title="退课确认"
          visible={TKVisible}
          onOk={onTkSubmit}
          onCancel={onTKCancel}
          closable={false}
          okText="确定"
          cancelText="取消"
          {...(!TKSDData?.length && { footer: null })}
        >
          <div>
            <p style={{ fontSize: 14, color: '#999', marginBottom: 20 }}>
              系统将为您退订所有剩余未上课程，您也可以指定部分时段进行退订。
            </p>
            {TKSDData?.length ? (
              <Checkbox.Group
                value={TKSD}
                onChange={(value: any) => {
                  setTKSD(value);
                }}
                options={TKSDData?.map((item: any) => {
                  return { value: item?.value, label: item?.title };
                })}
              />
            ) : (
              <p style={{ fontSize: 14, marginBottom: 20 }}>该学生未报名或已全部退课</p>
            )}

            {/* <p style={{ fontSize: 12, color: '#999', marginTop: 15, marginBottom: 0 }}>
            注：系统将根据您所选时段发起退订申请，退订成功后，将自动进行退款，退款将原路返回您的支付账户。
          </p> */}
          </div>
        </Modal>
      </PageContain>
    </div>
  );
};

export default Detail;
