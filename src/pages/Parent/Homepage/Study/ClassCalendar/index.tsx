import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { List, Checkbox, message } from 'antd';
import type { FormInstance } from 'antd';
import dayjs from 'dayjs';
import { Calendar } from 'react-h5-calendar';
import ListComponent from '@/components/ListComponent';
import { compareNow } from '@/utils/Timefunction';
import noData from '@/assets/noCourse.png';

import styles from './index.less';
import { convertStuCourse, CurdayCourse, ParentHomeData } from '@/services/local-services/mobileHome';

type propstype = {
  setDatedata?: (data: any) => void;
  type?: string;
  form?: FormInstance<any>;
  setReloadList?: React.Dispatch<React.SetStateAction<boolean>>;
};
const defaultMsg = {
  type: 'picList',
  cls: 'picList',
  list: [],
  noDataText: '当天无课',
  noDataImg: noData,
};

const ClassCalendar = (props: propstype) => {
  const { setDatedata, type, form, setReloadList } = props;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { xxId, student } = currentUser || {};
  const [day, setDay] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [cDay, setCDay] = useState<string>(dayjs().format('M月D日'));
  const [course, setCourse] = useState<any>(defaultMsg);
  const [editCourses, setEditCourses] = useState<any>([]);
  const [dates, setDates] = useState<any[]>([]);
  const [choosenCourses, setChoosenCourses] = useState<any>([]);
  const StorageXSId = localStorage.getItem('studentId') || (student && student[0].XSJBSJId) || testStudentId;
  const StorageNjId = localStorage.getItem('studentNjId') || (student && student[0].NJSJId);
  // 根据日期修改展示数据
  const changeDateList = async (date?: any) => {
    const curDay = date || dayjs();
    const dayFormat = curDay.format('YYYY-MM-DD');
    setDay(dayFormat);
    setCDay(curDay.format('M月D日'));
    const { courseList } = await CurdayCourse('student', currentUser?.xxId, StorageXSId, dayFormat,StorageNjId);
    if (type) {
      setEditCourses(convertStuCourse(courseList, 'filter'));
    } else {
      setCourse({
        type: 'picList',
        cls: 'picList',
        list: convertStuCourse(courseList),
        noDataText: '当天无课',
        noDataImg: noData,
      });
    }
  }
  useEffect(() => {
    (async () => {
      const oriData = await ParentHomeData('student', xxId, StorageXSId, StorageNjId);
      const { markDays } = oriData;
      const { courseList } = await CurdayCourse('student', currentUser?.xxId, StorageXSId, day,StorageNjId);
      if (type) {
        setEditCourses(convertStuCourse(courseList, 'filter'));
      } else {
        setCourse({
          type: 'picList',
          cls: 'picList',
          list: convertStuCourse(courseList,),
          noDataText: '当天无课',
          noDataImg: noData,
        });
      }
      setDates(markDays);
    })()
  }, [StorageXSId]);
  useEffect(() => {
    setDatedata?.(choosenCourses);
  }, [choosenCourses, setDatedata]);
  const onChange = (e: any, item: any) => {
    let newChoosen = [...choosenCourses];
    setReloadList?.(false);
    if (e?.target?.checked) {
      const { start, end, bjId, jcId, title } = item;
      newChoosen.push({
        day,
        start,
        end,
        jcId,
        bjId,
        title,
      });
    } else {
      newChoosen = newChoosen.filter((val) => val.bjId !== item.bjId);
    }
    setChoosenCourses(newChoosen);
  };
  return (
    <div className={styles.schedule}>
      <span
        className={styles.today}
        onClick={() => {
          if (type && type === 'edit') {
            form?.resetFields();
            setChoosenCourses([]);
          }
          changeDateList();
        }}
      >
        今
      </span>
      <Calendar
        showType={'week'}
        markDates={dates}
        onDateClick={(date: { format: (arg: string) => any }) => {
          if (type && type === 'edit') {
            if (!compareNow(date.format('YYYY-MM-DD'))) {
              message.warning('不可选择今天之前的课程');
              return;
            }
            if (date.format('YYYY-MM-DD') !== day) {
              form?.resetFields();
              setChoosenCourses([]);
            }
          }
          changeDateList(date);
        }}
        markType="dot"
        transitionDuration={0.1}
        currentDate={day}
      />
      {type && type === 'edit' ? (
        <p style={{ lineHeight: '35px', margin: 0, color: '#888' }}>请选择课程</p>
      ) : (
        <div className={styles.subTitle}>{cDay}</div>
      )}
      {type && type === 'edit' ? (
        <List
          style={{ background: '#fff' }}
          itemLayout="horizontal"
          dataSource={editCourses}
          className={styles.jsqj}
          renderItem={(item: any) => {
            return (
              <List.Item
                key={`${day}+${item?.bjid}+${item.jcId}`}
                actions={[<Checkbox onChange={(e) => onChange(e, item)} />]}
              >
                <List.Item.Meta
                  title={item?.title}
                  description={item.desc?.[0].left}
                />
              </List.Item>
            );
          }}
        />
      ) : (
        <ListComponent listData={course} />
      )}
    </div>
  );
};
export default ClassCalendar;
