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
import { getAllClasses } from '@/services/after-class/khbjsj';
import { getAllCourses } from '@/services/after-class/khkcsj';

const { Option } = Select;
type selectType = { label: string; value: string };
const LeaveManagement: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  // 学年学期列表数据
  const [termList, setTermList] = useState<any>();
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<string>();
  // 请假状态
  const [QJZT, setQJZT] = useState<number[]>([-1]);
  // 课程选择框的数据
  const [kcmcData, setKcmcData] = useState<selectType[] | undefined>([]);
  const [kcmcId, setKcmcId] = useState<any>();
  // 班级名称选择框的数据
  const [bjmcData, setBjmcData] = useState<selectType[] | undefined>([]);
  const [bjmcId, setBjmcId] = useState<string>();
  // 数据
  const [dataSource, setDataSourse] = useState<any>();
  const params = {
    page: 0,
    pageSize: 0,
    KHKCSJId: kcmcId,
    XNXQId: curXNXQId,
    XXJBSJId: currentUser?.xxId,
  };
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
  const getData = async () => {
    const resAll = await getAllKHXSQJ({
      XNXQId: curXNXQId,
      QJZT: QJZT?.[0] === -1 ? [0, 1] : QJZT,
      KHBJSJId: bjmcId,
    });
    if (resAll.status === 'ok') {
      setDataSourse(resAll?.data?.rows);
    } else {
      setDataSourse([]);
    }
  };
  const getBjData = async () => {
    const bjmcResl = await getAllClasses(params);
    if (bjmcResl.status === 'ok') {
      const BJMC = bjmcResl.data.rows?.map((item: any) => ({
        label: item.BJMC,
        value: item.id,
      }));
      setBjmcData(BJMC);
    }
  }
  useEffect(() => {
    (async () => {
      if (curXNXQId) {
        // 通过课程数据接口拿到所有的课程
        const khkcResl = await getAllCourses(params);
        if (khkcResl.status === 'ok') {
          const KCMC = khkcResl.data.rows?.map((item: any) => ({
            label: item.KCMC,
            value: item.id,
          }));
          setKcmcData(KCMC);
          getBjData();
        }
      }
    })()
  }, [curXNXQId]);
  useEffect(() => {
    getBjData();
  }, [kcmcId]);
  useEffect(() => {
    getData();
  }, [curXNXQId, QJZT, kcmcId, bjmcId])

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
      width: 100,
      render: (text: any) => text.split('-')[0],
    },
    {
      title: '课程名称',
      dataIndex: 'KHQJKCs',
      key: 'KHQJKCs',
      align: 'center',
      ellipsis: true,
      render: (text: any) => text[0]?.KCMC,
      width: 120,
    },
    {
      title: '课程班名称',
      dataIndex: 'KHQJKCs',
      key: 'KHQJKCs_BJMC',
      align: 'center',
      ellipsis: true,
      render: (text: any) => text[0]?.KHBJSJ?.BJMC || '',
      width: 120,
    },
    {
      title: '授课教师',
      dataIndex: 'KHQJKCs',
      key: 'KHQJKCs_JSMC',
      align: 'center',
      render: (text: any) => text[0]?.KHBJSJ?.KHBJJs?.[0]?.KHJSSJ?.XM || '',
      width: 100,
    },
    {
      title: '请假原因',
      dataIndex: 'QJYY',
      key: 'QJYY',
      align: 'center',
      ellipsis: true,
      width: 180,
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
      width: 160,
      render: (text: any, record: any) => `${text.KHQJKCs[0].QJRQ}  ${record.KSSJ}`,
    },
    {
      title: '请假结束时间',
      dataIndex: '',
      key: '',
      align: 'center',
      width: 160,
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
              setKcmcId('');
              setBjmcId('');
              setQJZT([-1]);
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
        <span style={{ marginLeft: 16 }}>
          所属课程：
          <Select
            style={{ width: 200 }}
            allowClear
            value={kcmcId}
            onChange={(value: string) => {
              setKcmcId(value);
              setBjmcId('');
              setQJZT([-1]);
            }}
          >
            {kcmcData?.map((item: selectType) => {
              return (
                <Option value={item.value} key={item.value}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
        </span>
        <span style={{ marginLeft: 16 }}>
          所属课程班：
          <Select
            style={{ width: 200 }}
            allowClear
            value={bjmcId}
            onChange={(value: string) => {
              setBjmcId(value);
              setQJZT([-1]);
            }}
          >
            {bjmcData?.map((item: selectType) => {
              return (
                <Option value={item.value} key={item.value}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
        </span>
        <span style={{ marginLeft: 16 }}>
          请假状态：
          <Select
            style={{ width: 200 }}
            allowClear
            value={QJZT?.[0]}
            onChange={(value: number) => {
              setQJZT([value]);
            }}
          >
            <Option key='全部' value={-1}>
              全部
            </Option>
            <Option key='已通过' value={0}>
              已通过
            </Option>
            <Option key='已取销' value={1}>
              已取销
            </Option>
          </Select>
        </span>
      </div>
      <div className={Style.leaveWrapper}>
        <ProTable<any>
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          dataSource={dataSource}
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
