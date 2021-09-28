import PageContainer from '@/components/PageContainer';
import { useEffect, useRef, useState } from 'react';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getAllKHXSQJ } from '@/services/after-class/khxsqj';
// import { message } from 'antd';
import { useModel } from 'umi';
import { Select } from 'antd';
import Style from './index.less';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
const { Option } = Select;

const LeaveManagement: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  // 学年学期列表数据
  const [termList, setTermList] = useState<any>();
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();

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
    actionRef.current?.reload();
  }, [curXNXQId]);
  ///table表格数据
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
      width: 60,
    },
    {
      title: '学生姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
      width: 120,
      render: (text: any) => text.split('-')[0],
    },
    {
      title: '课程名称',
      dataIndex: 'KHQJKCs',
      key: 'KHQJKCs',
      align: 'center',
      render: (text: any) => text[0]?.KCMC,
    },
    {
      title: '课程班名称',
      dataIndex: 'KHQJKCs',
      key: 'KHQJKCs_BJMC',
      align: 'center',
      render: (text: any) => text[0]?.KHBJSJ?.BJMC || '',
    },
    {
      title: '请假原因',
      dataIndex: 'QJYY',
      key: 'QJYY',
      align: 'center',
    },
    {
      title: '请假状态',
      dataIndex: 'QJZT',
      key: 'QJZT',
      align: 'center',
      width: 100,
      render: (text: any) => (text ? '已取消' : '已通过'),
    },
    {
      title: '请假开始时间',
      dataIndex: '',
      key: '',
      align: 'center',
      width: 170,
      render: (text: any, record: any) => `${text.KHQJKCs[0].QJRQ}  ${record.KSSJ}`,
    },
    {
      title: '请假结束时间',
      dataIndex: '',
      key: '',
      align: 'center',
      width: 170,
      render: (text: any, record: any) => `${text.KHQJKCs[0].QJRQ}  ${record.JSSJ}`,
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
      <div className={Style.leaveWrapper}>
        <ProTable<any>
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          request={async () => {
            const resAll = await getAllKHXSQJ({ XNXQId: curXNXQId });
            if (resAll.status === 'ok') {
              return {
                data: resAll?.data?.rows,
                success: true,
                total: resAll?.data?.count,
              };
            }
            return {
              data: [],
              success: false,
              total: 0,
            };
          }}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
          search={false}
        />
      </div>
    </PageContainer>
  );
};
export default LeaveManagement;
