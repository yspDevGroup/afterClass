/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-10-09 10:48:20
 * @LastEditTime: 2021-10-12 13:41:32
 * @LastEditors: Sissle Lynn
 */
/* eslint-disable no-nested-ternary */
/*
 * @description:
 * @author: wsl
 * @Date: 2021-09-04 14:33:06
 * @LastEditTime: 2021-10-09 10:44:27
 * @LastEditors: Sissle Lynn
 */
import GoBack from '@/components/GoBack';
import { getStudentClasses } from '@/services/after-class/khbjsj';
import { createKHTKSJ } from '@/services/after-class/khtksj';
import { getXXTZGG } from '@/services/after-class/xxtzgg';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { Button, Checkbox, message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import styles from './index.less';
import noOrder from '@/assets/noOrder.png';
import { getCqDay } from '@/utils/utils';
import { getKHPKSJByBJID } from '@/services/after-class/khpksj';

const Apply = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ModalVisible, setModalVisible] = useState(false);
  const [KHFUXY, setKHFUXY] = useState<any>();
  const [KcData, setKcData] = useState<any>();
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
  const convertData = (dataArr: any) => {
    if (dataArr && dataArr.length) {
      const nor = dataArr.filter((item: any) => item.status === '出勤');
      const abnor = dataArr.filter((item: any) => item.status === '缺席');
      return {
        zc: nor && nor.length,
        yc: abnor && abnor.length,
      }
    }
    return {}
  };
  const getKcData = async () => {
    const result = await queryXNXQList(currentUser?.xxId, undefined);
    const { student } = currentUser || {};
    const XSId = StorageXSId || (student && student[0].XSJBSJId) || testStudentId;
    const res = await getStudentClasses({
      XSJBSJId: XSId,
      XNXQId: result.current.id,
      ZT: [0],
    });
    if (res.status === 'ok') {
      const arr = [].map.call(res.data, async (item: any) => {
        const res1 = await getKHPKSJByBJID({ id: item.KHBJSJId });
        if (res1.status === 'ok' && res1.data) {
          const attend = [...new Set(res1.data.map((n: { WEEKDAY?: any }) => n.WEEKDAY))];
          const data = await getCqDay(attend, item?.KHBJSJ?.KKRQ, item?.KHBJSJ?.JKRQ, item.KHBJSJId, XSId);
          return {
            KCMC: item?.KHBJSJ?.KHKCSJ?.KCMC,
            BJMC: item?.KHBJSJ?.BJMC,
            KHBJSJId: item.KHBJSJId,
            KSS: item?.KHBJSJ?.KSS,
            ...convertData(data)
          };
        }
        return {}
      });
      const result = await Promise.all(arr);
      setKcData(result);
    }
  };
  useEffect(() => {
    getKcData();
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
      getKcData();
      setModalVisible(false);
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
          localStorage.getItem('studentId') || (student && student.XSJBSJId) || testStudentId,
        XSXM: localStorage.getItem('studentName') || (student && student[0].name) || '张三',
        KHBJSJId: value.split('+')[0],
        KSS: value.split('+')[1],
        ZT: 0,
        BZ: '',
        KCMC: value.split('+')[2],
      };
      NewArr.push(data);
    });
    setDatasourse(NewArr);
  };
  return (
    <div className={styles.DropClass}>
      <GoBack title={'我要退课'} onclick="/parent/home?index=mine" />
      {KcData?.length !== 0 ? (
        <>
          {' '}
          <div className={styles.Application}>
            <p className={styles.choice}>请选择课程</p>
            <div>
              <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                {KcData?.map((value: any) => {
                  const arrs = value.KHBJSJ?.KHXSCQs.filter((val: any) => {
                    return val.CQZT === '出勤';
                  });
                  const JKRQ = new Date(value.KHBJSJ?.JKRQ).getTime();
                  const newDate = new Date().getTime();
                  return (
                    <>
                      <div className={styles.cards}>
                        <p className={styles.title}>
                          {value.KCMC}
                          <span style={{ color: '#009688', fontWeight: 'normal' }}>【{value.BJMC}】</span>
                        </p>
                        <p>总课时：{value.KSS}节 ｜ 已学课时：{value.zc}节</p>
                        <p>
                          未学课时：{value.KSS - value.zc - value.yc}节｜可退课时：{value.KSS - value.zc}节
                        </p>
                        <Checkbox
                          value={`${value.KHBJSJId}+${value.KSS - value.zc}+${value.KCMC}`}
                          disabled={newDate - JKRQ > 2592000000}
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
              结课1个月后不可退课，规则详见 <a onClick={showModal}>《课后服务协议》</a>
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
        title="确认退课"
        visible={ModalVisible}
        onOk={handleOks}
        onCancel={handleCancels}
        closable={false}
        className={styles.refund}
      >
        <div>
          {Datasourse?.map((value: any) => {
            return (
              <>
                <p>
                  {' '}
                  <span>课程名称：{value.KCMC}</span> <span>可退课时：{value.KSS}</span>
                </p>
              </>
            );
          })}
          <p style={{ fontSize: 12, color: '#999', marginTop: 40, marginBottom: 0 }}>
            注：退课成功后，系统将自动进行退款，退款将原路返回您的支付账户。
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Apply;
