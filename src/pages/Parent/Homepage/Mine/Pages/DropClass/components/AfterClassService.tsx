/*
 * @description: 
 * @author: wsl
 * @Date: 2021-12-29 10:59:44
 * @LastEditTime: 2021-12-29 14:30:31
 * @LastEditors: wsl
 */
/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-10-09 10:48:20
 * @LastEditTime: 2021-11-11 10:22:20
 * @LastEditors: Sissle Lynn
 */
/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { useModel, history } from 'umi';
import { Button, Checkbox, message, Modal } from 'antd';
import { createKHTKSJ } from '@/services/after-class/khtksj';
import { getXXTZGG } from '@/services/after-class/xxtzgg';

import styles from '../index.less';
import noOrder from '@/assets/noOrder.png';
import { getStudentListByBjid } from '@/services/after-class/khfwbj';

const AfterClassService = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { student } = currentUser || {};
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ModalVisible, setModalVisible] = useState(false);
  const [KHFUXY, setKHFUXY] = useState<any>();
  const [datasourse, setDatasourse] = useState<any>();
  const [Datas, setDatas] = useState<any>([]);
  const StorageXSId = localStorage.getItem('studentId') || (student && student?.[0].XSJBSJId) || testStudentId;
  const StorageBjId = localStorage.getItem('studentBJId') || currentUser?.student?.[0].BJSJId || testStudentBJId;
  const [BaoMinData, setBaoMinData] = useState<any>();
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
        ZT:[0,3],
        page: 0,
        pageSize: 0
      })
      if (res.status === 'ok') {
        console.log(res)
        setBaoMinData(res.data.rows[0])
      }
    }
  }
  useEffect(() => {
    xuankeState();
  }, []);
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
    const res = await createKHTKSJ(datasourse!);
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

  const onChange = (checkedValues: any) => {
    const NewArr: any[] = [];
    checkedValues.forEach((value: string) => {
      const data = {
        XSJBSJId: StorageXSId,
        XSXM: localStorage.getItem('studentName') || (student && student[0].name) || '张三',
        XSFWBJId: value.split('+')[0],
        ZT: 0,
        BZ: '',
        LX: 2,
        FWMC: value.split('+')[1],
      };
      NewArr.push(data);
    });
    setDatasourse(NewArr);
    console.log(checkedValues,'checkedValues')
    setDatas(checkedValues);
  };
  return (
    <div className={styles.DropClass}>
      {BaoMinData?.XSFWBJs?.length !== 0 ? (
        <>
          {' '}
          <div className={styles.Application}>
            <p className={styles.choice}>请选择课后服务</p>
            <div>
              <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                {BaoMinData?.XSFWBJs?.map((value: any) => {
                  return (
                    <>
                      <div className={styles.cards} style={{height:'80px'}}>
                        <p className={styles.title}>
                          {value?.KHFWBJ?.FWMC}
                        </p>
                        <p>服务时段：{value?.KHFWSJPZ?.KSRQ} ~ {value?.KHFWSJPZ?.JSRQ}</p>
                        <Checkbox
                          value={`${value?.id}+${value?.KHFWBJ?.FWMC}+${value?.KHFWSJPZ?.KSRQ}`}
                         />
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
                disabled={typeof datasourse === 'undefined' || datasourse.length === 0}
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
        title="确认退课"
        visible={ModalVisible}
        onOk={handleOks}
        onCancel={handleCancels}
        closable={false}
        className={styles.refund}
        okText="确定"
        cancelText="取消"
      >
        <div>
          {Datas?.map((value: any) => {
            return (
              <>
                <p>
                  <span>服务名称： {value.split('+')[2].substring(5,7)}月{value.split('+')[1]}</span>
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

export default AfterClassService;
