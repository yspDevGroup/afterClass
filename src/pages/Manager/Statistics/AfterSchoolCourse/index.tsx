import PageContainer from '@/components/PageContainer';
import { useEffect, useState } from 'react';
// import { message } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';

import { useModel, Link } from 'umi';
import { Select } from 'antd';
import { getCourses } from '@/services/after-class/reports';
import { queryXNXQList } from '@/services/local-services/xnxq';
import ProTable from '@ant-design/pro-table';

import Style from './index.less';
import { TableItem } from './data';

const { Option } = Select;

const AfterSchoolCourse: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 学年学期列表数据
  const [termList, setTermList] = useState<any>();
  // 学期学年没有数据时提示的开关
  // 表格数据源
  const [dataSource, setDataSource] = useState<any>([]);
  /// table表格数据
  const columns: ProColumns<TableItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      fixed: 'left',
      align: 'center'
    },
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      key: 'KCMC',
      fixed: 'left',
      align: 'center',
      width: 120,
      ellipsis: true,
    },
    {
      title: '课程来源',
      dataIndex: 'KCLY',
      key: 'KCLY',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '课程类型',
      dataIndex: 'KCLX',
      key: 'KCLX',
      align: 'center',
      width: 120,
      ellipsis: true,
    },
    {
      title: '所属机构/学校',
      dataIndex: 'JGMC',
      key: 'JGMC',
      align: 'center',
      width: 120,
      ellipsis: true,
      render: (_, record: any) => {
        return record?.KCLY === '校内课程' ? record?.XXMC : record?.JGMC
      }
    },
    {
      title: '课程班数量',
      dataIndex: 'BJS',
      key: 'BJS',
      align: 'center',
      width: 130,
      ellipsis: true,
    },
    {
      title: '报名人数',
      dataIndex: 'BMRS',
      key: 'BMRS',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '退课人数',
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
        const num = record.TKRS != 0 ? (Number((record.TKRS / record.BMRS)) * 100).toFixed(1) + '%' : 0;
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
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 90,
      ellipsis: true,
      fixed: 'right',
      render: (_, record) => (
        <>
          <Link
            to={{
              pathname: '/statistics/afterSchoolCourse/detail',
              state: {
                type: 'detail',
                data: record,
              },
            }}
          >
            详情
          </Link>
        </>
      ),
    },
  ];
  useEffect(() => {
    // 获取学年学期数据的获取
    (async () => {
      const res = await queryXNXQList(currentUser?.xxId);
      // 获取到的整个列表的信息
      const newData = res.xnxqList;
      const curTerm = res.current;
      if (newData?.length) {
        if (curTerm) {
          setCurXNXQId(curTerm.id);
          setTermList(newData);
        }
      } else {
      }
    })();
  }, []);
  // 学年学期变化
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (curXNXQId) {
      ChoseSelect(curXNXQId);
    }
  }, [curXNXQId]);
  // 学年学期选相框触发的函数
  const ChoseSelect = async (SelectData: string) => {
    const res3 = await getCourses({
      XNXQId: SelectData,
      XXJBSJId: currentUser?.xxId
    });
    if (res3.status === 'ok') {
      setDataSource(res3?.data?.rows);
    }
  };

  return (
    /// PageContainer组件是顶部的信息
    <PageContainer>
      <div className={Style.TopSearchss}>
        <span>
          所属学年学期：
          <Select
            value={curXNXQId}
            style={{ width: 200 }}
            onChange={(value: string) => {
              // 选择不同学期从新更新页面的数据
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
      </div>
      <div>
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
          scroll={{ x: 1300 }}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
        />
      </div>
      {/* <Link to={{ pathname: '/afterSchoolCourse/detail',}}>详情</Link> */}
    </PageContainer>
  );
};
export default AfterSchoolCourse;
