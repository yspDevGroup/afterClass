import PageContainer from "@/components/PageContainer";
import { getStudent } from "@/services/after-class/khxxzzfw";
import ProTable from "@ant-design/pro-table";
import type { ProColumns , ActionType } from '@ant-design/pro-table';
import { useEffect, useRef, useState } from "react";
import type { SignUpItem } from "./data";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { history } from 'umi';
import styles from './index.less';
import WWOpenDataCom from "@/components/WWOpenDataCom";

const SignUp = (props: any) => {
  const { state } = props.location;
  const [DataSource, setDataSource] = useState<any>();
  const actionRef = useRef<ActionType>();
  useEffect(() => {
    (
      async () => {
        const res = await getStudent({
          KHXXZZFWId: state?.id,
          XNXQId: state?.XNXQ?.id
        })
        if(res.status === 'ok'){
          setDataSource(res.data?.rows)
        }
      }
    )()
  }, []);

  const columns: ProColumns<SignUpItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center'
    },
    {
      title: '学号',
      dataIndex: 'XSId',
      key: 'XSId',
      align: 'center',
      search: false,
      ellipsis: true,
      width: 100,
      render: (_text: any, record: any) => {
        return record?.XSJBSJ?.XH
      },
    },
    {
      title: '学生姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
      search: false,
      ellipsis: true,
      width: 100,
      render: (_text: any, record: any) => {
        const showWXName = record?.XSJBSJ?.XM === '未知' && record?.XSJBSJ?.WechatUserId;
        if (showWXName) {
          return <WWOpenDataCom type="userName" openid={record?.XSJBSJ.WechatUserId} />;
        }
        return record?.XSJBSJ?.XM;
      },
    },
    {
      title: '报名时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      search: false,
      ellipsis: true,
      width: 100,
    },
  ];
  return <PageContainer>
    <div className={styles.SignUp}>
     <Button
        type="primary"
        onClick={() => {
           history.go(-1);
        }}
        style={{marginBottom:'20px'}}
      >
        <LeftOutlined />
        返回上一页
        </Button>
      <ProTable<any>
          columns={columns}
          rowKey="key"
          actionRef={actionRef}
          pagination={{
            showQuickJumper: true
          }}
          search={false}
          dataSource={DataSource}
          dateFormatter="string"
        />
      </div>
    </PageContainer>
}
export default SignUp;
