
import PageContain from '@/components/PageContainer';
import ProTable, { EditableProTable } from '@ant-design/pro-table';
import { Select, Space,Form, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, useModel } from 'umi';
import { getKHFWBJXSbm } from '@/services/after-class/bjsj';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { queryXNXQList } from '@/services/local-services/xnxq';
import SearchLayout from '@/components/Search/Layout';
import { getAllXQSJ } from '@/services/after-class/xqsj';
import React from 'react';
import { CreateXXJTPZ, getAllXXJTPZ } from '@/services/after-class/xxjtpz';
import moment from 'moment';
import { values } from '@antv/util';



type selectType = { label: string; value: string };
const { Option } = Select;


type DataSourceType = {
	id: React.Key;
	name: string;
	KSRQ?: string;
	JSRQ?: string;
	type?: string;

};

const RegistrationSetting = () => {

	// 校区
	const [campusId, setCampusId] = useState<string>();
	const [campusData, setCampusData] = useState<any[]>();
	// 学年学期
	const [curXNXQId, setCurXNXQId] = useState<string | undefined>(undefined);
	const [curXNXQData, setCurXNXQData] = useState<any[]>();
	const actionRef = useRef<ActionType>();
	const actionRefEdit = useRef<ActionType>();
	const { initialState } = useModel('@@initialState');
	const { currentUser } = initialState || {};
	const [JFLX,setJFLX]=useState<number>(0);
	const [dataSource, setDataSource] = useState<DataSourceType[]>();
	const [initDataSource, setInitDataSource] = useState<DataSourceType[]>();
	const [formRef] = Form.useForm();

	const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
	const [loading,setLoading] =useState<boolean>(false);
	
	//获取学年学期
	const getXNXQ = async () => {
		const result = await queryXNXQList(currentUser?.xxId);
		if (result?.current) {
			setCurXNXQId(result?.current?.id);
			setCurXNXQData(result?.data);
		}
	}

	const getCampusData = async () => {
		const res = await getAllXQSJ({
			XXJBSJId: currentUser?.xxId,
		});
		if (res?.status === 'ok') {
			const arr = res?.data?.map((item: any) => {
				return {
					label: item.XQMC,
					value: item.id,
				};
			});
			if (arr?.length) {
				let id = arr?.find((item: any) => item.label === '本校')?.value;
				if (!id) {
					id = arr[0].value;
				}
				setCampusId(id);
			}
			setCampusData(arr);
		}
	};
	useEffect(() => {
		getXNXQ();
		getCampusData()
	}, []);

	const onCampusChange = (value: any) => {
		setCampusId(value);
		// actionRef.current?.reload();
	};
	const onJFLXChange=(value: number)=>{
		setJFLX(value);
	}

	// 学年学期筛选
	const onXNXQChange = (value: string) => {
		curXNXQData?.forEach((item: any) => {
			if (item.id === value) {
				setCurXNXQId(value);
				// actionRef.current?.reloadAndRest();
			}
		})
	}
	const columns: ProColumns<any>[] = [
		{
			title: '序号',
			dataIndex: 'index',
			valueType: 'index',
			width: 58,
			align: 'center',
		},
		{
			title: '名称',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
			width: 100,
			formItemProps: {
				rules: [
					{
						required: true,
						message: '请输入名称',
					}
				]
			}
		},
		{
			title: '开始日期',
			dataIndex: 'KSRQ',
			key: 'KSRQ',
			align: 'center',
			width: 150,
			valueType: 'date',
			formItemProps: {
				rules: [
					{
						required: true,
						type:'date',
						message: '请选择开始日期',
					}
				]
			}
		},
		{
			title: '结束日期',
			dataIndex: 'JSRQ',
			key: 'JSRQ',
			align: 'center',
			width: 150,
			valueType: 'date',
			formItemProps: {
				rules: [
					{
						required: true,
						type:'date',
						message: '请选择结束日期',
					}
				]
			}
		},
		{
			title: '缴费类型',
			dataIndex: 'type',
			key: 'type',
			align: 'center',
			width: 80,
			valueType: 'select',
			fieldProps: {
				options: [
					{
						label: '按月',
						value: 0,
					}, 
					{
						label: '按时段',
						value: 1,
					}
				]
			},
			formItemProps: {
				rules: [
					{
						required: true,
						type:'number',
						message: '请选择缴费类型',
					}
				]
			},
			editable: false
		},

		{
			title: '操作',
			valueType: 'option',
			align: 'center',
			width: 150,
			render: (_, record, _v,action) => { 
				return (<Space>
				 <a
					key="editable"
					onClick={() => {
						// console.log('action',action);
						action?.startEditable?.(record.id);
					}}
      >
        编辑
      </a>
					<a>删除</a>
				</Space>);
			},
		},
	];


	// 获取排课时间配置
	const getDetail = async () => {
		setLoading(true);
		const res = await getAllXXJTPZ({
			XNXQId: curXNXQId,
			XQSJId: campusId,
		});
		if (res.status === 'ok') {
			if (res.data?.length === 0) {
				setinitDetail();
			}else{
				const { sjpzstr }=res.data?.[0]
				if(sjpzstr){
					const str=JSON.parse(sjpzstr);
					if(str?.length){
					
						if(str?.length){
							const arr=str.filter((item: any)=>item.type===JFLX);
							setDataSource(arr);
						}
						setInitDataSource(str);
					}
				}
				setLoading(false);
			}
		}
	}
	const getTimeString = (value: any) => {
		if (value) {
			return moment(value).format('YYYY-MM-DD');
		}
		return '';
	}
	const setDetail = async (value: any) => {
		if (value) {
			setLoading(true);
			const str = JSON.stringify(value);
			const res = await CreateXXJTPZ({
				XQSJId: campusId,
				XNXQId: curXNXQId,
				sjpzstr: str,
			})
			if (res.status === 'ok') {
				getDetail();
				setLoading(false);
			}
		}
	}
	// 初始化 按月配置 时段数据
	const setinitDetail = () => {
		const fwb = curXNXQData?.find((item: any) => item.id === curXNXQId);
	
		if(fwb){
			const arr: any = [];
			let KSRQ = new Date(fwb.KSRQ);
			const JSRQ = new Date(fwb.JSRQ);
			while (KSRQ < JSRQ) {
				const tempJSRQ = new Date(KSRQ.getFullYear(), KSRQ.getMonth() + 1, 0);//本月最后一天
				arr.push({ KSRQ: getTimeString(KSRQ), type: 0, JSRQ: getTimeString(tempJSRQ), id: (Math.random() * 1000000).toFixed(0), name: `${(moment(KSRQ).month())+1}月` })
				if (KSRQ.getMonth() < 11) {
					KSRQ = new Date(KSRQ.setMonth(KSRQ.getMonth() + 1));
					KSRQ = new Date(KSRQ.setDate(1))
				} else if (KSRQ.getMonth() === 11) {
					KSRQ = new Date(KSRQ.setFullYear(KSRQ.getFullYear() + 1))
					KSRQ = new Date(KSRQ.setMonth(0))
					KSRQ = new Date(KSRQ.setDate(1))
				}
			}
			if (KSRQ.getMonth() === JSRQ.getMonth() && KSRQ < JSRQ) {
				//月份相同，补充该月份的记录
				arr.push({ KSRQ: getTimeString(KSRQ), type: 0, JSRQ: getTimeString(JSRQ), id: (Math.random() * 1000000).toFixed(0), name: `${(moment(KSRQ).month())+1}月` })
			}
			console.log('arr', arr);
			setDetail(arr);
		}
	}
	
	

	useEffect(() => {
		if (campusId && curXNXQId) {
			getDetail()
		}
	}, [campusId, curXNXQId])
	useEffect(() => {
		if(initDataSource?.length){
			const arr=initDataSource.filter((item: any)=>item.type===JFLX);
			setDataSource(arr);
		}
		
	}, [JFLX]);

	const	onEditTableChange=( editableRows: DataSourceType[])=>{
		console.log('editableRows',editableRows);
		
		if(editableRows?.length&&initDataSource?.length){
			const initarr=[...initDataSource];
			editableRows.forEach((item: DataSourceType)=>{
				if(! initarr.some((v: DataSourceType)=>item.id===v.id)){
					initarr.push(item);
				}else{
					initarr.forEach((v: DataSourceType)=>{
						if(v.id===item.id){
							// eslint-disable-next-line no-param-reassign
							v = item;
						}
					})
				}
			})
			console.log('initarr',initarr);
			setDetail(initarr);
		}
		// initDataSource?.forEach
	}




	return (
		<div>
			<PageContain>
				<Spin spinning={loading}>
				{/* <ProTable<any>
					actionRef={actionRef}
					columns={columns}
					rowKey="id"
					pagination={{
						showQuickJumper: true,
						pageSize: 10,
						defaultCurrent: 1,
					}}
					request={async (param) => {
						// 表单搜索项会从 params 传入，传递给后端接口。
						console.log('=============')
						if (curXNXQId && campusId) {
							const obj = {
								XXJBSJId: currentUser?.xxId,
								NJId: NjId ? [NjId] : undefined,
								BJSJId: BJId,
								XNXQId: curXNXQId,
								page: param.current,
								pageSize: param.pageSize,
								XQSJId: campusId,
							};
							const res = await getKHFWBJXSbm(obj);
							console.log('res-------', res);
							if (res.status === 'ok') {
								return {
									data: res.data.rows,
									success: true,
									total: res.data.count,
								};
							}
						}
						return [];
					}}
					options={{
						setting: false,
						fullScreen: false,
						density: false,
						reload: false,
					}}
					search={false}
					headerTitle={
						<SearchLayout>
							<div>
								<label htmlFor="grade">校区名称：</label>
								<Select value={campusId} placeholder="请选择" onChange={onCampusChange}>
									{campusData?.map((item: any) => {
										return <Option value={item.value}>{item.label}</Option>;
									})}
								</Select>
							</div>
							<div>
								<label htmlFor="grade">学年学期：</label>
								<Select value={curXNXQId} placeholder="请选择" onChange={onXNXQChange}>
									{curXNXQData?.map((item: any) => {
										return <Option value={item.id}>{`${item.XN}-${item.XQ}`}</Option>;
									})}
								</Select>
							</div>


						</SearchLayout>
					}
				/> */}

				<EditableProTable<DataSourceType>
					rowKey="id"
					actionRef={actionRefEdit}
					// maxLength={5}
					recordCreatorProps={
						JFLX===1?{
							position:'top',
							record: (value: any) => ({ id: (Math.random() * 1000000).toFixed(0),  type: 1, ...value }),
						}:false
					}
					options={{
						setting: false,
						fullScreen: false,
						density: false,
						reload: false,
					}}
					search={false}
					headerTitle={
						<SearchLayout>
							<div>报名时间设置</div>
							<div>
								<label htmlFor="grade">校区：</label>
								<Select value={campusId} placeholder="请选择" onChange={onCampusChange}>
									{campusData?.map((item: any) => {
										return <Option value={item.value}>{item.label}</Option>;
									})}
								</Select>
							</div>
							<div>
								<label htmlFor="grade">学年学期：</label>
								<Select value={curXNXQId} placeholder="请选择" onChange={onXNXQChange}>
									{curXNXQData?.map((item: any) => {
										return <Option value={item.id}>{`${item.XN}-${item.XQ}`}</Option>;
									})}
								</Select>
							</div>
							<div>
								<label htmlFor="grade">类型：</label>
								<Select value={JFLX} placeholder="请选择" onChange={onJFLXChange}>
								<Option value={0}>按月</Option>;
								<Option value={1}>按时段</Option>;	
								</Select>
							</div>

						</SearchLayout>
					}
					columns={columns}
					// request={async () => ({
					// 	data: defaultData,
					// 	total: 3,
					// 	success: true,
					// })}
					value={dataSource}
					onChange={onEditTableChange}
					editable={{
						type: 'single',
						form: formRef,
						editableKeys: editableKeys,
						onSave: async (rowKey, data, row) => {
							console.log(rowKey, data, row);
							// await waitTime(2000);
						},
						// actionRender: (row, config, dom) => [dom.save, dom.cancel]
						onChange:(value: any)=>{
							console.log('value',value)
							setEditableRowKeys(value);
						} 
					}}
				/>
				</Spin>
			</PageContain>
		</div>
	)
}

export default RegistrationSetting
