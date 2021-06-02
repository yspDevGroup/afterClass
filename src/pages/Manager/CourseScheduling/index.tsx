/* eslint-disable no-console */
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import type { ActionType } from '@ant-design/pro-table';
import type { SearchDataType } from '@/components/Search/data';
import PageContainer from '@/components/PageContainer';
import SearchComponent from '@/components/Search';
import ExcelTable from '@/components/ExcelTable';
import { theme } from '@/theme-default';
import AddArranging from './components/AddArranging';
import AddClass from './components/AddClass';
import type { ClassItem } from './data';
import { searchData } from './serarchConfig';
import { newClassData } from './mock';
import './index.less';
import { getAllXNXQ } from '@/services/after-class/xnxq';
import { convertData } from '@/components/Search/util';

const ClassManagement = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [current] = useState<ClassItem>();
  const actionRef = useRef<ActionType>();
  const [state, setState] = useState(true);
  const [dataSource, setDataSource] = useState<SearchDataType>(searchData);
  const [xn, setXn] = useState<any>();
  const [xq, setXq] = useState<any>();
  useEffect(() => {
    (async () => {
      // 学年学期数据的获取
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
          setXn(chainSel.defaultValue.first);
          setXq(chainSel.defaultValue.second);
          chainSel.data = newData;
        }
        setDataSource(defaultData);
      } else {
        console.log(res.message);
      }
    })()


  }, [])
  // 头部input事件
  const handlerSearch = (type: string, value: string) => {
    console.log(value);
  };
  const showDrawer = () => {
    setState(false);
    // setCurrent(undefined);
    // setModalVisible(true);
  };

  const onClose = () => {
    setModalVisible(false);
  };

  const chosenData = {
    cla: '幼儿班',
    teacher: '刘进',
  };
  const onExcelTableClick = (value: any) => {
    console.log('onExcelTableClickvalue', value);
  };
  const columns = [
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
    },
    {
      title: '周一',
      dataIndex: 'monday',
      key: 'monday',
      align: 'center',
      width: 136,
    },
    {
      title: '周二',
      dataIndex: 'tuesday',
      key: 'tuesday',
      align: 'center',
      width: 136,
    },
    {
      title: '周三',
      dataIndex: 'wednesday',
      key: 'wednesday',
      align: 'center',
      width: 136,
    },
    {
      title: '周四',
      dataIndex: 'thursday',
      key: 'thursday',
      align: 'center',
      width: 136,
    },
    {
      title: '周五',
      dataIndex: 'friday',
      key: 'friday',
      align: 'center',
      width: 136,
    },
    {
      title: '周六',
      dataIndex: 'saturday',
      key: 'saturday',
      align: 'center',
      width: 136,
    },
    {
      title: '周日',
      dataIndex: 'sunday',
      key: 'sunday',
      align: 'center',
      width: 136,
    },
  ];

  return (
    <>
      <PageContainer>
        {state === true ? (
          <div>
            <div style={{ display: 'flex' }}>
              <div>
                <SearchComponent
                  dataSource={dataSource}
                  onChange={(type: string, value: string) => handlerSearch(type, value)}
                />

              </div>
              <div style={{ position: 'absolute', right: 24 }}>
                <Button
                  style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
                  type="primary"
                  key="add"
                  onClick={() => showDrawer()}
                >
                  新增课程
                </Button>
              </div>
            </div>
            <ExcelTable
              columns={columns}
              dataSource={newClassData}
              chosenData={chosenData}
              onExcelTableClick={onExcelTableClick}
              switchPages={showDrawer}
            />
          </div>
        ) : (
          <AddArranging setState={setState} xn={xn} xq={xq} />
        )}
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
