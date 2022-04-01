import React from 'react';
import { Link } from 'umi';
import styles from './index.less';
import noData from '@/assets/noTzgg1.png';
import IconFont from '@/components/CustomIcon';
import Nodata from '@/components/Nodata';
import { Tabs } from 'antd';

const { TabPane } = Tabs;
const Details = (props: { data?: any[], zcdata?: any[] }) => {
  const { data, zcdata } = props;
  return (
    <div className={styles.bigbox}>
      <Tabs type="card">
        <TabPane tab="校内通知" key="xntz">
          {data && data.length ? (
            <ul style={{ listStyle: 'initial', paddingLeft: '0px' }}>
              {data?.map((record: any, index: number) => {
                if (index < 4) {
                  return (
                    <Link
                      to={`/teacher/home/notice/announcement?listid=${record.id}&type=xntz`}
                      style={{ color: '#333' }}
                      key={record.id}
                    >
                      <li style={{ lineHeight: '30px', listStyle: 'none' }}>
                        <div
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '100%',
                          }}
                        >
                          <div className={styles.yuan} />
                          {record.SFTT === 1 ? (
                            <div className={styles.Headlines}>头条</div>
                          ) : (
                            <></>
                          )}{' '}
                          {record.BT}
                        </div>
                      </li>
                    </Link>
                  );
                }
                return '';
              })}
            </ul>
          ) : (
            <Nodata imgSrc={noData} desc="暂无公告" />
          )}
        </TabPane>
        <TabPane tab="政策公告" key="zcgg">
          {zcdata && zcdata.length ? (
            <ul style={{ listStyle: 'initial', paddingLeft: '0px' }}>
              {zcdata?.map((record: any, index: number) => {
                if (index < 4) {
                  return (
                    <Link
                      to={`/teacher/home/notice/announcement?listid=${record.id}&type=zcgg&ly=${record.JYJGSJ.BMMC}`}
                      style={{ color: '#333' }}
                      key={record.id}
                    >
                      <li style={{ lineHeight: '30px', listStyle: 'none' }}>
                        <div
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '100%',
                          }}
                        >
                          <div className={styles.yuan} />
                          {record.SFTT === 1 ? (
                            <div className={styles.Headlines}>头条</div>
                          ) : (
                            <></>
                          )}{' '}
                          {record.BT}
                        </div>
                      </li>
                    </Link>
                  );
                }
                return '';
              })}
            </ul>
          ) : (
            <Nodata imgSrc={noData} desc="暂无公告" />
          )}
        </TabPane>
      </Tabs>
      <Link
        to={{
          pathname: '/teacher/home/notice',
        }}
      >
        <p className={styles.all}>
          查看全部 <IconFont type="icon-gengduo" />
        </p>
      </Link>
    </div>
  );
};

export default Details;
