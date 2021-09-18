import PageContainer from '@/components/PageContainer';
import { useEffect, useState } from 'react';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getAllKHXSQJ } from '@/services/after-class/khxsqj'
// import { message } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { useModel, } from 'umi';
import { Select, Table } from 'antd';
import Style from './index.less'
const { Option } = Select;

const LeaveManagement: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // 学年学期列表数据
  const [termList, setTermList] = useState<any>();
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 表格数据源
  const [dataSource, setDataSource] = useState<API.KHXSQJ[]>([]);
  //学年学期选相框触发的函数
  const ChoseSelect = async () => {
    const res3 = await getAllKHXSQJ({ XNXQId: curXNXQId });
    if (res3?.status === 'ok' && res3?.data?.rows) {
      setDataSource(res3.data.rows);
    }
  }
  useEffect(() => {
    //获取学年学期数据的获取
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
      }
    })();
  }, []);
  useEffect(() => {
    ChoseSelect()
  }, [curXNXQId])
  ///table表格数据
  const columns: ColumnsType<API.KHXSQJ> | undefined = [
    {
      title: '请假人',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
    },
    {
      title: '课程名称',
      dataIndex: 'KHQJKCs',
      key: 'KHQJKCs',
      align: 'center',
      render: (text: any) => text[0]?.KCMC
    },
    {
      title: '请假原因',
      dataIndex: 'QJYY',
      key: 'XSXM',
      align: 'center',
    },
    {
      title: '请假状态',
      dataIndex: 'QJZT',
      key: 'QJZT',
      align: 'center',
      render: (text: any) => text ? '已取消' : '已通过'
    },
    {
      title: '请假开始时间',
      dataIndex: '',
      key: '',
      align: 'center',
      render: (text: any, record: any) => text.KHQJKCs[0].QJRQ + record.KSSJ
    },
    {
      title: '请假结束时间',
      dataIndex: '',
      key: '',
      align: 'center',
      render: (text: any, record: any) => text.KHQJKCs[0].QJRQ + record.JSSJ
    },
  ];
  return (
    ///PageContainer组件是顶部的信息
    <PageContainer>
      <div className={Style.TopSearchs}>
        <span>
          所属学年学期：
          <Select
            value={curXNXQId}
            style={{ width: 200 }}
            onChange={(value: string) => {
              //选择不同学期从新更新页面的数据
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
    </PageContainer>
  )
}
export default LeaveManagement;
