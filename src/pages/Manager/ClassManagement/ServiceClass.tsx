/* eslint-disable no-nested-ternary */
import React from 'react';
import { Link, useModel, history } from 'umi';
import { useRef, useState, useEffect } from 'react';
import { Button, Modal, Tooltip, Select, Divider, Tag, Space, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { theme } from '@/theme-default';
import PromptInformation from '@/components/PromptInformation';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getAllCourses } from '@/services/after-class/khkcsj';
import { bulkUpdate, getAllClasses, getKHBJSJ } from '@/services/after-class/khbjsj';
import { calcAllPeriod, getAllClassIds } from '@/services/after-class/kcbsksj';
import { getAllXXSJPZ } from '@/services/after-class/xxsjpz';
import ActionBar from './components/ActionBar';

import { getClassDays } from '@/utils/TimeTable';
import { getTableWidth } from '@/utils/utils';
import type { TableListParams } from '@/constant';
import SearchLayout from '@/components/Search/Layout';
import AppSKXQTable from './components/AppSKXQTable';
import AddCourse from './components/AddCourse';
import EllipsisHint from '@/components/EllipsisHint';

const { Option } = Select;

const ServiceClass = (props: { location: { state: any } }) => {
  const { state } = props.location;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  // 列表数据源
  const [dataSource, setDataSource] = useState<any[]>([]);
  // 当前学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 学年学期数据列表
  const [termList, setTermList] = useState<any>();
  // 当前选中课程班
  const [current, setCurrent] = useState<any>();
  // 控制新增课程班信息弹框
  const [visible, setVisible] = useState(false);
  // 当前查询课程ID
  const [kcId, setKcId] = useState<string>();
  // 课程来源
  const [KCLY, setKCLY] = useState<string>();
  // 课程列表数据
  const [mcData, setMcData] = useState<{ label: string; value: string }[]>([]);
  // 控制提示开关
  const [tips, setTips] = useState<boolean>(false);
  // 学期学年没有数据时提示的开关
  const [kai, setkai] = useState<boolean>(false);
  // // 报名列表数据
  // const [applicantData, setApplicantData] = useState<any>({});
  // 课程班复制功能
  const [CopyType, setCopyType] = useState<string>();
  // 弹框名称设定
  const [names, setnames] = useState<string>('bianji');
  // 课程数据
  const [KHKCAllData, setKHKCAllData] = useState<any>([]);
  // 控制代报名中弹框
  // const [modalVisible, setModalVisible] = useState(false);
  // // 代报名中班级信息
  // const [BjDetails, setBjDetails] = useState<any>();
  // 代报名中教辅费用
  // const [JFAmount, setJFAmount] = useState<any>(0);
  // 班级状态
  const [BJZTMC, setBJZTMC] = useState<string | undefined>(undefined);
  // 课程班班级基本设置数据
  const [BjLists, setBjLists] = useState<any>();
  // 授课详情弹框
  const [ModalSKXQ, setModalSKXQ] = useState(false);
  // 授课班级数据
  const [SKXQData, setSKXQData] = useState({});

  const getData = async (origin?: string) => {
    const opts: TableListParams = {
      XNXQId: curXNXQId,
      KHKCSJId: kcId || state?.id,
      BJZT: BJZTMC,
      page: 0,
      ISFW: 1,
      pageSize: 0,
    };
    const resAll = await getAllClasses(opts);
    if (resAll.status === 'ok' && resAll.data) {
      let newTableDateSource = resAll.data.rows;
      if (origin) {
        newTableDateSource = newTableDateSource.filter((item: any) => {
          return item.KHKCSJ?.SSJGLX === origin;
        });
      }
      setDataSource(newTableDateSource);
    }
  };
  useEffect(() => {
    async function fetchData() {
      const res = await queryXNXQList(currentUser?.xxId);
      const newData = res.xnxqList;
      const curTerm = res.current;
      if (newData?.length) {
        if (curTerm) {
          setCurXNXQId(curTerm.id);
          setTermList(newData);
          const ress = await getAllCourses({
            page: 0,
            pageSize: 0,
            XNXQId: curTerm.id,
            XXJBSJId: currentUser?.xxId,
          });
          if (ress?.status === 'ok') {
            const courseArry: { label: string; value: string }[] = [];
            ress?.data?.rows?.forEach((item: any) => {
              courseArry.push({
                label: item.KCMC,
                value: item.id,
              });
            });
            setMcData(courseArry);
            setKHKCAllData(ress.data.rows);
          }
        }
      } else {
        setkai(true);
      }
    }
    fetchData();
  }, []);
  // 通过课程信息是否存在判断提示是否应该展示
  useEffect(() => {
    if (mcData === []) {
      return setTips(true);
    }
    return setTips(false);
  }, [mcData]);
  // 监听学年学期，课程名称的变更刷新列表
  useEffect(() => {
    if (curXNXQId) {
      getData(KCLY);
    }
  }, [curXNXQId, kcId, BJZTMC, KCLY]);

  // 控制学期学年数据提示框
  const kaiguan = () => {
    setkai(false);
  };
  // 控制课程名称数据提示框
  const clstips = () => {
    setTips(false);
  };
  const showModalSKXQ = (record: any) => {
    setModalSKXQ(true);
    setSKXQData({
      id: record.id,
      BJMC: record.BJMC,
      BJZT: record.BJZT,
    });
  };
  // 关闭报名列表弹框/授课详情弹框
  const handleCancel = () => {
    setModalSKXQ(false);
    getData();
  };
  // 查看、编辑、复制课程班操作
  const handleEdit = async (data: any, type?: any) => {
    const FJS: any[] = [];
    const BJIdsArr: any[] = [];
    const res = await getKHBJSJ({
      id: data?.id,
    });
    const currentData = res.data;
    currentData.KHBJJs?.forEach((element: { JSLX: string; JZGJBSJId: any }) => {
      if (element.JSLX === '副教师') {
        FJS.push(element?.JZGJBSJId);
      }
    });
    currentData.BJSJs?.forEach((value: any) => {
      BJIdsArr.push(value?.id);
    });
    const { BJMC, BJMS, KHKCSJ, KSS, XQSJId, BJSJs, FJSJ, FJSJId } = currentData;
    const BjList = {
      BJMC: type === 'copy' ? `${BJMC}-复制` : BJMC,
      KHKCSJId: KHKCSJ?.id,
      BJMS,
      ZJS:
        currentData.KHBJJs?.find((item: { JSLX: string }) => item.JSLX === '主教师')?.JZGJBSJId ||
        undefined,
      FJS,
      SSJGLX: currentData?.KHKCSJ?.SSJGLX,
      SKSD: [currentData.KKRQ, currentData.JKRQ],
      KSS,
      XQSJId,
      CDMC: FJSJ?.FJMC,
      CDMCId: FJSJId,
      KCLX: currentData.KHKCSJ.KHKCLX.KCTAG,
      BJIds: currentData?.BJSJs?.length === 0 ? currentData?.BJSJs?.[0]?.id : BJIdsArr,
      ISZB: currentData?.ISZB,
    };
    let BJRSObj: any = {};
    if (currentData?.ISZB === 1) {
      BJRSObj = {
        BJRS: currentData?.BJRS,
      };
    } else {
      BJRSObj = {};
    }
    const newObj = {
      ...BjList,
      ...BJRSObj,
    };
    setBjLists(newObj);
    const BJIdArr: any = [];
    const BJMCArr: any = [];
    BJSJs.forEach((value: any) => {
      BJIdArr.push(value.id);
      BJMCArr.push(`${value.NJSJ.XD}${value.NJSJ.NJMC}${value.BJ}`);
    });

    const list = {
      ...currentData,
      ZJS:
        currentData.KHBJJs?.find((item: { JSLX: string }) => item.JSLX === '主教师')?.JZGJBSJ ||
        undefined,
      FJS,
      KCLX: currentData.KHKCSJ.KHKCLX.KCTAG,
      KHKCSJId: KHKCSJ?.id,
    };
    setVisible(true);
    setCurrent(list);
    if (type === 'copy') {
      setCopyType('copy');
      setnames('copy');
    } else {
      setCopyType('undefined');
      setnames('chakan');
    }
  };
  // 显示新增课程班信息弹框
  const showDrawer = () => {
    setVisible(true);
    setCurrent(undefined);
    // setReadonly(false);
  };
  // 关闭新增、编辑课程班信息弹框
  // const onClose = () => {
  //   setVisible(false);
  // };

  // 课程名称筛选事件
  const onKcmcChange = (value: any) => {
    setKcId(value);
    setKCLY(undefined);
    setBJZTMC(undefined);
  };
  // 课程班排课信息同步事件
  const syncDays = async () => {
    /** 重新计算已有数据 */
    await calcAllPeriod();
    /** 获取所有已开班的班级ID 重新计算课程班课时 */
    const res = await getAllClassIds();
    if (res.status === 'ok' && res.data) {
      if (res.data?.length) {
        res.data.forEach(async (v: string) => {
          await getClassDays(v);
        });
      }
    }
  };

  /** 未设置开课时段时弹窗 */
  const infos = () => {
    Modal.info({
      title: '未设置开课时段，请先进行时段维护',
      width: '450px',
      okText: '去设置',
      onOk() {
        history.push('/basicalSettings/periodMaintenance');
      },
    });
  };
  useEffect(() => {
    if (kai !== true) {
      (async () => {
        const resKK = await getAllXXSJPZ({
          XXJBSJId: currentUser?.xxId,
          type: ['2'],
        });
        if (resKK.status === 'ok') {
          if (resKK.data?.length === 0) {
            infos();
          }
        }
      })();
    }
  }, []);

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      fixed: 'left',
      align: 'center',
    },
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      key: 'KCMC',
      align: 'center',
      width: 150,
      fixed: 'left',
      ellipsis: true,
      render: (_: any, record: any) => {
        return (
          <Tooltip title={record.KHKCSJ.KCMC}>
            <div className="ui-table-col-elp">{record.KHKCSJ.KCMC}</div>
          </Tooltip>
        );
      },
    },
    {
      title: '课程班名称',
      dataIndex: 'BJMC',
      key: 'BJMC',
      align: 'center',
      width: 160,
      render: (_: any, record: any) => {
        return <a onClick={() => handleEdit(record)}>{record?.BJMC}</a>;
      },
    },
    {
      title: '课程来源',
      dataIndex: 'KHKCSJ',
      key: 'KHKCSJ',
      align: 'center',
      width: 150,
      ellipsis: true,
      render: (_: any, record: any) => {
        return record?.KHKCSJ?.SSJGLX;
      },
    },
    {
      title: '适用行政班',
      key: 'SYXZB',
      dataIndex: 'SYXZB',
      search: false,
      align: 'center',
      width: 200,
      render: (text: any, record: any) => {
        const arr = record?.BJSJs;
        const sortArrays = (n1: any, n2: any) => {
          if (n1.NJSJ?.NJ === n2.NJSJ?.NJ) {
            return n1.BH - n2.BH;
          }
          return n1.NJSJ?.NJ - n2.NJSJ?.NJ;
        };
        arr.sort(sortArrays);
        return (
          <EllipsisHint
            width="100%"
            text={arr?.map((item: any) => {
              return <Tag key={item.id}>{`${item?.NJSJ?.XD}${item?.NJSJ?.NJMC}${item?.BJ}`}</Tag>;
            })}
          />
        );
      },
    },
    // {
    //   title: '是否被引用',
    //   align: 'center',
    //   width: 80,
    //   dataIndex: 'KCFWBJs',
    //   key: 'KCFWBJs',
    //   ellipsis: true,
    //   // hideInTable: true,
    //   render: (_, record) => {
    //     if (record?.KCFWBJs?.length) {
    //         return <SeveiceList title={'课后服务配置班级列表'} bjId = {record.id} termId = {curXNXQId} />;
    //     }
    //     return <>未引用</>;
    //   },
    // },
    {
      title: '排课',
      align: 'center',
      width: 80,
      dataIndex: 'PK',
      key: 'PK',
      ellipsis: true,
      render: (_, record) => {
        const Url = `/courseArrange?courseId=${record.id}&xnxqid=${curXNXQId}&XQSJ=${record.XQSJ.id}`;
        if (record.BJZT === '未开班') {
          if (record.pk_count === 0) {
            return <Link to={Url}>未排课</Link>;
          }
          return <Link to={Url}>已排课</Link>;
        }
        return <>已排课</>;
      },
    },
    {
      title: (
        <span>
          授课安排&nbsp;
          <Tooltip overlayStyle={{ maxWidth: '30em' }} title={<>实授课时/应授课时/已排课时</>}>
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
      ),
      dataIndex: 'SKXQ',
      key: 'SKXQ',
      align: 'center',
      width: 100,
      render: (text: any, record: any) => {
        return (
          <a
            onClick={() => {
              showModalSKXQ(record);
            }}
          >
            {record?.ssks_count}/{record?.ysks_count}/{record?.pk_count}
          </a>
        );
      },
    },
    {
      title: (
        <span>
          状态&nbsp;
          <Tooltip overlayStyle={{ maxWidth: '30em' }} title={<>开启时可用于课后服务配置</>}>
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
      ),
      dataIndex: 'BJZT',
      key: 'BJZT',
      align: 'center',
      width: 100,
      ellipsis: true,
      filters: true,
      onFilter: false,
      render: (_, record) => {
        return (
          <>
            {record?.BJZT === '未开班' ? '已关闭' : record?.BJZT === '已结课' ? '已结课' : '已开启'}
          </>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 230,
      fixed: 'right',
      render: (_, record) => {
        return (
          <>
            <ActionBar record={record} handleEdit={handleEdit} getData={getData} type="service" />
            <Divider type="vertical" />
          </>
        );
      },
    },
  ];

  const getPromptInformation = () => {
    if (kai) {
      return (
        <PromptInformation
          text="未查询到学年学期数据，请先设置学年学期"
          link="/basicalSettings/termManagement"
          open={kai}
          colse={kaiguan}
        />
      );
    }
    if (tips) {
      return (
        <PromptInformation
          text="未查询到课程名称，请先设置课程"
          link=""
          open={true}
          colse={clstips}
        />
      );
    }
    return <></>;
  };
  return (
    <>
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
        options={{
          setting: false,
          fullScreen: false,
          density: false,
          reload: false,
        }}
        search={false}
        dataSource={dataSource}
        headerTitle={
          <>
            <SearchLayout>
              <div>
                <label htmlFor="term">所属学年学期：</label>
                <Select
                  value={curXNXQId}
                  allowClear
                  onChange={(value: string) => {
                    setCurXNXQId(value);
                    setKcId(undefined);
                    setKCLY(undefined);
                    setBJZTMC(undefined);
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
              </div>
              <div>
                <label htmlFor="kcname">课程名称：</label>
                <Select
                  value={kcId || state?.id}
                  allowClear
                  placeholder="请选择"
                  onChange={onKcmcChange}
                >
                  {mcData?.map((item: any) => {
                    return (
                      <Option value={item.value} key={item.value}>
                        {item.label}
                      </Option>
                    );
                  })}
                </Select>
              </div>
              <div>
                <label htmlFor="kcly">课程来源：</label>
                <Select
                  allowClear
                  placeholder="课程来源"
                  onChange={(value) => {
                    setKCLY(value);
                    setBJZTMC(undefined);
                  }}
                  value={KCLY}
                >
                  <Option value="校内课程" key="校内课程">
                    校内课程
                  </Option>
                  <Option value="机构课程" key="机构课程">
                    机构课程
                  </Option>
                </Select>
              </div>
              {/* <div>
                <label htmlFor="status">班级状态：</label>
                <Select
                  allowClear
                  value={BJZTMC}
                  onChange={(value: string) => {
                    setBJZTMC(value);
                  }}
                >
                  <Option key="已开班" value="已开班">
                    已开班
                  </Option>
                  <Option key="未开班" value="未开班">
                    未开班
                  </Option>
                  <Option key="已结课" value="已结课">
                    已结课
                  </Option>
                </Select>
              </div> */}
            </SearchLayout>
          </>
        }
        rowSelection={{}}
        tableAlertOptionRender={({ selectedRows }) => {
          return (
            <Button
              type="primary"
              onClick={async () => {
                const list = selectedRows.filter((item: any) => {
                  return item?.BJZT === '未开班' && item?.pk_count !== 0;
                });
                const ids: any[] = [];
                list.forEach((value) => {
                  ids.push(value?.id);
                });
                const res = await bulkUpdate({
                  KHBJSJIds: ids,
                  BJZT: '已开班',
                });
                if (res?.status === 'ok') {
                  if (ids?.length) {
                    ids.forEach(async (v: string) => {
                      await getClassDays(v);
                    });
                    message.success('批量开启成功');
                  } else {
                    message.warning('您所选班级未排课或已开启，不可开启');
                  }

                  actionRef.current?.reloadAndRest?.();
                  actionRef.current?.clearSelected?.();
                  getData();
                } else {
                  message.warning(res.message);
                  actionRef.current?.clearSelected?.();
                }
              }}
            >
              批量开启
            </Button>
          );
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={24}>
            <span>
              已选 {selectedRowKeys.length} 项
              <a style={{ marginLeft: 8, width: '30px' }} onClick={onCleanSelected}>
                取消选择
              </a>
            </span>
          </Space>
        )}
        toolBarRender={() => [
          <Button
            style={{ display: 'none' }}
            type="ghost"
            key="send"
            onClick={() => {
              syncDays();
            }}
          >
            班级排课信息同步
          </Button>,
          <Button
            style={{ background: theme.btnPrimarybg, borderColor: theme.btnPrimarybg }}
            type="primary"
            key="add"
            onClick={() => {
              showDrawer();
              setnames('add');
            }}
          >
            <PlusOutlined />
            新增班级
          </Button>,
        ]}
      />
      <AddCourse
        visible={visible}
        formValues={current}
        BjLists={BjLists}
        setVisible={setVisible}
        mcData={mcData}
        names={names}
        KHKCAllData={KHKCAllData}
        curXNXQId={curXNXQId}
        currentUser={currentUser}
        CopyType={CopyType}
        getData={getData}
      />
      {getPromptInformation()}

      <Modal
        title="授课安排列表"
        visible={ModalSKXQ}
        onCancel={handleCancel}
        footer={null}
        style={{ minWidth: '750px' }}
        destroyOnClose
      >
        <AppSKXQTable SKXQData={SKXQData} />
      </Modal>
    </>
  );
};

export default ServiceClass;
