/* eslint-disable no-console */
import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { Button, Modal, Tag } from 'antd';
import PageContainer from '@/components/PageContainer';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { theme } from '@/theme-default';
import { paginationConfig } from '@/constant';
import SearchComponent from '@/components/Search';
import AddCourse from './components/AddCourse';
import CourseType from './components/CourseType';
import type { CourseItem } from './data';
import styles from './index.less';
import type { SearchDataType } from "@/components/Search/data";
import { searchData } from "./serarchConfig";
import { getAllXNXQ } from '@/services/after-class/xnxq';
import { convertData } from "@/components/Search/util";
import { getAllKHBJSJ } from '@/services/after-class/khbjsj';
import { list } from './mock';
import { Tooltip } from 'antd';
import ActionBar from './components/ActionBar';
import ClassStart from './components/ClassStart';

const CourseManagement = () => {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<CourseItem>();
  const [openes, setopenes] = useState(false);
  const actionRef = useRef<ActionType>();
  const [dataSource, setDataSource] = useState<SearchDataType>(searchData);
  const [readonly, stereadonly] = useState<boolean>(false);
  const [moduletype, setmoduletype] = useState<string>('crourse');
  const [xn, setxn] = useState<string>('2020-2021');
  const [xq, setxq] = useState<string>('第一学期')

  useEffect(() => {
    async function fetchData() {
      const res = await getAllXNXQ({});
      if (res.status === 'ok') {
        const { data = [] } = res;
        const defaultData = [...searchData];
        const newData = convertData(data);
        const term = newData.subData[newData.data[0].key];
        const chainSel = defaultData.find((item) => item.type === 'chainSelect');
        if (chainSel && chainSel.defaultValue) {
          chainSel.defaultValue.first = newData.data[0].key;
          chainSel.defaultValue.second = term[0].key;
          chainSel.data = newData;
        }
        setDataSource(defaultData);
      } else {
        console.log(res.message);
      }
    }
    fetchData();
  }, []);
  // 头部input事件
  const handlerSearch = (type: string, value: string) => {
    if (type === 'year') {
        setxn(value)
        return actionRef.current?.reload();
    }
    setxq(value)
    return actionRef.current?.reload();
};
  const getTitle = () => {
    if (moduletype === 'crourse') {
      return '课程类型维护'
    }
    return '开班信息'
  }

  const showDrawer = () => {
    setVisible(true);
    setCurrent(undefined);
  };

  const handleEdit = (data: CourseItem) => {
    setVisible(true);
    setCurrent(data);
    if (data.BJZT === '已发布' || data.BJZT === '已结课') {
      stereadonly(true)
    }
  };

  const onClose = () => {
    setVisible(false);
  };
  const maintain = (type: string) => {
    setopenes(true);
    setmoduletype(type)
  };
  const showmodal = () => {
    setopenes(false);
  };
  const columns: ProColumns<CourseItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      valueType: 'index',
      width: 48,
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
      width: '10%',
    },
    {
      title: '主班',
      dataIndex: 'ZJS',
      key: 'ZJS',
      align: 'center',
      width: '10%',
    },
    {
      title: '副班',
      dataIndex: 'FJS',
      key: 'FJS',
      align: 'center',
      ellipsis: true,
      width: 100,
    },
    {
      title: '适用年级',
      dataIndex: 'NJMC',
      key: 'NJMC',
      align: 'center',
      ellipsis: true,
      render: (_, record) => {
        const cc: any[]=[]
        record.NJSJs?.map((item: any)=>{    
          return (
            cc.push(item.NJMC)
          )
        })
        return (
          <div className='ui-table-col-elp'>
            <Tooltip title={cc} arrowPointAtCenter>
              {
                cc?.map((item) => {
                  return (
                    <>
                      <Tag>{item}</Tag>
                    </>
                  )
                })
              }
            </Tooltip>
          </div>
        )
      }
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
      width: 200,
      align: 'center',
      render: (_, record) => {
        return (
          <>
            <ActionBar
              record={record}
              handleEdit={handleEdit}
              maintain={maintain}
            />
          </>
        )
      },

    },
  ];

  return (
    <>
      <PageContainer cls={styles.roomWrapper}>
        <ProTable<CourseItem>
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          dataSource={list}
          request={async (param, sorter, filter) => {
            const obj = {
              param,
              sorter,
              filter,
              xn,
              xq,
              page:1,
              pageCount:20,
              name: '',
            };
            const res = await getAllKHBJSJ(obj);
            return res;
          }}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
          search={false}
          pagination={paginationConfig}
          headerTitle={
            <SearchComponent
              dataSource={dataSource}
              onChange={(type: string, value: string) => handlerSearch(type, value)} />
          }
          toolBarRender={() => [
            <Button key="wh" onClick={() => maintain('crourse')}>
              课程类型维护
            </Button>,
            <Button
              style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
              type="primary"
              key="add"
              onClick={() => showDrawer()}
            >
              新增课程
            </Button>,
          ]}
        />
        <AddCourse actionRef={actionRef} visible={visible} onClose={onClose} formValues={current} readonly={readonly} />
        <Modal
          visible={openes}
          onCancel={showmodal}
          title={getTitle()}
          centered
          bodyStyle={{
            maxHeight: '65vh',
            overflowY: 'auto',
          }}
          width={moduletype === 'crourse' ? '40vw' : '30vw'}
          footer={[
            <Button key="back" onClick={() => setopenes(false)}>
              取消
            </Button>,
            <Button key="submit" type="primary">
              确定
            </Button>,
          ]}
        >
          {moduletype === 'crourse' ? <CourseType /> : <ClassStart />}
        </Modal>
      </PageContainer>
    </>
  );
};

export default CourseManagement;
