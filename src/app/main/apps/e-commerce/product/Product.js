import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@material-ui/core/Button';
import { orange } from '@material-ui/core/colors';
import Icon from '@material-ui/core/Icon';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import Backend from '@fuse/utils/BackendUrl';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
	productImageFeaturedStar: {
		position: 'absolute',
		top: 0,
		right: 0,
		color: orange[400],
		opacity: 0
	},
	productImageUpload: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	},
	productImageItem: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		'&:hover': {
			'& $productImageFeaturedStar': {
				opacity: 0.8
			}
		},
		'&.featured': {
			pointerEvents: 'none',
			boxShadow: theme.shadows[3],
			'& $productImageFeaturedStar': {
				opacity: 1
			},
			'&:hover $productImageFeaturedStar': {
				opacity: 1
			}
		}
	}
}));

function Product(props) {
	const routeParams = useParams();
	const theme = useTheme();
	const classes = useStyles(props);
	const [tabValue, setTabValue] = useState(0);
	const [noProduct, setNoProduct] = useState(false);
	const [loading, setLoading] = useState(true);
	const [status, setStatus] = useState('new');

	const [form, setForm] = useState({
		id: 0,
		name: "",
		short_description: "",
		long_description: "",
		main_menu: 1,
		sub_menu: 1,
		free_v: "off",
		pro_v: "off",
		local_v: "off",
		p_image: "",
		featured_images: [],
		free_blend: "",
		pro_blend: "",
		local_blend: "",
		created: ""
	});
	const [menus, setMenus] = useState([]);
	const [submenus, setSubmenus] = useState([]);	

	useEffect(()=>{
		const init = async () => {
			setLoading(true);
			const res1 = await axios.post(Backend.URL + '/get_submenu');
			setSubmenus(res1.data);
			const res2 = await axios.post(Backend.URL + '/get_menu');
			setMenus(res2.data);

			if (routeParams.productId === 'new') {
				setForm({
					id: 0,
					name: "",
					short_description: "",
					long_description: "",
					main_menu: 1,
					sub_menu: 1,
					free_v: "off",
					pro_v: "off",
					local_v: "off",
					p_image: "",
					featured_images: [],
					free_blend: "",
					pro_blend: "",
					local_blend: "",
					created: ""
				});
				setStatus('new');
				setNoProduct(false);
			} else {
				const resp = await axios.post(Backend.URL + '/get_product_id', {id: routeParams.productId});
				// console.log(resp.data);
				let data = resp.data[0][0];
				if (data) {
					setForm({...data, featured_images: data.featured_images.split('|')});
					setNoProduct(false);
				} else {
					setNoProduct(true);
				}
				setStatus('old');
			}
			setLoading(false);
		}

		init();
	}, [routeParams]);

	function handleChangeTab(event, value) {
		setTabValue(value);
	}

	async function handleUploadChange(e) {
		const file = e.target.files[0];
		const name = e.target.name;
		if (!file) {
			return;
		}

		let formData = new FormData();		
		formData.append("file", file);
		formData.append("id", form.id);
		formData.append("name", name);

		const res = await axios.post(Backend.URL + '/upload', formData, {
			headers: {
			'Content-Type': 'multipart/form-data'
			}
		});

		if(res.data.file) {
			let temp = form;
			if(name === 'featured_images')
				temp[name] = res.data.file.split('|');
			else
				temp[name] = res.data.file;

			setForm({...temp});
		}

	}

	function canBeSubmitted() {
		return form.name && form.name.length > 0;
	}

	function saveProduct() {
		if(status === 'new') {
			axios.post(Backend.URL + '/add_product', form).then(function(resp){
				if(resp.data.id) {
					props.history.push(`/apps/e-commerce/products`);
				} else {
					alert('failed');
				}
			}).catch(function(err){
				console.log(err);
			});
		} else {
			axios.post(Backend.URL + '/edit_product', form).then(function(resp){
				if(resp.data.id) {
					props.history.push(`/apps/e-commerce/products`);
				} else {
					alert('failed');
				}
			}).catch(function(err){
				console.log(err);
			});
		}
	}

	function removeA(arr) {
		var what, a = arguments, L = a.length, ax;
		while (L > 1 && arr.length) {
			what = a[--L];
			while ((ax= arr.indexOf(what)) !== -1) {
				arr.splice(ax, 1);
			}
		}
		return arr;
	}

	if (noProduct) {
		return (
			<FuseAnimate delay={100}>
				<div className="flex flex-col flex-1 items-center justify-center h-full">
					<Typography color="textSecondary" variant="h5">
						There is no such product!
					</Typography>
					<Button
						className="mt-24"
						component={Link}
						variant="outlined"
						to="/apps/e-commerce/products"
						color="inherit"
					>
						Go to Products Page
					</Button>
				</div>
			</FuseAnimate>
		);
	}

	if (loading) {
		return <FuseLoading />;
	}

	return (
		<FusePageCarded
			classes={{
				toolbar: 'p-0',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={
				form && (
					<div className="flex flex-1 w-full items-center justify-between">
						<div className="flex flex-col items-start max-w-full">
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Typography
									className="flex items-center sm:mb-12"
									component={Link}
									role="button"
									to="/apps/e-commerce/products"
									color="inherit"
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">Products</span>
								</Typography>
							</FuseAnimate>

							<div className="flex items-center max-w-full">
								<FuseAnimate animation="transition.expandIn" delay={300}>
									{form.p_image ? (
										<img
											className="w-32 sm:w-48 rounded"
											src={Backend.URL + `/images/` + form.p_image}
											alt={form.name}
										/>
									) : (
										<img
											className="w-32 sm:w-48 rounded"
											src="assets/images/ecommerce/product-image-placeholder.png"
											alt={form.name}
										/>
									)}
								</FuseAnimate>
								<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="text-16 sm:text-20 truncate">
											{form.name ? form.name : 'New Product'}
										</Typography>
									</FuseAnimate>
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography variant="caption">Product Detail</Typography>
									</FuseAnimate>
								</div>
							</div>
						</div>
						<FuseAnimate animation="transition.slideRightIn" delay={300}>
							<Button
								className="whitespace-nowrap"
								variant="contained"
								color="secondary"
								disabled={!canBeSubmitted()}
								onClick={saveProduct}
							>
								Save
							</Button>
						</FuseAnimate>
					</div>
				)
			}
			contentToolbar={ status === 'new' ?
				<Tabs
					value={tabValue}
					onChange={handleChangeTab}
					indicatorColor="primary"
					textColor="primary"
					variant="scrollable"
					scrollButtons="auto"
					classes={{ root: 'w-full h-64' }}
				>
					<Tab className="h-64" label="Basic Info" />
					<Tab className="h-64" label="Membership Level" />
				</Tabs>
				:
				<Tabs
					value={tabValue}
					onChange={handleChangeTab}
					indicatorColor="primary"
					textColor="primary"
					variant="scrollable"
					scrollButtons="auto"
					classes={{ root: 'w-full h-64' }}
				>
					<Tab className="h-64" label="Basic Info" />
					<Tab className="h-64" label="Membership Level" />
					<Tab className="h-64" label="Product Image" />
					<Tab className="h-64" label="Featured Images" />
					<Tab className="h-64" label="Free Blends" />
					<Tab className="h-64" label="Pro Blends" />
					<Tab className="h-64" label="Platinum Blends" />
				</Tabs>
			}
			content={
				form && (
					<div className="p-16 sm:p-24 max-w-2xl">
						{tabValue === 0 && (
							<div>
								<TextField
									className="mt-8 mb-16"
									error={form.name === ''}
									required
									label="Name"
									autoFocus
									id="name"
									name="name"
									value={form.name}
									onChange={(e)=>{setForm({...form, name:e.target.value})}}
									variant="outlined"
									fullWidth
								/>

								<TextField
									className="mt-8 mb-16"
									id="short_description"
									name="short_description"
									onChange={(e)=>{setForm({...form, short_description:e.target.value})}}
									label="Short Description"
									type="text"
									value={form.short_description}
									multiline
									rows={3}
									variant="outlined"
									fullWidth
								/>

								<TextField
									className="mt-8 mb-16"
									id="long_description"
									name="long_description"
									onChange={(e)=>{setForm({...form, long_description:e.target.value})}}
									label="Long Description"
									type="text"
									value={form.long_description}
									multiline
									rows={7}
									variant="outlined"
									fullWidth
								/>
								
								<FormControl className="mt-16 mb-16" fullWidth required variant="outlined">
									<InputLabel htmlFor="main-menu"> Main Menu </InputLabel>
									<Select
										value={form.main_menu}
										onChange={(e)=>{setForm({...form, main_menu:e.target.value})}}
										input={
											<OutlinedInput
												labelWidth={'main-menu'.length * 9}
												name="main-menu"
												id="main-menu"
											/>
										}
									>
										{menus.map((menu) => {
											return (
												<MenuItem value={menu.id} key={menu.id}>
													<em> {menu.name} </em>
												</MenuItem>
											)
										})}
									</Select>
								</FormControl>
								
								<FormControl className="mt-16 mb-16" fullWidth required variant="outlined">
									<InputLabel htmlFor="sub-menu"> Sub Menu </InputLabel>
									<Select
										value={form.sub_menu}
										onChange={(e)=>{setForm({...form, sub_menu:e.target.value})}}
										input={
											<OutlinedInput
												labelWidth={'sub-menu'.length * 9}
												name="sub-menu"
												id="sub-menu"
											/>
										}
									>
										{submenus.filter(submenu => form.main_menu === submenu.m_id).map((sm) => {
											return (
												<MenuItem value={sm.id} key={sm.id}>
													<em> {sm.name} </em>
												</MenuItem>
											)
										} )}
									</Select>
								</FormControl>

							</div>
						)}
						{tabValue === 1 && (
							<div>
								<FormControl component="fieldset">
									<FormLabel component="legend">Membership Accessibility</FormLabel>
										<FormGroup>
											<FormControlLabel
											control={<Switch checked={form.free_v === 'on' ? true : false} name="free" />}
											label="Free Verion"
											onClick={()=>{setForm({...form, free_v: form.free_v === 'on' ? 'off' : 'on'})}}
											/>
											<FormControlLabel
											control={<Switch checked={form.pro_v === 'on' ? true : false} name="pro" />}
											label="Pro Version"
											onClick={()=>{setForm({...form, pro_v: form.pro_v === 'on' ? 'off' : 'on'})}}
											/>
											<FormControlLabel
											control={<Switch checked={form.local_v === 'on' ? true : false} name="local" />}
											label="Platinum Version"
											onClick={()=>{setForm({...form, local_v: form.local_v === 'on' ? 'off' : 'on'})}}
											/>
										</FormGroup>
									<FormHelperText>Be careful</FormHelperText>
								</FormControl>
							</div>
						)}
						{tabValue === 2 && (
							<div>
								<div className="flex justify-center sm:justify-start flex-wrap -mx-8">
									{form.p_image ? 
										<div
											tabIndex={0}
											className='flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden outline-none shadow hover:shadow-lg'
										>
											<Icon 
												className={classes.productImageFeaturedStar} 
												style={{color: '#333', opacity: 1, cursor: 'pointer'}} 
												onClick={()=>{setForm({...form, p_image: ''})}}
											>
												delete
											</Icon>
											<img className="max-w-none w-auto h-full" src={Backend.URL + `/images/` + form.p_image} alt={form.p_image} />
										</div>
									:
										<label
											htmlFor="button-file"
											className={clsx(
												classes.productImageUpload,
												'flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow hover:shadow-lg'
											)}
										>
											<input
												accept="image/*"
												className="hidden"
												id="button-file"
												type="file"
												name="p_image"
												onChange={handleUploadChange}
											/>
											<Icon fontSize="large" color="action">
												cloud_upload
											</Icon>
										</label>
									}
								</div>
							</div>
						)}
						{tabValue === 3 && (
							<div>
								<div className="flex justify-center sm:justify-start flex-wrap -mx-8">
									<label
										htmlFor="button-file"
										className={clsx(
											classes.productImageUpload,
											'flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow hover:shadow-lg'
										)}
									>
										<input
											accept="image/*"
											className="hidden"
											id="button-file"
											type="file"
											name="featured_images"
											onChange={handleUploadChange}
										/>
										<Icon fontSize="large" color="action">
											cloud_upload
										</Icon>
									</label>
									{form.featured_images.map((fm, _i) => {
										return (
											<div key={_i}>
											{fm ? 
												<div
													tabIndex={0}
													className='flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden outline-none shadow hover:shadow-lg'
												>
													<Icon 
														className={classes.productImageFeaturedStar} 
														style={{color: '#333', opacity: 1, cursor: 'pointer'}}
														onClick={()=>{setForm({...form, featured_images: removeA(form.featured_images, fm)})}}
													>
														delete
													</Icon>
													<img className="max-w-none w-auto h-full" src={Backend.URL + `/images/` + fm} alt={fm} />
												</div>
												: <></>
											}
											</div>
										);
									})}
								</div>
							</div>
						)}
						{tabValue === 4 && (
							<div>
								<div className="flex justify-center sm:justify-start flex-wrap -mx-8">
									{form.free_blend ? 
										<>
											<div
												tabIndex={0}
												className='flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden outline-none shadow hover:shadow-lg'
											>
												<Icon 
													className={classes.productImageFeaturedStar} 
													style={{color: '#333', opacity: 1, cursor: 'pointer'}} 
													onClick={()=>{setForm({...form, free_blend: ''})}}
												>
													delete
												</Icon>
												<Icon fontSize="large" color="action">
													cloud_download
												</Icon>
											</div>
											<p className="text-center">{form.free_blend}</p>
										</>
									:
										<label
											htmlFor="button-file"
											className={clsx(
												classes.productImageUpload,
												'flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow hover:shadow-lg'
											)}
										>
											<input
												className="hidden"
												id="button-file"
												type="file"
												name="free_blend"
												onChange={handleUploadChange}
											/>
											<Icon fontSize="large" color="action">
												cloud_upload
											</Icon>
										</label>
									}
								</div>
							</div>
						)}
						{tabValue === 5 && (
							<div>
								<div className="flex justify-center sm:justify-start flex-wrap -mx-8">
									{form.pro_blend ? 
										<>
											<div
												tabIndex={0}
												className='flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden outline-none shadow hover:shadow-lg'
											>
												<Icon 
													className={classes.productImageFeaturedStar} 
													style={{color: '#333', opacity: 1, cursor: 'pointer'}} 
													onClick={()=>{setForm({...form, pro_blend: ''})}}
												>
													delete
												</Icon>
												<Icon fontSize="large" color="action">
													cloud_download
												</Icon>
											</div>
											<p className="text-center">{form.pro_blend}</p>
										</>
									:
										<label
											htmlFor="button-file"
											className={clsx(
												classes.productImageUpload,
												'flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow hover:shadow-lg'
											)}
										>
											<input
												className="hidden"
												id="button-file"
												type="file"
												name="pro_blend"
												onChange={handleUploadChange}
											/>
											<Icon fontSize="large" color="action">
												cloud_upload
											</Icon>
										</label>
									}
								</div>
							</div>
						)}
						{tabValue === 6 && (
							<div>
								<div className="flex justify-center sm:justify-start flex-wrap -mx-8">
									{form.local_blend ? 
										<>
											<div
												tabIndex={0}
												className='flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden outline-none shadow hover:shadow-lg'
											>
												<Icon 
													className={classes.productImageFeaturedStar} 
													style={{color: '#333', opacity: 1, cursor: 'pointer'}} 
													onClick={()=>{setForm({...form, local_blend: ''})}}
												>
													delete
												</Icon>
												<Icon fontSize="large" color="action">
													cloud_download
												</Icon>
											</div>
											<p className="text-center">{form.local_blend}</p>
										</>
									:
										<label
											htmlFor="button-file"
											className={clsx(
												classes.productImageUpload,
												'flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow hover:shadow-lg'
											)}
										>
											<input
												className="hidden"
												id="button-file"
												type="file"
												name="local_blend"
												onChange={handleUploadChange}
											/>
											<Icon fontSize="large" color="action">
												cloud_upload
											</Icon>
										</label>
									}
								</div>
							</div>
						)}
					</div>
				)
			}
			innerScroll
		/>
	);
}

export default withRouter(Product);
