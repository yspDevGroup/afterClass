/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { history, useModel } from 'umi';
import type { FormInstance } from 'antd';
import { List, Modal, message, Form, Input, Checkbox, Radio, Space } from 'antd';
import type { DisplayColumnItem } from '@/components/data';
import MobileCalendar from '@/components/MobileCalendar/calendar';
import ListComponent from '@/components/ListComponent';
import { compareNow } from '@/utils/Timefunction';
import { msgLeaveSchool } from '@/services/after-class/wechat';
import { convertCourse, CurdayCourse, getWeekCalendar, ParentHomeData } from '@/services/local-services/mobileHome';

import styles from './index.less';
import noData from '@/assets/noCourses1.png';
import noOrder from '@/assets/noOrder1.png';
import { getQueryString } from '@/utils/utils';
import moment from 'moment';

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
  const prevDay = getQueryString('date');
  const dealClassId = getQueryString('classId');
  const dealJcId = getQueryString('XXSJPZId');
  const [day, setDay] = useState<string>(!prevDay || prevDay === 'null' ? dayjs().format('YYYY-MM-DD') : prevDay);
  const [cDay, setCDay] = useState<string>(!prevDay || prevDay === 'null' ? dayjs().format('M月D日') : dayjs(prevDay).format('M月D日'));
  const [course, setCourse] = useState<any>(defaultMsg);
  const [dates, setDates] = useState<any[]>([]);
  const [editCourses, setEditCourses] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bjid, setBjid] = useState<string>();
  const [modalContent, setModalContent] = useState<string>();
  const formRef = React.createRef<any>();
  const [choosenCourses, setChoosenCourses] = useState<any>([]);
  const userId = currentUser.JSId || testTeacherId;
  const iconTextData: DisplayColumnItem[] = (day === dayjs().format('YYYY-MM-DD')) ? [
    {
      text: '签到点名',
      icon: 'icon-dianming',
      background: '#FFC700',
    },
    {
      text: '下课通知',
      icon: 'icon-lixiao',
      background: '#7DCE81',
      handleClick: async (bjid: string) => {
        setIsModalVisible(true);
        const res = course?.list?.find((item: { bjid: string; }) => item.bjid === bjid);
        setModalContent(`今日${res?.title}-${res?.BJMC}已下课，请知悉。`);
        setBjid(bjid);
      },
    },
    {
      text: '课堂风采',
      // itemType: 'img',
      icon: 'icon-fengcaifabu-copy',
      // img: union,
      background: '#FF8863',
      isRecord: true,
      handleClick: async (bjid: string, callbackData: any) => {
        const data = {
          type: "picList",
          cls: "picList",
          list: [callbackData],
          noDataText: "暂无课堂风采记录",
          noDataImg: noData
        };
        history.push(`/teacher/education/putRecord`, {
          bjid,
          jsid: userId,
          data
        })
      },
    },
  ] : [
    {
      text: '签到点名',
      icon: 'icon-dianming',
      background: '#FFC700',
    },
    {
      text: '课堂风采',
      // itemType: 'img',
      icon: 'icon-fengcaifabu-copy',
      // img: union,
      background: '#FF8863',
      handleClick: async (bjid: string, callbackData: any) => {
        const data = {
          type: "picList",
          cls: "picList",
          list: [callbackData],
          noDataText: "暂无课堂风采记录",
          noDataImg: noData
        };
        history.push(`/teacher/education/putRecord`, {
          bjid,
          jsid: currentUser.JSId || "1a510d94-8980-4b8b-8150-f4c0ce5e7025",
          data
        })
      },
    },
  ];

  // 根据日期修改展示数据
  const changeDateList = async (date?: any) => {
    const curDay = date || dayjs();
    const dayFormat = curDay.format('YYYY-MM-DD');
    setDay(dayFormat);
    setCDay(curDay.format('M月D日'));
    const { courseList } = await CurdayCourse('teacher', currentUser?.xxId, userId, dayFormat);
    if (type) {
      setEditCourses(convertCourse(dayFormat, courseList, 'filter'));
    } else {
      setCourse({
        type: 'picList',
        cls: 'picList',
        list: convertCourse(dayFormat, courseList),
        noDataText: '当天无课',
        noDataImg: noData,
      });
    }
  };
  const getMarkDays = async (start?: string) => {
    const oriData = await ParentHomeData('teacher', currentUser?.xxId, userId);
    const { markDays } = oriData;
    if (!type) {
      const weekDys = await getWeekCalendar('teacher', userId, start || day);
      setDates(markDays.concat(weekDys));
    } else {
      setDates(markDays);
    }
  };
  useEffect(() => {
    (async () => {
      const { courseList } = await CurdayCourse('teacher', currentUser?.xxId, userId, day);
      getMarkDays();
      if (type) {
        setEditCourses(convertCourse(day, courseList, 'filter'));
      } else {
        setCourse({
          type: 'picList',
          cls: 'picList',
          list: convertCourse(day, courseList,),
          noDataText: '当天无课',
          noDataImg: noData,
        });
      }
    })()
  }, []);
  useEffect(() => {
    setDatedata?.(choosenCourses);
  }, [choosenCourses, setDatedata]);
  useEffect(() => {
    if (dealClassId && editCourses) {
      const curItems = editCourses.find((v: { bjid: string; }) => v.bjid === dealClassId);
      if (curItems) {
        const { desc, start, end, bjid, title, jcId, FJId } = curItems;
        if (type === 'dksq') {
          setDatedata?.({
            day,
            start: desc?.[0].left?.[0].substring(0, 5),
            end: desc?.[0].left?.[0].substring(6, 11),
            jcId,
            bjid,
            FJId,
            title,
          })
        } else {
          setChoosenCourses([{
            day,
            start,
            end,
            jcId,
            bjid,
            title,
          }])
        }
      }
    }
  }, [type, editCourses, dealClassId]);
  useEffect(() => {
    formRef.current.setFieldsValue({
      info: modalContent,
    });
  }, [formRef, modalContent]);
  //  发送离校通知
  const handleOk = async () => {
    setIsModalVisible(false);
    formRef.current.validateFields()
      .then(async (values: any) => {
        const res = await msgLeaveSchool({
          KHBJSJId: bjid || '',
          text: values.info,
        });
        if (res.status === 'ok' && res.data) {
          message.success('通知已成功发送');
        } else {
          message.error(res.message);
        };
        formRef.current.validateFields()
      })
      .catch((info: { errorFields: any; }) => {
        console.log(info.errorFields);
      });
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  // 请假多选事件
  const onChange = (e: any, item: any) => {
    let newChoosen = [...choosenCourses];
    setReloadList?.(false);
    if (e?.target?.checked) {
      const { start, end, bjid, title, jcId } = item;
      newChoosen.push({
        day,
        start,
        end,
        jcId,
        bjid,
        title,
      });
    } else {
      newChoosen = newChoosen.filter((val) => val.bjId !== item.bjid);
    }
    setChoosenCourses(newChoosen);
  };
  // 调代课单选事件
  const onChanges = (e: any) => {
    const { desc, bjid, title, jcId, FJId, classType } = e.target.value;
    setDatedata?.({
      day,
      classType,
      start: desc?.[0].left?.[0].substring(0, 5),
      end: desc?.[0].left?.[0].substring(6, 11),
      jcId,
      bjid,
      FJId,
      title,
    })
  };
  return (
    <div className={styles.schedule}>
      <span
        className={styles.today}
        onClick={() => {
          if (type && type === 'edit' || type === 'dksq' || type === 'tksq') {
            form?.resetFields();
            setChoosenCourses([]);
          }
          changeDateList();
        }}
      >
        今
      </span>
      <MobileCalendar
        showType={'week'}
        disableMonthView={true}
        markDates={dates}
        onDateClick={(date: { format: (arg: string) => any }) => {
          if (type && type === 'edit' || type === 'dksq' || type === 'tksq') {
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
        onTouchEnd={(a: number,b: number) => {
          const start = moment(new Date(b)).format('YYYY-MM-DD');
          getMarkDays(start);
        }}
      />
      {/* 根据特殊情况显示列表上方操作信息 */}
      {type && type === 'edit' ? (
        <p style={{ lineHeight: '35px', margin: 0, color: '#888' }}>请选择课程</p>
      ) : (type && type === 'dksq' || type === 'tksq' ?
        <p style={{ lineHeight: '35px', margin: 0, color: '#999', fontSize: '12px' }}>{type === 'dksq' ? '代课课程（仅主班教师可提交代课申请）' : type === 'tksq' ? '调课课程（仅主班教师可提交调课申请）' : ''} </p> :
        <div className={styles.subTitle}>{cDay}</div>)}

      {/* 根据特殊情况显示列表展示样式 */}
      {type && type === 'edit' ? (
        <List
          style={{ background: '#fff', paddingLeft: '10px' }}
          itemLayout="horizontal"
          dataSource={editCourses}
          renderItem={(item: any) => {
            return (
              <List.Item
                key={`${day}+${item?.bjid}+${item.jcId}`}
                actions={[<Checkbox disabled={!!dealClassId} defaultChecked={dealClassId ? item?.bjid === dealClassId && item.jcId === dealJcId : false} onChange={(e) => onChange(e, item)} />]}
              >
                <List.Item.Meta
                  title={`${item?.title}`}
                  description={item.desc?.[0].left}
                />
              </List.Item>
            );
          }}
        />
      ) : (type === 'dksq' || type === 'tksq' ? <div className={styles.dksq}>
        {
          editCourses?.length ? <Radio.Group onChange={onChanges} disabled={!!dealClassId} defaultValue={editCourses.find((item: { bjid: string; jcId: string }) => item?.bjid === dealClassId && item.jcId === dealJcId)}>
            <Space direction="vertical">
              {
                editCourses?.map((item: any) => {
                  return <Radio value={item} >
                    <p> {item?.title}</p>
                    <p> {item.desc?.[0].left}</p>
                  </Radio>
                })
              }
            </Space>
          </Radio.Group> : <div className={styles.ZWSJ}>
            <img src={noOrder} alt="" />
            <p>暂无数据</p>
          </div>
        }
      </div> :
        <ListComponent listData={course} operation={iconTextData} />)}
      <Modal className={styles.leaveSchool} title="下课通知" forceRender={true} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} centered={true} closable={false} cancelText='取消' okText='确认'>
        <Form ref={formRef}>
          <Form.Item
            name="info"
            initialValue={modalContent}
          >
            <Input.TextArea defaultValue={modalContent} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default ClassCalendar;
