import PageContain from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { Select, Space, message, Tooltip, Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, useModel } from 'umi';
import styles from './index.less';
import { getAllBJSJ, getKHFWBJXSbm } from '@/services/after-class/bjsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getAllXQSJ } from '@/services/after-class/xqsj';
// import { getAllGrades } from '@/services/after-class/khjyjg';
import SearchLayout from '@/components/Search/Layout';
import { getGradesByCampus } from '@/services/after-class/njsj';
import ConfigureService from './ConfigureService';
import { bulkEditKHFWBJZT, updateKHFWBJ } from '@/services/after-class/khfwbj';
import ClassSeviveDetail from './ClassSeviveDetail';
import UpdateCourses from './UpdateCourses';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ConfigureServiceBatch from './ConfigureServicebatch';

type selectType = { label: string; value: string };

const { Option } = Select;
const AdministrationClassManagement = () => {
  const actionRef = useRef<ActionType>();
  const [NjId, setNjId] = useState<any>();
  const [NjData, setNjData] = useState<any>();
  // 校区
  const [campusId, setCampusId] = useState<string>();
  const [campusData, setCampusData] = useState<any[]>();

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [curXNXQId, setCurXNXQId] = useState<string | undefined>(undefined);
  const [curXNXQData, setCurXNXQData] = useState<any[]>();
  const [bjData, setBJData] = useState<selectType[] | undefined>([]);
  const [BJId, setBJId] = useState<string | undefined>(undefined);
  const [XQData, setXQData] = useState<any | undefined>();

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
      if (arr?.length) {
        let id = arr?.find((item: any) => item.label === '本校')?.value;
        if (!id) {
          id = arr[0].value;
        }
        setCampusId(id);
      }
      setCampusData(arr);
    }
  };

  useEffect(() => {
    (async () => {
      const result = await queryXNXQList(currentUser?.xxId);
      if (result?.current) {
        // console.log('result',result)
        setXQData(result?.current);
        setCurXNXQId(result?.current?.id);
        setCurXNXQData(result?.data);
      }
    })();
    getCampusData();
  }, []);

  const getNJSJ = async () => {
    if (campusId) {
      const res = await getGradesByCampus({
        XQSJId: campusId,
      });
      if (res.status === 'ok') {
        // console.log('res', res);
        setNjData(res.data);
      }
    }
  };

  useEffect(() => {
    if (campusId) {
      getNJSJ();
      setBJId(undefined);
      setNjId(undefined);
      actionRef.current?.reloadAndRest();
    }
  }, [campusId]);

  const onBjChange = async (value: any) => {
    setBJId(value);
    actionRef.current?.reloadAndRest();
  };
  const onNjChange = async (value: any) => {
    setNjId(value);
    actionRef.current?.reloadAndRest();
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

  useEffect(() => {
    if (NjId) {
      setBJId(undefined);
      getBJSJ();
    }
  }, [NjId, campusId, curXNXQId]);

  //  发布取消发布
  const onReleaseClick = async (id: string, flag: boolean) => {
    const res = await updateKHFWBJ({ id }, { ZT: flag ? 1 : 0, XNXQId: curXNXQId });
    if (res.status === 'ok') {
      message.success(flag ? '发布成功' : '取消成功');
      actionRef.current?.reloadAndRest();
    } else {
      message.error(res.message);
    }
  };

  // 获取取消发布 发布按钮
  const getSetting = (record: any) => {
    if (record?.KHFWBJs?.length) {
      if (record?.KHFWBJs[0]?.ZT === 0) {
        return (
          <a
            onClick={() => {
              onReleaseClick(record?.KHFWBJs[0]?.id, true);
            }}
          >
            {' '}
            发布
          </a>
        );
      }
      return (
        <a
          type="link"
          onClick={() => {
            onReleaseClick(record?.KHFWBJs[0]?.id, false);
          }}
        >
          取消发布
        </a>
      );
    }
    return '';
  };
  const getSelctCourse = (record: any) => {
    if (record?.KHFWBJs[0]?.ZT === 1 && curXNXQId && campusId) {
      return (
        <UpdateCourses
          key={record.id}
          actionRef={actionRef}
          XNXQId={curXNXQId}
          BJSJId={record.id}
          NJSJ={record?.NJSJ}
          XQSJId={campusId}
        />
      );
    }
    return '';
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
      title: '年级名称',
      dataIndex: 'NJMC',
      key: 'NJMC',
      align: 'center',
      width: 160,
      render: (test: any, record: any) => {
        return `${record.NJSJ.XD}${record.NJSJ.NJMC}`;
      },
    },
    {
      title: '行政班名称',
      dataIndex: 'BJ',
      key: 'BJ',
      align: 'center',
      width: 160,
    },
    {
      title: '班主任',
      dataIndex: 'BZR',
      key: 'BZR',
      align: 'center',
      width: 100,
      hideInTable: true,
    },
    {
      title: '班级人数',
      dataIndex: 'xs_count',
      key: 'xs_count',
      align: 'center',
      width: 90,
    },
    {
      title: (
        <span>
          报名人数&nbsp;
          <Tooltip overlayStyle={{ maxWidth: '30em' }} title={<>当前时段班级报名人数</>}>
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
      ),
      dataIndex: 'xsfwbm_count',
      key: 'xsfwbm_count',
      align: 'center',
      width: 150,
      render: (_, record) => {
        return (
          <Link
            key="details"
            to={{
              pathname: '/afterClassManagement/class_management/detail',
              state: record,
            }}
          >
            {record?.xsfwbm_count}
          </Link>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'ZT',
      key: 'ZT',
      align: 'center',
      width: 100,
      render: (_, record: any) => {
        if (record?.KHFWBJs?.length) {
          if (record?.KHFWBJs[0]?.ZT === 0) {
            return '未发布';
          }
          return '已发布';
        }
        return '待配置';
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 190,
      render: (_, record) => {
        let f = false;
        if (record?.KHFWBJs?.[0]?.ZT === 1) {
          f = true;
        }
        return (
          <Space>
            {f ? (
              curXNXQId && record?.id && <ClassSeviveDetail XNXQId={curXNXQId} BJSJId={record.id} />
            ) : (
              <ConfigureService
                key={record.id}
                actionRef={actionRef}
                XQData={XQData}
                XNXQId={curXNXQId}
                KHFWBJs={record?.KHFWBJs}
                BJSJId={record.id}
                NJSJ={record?.NJSJ}
                XQSJId={campusId}
              />
            )}
            {getSetting(record)}
            {getSelctCourse(record)}
          </Space>
        );
      },
    },
  ];

  const onCampusChange = (value: any) => {
    setCampusId(value);
    // actionRef.current?.reload();
  };

  // 学年学期筛选
  const onXNXQChange = (value: string) => {
    curXNXQData?.forEach((item: any) => {
      if (item.id === value) {
        setCurXNXQId(value);
        setXQData(item);
        actionRef.current?.reloadAndRest();
      }
    });
  };

  // 取消发布、发布
  const onRelease = async (arr: any[], falg: boolean) => {
    if (!arr?.length) {
      message.warning(falg ? '没有可发布的课后服务课程' : '没有可取消发布的课后服务课程');
      return;
    }
    // console.log('批量取消发布',arr);
    const params = {
      KHFWBJIds: arr.map((item: any) => item?.KHFWBJs?.[0].id),
      ZT: falg ? 1 : 0,
    };
    const res = await bulkEditKHFWBJZT(params);
    if (res?.status === 'ok') {
      message.success(falg ? '发布成功' : '取消成功');
      actionRef.current?.reloadAndRest();
      actionRef.current.clearSelected();
    } else {
      message.error(res.message);
      actionRef.current.clearSelected();
    }
  };
  return (
    <div className={styles.AdministrativeClass}>
      <PageContain>
        <ProTable<any>
          actionRef={actionRef}
          columns={columns}
          rowSelection={{}}
          tableAlertOptionRender={({ selectedRows }) => {
            // console.log('selectedRows23', selectedRows);
            return (
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    const list = selectedRows.filter((item: any) => {
                      const { KHFWBJs } = item;
                      if (KHFWBJs?.length > 0 && KHFWBJs?.[0]?.ZT === 0) return true;
                    });
                    onRelease(list, true);
                  }}
                >
                  批量发布
                </Button>

                <Button
                  type="primary"
                  onClick={() => {
                    const list = selectedRows.filter((item: any) => {
                      const { KHFWBJs } = item;
                      if (KHFWBJs?.length > 0 && KHFWBJs?.[0]?.ZT === 1) return true;
                    });
                    onRelease(list, false);
                  }}
                >
                  取消发布
                </Button>
              </Space>
            );
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
          rowKey="id"
          pagination={{
            showQuickJumper: true,
            pageSize: 10,
            defaultCurrent: 1,
          }}
          request={async (param) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            // console.log('=============')
            if (curXNXQId && campusId) {
              const obj = {
                XXJBSJId: currentUser?.xxId,
                NJId: NjId ? [NjId] : undefined,
                BJSJId: BJId,
                XNXQId: curXNXQId,
                page: param.current,
                pageSize: param.pageSize,
                XQSJId: campusId,
              };
              const res = await getKHFWBJXSbm(obj);
              // console.log('res-------',res);
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
              <div>
                <label htmlFor="grade">校区名称：</label>
                <Select value={campusId} placeholder="请选择" onChange={onCampusChange}>
                  {campusData?.map((item: any) => {
                    return <Option value={item.value}>{item.label}</Option>;
                  })}
                </Select>
              </div>
              <div>
                <label htmlFor="grade">学年学期：</label>
                <Select value={curXNXQId} placeholder="请选择" onChange={onXNXQChange}>
                  {curXNXQData?.map((item: any) => {
                    return <Option value={item.id}>{`${item.XN}-${item.XQ}`}</Option>;
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
          toolBarRender={() => {
            return [
              <ConfigureServiceBatch actionRef={actionRef} XNXQId={curXNXQId} XQSJId={campusId} />,
            ];
          }}
        />
      </PageContain>
    </div>
  );
};

export default AdministrationClassManagement;
