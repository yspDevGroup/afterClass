import React, { useState, useContext, useEffect } from 'react';
import { Link, useModel } from 'umi';
import DisplayColumn from '@/components/DisplayColumn';
import Statistical from './components/Statistical';
import IconFont from '@/components/CustomIcon';
import myContext from '@/utils/MyContext';
import { getAllKHXSDD } from '@/services/after-class/khxsdd';
import imgPop from '@/assets/mobileBg.png';
import styles from './index.less';
import { iconTextData } from './mock';
import { enHenceMsg } from '@/utils/utils';
import evaluation from '@/assets/evaluation.png';
import drop from '@/assets/drop.png';
import icon_Rgo from '@/assets/icon_Rgo.png';
// import { Col, Row } from 'antd';
// import evaluation from '@/assets/evaluation.png';
// import drop from '@/assets/drop.png';
// import { RightOutlined } from '@ant-design/icons';

const Mine = () => {
  const { currentUserInfo, courseStatus } = useContext(myContext);
  const [totail, setTotail] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  useEffect(() => {
    // const data = currentUserInfo?.subscriber_info?.children || [
    //   {
    //     student_userid: currentUserInfo?.UserId,
    //     njId: '1',
    //   },
    // ];
    async function fetch() {
      const res = await getAllKHXSDD({
        XSId: currentUser?.student?.student_userid,
        // njId: currentUser.njId,
        DDZT: '待付款',
      });
      if (res.status === 'ok') {
        if (res.data && res.data.length) {
          setTotail(true);
        }
      } else {
        enHenceMsg(res.message);
      }
    }
    fetch();
  }, []);
  return (
    <div className={styles.minePage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }} />
        <div className={styles.header}>
          {currentUserInfo?.avatar ? <img src={currentUserInfo?.avatar} /> : ''}
          <div className={styles.headerName}>
            <h4>
              {currentUserInfo?.external_contact?.subscriber_info.remark ||
                currentUserInfo?.username ||
                '家长'}
            </h4>
            {/* <h4>{currentUser?.student?.name || currentUserInfo?.username || '家长'}</h4> */}
            <span>微信名：{currentUserInfo?.username}</span>
          </div>
        </div>
      </header>
      <div className={styles.payList}>
        <DisplayColumn
          type="icon"
          title="我的订单"
          isheader={true}
          grid={{ column: 4 }}
          dataSource={iconTextData}
          totil={totail}
        />
      </div>
      <div className={styles.operation}>
        <Link to="" className={styles.drop}>
          <img src={drop} alt="" />
          <span className={styles.dropSpan}>我要退课</span>
          <img src={icon_Rgo} alt="" className={styles.icon_Rgo} />
        </Link>
        <Link to="" className={styles.evaluation}>
          <img src={evaluation} alt=""  />
          <span className={styles.evaluationSpan}>课程评价</span>
          <img src={icon_Rgo} alt="" className={styles.icon_Rgo} />
         </Link>
      </div>
      {/* <div className={styles.wraps}>
        <Row gutter={16}>
          <Col
            className="gutter-row"
            span={12}
            onClick={() => {
              history.push('/parent/mine/dropClass');
            }}
          >
            <div className={styles.box}>
              <img src={drop} alt="" />
              我要退课
              <RightOutlined />
            </div>
          </Col>
          <Col
            className="gutter-row"
            span={12}
            onClick={() => {
              history.push('/parent/mine/evaluation');
            }}
          >
            <div className={styles.box}>
              <img src={evaluation} alt="" />
              课程评价
              <RightOutlined />
            </div>
          </Col>
        </Row>
      </div> */}

      {courseStatus === 'empty' ? '' : <Statistical />}
      <div className={styles.linkWrapper}>
        <ul>
          <li>
            <IconFont type="icon-fuwugonggao" style={{ fontSize: '18px' }} />
            <Link to="/parent/home/notice/announcement?articlepage=serveAnnounce">
              服务公告
              <IconFont type="icon-gengduo" />
            </Link>
          </li>
          <li>
            <IconFont type="icon-guanyu" style={{ fontSize: '18px' }} />
            <Link to="/parent/home/notice/announcement?articlepage=about">
              关于
              <IconFont type="icon-gengduo" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Mine;
