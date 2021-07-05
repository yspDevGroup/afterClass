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
  const [pages, setPages] = useState<number>(1);
  useEffect(() => {
    const data: ListItem[] = [];
    for (let i = 0; i < notification.length; i += 1) {
      const listdata: ListItem = {
        title: notification[i].BT,
        link: `/parent/home/notice/announcement?listid=${notification[i].id}`,
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
  }, [notification, pages])

  return (
    <div className={styles.NoticeBox}>
      <ListComp listData={annoceList} />
      <Pagina total={notification.length} setPages={setPages} />
    </div>
  )
}

export default Notice