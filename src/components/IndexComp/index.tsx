/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-01 08:49:11
 * @LastEditTime: 2022-04-13 16:33:56
 * @LastEditors: zpl
 */
import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Tabs } from 'antd';
import { Access, Link, useAccess, useModel } from 'umi';
import {
  DeploymentUnitOutlined,
  HighlightOutlined,
  RightOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import Topbar from './Topbar';
import CenterBar from './CenterBar';
import List from './List';
import noAnnoce from '@/assets/noAnnoce.png';
import noData from '@/assets/noData.png';
import home1 from '@/assets/home1.png';
import home2 from '@/assets/home2.png';
import home3 from '@/assets/home3.png';
import home4 from '@/assets/home4.png';
import arrow from '@/assets/arrow.png';

import styles from './index.less';
import { homePage, getAllUnfinish } from '@/services/after-class/xxjbsj';
import { getXXTZGG } from '@/services/after-class/xxtzgg';
// import { KHJYJG } from '@/services/after-class/khjyjg';
import { getJYJGTZGG } from '@/services/after-class/jyjgtzgg';
import { queryXNXQList } from '@/services/local-services/xnxq';
import PromptInformation from '@/components/PromptInformation';

const { TabPane } = Tabs;
const Index = () => {
  const { initialState } = useModel('@@initialState');
  const { isLogin } = useAccess();
  const { currentUser } = initialState || {};
  const [homeData, setHomeData] = useState<any>();
  const [thingData, setThingData] = useState<any>();
  const [policyData, setPolicyData] = useState<any>();
  const [annoceData, setAnnoceData] = useState<any>();
  // 学期学年没有数据时提示的开关
  const [kai, setkai] = useState<boolean>(false);
  const [JSkai, setJSkai] = useState<boolean>(false);
  // 控制学期学年数据提示框的函数
  const kaiguan = () => {
    setkai(false);
  };
  const JSkaiguan = () => {
    setJSkai(false);
  };
  const fetchData = async (XNXQId: any) => {
    const res = await homePage({
      XXJBSJId: currentUser?.xxId,
      XNXQId,
    });
    if (res.status === 'ok') {
      // 配置头部统计栏目数据
      setHomeData({ ...res.data, xs_counts: Number(res.data.xs_count + res.data.khfwxs_count) });
    }
    const resThings = await getAllUnfinish({
      XXJBSJId: currentUser?.xxId,
      XNXQId,
    });
    if (resThings.status === 'ok') {
      setThingData(resThings.data);
    }
    // 校内通知
    const result = await getXXTZGG({
      XXJBSJId: currentUser?.xxId,
      BT: '',
      LX: ['0'],
      ZT: ['已发布'],
      page: 1,
      pageSize: 3,
    });
    if (result.status === 'ok') {
      setAnnoceData(result.data?.rows);
    }
    // 配置政策公告数据
    const resgetXXTZGG = await getJYJGTZGG({
      BT: '',
      LX: 1,
      ZT: ['已发布'],
      XZQHM: currentUser?.XZQHM,
      page: 1,
      pageSize: 3,
    });
    if (resgetXXTZGG.status === 'ok') {
      setPolicyData(resgetXXTZGG.data?.rows);
    }
  };
  useEffect(() => {
    // 获取该用户是否导入
    const authType = localStorage.getItem('authType') || 'none';
    if (!currentUser.username && authType === 'password') {
      setJSkai(true);
    } else if (!currentUser.JSId && authType !== 'password') {
      setJSkai(true);
    }
  }, []);
  useEffect(() => {
    // 获取学年学期数据的获取
    (async () => {
      const res = await queryXNXQList(currentUser?.xxId);
      // 获取到的整个列表的信息
      const newData = res.xnxqList;
      const curTerm = res.current;
      if (newData?.length) {
        if (curTerm) {
          fetchData(curTerm.id);
        }
      } else {
        setkai(true);
      }
    })();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <PromptInformation
        text="未查询到学年学期数据，请设置学年学期后再来"
        link="/basicalSettings/termManagement"
        open={kai}
        colse={kaiguan}
      />
      <PromptInformation
        text="有部分教师暂未同步信息，请在教师管理中导入教师信息"
        link="/basicalSettings/teacherManagement"
        open={JSkai}
        colse={JSkaiguan}
        closeType={true}
      />
      <Topbar data={homeData} />
      <Row className={`${styles.listWrapper} ${styles.rowWrapper}`}>
        <Col span={12}>
          <Card
            title="校内通知"
            bordered={false}
            extra={
              <a href="/announcements/notice">
                更多
                <RightOutlined style={{ fontSize: '12px' }} />
              </a>
            }
          >
            <List type="notice" data={annoceData} noDataImg={noAnnoce} noDataText="暂无信息" />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="政策公告"
            bordered={false}
            extra={
              <a href="/announcements/policy">
                更多
                <RightOutlined style={{ fontSize: '12px' }} />
              </a>
            }
          >
            <List type="policy" data={policyData} noDataImg={noData} noDataText="暂无信息" />
          </Card>
        </Col>
      </Row>
      <Access accessible={isLogin}>
        <Row className={styles.chartWrapper}>
          <Col span={24}>
            {/* extra={<Button type='primary'><img src={exportImg} style={{ marginRight: 16 }} />下载使用手册</Button>} */}
            <Card title="待办事项" bordered={false}>
              <CenterBar data={thingData} />
            </Card>
          </Col>
        </Row>
      </Access>
      <Row className={styles.chartWrapper}>
        <Col span={24}>
          <Card title="服务开启流程" bordered={false}>
            <Tabs>
              <TabPane
                tab={
                  <span>
                    <DeploymentUnitOutlined />
                    课后服务
                  </span>
                }
                key="1"
              >
                <Row gutter={[24, 0]} className={styles.viewWrapper}>
                  <Col span={5}>
                    <p>
                      <span>01</span>
                      基本信息管理
                    </p>
                    <img src={home1} alt="" />
                    <ul>
                      <li>
                        <Link to="/basicalSettings/schoolInfo">学校信息维护</Link>
                      </li>
                      <li>
                        <Link to="/basicalSettings/service?index=normal">课后服务协议</Link>
                      </li>
                      <li>
                        <Link to="/basicalSettings/teacherManagement">教师管理</Link>
                      </li>
                      <li>
                        <Link to="/sysSettings/asyncSettings">家长信息同步</Link>
                      </li>
                    </ul>
                  </Col>
                  <Col span={1} style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={arrow} alt="" />
                  </Col>
                  <Col span={5}>
                    <p>
                      <span>02</span>
                      时间、场地维护
                    </p>
                    <img src={home3} alt="" />
                    <ul>
                      <li>
                        <Link to="/basicalSettings/termManagement">学年学期维护</Link>
                      </li>
                      <li>
                        <Link to="/basicalSettings/periodMaintenance">时段维护</Link>
                      </li>
                      <li>
                        <Link to="/basicalSettings/roomManagement">场地维护</Link>
                      </li>
                    </ul>
                  </Col>
                  <Col span={1} style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={arrow} alt="" />
                  </Col>
                  <Col span={5}>
                    <p>
                      <span>03</span>
                      课程管理
                    </p>
                    <img src={home2} alt="" />
                    <ul>
                      <li>
                        <Link to="/courseManagements/CourseManagements">课程管理</Link>
                      </li>
                      <li>
                        <Link to="/courseManagements/classManagement">课程班管理</Link>
                      </li>
                      <li>
                        <Link to="/courseArrange">排课管理</Link>
                      </li>
                      <li>
                        <Link to="/courseManagements/classManagement">课程班开启</Link>
                      </li>
                    </ul>
                  </Col>
                  <Col span={1} style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={arrow} alt="" />
                  </Col>
                  <Col span={5}>
                    <p>
                      <span>04</span>
                      服务管理、发布
                    </p>
                    <img src={home4} alt="" />
                    <ul>
                      <li>
                        <Link to="/afterClassManagement/registration_setting">报名模式设置</Link>
                      </li>
                      <li>
                        <Link to="/afterClassManagement/class_management">配置课后服务</Link>
                      </li>
                      <li>
                        <Link to="/afterClassManagement/class_management">课后服务发布</Link>
                      </li>
                      <li>
                        <Link to="/afterClassManagement/registration_setting">缴费管理</Link>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <HighlightOutlined />
                    缤纷课堂
                  </span>
                }
                key="2"
              >
                <Row gutter={[24, 0]} className={styles.viewWrapper}>
                  <Col span={5}>
                    <p>
                      <span>01</span>
                      基本信息管理
                    </p>
                    <img src={home1} alt="" />
                    <ul>
                      <li>
                        <Link to="/basicalSettings/schoolInfo">学校信息维护</Link>
                      </li>
                      <li>
                        <Link to="/basicalSettings/service?index=service">缤纷课堂协议</Link>
                      </li>
                      <li>
                        <Link to="/basicalSettings/teacherManagement">教师管理</Link>
                      </li>
                      <li>
                        <Link to="/sysSettings/asyncSettings">家长信息同步</Link>
                      </li>
                    </ul>
                  </Col>
                  <Col span={1} style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={arrow} alt="" />
                  </Col>
                  <Col span={5}>
                    <p>
                      <span>02</span>
                      时间、场地维护
                    </p>
                    <img src={home3} alt="" />
                    <ul>
                      <li>
                        <Link to="/basicalSettings/termManagement">学年学期维护</Link>
                      </li>
                      <li>
                        <Link to="/basicalSettings/periodMaintenance">时段维护</Link>
                      </li>
                      <li>
                        <Link to="/basicalSettings/roomManagement">场地维护</Link>
                      </li>
                    </ul>
                  </Col>
                  <Col span={1} style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={arrow} alt="" />
                  </Col>
                  <Col span={5}>
                    <p>
                      <span>03</span>
                      课程管理
                    </p>
                    <img src={home2} alt="" />
                    <ul>
                      <li>
                        <Link to="/courseManagements/CourseManagements">课程管理</Link>
                      </li>
                      <li>
                        <Link to="/courseManagements/classManagement?index=2">课程班管理</Link>
                      </li>
                      <li>
                        <Link to="/courseArrange">排课管理</Link>
                      </li>
                    </ul>
                  </Col>
                  <Col span={1} style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={arrow} alt="" />
                  </Col>
                  <Col span={5}>
                    <p>
                      <span>04</span>
                      班级开班
                    </p>
                    <img src={home4} alt="" />
                    <ul>
                      <li>
                        <Link to="/courseManagements/classManagement?index=2">课程班开班</Link>
                      </li>
                      <li>
                        <Link to="/courseManagements/classManagement?index=2">开启报名</Link>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <SmileOutlined />
                    增值服务
                  </span>
                }
                key="3"
              >
                <Row gutter={[24, 0]} className={styles.viewWrapper}>
                  <Col span={7}>
                    <p>
                      <span>01</span>
                      基本信息管理
                    </p>
                    <img src={home1} alt="" />
                    <ul>
                      <li>
                        <Link to="/basicalSettings/schoolInfo">学校信息维护</Link>
                      </li>
                      <li>
                        <Link to="/basicalSettings/service?index=increment">增值服务协议</Link>
                      </li>
                      <li>
                        <Link to="/basicalSettings/termManagement">学年学期维护</Link>
                      </li>
                      <li>
                        <Link to="/sysSettings/asyncSettings">家长信息同步</Link>
                      </li>
                    </ul>
                  </Col>
                  <Col span={1} style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={arrow} alt="" />
                  </Col>
                  <Col span={7}>
                    <p>
                      <span>02</span>
                      增值服务管理
                    </p>
                    <img src={home2} alt="" />
                    <ul>
                      <li>
                        <Link to="/valueAddedServices/cateringService">服务类别配置</Link>
                      </li>
                      <li>
                        <Link to="/valueAddedServices/serviceManagement">服务管理</Link>
                      </li>
                    </ul>
                  </Col>
                  <Col span={1} style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={arrow} alt="" />
                  </Col>
                  <Col span={7}>
                    <p>
                      <span>03</span>
                      服务发布
                    </p>
                    <img src={home4} alt="" />
                    <ul>
                      <li>
                        <Link to="/valueAddedServices/serviceManagement">增值服务发布</Link>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Index;
