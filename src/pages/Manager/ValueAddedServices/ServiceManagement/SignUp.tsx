import PageContainer from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { useEffect, useRef, useState } from 'react';
import type { SignUpItem } from './data';
import { Button, Select } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { history, useModel } from 'umi';
import styles from './index.less';
import ShowName from '@/components/ShowName';
import SearchLayout from '@/components/Search/Layout';
import { getAllXQSJ } from '@/services/after-class/xqsj';
import { getAllNJSJ } from '@/services/after-class/njsj';
import { getStudent } from '@/services/after-class/khxxzzfw';
import { getAllBJSJ } from '@/services/after-class/bjsj';

type selectType = { label: string; value: string };

const { Option } = Select;
const SignUp = (props: any) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  const { state } = props.location;
  const [XQId, setXQId] = useState<any>();
  const [XQData, setXQData] = useState<any>();
  const [NjId, setNjId] = useState<any>();
  const [NjData, setNjData] = useState<any>();
  const [bjData, setBJData] = useState<selectType[] | undefined>([]);
  const [BJId, setBJId] = useState<string | undefined>(undefined);
  useEffect(() => {
    (async () => {
      // 获取校区列表
      const res1: any = await getAllXQSJ({
        XXJBSJId: currentUser?.xxId,
      });
      if (res1.status === 'ok') {
        const v = res1?.data?.map((item: any) => {
          return { label: item.XQMC, value: item.id };
        });
        setXQData(v);
      }

      const res = await getAllNJSJ({
        XD: currentUser?.XD?.split(','),
      });
      if (res.status === 'ok' && res.data) {
        setNjData(res.data?.rows);
      }
    })();
  }, []);
  const onBjChange = async (value: any) => {
    setBJId(value);
    actionRef.current?.reload();
  };
  const onNjChange = async (value: any) => {
    setNjId(value);
    actionRef.current?.reload();
  };
  const onXQChange = async (value: any) => {
    setXQId(value);
    actionRef.current?.reload();
  };
  const getBJSJ = async () => {
    const res = await getAllBJSJ({
      XXJBSJId: currentUser?.xxId,
      XQSJId: XQId,
      njId: NjId,
      page: 0,
      pageSize: 0,
    });
    if (res.status === 'ok') {
      const data = res.data?.rows?.map((item: any) => {
        return { label: item.BJ, value: item.id };
      });
      setBJData(data);
    }
  };
  useEffect(() => {
    if (NjId) {
      getBJSJ();
    }
  }, [NjId, XQId]);

  const columns: ProColumns<SignUpItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center',
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
        return record?.XSJBSJ?.XH;
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
        return (
          <ShowName type="userName" openid={record?.XSJBSJ?.WechatUserId} XM={record?.XSJBSJ?.XM} />
        );
      },
    },
    {
      title: '年级名称',
      dataIndex: 'NJSJ',
      key: 'NJSJ',
      align: 'center',
      search: false,
      ellipsis: true,
      width: 100,
      render: (_text: any, record: any) => {
        const { NJMC, XD } = record?.XSJBSJ?.BJSJ?.NJSJ;
        return `${XD} ${NJMC}`;
      },
    },
    {
      title: '行政班名称',
      dataIndex: 'BJSJ',
      key: 'BJSJ',
      align: 'center',
      search: false,
      ellipsis: true,
      width: 100,
      render: (_text: any, record: any) => {
        return record?.XSJBSJ?.BJSJ?.BJ;
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
  return (
    <PageContainer>
      <div className={styles.SignUp}>
        <Button
          type="primary"
          onClick={() => {
            history.go(-1);
          }}
          style={{ marginBottom: '20px' }}
        >
          <LeftOutlined />
          返回上一页
        </Button>
        <ProTable<any>
          columns={columns}
          rowKey="key"
          actionRef={actionRef}
          pagination={{
            showQuickJumper: true,
          }}
          headerTitle={
            <>
              <h3 style={{ fontWeight: 'bold', fontSize: 16, margin: '0 24px 0 0' }}>{state?.FWMC}</h3>
              <SearchLayout>
                <div>
                  <label htmlFor="grade">年级名称：</label>
                  <Select value={NjId} allowClear placeholder="请选择" onChange={onNjChange}>
                    {NjData &&
                      NjData?.map((item: any) => {
                        return <Option value={item.id}>{`${item.XD}${item.NJMC}`}</Option>;
                      })}
                  </Select>
                </div>
                <div>
                  <label htmlFor="grade">校区名称：</label>
                  <Select value={XQId} allowClear placeholder="请选择" onChange={onXQChange}>
                    {XQData?.map((item: any) => {
                      return <Option value={item.value}>{item.label}</Option>;
                    })}
                  </Select>
                </div>
                <div>
                  <label htmlFor="kcly">班级名称：</label>
                  <Select value={BJId} allowClear placeholder="班级名称" onChange={onBjChange}>
                    {bjData?.map((item: any) => {
                      return (
                        <Option value={item.value} key={item.value}>
                          {item.label}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
              </SearchLayout>
            </>
          }
          search={false}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
          request={async () => {
            const res = await getStudent({
              ZT: [0, 1],
              KHXXZZFWId: state?.id,
              XNXQId: state?.XNXQ?.id,
              XQId,
              NJId: NjId,
              BJId,
            });
            if (res.status === 'ok' && res.data) {
              return {
                data: res.data.rows,
                success: true,
                total: res.data.count,
              };
            }
            return [];
          }}
          dateFormatter="string"
        />
      </div>
    </PageContainer>
  );
};
export default SignUp;
