/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-09 10:32:04
 * @,@LastEditTime: ,: 2021-07-02 11:06:28
 * @,@LastEditors: ,: Please set LastEditors
 */
import React, { useEffect, useState } from 'react';
import ListComp from '@/components/ListComponent';
import styles from "./index.less";
import Pagina from '../../components/Pagination/Pagination';
import type { ListData, ListItem } from '@/components/ListComponent/data';
import moment from 'moment';

const defaultList: ListData = {
  type: 'onlyList',
  cls: 'onlyOneList',
  list: []
}
const Notice = (props: any) => {
  const { notification } = props.location.state;
  const [annoceList, setAnnoceList] = useState<ListData>(defaultList);
  useEffect(() => {
    const data: ListItem[] = [].map.call(notification, (record: any) => {
      const listdata: ListItem = {
        title: record.BT,
        link: `/parent/home/notice/announcement?listid=${record.id}`,
        titleRight: {
          text: moment(record.updatedAt).format('YYYY-MM-DD'),
        },
      };
      return listdata;
    });
    const newData = { ...defaultList };
    newData.list = data;
    setAnnoceList(newData);
  }, [notification])

  return (
    <div className={styles.NoticeBox}>
      <ListComp listData={annoceList} />
      <Pagina total={5} />
    </div>
  )
}

export default Notice