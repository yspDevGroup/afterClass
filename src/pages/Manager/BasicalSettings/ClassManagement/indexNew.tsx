/* eslint-disable no-console */
import React, { useEffect, useRef, useState } from 'react';
import PageContainer from '@/components/PageContainer';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import './indexNew.less';
import type { ClassItem } from './data';
import { theme } from '@/theme-default';
import { paginationConfig } from '@/constant';
import AddClass from './components/AddClass';
import { getAllXNXQ } from '@/services/after-class/xnxq';
import SearchComponent from '@/components/Search';
import { convertData } from '@/components/Search/util';
import { searchData } from './serarchConfig';
import { getAllNJSJ } from '@/services/after-class/njsj';
import type { SearchDataType } from '@/components/Search/data';
import AddArranging from "./components/AddArranging";
import { newClassData } from './mock';

const ClassManagement = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<ClassItem>();
  const [dataSource, setDataSource] = useState<SearchDataType>(searchData);
  const actionRef = useRef<ActionType>();
  const [state, setState] = useState(true);
  useEffect(() => {
    (async () => {
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
      const result = await getAllNJSJ();
      if (result.status === 'ok') {
        const { data = [] } = result;
        const defaultData = [...searchData];
        const grideSel = defaultData.find((item: any) => item.label === '年级：');
        if (grideSel && grideSel.data) {
          grideSel.defaultValue!.first = data[0].NJMC;
          grideSel.data = data;
        }
        setDataSource(defaultData);
      } else {
        console.log(result.message);
      }
    })();
  }, []);

  const handlerSearch = (type: string, value: string) => {
    console.log(type, value);
  };
  // const getModelTitle = () => {
  //     if (current) {
  //         return '编辑信息';
  //     }
  //     return '新增';
  // };
  const showDrawer = () => {
    setState(false)
    // setCurrent(undefined);
    // setModalVisible(true);
  };

  // const handleEdit = (data: ClassItem) => {
  //     setCurrent(data);
  //     getModelTitle();
  //     setModalVisible(true);
  // };

  const onClose = () => {
    setModalVisible(false);
  };

  const columns: ProColumns<ClassItem>[] = [
    {
      title: '',
      dataIndex: 'room',
      key: 'room',
      align: 'center',
      width: 66,
    },
    {
      title: '',
      dataIndex: 'course',
      key: 'course',
      width: 136,
      render: (text: any) => {
        return (
          <div>
            <div>{text.lesson}</div>
            <div>{text.time}</div>
          </div>
        );
      },
    },
    {
      title: '周一',
      dataIndex: 'monday',
      key: 'monday',
      align: 'center',
      width: 136,
      render: (text: any) => {
        return (
          <div className="classCard">
            <div className={`cardTop cardTop${text.key}`} />
            <div className={`cardcontent cardTop${text.key} cardcontent${text.key}`}>
              <div className="cla">{text.cla}</div>
              <div className="teacher">{text.teacher}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '周二',
      dataIndex: 'tuesday',
      key: 'tuesday',
      align: 'center',
      width: 136,
      render: (text: any) => {
        return (
          <div className="classCard">
            <div className={`cardTop cardTop${text.key}`} />
            <div className={`cardcontent cardTop${text.key} cardcontent${text.key}`}>
              <div className="cla">{text.cla}</div>
              <div className="teacher">{text.teacher}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '周三',
      dataIndex: 'wednesday',
      key: 'wednesday',
      align: 'center',
      width: 136,
      render: (text: any) => {
        return (
          <div className="classCard">
            <div className={`cardTop cardTop${text.key}`} />
            <div className={`cardcontent cardTop${text.key} cardcontent${text.key}`}>
              <div className="cla">{text.cla}</div>
              <div className="teacher">{text.teacher}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '周四',
      dataIndex: 'thursday',
      key: 'thursday',
      align: 'center',
      width: 136,
      render: (text: any) => {
        return (
          <div className="classCard">
            <div className={`cardTop cardTop${text.key}`} />
            <div className={`cardcontent cardTop${text.key} cardcontent${text.key}`}>
              <div className="cla">{text.cla}</div>
              <div className="teacher">{text.teacher}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '周五',
      dataIndex: 'friday',
      key: 'friday',
      align: 'center',
      width: 136,
      render: (text: any) => {
        return (
          <div className="classCard">
            <div className={`cardTop cardTop${text.key}`} />
            <div className={`cardcontent cardTop${text.key} cardcontent${text.key}`}>
              <div className="cla">{text.cla}</div>
              <div className="teacher">{text.teacher}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '周六',
      dataIndex: 'saturday',
      key: 'saturday',
      align: 'center',
      width: 136,
      render: (text: any) => {
        return (
          <div className="classCard">
            <div className={`cardTop cardTop${text.key}`} />
            <div className={`cardcontent cardTop${text.key} cardcontent${text.key}`}>
              <div className="cla">{text.cla}</div>
              <div className="teacher">{text.teacher}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '周日',
      dataIndex: 'sunday',
      key: 'sunday',
      align: 'center',
      width: 136,
      render: (text: any) => {
        return (
          <div className="classCard">
            <div className={`cardTop cardTop${text.key}`} />
            <div className={`cardcontent cardTop${text.key} cardcontent${text.key}`}>
              <div className="cla">{text.cla}</div>
              <div className="teacher">{text.teacher}</div>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <PageContainer>
        {state === true ? 
           <ProTable<ClassItem>
           columns={columns}
           dataSource={newClassData}
           search={false}
           bordered
           headerTitle={
             <SearchComponent
               dataSource={dataSource}
               onChange={(type: string, value: string) => handlerSearch(type, value)}
             />
           }
           options={{
             setting: false,
             fullScreen: false,
             density: false,
             reload: false,
           }}
           // request={(param, sorter, filter) => {
           //     const obj = {
           //         param,
           //         sorter,
           //         filter,
           //         njId: 'dd149420-7d4b-4191-8ddc-6b686a2bd63f',
           //         xn: '2021学年',
           //         xq: '第一学期',
           //         name: '',
           //     };
           //     return getAllKHPKSJ(obj);
           // }}
           pagination={paginationConfig}
           toolBarRender={() => [
             <Button
               style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
               type="primary"
               key="add"
               onClick={() => showDrawer()}
             >
               新增课程
             </Button>,
           ]}
         />:<AddArranging setState={setState} />}
       
        <AddClass
          visible={modalVisible}
          onClose={onClose}
          formValues={current}
          actionRef={actionRef}
        />
      </PageContainer>
    </>
  );
};
export default ClassManagement;
