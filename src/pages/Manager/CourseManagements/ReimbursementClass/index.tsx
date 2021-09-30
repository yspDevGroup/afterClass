import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { Select, Popconfirm, Divider, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import PageContainer from '@/components/PageContainer';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getKHTKSJ, updateKHTKSJ } from '@/services/after-class/khtksj';

import Style from './index.less';

const { Option } = Select;
// 退课
const ReimbursementClass = () => {
  // 获取到当前学校的一些信息
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
          //  拿到默认值 发送请求
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
    },
    {
      title: '课程名称 ',
      dataIndex: 'KHBJSJ',
      key: 'KHBJSJ',
      align: 'center',
      render: (text: any) => {
        return text?.KHKCSJ?.KCMC;
      },
    },
    {
      title: '班级名称  ',
      dataIndex: 'KHBJSJ',
      key: 'KHBJSJ',
      align: 'center',
      render: (text: any) => {
        return text?.BJMC;
      },
    },
    {
      title: '退课课时数',
      dataIndex: 'KSS',
      key: 'KSS',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'ZT',
      key: 'ZT',
      align: 'center',
      valueEnum: {
        0: {
          text: '申请中',
          status: 'Processing',
        },
        1: {
          text: '已通过',
          status: 'Success',
        },
        2: {
          text: '已驳回',
          status: 'Error',
        },
      },
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: '',
      key: '',
      align: 'center',
      render: (record: any) =>
        record.ZT === 0 ? (
          <>
            <Popconfirm
              title="确认要同意么?"
              onConfirm={async () => {
                try {
                  if (record.id) {
                    const params = { id: record.id };
                    const body = { ZT: 1 };
                    const res3 = await updateKHTKSJ(params, body);
                    if (res3.status === 'ok') {
                      message.success('已同意退课');
                      actionRef.current?.reload();
                    }
                  }
                } catch (err) {
                  message.error('删除课程出现错误，请联系管理员确认已删除');
                }
              }}
            >
              <a>同意</a>
            </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm
              title="不同意"
              onConfirm={async () => {
                try {
                  if (record.id) {
                    const params = { id: record.id };
                    const body = { ZT: 2 };
                    const res3 = await updateKHTKSJ(params, body);
                    if (res3.status === 'ok') {
                      message.success('驳回退课申请');
                      actionRef.current?.reload();
                    }
                  }
                } catch (err) {
                  message.error('删除课程出现错误，请联系管理员确认已删除');
                }
              }}
            >
              <a>不同意</a>
            </Popconfirm>
          </>
        ) : (
          ''
        ),
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
              //更新多选框的值
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
        <ProTable<any>
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          request={async () => {
            const resAll = await getKHTKSJ({
              XXJBSJId: currentUser?.xxId,
              XNXQId: curXNXQId,
            });
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
export default ReimbursementClass;
