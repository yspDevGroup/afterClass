/* eslint-disable no-console */
import React, { useRef, useState } from 'react';
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
import './indexNew.less';

const ClassManagement = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [current] = useState<ClassItem>();
  const [dataSource] = useState<SearchDataType>(searchData);
  const actionRef = useRef<ActionType>();
  const [state, setState] = useState(true);
  const handlerSearch = (type: string, value: string) => {
    console.log(type, value);
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
          <AddArranging setState={setState} />
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
