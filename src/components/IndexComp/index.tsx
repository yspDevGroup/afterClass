/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-01 08:49:11
 * @LastEditTime: 2021-09-07 12:15:40
 * @LastEditors: Sissle Lynn
 */
import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import { Link, useModel } from 'umi';
import { RightOutlined } from '@ant-design/icons';
import Topbar from './Topbar';
import List from './List';
import noAnnoce from '@/assets/noAnnoce.png';
import noData from '@/assets/noData.png';
import home1 from '@/assets/home1.png';
import home2 from '@/assets/home2.png';
import home3 from '@/assets/home3.png';
import home4 from '@/assets/home4.png';
import arrow from '@/assets/arrow.png';

import styles from './index.less';
import { homePage } from '@/services/after-class/xxjbsj';
import { getXXTZGG } from '@/services/after-class/xxtzgg';
import { KHJYJG } from '@/services/after-class/khjyjg';
import { getJYJGTZGG } from '@/services/after-class/jyjgtzgg';

const Index = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [homeData, setHomeData] = useState<any>();
  const [policyData, setPolicyData] = useState<any>();
  const [annoceData, setAnnoceData] = useState<any>();

  useEffect(() => {
    async function fetchData() {
      const res = await homePage({
        XXJBSJId: currentUser?.xxId,
      });
      if (res.status === 'ok') {
        const { xxbm, kcbm, ...rest } = res.data;
        // 配置头部统计栏目数据
        setHomeData({ ...rest });
      }
      // 校内通知
      const result = await getXXTZGG({
        XXJBSJId: currentUser?.xxId,
        BT: '',
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
        pageSize: 3
      });
      if (resgetXXTZGG.status === 'ok') {
        setPolicyData(resgetXXTZGG.data?.rows);
      }
    }
    fetchData();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <Topbar data={homeData} />
      <Row gutter={[24, 24]} className={styles.listWrapper}>
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
            <List type="policy" data={annoceData} noDataImg={noAnnoce} noDataText="暂无信息" />
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
      <Row gutter={[24, 24]} className={styles.chartWrapper}>
        <Col span={24}>
          {/* extra={<Button type='primary'><img src={exportImg} style={{ marginRight: 16 }} />下载使用手册</Button>} */}
          <Card title="课后服务开启流程" bordered={false}>
            <Row gutter={[24, 0]} className={styles.viewWrapper}>
              <Col span={5}>
                <p>
                  <h1>01</h1>
                  基本信息管理
                </p>
                <img src={home1} alt="" />
                <ul>
                  <li>
                    <Link to="/basicalSettings/service">服务协议配置</Link>
                  </li>
                  <li>
                    <Link to="/basicalSettings/termManagement">学期学年维护</Link>
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
                  <h1>02</h1>
                  课程、班级管理
                </p>
                <img src={home2} alt="" />
                <ul>
                  <li>
                    <Link to="/courseManagements/CourseManagements">课程管理</Link>
                  </li>
                  <li>
                    <Link to="/classManagement">班级管理</Link>
                  </li>
                </ul>
              </Col>
              <Col span={1} style={{ display: 'flex', alignItems: 'center' }}>
                <img src={arrow} alt="" />
              </Col>
              <Col span={5}>
                <p>
                  <h1>03</h1>
                  排课管理
                </p>
                <img src={home3} alt="" />
                <ul>
                  <li>
                    <Link to="/courseScheduling">排课管理</Link>
                  </li>
                </ul>
              </Col>
              <Col span={1} style={{ display: 'flex', alignItems: 'center' }}>
                <img src={arrow} alt="" />
              </Col>
              <Col span={5}>
                <p>
                  <h1>04</h1>
                  班级、课程发布
                </p>
                <img src={home4} alt="" />
                <ul>
                  <li>
                    <Link to="/classManagement">班级发布</Link>
                  </li>
                  <li>
                    <Link to="/courseManagements/CourseManagements">课程发布</Link>
                  </li>
                </ul>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Index;
