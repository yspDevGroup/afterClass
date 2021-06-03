import React, { useRef, useLayoutEffect, useEffect } from 'react';
import PageContainer from '@/components/PageContainer';
import useScript from '@/utils/useScript';

const PersonalHomepage = (openid: string) => {
  const ref = useRef(null);
  useScript('http://res.wx.qq.com/open/js/jweixin-1.2.0.js');
  useScript('http://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js');
  useEffect(() => {
    if(window && window.wx){
      console.log('in---wx');
      
      window.wx.config({
        beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: '', // 必填，企业微信的corpID
        timestamp: '', // 必填，生成签名的时间戳
        nonceStr: '', // 必填，生成签名的随机串
        signature: '',// 必填，签名，见 附录-JS-SDK使用权限签名算法
        jsApiList: [] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
      }); 
    }
    if(window && window.WWOpenData){
      console.log('in---WWOpenData');
      window.WWOpenData.bind(ref.current);
    }
    console.log(window);
    
  }, [window.wx,window.WWOpenData])
  return <PageContainer>
    欢迎来到首页
    <ww-open-data ref={ref} openid={openid} />
  </PageContainer>;
};

export default PersonalHomepage;
