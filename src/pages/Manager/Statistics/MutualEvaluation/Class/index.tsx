import PageContainer from '@/components/PageContainer';
import { useEffect, useState } from 'react';
import { Select, Rate } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { render } from 'react-dom';
import { getClassesEvaluation } from "@/services/after-class/khbjsj"
import { useModel, Link,history } from 'umi';
import styles from '../index.less'
import { getAllClasses } from '@/services/after-class/khbjsj'
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';





const { Option } = Select;

const school = (props: any) => {
  const {id} = props.location.state.data ;
  console.log(props.location.state.data);

  // 课程列表
  const [courseList, setcourseList] = useState<any>();
  const [dataSource, setDataSource] = useState<API.KHXSDD[] | undefined>([]);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  //点击课程列表出发
  const choseCourse = () => {

  }
  useEffect(() => {
    (async () => {
      const res = await getClassesEvaluation({ XNXQId: currentUser.XNXQId,KHKCSJId:id })
      console.log(res.data.rows);

      if (res.status === 'ok') {
        setDataSource(res.data.rows)
      }
    })()
  }, [])
  const columns: ProColumns<TermItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center'
    },
    {
      title: '班级名称',
      dataIndex: 'BJMC',
      key: 'BJMC',
      align: 'center',
      // render:(text:any)=>text.BJMC

    },
    {
      title: '主讲师',
      dataIndex: '',
      key: '',
      align: 'center',
      render: (_, record) => {
        return record.KHBJJs.map((item) => {
          return <div>{item.KHJSSJ.XM}</div>;
        });




      }

    },
    {
      title: '班级评分',
      dataIndex: 'pj_avg',
      key: 'pj_avg',
      align: 'center',
      render: (text: any) => <Rate count={5} defaultValue={text} disabled={true} />,

    },
    {
      title: '班级人数',
      dataIndex: 'pj_count',
      key: 'pj_count',
      align: 'center',
      render: (text: any) => text

    },
    {
      title: '评价人数',
      dataIndex: 'pj_count',
      key: ' pj_count',
      align: 'center',
      render: (text: any) => text

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
              pathname: '/statistics/MutualEvaluation/Detail',
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
  ]
  return <div>
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
      <div className={styles.TopSearchss}>
        <span>
          班级名称:
          <Select
            // value={}
            style={{ width: 200 }}
            onChange={(value: string) => {
              // 选择不同课程
              choseCourse(value);
            }}
          >
            {courseList?.map((item: any) => {
              return (
                <Option key={item.value} value={item.value}>
                  {item.text}
                </Option>
              );
            })}
          </Select>
        </span>
      </div>
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

    </PageContainer>
  </div>
}
export default school