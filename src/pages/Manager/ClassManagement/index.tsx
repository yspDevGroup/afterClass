/* eslint-disable no-console */
import React from 'react';
import { Link } from 'umi';
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
import SearchComponent from '@/components/Search';
import PageContainer from '@/components/PageContainer';
import PromptInformation from '@/components/PromptInformation';
import type { SearchDataType } from '@/components/Search/data';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';

import styles from './index.less';
import { searchData } from './searchConfig';
import ActionBar from './components/ActionBar';
import AddCourse from './components/AddCourse';
import type { CourseItem, TableListParams } from './data';
import ApplicantInfoTable from './components/ApplicantInfoTable';
import moment from 'moment';
// import WWOpenDataCom from './components/WWOpenDataCom';
const { Option } = Select;

const CourseManagement = () => {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<CourseItem>();
  const actionRef = useRef<ActionType>();
  const [dataSource, setDataSource] = useState<SearchDataType>(searchData);
  const [readonly, stereadonly] = useState<boolean>(false);
  const [xn, setxn] = useState<string>('');
  const [xq, setxq] = useState<string>('');
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
      const res = await queryXNXQList();
      const newData = res.xnxqList;
      const curTerm = res.current;
      const defaultData = [...searchData];
      if (newData.data && newData.data.length) {
        if (curTerm) {
          await setxn(curTerm.XN);
          await setxq(curTerm.XQ);
          actionRef.current?.reload();
          const chainSel = defaultData.find((item) => item.type === 'chainSelect');
          if (chainSel && chainSel.defaultValue) {
            chainSel.defaultValue.first = curTerm.XN;
            chainSel.defaultValue.second = curTerm.XQ;
            await setDataSource(defaultData);
            chainSel.data = newData;
          }
          const ress = getAllKHKCSJ({
            name: '',
            xn: curTerm.XN,
            xq: curTerm.XQ,
            page: 1,
            pageCount: 0,
            isReuired: false,
          });
          Promise.resolve(ress).then((dataes: any) => {
            if (dataes.status === 'ok') {
              const njArry: { label: string; value: string }[] = [];
              dataes.data.forEach((item: any) => {
                njArry.push({
                  label: item.KCMC,
                  value: item.id,
                });
              });
              setmcData(njArry);
              setKHKCAllData(dataes.data);
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
    if (xn && xq) {
      setTimeout(() => {
        actionRef.current?.reload();
      }, 0);
    }
  }, [xn, xq]);
  // 头部input事件
  const handlerSearch = (type: string, value: string, term: string) => {
    if (type === 'year' || type === 'term') {
      setxn(value);
      setxq(term);
      const ress = getAllKHKCSJ({ name: '', xn: value, xq: term, page: 0, pageCount: 0 });
      Promise.resolve(ress).then((dataes: any) => {
        if (dataes.status === 'ok') {
          const njArry: { label: string; value: string }[] = [];
          dataes.data.map((item: any) => {
            return njArry.push({
              label: item.KCMC,
              value: item.id,
            });
          });
          setmcData(njArry);
          setKHKCAllData(dataes.data);
        }
      });
      actionRef.current?.reload();
    }
    if (type === 'customSearch') {
      setName(value);
    }
    actionRef.current?.reload();
  };

  const showDrawer = () => {
    setVisible(true);
    setCurrent(undefined);
    stereadonly(false);
  };

  const handleEdit = (data: any) => {
    const list = {
      ...data,
      XQ: data.XQ ? data.XQ?.split(',') : [],
      NJS: data.NJS ? data.NJS?.split(',') : [],
      NJSName: data.NJSName ? data.NJSName?.split(',') : [],
      XQName: data.XQName ? data.XQName?.split(',') : [],
      ZJS: data.ZJS || undefined,
      FJS: data.FJS ? data.FJS?.split(',') : [],
      BMSD: [data.BMKSSJ || data.KHKCSJ.BMKSSJ, data.BMJSSJ || data.KHKCSJ.BMJSSJ],
      SKSD: [data.JKRQ || data.KHKCSJ.JKRQ, data.KKRQ || data.KHKCSJ.KKRQ],
    };
    setVisible(true);
    setCurrent(list);
    if (
      !(data.BJZT === '待发布') &&
      !(data.BJZT === '未排课') &&
      !(data.BJZT === '已下架') &&
      !(data.BJZT === '已排课')
    ) {
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
  const toDay = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const columns: ProColumns<CourseItem>[] = [
    // {
    //   title: '序号',
    //   dataIndex: 'index',
    //   key: 'index',
    //   valueType: 'index',
    //   width: 48,
    //   align: 'center',
    // },
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
      render: (text: any, record: any) => {
        return (
          <Tooltip title={record.KHKCSJ.KCMC}>
            <div className="ui-table-col-elp">{record.KHKCSJ.KCMC}</div>
          </Tooltip>
        );
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
    // {
    //   title: '主班',
    //   dataIndex: 'ZJS',
    //   key: 'ZJS',
    //   align: 'center',
    //   width: '10%',
    //   render: (_, record) => {
    //     return (
    //       <div>
    //         <WWOpenDataCom type="userName" openid={record.ZJS} />
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: '所属校区',
    //   align: 'center',
    //   dataIndex: 'XQName',
    //   key: 'XQName',
    //   ellipsis: true,
    // },
    {
      title: '适用年级',
      dataIndex: 'NJSName',
      key: 'NJSName',
      align: 'center',
      ellipsis: true,
      render: (_, record) => {
        return (
          <div className="ui-table-col-elp">
            <Tooltip title={record.NJSName} arrowPointAtCenter>
              {record.NJSName?.split(',')?.map((item: any) => {
                return <Tag>{item}</Tag>;
              })}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: '排课',
      align: 'center',
      width: 100,
      render: (_, record) => {
        const Url = `/courseScheduling?courseId=${record.id}&xn=${xn}&xq=${xq}`;
        if (record.BJZT === '待发布' || record.BJZT === '已下架') {
          if (record.KHPKSJs && record.KHPKSJs?.length === 0) {
            return <Link to={Url}>未排课</Link>;
          }
          return <Link to={Url}>已排课</Link>;
        }
        return <>已排课</>;
      },
    },
    {
      title: '发布状态',
      dataIndex: 'BJZT',
      key: 'BJZT',
      align: 'center',
      width: 100,
    },
    {
      title: '课程状态',
      dataIndex: 'KCZT',
      key: 'KCZT',
      align: 'center',
      width: 100,
      render: (text: any, record: any) => {
        if (record.BJZT === '已发布') {
          const { BMJSSJ, BMKSSJ, KHKCSJ } = record;
          // 报名开始时间
          const BMStartDate = BMKSSJ || KHKCSJ?.BMKSSJ;
          // 报名结束时间
          const BMEndDate = BMJSSJ || KHKCSJ?.BMJSSJ;
          if (BMStartDate > toDay) {
            return <div>未报名</div>;
          }
          if (toDay > BMStartDate && toDay < BMEndDate) {
            return <div>报名中</div>;
          }
          if (toDay < BMEndDate && toDay > KHKCSJ?.KKRQ) {
            return <div>未开课</div>;
          }
          if (toDay > KHKCSJ?.KKRQ && toDay < KHKCSJ?.JKRQ) {
            return <div>开课中</div>;
          }
          if (toDay > KHKCSJ?.JKRQ) {
            return <div>已结课</div>;
          }
        }
        return <>-</>;
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 150,
      align: 'center',
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
          request={async (param, sorter, filter) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            const opts: TableListParams = {
              ...param,
              sorter: sorter && Object.keys(sorter).length ? sorter : undefined,
              filter,
            };
            if (xn && xq) {
              const obj = {
                xn,
                xq,
                kcId,
                page: 1,
                pageCount: 0,
                name,
              };
              const res = await getAllKHBJSJ(obj, opts);
              return res;
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
              <SearchComponent
                dataSource={dataSource}
                onChange={(type: string, value: string, trem: string) =>
                  handlerSearch(type, value, trem)
                }
              />
              <div style={{ display: 'flex', lineHeight: '32px', marginLeft: 15 }}>
                <span style={{ fontSize: 14, color: '#666' }}>课程名称：</span>
                <div>
                  <Select
                    style={{ width: 200 }}
                    value={kcId || undefined}
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
        />
        <PromptInformation
          text="未查询到学年学期数据，请设置学年学期后再来"
          link="/basicalSettings/termManagement"
          open={kai}
          colse={kaiguan}
        />
        <PromptInformation
          text="未查询到课程名称，请设置课程后再来"
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
