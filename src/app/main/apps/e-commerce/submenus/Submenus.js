import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import React, {useState, useEffect} from 'react';
import reducer from '../store';
import Header from './Header';
import Tables from './Tables';
import Dialog from './Dialog';
import { useForm } from '@fuse/hooks';
import Backend from '@fuse/utils/BackendUrl';
import axios from 'axios';
import FuseLoading from '@fuse/core/FuseLoading';

const defaultFormState = {
	id: '',
	m_id: '',
	name: '',
	status: '',
	order_num: '',
	created: new Date(),
};

function Menus() {

	const { form, handleChange, setForm } = useForm(defaultFormState);
	const [openDlg, setOpenDlg] = useState(false);
	const [dlgType, setDlgType] = useState('new');
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);
	const [menus, setMenus] = useState([]);

	const init = async () => {
		const res = await axios.post(Backend.URL + '/get_submenu');
		setItems(res.data);
		const resp = await axios.post(Backend.URL + '/get_menu');
		setMenus(resp.data);
	}

	const addMenuData = () => {
		if(form.m_id === '' || form.name === '' || form.order_num === '' || form.status === '') {
			alert('Please fill out the required fields!');
			return false;
		}
		axios.post(Backend.URL + '/add_submenu', form).then(function(resp){
			init();
			setOpenDlg(false);
		}).catch(function(err){
			console.log(err);
			setOpenDlg(false);
		});
	}

	const editMenuData = () => {
		if(form.name === '') {
			alert('Menu name is required!');
			return false;
		}
		axios.post(Backend.URL + '/edit_submenu', form).then(function(resp){
			init();
			setOpenDlg(false);
		}).catch(function(err){
			console.log(err);
			setOpenDlg(false);
		});
	}

	const changeStatus = (e) => {
		setForm({...form, status:e.target.value});
	}

	const changeMain = (e) => {
		setForm({...form, m_id:e.target.value});
	}

	const changeOrder = (e) => {
		setForm({...form, order_num:e.target.value});
	}

	const addMenu = () => {
		setForm(defaultFormState);
		setDlgType('new');
		setOpenDlg(true);
	}

	const editMenu = (item) => {
		setForm(item);
		setDlgType('edit');
		setOpenDlg(true);
	}

	const deleteMenu = () => {		
		axios.post(Backend.URL + '/delete_submenu', {ids:[form.id]}).then(function(resp){
			init();
			setOpenDlg(false);
		}).catch(function(err){
			console.log(err);
			setOpenDlg(false);
		});
	}

	const deleteMenus = (ids) => {		
		axios.post(Backend.URL + '/delete_submenu', {ids:ids}).then(function(resp){
			init();
			setOpenDlg(false);
		}).catch(function(err){
			console.log(err);
		});
	}

	useEffect(() => {
		init();
		setLoading(false);
	}, []);

	if (loading) {
		return <FuseLoading />;
	}

	return (
		<>
			<FusePageCarded
				classes={{
					content: 'flex',
					contentCard: 'overflow-hidden',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={<Header addMenu={addMenu} />}
				content={<Tables items={items} menus={menus} editMenu={editMenu} deleteMenus={deleteMenus} />}
				innerScroll
			/>
			<Dialog open={openDlg} type={dlgType} changeMain={changeMain} form={form} menus={menus} addMenu={addMenuData} editMenu={editMenuData} deleteMenu={deleteMenu} changeOrder={changeOrder} changeName={handleChange} changeStatus={changeStatus} closeDlg={()=>{setOpenDlg(false)}} />
		</>
	);
}

export default withReducer('eCommerceApp', reducer)(Menus);
