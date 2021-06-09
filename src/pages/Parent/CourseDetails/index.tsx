import ProForm, { ProFormRadio } from '@ant-design/pro-form';
import { Button, message, Radio, Tooltip } from 'antd';
import React, { useState } from 'react';
import './index.less';
import { statisticalList } from './mock'
console.log(statisticalList)
const CourseDetails: React.FC = () => {
  const [BJ, setBJ] = useState();
  const [XY, setXY] = useState(false);
  const [state, setstate] = useState(false);
  const onclick = () => {
    setstate(true);
  }
  const onclose = () => {
    setstate(false);
  }
  const onBJChange = (e: any) => {
    console.log('value', e.target.value)
    setBJ(e.target.value)
  }
  const onXYChange = (e: any) => {
    console.log('value', e.target.value)
    setXY(true)
  }
  const onchanges = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation()
  }
  const submit = async () => {
    if (XY === false) {
      message.info('请阅读并同意《课后服务协议》')
    }
    const data ={
      BJ:BJ,
      XY:XY
    }
    console.log('data',data)
   
  }
  return <div className='CourseDetails'>
    <div className='wrap'>
      <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=4140089676,162112200&fm=11&gp=0.jpg" alt="" />
      <p className='title'>青少年足球兴趣培训课程</p>
      <ul>
        <li>上课时段：2021.09.12—2021.11.20</li>
        <li>上课地点：本校</li>
        <li>总课时：16节</li>
      </ul>
      <p className='title'>课程简介</p>
      <p className='content'>让每一个喜爱足球的孩子拥有“出色的技术+挺拔的身姿+坚强快乐的个性”，快乐足球的本质是除了拥有出色的技术，也着重强调身体健康和身心健康相结合。<br />
        球感、带球、带球速度变化、带球变换方向、不触球假动作、触球假动作、地面球传球、地面球接停球、接球转身、护球转身、个人防守、二人配合；常用的用球方法背正面运球、脚背内侧运球、脚背外侧运球和脚内半侧运球等。</p>
      <p className='content' style={{ marginTop: '20px' }}>开设班级：</p>
      <ul className='classInformation'>
        <li>A班：上课时间：周一、三16:00—18:00，上课地点：本校室外足球场，班主任：刘某某，副班：刘大大，代课老师：刘七七。</li>
        <li>B班：上课时间：周一、三16:00—18:00，班主任：刘某某，副班：刘大大，代课老师：刘七七。</li>
        <li>C班：上课时间：周一、三16:00—18:00，班主任：刘某某，副班：刘大大，代课老师：刘七七。</li>
      </ul>
    </div>
    <div className='footer'>
      <span>￥50</span><span>/学期</span>
      <button className='btn' onClick={onclick}>立即报名</button>
    </div>
    {
      state === true ?
        <div className='payment' onClick={onclose}>
          <div onClick={onchanges}>
            <p className='title'>青少年足球兴趣培训课程</p>
            <p className='price'><span>￥50</span><span>/学期</span></p>
            <p className='title' style={{ fontSize: '14px' }}>班级</p>
            <Radio.Group onChange={onBJChange}>
              {
                statisticalList.map((value) => {
                  let text = `${value.BJMC}已有${value.BMRS}人报名，共${value.BJME}个名额`;
                  return <div className='BjInformation'>
                    <Tooltip placement="bottomLeft" title={text}>
                      <Radio.Button value={value.id}>{value.BJMC}</Radio.Button>
                    </Tooltip>
                  </div>
                })
              }
            </Radio.Group>
            <Radio 
              className='agreement'
              onChange={onXYChange}
            >  <p>我已阅读并同意<a href='www.baidu.com'>《课后帮服务协议》</a></p></Radio>
            <Button className='submit' onClick={submit}>确定并付款</Button>
          </div>
        </div> : ''
    }

  </div>;
};

export default CourseDetails

  ;
