import PageContainer from '@/components/PageContainer';
import { useEffect, useState } from 'react';
import { Button, message, Spin, Tabs } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import { Link, useModel } from 'umi';
import { Select } from 'antd';
import ProTable from '@ant-design/pro-table';
import Style from './index.less';
import type { TableItem } from './data';
import { getTableWidth } from '@/utils/utils';
import amountImg from '@/assets/amount.png';
import personImg from '@/assets/person.png';
import classImg from '@/assets/class.png';
import refundImg from '@/assets/refund.png';
import SearchLayout from '@/components/Search/Layout';
import SemesterSelect from '@/components/Search/SemesterSelect';
import { getAllKHKCLX } from '@/services/after-class/khkclx';
import {
  exportServiceEnroll,
  getFWClasses,
  getFWTJByXZB,
  statisticalKHFWBJ,
  statisticalKHFWXZB,
  summaryFWBTJ,
} from '@/services/after-class/reports';
import { getAllBJSJ } from '@/services/after-class/bjsj';
import { getGradesByCampus } from '@/services/after-class/njsj';
import { getAllXQSJ } from '@/services/after-class/xqsj';
import { DownloadOutlined } from '@ant-design/icons';

type selectType = { label: string; value: string };

const { Option } = Select;
const { TabPane } = Tabs;

