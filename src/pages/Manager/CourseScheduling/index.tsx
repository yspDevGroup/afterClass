/* eslint-disable array-callback-return */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { Button, Radio } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import type { SearchDataType } from '@/components/Search/data';
import PageContainer from '@/components/PageContainer';
import SearchComponent from '@/components/Search';
import ExcelTable from '@/components/ExcelTable';
import PromptInformation from '@/components/PromptInformation';
import { theme } from '@/theme-default';

import { queryXQList } from '@/services/wechat/service';
import { getFJPlan } from '@/services/after-class/fjsj';
import { getKHBJSJ } from '@/services/after-class/khbjsj';
import { getAllXXSJPZ } from '@/services/after-class/xxsjpz';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getQueryString } from '@/utils/utils';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';

import AddArranging from './components/AddArranging';
import { searchData } from './searchConfig';
// import { NJData, XQData } from './mock';
import './index.less';

const ClassManagement = () => {
  const [state, setState] = useState(true);
  const [dataSource, setDataSource] = useState<SearchDataType>(searchData);
  const [xn, setXn] = useState<any>(getQueryString('xn'));
  const [xq, setXq] = useState<any>(getQueryString('xq'));
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
  // 排课时段的提示开关
  const [pKiskai, setPKiskai] = useState<boolean>(false);

  const [sameClass, setSameClassData] = useState<any>([]);
  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      await initWXAgentConfig(['checkJsApi']);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      // 获取年级信息
      const currentXQ = await queryXQList();
      const XQ: { label: any; value: any }[] = [];
      const NJ = {};
      currentXQ?.map((item: any) => {
        XQ.push({
          label: item.name,
          value: item.id,
        });
        NJ[item.name] = item.njList.map((njItem: any) => ({
          label: njItem.name,
          value: njItem.id,
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

  // 控制学期学年数据提示框的函数
  const onPkiskaiClick = () => {
    setPKiskai(false);
  };

  const showDrawer = () => {
    setState(false);
    setRecordValue({});
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
    if (!timeData.length) {
      setPKiskai(true);
    } else {
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
              cla: timeItem.TITLE,
              teacher: `${timeItem.KSSJ.slice(0, 5)} — ${timeItem.JSSJ.slice(0, 5)}`,
              hjId: timeItem.id,
            },
          };
          if (item.KHPKSJs && item.KHPKSJs.length > 0) {
            item.KHPKSJs.map((KHItem: any) => {
              if (KHItem.XXSJPZ.id === timeItem.id) {
                table[week[KHItem.WEEKDAY]] = {
                  weekId: KHItem.id, // 周
                  cla: KHItem.KHBJSJ.BJMC, // 班级名称
                  teacher: KHItem.KHBJSJ.ZJS, // 主教师
                  bjId: KHItem.KHBJSJ.id, // 班级ID
                  kcId: KHItem.KHBJSJ.KHKCSJ.id, // 课程ID
                  njId: KHItem.KHBJSJ.NJSName.split(',')[0], // 年级ID
                  bjzt: KHItem.KHBJSJ.BJZT, // 班级状态
                  xqId: KHItem.KHBJSJ.XQName, // 校区ID
                  color: KHItem.KHBJSJ.KHKCSJ.KHKCLX.KBYS || 'rgba(36, 54, 81, 1)',
                  dis: BJID
                    ? !(BJID === KHItem.KHBJSJ.id)
                    : !(recordValue.BJId === KHItem.KHBJSJ.id),
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
    }
    setSameClassData(sameClassData);
    return tableData;
  };
  useEffect(() => {
    (async () => {
      const bjID = getQueryString('courseId');
      if (bjID) {
        // 查询所有课程的时间段
        const resultTime = await getAllXXSJPZ({
          xn,
          xq,
          type: ['0'],
        });
        if (resultTime.status === 'ok') {
          const timeSlot = resultTime.data;
          setXXSJPZData(timeSlot);
          // 查询排课数据
          const resultPlan = await getFJPlan({
            xn,
            xq,
            isPk: radioValue,
          });
          if (resultPlan.status === 'ok') {
            const tableData = processingData(resultPlan.data, timeSlot);
            setTableDataSource(tableData);
          }
        }
        const njInfo = await getKHBJSJ({ id: bjID });
        if (njInfo.status === 'ok') {
          setRecordValue({
            BJId: njInfo.data.id,
            NJ: njInfo.data.NJSName?.split(',')[0],
            KC: njInfo.data.KHKCSJId,
            XQ: njInfo.data.XQName,
          });
          setState(false);
        }
      }
    })();
  }, []);
  useEffect(() => {
    if (BJID) {
      const res = getFJPlan({ xn, xq, isPk: false });
      Promise.resolve(res).then((data: any) => {
        if (data.status === 'ok') {
          const tableData = processingData(data.data, xXSJPZData);
          setTableDataSource(tableData);
        }
      });
    }
  }, [BJID]);
  // 头部input事件
  const handlerSearch = async (type: string, value: string, term: string) => {
    setXn(value);
    setXq(term);
    // 查询所有课程的时间段
    const resultTime = await getAllXXSJPZ({
      xn: value,
      xq: term,
      type: ['0'],
    });
    if (resultTime.status === 'ok') {
      const timeSlot = resultTime.data;
      setXXSJPZData(timeSlot);
      // 查询排课数据
      const resultPlan = await getFJPlan({
        xn: value,
        xq: term,
        isPk: radioValue,
      });
      if (resultPlan.status === 'ok') {
        const tableData = processingData(resultPlan.data, timeSlot);
        setTableDataSource(tableData);
      }
    }
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
    const bjID = getQueryString('courseId');
    if (!bjID) {
      (async () => {
        // 学年学期数据的获取
        const res = await queryXNXQList();
        const newData = res.xnxqList;
        const curTerm = res.current;
        const defaultData = [...searchData];
        if (newData.data && newData.data.length) {
          if (curTerm) {
            await setXn(curTerm.XN);
            await setXq(curTerm.XQ);
            const chainSel = defaultData.find((item) => item.type === 'chainSelect');
            if (chainSel && chainSel.defaultValue) {
              chainSel.defaultValue.first = curTerm.XN;
              chainSel.defaultValue.second = curTerm.XQ;
              await setDataSource(defaultData);
              chainSel.data = newData;
            }
            // 查询所有课程的时间段
            const resultTime = await getAllXXSJPZ({
              xn: curTerm.XN,
              xq: curTerm.XQ,
              type: ['0'],
            });
            if (resultTime.status === 'ok') {
              const timeSlot = resultTime.data;
              setXXSJPZData(timeSlot);
              // 查询排课数据
              const resultPlan = await getFJPlan({
                xn: curTerm.XN,
                xq: curTerm.XQ,
                isPk: radioValue,
              });
              if (resultPlan.status === 'ok') {
                const tableData = processingData(resultPlan.data, timeSlot);
                setTableDataSource(tableData);
              }
            }
          }
        } else {
          setkai(true);
        }
      })();
    }
  }, []);

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
        <PromptInformation
          text="该学年学期未查询到排课时段数据，请先设置排课时段"
          link="/basicalSettings/periodMaintenance"
          open={pKiskai}
          colse={onPkiskaiClick}
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
                  style={{ background: theme.btnPrimarybg, borderColor: theme.btnPrimarybg }}
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
              radioValue={radioValue}
            />
          </div>
        ) : (
          <AddArranging
            formValues={recordValue}
            setState={setState}
            xn={xn}
            xq={xq}
            campus={campus}
            setCampus={setCampus}
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
