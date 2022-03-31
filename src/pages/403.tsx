/*
 * @description: 鉴权失败界面
 * @author: zpl
 * @Date: 2021-07-14 17:11:16
 * @LastEditTime: 2022-03-31 23:18:02
 * @LastEditors: zpl
 */
import { history, useModel } from 'umi';
import { Button, Result } from 'antd';
import { getLoginPath, getOauthToken, getPageQuery, gotoLink } from '@/utils/utils';

const authType = localStorage.getItem('authType') || 'none';

const NotFind = () => {
  const { initialState } = useModel('@@initialState');
  const query = getPageQuery();
  const { title, message, btnTXT, goto } = query;
  const { ysp_access_token } = getOauthToken();
  return (
    <Result
      status="403"
      // title="抱歉，您无权访问此页面。"
      subTitle={
        <>
          <span>{title || '抱歉，您无权访问此页面。'}</span>
          {message && <div>{message}</div>}
        </>
      }
      extra={
        btnTXT && goto ? (
          <Button
            type="primary"
            onClick={() => {
              const url = decodeURIComponent(Array.isArray(goto) ? goto[0] : goto);
              if (url.startsWith('http')) {
                (window.top || window).location.href = url;
              } else {
                history.push(url);
              }
            }}
          >
            {btnTXT}
          </Button>
        ) : authType !== 'wechat' ? (
          <Button
            type="primary"
            onClick={() => {
              if (!ysp_access_token || !initialState?.currentUser) {
                const loginPath = getLoginPath({
                  suiteID: initialState?.buildOptions?.clientId || '',
                  buildOptions: initialState?.buildOptions,
                  reLogin: 'true',
                });
                gotoLink(loginPath, true);
              } else {
                history.push('/');
              }
            }}
          >
            {!ysp_access_token || !initialState?.currentUser ? '去登录' : '返回首页'}
          </Button>
        ) : (
          ''
        )
      }
    />
  );
};

export default NotFind;
