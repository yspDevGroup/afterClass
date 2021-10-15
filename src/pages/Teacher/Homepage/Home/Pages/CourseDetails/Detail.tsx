import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Divider } from 'antd';
import { enHenceMsg, getQueryString } from '@/utils/utils';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import noPic from '@/assets/noPic.png';
import GoBack from '@/components/GoBack';
import WWOpenDataCom from '@/components/WWOpenDataCom';
import { getKHBJSJ } from '@/services/after-class/khbjsj';
import { getKHPKSJByBJID } from '@/services/after-class/khpksj';
import styles from './index.less';

const Detail: React.FC = () => {
  const [classDetail, setClassDetail] = useState<any>();
  const [extra, setExtra] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const classid = getQueryString('classid');
  const index = getQueryString('index');
  const fetchData = async (bjid: string) => {
    const res = await getKHBJSJ({ id: bjid });
    if (res.status === 'ok') {
      if (res.data) {
        setClassDetail(res.data);
      }
    } else {
      enHenceMsg(res.message);
    }
    const res1 = await getKHPKSJByBJID({ id: bjid });
    if (res1.status === 'ok') {
      if (res1.data && res1.data.length) {
        const extraInfo = [].map.call(res1.data, (item: any) => {
          return {
            FJSJ: item.FJSJ,
            XXSJPZ: item.XXSJPZ,
            WEEKDAY: item.WEEKDAY,
          };
        });
        setExtra(extraInfo);
      }
    } else {
      enHenceMsg(res1.message);
    }
  };
  const getWxData = async () => {
    if (/MicroMessenger/i.test(navigator.userAgent)) {
      await initWXConfig(['checkJsApi']);
    }
    await initWXAgentConfig(['checkJsApi']);
    setIsLoading(true);
  };
  useEffect(() => {
    getWxData();
  }, [isLoading]);
  useEffect(() => {
    getWxData();
    if (classid) {
      fetchData(classid);
    }
  }, [classid]);

  return (
    <div className={styles.CourseDetails}>
      {index === 'all' ? (
        <GoBack title={'课程简介'} teacher />
      ) : (
        <GoBack title={'课程简介'} onclick="/teacher/home?index=index" teacher />
      )}
      <div className={styles.wrap}>
        {classDetail?.KHKCSJ?.KCTP && classDetail?.KHKCSJ?.KCTP.indexOf('http') > -1 ? (
          <img
            src={classDetail?.KHKCSJ?.KCTP}
            alt=""
            style={{ marginBottom: '18px', height: '200px' }}
          />
        ) : (
          <div
            style={{
              padding: '10px',
              border: '1px solid #F7F7F7',
              textAlign: 'center',
              marginBottom: '18px',
            }}
          >
            <img style={{ width: '180px', height: 'auto', marginBottom: 0 }} src={noPic} />
          </div>
        )}
        <p className={styles.title}>{classDetail?.KHKCSJ?.KCMC}</p>

        <ul>
          <li>
            上课时段：{moment(classDetail?.KKRQ).format('YYYY.MM.DD')}~
            {moment(classDetail?.JKRQ).format('YYYY.MM.DD')}
          </li>
          <li>上课地点：{classDetail?.XQName || '本校'}</li>
        </ul>
        <p className={styles.title}>课程简介</p>
        <p className={styles.content}>{classDetail?.KHKCSJ?.KCMS}</p>
        <Divider />
        <ul className={styles.classInformation}>
          <li>授课班级：{classDetail?.BJMC}</li>
          <li className={styles.bzrname}>
            班主任：
            {classDetail?.KHBJJs.map((item: any) => {
              if (item.JSLX.indexOf('副') === -1) {
                const showWXName = item.JZGJBSJ?.XM === '未知' && item.JZGJBSJ?.WechatUserId;
                return (
                  <span style={{ marginRight: '1em' }}>
                    {showWXName ? (
                      <WWOpenDataCom type="userName" openid={item.JZGJBSJ.WechatUserId} />
                    ) : (
                      item.JZGJBSJ?.XM
                    )}
                  </span>
                );
              }
              return '';
            })}
          </li>
          <li className={styles.bzrname}>
            副班：
            {classDetail?.KHBJJs.map((item: any) => {
              if (item.JSLX.indexOf('主') === -1) {
                const showWXName = item.JZGJBSJ?.XM === '未知' && item.JZGJBSJ?.WechatUserId;
                return (
                  <span style={{ marginRight: '1em' }}>
                    {showWXName ? (
                      <WWOpenDataCom type="userName" openid={item.JZGJBSJ.WechatUserId} />
                    ) : (
                      item.JZGJBSJ?.XM
                    )}
                  </span>
                );
              }
              return '';
            })}
          </li>

          <li>
            上课安排：
            <table width="100%">
              <thead>
                <tr>
                  <th>星期</th>
                  <th>节次</th>
                  <th>时间</th>
                  <th>校区</th>
                  <th>教室</th>
                </tr>
              </thead>
              <tbody>
                {extra?.map((values: { FJSJ: any; XXSJPZ: any; WEEKDAY: number }) => {
                  const weeks = `星期${'日一二三四五六'.charAt(values.WEEKDAY)}`;
                  return (
                    <tr>
                      <td>{weeks}</td>
                      <td>{values.XXSJPZ.TITLE}</td>
                      <td>
                        {values.XXSJPZ.KSSJ.substring(0, 5)}-{values.XXSJPZ.JSSJ.substring(0, 5)}
                      </td>
                      <td>{values.FJSJ.XQName || '本校'}</td>
                      <td>{values.FJSJ.FJMC}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Detail;
