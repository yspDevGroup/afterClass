/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import React from 'react';
import { Link, useModel } from 'umi';
import { useRef, useState, useEffect } from 'react';
import { Button, Modal, Tooltip, Select, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { theme } from '@/theme-default';
// import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
// import { paginationConfig } from '@/constant';
import PageContainer from '@/components/PageContainer';
import PromptInformation from '@/components/PromptInformation';

import { getAllCourses } from '@/services/after-class/khkcsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getAllClasses, getEnrolled, getKHBJSJ } from '@/services/after-class/khbjsj';

import ActionBar from './components/ActionBar';
import AddCourse from './components/AddCourse';
import type { CourseItem } from './data';
import ApplicantInfoTable from './components/ApplicantInfoTable';

import styles from './index.less';

const { Option } = Select;

const CourseManagement = (props: { location: { state: any } }) => {
  const { state } = props.location;
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<any>();
  const actionRef = useRef<ActionType>();
  const [readonly, stereadonly] = useState<boolean>(false);
  const [curXNXQId, setCurXNXQId] = useState<any>();
  const [termList, setTermList] = useState<any>();
  const [kcId, setkcId] = useState<string>('');
  // 查询课程名称
  const [mcData, setmcData] = useState<{ label: string; value: string }[]>([]);
  // 控制提示开关
  const [tips, setTips] = useState<boolean>(false);
  // 学期学年没有数据时提示的开关
  const [kai, setkai] = useState<boolean>(false);
  // 报名列表数据
  const [applicantData, setApplicantData] = useState<any>({});

  // 控制学期学年数据提示框的函数
  const kaiguan = () => {
    setkai(false);
  };
  const clstips = () => {
    setTips(false);
  };
  // 弹框名称设定
  const [names, setnames] = useState<string>('bianji');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [KHKCAllData, setKHKCAllData] = useState<any>([]);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // useEffect(() => {
  //   (async () => {
  //     if (/MicroMessenger/i.test(navigator.userAgent)) {
  //       await initWXConfig(['checkJsApi']);
  //     }
  //     await initWXAgentConfig(['checkJsApi']);
  //   })();
  // }, []);

  const showModal = async (record: any) => {
    const { BJMC, id } = record;
    const res = await getEnrolled({
      id
    });
    if (res.status === 'ok') {
      setIsModalVisible(true);
      setApplicantData({ BJMC, KHXSBJs: res.data||[] });
    }else{
      message.warning(res.message);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  useEffect(() => {
    if (mcData === []) {
      return setTips(true);
    }
    return setTips(false);
  }, [mcData]);

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
            const njArry: { label: string; value: string }[] = [];
            ress?.data?.rows?.forEach((item: any) => {
              njArry.push({
                label: item.KCMC,
                value: item.id,
              });
            });
            setmcData(njArry);
            setKHKCAllData(ress.data.rows);
          }
        }
      } else {
        setkai(true);
      }
    }
    fetchData();
  }, []);
  // 监听学年学期更新
  useEffect(() => {
    if (curXNXQId) {
      setTimeout(() => {
        actionRef.current?.reload();
      }, 0);
    }
  }, [curXNXQId]);

  const showDrawer = () => {
    setVisible(true);
    setCurrent(undefined);
    stereadonly(false);
  };

  const handleEdit = async (data: any) => {
    const FJS: any[] = [];
    const res = await getKHBJSJ({
      id: data?.id
    });
    const current = res.data;

    current.KHBJJs?.map((item: any) => {
      if (item.JSLX === '副教师') {
        FJS.push(item?.JZGJBSJId);
      }
    });
    const list = {
      ...current,
      ZJS:
        current.KHBJJs?.find((item: { JSLX: string }) => item.JSLX === '主教师')?.JZGJBSJId ||
        undefined,
      FJS,
      BMSD: [current.BMKSSJ, current.KHKCSJ.BMJSSJ],
      SKSD: [current.KKRQ, current.JKRQ],
      SSJGLX: current?.KHKCSJ?.SSJGLX,
      KHKCSJId: current?.KHKCSJ?.id,
    };
    setVisible(true);
    setCurrent(list);
    if (!(data.BJZT === '待开班') && !(data.BJZT === '未排课') && !(data.BJZT === '已排课')) {
      stereadonly(true);
      setnames('chakan');
    } else {
      stereadonly(false);
      setnames('add');
    }
  };

  const onClose = () => {
    setVisible(false);
  };
  // const toDay = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      fixed:'left',
      align: 'center',
    },
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      key: 'KCMC',
      align: 'center',
      width: 150,
      fixed:'left',
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
      render: (_, record) => {
        const Url = `/courseScheduling?courseId=${record.id}&xnxqid=${curXNXQId}`;
        if (record.BJZT === '待开班') {
          if (record.pk_count === 0) {
            return <Link to={Url}>未排课</Link>;
          }
          return <Link to={Url}>已排课</Link>;
        }
        return <>已排课</>;
      },
    },
    {
      title: '班级状态',
      dataIndex: 'BJZT',
      key: 'BJZT',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 120,
      fixed:'right',
      render: (_, record) => {
        return (
          <>
            <ActionBar record={record} handleEdit={handleEdit} actionRef={actionRef} />
          </>
        );
      },
    },
  ];
  const onBjmcChange = async (value: any) => {
    setkcId(value);
    actionRef.current?.reload();
  };
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
          scroll={{ x: 1200 }}
          request={async (param) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            if (curXNXQId) {
              const obj = {
                XNXQId: curXNXQId,
                KHKCSJId: kcId || state?.id,
                page: 0,
                pageSize: 0,
              };
              const res = await getAllClasses(obj);
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
            <div style={{ display: 'flex' }}>
              <span style={{ fontSize: 14, color: '#666' }}>
                所属学年学期：
                <Select
                  value={curXNXQId}
                  style={{ width: 200 }}
                  onChange={(value: string) => {
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
              </span>
              <div
                style={{ display: 'flex', lineHeight: '32px', marginLeft: 15, flexWrap: 'wrap' }}
              >
                <span style={{ fontSize: 14, color: '#666' }}>课程名称：</span>
                <div>
                  <Select
                    style={{ width: 200 }}
                    value={kcId || state?.id}
                    allowClear
                    placeholder="请选择"
                    onChange={onBjmcChange}
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
              </div>
            </div>
          }
          toolBarRender={() => [
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
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          style={{minWidth: '750px'}}
        >
          <ApplicantInfoTable dataSource={applicantData} />
        </Modal>
      </PageContainer>
    </>
  );
};

export default CourseManagement;
