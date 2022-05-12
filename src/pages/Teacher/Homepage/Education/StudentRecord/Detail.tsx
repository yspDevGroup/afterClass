/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2022-05-12 12:08:53
 * @LastEditTime: 2022-05-12 14:44:11
 * @LastEditors: Sissle Lynn
 */
import { useEffect, useState } from 'react';
import 'moment/locale/zh-cn';

import styles from './index.less';
import GoBack from '@/components/GoBack';
import MobileCon from '@/components/MobileCon';
import { enHenceMsg } from '@/utils/utils';
import { getKHKQXG } from '@/services/after-class/khkqxg';
import ProTable from '@ant-design/pro-table';
import { Divider } from 'antd';
import ShowName from '@/components/ShowName';
import moment from 'moment';
const StudentDetail = (props: any) => {
  const { recordId } = props.location.state;
  const [course, setCourse] = useState<any>();

  useEffect(() => {
    (async () => {
      if (recordId) {
        console.log(recordId);

        const res = await getKHKQXG({ id: recordId });
        if (res.status === 'ok') {
          setCourse(res.data);
        } else {
          enHenceMsg(res.message);
        }
      }
    })();
  }, [recordId]);
  const columns: any = [
    {
      title: '姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
      render: (test: any, record: any) => {
        return (
          <ShowName type="userName" openid={record?.XSJBSJ?.WechatUserId} XM={record?.XSJBSJ?.XM} />
        );
      },
    },
    {
      title: '原考勤情况',
      dataIndex: 'SRCCQZT',
      key: 'SRCCQZT',
      align: 'center',
    },
    {
      title: '现考勤情况',
      dataIndex: 'NOWCQZT',
      key: 'NOWCQZT',
      align: 'center',
    },
  ];
  return (
    <MobileCon>
      <GoBack title={'学生考勤更改详情'} onclick="/teacher/education/studentRecord" teacher />
      <div className={`${styles.detailWrapper} ${styles.listWrapper}`}>
        <div className={styles.studentList}>
          <div className={styles.Information}>
            <div>
              <h4>
                {course?.KHBJSJ?.BJMC}
                {course?.ZT === 3 ? (
                  <span>已撤销</span>
                ) : course?.ZT === 0 ? (
                  <span style={{ color: '#FFB257', borderColor: '#FFB257' }}>申请中</span>
                ) : course?.ZT === 1 ? (
                  <span style={{ color: '#15B628', borderColor: '#15B628' }}>已同意</span>
                ) : course?.ZT === 2 ? (
                  <span style={{ color: '#FF4B4B', borderColor: '#FF4B4B' }}>已驳回</span>
                ) : (
                  ''
                )}
              </h4>
            </div>
            <p>
              课程：
              {course?.KHBJSJ?.KHKCSJ?.KCMC}
            </p>
            <p>
              考勤时间：{moment(course?.CQRQ).format('MM月DD日')} {course?.XXSJPZ?.TITLE}{' '}
              {course?.XXSJPZ?.KSSJ?.substring(0, 5)}-{course?.XXSJPZ?.JSSJ?.substring(0, 5)}
            </p>
            {course?.SQR ? (
              <p>
                申请人：
                <ShowName type="userName" openid={course?.SQR?.WechatUserId} XM={course?.SQR?.XM} />
              </p>
            ) : (
              <></>
            )}
            {course?.SPR ? (
              <p>
                审批人：
                <ShowName type="userName" openid={course?.SPR?.WechatUserId} XM={course?.SPR?.XM} />
              </p>
            ) : (
              <></>
            )}
            {course?.SPBZXX ? <p>审批说明：{course?.SPBZXX}</p> : <></>}
          </div>
          <Divider />
          <ProTable<any>
            dataSource={course?.KHXSKQXGs}
            columns={columns}
            headerTitle={'考勤更改明细'}
            rowKey="id"
            pagination={{
              defaultPageSize: 5,
              defaultCurrent: 1,
              pageSizeOptions: ['5'],
              showQuickJumper: false,
              showSizeChanger: false,
              showTotal: undefined,
            }}
            search={false}
            options={{
              setting: false,
              fullScreen: false,
              density: false,
              reload: false,
            }}
          />
        </div>
      </div>
    </MobileCon>
  );
};

export default StudentDetail;