const AfterSchoolCourse: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [key, setKey] = useState<string>('1');
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 选择学年学期
  const [classXNXQId, setClassXNXQId] = useState<any>();
  // 表格数据源
  const [dataSource, setDataSource] = useState<any>([]);
  // 表格数据源
  const [classSource, setClassSource] = useState<any>([]);
  const [collectData, setCollectData] = useState<any>();
  // const [kcmc, setKcmc] = useState<any>();
  const kcmc = '';
  // const [kcmcValue, setKcmcValue] = useState<any>();
  const kcmcValue = '';
  // 课程类型
  // const [KCLXId, setKCLXId] = useState<string | undefined>();
  const KCLXId = '';
  const [KCLXData, setKCLXData] = useState<selectType[] | undefined>();
  // 校区
  const [campusId, setCampusId] = useState<string>();
  const [campusData, setCampusData] = useState<any[]>();
  const [NjId, setNjId] = useState<any>();
  const [NjData, setNjData] = useState<any>();
  const [BJId, setBJId] = useState<string | undefined>(undefined);
  const [bjData, setBJData] = useState<selectType[] | undefined>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getCampusData = async () => {
    const res = await getAllXQSJ({
      XXJBSJId: currentUser?.xxId,
    });
    if (res?.status === 'ok') {
      const arr = res?.data?.map((item: any) => {
        return {
          label: item.XQMC,
          value: item.id,
        };
      });
      // if (arr?.length) {
      //   setCampusId(arr?.[0].value);
      // }
      setCampusData(arr);
    }
  };

  const getNJSJ = async () => {
    if (campusId) {
      const res = await getGradesByCampus({
        XQSJId: campusId,
      });
      if (res.status === 'ok') {
        setNjData(res.data);
      }
    }
  };
  const getBJSJ = async () => {
    const res = await getAllBJSJ({ XQSJId: campusId, njId: NjId, page: 0, pageSize: 0 });
    if (res.status === 'ok') {
      const data = res.data?.rows?.map((item: any) => {
        return { label: item.BJ, value: item.id };
      });
      setBJData(data);
    }
  };
  // 课程维度table表格数据
  const columns: ProColumns<TableItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      fixed: 'left',
      align: 'center',
    },
    {
      title: '服务班名称',
      dataIndex: 'BJMC',
      key: 'BJMC',
      fixed: 'left',
      align: 'center',
      width: 120,
      ellipsis: true,
    },
    {
      title: '课程类型',
      dataIndex: 'KCTAG',
      key: 'KCTAG',
      align: 'center',
      width: 120,
      ellipsis: true,
    },
    {
      title: '报名人次',
      dataIndex: 'BMRS',
      key: 'BMRS',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '退课人次',
      dataIndex: 'TKRS',
      key: 'TKRS',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '退课比例',
      dataIndex: 'TKBL',
      key: 'TKBL',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (test: any, record: any) => {
        const num =
          Number(record.TKRS) !== 0
            ? `${((Number(record.TKRS) / Number(record.BMRS)) * 100).toFixed(1)} % `
            : 0;
        return num;
      },
    },
    {
      title: '收款金额',
      dataIndex: 'SKJE',
      key: 'SKJE',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '退款金额',
      dataIndex: 'TKJE',
      key: 'TKJE',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    // {
    //   title: '操作',
    //   dataIndex: 'operation',
    //   key: 'operation',
    //   align: 'center',
    //   width: 90,
    //   ellipsis: true,
    //   fixed: 'right',
    //   render: (_, record) => (
    //     <>
    //       <Link
    //         to={{
    //           pathname: '/statistics/afterSchoolCourse/detail',
    //           state: {
    //             type: 'detail',
    //             data: record,
    //           },
    //         }}
    //       >
    //         详情
    //       </Link>
    //     </>
    //   ),
    // },
  ];
  // 行政班维度table表格数据
  const classColumns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      fixed: 'left',
      align: 'center',
    },
    {
      title: '行政班名称',
      dataIndex: 'BJSJ',
      key: 'BJSJ',
      align: 'center',
      width: 160,
      ellipsis: true,
      render: (_, record) => {
        return <>{`${record?.BJSJ?.NJSJ?.XD} ${record?.BJSJ?.NJSJ?.NJMC} ${record?.BJSJ?.BJ}`}</>;
      },
    },
    {
      title: '课后服务名称',
      dataIndex: 'FWMC',
      key: 'FWMC',
      fixed: 'left',
      align: 'center',
      width: 120,
      ellipsis: true,
    },
    {
      title: '报名人次',
      dataIndex: 'BMRS',
      key: 'BMRS',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '退课人次',
      dataIndex: 'TKRS',
      key: 'TKRS',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '退课比例',
      dataIndex: 'TKBL',
      key: 'TKBL',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (test: any, record: any) => {
        const num =
          Number(record.TKRS) !== 0
            ? `${((Number(record.TKRS) / Number(record.BMRS)) * 100).toFixed(1)} % `
            : 0;
        return num;
      },
    },
    {
      title: '收款金额',
      dataIndex: 'SKJE',
      key: 'SKJE',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '退款金额',
      dataIndex: 'TKJE',
      key: 'TKJE',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 100,
      render: (_, record) => {
        return (
          <Link
            key="details"
            to={{
              pathname: '/statistics/afterServiceCourse/details',
              state: record,
            }}
          >
            详情
          </Link>
        );
      },
    },
  ];

  const getData = async (nowKey?: string) => {
    const kclxItem = KCLXData?.find((item: any) => item.value === KCLXId)?.label;
    let res3;
    const newKey = nowKey || key;
    if (newKey === '1') {
      res3 = await getFWClasses({
        XNXQId: curXNXQId,
        KCTAG: kclxItem,
        KHBJSJId: kcmcValue,
        page: 0,
        pageSize: 0,
      });
      if (res3.status === 'ok') {
        setDataSource(res3?.data?.rows);
      }
    } else {
      res3 = await getFWTJByXZB({
        XNXQId: classXNXQId,
        XQSJId: campusId,
        NJSJId: NjId,
        BJSJId: BJId,
        page: 0,
        pageSize: 0,
      });
      if (res3.status === 'ok') {
        setClassSource(res3?.data?.rows);
      }
    }
  };
  const getCollect = async (nowKey?: string) => {
    const newKey = nowKey || key;
    if (nowKey) {
      setCampusId(undefined);
      setNjId(undefined);
    }
    // const kclxItem = KCLXData?.find((item: any) => item.value === KCLXId)?.label;
    const res = await summaryFWBTJ({
      XNXQId: newKey === '2' ? classXNXQId : curXNXQId,
      XQSJId: nowKey ? '' : campusId,
      NJSJId: nowKey ? '' : NjId,
      BJSJId: nowKey ? '' : BJId,
    });
    if (res.status === 'ok') {
      setCollectData(res?.data);
    }
  };
  /**
   * 获取课程类型数据
   */
  const getKCLXData = async () => {
    const res = await getAllKHKCLX({});
    if (res.status === 'ok') {
      const KCLXItem: any = res.data?.map((item: any) => ({
        value: item.id,
        label: item.KCTAG,
      }));
      setKCLXData(KCLXItem);
    }
  };
  useEffect(() => {
    getKCLXData();
    getCampusData();
  }, []);
  // 学年学期变化
  useEffect(() => {
    if (curXNXQId || classXNXQId) {
      getData();
      getCollect();
    }
  }, [curXNXQId, classXNXQId, kcmcValue, kcmc, KCLXId, BJId, NjId, campusId]);
  useEffect(() => {
    if (NjId) {
      setBJId(undefined);
      getBJSJ();
    }
  }, [NjId, campusId]);
  useEffect(() => {
    if (campusId) {
      getNJSJ();
      setBJId(undefined);
      setNjId(undefined);
    }
  }, [campusId]);
  const onCampusChange = (value: any) => {
    setCampusId(value);
  };
  const onBjChange = async (value: any) => {
    setBJId(value);
  };
  const onNjChange = async (value: any) => {
    setNjId(value);
  };
  const submit = async () => {
    let res;
    if (key === '1') {
      res = await statisticalKHFWBJ({
        XNXQId: curXNXQId,
        XXJBSJId: currentUser?.xxId,
      });
    } else {
      res = await statisticalKHFWXZB({
        XNXQId: classXNXQId,
        XXJBSJId: currentUser?.xxId,
      });
    }
    if (res.status === 'ok') {
      getData();
      getCollect();
      message.success('刷新完成');
    }
  };

  const onExportClick = () => {
    setLoading(true);
    (async () => {
      const res = await exportServiceEnroll({
        XNXQId: curXNXQId,
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
    // PageContainer组件是顶部的信息
    <Spin spinning={loading}>
      <PageContainer>
        <div className={Style.TopCards}>
          <div>
            <div>
              <span>
                <img src={classImg} />
              </span>
              <div>
                <h3>{collectData?.count || 0}</h3>
                <p>行政班数</p>
              </div>
            </div>
          </div>
          <div>
            <div>
              <span>
                <img src={personImg} />
              </span>
              <div>
                <h3>{collectData?.bmrs_count || 0}</h3>
                <p>报名累计人次</p>
              </div>
            </div>
          </div>
          <div>
            <div>
              <span>
                <img src={personImg} />
              </span>
              <div>
                <h3>{collectData?.tkrs_count || 0}</h3>
                <p>退课累计人次</p>
              </div>
            </div>
          </div>
          <div>
            <div>
              <span>
                <img src={amountImg} />
              </span>
              <div>
                <h3>{collectData?.skje_count ? Number(collectData?.skje_count).toFixed(2) : 0}</h3>
                <p>收款累计金额</p>
              </div>
            </div>
          </div>
          <div>
            <div>
              <span>
                <img src={refundImg} />
              </span>
              <div>
                <h3>{collectData?.tkje_count ? Number(collectData?.tkje_count).toFixed(2) : 0}</h3>
                <p>退款累计金额</p>
              </div>
            </div>
          </div>
        </div>
        <div className={Style.AfterSchoolCourse}>
          <p className={Style.title}>
            <span>系统每天凌晨自动更新一次，如需立即更新，请点击【刷新】按钮</span>
            <Button type="primary" onClick={submit}>
              刷新
            </Button>
            <Button icon={<DownloadOutlined />} type="primary" onClick={onExportClick}>
              导出
            </Button>
          </p>
          <Tabs
            onChange={(value) => {
              setKey(value);
              getData(value);
              getCollect(value);
            }}
            defaultActiveKey={key}
          >
            <TabPane tab="按课程班统计" key="1">
              <ProTable
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                search={false}
                pagination={{
                  showQuickJumper: true,
                  pageSize: 10,
                  defaultCurrent: 1,
                }}
                headerTitle={
                  <SearchLayout>
                    <SemesterSelect
                      XXJBSJId={currentUser?.xxId}
                      onChange={(value: string) => {
                        // 选择不同学期从新更新页面的数据
                        setCurXNXQId(value);
                      }}
                    />
                  </SearchLayout>
                }
                scroll={{ x: getTableWidth(columns) }}
                options={{
                  setting: false,
                  fullScreen: false,
                  density: false,
                  reload: false,
                }}
              />
            </TabPane>
            <TabPane tab="按行政班统计" key="2">
              <ProTable
                columns={classColumns}
                dataSource={classSource}
                rowKey="id"
                search={false}
                pagination={{
                  showQuickJumper: true,
                  pageSize: 10,
                  defaultCurrent: 1,
                }}
                headerTitle={
                  <SearchLayout>
                    <SemesterSelect
                      XXJBSJId={currentUser?.xxId}
                      onChange={(value: string) => {
                        // 选择不同学期从新更新页面的数据
                        setClassXNXQId(value);
                      }}
                    />
                    <div>
                      <label htmlFor="grade">校区名称：</label>
                      <Select value={campusId} placeholder="请选择" onChange={onCampusChange}>
                        {campusData?.map((item: any) => {
                          return <Option value={item.value}>{item.label}</Option>;
                        })}
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="grade">年级名称：</label>
                      <Select value={NjId} allowClear placeholder="请选择" onChange={onNjChange}>
                        {NjData?.map((item: any) => {
                          return <Option value={item.id}>{`${item.XD}${item.NJMC}`}</Option>;
                        })}
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="kcly">班级名称：</label>
                      <Select value={BJId} allowClear placeholder="班级名称" onChange={onBjChange}>
                        {bjData?.map((item: any) => {
                          return (
                            <Option value={item.value} key={item.value}>
                              {item.label}
                            </Option>
                          );
                        })}
                      </Select>
                    </div>
                  </SearchLayout>
                }
                scroll={{ x: getTableWidth(columns) }}
                options={{
                  setting: false,
                  fullScreen: false,
                  density: false,
                  reload: false,
                }}
              />
            </TabPane>
          </Tabs>
        </div>
      </PageContainer>
    </Spin>
  );
};
export default AfterSchoolCourse;
