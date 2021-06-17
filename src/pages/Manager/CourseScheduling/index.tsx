/* eslint-disable array-callback-return */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { Button, Radio } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import type { SearchDataType } from '@/components/Search/data';
import PageContainer from '@/components/PageContainer';
import SearchComponent from '@/components/Search';
import ExcelTable from '@/components/ExcelTable';
import { convertData } from '@/components/Search/util';
import PromptInformation from '@/components/PromptInformation';
import { theme } from '@/theme-default';

import { getFJPlan } from '@/services/after-class/fjsj';
import { getAllXNXQ } from '@/services/after-class/xnxq';
import { getAllXXSJPZ } from '@/services/after-class/xxsjpz';
import { queryXQList } from '@/services/wechat/service';

import AddArranging from './components/AddArranging';
import { searchData } from './searchConfig';
import './index.less';

const ClassManagement = () => {
  const [state, setState] = useState(true);
  const [dataSource, setDataSource] = useState<SearchDataType>(searchData);
  const [xn, setXn] = useState<any>();
  const [xq, setXq] = useState<any>();
  const [tableDataSource, setTableDataSource] = useState<any>([]);
  const [radioValue, setRadioValue] = React.useState(false);
  const [xXSJPZData, setXXSJPZData] = useState<any>([]);
  const [recordValue, setRecordValue] = useState<any>({});
  const [BJID, setBJIDData] = useState<any>('');

  // 校区
  const [campus, setCampus] = useState<any>([]);
  // 年级
  const [grade, setGrade] = useState<any>({});

  // 学期学年没有数据时提示的开关
  const [kai, setkai] = useState<boolean>(false);
  const [sameClass, setSameClassData] = useState<any>([]);

  useEffect(() => {
    (async () => {
      // 获取年级信息
      const currentXQ = await queryXQList();
      const XQ: { label: any; value: any }[] = [];
      const NJ = {};
      currentXQ?.map((item: any) => {
        XQ.push({
          label: item.name,
          value: item.name,
        });
        NJ[item.name] = item.njList.map((njItem: any) => ({
          label: njItem.name,
          value: njItem.name,
        }));
      });
      setCampus(XQ);
      setGrade(NJ);
      console.log('currentXQ: ', currentXQ);
    })();
  }, []);

  // 控制学期学年数据提示框的函数
  const kaiguan = () => {
    setkai(false);
  };
  const showDrawer = () => {
    setState(false);
  };

  /**
   * 把接口返回的数据处理成ExcelTable组件所需要的
   *
   * @param data  接口返回的数据
   * @param timeData  课程时间段数据
   * @returns
   */
  const processingData = (data: any, timeData: any) => {
    const week = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const tableData: any[] = [];
    const sameClassData: any[] = [];

    data.map((item: any) => {
      timeData.map((timeItem: any, timeKey: number) => {
        const table = {
          room: {
            cla: item.FJMC,
            teacher: '',
            jsId: item.id,
            FJLXId: item.FJLX.id, // 场地类型ID
            rowspan: timeKey === 0 ? timeData.length : 0,
          },
          course: {
            cla: timeItem.SDMC,
            teacher: `${timeItem.KSSJ.slice(0, 5)} — ${timeItem.JSSJ.slice(0, 5)}`,
            hjId: timeItem.id,
          },
        };
        if (item.KHPKSJs && item.KHPKSJs.length > 0) {
          item.KHPKSJs.map((KHItem: any) => {
            if (KHItem.XXSJPZ.id === timeItem.id) {
              // console.log('BJID',);
              table[week[KHItem.WEEKDAY]] = {
                weekId: KHItem.id, // 周
                cla: KHItem.KHBJSJ.BJMC, // 班级名称
                teacher: KHItem.KHBJSJ.ZJS, // 主教师
                bjId: KHItem.KHBJSJ.id, // 班级ID
                kcId: KHItem.KHBJSJ.KHKCSJ.id, // 课程ID
                njId: KHItem.KHBJSJ.NJSName.split(',')[0], // 年级ID
                xqId: KHItem.KHBJSJ.XQName, // 校区ID
                color: KHItem.KHBJSJ.KHKCSJ.KHKCLX.KBYS || 'rgba(81, 208, 129, 1)',
                dis: BJID ? !(BJID === KHItem.KHBJSJ.id) : !(recordValue.BJId === KHItem.KHBJSJ.id),
              };
              if (
                (!BJID && recordValue.BJId === KHItem.KHBJSJ.id) ||
                (BJID && BJID === KHItem.KHBJSJ.id)
              ) {
                sameClassData.push({
                  WEEKDAY: KHItem.WEEKDAY, // 周
                  XXSJPZId: KHItem.XXSJPZ.id, // 时间ID
                  KHBJSJId: KHItem.KHBJSJ.id, // 班级ID
                  FJSJId: item.id, // 教室ID
                  XNXQId: KHItem.XNXQId, // 学年学期ID
                });
              }
            }
          });
        }

        tableData.push(table);
      });
    });
    setSameClassData(sameClassData);
    return tableData;
  };

  // 头部input事件
  const handlerSearch = (type: string, value: string, term: string) => {
    setXn(value);
    setXq(term);
    const res = getFJPlan({ xn: value, xq: term, isPk: radioValue });
    Promise.resolve(res).then((data: any) => {
      if (data.status === 'ok') {
        const tableData = processingData(data.data, xXSJPZData);
        setTableDataSource(tableData);
      }
    });
  };
  const onRadioChange = (e: any) => {
    setRadioValue(e.target.value);
    const res = getFJPlan({ xn, xq, isPk: e.target.value });
    Promise.resolve(res).then((data: any) => {
      if (data.status === 'ok') {
        const tableData = processingData(data.data, xXSJPZData);
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

          // 查询所有课程的时间段
          const resultTime = await getAllXXSJPZ();
          if (resultTime.status === 'ok') {
            const timeSlot = resultTime.data;
            setXXSJPZData(timeSlot);

            // 查询排课数据
            const resultPlan = await getFJPlan({
              xn: defaultData[0].defaultValue?.first,
              xq: defaultData[0].defaultValue?.second,
              isPk: radioValue,
            });
            if (resultPlan.status === 'ok') {
              const tableData = processingData(resultPlan.data, timeSlot);
              setTableDataSource(tableData);
            }
          }
        } else {
          setkai(true);
        }
      } else {
        console.log(res.message);
      }
    })();
  }, [BJID]);

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
  const onExcelTableClick = (value: any, record: any) => {
    setRecordValue(record);
  };

  return (
    <>
      <PageContainer>
        <PromptInformation
          text="未查询到学年学期数据，请设置学年学期后再来"
          link="/basicalSettings/termManagement"
          open={kai}
          colse={kaiguan}
        />
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
            <div style={{ padding: '24px 0 0 24px' }}>
              <span>场地排课情况：</span>
              <span>
                <Radio.Group onChange={onRadioChange} value={radioValue} style={{ marginLeft: 8 }}>
                  <Radio value={false}>全部</Radio>
                  <Radio value={true}>已有</Radio>
                </Radio.Group>
              </span>
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
            formValues={recordValue}
            setState={setState}
            xn={xn}
            xq={xq}
            campus={campus}
            grade={grade}
            tableDataSource={tableDataSource}
            processingData={processingData}
            xXSJPZData={xXSJPZData}
            setTableDataSource={setTableDataSource}
            sameClass={sameClass}
            setBJIDData={setBJIDData}
          />
        )}
      </PageContainer>
    </>
  );
};
export default ClassManagement;
