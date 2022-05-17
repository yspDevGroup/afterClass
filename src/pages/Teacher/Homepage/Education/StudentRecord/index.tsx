import React, { useEffect, useState } from 'react';
import { useModel, history } from 'umi';
import moment from 'moment';
import { Button, Divider, message } from 'antd';
import { enHenceMsg } from '@/utils/utils';
import GoBack from '@/components/GoBack';
import MobileCon from '@/components/MobileCon';
import Nodata from '@/components/Nodata';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getAllKHKQXG, updateKHKQXG } from '@/services/after-class/khkqxg';
import icon_leave from '@/assets/icon-teacherLeave.png';
import noData from '@/assets/noData.png';

import styles from './index.less';

const AskForLeave = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [curXNXQ, setCurXNXQ] = useState<any>();
  const [dataInfo, setDataInfo] = useState<API.KHKQXG[]>([]);

  const fetch = async () => {
    // 获取后台学年学期数据
    const result = await queryXNXQList(currentUser?.xxId, undefined);
    if (result.current) {
      setCurXNXQ(result.current);
    }
  };
  const getData = async () => {
    const res = await getAllKHKQXG({
      XXJBSJId: currentUser?.xxId,
      SQRId: currentUser?.JSId || testTeacherId,
      startDate: curXNXQ?.KSRQ,
      endDate: curXNXQ?.JSRQ,
    });

    if (res.status === 'ok') {
      if (res.data) {
        setDataInfo(res.data);
      }
    } else {
      enHenceMsg(res.message);
    }
  };
  const handleCancle = async (d: any) => {
    const res = await updateKHKQXG({ id: d.id }, { ZT: 3 });
    if (res.status === 'ok') {
      message.success(`学生考勤更改申请已撤销`);
      getData();
    } else {
      enHenceMsg(res.message);
      getData();
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  useEffect(() => {
    getData();
  }, [curXNXQ]);
  return (
    <MobileCon>
      <GoBack title={'学生考勤更改记录'} teacher onclick="/teacher/home?index=education" />
      <div className={styles.leaveList}>
        <div className={styles.listWrapper}>
          {dataInfo.length ? (
            dataInfo.map((item: any) => {
              return (
                <div className={styles.Information} key={item.id}>
                  <div>
                    <h4>
                      {item.KHBJSJ?.BJMC}
                      {item.ZT === 3 ? (
                        <span>已撤销</span>
                      ) : item.ZT === 0 ? (
                        <span style={{ color: '#FFB257', borderColor: '#FFB257' }}>申请中</span>
                      ) : item.ZT === 1 ? (
                        <span style={{ color: '#15B628', borderColor: '#15B628' }}>已同意</span>
                      ) : item.ZT === 2 ? (
                        <span style={{ color: '#FF4B4B', borderColor: '#FF4B4B' }}>已驳回</span>
                      ) : (
                        ''
                      )}
                    </h4>
                  </div>
                  <p>
                    课程：
                    {item.KHBJSJ?.KHKCSJ?.KCMC}
                  </p>
                  <p>
                    考勤时间：{moment(item?.CQRQ).format('MM月DD日')} {item.XXSJPZ?.TITLE}{' '}
                    {item.XXSJPZ?.KSSJ?.substring(0, 5)}-{item.XXSJPZ?.JSSJ?.substring(0, 5)}
                  </p>
                  {item?.SPBZXX ? (
                    <>
                      {' '}
                      <Divider />
                      <p>审批说明：{item?.SPBZXX}</p>
                    </>
                  ) : (
                    <></>
                  )}
                  {item.ZT === 0 ? (
                    <>
                      <Button onClick={() => handleCancle(item)}>撤销</Button>
                      <Button
                        onClick={() => {
                          history.push({
                            pathname: '/teacher/education/studentRecord/detail',
                            state: {
                              recordId: item.id,
                            },
                          });
                        }}
                      >
                        详情
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => {
                        history.push({
                          pathname: '/teacher/education/studentRecord/detail',
                          state: {
                            recordId: item.id,
                          },
                        });
                      }}
                    >
                      详情
                    </Button>
                  )}
                </div>
              );
            })
          ) : (
            <Nodata imgSrc={noData} desc="暂无学生考勤更改记录" />
          )}
        </div>
        <div className={styles.footer}>
          <div
            className={styles.apply}
            onClick={() => {
              history.push('/teacher/education/studentRecord/apply');
            }}
          >
            <div>
              <img src={icon_leave} />
            </div>
            考勤更改
          </div>
        </div>
      </div>
    </MobileCon>
  );
};

export default AskForLeave;
