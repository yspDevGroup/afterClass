import PageContainer from '@/components/PageContainer';
import styles from '../index.module.less';
import { history } from 'umi';
import { LeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const ArticleDetails = (props: any) => {
  const { state } = props.history.location;
  return (
    <PageContainer>
      <Button
        type="primary"
        onClick={() => {
          history.goBack();
        }}
        style={{
          marginBottom: '24px'
        }}
      >
        <LeftOutlined />
        返回上一页
      </Button>
      <div className={styles.ArticleDetails}>
        <h1>{state.BT}</h1>
        <p className={styles.RQ}>时间：{state.RQ}</p>
        <div dangerouslySetInnerHTML={{ __html: state.NR }} />
        <p className={styles.LY}>来源：{state.JYJGSJ.BMMC}</p>
      </div>
    </PageContainer>
  );
};
ArticleDetails.wrappers = ['@/wrappers/auth'];
export default ArticleDetails;
