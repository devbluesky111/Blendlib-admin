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
import Backend from '@fuse/utils/BackendUrl';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
	coverImageFeaturedStar: {
		position: 'absolute',
		top: 0,
		right: 0,
		color: orange[400],
		opacity: 0
	},
	coverImageUpload: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	},
	coverImageItem: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		'&:hover': {
			'& $coverImageFeaturedStar': {
				opacity: 0.8
			}
		},
		'&.featured': {
			pointerEvents: 'none',
			boxShadow: theme.shadows[3],
			'& $coverImageFeaturedStar': {
				opacity: 1
			},
			'&:hover $coverImageFeaturedStar': {
				opacity: 1
			}
		}
	}
}));

function CoverDetail(props) {
	const routeParams = useParams();
	const theme = useTheme();
	const classes = useStyles(props);
	const [tabValue, setTabValue] = useState(0);	
	const [noProduct, setNoProduct] = useState(false);
	const [loading, setLoading] = useState(true);
	const [status, setStatus] = useState('new');

	const [form, setForm] = useState({
		id: 0,
		title: "",
		subtitle: "",
		cover_image: "",
		created: ""
	});	

	useEffect(()=>{
		const init = async () => {
			setLoading(true);

			if (routeParams.coverId === 'new') {
				setForm({
					id: 0,
					title: "",
					subtitle: "",
					cover_image: "",
					created: ""
				});
				setStatus('new');
				setNoProduct(false);
			} else {
				const resp = await axios.post(Backend.URL + '/get_cover_id', {id: routeParams.coverId}, { withCredentials: true, headers: {"Access-Control-Allow-Origin": "*"} });
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

		const res = await axios.post(Backend.URL + '/upload_cover', formData, { withCredentials: true, headers: {"Access-Control-Allow-Origin": "*", 'Content-Type': 'multipart/form-data'} } );

		if(res.data.file) {
			let temp = form;
			temp[name] = res.data.file
			setForm({...temp});
		}
	}

	function canBeSubmitted() {
		return form.title && form.title.length > 0;
	}

	function saveCover() {
		if(status === 'new') {
			axios.post(Backend.URL + '/add_cover', form, { withCredentials: true, headers: {"Access-Control-Allow-Origin": "*"} }).then(function(resp){
				if(resp.data.id) {
					props.history.push(`/apps/covers/images`);
				} else {
					alert('failed');
				}
			}).catch(function(err){
				console.log(err);
			});
		} else {
			axios.post(Backend.URL + '/edit_cover', form, { withCredentials: true, headers: {"Access-Control-Allow-Origin": "*"} }).then(function(resp){
				if(resp.data.id) {
					props.history.push(`/apps/covers/images`);
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
						There is no such Images!
					</Typography>
					<Button
						className="mt-24"
						component={Link}
						variant="outlined"
						to="/apps/covers/images"
						color="inherit"
					>
						Go to Cover Slides Page
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
									to="/apps/covers/images"
									color="inherit"
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">Slides</span>
								</Typography>
							</FuseAnimate>

							<div className="flex items-center max-w-full">
								<FuseAnimate animation="transition.expandIn" delay={300}>
									{form.cover_image ? (
										<img
											className="w-32 sm:w-48 rounded"
											src={Backend.URL + `/coverimages/` + form.cover_image}
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
											{form.title ? form.title : 'New Cover Slide'}
										</Typography>
									</FuseAnimate>
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography variant="caption">Cover Slide Detail</Typography>
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
								onClick={saveCover}
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
				<Tab className="h-64" label="Cover Slide" />
			</Tabs>
			}
			content={
				form && (
					<div className="p-16 sm:p-24 max-w-2xl">
						{tabValue === 0 && (
							<div>
								<TextField
									className="mt-8 mb-16"
									error={form.title === ''}
									required
									label="Title"
									autoFocus
									id="title"
									name="title"
									value={form.title}
									onChange={(e)=>{setForm({...form, title:e.target.value})}}
									variant="outlined"
									fullWidth
								/>

								<TextField
									className="mt-8 mb-16"
									id="subtitle"
									label="Sub Title"
									name="subtitle"
									value={form.subtitle}
									onChange={(e)=>{setForm({...form, subtitle:e.target.value})}}
									type="text"
									variant="outlined"
									fullWidth
								/>
							</div>
						)}
						{tabValue === 1 && (
							<div className="flex justify-center sm:justify-start flex-wrap -mx-8">
								{form.cover_image ? 
									<div
										tabIndex={0}
										className='flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden outline-none shadow hover:shadow-lg'
									>
										<Icon 
											className={classes.coverImageFeaturedStar} 
											style={{color: '#333', opacity: 1, cursor: 'pointer'}} 
											onClick={()=>{setForm({...form, cover_image: ''})}}
										>
											delete
										</Icon>
										<img className="max-w-none w-auto h-full" src={Backend.URL + `/coverimages/` + form.cover_image} alt={form.cover_image} />
									</div>
								:
									<label
										htmlFor="button-file"
										className={clsx(
											classes.coverImageUpload,
											'flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow hover:shadow-lg'
										)}
									>
										<input
											accept="image/*"
											className="hidden"
											id="button-file"
											type="file"
											name="cover_image"
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

export default withRouter(CoverDetail);
