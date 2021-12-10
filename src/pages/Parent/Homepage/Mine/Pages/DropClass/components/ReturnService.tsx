/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-10-09 10:48:20
 * @LastEditTime: 2021-10-12 13:41:32
 * @LastEditors: Sissle Lynn
 */
/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { Button, Checkbox, message, Modal } from 'antd';
import { useModel,history } from 'umi';
import noOrder from '@/assets/noOrder.png';
import { getStudent } from '@/services/after-class/khxxzzfw';
import { createKHTKSJ } from '@/services/after-class/khtksj';
import { getXXTZGG } from '@/services/after-class/xxtzgg';
import { queryXNXQList } from '@/services/local-services/xnxq';
import styles from '../index.less';

const ReturnService = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ModalVisible, setModalVisible] = useState(false);
  const [KHFUXY, setKHFUXY] = useState<any>();
  const [FwData, setFwData] = useState<any>();
  const [Datasourse, setDatasourse] = useState<any>();
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

  const StorageXSId = localStorage.getItem('studentId');
  const getFwData = async () => {
    const result = await queryXNXQList(currentUser?.xxId, undefined);
    const { student } = currentUser || {};
    const XSId = StorageXSId || (student && student[0].XSJBSJId) || testStudentId;
    const res = await getStudent({
      XSJBSJId: XSId,
      XNXQId: result.current.id,
      ZT:[0]
    })
    if (res.status === 'ok') {
      setFwData(res.data?.rows)
    }
  }
  useEffect(() => {
    getFwData();
  }, [StorageXSId]);

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
    const res = await createKHTKSJ(Datasourse!);
    if (res.status === 'ok') {
      message.success('申请已提交，请等待审核');
      getFwData();
      setModalVisible(false);
      history.push('/parent/mine/dropClass')
    } else {
      message.error(res.message);
    }
  };
  const handleCancels = () => {
    setModalVisible(false);
  };

  const onChange = (checkedValues: any) => {
    const NewArr: any[] = [];
    const { student } = currentUser || {};
    checkedValues.forEach((value: string) => {
      const data = {
        XSJBSJId:
          localStorage.getItem('studentId') || (student && student?.[0].XSJBSJId) || testStudentId,
        KHXXZZFWId: value.split('+')[0],
        FWMC:value.split('+')[1],
        ZT: 0,
        BZ: '',
        LX: 1
      };
      NewArr.push(data);
    });
    setDatasourse(NewArr);
  };
  return (
    <div className={styles.ReturnService}>
      {FwData?.length !== 0 ? (
        <>
          <div className={styles.Application}>
            <p className={styles.choice}>请选择服务</p>
            <div>
              <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                {FwData?.map((value: any) => {
                  return (
                    <>
                      <div className={styles.cards}>
                        <p className={styles.title}>
                          {value?.KHXXZZFW?.FWMC}
                          <span style={{ color: '#009688', fontWeight: 'normal' }}>【{value?.KHXXZZFW?.KHZZFW?.FWMC}】</span>
                        </p>
                        <p>服务时段：{value?.KHXXZZFW?.KSRQ} ~ {value?.KHXXZZFW?.JSRQ}</p>
                        <Checkbox
                          value={`${value.KHXXZZFW?.id}+${value?.KHXXZZFW?.FWMC}`}
                        >
                          {' '}
                        </Checkbox>
                      </div>
                    </>
                  );
                })}
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
                disabled={typeof Datasourse === 'undefined' || Datasourse.length === 0}
              >
                提交
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.ZWSJ}>
          <img src={noOrder} alt="" />
          <p>暂无数据</p>
        </div>
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
            <p>暂无数据</p>
          </div>
        )}
      </Modal>
      <Modal
        title="确认退订服务"
        visible={ModalVisible}
        onOk={handleOks}
        onCancel={handleCancels}
        closable={false}
        className={styles.refund}
        okText="确定"
        cancelText="取消"
      >
        <div>
          {Datasourse?.map((value: any) => {
            return (
              <>
                <p>
                  <span>服务名称： {value?.FWMC}</span>
                </p>
              </>
            );
          })}
          <p style={{ fontSize: 12, color: '#999', marginTop: 40, marginBottom: 0 }}>
            注：服务退订成功后，系统将自动进行退款，退款将原路返回您的支付账户。
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ReturnService;
