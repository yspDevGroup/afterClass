import PageContainer from '@/components/PageContainer';
import { useEffect, useState } from 'react';
// import { message } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';

import { useModel, Link } from 'umi';
import { Select ,Rate} from 'antd';
import { getAllCourses } from '@/services/after-class/khkcsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import ProTable from '@ant-design/pro-table';

import Style from './index.less';

const { Option } = Select;

const MutualEvaluation: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  console.log(currentUser.xxId);
  
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 学年学期列表数据
  const [termList, setTermList] = useState<any>();
  // 学期学年没有数据时提示的开关
  // 表格数据源
  const [dataSource, setDataSource] = useState<API.KHXSDD[] | undefined>([]);
  /// table表格数据
  const columns: ProColumns<TermItem>[] = [
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
      dataIndex: 'SSJGLX',
      key: 'SSJGLX',
      align: 'center',
      render: (test: any) => {
        return test
      },
    },
    // {
    //   title: '课程评分',
    //   dataIndex: 'pj_avg',
    //   key: 'pj_avg',
    //   align: 'center',
    //   width: 200,
    //   render: (text:any) => <Rate count={5} defaultValue={text} disabled={true} />,
    // },
    {
      title: '开课机构',
      dataIndex: 'KHKCSJ',
      key: 'KHKCSJ',
      align: 'center',
      render: (test: any, record: any) => {
        return record?.KHKCSJ?.KHJYJG?.QYMC || '-';
      },
    },
    {
      title: '操作',
      dataIndex: 'XSXM',
      key: 'XSXM',
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
    ChoseSelect(curXNXQId);
  }, [curXNXQId]);
  useEffect(()=>{
    (async()=>{
      const res3 = await getAllCourses({
        XXJBSJId:currentUser.xxId
      });
      if (res3.status === 'ok') {
        console.log(res3,'___________________');
        
        setDataSource(res3?.data?.rows);
      }
    })()
  },[])
  // 学年学期选相框触发的函数
  const ChoseSelect = async (SelectData: string) => {
   
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
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
        />
      </div>
      {/* <Link to={{ pathname: '/mutualEvaluation/detail',}}>详情</Link> */}
    </PageContainer>
  );
};
export default MutualEvaluation;
