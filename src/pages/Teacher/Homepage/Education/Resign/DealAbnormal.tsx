/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-12-06 15:46:41
 * @LastEditTime: 2021-12-09 10:49:58
 * @LastEditors: Sissle Lynn
 */
import React, { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';
import { Button, Divider, Input, List, message, Modal } from 'antd';
import { getAllKHJSCQ } from '@/services/after-class/khjscq';
import { ParentHomeData } from '@/services/local-services/mobileHome';
import GoBack from '@/components/GoBack';
import styles from './index.less';
import { CreateJSCQBQ } from '@/services/after-class/jscqbq';
import { getAllJSCQBQ } from '@/services/after-class/jscqbq';
import moment from 'moment';
import { queryXNXQList } from '@/services/local-services/xnxq';

const { TextArea } = Input;
const getCountDays = (curMonth: number) => {
  const curDate = new Date();
  /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
  curDate.setMonth(curMonth + 1);
  /* 将日期设置为0 */
  curDate.setDate(0);
  /* 返回当月的天数 */
  return curDate.getDate();
};
const DealAbnormal = (props: any) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const userId = currentUser.JSId || testTeacherId;
  const { data } = props.location.state;
  const [dataSource, setDataSource] = useState<any>();
  const [dealData, setDealData] = useState<any>();
  const [total, setTotal] = useState<number>();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>();
  const [modalContent, setModalContent] = useState<string>();
  const [reason, setReason] = useState<string>();
  const showModal = (type: string) => {
    setModalContent(type);
    if (!visible) {
      setVisible(true);
    }
  };
  const getCQData = async () => {
    const result = await queryXNXQList(currentUser?.xxId);
    const obj = {
      XNXQId: result.current?.id,
      XXJBSJId: currentUser?.xxId,
      BQRId: userId,
      startDate: `${data.year}-${data.month}-01`,
      endDate: `${data.year}-${data.month}-${getCountDays(data.month)}`,
      SPZT: [0],
      page: 0,
      pageSize: 0,
    };
    const resAll = await getAllJSCQBQ(obj);
    if (resAll.status === 'ok' && resAll.data) {
      setDealData(resAll.data);
    }
  };

  const getData = async () => {
    const start = `${data.year}/${data.month}/01`;
    const end = `${data.year}/${data.month}/${getCountDays(data.month)}`;
    const res = await getAllKHJSCQ({
      JZGJBSJId: userId,
      startDate: moment(start).format('YYYY-MM-DD'),
      endDate: moment(end).format('YYYY-MM-DD'),
    });
    if (res.status === 'ok' && res.data) {
      setTotal(res.data.length);
      const newData = res.data.filter((val: { CQZT: string }) => val.CQZT === '缺席');
      const list = [].map.call(newData, (v: any) => {
        const { KHBJSJ, XXSJPZ, CQRQ } = v;
        return {
          title: KHBJSJ?.BJMC,
          date: CQRQ,
          time: XXSJPZ?.KSSJ
            ? `${XXSJPZ?.KSSJ?.substring(0, 5)} - ${XXSJPZ?.JSSJ?.substring(0, 5)}`
            : '',
          id: KHBJSJ?.id,
          XXSJPZId: v.XXSJPZId,
        };
      });
      setDataSource(list);
    }
  };
  const handleResign = async () => {
    const res = await CreateJSCQBQ({
      XXJBSJId: currentUser.xxId,
      BQRQ: current.date,
      QKYY: reason,
      SQNR: '出勤',
      BQRId: userId,
      KHBJSJId: current.id,
      XXSJPZId: current.XXSJPZId,
    });
    if (res.status === 'ok') {
      getCQData();
      setVisible(false);
      if (res.message === 'isAudit=false') {
        message.success('补签成功');
      } else {
        message.success('补签申请提交成功');
      }
    } else {
      message.warning(res.message);
    }
  };
  useEffect(() => {
    (async () => {
      const oriData = await ParentHomeData(
        'teacher',
        currentUser?.xxId,
        currentUser.JSId || testTeacherId,
      );
      const { skkssj } = oriData.data;
      if (skkssj) {
        getCQData();
        getData();
      }
    })();
  }, [data]);

  return (
    <>
      <GoBack title={'教师补签'} teacher onclick="/teacher/education/resign" />
      <div className={styles.dealWrapper}>
        <div className={styles.card}>
          <h3>{data.month}月汇总</h3>
          <div className={styles.flexWrapper}>
            <div>
              <h3>{total || 0}</h3>
              <span className={styles.light}>考勤总数</span>
            </div>
            <div>
              <h3>{data.count}</h3>
              <span className={styles.light}>缺卡总数</span>
            </div>
          </div>
        </div>
        <List
          className={styles.dealList}
          itemLayout="horizontal"
          dataSource={dataSource}
          renderItem={(item: any) => {
            const curItem = dealData?.find(
              (v: { BQRQ: string; XXSJPZId: string; KHBJSJId: string }) =>
                v.BQRQ === item.date && v.XXSJPZId === item.XXSJPZId && v.KHBJSJId === item.id,
            );
            return (
              <List.Item
                actions={
                  curItem
                    ? [
                        <span key={item.id} style={{ color: '#666' }}>
                          处理中
                        </span>,
                      ]
                    : [
                        <a
                          key={item.id}
                          onClick={() => {
                            setCurrent(item);
                            showModal('option');
                          }}
                        >
                          去处理
                        </a>,
                      ]
                }
              >
                <List.Item.Meta
                  title={<span>{item.title}</span>}
                  description={
                    <p>
                      {item.date} {item.time}
                    </p>
                  }
                />
              </List.Item>
            );
          }}
        />
        <Modal
          title={modalContent === 'option' ? '请选择你要提交的申请单' : '我要补签'}
          centered
          className={modalContent === 'option' ? styles.operationModal : styles.resignModal}
          closable={false}
          visible={visible}
          onOk={() => setVisible(false)}
          onCancel={() => setVisible(false)}
          footer={
            modalContent === 'option'
              ? [
                  <Button key="back" onClick={() => setVisible(false)}>
                    取消
                  </Button>,
                ]
              : [
                  <Button key="back" onClick={() => setVisible(false)}>
                    取消
                  </Button>,
                  <Divider type="vertical" />,
                  <Button key="submit" type="link" onClick={() => handleResign()}>
                    确认
                  </Button>,
                ]
          }
        >
          {modalContent === 'option' ? (
            <>
              {/* <li>
                <Link
                  to={`/teacher/education/askForLeave/newLeave?date=${current.date}&classId=${current.id}&XXSJPZId=${current.XXSJPZId}`}
                >
                  请假申请
                </Link>
              </li> */}
              <li>
                <Link
                  to={`/teacher/education/courseAdjustment/applys?date=${current.date}&classId=${current.id}&XXSJPZId=${current.XXSJPZId}`}
                >
                  代课申请
                </Link>
              </li>
              <li
                onClick={() => {
                  showModal('resign');
                }}
              >
                补签申请
              </li>
            </>
          ) : (
            <>
              <p>{current?.title}</p>
              <p>
                <span>缺卡原因：</span>
                <TextArea
                  style={{ marginTop: 16 }}
                  rows={4}
                  onBlur={(e) => {
                    setReason(e.target.value);
                  }}
                />
              </p>
            </>
          )}
        </Modal>
      </div>
    </>
  );
};

export default DealAbnormal;
