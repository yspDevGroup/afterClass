import PageContainer from '@/components/PageContainer';
import { useEffect, useState } from 'react';
// import { message } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';

import { useModel, Link } from 'umi';
import { Select, Rate } from 'antd';
import { getAllCourses } from '@/services/after-class/khkcsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import ProTable from '@ant-design/pro-table';

import Style from './index.less';

const { Option } = Select;

const MutualEvaluation: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 学年学期列表数据
  const [termList, setTermList] = useState<any>();
  // 学期学年没有数据时提示的开关
  // 表格数据源
  const [dataSource, setDataSource] = useState<API.KHXSDD[] | undefined>([]);
  /// table表格数据
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center'
    },
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      key: 'KCMC',
      align: 'center',
      render: (text: any) => {
        return text
      },
    },
    {
      title: '课程类型',
      dataIndex: 'KHKCLX',
      key: 'KHKCLX',
      align: 'center',
      render: (test: any) => {
        return test.KCTAG
      },

    },
    {
      title: '课程来源',
      dataIndex: 'SSJGLX',
      key: 'SSJGLX',
      align: 'center',
      render: (test: any) => {
        return test
      },

    },
    {
      title: '机构名称',
      dataIndex: 'KHJYJG',
      key: 'KHJYJG',
      align: 'center',
      render: (test: any) => {
        return test?.QYMC || '-'
      },
    },
    {
      title: '开班数量',
      dataIndex: 'bj_count',
      key: 'bj_count',
      align: 'center',
      render: (test: any) => {
        return test
      },

    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      render: (_, record) => (
        <>
          <Link
            to={{
              pathname: '/statistics/mutualEvaluation/class',
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
  const huping = (XNXQId: any) => {
    (async () => {
      const res3 = await getAllCourses({
        XXJBSJId: currentUser.xxId,
        XNXQId
      });
      if (res3.status === 'ok') {
        setDataSource(res3?.data?.rows);
      }
    })()

  }
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
          huping(curTerm.id)
        }
      } else {
      }
    })();
  }, []);
  // 学年学期变化
  useEffect(() => {
    huping(curXNXQId)


  }, [curXNXQId]);


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
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
        />
      </div>
    </PageContainer>
  );
};
export default MutualEvaluation;
