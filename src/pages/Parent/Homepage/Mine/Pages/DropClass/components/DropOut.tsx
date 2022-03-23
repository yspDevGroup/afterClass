/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-10-09 10:48:20
 * @LastEditTime: 2021-12-29 13:34:52
 * @LastEditors: wsl
 */
/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { useModel, history } from 'umi';
import { Button, Checkbox, message, Modal } from 'antd';
import { createKHTKSJ } from '@/services/after-class/khtksj';
import { getXXTZGG } from '@/services/after-class/xxtzgg';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { countKHXSCQ } from '@/services/after-class/khxscq';

import styles from '../index.less';
import noOrder from '@/assets/noOrder.png';
import { CountCourses, ParentHomeData } from '@/services/local-services/mobileHome';

const DropOut = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { student } = currentUser || {};
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ModalVisible, setModalVisible] = useState(false);
  const [KHFUXY, setKHFUXY] = useState<any>();
  const [kcData, setKcData] = useState<any>();
  const [kcList, setKcList] = useState<any>();
  const [XNXQId, setXNXQId] = useState<string>();

  const [datasourse, setDatasourse] = useState<any>();
  const StorageXSId =
    localStorage.getItem('studentId') || (student && student?.[0].XSJBSJId) || testStudentId;
  const StorageNjId =
    localStorage.getItem('studentNjId') || (student && student[0].NJSJId) || testStudentNJId;
  const StorageXQSJId =
    localStorage.getItem('studentXQSJId') || currentUser?.student?.[0].XQSJId || testStudentXQSJId;
  useEffect(() => {
    (async () => {
      const res = await getXXTZGG({
        BT: '',
        LX: ['缤纷课堂协议'],
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
  const getKcData = async (data: any) => {
    const result = await queryXNXQList(currentUser?.xxId);
    if (result.current) {
      const res = await countKHXSCQ({
        XNXQId: result.current.id,
        XSJBSJId: StorageXSId,
      });
      if (res.status === 'ok') {
        const newArr = res.data.SKBJs.filter((item: any) => {
          return item?.ISFW === 0
        })
        const finnalList = [].map.call(newArr, (val: any) => {
          const curCourse = data.find((v: any) => v.id === val.id);
          return {
            YXKS: curCourse.YXKS,
            ZKS: curCourse.ZKS,
            ...val,
          };
        });
        setKcData(finnalList);
      }
    }
  };
  useEffect(() => {
    (async () => {
      if (StorageXSId) {
        const bjId =
          localStorage.getItem('studentBJId') ||
          currentUser?.student?.[0].BJSJId ||
          testStudentBJId;
        const oriData = await ParentHomeData(
          'student',
          currentUser.xxId,
          StorageXSId,
          StorageNjId,
          bjId,
          StorageXQSJId,
        );
        const { courseSchedule } = oriData;

        const newArr = courseSchedule?.filter((item: any) => {
          return item?.ISFW === false
        })
        const courseData = CountCourses(newArr);
        setKcList(courseData);
        getKcData(courseData);
      }
    })();
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
    const res = await createKHTKSJ(datasourse!);
    if (res.status === 'ok') {
      message.success('申请已提交，请等待审核');
      getKcData(kcList);
      setModalVisible(false);
      history.push('/parent/mine/dropClass');
    } else {
      message.error(res.message);
    }
  };
  const handleCancels = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    (
      async () => {
        const result = await queryXNXQList(currentUser?.xxId);
        if (result.current) {
          setXNXQId(result.current.id)
        }
      }
    )()
  }, [])

  const onChange = (checkedValues: any) => {
    if (XNXQId) {
      const NewArr: any[] = [];
      checkedValues.forEach((value: string) => {
        const data = {
          XSJBSJId: StorageXSId,
          XSXM: localStorage.getItem('studentName') || (student && student[0].name) || '张三',
          KHBJSJId: value.split('+')[0],
          KSS: value.split('+')[1],
          ZT: 0,
          BZ: '',
          LX: 0,
          KCMC: value.split('+')[2],
          XNXQId
        };
        NewArr.push(data);
      });
      setDatasourse(NewArr);
    }
  };

  return (
    <div className={styles.DropClass}>
      {kcData?.length !== 0 ? (
        <>
          {' '}
          <div className={styles.Application}>
            <p className={styles.choice}>请选择课程</p>
            <div>
              <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                {kcData?.map((value: any) => {
                  const JKRQ = new Date(value.KHBJSJ?.JKRQ).getTime();
                  const newDate = new Date().getTime();
                  return (
                    <>
                      <div className={styles.cards}>
                        <p className={styles.title}>
                          {value.KCMC}
                          <span style={{ color: '#009688', fontWeight: 'normal' }}>
                            【{value.BJMC}】
                          </span>
                        </p>
                        <p>
                          总课时：{value.ZKS}节 ｜ 已学课时：{value.normal}节
                        </p>
                        <p>
                          未学课时：{Number(value.ZKS) - Number(value.normal) - Number(value.abnormal)}节｜缺勤课时：{value.abnormal}节｜可退课时：
                          {Number(value.ZKS) - Number(value.normal) - Number(value.abnormal)}节
                        </p>
                        <Checkbox
                          value={`${value.id}+${Number(value.ZKS) - Number(value.normal) - Number(value.abnormal)}+${value.KCMC}`}
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
              结课1个月后不可退课，规则详见 <a onClick={showModal}>《缤纷课堂协议》</a>
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
            <p>缤纷课堂协议书</p>
            <div dangerouslySetInnerHTML={{ __html: KHFUXY?.[0].NR }} />
          </>
        ) : (
          <div className={styles.ZWSJ}>
            <img src={noOrder} alt="" />
            <p>暂无缤纷课堂协议</p>
          </div>
        )}
      </Modal>
      <Modal
        title="退订确认"
        visible={ModalVisible}
        onOk={handleOks}
        onCancel={handleCancels}
        closable={false}
        className={styles.refund}
        okText="确认"
        cancelText="取消"
      >
        <div>
          {datasourse?.map((value: any) => {
            return (
              <>
                <p>
                  <span>课程名称：{value.KCMC}</span> <span>可退课时：{value.KSS}</span>
                </p>
              </>
            );
          })}
          <p style={{ fontSize: 12, color: '#999', marginTop: 40, marginBottom: 0 }}>
            注：
            <br />
            1.退课课时由系统根据申请日期进行计算统计，仅供参考。
            <br />
            2.退课成功后，系统将自动进行退款，退款将原路返回您的支付账户。
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default DropOut;
