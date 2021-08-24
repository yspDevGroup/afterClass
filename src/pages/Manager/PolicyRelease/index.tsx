import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';

/**
 * 政策发布
 * @returns
 */
const index = () => {
  const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
  });
  console.log('IconFont', IconFont);

  return <div>政策发布</div>;
};

export default index;
