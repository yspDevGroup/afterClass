/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  const { type = '' } = currentUser || {};
  return {
    isLogin: !!currentUser,
    isAdmin: Array.isArray(type)
      ? type.find((u) => ['系统管理员', '管理员'].includes(u))
      : ['系统管理员', '管理员'].includes(type),
    isTeacher: Array.isArray(type) ? type.includes('老师') : type === '老师',
    isParent: Array.isArray(type) ? type.includes('家长') : type === '家长',
    isSso: currentUser?.authType === 'sso',
    isWechat: currentUser?.authType === 'wechat',
  };
}
