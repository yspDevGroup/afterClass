/* eslint-disable no-console */
import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { Button, Modal, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
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
import { searchData } from "./searchConfig";
import { getAllKHBJSJ } from '@/services/after-class/khbjsj';
import { Tooltip } from 'antd';
import ActionBar from './components/ActionBar';
import ClassStart from './components/ClassStart';
import { getAllNJSJ } from '@/services/after-class/njsj';
import { getAllXNXQ } from '@/services/after-class/xnxq';
import { convertData } from "@/components/Search/util";
import { getQueryString } from '@/utils/utils';
import PromptInformation from '@/components/PromptInformation';

const CourseManagement = () => {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<CourseItem>();
  const [openes, setopenes] = useState(false);
  const actionRef = useRef<ActionType>();
  const [dataSource, setDataSource] = useState<SearchDataType>(searchData);
  const [readonly, stereadonly] = useState<boolean>(false);
  const [moduletype, setmoduletype] = useState<string>('crourse');
  const [xn, setxn] = useState<string>('2020-2021');
  const [xq, setxq] = useState<string>('第一学期');
  const [kcId, setkcId] = useState<string>('')

  useEffect(() => {
    async function fetchData() {
      const res = await getAllXNXQ({});
      if (res.status === 'ok') {
        const { data = [] } = res;
        const defaultData = [...searchData];
        const newData = convertData(data);
        if (newData.data && newData.data.length > 0) {
          const term = newData.subData[newData.data[0].key];
          const chainSel = defaultData.find((item) => item.type === 'chainSelect');
          if (chainSel && chainSel.defaultValue) {
            chainSel.defaultValue.first = newData.data[0].key;
            chainSel.defaultValue.second = term[0].key;
            chainSel.data = newData;
          }
          setDataSource(defaultData);
        }else{
          <PromptInformation text='未查询到学年学期数据，请设置学年学期后再来'  link='/basicalSettings/termManagement'/>
      }
      } else {
        console.log(res.message);
      }
      // 年级数据的获取
      const result = await getAllNJSJ({});
      if (result.status === 'ok') {
        const { data = [] } = result;
        const defaultData = [...searchData];
        const grideSel = defaultData.find((item: any) => item.type === 'select');
        if (grideSel && grideSel.data) {
          grideSel.defaultValue!.first = data[0].NJMC;
          grideSel.data = data;
        }
        setDataSource(defaultData);
      } else {
        console.log(result.message);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    const curId = getQueryString("courseId");
    if (curId) {
      setkcId(curId)
    }
  }, [])
  // 头部input事件
  const handlerSearch = (type: string, value: string, term: string) => {
    if (type === 'year' || type === 'term') {
      setxn(value);
      setxq(term);
      return actionRef.current?.reload();
    }
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

  const handleEdit = (data: any) => {
    const NJSJs: any[] = [];
    data.NJSJs.map((item: any) => (
      NJSJs.push(item.id)
    ))
    const list = { ...data, NJSJs }
    list.KCTP = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    setVisible(true);
    setCurrent(list);
    console.log(data)
    if (data.BJZT === '已结课' || data.BJZT === '已发布') {
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

    },
    {
      title: '适用年级',
      dataIndex: 'NJMC',
      key: 'NJMC',
      align: 'center',
      ellipsis: true,
      render: (_, record) => {
        const cc: any[] = []
        record.NJSJs?.map((item: any) => {
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
      width: '14%',
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
        <ProTable<any>
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          request={async (param, sorter, filter) => {
            const obj = {
              param,
              sorter,
              filter,
              xn,
              xq,
              kcId,
              page: 1,
              pageCount: 20,
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
              onChange={(type: string, value: string, term: string) => handlerSearch(type, value, term)} />
          }
          toolBarRender={() => [
            <Button
              style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
              type="primary"
              key="add"
              onClick={() => showDrawer()}
            >
              <PlusOutlined />新增班级
            </Button>,
          ]}
        />
        <AddCourse actionRef={actionRef} visible={visible} onClose={onClose} formValues={current} readonly={readonly} xn={xn} xq={xq} />
        <Modal
          visible={openes}
          onCancel={showmodal}
          title={getTitle()}
          centered
          bodyStyle={{
            maxHeight: '65vh',
            overflowY: 'auto',
          }}
          width='35vw'
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
