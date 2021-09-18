import PageContainer from '@/components/PageContainer';
import { useEffect, useState } from 'react';
// import { message } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { useModel, Link } from 'umi';
import { Table, Select,} from 'antd';
import { getClassesEvaluation,} from '@/services/after-class/khbjsj'
import { queryXNXQList } from '@/services/local-services/xnxq';


import Style from './index.less'

const { Option } = Select;



const MutualEvaluation: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 学年学期列表数据
  const [termList, setTermList] = useState<any>();
  // 学期学年没有数据时提示的开关
  const [kai, setkai] = useState<boolean>(false);
  // 表格数据源
  const [dataSource, setDataSource] = useState<API.KHXSDD[] | undefined>([]);
/// table表格数据
  const columns: ColumnsType<API.KHXSDD> | undefined = [
    {
      title: '课程名称',
      dataIndex: 'KHKCSJ',
      key: 'KHKCSJ',
      align: 'center',
      render:(text: any)=>{
        return text?.KCMC
      }
    },
    {
      title: '课程班名称',
      dataIndex: 'BJMC',
      key: 'BJMC',
      align: 'center',
      // render: (text: any) => {
      //   return text?.KCMC
      // }
    },
    {
      title: '课程类型',
      dataIndex: 'KHKCSJ',
      key: 'KHKCSJ',
      align: 'center',
      render:(test: any)=>{
        return test?.KHKCLX.KCTAG

      }
    },
    {
      title: '开课机构',
      dataIndex: 'KHKCSJ',
      key: 'KHKCSJ',
      align: 'center',
      render:(test: any,record: any)=>{
        console.log(record,'=-=-=-=')
        return record?.KHKCSJ?.KHJYJG?.QYMC || '-'
      }
    },
    {
      title: '主讲师',
      dataIndex: 'KHBJJs',
      key: 'KHBJJs',
      align: 'center',
      render:(text: any)=>{
        return text[0]?.KHJSSJ.XM
      }
    },
    {
      title: '操作',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
      render: (_,record) => (
        <>
          <Link to={{
            pathname: '/statistics/mutualEvaluation/detail',
            state: {
              type: 'detail',
              data: record
            }
          }}
          >
            详情
          </Link>
        </>

      )

    },

  ]
  useEffect(() => {
    // 获取学年学期数据的获取
    (async () => {
      const res = await queryXNXQList(currentUser?.xxId);
      console.log(res);

      // 获取到的整个列表的信息
      const newData = res.xnxqList;
      const curTerm = res.current;
      if (newData?.length) {
        if (curTerm) {
          setCurXNXQId(curTerm.id);
          setTermList(newData);
        }
      } else {
        setkai(true);
      }
    })();

  },[])
  // 学年学期变化
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    ChoseSelect(curXNXQId)
  }, [curXNXQId])
  // 学年学期选相框触发的函数
  const ChoseSelect = async (SelectData: string) => {
    const res3 = await getClassesEvaluation({
      XNXQId: SelectData

    });
    if (res3.status === 'ok') {
      console.log(res3?.data?.rows);

      setDataSource(res3?.data?.rows);
    }


  }



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
      <div >
        <Table columns={columns} dataSource={dataSource} rowKey="id" />
      </div>
      {/* <Link to={{ pathname: '/mutualEvaluation/detail',}}>详情</Link> */}



    </PageContainer>

  )
}
export default MutualEvaluation
