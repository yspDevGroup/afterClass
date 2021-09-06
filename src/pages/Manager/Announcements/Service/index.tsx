import { useState,useEffect } from 'react';
import { Button, Empty } from 'antd';
import { history, useModel } from 'umi';
import { EditOutlined } from '@ant-design/icons';
import PageContainer from '@/components/PageContainer';
import noData from '@/assets/noAnnoce.png';

import styles from '../index.module.less';
import { getXXTZGG } from '@/services/after-class/xxtzgg';

const ServiceDetails = (props: any) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [content, setContent] = useState<any>();
  useEffect(()=>{
    async function fetchData(){
      const res = await getXXTZGG({
        XXJBSJId:currentUser?.xxId,
        ZT:['已发布'],
        LX:'课后服务协议',
        page:1,
        pageSize:1,
      });
      if(res.status === 'ok'){
        setContent(res.data?.rows?.[0]);
      }
    }
    fetchData();
  },[]);

  return (
    <PageContainer>
      <Button
      style={{
        float:'right'
      }}
            key="xinjian"
            type="primary"
            onClick={() => {
              history.push('/announcements/service/editArticle',content);
            }}
          >
           <EditOutlined /> 编辑
          </Button>
      <div className={styles.ArticleDetails}>
        <h1>课后服务协议</h1>
        {content?.RQ ? <p className={styles?.RQ}>时间：{content?.RQ}</p>:''}
        {content?.NR ? <div dangerouslySetInnerHTML={{ __html: content?.NR }} /> :<Empty
        image={noData}
        imageStyle={{
          height: 150,
        }}
        description='尚未编辑课后服务协议，请先点击右上角编辑按钮' />}
      </div>
    </PageContainer>
  );
};
ServiceDetails.wrappers = ['@/wrappers/auth'];
export default ServiceDetails;
