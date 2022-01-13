/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { Button, Empty } from 'antd';
import { history, useModel } from 'umi';
import { EditOutlined } from '@ant-design/icons';
import noData from '@/assets/noAnnoce.png';

import styles from '../index.module.less';
import { getXXTZGG } from '@/services/after-class/xxtzgg';

const ServiceDetails = (props: { type: string }) => {
  const { type } = props;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const [content, setContent] = useState<any>();
  useEffect(() => {
    async function fetchData() {
      const res = await getXXTZGG({
        XXJBSJId: currentUser?.xxId,
        ZT: ['已发布'],
        LX: [type === 'normal' ? '课后服务协议' : type === 'increment' ? '增值服务协议' : '缤纷课堂协议'],
        page: 1,
        pageSize: 1,
      });
      if (res.status === 'ok') {
        setContent(res.data?.rows?.[0]);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <div
        style={{
          marginTop: '-50px',
          padding: '4px 16px 8px',
          textAlign: 'right',
          borderBottom: ' 1px solid #dadada',
          width: '100%'
        }}
      >
        <span style={{ color: '#4884ff', paddingRight: 14 }}>
          本协议内容适用于{type === 'normal' ? '课后服务协议' : type === 'increment' ? '增值服务协议' : '缤纷课堂协议'}
        </span>
        <Button
          key="xinjian"
          type="primary"
          onClick={() => {
            history.push(`/basicalSettings/service/${type === 'service' ? 'editArticle' : 'editServices'}?type=${type}`, content);
          }}
        >
          <EditOutlined /> 编辑
        </Button>
      </div>
      <div className={styles.articleWraper}>
        <div className={styles.ArticleDetails}>
          <h1>{type === 'normal' ? '课后服务协议' : type === 'increment' ? '增值服务协议' : '缤纷课堂协议'}</h1>
          {content?.RQ ? <p className={styles?.RQ}>时间：{content?.RQ}</p> : ''}
          {content?.NR ? (
            <div dangerouslySetInnerHTML={{ __html: content?.NR }} />
          ) : (
            <Empty
              image={noData}
              imageStyle={{
                height: 150,
              }}
              description={`尚未编辑${type === 'normal' ? '课后服务协议' : type === 'increment' ? '增值服务协议' : '缤纷课堂协议'}，请先点击右上角编辑按钮`}
            />
          )}
        </div>
      </div>
    </>
  );
};
export default ServiceDetails;
