import PageContainer from '@/components/PageContainer';
import { useEffect, useState } from 'react';
// import { message } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';

import { useModel, history } from 'umi';
import { Tag, Button } from 'antd';
import moment from 'moment';
import { getClasses } from '@/services/after-class/reports';
import ProTable from '@ant-design/pro-table';
import { LeftOutlined } from '@ant-design/icons';
import EllipsisHint from '@/components/EllipsisHint';
import { getTableWidth } from '@/utils/utils';
import SearchLayout from '@/components/Search/Layout';
import SemesterSelect from '@/components/Search/SemesterSelect';

const AfterSchoolClass: React.FC = (props: any) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 学年学期列表数据
  // 表格数据源
  const [dataSource, setDataSource] = useState<any>([]);
  const { state } = props.location;
  const { KHKCSJId } = state.data;
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
      title: '课程班名称',
      dataIndex: 'BJMC',
      key: 'BJMC',
      align: 'center',
      ellipsis: true,
      width: 140,
      fixed: 'left',
      render: (test: any) => {
        return test;
      },
    },
    {
      title: '上课时段',
      dataIndex: 'SKSD',
      key: 'SKSD',
      align: 'center',
      width: 150,
      ellipsis: true,
      render: (test: any, record: any) => {
        return `${moment(record?.KKSJ).format('YYYY.MM.DD')}~${moment(record?.JKSJ).format(
          'YYYY.MM.DD',
        )}`;
      },
    },
    {
      title: '适用年级',
      dataIndex: 'KKFW',
      key: 'KKFW',
      align: 'center',
      width: 150,
      render: (text: any) => {
        return (
          <EllipsisHint
            width="100%"
            text={text?.split(',').map((item: any) => {
              return <Tag key={item.id}>{item}</Tag>;
            })}
          />
        );
      },
    },
    {
      title: '任课教师',
      dataIndex: 'RKJS',
      key: 'RKJS',
      align: 'center',
      width: 100,
    },
    {
      title: '课时数',
      dataIndex: 'KSS',
      key: 'KSS',
      align: 'center',
      width: 90,
      ellipsis: true,
    },
    {
      title: '报名人数',
      dataIndex: 'BMRS',
      key: 'BMRS',
      align: 'center',
      width: 90,
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
  ];

  const getData = async () => {
    const res3 = await getClasses({
      XNXQId: curXNXQId,
      KHKCSJId,
    });
    if (res3.status === 'ok' && res3?.data) {
      setDataSource(res3?.data?.rows);
    }
  };
  // 学年学期变化
  useEffect(() => {
    if (curXNXQId) {
      getData();
    }
  }, [curXNXQId]);
  return (
    // PageContainer组件是顶部的信息
    <PageContainer>
      <Button
        type="primary"
        onClick={() => {
          history.go(-1);
        }}
        style={{
          marginBottom: '24px',
        }}
      >
        <LeftOutlined />
        返回上一页
      </Button>
      <div>
        <ProTable
          pagination={{
            showQuickJumper: true,
            pageSize: 10,
            defaultCurrent: 1,
          }}
          scroll={{ x: getTableWidth(columns) }}
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          search={false}
          headerTitle={
            <>
              <SearchLayout>
                <SemesterSelect
                  XXJBSJId={currentUser?.xxId}
                  onChange={(value: string) => {
                    // 选择不同学期从新更新页面的数据
                    setCurXNXQId(value);
                  }}
                />
              </SearchLayout>
            </>
          }
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
        />
      </div>
      {/* <Link to={{ pathname: '/afterSchoolClass/detail',}}>详情</Link> */}
    </PageContainer>
  );
};
export default AfterSchoolClass;
