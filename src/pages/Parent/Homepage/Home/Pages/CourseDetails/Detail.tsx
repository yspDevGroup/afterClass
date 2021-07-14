import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { enHenceMsg, getQueryString } from '@/utils/utils';
import moment from 'moment';
import WWOpenDataCom from '@/pages/Manager/ClassManagement/components/WWOpenDataCom';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import noPic from '@/assets/noPic.png';
import GoBack from '@/components/GoBack';
import { getKHBJSJ } from '@/services/after-class/khbjsj';


const CourseDetails: React.FC = () => {
  const [classDetail, setClassDetail] = useState<any>();
  const classid = getQueryString('classid');
  const fetchData = async (bjid: string) => {
    const res = await getKHBJSJ({ id: bjid });
    if (res.status === 'ok') {
      if (res.data) {
        setClassDetail(res.data);
      }
    } else {
      enHenceMsg(res.message);
    }
  }
  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      if (await initWXConfig(['checkJsApi'])) {
        await initWXAgentConfig(['checkJsApi']);
      }
    })();
  }, []);

  useEffect(() => {
    if (classid) {
      fetchData(classid);
    }
  }, [classid]);

  // 房间数据去重
  const tempfun = (arr: any) => {
    const fjname: string[] = [];
    if(arr){
      arr.forEach((item: any) => {
        if (!fjname.includes(item.FJSJ.FJMC)) {
          fjname.push(item.FJSJ.FJMC)
        }
      });
    }
    return fjname.map((values: any) => {
      return <span>{values}</span>
    })
  }
  return <div className={styles.CourseDetails}>
    <GoBack title={'课程简介'} />
    <div className={styles.wrap}>
      {
        classDetail?.KHKCSJ?.KCTP && classDetail?.KHKCSJ?.KCTP.indexOf('http') > -1 ?
          <img src={classDetail?.KHKCSJ?.KCTP} alt="" style={{ marginBottom: '18px', height: '200px' }} /> :
          <div style={{ padding: '10px', border: '1px solid #F7F7F7', textAlign: 'center', marginBottom: '18px' }}><img style={{ width: '180px', height: 'auto', marginBottom: 0 }} src={noPic} /></div>
      }
      <p className={styles.title}>{classDetail?.KHKCSJ?.KCMC}</p>

      <ul>
        <li>上课时段：{moment(classDetail?.KKRQ).format('YYYY.MM.DD')}~{moment(classDetail?.JKRQ).format('YYYY.MM.DD')}</li>
        <li>上课地点：本校</li>
      </ul>
      <p className={styles.title}>课程简介</p>
      <p className={styles.content}>{classDetail?.KHKCSJ?.KCMS}</p>
      <p className={styles.content} style={{ marginTop: '20px' }}>所在班级：</p>
      <ul className={styles.classInformation}>
        <li>{classDetail?.BJMC}：总课时：{classDetail?.KSS}课时,
          上课时间：{
            classDetail?.KHPKSJs?.map((values: { FJSJ: any, XXSJPZ: any, WEEKDAY: number }) => {
              const weeks = `周${'日一二三四五六'.charAt(values.WEEKDAY)}`;
              let kssj = '';
              if (values.XXSJPZ.KSSJ) {
                values.XXSJPZ.KSSJ.split(':')
                kssj = `${values.XXSJPZ.KSSJ.split(':')[0]}:${values.XXSJPZ.KSSJ.split(':')[1]}`
              }
              let jssj = '';
              if (values.XXSJPZ.JSSJ) {
                values.XXSJPZ.JSSJ.split(':')
                jssj = `${values.XXSJPZ.JSSJ.split(':')[0]}:${values.XXSJPZ.JSSJ.split(':')[1]}`
              }
              return <span>{weeks}{kssj}-{jssj},</span>
            })
          }
          上课地点：{tempfun(classDetail?.KHPKSJs)}，
          <span className={styles.bzrname}>
            班主任：{<WWOpenDataCom type="userName" openid={classDetail?.ZJS} />}
          </span>
          ,
          <span className={styles.bzrname}>
            副班：{
              classDetail?.FJS.split(',').map((item: any) => {
                return <span style={{ marginRight: '5px' }}><WWOpenDataCom type="userName" openid={item} /></span>
              })
            }。
          </span>
        </li>
      </ul>
    </div>
  </div>

};

export default CourseDetails;
