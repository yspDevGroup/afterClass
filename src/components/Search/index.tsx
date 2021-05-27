/*
 * @description: 
 * @author: txx
 * @Date: 2021-05-24 16:33:45
 * @LastEditTime: 2021-05-26 16:17:16
 * @LastEditors: txx
 */

// import { Input, Dropdown, Button, } from 'antd';
// import type { FC } from 'react';
// import { DownOutlined } from '@ant-design/icons';
// import styles from "./index.less"


// type ISearchComponent = {
//   /** 输入框默认值 */
//   placeholder?: string,
//   /** 点击搜索图标、清除图标，或按下回车键时的回调 */
//   onSearch?: (value: any, event: any) => void
//   /** 左侧筛选的字段 */
//   fieldOne?: string;
//   /** 左侧筛选的字段 */
//   fieldTwo?: string;
//   /** 表头第一个字段选择 */
//   one?: string;
//   /** 表头第二个字段选择 */
//   two?: string;
//   /** 表头第三个字段选择 */
//   three?: string;
//   /** 判断表头是否只有search */
//   onlySearch?: boolean;
//   /** 判断表头有几个字段选择  默认是1个 */
//   HeaderFieldTitleNum?: boolean;
//   /** 第一个1下拉框的数据 */
//   overlay1?: any;
//   /** 第二个1下拉框的数据 */
//   overlay2?: any;
//   /** 第三个1下拉框的数据 */
//   overlay3?: any;
// }


// const downOneData = [
//   { oneData: "2020 - 2021", key: "1" },
//   { oneData: "2019 - 2020", key: "2" },
//   { oneData: "2018 - 2019", key: "3" },
//   { oneData: "2018 - 2019", key: "4" },

// ]
// const downTwoData = [
//   { twoData: "第一学期", key: "1" },
//   { twoData: "第二学期", key: "2" },
//   { twoData: "第三学期", key: "3" },
//   { twoData: "第四学期", key: "4" },
// ]
// const downThreeData = [
//   { threeData: "第一学期", key: "1" },
//   { threeData: "第二学期", key: "2" },
//   { threeData: "第三学期", key: "3" },
//   { threeData: "第四学期", key: "4" },
// ]
// const onClick = (value: any) => {
//   console.log(`value`, value)
// };
// const DownOneData = () => {
//   return (
//       <Menu onClick={onClick}>
//           <List
//               dataSource={downOneData}
//               renderItem={item => (
//                   <Menu.Item key={item.key}>
//                       <div style={{ textAlign: "center", margin: "8px 0px", cursor: 'pointer' }}>{item.oneData}</div>
//                   </Menu.Item>
//               )}
//           />

//       </Menu>
//   )
// };
// const DownTwoData = () => {
//   return (
//       <Menu onClick={onClick}>
//           <List
//               dataSource={downTwoData}
//               renderItem={item => (
//                   <Menu.Item key={item.key}>
//                       <div style={{ textAlign: "center", margin: "8px 0px", cursor: 'pointer' }}>{item.twoData}</div>
//                   </Menu.Item>
//               )}
//           />

//       </Menu>
//   )
// };
// const DownThreeData = () => {
//   return (
//       <Menu onClick={onClick}>
//           <List
//               dataSource={downThreeData}
//               renderItem={item => (
//                   <Menu.Item key={item.key}>
//                       <div style={{ textAlign: "center", margin: "8px 0px", cursor: 'pointer' }}>{item.threeData}</div>
//                   </Menu.Item>
//               )}
//           />

//       </Menu>
//   )
// };


// const { Search } = Input;
// const onSearch = (value: any) => console.log(value);

// const SearchComponent: FC<ISearchComponent> = (
//   { placeholder,
//     fieldOne,
//     fieldTwo,
//     one,
//     two,
//     three,
//     onlySearch,
//     HeaderFieldTitleNum,
//     overlay1,
//     overlay2,
//     overlay3,
//   }
// ) => {
//   return (
//     <div>
//       { onlySearch === true ?
//         (<div className={styles.SearchBox}>
//           <Search
//             placeholder={placeholder}
//             onSearch={onSearch}
//             style={{ width: 200 }}
//             bordered={false}
//           />
//         </div>)
//         :
//         (<div className={styles.SearchBox}>
//           {HeaderFieldTitleNum === true ?
//             (<div>
//               <div className={styles.HeaderFieldTitle}>{fieldOne}</div>
//               <div className={styles.HeaderFieldYear}>
//                 <Dropdown overlay={overlay1}>
//                   <Button>
//                     {one} <DownOutlined />
//                   </Button>
//                 </Dropdown>
//               </div>
//               <div className={styles.HeaderFieldSemester}>
//                 <Dropdown overlay={overlay2}>
//                   <Button>
//                     {two} <DownOutlined />
//                   </Button>
//                 </Dropdown>
//               </div>

//               <Search
//                 placeholder={placeholder}
//                 onSearch={onSearch}
//                 style={{ width: 200 }}
//                 bordered={false}
//               />
//             </div>
//             )
//             :
//             (<div>
//               <div>
//                 <div className={styles.HeaderFieldTitle}>{fieldOne}</div>
//                 <div className={styles.HeaderFieldYear}>
//                   <Dropdown overlay={overlay1}>
//                     <Button>
//                       {one} <DownOutlined />
//                     </Button>
//                   </Dropdown>
//                 </div>
//                 <div className={styles.HeaderFieldSemester}>
//                   <Dropdown overlay={overlay2}>
//                     <Button>
//                       {two} <DownOutlined />
//                     </Button>
//                   </Dropdown>
//                 </div>
//               </div>
//               <div className={styles.HeaderFieldSemesterTwo}>
//                 <div className={styles.HeaderFieldTitle}>{fieldTwo}</div>
//                 <div className={styles.HeaderFieldYear}>
//                   <Dropdown overlay={overlay3}>
//                     <Button>
//                       {three} <DownOutlined />
//                     </Button>
//                   </Dropdown>
//                 </div>
//               </div>

//               <Search
//                 placeholder={placeholder}
//                 onSearch={onSearch}
//                 style={{ width: 200 }}
//                 bordered={false}
//               />
//             </div>
//             )
//           }

//         </div>)
//       }

//     </div >
//   )
// }
// export default SearchComponent