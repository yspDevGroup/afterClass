/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import React from 'react';
import { Link, useModel } from 'umi';
import { useRef, useState, useEffect } from 'react';
import { Button, Modal, Tag, Tooltip, Select } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { getAllKHBJSJ } from '@/services/after-class/khbjsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getAllKHKCSJ } from '@/services/after-class/khkcsj';
import { theme } from '@/theme-default';
import { paginationConfig } from '@/constant';
import PageContainer from '@/components/PageContainer';
import PromptInformation from '@/components/PromptInformation';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import styles from './index.less';
import ActionBar from './components/ActionBar';
import AddCourse from './components/AddCourse';
import type { CourseItem } from './data';
import ApplicantInfoTable from './components/ApplicantInfoTable';

const { Option } = Select;

const CourseManagement = (props: { location: { state: any } }) => {
  const { state } = props.location;
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<CourseItem>();
  const actionRef = useRef<ActionType>();
  const [readonly, stereadonly] = useState<boolean>(false);
  const [curXNXQId, setCurXNXQId] = useState<any>();
  const [termList, setTermList] = useState<any>();
  const [kcId, setkcId] = useState<string>('');
  // 查询课程名称
  const [mcData, setmcData] = useState<{ label: string; value: string }[]>([]);
  const [name, setName] = useState<string>('');
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
  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      await initWXAgentConfig(['checkJsApi']);
    })();
  }, []);

  const showModal = (record: any) => {
    const { BJMC, XQName, KHXSBJs } = record;
    setApplicantData({ KHXSBJs, BJMC, XQName });
    setIsModalVisible(true);
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
          // actionRef.current?.reload();
          const ress = getAllKHKCSJ({
            page: 1,
            pageSize: 0,
            isRequired: false,
            XXJBSJId: currentUser?.xxId,
          });
          Promise.resolve(ress).then((dataes: any) => {
            if (dataes.status === 'ok') {
              const njArry: { label: string; value: string }[] = [];
              dataes.data.rows.forEach((item: any) => {
                njArry.push({
                  label: item.KCMC,
                  value: item.id,
                });
              });
              setmcData(njArry);
              setKHKCAllData(dataes.data.rows);
            }
          });
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

  const handleEdit = (data: any) => {
    const FJS =
      data.KHBJJs?.length > 0
        ? data.KHBJJs?.map((item: any) => {
            if (item.JSLX === '副教师') {
              return item?.KHJSSJId;
            }
          })
        : [];
    const list = {
      ...data,
      XQID: data.XQ ? data.XQ : [],
      NJSID: data.NJS ? data.NJS : [],
      NJS: data.NJSName ? data.NJSName : [],
      XQ: data.XQName ? data.XQName : [],
      ZJS:
        data.KHBJJs?.find((item: { JSLX: string }) => item.JSLX === '主教师')?.KHJSSJId ||
        undefined,
      FJS,
      BMSD: [data.BMKSSJ || data.KHKCSJ.BMKSSJ, data.BMJSSJ || data.KHKCSJ.BMJSSJ],
      SKSD: [data.KKRQ || data.KHKCSJ.KKRQ, data.JKRQ || data.KHKCSJ.JKRQ],
      SSJGLX: data?.KHKCSJ?.SSJGLX,
      KHKCSJId: data?.KHKCSJ?.id,
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
  const columns: ProColumns<CourseItem>[] = [
    {
      title: '班级名称',
      dataIndex: 'BJMC',
      key: 'BJMC',
      align: 'center',
      width: 180,
    },
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      key: 'KCMC',
      align: 'center',
      width: 150,
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
      width: 100,
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
            {record.KHXSBJs.length}/{record.BJRS}
          </a>
        );
      },
    },
    {
      title: '排课',
      align: 'center',
      width: 100,
      render: (_, record) => {
        const Url = `/courseScheduling?courseId=${record.id}&xnxqid=${curXNXQId}`;
        if (record.BJZT === '待开班') {
          if (record.KHPKSJs && record.KHPKSJs?.length === 0) {
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
      width: 150,
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
          request={async (param) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            if (curXNXQId) {
              const obj = {
                XNXQId: curXNXQId,
                kcId: kcId || state?.id,
                page: param.current,
                pageSize: param.pageSize,
                name,
              };
              const res = await getAllKHBJSJ(obj);
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
          pagination={paginationConfig}
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
                setCurrent(undefined);
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
          width="40vw"
        >
          <ApplicantInfoTable dataSource={applicantData} />
        </Modal>
      </PageContainer>
    </>
  );
};

export default CourseManagement;
