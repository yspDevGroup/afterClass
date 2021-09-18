import PageContainer from '@/components/PageContainer';
import type { ColumnsType } from 'antd/lib/table';
import { LeftOutlined, } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getKHBJPJ } from '@/services/after-class/khbjpj'
import { getAllKHXSPJ } from '@/services/after-class/khxspj'
import { Rate, Popover } from 'antd';
import { Table, Button } from 'antd';
import { history, useModel } from 'umi';
import { queryXNXQList } from '@/services/local-services/xnxq';



const Detail = (props: any) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [XNXQId, setXNXQId] = useState()

  const { state } = props.location
  const { KHKCSJ, id,BJMC } = state.data
  //   学生详情评价列表
  const [StuList, setStuList] = useState<API.KHXSDD[] | undefined>([]);
  // 课堂表现的详情
  const [ClassDetail, SetClassDetail] = useState('点击课堂表现查看详情');
  useEffect(() => {
    (
      async()=>{
        const res = await queryXNXQList(currentUser?.xxId);
        setXNXQId(res.current?.id)
      }
    )()
  }, []);
  useEffect(() => {
    (async () => {
      const res = await getKHBJPJ({
        // 课后班级数据
        KHBJSJId: id,
        XSId: "",
        XXJBSJId: "",
        XNXQId: "",
        page: 0,
        pageSize: 0
      })
      if (res?.data?.rows) {
        setStuList(res.data.rows)
      }
    })()

  }, [])

  const manifestation = async (value: any) => {
    const res2 = await getAllKHXSPJ({ XSId: value.XSId, KHBJSJId: id, JSId: '', XNXQId: XNXQId!, page: 0, pageSize: 0 })
    if (res2?.data?.rows) {
      SetClassDetail(res2.data.rows[0].PY)
    }



    //  SetClassDetail('good')



  }



  /// table表格数据
  const columns: ColumnsType<API.KHXSDD> | undefined = [
    {
      title: '学生姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
    },
    {
      title: '班级',
      dataIndex: '',
      key: '',
      align: 'center',
      render: () => {
        return BJMC
      }
    },
    {
      title: '评价人',
      dataIndex: 'PJR',
      key: 'PJR',
      align: 'center',
    },
    {
      title: '评价时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      width: 200

    },
    {
      title: '课程评分',
      dataIndex: '',
      key: '',
      align: 'center',
      width: 200,
      render: (_, record) => <Rate count={5} defaultValue={record?.PJFS} disabled={true} />
    },
    {
      title: '评价内容',
      dataIndex: 'PY',
      key: 'PY',
      align: 'center',
      render: (text: any) => {
        return <Popover content={text}>
          <div style={{ textOverflow: 'ellipsis', width: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textAlign: 'center', margin: '0 auto' }}>{text}</div>
        </Popover>
      }
    },
    {
      title: '该学生课堂表现',
      dataIndex: '',
      key: '',
      align: 'center',
      render: (_, record) => {
        return <Popover content={ClassDetail}>
          <a onClick={() => { manifestation(record) }} onMouseEnter={() => false}>课堂表现</a>
        </Popover>
      }
    },
  ]
  return (
    <div>
      <PageContainer>
        <Button
          type="primary"
          onClick={() => {
            history.go(-1);
          }}
          style={{
            marginBottom: '24px'
          }}
        >
          <LeftOutlined />
          返回上一页
        </Button>
        <div >
          <Table columns={columns} dataSource={StuList} rowKey="id" />
        </div>
      </PageContainer>

    </div>

  )
}
export default Detail
