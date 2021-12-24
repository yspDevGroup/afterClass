/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    canAdmin: !!currentUser, // currentUser && (currentUser.type === '管理员' || currentUser.type === '系统管理员'),
  };
}
