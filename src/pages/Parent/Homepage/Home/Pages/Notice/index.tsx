import React, { useEffect, useState } from 'react';
import ListComp from '@/components/ListComponent';
import styles from "./index.less";
import noData from '@/assets/noTzgg.png';
import Pagina from '../../components/Pagination/Pagination';
import type { ListData, ListItem } from '@/components/ListComponent/data';
import moment from 'moment';
import Nodata from '@/components/Nodata';
import GoBack from '@/components/GoBack';


const defaultList: ListData = {
  type: 'onlyList',
  cls: 'onlyOneList',
  list: [],
}
const Notice = (props: any) => {
  const { notification } = props.location.state;
  const [annoceList, setAnnoceList] = useState<ListData>(defaultList);
  const [pages, setPages] = useState<number>(1);
  useEffect(() => {
    if (notification && notification.length) {
      const data: ListItem[] = [];
      for (let i = 0; i < notification.length; i += 1) {
        const listdata: ListItem = {
          title: notification[i].BT,
          link: `/parent/home/notice/announcement?listid=${notification[i].id}&index=all`,
          titleRight: {
            text: moment(notification[i].updatedAt).format('YYYY-MM-DD'),
          },
        };
        if (i >= ((pages - 1) * 10) && i < pages * 10) {
          data.push(listdata)
        }
      }
      const newData = { ...defaultList };
      newData.list = data;
      setAnnoceList(newData);
    }
  }, [notification, pages])

  return (
    <>
      <GoBack title={'公告'} onclick='/parent/home?index=index' />
      {notification && notification.length ? <div className={styles.NoticeBox}>
        <ListComp listData={annoceList} />
        <Pagina total={notification.length} setPages={setPages} />
      </div> : <Nodata imgSrc={noData} desc='暂无公告' />}</>
  )
}

export default Notice