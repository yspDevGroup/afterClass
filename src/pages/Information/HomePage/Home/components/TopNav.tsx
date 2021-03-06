import { history } from 'umi';
import { Col, Row } from 'antd';
import { LeftOutlined, SyncOutlined } from '@ant-design/icons';
import styles from '../index.less';
import MobileCon from '@/components/MobileCon';

const TopNav = (props: any) => {
  const { title, state, Refresh, onclick } = props;

  return (
    <MobileCon>
      <div className={styles.mobilePageHeader}>
        <Row className={styles.topContainer}>
          <Col span={4}>
            {state === true ? (
              <div
                onClick={() => {
                  history.go(-1);
                }}
                style={{
                  marginBottom: '24px',
                }}
              >
                <LeftOutlined />
              </div>
            ) : (
              <></>
            )}
          </Col>
          <Col span={16}>{title}</Col>
          <Col span={4}>{Refresh === true ? <SyncOutlined onClick={onclick} /> : <></>}</Col>
        </Row>
      </div>
    </MobileCon>
  );
};

export default TopNav;
