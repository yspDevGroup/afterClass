/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-shadow */
import { List, Modal, message, Form, Input, Checkbox, Divider, Radio, Space } from 'antd';
import type { FormInstance } from 'antd';
import { useModel } from 'umi';
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Calendar } from 'react-h5-calendar';
import styles from './index.less';
import ListComponent from '@/components/ListComponent';
import moment from 'moment';
import { compareNow, DateRange, Week } from '@/utils/Timefunction';
import noData from '@/assets/noCourses1.png';
import { msgLeaveSchool } from '@/services/after-class/wechat';
import type { DisplayColumnItem } from '@/components/data';
import { getData } from '@/utils/utils';
import { ParentHomeData } from '@/services/local-services/teacherHome';
import noOrder from '@/assets/noOrder1.png';


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
  const { xxId } = currentUser || {};
  const [day, setDay] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [cDay, setCDay] = useState<string>(dayjs().format('M月D日'));
  const [course, setCourse] = useState<any>(defaultMsg);
  const [dates, setDates] = useState<any[]>([]);
  const [courseArr, setCourseArr] = useState<any>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bjid, setBjid] = useState<string>();
  const [modalContent, setModalContent] = useState<string>();
  const formRef = React.createRef<any>();
  const [choosenCourses, setChoosenCourses] = useState<any>([]);
  const children = currentUser?.subscriber_info?.children || [{
    student_userid: currentUser?.UserId,
    njId: '1'
  }];

  const iconTextData: DisplayColumnItem[] = day === dayjs().format('YYYY-MM-DD') ? [
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
        const schedule = await getData(bjid, children[0].student_userid!);
        const { ...rest } = schedule;
        setModalContent(`今日${rest.kcmc}-${rest.title}已下课，请知悉。`);
        setBjid(bjid);
      },
    },
    // {
    //   text: '课堂风采',
    //   itemType: 'img',
    //   img: classroomStyle,
    //   background: '#FF8863',
    // },
  ] : [
    {
      text: '签到点名',
      icon: 'icon-dianming',
      background: '#FFC700',
    },
    // {
    //   text: '课堂风采',
    //   itemType: 'img',
    //   img: classroomStyle,
    //   background: '#FF8863',
    // },
  ];
  // 后台返回的周数据的遍历
  const getCalendarData = (data: any) => {
    const courseData = {};
    const markDays = [];
    const learnData = {};
    const newData = {};
    data?.forEach((item: any) => {
      if (Object.keys(newData).indexOf(`${item.KHBJSJ.id}`) === -1) {
        newData[item.KHBJSJ.id] = [];
      }
      newData[item.KHBJSJ.id].push(item);
    });

    for (let k = 0; k < data?.length; k += 1) {
      const item = data[k];
      const weeked: any[] = [];
      const dates: any[] = [];
      newData[item.KHBJSJ.id].forEach((rea: any) => {
        if (dates.length === 0) {
          dates.push(DateRange(rea.KHBJSJ.KKRQ, rea.KHBJSJ.JKRQ));
        }
        if (weeked.indexOf(rea.WEEKDAY) === -1) {
          weeked.push(rea.WEEKDAY);
        }
      });
      const sj: any[] = [];
      dates[0].forEach((as: any) => {
        weeked.forEach((ds: any) => {
          if (Week(as) === ds) {
            sj.push(as);
          }
        });
      });
      const courseDays = [];
      const startDate = item.KHBJSJ.KKRQ ? item.KHBJSJ.KKRQ : item.KHBJSJ.KHKCSJ.KKRQ;
      const endDate = item.KHBJSJ.JKRQ ? item.KHBJSJ.JKRQ : item.KHBJSJ.KHKCSJ.JKRQ;
      const kcxxInfo = {
        title: item.KHBJSJ.KHKCSJ.KCMC,
        img: item.KHBJSJ.KCTP ? item.KHBJSJ.KCTP : item.KHBJSJ.KHKCSJ.KCTP,
        link: `/teacher/home/courseDetails?classid=${item.KHBJSJ.id}&courseid=${item.KHBJSJ.KHKCSJ.id}&index=all`,
        desc: [
          {
            left: [
              `${item.XXSJPZ.KSSJ.substring(0, 5)}-${item.XXSJPZ.JSSJ.substring(0, 5)}  |  ${item.KHBJSJ.BJMC} `,
            ],
          },
          {
            left: [`${item.FJSJ.FJMC}`],
          },
        ],
        jcId: item.XXSJPZ.id,
        FJId: item.FJSJ.id,
      };
      const res = DateRange(
        moment(startDate).format('YYYY/MM/DD'),
        moment(endDate).format('YYYY/MM/DD'),
      );
      for (let i = 0; i < res.length; i += 1) {
        const weekDay = Week(moment(res[i]).format('YYYY/MM/DD'));
        if (weekDay === item.WEEKDAY) {
          const enrollLink = {
            pathname: '/teacher/education/callTheRoll',
            state: {
              pkid: item.id,
              bjids: item.KHBJSJ.id,
              date: moment(res[i]).format('YYYY/MM/DD'),
              kjs: sj.length,
              sj,
            },
          };
          // const recordLink = {
          //   pathname: '/teacher/education/rollcallrecord',
          //   state: {
          //     pkid: item.id,
          //     bjids: item.KHBJSJ.id,
          //     date: moment(res[i]).format('YYYY/MM/DD'),
          //     kjs: sj.length,
          //     sj,
          //   },
          // };
          const curInfo = [
            {
              enrollLink,
              bjid: item.KHBJSJ.id,
              // recordLink,
              ...kcxxInfo,
            },
          ];
          if (courseData[res[i]]) {
            courseData[res[i]] = courseData[res[i]].concat(curInfo);
          } else {
            courseData[res[i]] = curInfo;
          }
          markDays.push({
            date: res[i],
          });
          courseDays.push(res[i]);
        }
      }
      if (learnData[item.KHBJSJ.id]) {
        const val = learnData[item.KHBJSJ.id];
        learnData[item.KHBJSJ.id] = {
          dates: val.dates.concat(courseDays),
          weekDay: `${val.weekDay},${item.WEEKDAY}`,
          courseInfo: item,
        };
      } else {
        learnData[item.KHBJSJ.id] = {
          dates: courseDays,
          weekDay: item.WEEKDAY,
          courseInfo: item,
        };
      }
    }

    return {
      markDays,
      courseData,
      learnData,
    };
  };

  useEffect(() => {
    (async () => {
      const JSId = currentUser.JSId || testTeacherId;
      const res = await ParentHomeData(xxId, JSId);
      const { weekSchedule } = res;
      const { markDays, courseData, learnData } = getCalendarData(weekSchedule);
      setDatedata?.(learnData);
      setDates(markDays);
      setCourse({
        type: 'picList',
        cls: 'picList',
        list: courseData[day] || [],
        noDataText: '当天无课',
        noDataImg: noData,
      });
      setCourseArr(courseData);
    })();
  }, []);
  useEffect(() => {
    setDatedata?.(choosenCourses);
  }, [choosenCourses]);
  useEffect(() => {
    formRef.current.setFieldsValue({
      info: modalContent,
    });
  }, [modalContent]);

  const handleOk = async () => {
    setIsModalVisible(false);
    formRef.current.validateFields()
      .then(async (values: any) => {
        const res = await msgLeaveSchool({
          KHBJSJId: bjid,
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
        const error = info.errorFields
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onChange = (e: any, item: any) => {
    let newChoosen = [...choosenCourses];
    setReloadList?.(false);
    if (e?.target?.checked) {
      const { desc, bjid, title, jcId } = item;
      newChoosen.push({
        day,
        start: desc?.[0].left?.[0].substring(0, 5),
        end: desc?.[0].left?.[0].substring(6, 11),
        jcId,
        bjid,
        title,
      });
    } else {
      newChoosen = newChoosen.filter((val) => val.bjId !== item.bjid);
    }
    setChoosenCourses(newChoosen);
  };
  const onChanges = (e: any) => {
    const { desc, bjid, title, jcId,FJId } = e.target.value;
    setDatedata?.({
      day,
      start: desc?.[0].left?.[0].substring(0, 5),
      end: desc?.[0].left?.[0].substring(6, 11),
      jcId,
      bjid,
      FJId,
      title,
    })
  }
  return (
    <div className={styles.schedule}>
      <span
        className={styles.today}
        onClick={() => {
          if (type && type === 'edit' || type === 'dksq' || type === 'tksq') {
            form?.resetFields();
            setChoosenCourses([]);
          }
          setDay(dayjs().format('YYYY-MM-DD'));
          setCDay(dayjs().format('M月D日'));
          setCourse({
            type: 'picList',
            cls: 'picList',
            list: courseArr[dayjs().format('YYYY-MM-DD')] || [],
            noDataText: '当天无课',
            noDataImg: noData,
          });
        }}
      >
        今
      </span>
      <Calendar
        showType={'week'}
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
          setDay(date.format('YYYY-MM-DD'));
          setCDay(date.format('M月D日'));
          let curCourse: any = {};
          curCourse = {
            type: 'picList',
            cls: 'picList',
            list: [],
            noDataText: '当天无课',
            noDataImg: noData,
          };
          setTimeout(() => {
            curCourse = {
              type: 'picList',
              cls: 'picList',
              list: courseArr[date.format('YYYY-MM-DD')] || [],
              noDataText: '当天无课',
              noDataImg: noData,
            };
            setCourse(curCourse);
          }, 50);
          setCourse(curCourse);
        }}
        markType="dot"
        transitionDuration={0.1}
        currentDate={day}
      />
      {type && type === 'edit' ? (
        <p style={{ lineHeight: '35px', margin: 0, color: '#888' }}>请选择课程</p>
      ) : (type && type === 'dksq' || type === 'tksq' ?
        <p style={{ lineHeight: '35px', margin: 0, color: '#999', fontSize: '12px' }}>{type === 'dksq' ? '代课课程' :  type === 'tksq' ? '调课课程':''} </p> :
        <div className={styles.subTitle}>{cDay}</div>)}
      {type && type === 'edit' ? (
        <List
          style={{ background: '#fff', paddingLeft: '10px' }}
          itemLayout="horizontal"
          dataSource={course?.list?.length ? course?.list : []}
          renderItem={(item: any) => {
            return (
              <List.Item
                key={`${day}+${item?.bjid}`}
                actions={[<Checkbox onChange={(e) => onChange(e, item)} />]}
              >
                <List.Item.Meta
                  title={item?.title}
                  description={
                    <>
                      {item.desc?.[0].left}
                      <Divider type="vertical" />
                    </>
                  }
                />
              </List.Item>
            );
          }}
        />
      ) : (type === 'dksq' || type === 'tksq' ? <div className={styles.dksq}>
        {
          course?.list?.length === 0 ? <div className={styles.ZWSJ}>
          <img src={noOrder} alt="" />
          <p>暂无数据</p>
          </div> :
          <Radio.Group onChange={onChanges}>
          <Space direction="vertical">
            {
              course?.list?.map((item: any) => {
                return <Radio value={item}>
                  <p> {item?.title}</p>
                  <p> {item.desc?.[0].left}</p>
                </Radio>
              })
            }
          </Space>
        </Radio.Group>
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
