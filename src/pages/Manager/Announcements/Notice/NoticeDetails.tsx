import PageContainer from '@/components/PageContainer';
import styles from '../index.module.less';

const ArticleDetails = (props: any) => {
  const { state } = props.history.location;
  return (
    <PageContainer>
      <div className={styles.ArticleDetails}>
        <h1>{state.BT}</h1>
        <p className={styles.RQ}>时间：{state.RQ}</p>
        <div dangerouslySetInnerHTML={{ __html: state.NR }} />
        <p className={styles.LY}>来源：{state.LY}</p>
      </div>
    </PageContainer>
  );
};
ArticleDetails.wrappers = ['@/wrappers/auth'];
export default ArticleDetails;
