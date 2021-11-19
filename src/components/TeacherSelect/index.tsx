/*
 * @Author: your name
 * @Date: 2021-11-15 13:41:03
 * @LastEditTime: 2021-11-19 12:08:22
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \afterClass\src\components\TeacherSelect\index.tsx
 */

import { getAllJZGJBSJ } from '@/services/after-class/jzgjbsj';
import { TreeSelect } from 'antd';
import React, { useState, useEffect } from 'react';
import { getTeacherByClassId } from '@/services/after-class/khkcsj';
import WWOpenDataCom from '@/components/WWOpenDataCom';

type TeacherSelectProps = {
  xxId: string;
  multiple: boolean;
  value?: string | string[];
  kcId?: string | undefined; // 如果是机构课程的话 请求机构的教师
  type: number; // 1 学校老师 2机构老师 3 机构和学校老师
  onChange: any;
  disabled?: boolean; // 禁用
};

const TeacherSelect = (props: TeacherSelectProps) => {
  const { multiple, value, type, kcId, xxId, onChange, disabled } = props;

  const [xxTeacher, setXXTeacher] = useState<any>();
  const [JGTeacher, setJGTeacher] = useState<any>();
  const [treeData, setTreeData] = useState<any>();

  const getLable = (GH: string) => {
    if (GH !== null && GH.length > 4) {
      return `~${GH.substring(GH.length - 4)}`;
    } else {
      return `~ ${GH}`;
    }
  };

  const getTeacherList = async () => {
    const response = await getAllJZGJBSJ({
      XXJBSJId: xxId,
      page: 0,
      pageSize: 0,
    });
    if (response.status === 'ok') {
      const data: any = {
        title: '',
        value: '0-0',
        key: '0-0',
        checkable: false,
        disableCheckbox: true,
        selectable: false,
        children: [],
      };

      response.data?.rows?.forEach((item: any, index: number) => {
        if (index === 0) {
          data.title = item.XXMC;
          item.XM = '未知';
        }
        const label =
          item.XM === '未知' && item.WechatUserId ? (
            <WWOpenDataCom
              type="userName"
              openid={item.WechatUserId}
              style={{ display: 'inline' }}
            />
          ) : (
            item.XM
          );
        data.children.push({
          title: (
            <>
              <>{label}</>
              <>{getLable(item.GH)}</>
            </>
          ),
          value: item.id,
          key: item.id,
          WechatUserId: item.WechatUserId,
        });
      });

      setXXTeacher(data);
      // console.log('学校', data);
    }
  };
  const getJgTeacher = async () => {
    const res = await getTeacherByClassId({
      KHKCSJId: kcId,
      pageSize: 0,
      page: 0,
    });
    if (res.status === 'ok') {
      const { rows } = res?.data;
      //   const teacherOption: { label: string | JSX.Element; value: string; WechatUserId?: string }[] =[];
      const data: any = {
        title: '',
        value: '0-1',
        key: '0-1',
        checkable: false,
        disableCheckbox: true,
        selectable: false,
        children: [],
      };
      rows?.forEach(
        (
          item: { XM: string; WechatUserId: string; id: any; KHJYJG: any; GH: string },
          index: number,
        ) => {
          if (index === 0) {
            data.title = item.KHJYJG?.QYMC;
          }
          // 兼顾企微
          const label =
            item.XM === '未知' && item.WechatUserId ? (
              <WWOpenDataCom type="userName" openid={item.WechatUserId} />
            ) : (
              item.XM
            );
          data.children.push({
            title: (
              <>
                <>{label}</>
                <>{getLable(item.GH)}</>
              </>
            ),
            value: item.id,
            key: item.id,
            WechatUserId: item.WechatUserId,
          });
        },
      );

      console.log('机构', data);
      setJGTeacher(data);
    }
  };

  useEffect(() => {
    getTeacherList();
    //   getJgTeacher();
  }, []);

  useEffect(() => {
    if (kcId) {
      getJgTeacher();
    } else {
      setJGTeacher(undefined);
    }
  }, [kcId]);

  useEffect(() => {
    if (type === 1 && xxTeacher) {
      setTreeData([xxTeacher]);
    } else if (type === 2) {
      if (kcId && JGTeacher) {
        setTreeData([JGTeacher]);
      } else {
        setTreeData([]);
      }
    } else if (type === 3 && kcId && xxTeacher) {
      if (!JGTeacher) {
        setTreeData([xxTeacher]);
      } else {
        setTreeData([JGTeacher, xxTeacher]);
      }
    }
  }, [xxTeacher, JGTeacher, type]);

  return (
    <div>
      <TreeSelect
        treeDefaultExpandedKeys={['0-0', '0-1']}
        disabled={disabled}
        treeData={treeData}
        multiple={multiple}
        value={value}
        onChange={onChange}
        treeCheckable={multiple}
        showSearch
        placeholder="选择教师"
        style={{
          width: '100%',
        }}
      />
    </div>
  );
};
export default TeacherSelect;
