import React, { useEffect, useState } from 'react';
import EmptyBGC from '@/assets/EmptyBGC.png';
import styles from './index.less';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { history, useModel } from 'umi';
import index_header from '@/assets/index_header.png';
import noCourses from '@/assets/noCourses.png';
import { Checkbox, Divider, message, Modal } from 'antd';
import { getKHFWBJ, studentRegistration } from '@/services/after-class/khfwbj';
import IconFont from '@/components/CustomIcon';
import { getXXTZGG } from '@/services/after-class/xxtzgg';

const EmptyArticle = (props: any) => {
  const { BJMC, ParentalIdentity } = props.location.state;

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { student } = currentUser || {};
  const StorageXSId = localStorage.getItem('studentId') || (student && student[0].XSJBSJId) || testStudentId;
  const StorageBjId = localStorage.getItem('studentBJId') || currentUser?.student?.[0].BJSJId || testStudentBJId;
  const [FWKCData, setFWKCData] = useState<any>();
  const [ModalVisible, setModalVisible] = useState(false);
  const [Times, setTimes] = useState<any[]>();
  const [FDBId, setFDBId] = useState<any[]>([]);
  // 课后服务协议
  const [KHFUXY, setKHFUXY] = useState<any>();


  useEffect(() => {
    (
      async () => {
        const resXNXQ = await queryXNXQList(currentUser?.xxId);
        const result = await getKHFWBJ({
          BJSJId: StorageBjId,
          XNXQId: resXNXQ?.current?.id || '',
          ZT: [1]
        })
        if (result.status === 'ok') {
          setFWKCData(result.data)
          const newArr: any[] = [];
          const newIdArr: any[] = [];
          result.data?.KHFWSJPZs?.forEach((value: any) => {
            newArr.push(value?.id)
          })
          setTimes(newArr)
          result.data?.KCFWBJs?.forEach((value: any) => {
            if (value?.LX === 1) {
              newIdArr.push(value?.KHBJSJId)
            }
          })
          setFDBId(newIdArr)
        }
      }
    )()
  }, [StorageXSId])
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

  const handleOks = async () => {
    setModalVisible(false);
    const res = await studentRegistration({
      KHFWBJId: FWKCData?.id,
      XSJBSJIds: [StorageXSId],
      KHBJSJIds: FDBId || [],
      ZT: Number(FWKCData?.FWFY) === 0 ? 0 : 3,
      KHFWSJPZIds: Times || []
    })
    if (res.status === 'ok') {
      message.success('报名成功')
      history.push('/parent/home/afterClassCoach/interestClassroom')
    } else {
      message.error('操作失败，请联系管理员')
    }
  };

  const onChanges = (key: any) => {
    setTimes(key)
  }

  return (
    <div className={styles.AfterClassCoach}>
      <div
        className={styles.goBack} >
        <div className={styles.tp} onClick={() => {
          history.push("/parent/home?index=index")
        }}>
          <IconFont type="icon-gengduo" />
        </div> <div className={styles.wz}>课后服务</div></div>
      <header className={styles.cusHeader} style={{ backgroundImage: `url(${index_header})` }}>
        <div className={styles.headerText}>
          <h4>
            <span>
              {ParentalIdentity || '家长'}
            </span>
            ，你好！
          </h4>
          <div className={styles.NjBj}>
            <div>{currentUser?.QYMC || ''}</div>
            <div>{BJMC || ''}</div>
          </div>
        </div>
      </header>
      <div className={styles.EmptyPage}>
        {
          FWKCData ? <div className={styles.text}>
            <p>课后服务协议书</p>
            <Divider />

            <div dangerouslySetInnerHTML={{ __html: KHFUXY }} className={styles.content} />
            {/* <div className={styles.box} style={{ backgroundImage: `url(${EmptyBGC})` }} /> */}
          </div> :
            <div className={styles.noData}>
              <img src={noCourses} alt="" />
              <p>本班级暂未开设课后服务</p>
            </div>
        }
      </div>
      {
        FWKCData ? <button onClick={() => {
          setModalVisible(true);
        }}>我要报名</button> : <></>
      }

      <Modal
        title="确认报名"
        visible={ModalVisible}
        onOk={handleOks}
        onCancel={() => {
          setModalVisible(false);
        }}
        closable={false}
        className={styles.signUpModal}
        okText="确认"
        cancelText="取消"
      >
        <div>
          <p>系统将为您报名所有未报名时段，您也可以指定部分时段进行报名。</p>

          <Checkbox.Group
            style={{ width: '100%' }}
            value={Times}
            onChange={onChanges} >
            {
              FWKCData?.KHFWSJPZs?.map((value: any) => {
                return <Checkbox value={value?.id} >
                  {value?.KSRQ}~{value?.JSRQ}</Checkbox>
              })
            }
          </Checkbox.Group>
        </div>
      </Modal>
    </div>
  );
};
export default EmptyArticle;
