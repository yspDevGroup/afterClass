/*
 * @description:
 * @author: Wu Zhan
 * @Date: 2021-12-14 08:59:02
 * @LastEditTime: 2021-12-14 14:23:07
 * @LastEditors: Wu Zhan
 */
import PageContain from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Input, message, Popconfirm, Select, Switch, Tag, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, useModel } from 'umi';
import styles from './index.less';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getAllKHFWSJ, deleteKHFWSJ, updateKHFWSJ } from '@/services/after-class/khfwsj';
import { getAllXQSJ } from '@/services/after-class/xqsj';
import SearchLayout from '@/components/Search/Layout';
import SeveiceBasics from '../components/SeveiceBasics';
import EllipsisHint from '@/components/EllipsisHint';
import { getTableWidth } from '@/utils/utils';

const { Option } = Select;
const { Search } = Input;
const ServiceConfiguration = () => {
  const actionRef = useRef<ActionType>();
  // 校区
  const [campusId, setCampusId] = useState<string>();
  const [campusData, setCampusData] = useState<any[]>();

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [curXNXQId, setCurXNXQId] = useState<string | undefined>(undefined);
  const [curTitle, setCurTitle] = useState<string | undefined>(undefined);
  const [dataSource, setDataSource] = useState<any>([]);
  const [curXNXQData, setCurXNXQData] = useState<any[]>();

  const getCampusData = async () => {
    const res = await getAllXQSJ({
      XXJBSJId: currentUser?.xxId,
    });
    if (res?.status === 'ok') {
      const arr = res?.data?.map((item) => {
        return {
          label: item.XQMC,
          value: item.id,
        };
      });
      if (arr?.length) {
        setCampusId(arr?.find((item) => item.label === '本校')?.value);
      }
      setCampusData(arr);
    }
  };

  const getData = async () => {
    if (curXNXQId) {
      const res = await getAllKHFWSJ({
        XNXQId: curXNXQId,
        XQSJId: campusId,
        FWMC: curTitle
      });

      if (res.status === 'ok' && res.data) {
        setDataSource(res.data?.rows);
        
      }
    }
  };

  const onCampusChange = (value: any) => {
    setCampusId(value);
    getData();
  };
  useEffect(() => {
    (async () => {
      const result = await queryXNXQList(currentUser?.xxId);
      setCurXNXQId(result?.current?.id);
      setCurXNXQData(result?.data);
    })();
    getCampusData();
  }, []);

  useEffect(() => {
    if (curXNXQId) {
      getData();
    }
  }, [campusId, curXNXQId,curTitle]);

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center',
    },
    {
      title: '服务模板',
      dataIndex: 'FWMC',
      key: 'FWMC',
      align: 'center',
      width: 160,
    },
    {
      title: '所属学期',
      dataIndex: 'XNXQ',
      key: 'XNXQ',
      align: 'center',
      width: 160,
      render: (_, record) => {
        return `${record.XNXQ?.XN} ${record.XNXQ?.XQ}`;
      },
    },
    {
      title: '所属学区',
      dataIndex: 'XQSJ',
      key: 'XQSJ',
      align: 'center',
      width: 100,
      render: (_, record) => {
        return record.XQSJ?.XQMC;
      },
    },
    {
      title: '适用年级',
      key: 'NJSJs',
      dataIndex: 'NJSJs',
      search: false,
      align: 'center',
      width: 200,
      render: (text: any) => {
        return (
          <EllipsisHint
            width="100%"
            text={text?.map((item: any) => {
              return <Tag key={item?.id}>{`${item?.XD}${item?.NJMC}`}</Tag>;
            })}
          />
        );
      },
    },
    {
      title: '已选课程班',
      dataIndex: 'ZDKCS',
      key: 'ZDKCS',
      align: 'center',
      width: 100,
    },
    {
      title: '服务费用',
      dataIndex: 'FWFY',
      key: 'FWFY',
      align: 'center',
      width: 80,
    },
    {
      title: '服务状态',
      dataIndex: 'FWZT',
      key: 'FWZT',
      align: 'center',
      width: 100,
      render: (_, record) => {
        return <Switch checkedChildren="开启" unCheckedChildren="停用" checked={record.FWZT === 1} onChange={async () => {
          const result = await updateKHFWSJ({ id: record.id }, {
            FWZT: record.FWZT === 1 ? 0 : 1
          });
          if (result.status === 'ok') {
            message.success('服务状态已更新');
            getData();
          }
        }} />;
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 150,
      render: (_, record) => {
        return (
          <>
            {record.FWZT === 1 ? '' : <SeveiceBasics title={'编辑服务模板'} reload={getData} serviceId={record.id} />}
            <Popconfirm
              title="彻底删除后数据将不可恢复，是否删除?"
              onConfirm={async () => {
                try {
                  const result = await deleteKHFWSJ({ id: record.id });
                  if (result.status === 'ok') {
                    message.success('删除成功');
                    getData();
                  } else {
                    message.error('删除失败，请联系管理员或稍后重试。');
                  }
                } catch (err) {
                  message.error('删除失败，请联系管理员或稍后重试。');
                }
              }}
              okText="Yes"
              cancelText="No"
              placement="topLeft"
            >
              <a href="#" style={{ color: 'red' }}>
                <Tooltip title="删除">
                  <a>删除</a>
                </Tooltip>
              </a>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  // 学年学期筛选
  const onXNXQChange=(value: string)=>{
    curXNXQData?.forEach((item: any)=>{
      if(item.id===value){
        setCurXNXQId(value);
        actionRef.current?.reloadAndRest();
      }
    })
  }

  return (
    <div className={styles.AdministrativeClass}>
      <PageContain>
        <ProTable<any>
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          pagination={{
            showQuickJumper: true,
            pageSize: 10,
            defaultCurrent: 1,
          }}
          dataSource={dataSource}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
          search={false}
          scroll={{ x: getTableWidth(columns) }}
          headerTitle={
            <SearchLayout>  
              <div>
                <label htmlFor="grade">校区名称：</label>
                <Select value={campusId} placeholder="请选择" onChange={onCampusChange}>
                  {campusData?.map((item: any) => {
                    return <Option value={item.value}>{item.label}</Option>;
                  })}
                </Select>
              </div>
              <div>
                <label htmlFor="grade">学年学期：</label>
                <Select value={curXNXQId} placeholder="请选择" onChange={onXNXQChange}>
                  {curXNXQData?.map((item: any) => {
                    return <Option value={item.id}>{`${item.XN}-${item.XQ}`}</Option>;
                  })}
                </Select>
              </div>
              <div>
                <label htmlFor="grade">服务模板：</label>
                <Search
                  placeholder="服务模板"
                  allowClear
                  onSearch={(value: string) => {
                    setCurTitle(value);
                  }}
                />
              </div>
            </SearchLayout>
          }
          toolBarRender={() => [
            <SeveiceBasics title={'新增服务模板'} reload={getData} />,
          ]}
        />
      </PageContain>
    </div>
  );
};

export default ServiceConfiguration;
