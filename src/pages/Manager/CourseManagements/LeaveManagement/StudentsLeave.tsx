import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { Input, Select, Tag } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import EllipsisHint from '@/components/EllipsisHint';
import ShowName from '@/components/ShowName';
import { getTableWidth } from '@/utils/utils';
import SearchLayout from '@/components/Search/Layout';
import SemesterSelect from '@/components/Search/SemesterSelect';
import { getAllKHXSQJ } from '@/services/after-class/khxsqj';

const { Search } = Input;
const { Option } = Select;
const StudentsLeave: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<string>();
  // 请假状态
  const [QJZT, setQJZT] = useState<number[]>();
  const [name, setName] = useState<string>();
  // 数据
  const [dataSource, setDataSourse] = useState<any>();
  const getData = async () => {
    const resAll = await getAllKHXSQJ({
      XNXQId: curXNXQId,
      XSXM: name,
      QJZT: QJZT || [0, 1],
    });
    if (resAll.status === 'ok') {
      setDataSourse(resAll?.data?.rows);
    } else {
      setDataSourse([]);
    }
  };
  useEffect(() => {
    if (curXNXQId) {
      getData();
    }
  }, [curXNXQId, QJZT, name]);
  const termChange = (val: string) => {
    setName(undefined);
    setCurXNXQId(val);
  };
  // table表格数据
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
      width: 58,
      fixed: 'left',
    },
    {
      title: '学生姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
      width: 100,
      fixed: 'left',
      render: (_text: any, record: any) => (
        <ShowName type="userName" openid={record?.XSJBSJ?.WechatUserId} XM={record?.XSJBSJ?.XM} />
      ),
    },
    {
      title: '行政班名称',
      dataIndex: 'XZBJSJ',
      key: 'XZBJSJ',
      align: 'center',
      width: 120,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return `${record?.XSJBSJ?.BJSJ?.NJSJ?.NJMC}${record?.XSJBSJ?.BJSJ?.BJ}`;
      },
    },
    {
      title: '课程名称',
      dataIndex: 'KHQJKCs',
      key: 'KHQJKCs',
      align: 'center',
      ellipsis: true,
      render: (text: any, record: any) => {
        return (
          <EllipsisHint
            width="100%"
            text={record.KHQJKCs?.map((item: any) => {
              return <Tag key={item.KCMC}>{item.KCMC}</Tag>;
            })}
          />
        );
      },
      width: 150,
    },
    {
      title: '课程班名称',
      dataIndex: 'KHQJKCs',
      key: 'KHQJKCs_BJMC',
      align: 'center',
      ellipsis: true,
      render: (text: any, record: any) => {
        return (
          <EllipsisHint
            width="100%"
            text={record.KHQJKCs?.map((item: any) => {
              return <Tag key={item.KHBJSJ?.id}>{item.KHBJSJ?.BJMC}</Tag>;
            })}
          />
        );
      },
      width: 120,
    },
    {
      title: '授课教师',
      dataIndex: 'KHQJKCs',
      key: 'KHQJKCs_JSMC',
      align: 'center',
      render: (text: any) => {
        return (
          <EllipsisHint
            width="100%"
            text={text[0]?.KHBJSJ?.KHBJJs?.map((item: any) => {
              return <Tag key={item.JZGJBSJ?.id}>{item.JZGJBSJ?.XM}</Tag>;
            })}
          />
        );
      },
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
      dataIndex: 'KSSJ',
      key: 'KSSJ',
      align: 'center',
      width: 160,
      render: (_: any, record: any) => `${record.KHQJKCs?.[0]?.QJRQ}  ${record?.KSSJ}`,
    },
    {
      title: '请假结束时间',
      dataIndex: 'JSSJ',
      key: 'JSSJ',
      align: 'center',
      width: 160,
      render: (_: any, record: any) => `${record.KHQJKCs?.[0]?.QJRQ}  ${record.JSSJ}`,
    },
  ];
  return (
    <>
      <ProTable<any>
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
          defaultCurrent: 1,
        }}
        scroll={{ x: getTableWidth(columns) }}
        dataSource={dataSource}
        headerTitle={
          <SearchLayout>
            <SemesterSelect XXJBSJId={currentUser?.xxId} onChange={termChange} />
            <div>
              <label htmlFor="type">学生名称：</label>
              <Search
                placeholder="学生名称"
                allowClear
                onSearch={(value: string) => {
                  setName(value);
                }}
              />
            </div>
            <div>
              <label htmlFor="status">请假状态：</label>
              <Select
                style={{ width: 160 }}
                allowClear
                value={QJZT?.[0]}
                onChange={(value: number) => {
                  setQJZT(value !== undefined ? [value] : value);
                }}
              >
                <Option key="已通过" value={0}>
                  已通过
                </Option>
                <Option key="已取销" value={1}>
                  已取销
                </Option>
              </Select>
            </div>
          </SearchLayout>
        }
        options={{
          setting: false,
          fullScreen: false,
          density: false,
          reload: false,
        }}
        search={false}
      />
    </>
  );
};
export default StudentsLeave;
