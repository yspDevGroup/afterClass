/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
import React, { useRef, useState, useEffect } from 'react';
import { useModel } from 'umi';
import { Select, Tag } from 'antd';
import { Input } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import PageContainer from '@/components/PageContainer';
import { getTableWidth } from '@/utils/utils';
import SearchLayout from '@/components/Search/Layout';
import styles from './index.less';
import { getAllXSJBSJ } from '@/services/after-class/xsjbsj';
import EllipsisHint from '@/components/EllipsisHint';
import SelectParent from './SelectParent';
import { getAllBJSJ } from '@/services/after-class/bjsj';
import { getGradesByCampus } from '@/services/after-class/njsj';
import { getAllXQSJ } from '@/services/after-class/xqsj';

type selectType = { label: string; value: string };
const { Search } = Input;
const StudentMaintenance = () => {
  // 列表对象引用，可主动执行刷新等操作
  const actionRef = useRef<ActionType>();
  const [NjId, setNjId] = useState<any>();
  const [NjData, setNjData] = useState<any>();
  const [BJId, setBJId] = useState<string | undefined>(undefined);
  const [bjData, setBJData] = useState<selectType[] | undefined>([]);
  const [dataSource, setDataSource] = useState<API.XSJBSJ[]>([]);
  // 校区
  const [campusId, setCampusId] = useState<string>();
  const [campusData, setCampusData] = useState<any[]>();
  // 模态框的新增或编辑form定义
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [name, setName] = useState<string>();
  // const [Telephone, setTelephone] = useState<string>();
  const getData = async () => {
    // const res = await getParent({});
    const resAll = await getAllXSJBSJ({
      XXJBSJId: currentUser?.xxId,
      keyWord: name,
      XQId: campusId,
      BJId: BJId ? [BJId] : undefined,
      NJId: NjId ? [NjId] : undefined,
      page: 0,
      pageSize: 0,
    });
    if (resAll.status === 'ok' && resAll.data?.rows) {
      setDataSource(resAll.data.rows);
    } else {
      setDataSource([]);
    }
  };

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
      width: 58,
      fixed: 'left',
    },
    {
      title: '校区',
      dataIndex: 'XQSJ',
      key: 'XQSJ',
      align: 'center',
      width: 80,
      fixed: 'left',
      render: (text: any) => {
        return text?.XQMC;
      },
    },
    {
      title: '学生姓名',
      dataIndex: 'XM',
      key: 'XM',
      align: 'center',
      width: 80,
      fixed: 'left',
    },
    {
      title: '行政班名称',
      dataIndex: 'BJSJ',
      key: 'BJSJ',
      align: 'center',
      width: 160,
      render: (text: any) => {
        return `${text?.NJSJ?.XD}${text?.NJSJ?.NJMC}${text.BJ}`;
      },
    },
    {
      title: '家长姓名',
      dataIndex: 'Parents',
      key: 'Parents',
      align: 'center',
      width: 160,
      render: (text: any) => {
        return (
          <EllipsisHint
            width="100%"
            text={text?.map((item: any) => {
              return <Tag key={item.id}>{item.XM}</Tag>;
            })}
          />
        );
      },
    },
    // {
    //   title: '家长电话',
    //   dataIndex: 'parent',
    //   key: 'parent',
    //   align: 'center',
    //   width: 160,
    //   render: (text: any, record: any) => {
    //     return (
    //       <EllipsisHint
    //         width="100%"
    //         text={[].map((item: any) => {
    //           return <Tag key={item.id}>{item.LXDH}</Tag>;
    //         })}
    //       />
    //     );
    //   },
    // },

    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      width: 80,
      render: (_, record) => {
        return (
          <SelectParent
            id={record.id}
            onRefresh={getData}
            XXJBSJId={currentUser?.xxId}
            ParentIds={record?.Parents?.map((item: any) => item.id)}
          />
        );
      },
    },
  ];

  const getCampusData = async () => {
    const res = await getAllXQSJ({
      XXJBSJId: currentUser?.xxId,
    });
    if (res?.status === 'ok') {
      const arr = res?.data?.map((item: any) => {
        return {
          label: item.XQMC,
          value: item.id,
        };
      });
      if (arr?.length) {
        let id = arr?.find((item: any) => item.label === '本校')?.value;
        if (!id) {
          id = arr[0].value;
        }
        setCampusId(id);
      }
      setCampusData(arr);
    }
  };

  const getBJSJ = async () => {
    const res = await getAllBJSJ({ XQSJId: campusId, njId: NjId, page: 0, pageSize: 0 });
    if (res.status === 'ok') {
      const data = res.data?.rows?.map((item: any) => {
        return { label: item.BJ, value: item.id };
      });
      setBJData(data);
    }
  };
  const onBjChange = async (value: any) => {
    setBJId(value);
  };
  const onNjChange = async (value: any) => {
    setNjId(value);
  };

  const getNJSJ = async () => {
    if (campusId) {
      const res = await getGradesByCampus({
        XQSJId: campusId,
      });
      if (res.status === 'ok') {
        // console.log('res', res);
        setNjData(res.data);
      }
    }
  };

  useEffect(() => {
    if (campusId) {
      getNJSJ();
      setBJId(undefined);
      setNjId(undefined);
    }
  }, [campusId]);

  useEffect(() => {
    getCampusData();
  }, []);

  useEffect(() => {
    getData();
  }, [name, BJId, NjId]);

  useEffect(() => {
    if (NjId) {
      getBJSJ();
      setBJId(undefined);
    }
  }, [NjId]);

  const onCampusChange = (value: any) => {
    setCampusId(value);
  };
  return (
    <PageContainer cls={styles.roomWrapper}>
      <ProTable<any>
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        dataSource={dataSource}
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
          defaultCurrent: 1,
        }}
        scroll={{ x: getTableWidth(columns) }}
        headerTitle={
          <SearchLayout>
            <div>
              <label htmlFor="type">学生姓名：</label>
              <Search
                placeholder="学生姓名"
                allowClear
                onSearch={(value: string) => {
                  setName(value);
                }}
              />
            </div>
            <div>
              <label htmlFor="grade">校区名称：</label>
              <Select value={campusId} placeholder="请选择" onChange={onCampusChange}>
                {campusData?.map((item: any) => {
                  return (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
            </div>
            <div>
              <label htmlFor="grade">年级名称：</label>
              <Select value={NjId} allowClear placeholder="请选择" onChange={onNjChange}>
                {NjData?.map((item: any) => {
                  return <Option key={item.id} value={item.id}>{`${item.XD}${item.NJMC}`}</Option>;
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
            {/* <div>
              <label htmlFor="type">联系电话：</label>
              <Search
                placeholder="联系电话"
                allowClear
                onSearch={(value: string) => {
                  setTelephone(value.replace(/^\s*|\s*$/g, ''));
                }}
              />
            </div> */}
          </SearchLayout>
        }
        options={{
          setting: false,
          fullScreen: false,
          density: false,
          reload: false,
        }}
        search={false}
      />
    </PageContainer>
  );
};

export default StudentMaintenance;
