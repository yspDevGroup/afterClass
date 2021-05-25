/*
 * @description: 
 * @author: txx
 * @Date: 2021-05-24 16:33:45
 * @LastEditTime: 2021-05-25 09:14:00
 * @LastEditors: txx
 */

import { Input, Dropdown, Button, Menu } from 'antd';
import type { FC } from 'react';
import { DownOutlined } from '@ant-design/icons';
import styles from "./index.less"

type ISearchComponent = {
  /** 输入框默认值 */
  placeholder?: string,
  /** 可以点击清除图标删除内容 */
  allowClear?: boolean,
  /** 点击搜索图标、清除图标，或按下回车键时的回调 */
  onSearch?: (value: any, event: any) => void
  /** 左侧筛选的字段 */
  field?: string;
  /** 年份选择 */
  year?: string;
  /** 学期选择 */
  semester?: string;
  /** 判断表头是否只有search */
  onlySearch: boolean;
}
const DownYear = (
  <Menu >
    <Menu.Item key="1" >
      2020-2021
    </Menu.Item>
    <Menu.Item key="2" >
      2019-2020
    </Menu.Item>
    <Menu.Item key="3" >
      2018-2019
    </Menu.Item>
  </Menu>
);
const DownSemester = (
  <Menu >
    <Menu.Item key="1" >
      第一学期
    </Menu.Item>
    <Menu.Item key="2" >
      第二学期
    </Menu.Item>
    <Menu.Item key="3" >
      第三学期
    </Menu.Item>
  </Menu>
);
const { Search } = Input;
const onSearch = (value: any) => console.log(value);



const SearchComponent: FC<ISearchComponent> = (
  { placeholder,
    field,
    year,
    semester,
    onlySearch 
  }) => {
  return (
    <div>
      { onlySearch === true ?
        (<div className={styles.SearchBox}>
          <Search
            placeholder={placeholder}
            allowClear
            onSearch={onSearch}
            style={{ width: 200 }}
          />
        </div>)
        :
        (<div className={styles.SearchBox}>
          <div className={styles.HeaderFieldTitle}>{field}</div>
          <div className={styles.HeaderFieldYear}>
            <Dropdown overlay={DownYear}>
              <Button>
                {year} <DownOutlined />
              </Button>
            </Dropdown>
          </div>
          <div className={styles.HeaderFieldSemester}>
            <Dropdown overlay={DownSemester}>
              <Button>
                {semester} <DownOutlined />
              </Button>
            </Dropdown>
          </div>

          <Search
            placeholder={placeholder}
            allowClear
            onSearch={onSearch}
            style={{ width: 200 }}
          />
        </div>)
      }

    </div >
  )
}
export default SearchComponent