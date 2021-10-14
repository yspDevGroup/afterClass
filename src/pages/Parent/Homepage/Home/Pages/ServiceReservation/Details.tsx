/*
 * @description: 服务详情
 * @author: wsl
 * @Date: 2021-09-26 17:28:08
 * @LastEditTime: 2021-10-11 14:56:16
 * @LastEditors: zpl
 */
import GoBack from '@/components/GoBack';
import { Button, Checkbox, Modal } from 'antd';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { getStudent, KHXXZZFW } from '@/services/after-class/khxxzzfw';
import { getXXTZGG } from '@/services/after-class/xxtzgg';
import { createKHXSDD } from '@/services/after-class/khxsdd';
import { Link, useModel } from 'umi';
import { enHenceMsg } from '@/utils/utils';

const Details = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [Data, setData] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Xystate, setXystate] = useState(false);
  const [state, setstate] = useState(false);
  const [KHFUXY, setKHFUXY] = useState<any>();
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const [orderInfo, setOrderInfo] = useState<any>();

  const type = window.location.href.split('type=')[1].split('&id=')[0];
  const StorageXSId = localStorage.getItem('studentId');
  useEffect(() => {
    const id = window.location.href.split('id=')[1];
    (async () => {
      if (type === 'YX') {
        const res = await getStudent({
          XSJBSJId: StorageXSId || currentUser?.student?.[0].XSJBSJId || testStudentId,
          KHXXZZFWId: id,
        });
        if (res.status === 'ok') {
          setData(res.data?.rows?.[0].KHXXZZFW);
        }
      } else if (type === 'KS') {
        const res = await KHXXZZFW({ id });
        if (res.status === 'ok') {
          setData(res.data);
        }
      }
    })();
  }, [StorageXSId]);
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
        setKHFUXY(res.data?.rows?.[0].NR);
      }
    })();
  }, []);

  useEffect(() => {
    if (orderInfo) linkRef.current?.click();
  }, [orderInfo]);

  /** 课后帮服务协议弹出框 */
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
    setXystate(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onchanges = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
  };
  const onFxChange = (e: { target: { checked: any } }) => {
    setXystate(e.target.checked);
  };
  const submit = async () => {
    const data: API.CreateKHXSDD = {
      XDSJ: new Date().toISOString(),
      ZFFS: '线上支付',
      DDZT: '待付款',
      DDFY: Data?.FY,
      XSJBSJId:
        localStorage.getItem('studentId') ||
        currentUser?.student[0].XSJBSJId ||
        testStudentId,
      DDLX: 1,
      KHXXZZFWId: Data?.id,
    };
    const res = await createKHXSDD(data);
    if (res.status === 'ok') {
      setOrderInfo(res.data);
    } else {
      enHenceMsg(res.message);
    }
  };

  return (
    <div className={styles.Details}>
      <GoBack title={'服务详情'} />
      <div className={styles.wrap}>
        <img src={Data?.FWTP} alt="" />
        <div>
          <p className={styles.title}>{Data?.FWMC}</p>
          <p>
            预定时段：{moment(Data?.BMKSSJ).format('YYYY.MM.DD')}~
            {moment(Data?.BMJSSJ).format('YYYY.MM.DD')}
          </p>
          <p>
            服务时段：{moment(Data?.KSRQ).format('YYYY.MM.DD')}~
            {moment(Data?.JSRQ).format('YYYY.MM.DD')}
          </p>
          <p>合作单位：{Data?.KHZZFW.FWJGMC}</p>
        </div>
        <div>
          <p className={styles.title}>套餐内容</p>
          <p>{Data?.FWNR}</p>
        </div>
      </div>
      {type === 'YX' ? (
        <></>
      ) : (
        <div className={styles.footer}>
          {Data?.FY && Data?.FY > 0 ? <span>￥{Data?.FY}</span> : <span>免费</span>}
          <Button
            onClick={() => {
              setstate(true);
            }}
          >
            立即订购
          </Button>
        </div>
      )}

      {state === true ? (
        <div className={styles.box} onClick={() => setstate(false)}>
          <div onClick={onchanges}>
            <p className={styles.title}>{Data?.FWMC}</p>
            {Data?.FY && Data?.FY > 0 ? <span>￥{Data?.FY}</span> : <span>免费</span>}
            <div className={styles.agreement}>
              <Checkbox onChange={onFxChange} checked={Xystate}>
                <span>我已阅读并同意</span>
              </Checkbox>
              <a onClick={showModal}>《课后服务协议》</a>
            </div>
            <Button className={styles.submit} disabled={!Xystate} onClick={submit}>
              {Data?.FY && Data?.FY > 0 ? '提交并付款' : '提交'}
            </Button>
            <Link
              style={{ visibility: 'hidden' }}
              ref={linkRef}
              to={{
                pathname: '/parent/mine/orderDetails',
                state: {
                  title: Data.FWMC,
                  detail: '',
                  payOrder: orderInfo,
                  user: currentUser,
                  KKRQ: '',
                  JKRQ: '',
                  fwdetail: Data,
                },
              }}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        bodyStyle={{
          width: 200,
        }}
        className={styles.showagreement}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
      >
        <p>课后服务协议书</p>
        <div dangerouslySetInnerHTML={{ __html: KHFUXY }} />
      </Modal>
    </div>
  );
};

export default Details;
