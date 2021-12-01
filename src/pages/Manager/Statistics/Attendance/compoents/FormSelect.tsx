import { Select, Input, DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { queryXNXQList } from '@/services/local-services/xnxq';
import type { Moment } from 'moment';
import moment from 'moment';
import type { ReactNode } from '@umijs/renderer-react/node_modules/@types/react';
import SearchLayout from '@/components/Search/Layout';

const { Search } = Input;
const { Option } = Select;

const { RangePicker } = DatePicker;
type formSelectProps = {
  getDataSource: any;
  exportButton: ReactNode;
  getDuration: any;
  type: string;
};

const FormSelect = (props: formSelectProps) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [JSRQ, setJSRQ] = useState<string>();
  const [KSRQ, setKSRQ] = useState<string>();
  const { getDataSource, exportButton, getDuration, type } = props;

  const [curXNXQId, setCurXNXQId] = useState<any>();
  const [newDate, setNewDate] = useState<Moment[]>([]);
  const [XM, setXM] = useState<string | undefined>(undefined);

  // 学年学期列表数据
  const [termList, setTermList] = useState<any>();
  const [XNXQList, setXNXQList] = useState<any>();

  useEffect(() => {
    // 获取学年学期数据的获取
    (async () => {
      const res = await queryXNXQList(currentUser?.xxId);
      // 获取到的整个列表的信息
      const newData = res.xnxqList;
      const curTerm = res.current;
      if (newData?.length) {
        if (curTerm) {
          setXNXQList(res.data);
          setTermList(newData);
          setCurXNXQId(curTerm.id);
          getDuration(curTerm.id);
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (curXNXQId && newDate.length > 0) {
      if (getDataSource) {
        getDataSource(curXNXQId, newDate, XM);
      }
    }
  }, [newDate]);

  const getNewDate = () => {
    if (curXNXQId) {
      const newTerm = XNXQList?.find((item: any) => item.id === curXNXQId);
      setJSRQ(newTerm?.JSRQ);
      setKSRQ(newTerm?.KSRQ);
      setNewDate([moment(newTerm?.KSRQ, 'YYYY-MM-DD'), moment(newTerm?.JSRQ, 'YYYY-MM-DD')]);
    }
  };
  useEffect(() => {
    if (curXNXQId) {
      getNewDate();
    }
  }, [curXNXQId]);

  const onDisabledTime = (current: any) => {
    return (
      (current && current >= moment(JSRQ, 'YYYY-MM-DD')) || current <= moment(KSRQ, 'YYYY-MM-DD')
    );
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <SearchLayout>
        <div>
          <label htmlFor="term">所属学年学期：</label>
          <Select
            value={curXNXQId}
            onChange={(value: string) => {
              setCurXNXQId(value);
            }}
          >
            {termList?.map((item: any) => {
              return (
                <Option key={item.value} value={item.value}>
                  {item.text}
                </Option>
              );
            })}
          </Select>
        </div>
        <div>
          <label htmlFor="date">考勤日期：</label>
          <RangePicker
            style={{ width: '250px' }}
            allowClear={false}
            format="YYYY-MM-DD"
            value={newDate}
            onChange={(value: any) => {
              setNewDate(value);
            }}
            disabledDate={onDisabledTime}
          />
        </div>
        <div>
          <label htmlFor="name">{type === 'student' ? '学生姓名：' : '教师姓名：'} </label>
          <Search
            allowClear
            value={XM}
            onChange={(value) => {
              setXM(value.target.value);
            }}
            onSearch={(value) => {
              getDataSource(curXNXQId, newDate, value);
            }}
          />
        </div>
      </SearchLayout>
      {exportButton}
    </div>
  );
};
export default FormSelect;
