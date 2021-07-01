/* eslint-disable no-console */
import React, { useRef, useState, useEffect } from 'react';
import { Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageContainer from '@/components/PageContainer';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { theme } from '@/theme-default';
import { paginationConfig } from '@/constant';
import SearchComponent from '@/components/Search';
import AddCourse from './components/AddCourse';
import type { CourseItem, TableListParams } from './data';
import styles from './index.less';
import { searchData } from './searchConfig';
import { getAllKHBJSJ } from '@/services/after-class/khbjsj';
import { Tooltip } from 'antd';
import ActionBar from './components/ActionBar';
import { getQueryString } from '@/utils/utils';
import PromptInformation from '@/components/PromptInformation';
import { getKHKCSJ } from '@/services/after-class/khkcsj';
import type { SearchDataType } from '@/components/Search/data';
import { Link } from 'umi';
import WWOpenDataCom from '../ClassManagement/components/WWOpenDataCom';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';

const ClassMaintenance = () => {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<CourseItem>();
  const [dataSource, setDataSource] = useState<SearchDataType>(searchData);
  const actionRef = useRef<ActionType>();
  const [readonly, stereadonly] = useState<boolean>(false);
  const [kcId, setkcId] = useState<string>('');
  // 查询课程名称
  const [mcData, setmcData] = useState<{ label: string; value: string }[]>([]);
  // 查询课程开课时间
  const [classattend, setClassattend] = useState<string[]>([]);
  // 查询课程报名时间
  const [signup, setSignup] = useState<string[]>([]);
  // 学期学年没有数据时提示的开关
  const [kai, setkai] = useState<boolean>(false);
  // 控制学期学年数据提示框的函数
  const kaiguan = () => {
    setkai(false);
  };
  // 弹框名称设定
  const [names, setnames] = useState<string>('bianji');
  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      await initWXAgentConfig(['checkJsApi']);
    })();
  }, []);
  useEffect(() => {
    const curId = getQueryString('courseId');
    if (curId) {
      // 根据课程id重新获取学年学期回调搜索框
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      setkcId(curId);
      (async () => {
        const id = { kcId: curId };
        const res = await getKHKCSJ(id);
        if (res.status === 'ok' && res.data?.KCMC) {
          const newData = [...searchData];
          newData[0].data = [res.data.KCMC];
          setDataSource(newData);
          setmcData([
            {
              label: res.data.KCMC,
              value: curId,
            },
          ]);
          setClassattend([res.data.JKRQ!, res.data.KKRQ!]);
          setSignup([res.data.BMKSSJ!, res.data.BMJSSJ!]);
        }
      })();
    }
  }, []);

  const showDrawer = () => {
    setVisible(true);
    setCurrent(undefined);
    stereadonly(false);
  };

  const handleEdit = (data: any) => {
    const njIds: any[] = [];
    data.NJSJs?.map((item: any) => njIds.push(item.id));
    const list = { ...data, njIds };
    // 默认图片地址
    list.KCTP = '';
    setVisible(true);
    setCurrent(list);
    if (!(data.BJZT === '待发布')) {
      stereadonly(true);
      setnames('chakan');
    } else {
      stereadonly(false);
      setnames('add');
    }
  };

  const onClose = () => {
    setVisible(false);
  };
  const columns: ProColumns<CourseItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      valueType: 'index',
      width: 48,
      align: 'center',
    },
    {
      title: '班级名称',
      dataIndex: 'BJMC',
      key: 'BJMC',
      align: 'center',
      width: '12%',
    },
    {
      title: '费用(元)',
      dataIndex: 'FY',
      key: 'FY',
      align: 'center',
      width: 100,
    },
    {
      title: '班级人数(人)',
      dataIndex: 'BJRS',
      key: 'BJRS',
      align: 'center',
      width: 100,
    },
    {
      title: '主班',
      dataIndex: 'ZJS',
      key: 'ZJS',
      align: 'center',
      width: '10%',
      render: (_, record) => {
        return (
          <div>
            <WWOpenDataCom type="userName" openid={record.ZJS} />
          </div>
        );
      },
    },
    {
      title: '所属校区',
      align: 'center',
      dataIndex: 'XQName',
      key: 'XQName',
    },
    {
      title: '适用年级',
      dataIndex: 'NJSName',
      key: 'NJSName',
      align: 'center',
      ellipsis: true,
      render: (_, record) => {
        return (
          <div className="ui-table-col-elp">
            <Tooltip title={record.NJSName} arrowPointAtCenter>
              {record.NJSName?.split(',')?.map((item: any) => {
                return <Tag>{item}</Tag>;
              })}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: '排课',
      align: 'center',
      width: 100,
      render: (_, record) => {
        const Url = `/courseScheduling?courseId=${record.id}`;
        if (record.BJZT === '待发布' || record.BJZT === '已下架') {
          return (
            <a>
              <Link to={Url}>排课</Link>
            </a>
          );
        }
        return <>已排课</>;
      },
    },
    {
      title: '状态',
      dataIndex: 'BJZT',
      key: 'BJZT',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: '150px',
      align: 'center',
      render: (_, record) => {
        return (
          <>
            <ActionBar record={record} handleEdit={handleEdit} actionRef={actionRef} />
          </>
        );
      },
    },
  ];

  return (
    <>
      <PageContainer cls={styles.roomWrapper}>
        <ProTable<any>
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          request={async (
            param: TableListParams,
            sorter: Record<string, any> | undefined,
            filter: any,
          ) => {
            const opts: TableListParams = {
              ...param,
              sorter: sorter && Object.keys(sorter).length ? sorter : undefined,
              filter,
            };
            return getAllKHBJSJ(
              {
                kcId,
                name: '',
                page: 1,
                pageCount: 0,
              },
              opts,
            );
          }}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
          search={false}
          pagination={paginationConfig}
          headerTitle={<SearchComponent dataSource={dataSource} />}
          toolBarRender={() => [
            <Button
              style={{ background: theme.btnPrimarybg, borderColor: theme.btnPrimarybg }}
              type="primary"
              key="add"
              onClick={() => showDrawer()}
            >
              <PlusOutlined />
              新增班级
            </Button>,
          ]}
        />
        <AddCourse
          kcId={kcId}
          classattend={classattend}
          signup={signup}
          actionRef={actionRef}
          visible={visible}
          onClose={onClose}
          formValues={current}
          readonly={readonly}
          mcData={mcData}
          names={names}
        />
        <PromptInformation
          text="未查询到学年学期数据，请设置学年学期后再来"
          link="/basicalSettings/termManagement"
          open={kai}
          colse={kaiguan}
        />
      </PageContainer>
    </>
  );
};

export default ClassMaintenance;
