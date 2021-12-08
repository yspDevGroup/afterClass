/* eslint-disable @typescript-eslint/no-unused-expressions */
/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-11-22 15:12:11
 * @LastEditTime: 2021-12-07 13:35:34
 * @LastEditors: Sissle Lynn
 */
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Card, Col, InputNumber, Row, Switch } from 'antd';
import PageContainer from '@/components/PageContainer';
import { createXXSPPZ, getXXSPPZ } from '@/services/after-class/xxsppz';

import styles from './index.less';

const AuditSettings = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  /** 教师请假是否审批 */
  const [tLeave, setTLeave] = useState<boolean>(true);
  /** 教师代课是否审批 */
  const [supply, setSupply] = useState<boolean>(true);
  /** 教师调课是否审批 */
  const [adjust, setAdjust] = useState<boolean>(true);
  /** 教师补签是否审批 */
  const [resign, setResign] = useState<boolean>(true);
  /** 教师补签日期是否可编辑 */
  const [edit, setEdit] = useState<boolean>(false);
  const [start, setStart] = useState<number>(20);
  const [end, setEnd] = useState<number>(25);
  /**
   * 新增或者更新系统审批配置
   * type: 更新参数类型
   * val: 更新参数值
   */
  const updateSettings = async (type?: string, val?: any) => {
    await createXXSPPZ({
      JSQJ: type === 'TLeave' && val ? val : tLeave,
      XSQJ: false,
      JSDK: type === 'Supply' && val ? val : supply,
      JSTK: type === 'Adjust' && val ? val : adjust,
      XSTK: true,
      XSTF: true,
      XXJBSJId: currentUser.xxId,
      JSBQ: type === 'Resign' && val ? val : resign,
      JSBQ_KSRQ: type === 'start' && val ? val.toString() : start.toString(),
      JSBQ_JSRQ: type === 'end' && val ? val.toString() : end.toString(),
    });
  };
  useEffect(() => {
    (async () => {
      const res = await getXXSPPZ({
        xxId: currentUser.xxId
      });
      if (res.status === 'ok' && res.data) {
        const { JSQJ, JSDK, JSTK, JSBQ, JSBQ_KSRQ, JSBQ_JSRQ, } = res.data;
        setTLeave(JSQJ!);
        setSupply(JSDK!);
        setAdjust(JSTK!);
        setResign(JSBQ!);
        JSBQ_KSRQ ? setStart(Number(JSBQ_KSRQ)) : '';
        JSBQ_JSRQ ? setEnd(Number(JSBQ_JSRQ)) : '';
      } else {
        updateSettings();
      }
    })()
  }, []);

  return (
    <PageContainer>
      <div className={styles.wrapperCard} >
        <Row gutter={24}>
          <Col span={12}>
            <div>
              <h3>请假流程</h3>
              <Row gutter={24}>
                <Col span={12}>
                  <Card title="教师请假" bordered={false} extra={<Switch checked={tLeave} onChange={(checked) => {
                    setTLeave(checked);
                    updateSettings('TLeave', checked);
                  }} />}>
                    <p className={tLeave ? 'active' : ''}>开启时：教师请假需管理员审批</p>
                    <p className={!tLeave ? 'active' : ''}>关闭时：教师请假，系统自动审批，无需管理员操作</p>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="学生请假" bordered={false} extra={<Switch checked={false} disabled />} >
                    <p className='active'>学生请假无需审批，此设置项不可更改</p>
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <h3>调代课流程</h3>
              <Row gutter={24}>
                <Col span={12}>
                  <Card title="教师代课" bordered={false} extra={<Switch checked={supply} onChange={(checked) => {
                    setSupply(checked);
                    updateSettings('Supply', checked);
                  }} />}>
                    <p className={supply ? 'active' : ''}>开启时：教师代课需管理员审批</p>
                    <p className={!supply ? 'active' : ''}>关闭时：教师发起申请，代课教师同意后，系统自动审批，无需管理员操作</p>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="教师调课" bordered={false} extra={<Switch checked={adjust} onChange={(checked) => {
                    setAdjust(checked);
                    updateSettings('Adjust', checked);
                  }} />} >
                    <p className={adjust ? 'active' : ''}>开启时：教师调课需管理员审批</p>
                    <p className={!adjust ? 'active' : ''}>关闭时：教师发起调课，系统自动审批，无需管理员操作</p>
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <h3>退课退款流程</h3>
              <Row gutter={24}>
                <Col span={12}>
                  <Card title="学生退课" bordered={false} extra={<Switch checked disabled />}>
                    <p className='active'>学生退课，管理员必须审批，此设置项不可更改</p>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="学生退款" bordered={false} extra={<Switch checked disabled />} >
                    <p className='active'>学生退款，管理员必须审批，此设置项不可更改</p>
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <h3>教师补签流程</h3>
              <Row gutter={24}>
                <Col span={12}>
                  <Card title="教师补签" bordered={false} extra={<Switch checked={resign} onChange={(checked) => {
                    setResign(checked);
                    updateSettings('Resign', checked);
                  }} />}>
                    <p className={resign ? 'active' : ''}>开启时：教师补签需管理员审批</p>
                    <p className={!resign ? 'active' : ''}>关闭时：教师发起补签，系统自动审批，无需管理员操作</p>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="补签时段设置" bordered={false} extra={<Switch checked={edit} onChange={(checked) => {
                    setEdit(checked);
                  }} />}>
                    <p className={edit ? 'active' : ''}>
                      每月
                      <InputNumber
                        disabled={!edit}
                        size='small'
                        min={1}
                        max={31}
                        value={start}
                        bordered={false}
                        onChange={(value) => {
                          setStart(value);
                          updateSettings('start', value);
                        }}
                      />日到
                      <InputNumber
                        disabled={!edit}
                        size='small'
                        min={1}
                        max={31}
                        value={end}
                        bordered={false}
                        onChange={(value) => {
                          setEnd(value);
                          updateSettings('end', value);
                        }}
                      />日
                    </p>
                    {end > 28 ? <p>如果当前月不足{end}天，则补签结束时间为当前月最后一天</p> : ''}
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </PageContainer>
  )
}
export default AuditSettings;
