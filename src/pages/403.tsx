/*
 * @description: 鉴权失败界面
 * @author: zpl
 * @Date: 2021-07-14 17:11:16
 * @LastEditTime: 2022-05-11 11:43:39
 * @LastEditors: Sissle Lynn
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
  const isFalg =
    !ysp_access_token || !initialState?.currentUser || !initialState?.currentUser?.student?.length;
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
              if (isFalg) {
                const loginPath = getLoginPath({
                  suiteID: ENV_clientId,
                  buildOptions: initialState?.buildOptions,
                  reLogin: 'true',
                });
                gotoLink(loginPath, true);
              } else {
                history.push('/');
              }
            }}
          >
            {isFalg ? '去登录' : '返回首页'}
          </Button>
        ) : (
          ''
        )
      }
    />
  );
};

export default NotFind;
