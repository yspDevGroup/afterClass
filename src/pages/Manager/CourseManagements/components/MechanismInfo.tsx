import { Descriptions, Drawer } from 'antd';
import React from 'react';
import classes from './index.less';

/**
 * 机构详情
 * @returns
 */
const MechanismInfo = (props: {
  onMechanismInfoClose: any;
  visibleMechanismInfo: boolean;
  info: any;
}) => {
  const { onMechanismInfoClose, visibleMechanismInfo, info } = props;
  const { KHJYJG } = info;
  return (
    <Drawer
      title="机构详情"
      placement="right"
      closable={false}
      width={480}
      onClose={onMechanismInfoClose}
      visible={visibleMechanismInfo}
    >
      <Descriptions className={classes.drawerstyle} layout="vertical" column={1}>
        <Descriptions.Item label="企业名称">{KHJYJG?.QYMC}</Descriptions.Item>
        <Descriptions.Item label="组织机构代码">{KHJYJG?.ZZJGDM}</Descriptions.Item>
        <Descriptions.Item label="法人代表姓名">{KHJYJG?.FRDBXM}</Descriptions.Item>
        <Descriptions.Item label="企业机构地址">{KHJYJG?.QYJGDZ}</Descriptions.Item>
        <Descriptions.Item label="机构服务范围">{KHJYJG?.JGFWFW}</Descriptions.Item>
        <Descriptions.Item label="机构简介">{KHJYJG?.JGJJ}</Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default MechanismInfo;
