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
    }else{
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
          <div style={{ color: '#888' }}>
            未同步到本系统中的成员将无法正常使用移动端，系统每天凌晨自动同步一次，如需手动更新，请点击【立即同步】按钮
          </div>
        </div>
      </PageContainer>
    </Spin>
  )
}
export default AsyncSettings;
