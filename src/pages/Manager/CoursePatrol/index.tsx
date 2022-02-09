import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Badge, Upload } from 'antd';
import type { FormInstance } from 'antd';
import { Button, message, Modal } from 'antd';
import moment from 'moment';
import PageContainer from '@/components/PageContainer';
import Calendar from '@/components/Calendar';
import NewEvent from './components/NewEvent';
import { customConfig } from './CalendarConfig';
import type { SchoolEvent } from '@/components/Calendar/data';
import { ConvertEvent, RevertEvent } from './util';

import styles from './index.less';
import { InfoCircleOutlined, UploadOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import {
  createKHXKSJ,
  deleteKHXKSJ,
  getKHXKSJ,
  getScheduleByDate,
  updateKHXKSJ,
} from '@/services/after-class/khxksj';
import { getAuthorization } from '@/utils/utils';

const { confirm } = Modal;

const CoursePatrol = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // 模态框的新增或编辑form定义
  const [form, setForm] = useState<FormInstance<any>>();
  // 模态框的显示状态
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // const [modalVisible, setModalVisible] = useState<boolean>(false);
  // 当前选中的日期
  const [date, setDate] = useState<string>(moment(new Date()).format('YYYY/MM/DD'));
  // 所选中的值班安排中的详情信息
  const [current, setCurrent] = useState<any>();
  // 所配置的值班安排
  const [events, setEvents] = useState<SchoolEvent[]>();
  const [uploadVisible, setUploadVisible] = useState<boolean>(false);

  const getZBEvents = async () => {
    const result = await getKHXKSJ({
      XXJBSJId: currentUser.xxId,
      page: 0,
      pageSize: 0,
    });
    if (result.status === 'ok') {
      const { data } = result;
      if (data?.rows?.length) {
        const newList = ConvertEvent(data.rows);
        setEvents(newList);
      }
    } else {
      message.error(result.message);
    }
  };
  const UploadProps: any = {
    name: 'xlsx',
    action: '/api/upload/importTeacherXKAP',
    headers: {
      authorization: getAuthorization(),
    },
    data: {},
    beforeUpload(file: any) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      console.log('isLt2M', isLt2M);
      if (!isLt2M) {
        message.error('文件大小不能超过2M');
      }
      return isLt2M;
    },
    onChange(info: {
      file: { status: string; name: any; response: any };
      fileList: any;
      event: any;
    }) {
      if (info.file.status === 'done') {
        const code = info.file.response;
        if (code.status === 'ok') {
          message.success(`上传成功`);
          setUploadVisible(false);
          getZBEvents();
        } else {
          message.error(`${code.message}`);
        }
      } else if (info.file.status === 'error') {
        console.log('info.file.response', info.file);
      }
    },
  };
  useEffect(() => {
    getZBEvents();
  }, []);
  const handleClick = (type: string, d: string, e?: SchoolEvent[]) => {
    setDate(d);
    setModalVisible(true);
    if (type === 'check') {
      const curValue = RevertEvent(e!);
      setCurrent({
        JZGJBSJId: curValue,
      });
    } else {
      setCurrent(undefined);
    }
  };
  // 清除
  const showDeleteConfirm = () => {
    confirm({
      title: '温馨提示',
      icon: <InfoCircleOutlined style={{ color: 'red' }} />,
      content: '重置后，当日值班信息将清空，确定重置吗？',
      async onOk() {
        const res = await deleteKHXKSJ({
          RQ: moment(date).format('YYYY-MM-DD'),
          XXJBSJId: currentUser.xxId,
        });
        if (res.status === 'ok') {
          message.success('信息重置完成');
          setModalVisible(false);
          getZBEvents();
        } else {
          message.warning(res.message);
        }
      },
    });
  };
  const handleOver = async (d: string) => {
    const newDay = moment(d).format('YYYY/MM/DD');
    const res = await getScheduleByDate({
      XXJBSJId: currentUser.xxId,
      RQ: d,
      WEEKDAY: new Date(newDay).getDay().toString(),
    });
    if (res.status === 'ok' && res.data) {
      return res.data?.rows?.length > 0;
    }
    return false;
  };
  const handleSubmit = async () => {
    try {
      const values = await form?.validateFields();
      if (values.JZGJBSJId) {
        const postData = [].map.call(values.JZGJBSJId, (item) => {
          const itemData: API.CreateKHXKSJ = {
            RQ: moment(values.RQ).format('YYYY-MM-DD'),
            JZGJBSJId: item,
            XXJBSJId: currentUser.xxId,
          };
          return itemData;
        });
        const res = current
          ? await updateKHXKSJ(postData as unknown as API.CreateKHXKSJ[])
          : await createKHXKSJ(postData as unknown as API.CreateKHXKSJ[]);
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
      <Button
        key="button"
        type="primary"
        onClick={() => setUploadVisible(true)}
        style={{ position: 'absolute', right: 48, top: 32, zIndex: 1 }}
      >
        <VerticalAlignBottomOutlined /> 导入
      </Button>
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
          <Button key="submit" type="primary" onClick={() => handleSubmit()}>
            确定
          </Button>,
          current ? (
            <Button
              style={{
                border: '1px solid #F04D4D ',
                marginRight: 8,
                background: '#F04D4D',
                color: '#fff',
              }}
              onClick={showDeleteConfirm}
            >
              重置
            </Button>
          ) : (
            ''
          ),
          <Button
            key="cancel"
            style={{
              display: 'inline-block',
            }}
            onClick={(e) => {
              e.stopPropagation();
              setModalVisible(false);
            }}
          >
            取消
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
      <Modal
        title="导入巡课安排"
        destroyOnClose
        width="35vw"
        visible={uploadVisible}
        onCancel={() => setUploadVisible(false)}
        footer={null}
        centered
        maskClosable={false}
        bodyStyle={{
          maxHeight: '65vh',
          overflowY: 'auto',
        }}
      >
        <>
          <p>
            <Upload {...UploadProps}>
              <Button icon={<UploadOutlined />}>上传文件</Button>{' '}
              <span className={styles.messageSpan}>批量导入巡课安排</span>
            </Upload>
          </p>
          <div className={styles.messageDiv}>
            <Badge color="#aaa" />
            上传文件仅支持模板格式
            <a
              style={{ marginLeft: '16px' }}
              type="download"
              href="/template/importTeacherXKAP.xlsx"
            >
              下载模板
            </a>
            <br />
            <Badge color="#aaa" />
            确保表格内只有一个工作薄，如果有多个只有第一个会被处理
            <br />
          </div>
        </>
      </Modal>
    </PageContainer>
  );
};

export default CoursePatrol;
