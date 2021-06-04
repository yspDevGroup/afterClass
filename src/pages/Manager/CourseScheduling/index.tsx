/* eslint-disable array-callback-return */
/* eslint-disable no-console */
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import type { ActionType } from '@ant-design/pro-table';
import type { SearchDataType } from '@/components/Search/data';
import PageContainer from '@/components/PageContainer';
import SearchComponent from '@/components/Search';
import ExcelTable from '@/components/ExcelTable';
import { theme } from '@/theme-default';
import { getFJPlan } from '@/services/after-class/fjsj';
import { PlusOutlined } from '@ant-design/icons';
import AddArranging from './components/AddArranging';
import AddClass from './components/AddClass';
import type { ClassItem } from './data';
import { searchData } from './searchConfig';
import './index.less';
import { getAllXNXQ } from '@/services/after-class/xnxq';
import { convertData } from '@/components/Search/util';

type pkIdListType = { jsId: string; pkId: Set<unknown> };

const ClassManagement = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [current] = useState<ClassItem>();
  const actionRef = useRef<ActionType>();
  const [state, setState] = useState(true);
  const [dataSource, setDataSource] = useState<SearchDataType>(searchData);
  const [xn, setXn] = useState<any>();
  const [xq, setXq] = useState<any>();
  const [tableDataSource, setTableDataSource] = useState<any>([]);

  const showDrawer = () => {
    setState(false);
  };
  const processingData = (data: any[]) => {
    const week = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const pkIdList: pkIdListType[] = [];

    // 1、先拿出每个场地所有的排课
    data.map((item: any) => {
      const pkList: pkIdListType = {
        jsId: item.id,
        pkId: new Set(),
      };
      item.KHPKSJs.map((pkItem: any) => {
        pkList.pkId.add(pkItem.XXSJPZ.id);
      });
      pkIdList.push(pkList);
    });
    const tableData: any[] = [];
    // TODO 可能存在的问题：2个以上不同的场地可能会出现问题

    // 2、根据排课的个数去循环教室场地
    pkIdList.map((kcIdItem: pkIdListType) => {
      const pkData = [...kcIdItem.pkId];

      // 每个教室的排课
      pkData.map((pkItem: any, pkKey: number) => {
        const table = {
          room: {},
          course: {},
        };

        data.map((item: any) => {
          // 教室
          table.room = {
            cla: item.FJMC,
            teacher: '',
            jsId: item.id,
            rowspan: pkKey === 0 ? pkData.length : 0,
          };

          item.KHPKSJs.map((pItem: any) => {
            // 教室周几的课 （根据第一步去重的排课作比较）
            if (pkItem === pItem.XXSJPZ.id) {
              table[week[pItem.WEEKDAY]] = {
                weekId: pItem.id,
                cla: pItem.KHBJSJ.BJMC,
                teacher: pItem.KHBJSJ.ZJS,
                bjId: pItem.KHBJSJ.id,
                color: pItem.KHBJSJ.KBYS,
                dis: true,
              };
              // 教室课节
              table.course = {
                cla: pItem.XXSJPZ.SDMC,
                teacher: `${pItem.XXSJPZ.KSSJ.slice(0, 5)} — ${pItem.XXSJPZ.JSSJ.slice(0, 5)}`,
                hjId: pItem.XXSJPZ.id,
              };
            }
          });
        });
        tableData.push(table);
      });
    });
    return tableData;
  };

  // 头部input事件
  const handlerSearch = (type: string, value: string, term: string) => {
    const res = getFJPlan({ xn: value, xq: term });
    Promise.resolve(res).then((data: any) => {
      if (data.status === 'ok') {
        const tableData = processingData(data.data);
        setTableDataSource(tableData);
      }
    });
  };
  useEffect(() => {
    (async () => {
      // 学年学期数据的获取
      const res = await getAllXNXQ({});
      if (res.status === 'ok') {
        const { data = [] } = res;
        const defaultData = [...searchData];
        const newData = convertData(data);
        if (newData.data && newData.data.length > 0) {
          const term = newData.subData[newData?.data[0]?.key];
          const chainSel = defaultData.find((item) => item.type === 'chainSelect');
          if (chainSel && chainSel.defaultValue) {
            chainSel.defaultValue.first = newData?.data[0].key;
            chainSel.defaultValue.second = term[0]?.key;
            setXn(chainSel.defaultValue.first);
            setXq(chainSel.defaultValue.second);
            chainSel.data = newData;
          }
          setDataSource(defaultData);
          const resla = getFJPlan({
            xn: defaultData[0].defaultValue?.first,
            xq: defaultData[0].defaultValue?.second,
          });
          Promise.resolve(resla).then((datas: any) => {
            if (datas.status === 'ok') {
              const tableData = processingData(datas.data);
              setTableDataSource(tableData);
            }
          });
        }
      } else {
        console.log(res.message);
      }
    })();
  }, []);
  const onClose = () => {
    setModalVisible(false);
  };

  const columns: {
    title: string;
    dataIndex: string;
    key: string;
    align: 'center' | 'left' | 'right';
    width: number;
  }[] = [
    {
      title: '',
      dataIndex: 'room',
      key: 'room',
      align: 'center',
      width: 100,
    },
    {
      title: '',
      dataIndex: 'course',
      key: 'course',
      align: 'left',
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
  const onExcelTableClick = (value: any) => {
    console.log('value', value);
  };
  return (
    <>
      <PageContainer>
        {state === true ? (
          <div>
            <div
              style={{
                display: 'flex',
                paddingBottom: '16px',
                paddingTop: '16px',
                paddingLeft: '24px',
                boxShadow: '0px 1px 0px #E4E4E4',
              }}
            >
              <div>
                <SearchComponent
                  dataSource={dataSource}
                  onChange={(type: string, value: string, term: string) =>
                    handlerSearch(type, value, term)
                  }
                />
              </div>
              <div style={{ position: 'absolute', right: 48 }}>
                <Button
                  style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
                  type="primary"
                  key="add"
                  onClick={() => showDrawer()}
                >
                  <PlusOutlined />
                  新增排课
                </Button>
              </div>
            </div>
            <ExcelTable
              className={''}
              columns={columns}
              dataSource={tableDataSource}
              switchPages={showDrawer}
              onExcelTableClick={onExcelTableClick}
            />
          </div>
        ) : (
          <AddArranging
            setState={setState}
            xn={xn}
            xq={xq}
            tableDataSource={tableDataSource}
            processingData={processingData}
            setTableDataSource={setTableDataSource}
          />
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
