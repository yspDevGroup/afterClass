import React, { useEffect, useState } from 'react';
import EmptyBGC from '@/assets/EmptyBGC.png';
import styles from './index.less';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { history, useModel } from 'umi';
import index_header from '@/assets/index_header.png';
import noCourses from '@/assets/noCourses.png';
import { Divider, message, Modal } from 'antd';
import { getKHFWBJ, getStudentListByBjid, studentRegistration } from '@/services/after-class/khfwbj';
import IconFont from '@/components/CustomIcon';
import { createKHJGRZSQ } from '@/services/after-class/khjgrzsq';

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
  

  useEffect(() => {
    (
      async () => {
        const resXNXQ = await queryXNXQList(currentUser?.xxId);
        const result = await getKHFWBJ({
          BJSJId: StorageBjId,
          XNXQId: resXNXQ?.current?.id || '',
        })
        if (result.status === 'ok') {
          console.log(result.data)
          setFWKCData(result.data)
          const newArr: any[] = [];
          result.data?.KHFWSJPZs?.forEach((value: any) => {
            newArr.push(value?.id)
          })
          setTimes(newArr)
        }
     
      }
    )()
  }, [StorageXSId])

  const handleOks = async () => {
    setModalVisible(false);
    const res = await studentRegistration({
      KHFWBJId: FWKCData?.id,
      XSJBSJIds: [StorageXSId],
      KHBJSJIds: [],
      ZT: 3,
      KHFWSJPZIds: Times || []
    })
    if (res.status === 'ok') {
      message.success('报名成功')
      history.push('/parent/home/afterClassCoach/interestClassroom')
    } else {
      message.error('操作失败，请联系管理员')
    }
  };


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
            <p>课后服务协议</p>
            <Divider />
            <div className={styles.box} style={{ backgroundImage: `url(${EmptyBGC})` }} />
            <div className={styles.content}>
              一、课后服务说明
              1、参加课后服务纯属学生及家长自愿，学校尊重学生和家长的自主选择。2、不愿意参加的同学，不作强行要求。
              3、课后服务时间:平均每次不超过1.5小时。(冬季时间稍短，夏季时间稍长。节假日及学生下午离校时间除外，特殊情况另行通知）
              4、学生有病或者有特殊事情时家长必须提前亲自到校或电话为学生请假。
              5、参加课后服务的学生自下午放学后不得擅自离校，要严格遵守学校的各项规章制度，服从教师管理，对严重违纪或屡教不改的学生学校有权终止其参加课后服务的资格。
              6、为解决学生参加课后服务期间晚餐的问题，家长可以为学生自备饮食，也可以购买配餐单位为学生提供的间食（按月收取费用)，学生和家长自愿选择。严禁放学后外出就餐或购买外卖.违者取消其参加课后服务的资格。
              二、安全要求
              1、服务期间，学校和家长共同做好安全工作，加强安全教育。参加服务的学生严格遵守校规校纪，严禁在走廊跑跳、疯闹、打架等;严禁携带危险物品（如刀具）到校。教育学生服务期间遵守交通规则。家长必须叮嘱学生上学放学路上的安全,按时回家，不得在外逗留。
              2、家长必须加强对孩子交通安全教育和防溺水等安全教育，严格监控学生的时间。3、参加课后服务的学生家长要保持通讯畅通，便于及时沟通。
              4、家长对回家较晚或离家较早的学生要注意动向，及时打电话与学校联系。三、本协议未尽之处由学校及家长委员会另行补充。
              二、安全要求
              1、服务期间，学校和家长共同做好安全工作，加强安全教育。参加服务的学生严格遵守校规校纪，严禁在走廊跑跳、疯闹、打架等;严禁携带危险物品（如刀具）到校。教育学生服务期间遵守交通规则。家长必须叮嘱学生上学放学路上的安全,按时回家，不得在外逗留。
              2、家长必须加强对孩子交通安全教育和防溺水等安全教育，严格监控学生的时间。3、参加课后服务的学生家长要保持通讯畅通，便于及时沟通。
              4、家长对回家较晚或离家较早的学生要注意动向，及时打电话与学校联系。三、本协议未尽之处由学校及家长委员会另行补充。
            </div>
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
        }}>去报名</button> : <></>
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
          您是否确定课后报名服务
        </div>
      </Modal>
    </div>
  );
};
export default EmptyArticle;
