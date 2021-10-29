import styles from './index.less';
import Overview from './components/Overview';
import Notice from './components/Notice';

const Home = () => {
  return (
    <div className={styles.indexPage}>
      <div className={styles.pageContent}>
        <div className={`${styles.noticeArea} ${styles[ENV_type]}`} />
        <Overview />
        <Notice />
      </div>
    </div>
  );
};

export default Home;
