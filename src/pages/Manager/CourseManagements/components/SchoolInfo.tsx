import React from 'react';
import { Descriptions, Drawer, Tag, Image } from 'antd';
import classes from './index.less';

/**
 * 课程详情
 * @returns
 */
const SchoolInfo = (props: { onSchoolInfoClose: any; visibleSchoolInfo: boolean; info: any }) => {
  const { onSchoolInfoClose, visibleSchoolInfo, info } = props;
  return (
    <div>
      <Drawer
        width={480}
        title="课程详情"
        placement="right"
        closable={false}
        onClose={onSchoolInfoClose}
        visible={visibleSchoolInfo}
      >
        <Descriptions className={classes.drawerstyle} layout="vertical" column={1}>
          <Descriptions.Item label="课程名称">{info?.KCMC}</Descriptions.Item>
          <Descriptions.Item label="课程类型">{info?.KHKCLX?.KCTAG}</Descriptions.Item>
          <Descriptions.Item label="课程来源">{info.SSJGLX}</Descriptions.Item>
          <Descriptions.Item label="适用年级">
            {info?.NJSJs?.map((item: any) => {
              return (
                <Tag key={item.id}>
                  {item.XD === '初中' ? `${item.NJMC}` : `${item.XD}${item.NJMC}`}
                </Tag>
              );
            })}
          </Descriptions.Item>
          <Descriptions.Item label="课程封面">
            <Image width={110} height={72} src={info?.KCTP} />
          </Descriptions.Item>
          <Descriptions.Item label="课程简介">{info?.KCMS}</Descriptions.Item>
        </Descriptions>
      </Drawer>
    </div>
  );
};

export default SchoolInfo;
