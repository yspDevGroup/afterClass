import PageContain from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { Select, Space, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, useModel } from 'umi';
import styles from './index.less';
import { getAllBJSJ, getSchoolClasses } from '@/services/after-class/bjsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getAllXQSJ } from '@/services/after-class/xqsj';
// import { getAllGrades } from '@/services/after-class/khjyjg';
import SearchLayout from '@/components/Search/Layout';
import { getGradesByCampus } from '@/services/after-class/njsj';
import ConfigureService from './ConfigureService';
import { updateKHFWBJ } from '@/services/after-class/khfwbj';
import ClassSeviveDetail from './ClassSeviveDetail';

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
  const [bjData, setBJData] = useState<selectType[] | undefined>([]);
  const [BJId, setBJId] = useState<string | undefined>(undefined);
  const [XQData, setXQData] = useState<any | undefined>();

  const getCampusData = async () => {
    const res = await getAllXQSJ({
      XXJBSJId: currentUser?.xxId,
    });
    if (res?.status === 'ok') {
      console.log('res', res.data);
      const arr = res?.data?.map((item) => {
        return {
          label: item.XQMC,
          value: item.id,
        };
      });
      if (arr?.length) {
        setCampusId(arr?.find((item) => item.label === '本校')?.value);
      }
      setCampusData(arr);
    }
  };

  useEffect(() => {
    (async () => {
      const result = await queryXNXQList(currentUser?.xxId);
      console.log('result', result);
      if (result?.current) {
        setXQData(result?.current);
        setCurXNXQId(result?.current?.id);
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
        console.log('res', res);
        setNjData(res.data);
      }
    }
  };

  useEffect(() => {
    if (campusId) {
      getNJSJ();
      setBJId(undefined);
      setNjId(undefined);
      actionRef.current?.reload();
    }
  }, [campusId]);

  const onBjChange = async (value: any) => {
    setBJId(value);
    actionRef.current?.reload();
  };
  const onNjChange = async (value: any) => {
    setNjId(value);
    actionRef.current?.reload();
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
  }, [NjId, campusId]);

  //  发布取消发布
  const onReleaseClick = async (id: string, flag: boolean) => {
    const res = await updateKHFWBJ({ id }, { ZT: flag ? 1 : 0 });
    if (res.status === 'ok') {
      message.success(flag ? '发布成功' : '取消成功');
      actionRef.current?.reload();
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
      width: 80,
    },
    {
      title: '课后服务报名人数',
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
      width: 100,
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
                actionRef={actionRef}
                XQData={XQData}
                XNXQId={curXNXQId}
                KHFWBJs={record?.KHFWBJs}
                BJSJId={record.id}
                NJSJ={record?.NJSJ}
              />
            )}
            {getSetting(record)}
          </Space>
        );
      },
    },
  ];

  const onCampusChange = (value: any) => {
    setCampusId(value);
    // actionRef.current?.reload();
  };
  return (
    <div className={styles.AdministrativeClass}>
      <PageContain>
        <ProTable<any>
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          pagination={{
            showQuickJumper: true,
            pageSize: 10,
            defaultCurrent: 1,
          }}
          request={async (param) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            if (curXNXQId && campusId) {
              const obj = {
                XXJBSJId: currentUser?.xxId,
                njId: NjId ? [NjId] : undefined,
                BJSJId: BJId,
                XNXQId: curXNXQId,
                page: param.current,
                pageSize: param.pageSize,
                XQSJId: campusId,
              };
              const res = await getSchoolClasses(obj);
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
        />
      </PageContain>
    </div>
  );
};

export default AdministrationClassManagement;
