/*
 * @description: 
 * @author: wsl
 * @Date: 2021-12-29 10:59:44
 * @LastEditTime: 2022-01-06 09:31:04
 * @LastEditors: wsl
 */
/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { useModel, history } from 'umi';
import { Button, Checkbox, message, Modal, Tag } from 'antd';
import { createKHTKSJ } from '@/services/after-class/khtksj';
import { getXXTZGG } from '@/services/after-class/xxtzgg';

import styles from '../index.less';
import noOrder from '@/assets/noOrder.png';
import seviceImage from '@/assets/seviceImage.png';
import { getStudentListByBjid } from '@/services/after-class/khfwbj';
import moment from 'moment';

const AfterClassService = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { student } = currentUser || {};
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ModalVisible, setModalVisible] = useState(false);
  const [KHFUXY, setKHFUXY] = useState<any>();
  const StorageXSId = localStorage.getItem('studentId') || (student && student?.[0].XSJBSJId) || testStudentId;
  const StorageBjId = localStorage.getItem('studentBJId') || currentUser?.student?.[0].BJSJId || testStudentBJId;
  const [BaoMinData, setBaoMinData] = useState<any>();
  const [Type, setType] = useState(false);
  const [FwTimes, setFwTimes] = useState<any>([]);

  useEffect(() => {
    (async () => {
      const res = await getXXTZGG({
        BT: '',
        LX: ['课后服务协议'],
        XXJBSJId: currentUser?.xxId,
        ZT: ['已发布'],
        page: 0,
        pageSize: 0,
      });
      if (res.status === 'ok') {
        setKHFUXY(res.data?.rows);
      }
    })();
  }, []);
  //获取报名的服务
  const xuankeState = async () => {
    if (StorageXSId) {
      const res = await getStudentListByBjid({
        BJSJId: StorageBjId,
        XSJBSJId: StorageXSId,
        ZT: [0, 3],
        page: 0,
        pageSize: 0
      })
      if (res.status === 'ok' && res.data) {
        setBaoMinData(res.data.rows);
        // 只可退结束日期大于当前时间的课程
        setFwTimes(res.data.rows?.[0]?.XSFWBJs?.filter((value: any) => {
          return moment(value?.KHFWSJPZ.JSRQ).format('YYYY/MM/DD') >= moment(new Date()).format('YYYY/MM/DD')
        }))
      }
    }
  }
  useEffect(() => {
    xuankeState();
  }, [ModalVisible]);
  /** 课后帮服务协议弹出框 */
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  /** 确认退款弹出框 */
  const showModals = () => {
    setModalVisible(true);
  };
  const handleOks = async () => {
    const NewArr: any[] = [];
    FwTimes?.forEach((value: any) => {
      const data = {
        XSJBSJId: StorageXSId,
        XSXM: localStorage.getItem('studentName') || (student && student[0].name) || '张三',
        XSFWBJId: value?.id,
        ZT: 0,
        BZ: '',
        LX: 2,
        FWMC: value?.KHFWBJ?.FWMC,
      };
      NewArr.push(data);
    });
    const res = await createKHTKSJ(NewArr);
    if (res.status === 'ok') {
      message.success('申请已提交，请等待审核');
      setModalVisible(false);
      history.push('/parent/mine/dropClass')
    } else {
      message.error(res.message);
    }
  };
  const handleCancels = () => {
    setModalVisible(false);
  };

  const handleClose = (removedTag: any) => {
    const newArr: any = [];
    FwTimes.forEach((value: any) => {
      if (value !== removedTag) {
        newArr.push(value)
      }
    })
    setFwTimes(newArr);
  };
  const forMap = (tag: any) => {
    const tagElem = (
      <Tag
        closable
        onClose={e => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        <span className={styles.SDBM}> {tag?.KHFWSJPZ?.SDBM}</span>
      </Tag>
    );
    return (
      <span key={tag?.id} style={{ display: 'inline-block', marginBottom: '10px' }}>
        {tagElem}
      </span>
    );
  };
  const tagChild = FwTimes?.map(forMap);


  return (
    <div className={styles.AfterClassService}>
      {BaoMinData?.length !== 0 && FwTimes?.length !== 0 ? (
        <>
          <div className={styles.Application}>
            <p className={styles.choice}>请选择课后服务</p>
            <div>
              <Checkbox.Group style={{ width: '100%' }} onChange={(value) => {
                if (value?.length) {
                  setType(true)
                } else {
                  setType(false)
                }
              }}>
                <div className={styles.cards} style={{ height: '80px' }}>
                  <img src={BaoMinData?.[0]?.XSFWBJs?.[0]?.KHFWBJ?.FWTP || seviceImage} alt="" />
                  <div>
                    <p className={styles.title}>
                      {BaoMinData?.[0]?.XSFWBJs?.[0]?.KHFWBJ?.FWMC}
                    </p>
                    <p>服务时段：{BaoMinData?.[0]?.XSFWBJs?.[0].KHFWBJ?.KHFWSJPZs?.[0]?.KSRQ} ~ {BaoMinData?.[0]?.XSFWBJs?.[0].KHFWBJ?.KHFWSJPZs?.[BaoMinData?.[0]?.XSFWBJs?.[0].KHFWBJ?.KHFWSJPZs?.length - 1]?.JSRQ}</p>
                  </div>

                  <Checkbox
                    value={BaoMinData?.[0]?.id}
                  />
                </div>
              </Checkbox.Group>
            </div>
          </div>
          <div className={styles.wrap}>
            <p>
              规则详见 <a onClick={showModal}>《课后服务协议》</a>
            </p>
            <div className={styles.btn}>
              <Button
                onClick={showModals}
                disabled={!Type}
              >
                选择退课时段
              </Button>
            </div>
          </div>
        </>

      ) : (
        <>
          <div className={styles.ZWSJ}>
            <img src={noOrder} alt="" />
            <p>暂无数据</p>
          </div>
        </>
      )}
      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        className={styles.showagreement}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
      >
        {KHFUXY?.length !== 0 ? (
          <>
            <p>课后服务协议书</p>
            <div dangerouslySetInnerHTML={{ __html: KHFUXY?.[0].NR }} />
          </>
        ) : (
          <div className={styles.ZWSJ}>
            <img src={noOrder} alt="" />
            <p>暂无课后服务协议</p>
          </div>
        )}
      </Modal>
      <Modal
        title="退课确认"
        visible={ModalVisible}
        onOk={handleOks}
        onCancel={handleCancels}
        closable={false}
        className={styles.refund}
        okText="确定"
        cancelText="取消"
      >
        <div>
          <p style={{ fontSize: 14, color: '#999', marginBottom: 20 }}>系统将为您退订所有剩余未上课程，您也可以指定部分时段进行退订。</p>
          <div style={{ marginBottom: 16 }} className={styles?.TimeInterval} >
            {tagChild}
          </div>
          {/* <p style={{ fontSize: 12, color: '#999', marginTop: 15, marginBottom: 0 }}>
            注：系统将根据您所选时段发起退订申请，退订成功后，将自动进行退款，退款将原路返回您的支付账户。
          </p> */}
        </div>
      </Modal >
    </div >
  );
};

export default AfterClassService;
