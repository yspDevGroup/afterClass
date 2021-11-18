import React from 'react';
import { Link, useModel } from 'umi';
import { useRef, useState, useEffect } from 'react';
import { Button, Modal, Tooltip, Select, message, Divider, Row, Col } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined, QuestionCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { theme } from '@/theme-default';
import PageContainer from '@/components/PageContainer';
import PromptInformation from '@/components/PromptInformation';

import { getAllCourses } from '@/services/after-class/khkcsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getAllClasses, getKHBJSJ } from '@/services/after-class/khbjsj';

import ActionBar from './components/ActionBar';
import AddCourse from './components/AddCourse';
import ApplicantInfoTable from './components/ApplicantInfoTable';

import styles from './index.less';
import AgentRegistration from './components/AgentRegistration';
import { getAllXXSJPZ } from '@/services/after-class/xxsjpz';
import { getClassDays } from '@/utils/TimeTable';
import { getTableWidth } from '@/utils/utils';
import type { TableListParams } from '@/constant';
import SearchLayout from '@/components/Search/Layout';

const { Option } = Select;

const CourseManagement = (props: { location: { state: any } }) => {
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
  // 设置选中课程班详情是否可读属性
  const [readonly, setReadonly] = useState<boolean>(false);
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
  // 报名列表数据
  const [applicantData, setApplicantData] = useState<any>({});
  // 课程班复制功能
  const [CopyType, setCopyType] = useState<string>();
  // 弹框名称设定
  const [names, setnames] = useState<string>('bianji');
  // 控制提示开关
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 课程数据
  const [KHKCAllData, setKHKCAllData] = useState<any>([]);
  // 控制代报名中弹框
  const [modalVisible, setModalVisible] = useState(false);
  // 代报名中班级信息
  const [BjDetails, setBjDetails] = useState<any>();
  // 针对报名时段维护后的提示信息
  const [BMJSSJTime, setBMJSSJTime] = useState<any>();
  // 代报名中教辅费用
  const [JFAmount, setJFAmount] = useState<any>(0);
  // 班级状态
  const [BJZTMC, setBJZTMC] = useState<string | undefined>(undefined);
  // 班级同步数据存储
  const [BJCC, setBJCC] = useState<[]>();
  const getData = async (origin?: string) => {
    const opts: TableListParams = {
      XNXQId: curXNXQId,
      KHKCSJId: kcId || state?.id,
      BJZT: BJZTMC,
      page: 0,
      pageSize: 0,
    };
    const resAll = await getAllClasses(opts);
    if (resAll.status === 'ok' && resAll.data) {
      let newTableDateSource = resAll.data.rows;
      if (BJZTMC === '已开班') {
        setBJCC(newTableDateSource);
      }
      if (origin) {
        newTableDateSource = newTableDateSource.filter((item: any) => {
          return item.KHKCSJ?.SSJGLX === origin;
        });
      }
      setDataSource(newTableDateSource);
    }
  };
  // 获取学年学期信息，同时获取相关课程信息与年级信息
  useEffect(() => {
    (async () => {
      const res = await getAllXXSJPZ({
        XNXQId: curXNXQId,
        XXJBSJId: currentUser?.xxId,
        type: ['1'],
      });
      if (res.status === 'ok') {
        setBMJSSJTime(res.data?.[0]?.JSSJ);
      }
    })();
  }, [curXNXQId]);
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
  // 课程班学生代报名
  const showModalBM = async (value: any) => {
    const res = await getKHBJSJ({
      id: value?.id,
    });
    if (res.status === 'ok') {
      setBjDetails(res.data);
      if (res.data?.KHKCJCs?.length !== 0) {
        let num: number = 0;
        for (let i = 0; i < res.data?.KHKCJCs.length; i += 1) {
          num += Number(res.data?.KHKCJCs[i].JCFY);
        }
        setJFAmount(Number(num).toFixed(2));
      }
    }
    setModalVisible(true);
  };
  // 获取当前课程班报名学生信息，并以弹框展示
  const showModal = async (record: any) => {
    const { BJMC, id } = record;
    const result = await getKHBJSJ({
      id,
    });
    if (result.status === 'ok') {
      setIsModalVisible(true);
      setApplicantData({ BJMC, KCBDatas: result?.data });
    } else {
      message.warning(result.message);
    }
  };
  // 关闭报名列表弹框
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  // 查看、编辑、复制课程班操作
  const handleEdit = async (data: any, type?: any) => {
    const FJS: any[] = [];
    const res = await getKHBJSJ({
      id: data?.id,
    });
    const currentData = res.data;
    currentData.KHBJJs?.forEach((element: { JSLX: string; JZGJBSJId: any }) => {
      if (element.JSLX === '副教师') {
        FJS.push(element?.JZGJBSJId);
      }
    });
    const { BJMC, BJZT, ...info } = currentData;
    const list = {
      ...info,

      BJMC: type === 'copy' ? `${BJMC}-复制` : BJMC,
      BJZT: type === 'copy' ? '未开班' : BJZT,

      ZJS:
        currentData.KHBJJs?.find((item: { JSLX: string }) => item.JSLX === '主教师')?.JZGJBSJId ||
        undefined,
      FJS,
      BMSD: [currentData.BMKSSJ, currentData.BMJSSJ],
      SKSD: [currentData.KKRQ, currentData.JKRQ],
      SSJGLX: currentData?.KHKCSJ?.SSJGLX,
      KHKCSJId: currentData?.KHKCSJ?.id,
    };
    setVisible(true);
    setCurrent(list);
    if (type === 'copy') {
      setCopyType('copy');
      setnames('copy');
      setReadonly(false);
    } else {
      setCopyType('undefined');
      if (!(data.BJZT === '未开班') && !(data.BJZT === '未排课') && !(data.BJZT === '已排课')) {
        setReadonly(true);
        setnames('chakan');
      } else {
        setReadonly(false);
        setnames('add');
      }
    }
  };
  // 显示右侧新增课程班信息弹框
  const showDrawer = () => {
    setVisible(true);
    setCurrent(undefined);
    setReadonly(false);
  };
  // 关闭新增、编辑课程班信息弹框
  const onClose = () => {
    setVisible(false);
  };
  // 课程名称筛选事件
  const onKcmcChange = (value: any) => {
    setKcId(value);
    setKCLY(undefined);
    setBJZTMC(undefined);
  };
  // 课程班排课信息同步事件
  const syncDays = () => {
    if (BJCC?.length) {
      BJCC.forEach(async (v: { id: string }) => {
        await getClassDays(v.id);
      });
    }
  };
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
      title: '费用(元)',
      dataIndex: 'FY',
      key: 'FY',
      align: 'center',
      width: 80,
    },
    {
      title: '报名人数',
      dataIndex: 'BMRS',
      key: 'BMRS',
      align: 'center',
      width: 100,
      render: (text: any, record: any) => {
        return (
          <a onClick={() => showModal(record)}>
            <Tooltip
              title={`班级招生名额为${record?.BJRS || 0}人，已报${record?.xs_count || 0}人。`}
            >
              {record?.xs_count}/{record?.BJRS}
            </Tooltip>
          </a>
        );
      },
    },
    {
      title: '排课',
      align: 'center',
      width: 80,
      dataIndex: 'PK',
      key: 'PK',
      ellipsis: true,
      render: (_, record) => {
        const Url = `/courseManagements/courseScheduling?courseId=${record.id}&xnxqid=${curXNXQId}`;
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
          状态&nbsp;
          <Tooltip
            overlayStyle={{ maxWidth: '30em' }}
            title={
              <>
                <Row>
                  <Col flex="4em" style={{ fontWeight: 'bold' }}>
                    未开班：
                  </Col>
                  <Col flex="auto">仅后台管理员可见</Col>
                </Row>
                <Row>
                  <Col flex="4em" style={{ fontWeight: 'bold' }}>
                    已开班：
                  </Col>
                  <Col flex="auto">家长、教育局端可见</Col>
                </Row>
              </>
            }
          >
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
            {record?.BJZT}
            {new Date(record.BMJSSJ) > new Date(BMJSSJTime) ? (
              <Tooltip
                overlayStyle={{ maxWidth: '30em' }}
                title={<>该课程班报名时段已超出总报名时段，家长、教育局端不可见，请调整</>}
              >
                <ExclamationCircleOutlined style={{ color: '#F04D4D', marginLeft: 4 }} />
              </Tooltip>
            ) : (
              <></>
            )}
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
        const BMJSSJ = new Date(record?.BMJSSJ).getTime();
        const newDate = new Date().getTime();
        return (
          <>
            <ActionBar record={record} handleEdit={handleEdit} actionRef={actionRef} />
            <Divider type="vertical" />
            {record?.BJZT === '已开班' && newDate <= BMJSSJ ? (
              <a
                onClick={() => {
                  showModalBM(record);
                }}
              >
                代报名
              </a>
            ) : (
              <></>
            )}
            {record?.BJZT === '已开班' && newDate > BMJSSJ ? (
              <Tooltip title="该班级已开班，无法报名">
                <span style={{ color: '#999' }}>代报名</span>
              </Tooltip>
            ) : (
              <></>
            )}
          </>
        );
      },
    },
  ];
  return (
    <>
      <PageContainer cls={styles.roomWrapper}>
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
                  <label htmlFor='term'>所属学年学期：</label>
                  <Select
                    value={curXNXQId}
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
                  <label htmlFor='kcname'>课程名称：</label>
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
                  <label htmlFor='kcly'>课程来源：</label>
                  <Select
                    allowClear
                    placeholder="课程来源"
                    onChange={(value) => {
                      setKCLY(value);
                      setBJZTMC(undefined);
                    }}
                    value={KCLY}
                  >
                    <Option value='校内课程' key='校内课程'>
                      校内课程
                    </Option>
                    <Option value='机构课程' key='机构课程'>
                      机构课程
                    </Option>
                  </Select>
                </div>
                <div>
                  <label htmlFor='status'>班级状态：</label>
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
                  </Select>
                </div>
              </SearchLayout>
            </>
          }
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
          actionRef={actionRef}
          visible={visible}
          onClose={onClose}
          formValues={current}
          readonly={readonly}
          mcData={mcData}
          names={names}
          KHKCAllData={KHKCAllData}
          curXNXQId={curXNXQId}
          currentUser={currentUser}
          CopyType={CopyType}
        />
        <PromptInformation
          text="未查询到学年学期数据，请先设置学年学期"
          link="/basicalSettings/termManagement"
          open={kai}
          colse={kaiguan}
        />
        <PromptInformation
          text="未查询到课程名称，请先设置课程"
          link=""
          open={tips}
          colse={clstips}
        />
        <Modal
          title="报名列表"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          style={{ minWidth: '750px' }}
        >
          <ApplicantInfoTable dataSource={applicantData} actionRefs={actionRef} />
        </Modal>
        <AgentRegistration
          curXNXQId={curXNXQId}
          JFTotalost={JFAmount}
          BjDetails={BjDetails}
          ModalVisible={modalVisible}
          setModalVisible={setModalVisible}
          actionRef={actionRef}
        />
      </PageContainer>
    </>
  );
};

export default CourseManagement;
