import PageContainer from '@/components/PageContainer';
import { useEffect, useState } from 'react';
// import { message } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';

import { useModel, Link } from 'umi';
import { Select, Tag } from 'antd';
import moment from 'moment';
import { getClasses } from '@/services/after-class/reports';
import { queryXNXQList } from '@/services/local-services/xnxq';
import ProTable from '@ant-design/pro-table';

import Style from './index.less';
import { TermItem } from '../../BasicalSettings/TermManagement/data';
import EllipsisHint from '@/components/EllipsisHint';

const { Option } = Select;

const AfterSchoolClass: React.FC = (props: any) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 学年学期列表数据
  const [termList, setTermList] = useState<any>();
  // 学期学年没有数据时提示的开关
  // 表格数据源
  const [dataSource, setDataSource] = useState<any>([]);
  const { state } = props.location;
  const { id, KHKCSJId } = state.data;
  console.log('state.data: ', state.data);
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
      title: '上课时段',
      dataIndex: 'SKSD',
      key: 'SKSD',
      align: 'center',
      render: (test: any, record: any) => {
        return moment(record?.KKSJ).format('YYYY.MM.DD') + '~' + moment(record?.JKSJ).format('YYYY.MM.DD');
      },
    },
    {
      title: '班级名称',
      dataIndex: 'BJMC',
      key: 'BJMC',
      align: 'center',
      render: (test: any,) => {
        return test;
      },
    },
    {
      title: '适用年级',
      dataIndex: 'KKFW',
      key: 'KKFW',
      align: 'center',
      render: (text: any) => {
        return (
          <EllipsisHint
            width="100%"
            text={text?.split(',').map((item: any) => {
              return (
                <Tag key={item.id}>
                  {item}
                </Tag>
              );
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
      render: (test: any,) => {
        return test;
      },
    },
    {
      title: '课时数',
      dataIndex: 'KSS',
      key: 'KSS',
      align: 'center',
      render: (test: any,) => {
        return test;
      },
    },
    {
      title: '报名人数',
      dataIndex: 'BMRS',
      key: 'BMRS',
      align: 'center',
      render: (test: any,) => {
        return test;
      },
    },
    {
      title: '退课人数',
      dataIndex: 'TKRS',
      key: 'TKRS',
      align: 'center',
      render: (test: any,) => {
        return test;
      },
    },
    {
      title: '收款总额',
      dataIndex: 'SKJE',
      key: 'SKJE',
      align: 'center',
      render: (test: any,) => {
        return test;
      },
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
    if(curXNXQId){
      ChoseSelect(curXNXQId);
    }
  }, [curXNXQId]);
  // 学年学期选相框触发的函数
  const ChoseSelect = async (SelectData: string) => {
    const res3 = await getClasses({
      XNXQId: SelectData,
      KHKCSJId: KHKCSJId
    });
    console.log('res3: ', res3);
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
