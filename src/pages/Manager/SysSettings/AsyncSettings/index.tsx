/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-11-22 15:12:11
 * @LastEditTime: 2021-12-10 15:51:28
 * @LastEditors: Sissle Lynn
 */
import { useModel } from 'umi';
import PageContainer from '@/components/PageContainer';
import { Button, message, Spin } from 'antd';
import { syncWechatStudents } from '@/services/after-class/upload';
import { useState } from 'react';

const AsyncSettings = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [Loading, setLoading] = useState<boolean>(false)
  /**
   * 同步家长配置
   */
  const syncDatas = async () => {
    setLoading(true)
    const params = {
      suiteID: currentUser.suiteID,
      CorpId: currentUser.CorpId,
      xxId: currentUser.xxId,
    };
    const res = await syncWechatStudents(params);
    if (res.status === 'ok') {
      setLoading(false)
      message.success('同步完成');
    } else {
      setLoading(false)
      message.warning('同步失败，请重试');
    }
  };

  return (
    <Spin spinning={Loading}>
      <PageContainer>
        <div >
          <div style={{ display: 'flex', justifyContent: 'start', verticalAlign: 'middle', lineHeight: '32px', paddingBottom: 24 }}>
            <span style={{ marginRight: 24 }}>
              同步企业微信家长通讯录信息
            </span>
            <Button
              style={{ color: '#4884ff', borderColor: '#4884ff', marginRight: '8px' }}
              onClick={syncDatas}
            >
              立即同步
            </Button>
          </div>
          <div style={{ color: '#888', lineHeight: '30px' }}>
            本功能用于帮助课后服务平台获取企微架构中的学生、家长及行政班信息。未同步到本系统中的家长将无法正常使用课后服务移动端。
          </div>
          <ul style={{ color: '#888', listStyle: 'revert', marginLeft: '-20px' }}>
            <li style={{ lineHeight: '30px' }}>首次使用课后服务平台，请点击【立即同步】按钮以获取相关信息</li>
            <li style={{ lineHeight: '30px' }}>如出现家长进入移动端后无法正常显示，请点击【立即同步】按钮进行信息同步</li>
          </ul>
        </div>
      </PageContainer>
    </Spin>
  )
}
export default AsyncSettings;
