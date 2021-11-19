import PageContainer from '@/components/PageContainer';
import { useEffect, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { useModel, Link } from 'umi';
import { Select, Rate, Spin } from 'antd';
import { getAllCourses } from '@/services/after-class/khkcsj';
import ProTable from '@ant-design/pro-table';
import { getAllKHKCLX } from '@/services/after-class/khkclx';
import { getTableWidth } from '@/utils/utils';
import SearchLayout from '@/components/Search/Layout';
import SemesterSelect from '@/components/Search/SemesterSelect';
import CourseSelect from '@/components/Search/CourseSelect';

type selectType = { label: string; value: string };

const { Option } = Select;

const MutualEvaluation: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 表格数据源
  const [dataSource, setDataSource] = useState<API.KHXSDD[] | undefined>([]);
  const [kcmcValue, setKcmcValue] = useState<any>();
  // 课程来源
  const [KCLY, setKCLY] = useState<string>();

  // 课程类型
  const [KCLXId, setKCLXId] = useState<string | undefined>();
  const [KCLXData, setKCLXData] = useState<selectType[] | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  // table表格数据
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
      width: 120,
      fixed: 'left',
      render: (text: any) => {
        return text;
      },
    },
    {
      title: '课程类型',
      dataIndex: 'KHKCLX',
      key: 'KHKCLX',
      align: 'center',
      width: 120,
      render: (test: any) => {
        return test.KCTAG;
      },
    },
    {
      title: '课程来源',
      dataIndex: 'SSJGLX',
      key: 'SSJGLX',
      align: 'center',
      width: 100,
      render: (test: any) => {
        return test;
      },
    },
    {
      title: '机构名称',
      dataIndex: 'KHJYJG',
      key: 'KHJYJG',
      align: 'center',
      width: 120,
      ellipsis: true,
      render: (test: any) => {
        return test?.QYMC || '-';
      },
    },
    {
      title: '开班数量',
      dataIndex: 'bj_count',
      key: 'bj_count',
      align: 'center',
      width: 100,
      render: (test: any) => {
        return test;
      },
    },
    {
      title: '课程评分',
      dataIndex: 'PJFS',
      key: 'PJFS',
      width: 180,
      align: 'center',
      render: (test: any) => {
        const fs = Number(Number(test).toFixed(1)) || 0;
        return <Rate allowHalf defaultValue={fs} disabled={true} />;
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <>
          <Link
            to={{
              pathname: '/statistics/mutualEvaluation/class',
              state: {
                type: 'detail',
                data: { XNXQ: curXNXQId, record },
              },
            }}
          >
            详情
          </Link>
        </>
      ),
    },
  ];
  const getData = async () => {
    setLoading(true);
    const res3 = await getAllCourses({
      XXJBSJId: currentUser.xxId,
      KHKCLXId: KCLXId,
      XNXQId: curXNXQId,
      KCMC: kcmcValue,
      SSJGLX: KCLY,
    });
    if (res3.status === 'ok') {
      setLoading(false);
      setDataSource(res3?.data?.rows);
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
  }, []);
  // 学年学期变化
  useEffect(() => {
    if (curXNXQId) {
      getData();
    }
  }, [curXNXQId, kcmcValue, KCLXId, KCLY]);
  return (
    <PageContainer>
      <Spin spinning={loading}>
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
              <SemesterSelect XXJBSJId={currentUser?.xxId} onChange={(value: string) => {
                // 选择不同学期从新更新页面的数据
                setCurXNXQId(value);
              }} />
              <CourseSelect XXJBSJId={currentUser?.xxId} XNXQId={curXNXQId} onChange={(value, data) => {
                setKcmcValue(data?.children);
              }} />
              <div>
                <label htmlFor="school">课程类型：</label>
                <Select
                  value={KCLXId}
                  style={{ width: 160 }}
                  placeholder="课程类型"
                  allowClear
                  onChange={(value: string) => {
                    setKCLXId(value)
                  }}
                >
                  {KCLXData?.map((item: any) => {
                    return (
                      <Option key={item.value} value={item.value}>
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
      </Spin>
    </PageContainer>
  );
};
export default MutualEvaluation;
