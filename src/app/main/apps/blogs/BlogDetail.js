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
import Backend from '@fuse/utils/BackendUrl';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
	blogImageFeaturedStar: {
		position: 'absolute',
		top: 0,
		right: 0,
		color: orange[400],
		opacity: 0
	},
	blogImageUpload: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	},
	blogImageItem: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		'&:hover': {
			'& $blogImageFeaturedStar': {
				opacity: 0.8
			}
		},
		'&.featured': {
			pointerEvents: 'none',
			boxShadow: theme.shadows[3],
			'& $blogImageFeaturedStar': {
				opacity: 1
			},
			'&:hover $blogImageFeaturedStar': {
				opacity: 1
			}
		}
	}
}));

function BlogDetail(props) {
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
		title: "",
		short_description: "",
		long_description: "",
		image: "",
		created: ""
	});	

	useEffect(()=>{
		const init = async () => {
			setLoading(true);

			if (routeParams.blogId === 'new') {
				setForm({
					id: 0,
					name: "",
					title: "",
					short_description: "",
					long_description: "",
					image: "",
					created: ""
				});
				setStatus('new');
				setNoProduct(false);
			} else {
				const resp = await axios.post(Backend.URL + '/get_blog_id', {id: routeParams.blogId}, { withCredentials: true, headers: {"Access-Control-Allow-Origin": "*"} });
				let data = resp.data[0];
				if (data) {
					setForm({...data});
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

		const res = await axios.post(Backend.URL + '/upload_blog', formData, { withCredentials: true, headers: {"Access-Control-Allow-Origin": "*", 'Content-Type': 'multipart/form-data'} } );

		if(res.data.file) {
			let temp = form;
			temp[name] = res.data.file;
			setForm({...temp});
		}
	}

	function canBeSubmitted() {
		return form.name && form.name.length > 0;
	}

	function saveBlog() {
		if(status === 'new') {
			axios.post(Backend.URL + '/add_blog', form, { withCredentials: true, headers: {"Access-Control-Allow-Origin": "*"} }).then(function(resp){
				if(resp.data.id) {
					props.history.push(`/apps/blogs/posts`);
				} else {
					alert('failed');
				}
			}).catch(function(err){
				console.log(err);
			});
		} else {
			axios.post(Backend.URL + '/edit_blog', form, { withCredentials: true, headers: {"Access-Control-Allow-Origin": "*"} }).then(function(resp){
				if(resp.data.id) {
					props.history.push(`/apps/blogs/posts`);
				} else {
					alert('failed');
				}
			}).catch(function(err){
				console.log(err);
			});
		}
	}

	if (noProduct) {
		return (
			<FuseAnimate delay={100}>
				<div className="flex flex-col flex-1 items-center justify-center h-full">
					<Typography color="textSecondary" variant="h5">
						There is no such Blogs!
					</Typography>
					<Button
						className="mt-24"
						component={Link}
						variant="outlined"
						to="/apps/blogs/posts"
						color="inherit"
					>
						Go to Blog Posts Page
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
									to="/apps/blogs/images"
									color="inherit"
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">Blogs</span>
								</Typography>
							</FuseAnimate>

							<div className="flex items-center max-w-full">
								<FuseAnimate animation="transition.expandIn" delay={300}>
									{form.image ? (
										<img
											className="w-32 sm:w-48 rounded"
											src={Backend.URL + `/blogs/` + form.image}
											alt={form.title}
										/>
									) : (
										<img
											className="w-32 sm:w-48 rounded"
											src="assets/images/ecommerce/product-image-placeholder.png"
											alt={form.title}
										/>
									)}
								</FuseAnimate>
								<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="text-16 sm:text-20 truncate">
											{form.title ? form.title : 'New Blog Posts'}
										</Typography>
									</FuseAnimate>
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography variant="caption">Blog Post Detail</Typography>
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
								onClick={saveBlog}
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
				<Tab className="h-64" label="Blog Image" />
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
									type="text"
									variant="outlined"
									fullWidth
								/>
								<TextField
									className="mt-8 mb-16"
									label="Title"
									id="title"
									name="title"
									value={form.title}
									onChange={(e)=>{setForm({...form, title:e.target.value})}}
									type="text"
									variant="outlined"
									fullWidth
								/>
								<TextField
									className="mt-8 mb-16"
									id="short_description"
									label="Short Description"
									name="short_description"
									value={form.short_description}
									onChange={(e)=>{setForm({...form, short_description:e.target.value})}}
									type="text"
									multiline
									rows={7}
									variant="outlined"
									fullWidth
								/>
								<TextField
									className="mt-8 mb-16"
									id="long_description"
									label="Long Description"
									name="long_description"
									value={form.long_description}
									onChange={(e)=>{setForm({...form, long_description:e.target.value})}}
									type="text"
									multiline
									rows={7}
									variant="outlined"
									fullWidth
								/>
							</div>
						)}
						{tabValue === 1 && (
							<div className="flex justify-center sm:justify-start flex-wrap -mx-8">
								{form.image ? 
									<div
										tabIndex={0}
										className='flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden outline-none shadow hover:shadow-lg'
									>
										<Icon 
											className={classes.blogImageFeaturedStar} 
											style={{color: '#333', opacity: 1, cursor: 'pointer'}} 
											onClick={()=>{setForm({...form, image: ''})}}
										>
											delete
										</Icon>
										<img className="max-w-none w-auto h-full" src={Backend.URL + `/blogs/` + form.image} alt={form.image} />
									</div>
								:
									<label
										htmlFor="button-file"
										className={clsx(
											classes.blogImageUpload,
											'flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow hover:shadow-lg'
										)}
									>
										<input
											accept="image/*"
											className="hidden"
											id="button-file"
											type="file"
											name="image"
											onChange={handleUploadChange}
										/>
										<Icon fontSize="large" color="action">
											cloud_upload
										</Icon>
									</label>
								}
							</div>
						)}
					</div>
				)
			}
			innerScroll
		/>
	);
}

export default withRouter(BlogDetail);
