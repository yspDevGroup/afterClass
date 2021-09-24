import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Button, FormInstance, message, Modal } from 'antd';
import moment from 'moment';
import PageContainer from '@/components/PageContainer';
import Calendar from '@/components/Calendar';
import NewEvent from './components/NewEvent';
import { customConfig } from './CalendarConfig';
import { SchoolEvent } from '@/components/Calendar/data';
import { createKHXKSJ, getKHXKSJ, getScheduleByDate } from '@/services/after-class/khxksj';
import { ConvertEvent, RevertEvent } from './util';

import styles from './index.less';

const CoursePatrol = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // 模态框的新增或编辑form定义
  const [form, setForm] = useState<FormInstance<any>>();
  // 模态框的显示状态
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // const [modalVisible, setModalVisible] = useState<boolean>(false);
  // 当前选中的日期
  const [date, setDate] = useState<string>(moment(new Date()).format('YYYY-MM-DD'));
  // 所选中的值班安排中的详情信息
  const [current, setCurrent] = useState<any>();
  // 所配置的值班安排
  const [events, setEvents] = useState<SchoolEvent[]>();
  const getZBEvents = async () => {
    const result = await getKHXKSJ({
      XXJBSJId: currentUser.xxId,
      page: 0,
      pageSize: 0
    });
    if (result.status === 'ok') {
      const { data } = result;
      if (data?.rows?.length) {
        const newList = ConvertEvent(data.rows);
        setEvents(newList);
      }
    } else {
      message.error(result.message)
    }
  };
  useEffect(() => {
    getZBEvents();
  }, [])
  const handleClick = (type: string, date: string, events?: SchoolEvent[]) => {
    setDate(date);
    setModalVisible(true);
    if (type === 'check') {
      const curValue = RevertEvent(events!);
      setCurrent({
        KHJSSJID: curValue
      });
    } else {
      setCurrent(undefined);
    }
  };
  const handleOver = async (date: string) => {
    const res = await getScheduleByDate({
      XXJBSJId: currentUser.xxId,
      RQ: date,
      WEEKDAY: new Date(date).getDay().toString()
    });
    if (res.status === 'ok') {
      return res.data?.length > 0
    }
    return false;
  };
  const handleSubmit = async () => {
    try {
      const values = await form?.validateFields();
      if (values.KHJSSJID) {
        const postData = [].map.call(values.KHJSSJID, (item) => {
          const itemData: API.CreateKHXKSJ = {
            RQ: moment(values.RQ).format('YYYY-MM-DD'),
            KHJSSJId: item,
            XXJBSJId: currentUser.xxId
          }
          return itemData;
        })
        const res = await createKHXKSJ(postData as unknown as API.CreateKHXKSJ[]);
        if (res.status === 'ok') {
          message.success('值班安排成功');
          setModalVisible(false);
          getZBEvents();
        } else {
          message.warning(res.message);
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  return (
    <PageContainer cls={styles.calendarWrapper}>
      <Calendar
        chosenDay={date}
        config={customConfig}
        terms={null}
        events={events}
        handleEvents={handleClick}
        handleOver={handleOver}
      />
      <Modal
        title="值班安排"
        destroyOnClose
        width="35vw"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        centered
        footer={[
          <Button key="cancel"
            style={{
              display: 'inline-block',
            }}
            onClick={(e) => {
              e.stopPropagation();
              setModalVisible(false);
            }}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => handleSubmit()}>
            确定
          </Button>,
        ]}
        maskClosable={false}
        bodyStyle={{
          maxHeight: '65vh',
          overflowY: 'auto',
        }}
      >
        <NewEvent setForm={setForm} date={date} current={current} />
      </Modal>
    </PageContainer>
  );
};

export default CoursePatrol;
