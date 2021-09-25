/* eslint-disable no-nested-ternary */
/*
 * @description:
 * @author: wsl
 * @Date: 2021-09-04 14:33:06
 * @LastEditTime: 2021-09-04 14:37:32
 * @LastEditors: wsl
 */
import GoBack from '@/components/GoBack';
import { getStudentClasses } from '@/services/after-class/khbjsj';
import { createKHTKSJ, getKHTKSJ } from '@/services/after-class/khtksj';
import { getXXTZGG } from '@/services/after-class/xxtzgg';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { Button, Checkbox, Empty, message, Modal, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import styles from './index.less';

const { TabPane } = Tabs;

const DropClass = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ModalVisible, setModalVisible] = useState(false);
  const [KHFUXY, setKHFUXY] = useState<any>();
  const [KcData, setKcData] = useState<any>();
  const [Datasourse, setDatasourse] = useState<any>();
  const [Record, setRecord] = useState<any>([]);
  useEffect(() => {
    (async () => {
      const res = await getXXTZGG({
        BT: '',
        LX: '课后服务协议',
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
  const getKcData = async () => {
    const result = await queryXNXQList(currentUser?.xxId, undefined);
    const { student } = currentUser || {};
    const res = await getStudentClasses({
      XSId: student && student.student_userid || '20210901',
      XNXQId: result.current.id,
      ZT: [0]
    });
    if (res.status === 'ok') {
      setKcData(res.data)
    }
  }
  const getKHTKSJData = async () => {
    const { student } = currentUser || {};
    const res = await getKHTKSJ({
      XSId: student && student.student_userid || '20210901',
      KHBJSJId: '',
      XXJBSJId: currentUser?.xxId,
      ZT:[0,1,2],
      page: 0,
      pageSize: 0
    })
    setRecord(res.data!.rows!)
  }
  useEffect(() => {
    getKcData();
    getKHTKSJData();
  }, []);
  useEffect(() => {
    (async () => {

    })();
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
  const handleOks = async() => {
    const res = await createKHTKSJ(Datasourse!);
    if (res.status === 'ok') {
      message.success('申请成功')
      getKcData();
      getKHTKSJData();
      setModalVisible(false);
    } else {
      message.error(res.message)
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
        XSId: student && student.student_userid || '20210901',
        XSXM:student && student.name || '张三',
        KHBJSJId: value.split('+')[0],
        KSS: value.split('+')[1],
        ZT: 0,
        BZ: '',
        KCMC: value.split('+')[2],
      }
      NewArr.push(data)
    })
    setDatasourse(NewArr)
  }
  return <div className={styles.DropClass}>
    <GoBack title={'退课'} onclick="/parent/home?index=mine" />
    <Tabs type="card">
      <TabPane tab="退课申请" key="退课申请">
        {KcData?.length !== 0 ? <> <div className={styles.Application}>
          <p className={styles.choice}>请选择课程</p>
          <div>
            <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
              {
                KcData?.map((value: any) => {
                  const arrs = value.KHBJSJ?.KHXSCQs.filter((val: any) => {
                    return val.CQZT === "出勤";
                  })
                  const JKRQ = new Date(value.KHBJSJ?.JKRQ).getTime();
                  const newDate=new Date().getTime();
                  return <>
                    {
                      value.KHBJSJ?.KHXSCQs.length === 0 ? <div className={styles.cards}>
                        <p className={styles.title}>{value.KHBJSJ?.KHKCSJ?.KCMC}</p>
                        <p>总课时：{value.KHBJSJ?.KSS}节 ｜ 已学课时：0节</p>
                        <p>未学课时：{value.KHBJSJ?.KSS}节｜可退课时：{value.KHBJSJ?.KSS}节</p>
                        <Checkbox value={`${value.KHBJSJId}+${value.KHBJSJ?.KSS}+${value.KHBJSJ?.KHKCSJ?.KCMC}`} disabled={newDate<JKRQ && newDate-JKRQ<2592000000} > </Checkbox>
                      </div> :
                        <div className={styles.cards}>
                          <p className={styles.title}>{value.KHBJSJ?.KHKCSJ?.KCMC}</p>
                          <p>总课时：{value.KHBJSJ?.KSS}节 ｜ 已学课时：{arrs.length}节   </p>
                          <p>未学课时：{value.KHBJSJ?.KSS - arrs.length}节｜可退课时：{value.KHBJSJ?.KSS - arrs.length}节</p>
                          <Checkbox value={`${value.KHBJSJId}+${value.KHBJSJ?.KSS - arrs.length}+${value.KHBJSJ?.KHKCSJ?.KCMC}`} disabled={newDate<JKRQ && newDate-JKRQ<2592000000}> </Checkbox>
                        </div>
                    }
                  </>
                })
              }
            </Checkbox.Group>
          </div>

        </div>
          <div className={styles.wrap}>
            <p>结课后才可退课，退课退款规则详见 <a onClick={showModal}>《课后服务协议》</a></p>
            <div className={styles.btn}>
              <Button onClick={showModals} disabled={typeof Datasourse === 'undefined' || Datasourse.length === 0}>提交</Button>
            </div>
          </div>
        </> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      </TabPane>
      <TabPane tab="退课记录" key="退课记录">
        {
          Record?.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
            <div className={styles.Record}>
              <div>
                {
                  Record.map((value: any) => {
                    const num = value!.KHBJSJ!.KSS! - value?.KSS;
                    return <div className={styles.cards}>
                      <p className={styles.title}>{value.KHBJSJ?.KHKCSJ?.KCMC}</p>
                      <p>总课时：{value.KHBJSJ?.KSS}节 ｜ 已学课时：{num}节  </p>
                      <p>未学课时：{value.KSS}节 ｜ 可退课时：{value.KSS}节</p>
                      <p className={styles.state} style={{ color: value.ZT === 0 ? "#FF6600" : "#45C977" }}>{value.ZT === 0 ? "申请中" : value.ZT === 1 ? "已退课":"退课失败"}</p>
                    </div>
                  })
                }
              </div>
            </div>
        }

      </TabPane>
    </Tabs>
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
      {
        KHFUXY?.length !== 0 ? <>
        <p>课后服务协议书</p>
        <div dangerouslySetInnerHTML={{ __html: KHFUXY?.[0].NR }} />
        </>:<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }

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
        {
          Datasourse?.map((value: any)=>{
            return<>
              <p> <span>退课名称：{value.KCMC}</span>  <span>可退课时：{value.KSS}</span></p>
            </>
          })
        }
      </div>
    </Modal>
  </div>;
};

export default DropClass;
