import PageContain from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, useModel } from 'umi';
import styles from './index.less';
import { getAllBJSJ, getSchoolClasses } from '@/services/after-class/bjsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getAllGrades } from '@/services/after-class/khjyjg';
import SearchLayout from '@/components/Search/Layout';

type selectType = { label: string; value: string };

const { Option } = Select;
const AdministrativeClass = () => {
  const actionRef = useRef<ActionType>();
  const [NjId, setNjId] = useState<any>();
  const [NjData, setNjData] = useState<any>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [curXNXQId, setCurXNXQId] = useState<string | undefined>(undefined);
  const [bjData, setBJData] = useState<selectType[] | undefined>([]);
  const [BJId, setBJId] = useState<string | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const res = await getAllGrades({
        XD: currentUser?.XD?.split(','),
      });
      if (res.status === 'ok') {
        setNjData(res.data);
      }
    })();
    (async () => {
      const result = await queryXNXQList(currentUser?.xxId);
      setCurXNXQId(result?.current?.id);
    })();
  }, []);

  useEffect(() => {
    if (curXNXQId) {
      actionRef.current?.reload();
    }
  }, [curXNXQId]);

  const onBjChange = async (value: any) => {
    setBJId(value);
    actionRef.current?.reload();
  };
  const onNjChange = async (value: any) => {
    setNjId(value);
    actionRef.current?.reload();
  };

  const getBJSJ = async () => {
    const res = await getAllBJSJ({ njId: NjId, page: 0, pageSize: 0 });
    if (res.status === 'ok') {
      const data = res.data?.rows?.map((item: any) => {
        return { label: item.BJ, value: item.id };
      });
      setBJData(data);
    }
  };

  useEffect(() => {
    if (NjId) {
      getBJSJ();
    }
  }, [NjId]);
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
      dataIndex: 'xsbm_count',
      key: 'xsbm_count',
      align: 'center',
      width: 150,
    },
    // {
    //   title: '班主任',
    //   dataIndex: 'BZR',
    //   key: 'BZR',
    //   align: 'center',
    //   width: 180,
    // },
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
              pathname: '/statistics/administrativeClass/administrativeClassDetail',
              state: record,
            }}
          >
            班级详情
          </Link>
        );
      },
    },
  ];
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
            if (curXNXQId) {
              const obj = {
                XXJBSJId: currentUser?.xxId,
                njId: NjId || '',
                BJSJId: BJId,
                XNXQId: curXNXQId,
                page: param.current,
                pageSize: param.pageSize,
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

export default AdministrativeClass;
