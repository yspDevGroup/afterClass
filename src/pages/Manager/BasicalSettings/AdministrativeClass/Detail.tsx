import PageContain from "@/components/PageContainer";
import ProTable from "@ant-design/pro-table";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import { Button, Select, Tag } from "antd";
import { useEffect, useRef, useState } from "react";
import { useModel,history } from "umi";
import styles from './index.less'
import EllipsisHint from "@/components/EllipsisHint";
import { getClassStudents } from "@/services/after-class/bjsj";
import { LeftOutlined } from "@ant-design/icons";
import { queryXNXQList } from "@/services/local-services/xnxq";
import { getAllCourses } from "@/services/after-class/khkcsj";

const { Option } = Select;
const Detail = (props: any) => {
  const {state} = props.location;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  const [KcId, setKcId] = useState<any>();
  const [XNXQId, setXNXQId] = useState();
  const [KCData, setKCData] = useState<any>()

  useEffect(() => {
    (
      async()=>{
        const result = await queryXNXQList(currentUser?.xxId);
        setXNXQId(result.current?.id)
        const res = await getAllCourses({
          XXJBSJId:currentUser?.xxId,
          XNXQId:result.current?.id
        })
        if(res.status === 'ok'){
          setKCData(res.data.rows)
        }
      }
    )()
  }, [])
  const onKcChange = async (value: any) => {
    setKcId(value);
    actionRef.current?.reload();
  };
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center'
    },
    {
      title: '学号',
      dataIndex: 'XH',
      key: 'XH',
      align: 'center',
      width: 180,
    },
    {
      title: '学生姓名',
      dataIndex: 'XM',
      key: 'XM',
      align: 'center',
      width: 180,
    },
    {
      title: '报名课程',
      dataIndex: 'KHXSBJs',
      key: 'KHXSBJs',
      align: 'center',
      width: 400,
      render: (text: any) => {
        return (
          <>
          {
            text?.length === 0 ? '-': <EllipsisHint
            width="100%"
            text={text?.map((item: any) => {
              return (
                <Tag key={item.id}>
                  {item.KHBJSJ?.KHKCSJ?.KCMC}
                </Tag>
              );
            })}
          />
          }
          </>
        );
      },
    },
  ];
  return <div className={styles.AdministrativeClass}><PageContain>
      <Button
        type="primary"
        onClick={() => {
          history.goBack();
        }}
        style={{
          marginBottom: '24px'
        }}
      >
        <LeftOutlined />
        返回上一页
      </Button>
    <ProTable<any>
      actionRef={actionRef}
      columns={columns}
      rowKey="id"
      request={async (param) => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        if(XNXQId){
          const obj = {
            BJSJId: state?.id,
            XNXQId,
            KCMC:KcId || '',
            page: param.current,
            pageSize: param.pageSize,
          };
          const res = await getClassStudents(obj);

          if (res.status === 'ok') {
            return {
              data: res.data.rows,
              success: true,
              total: res.data.count,
            };
          }
        }

        return [];
      }}
      options={{
        setting: false,
        fullScreen: false,
        density: false,
        reload: false,
      }}
      search={false}
      headerTitle={
        <div style={{ display: 'flex' }}>
          <span style={{ fontSize: 14, color: '#666' }}>
            课程名称：
            <Select
                    style={{ width: 200 }}
                    value={KcId}
                    allowClear
                    placeholder="请选择"
                    onChange={onKcChange}
                    showSearch
                  >
                    {KCData?.map((item: any) => {
                      return (
                        <Option value={item.KCMC} >
                          {item.KCMC}
                        </Option>
                      );
                    })}
                  </Select>
          </span>
        </div>
      }
    />
  </PageContain>
  </div>
}

export default Detail;
