import FuseAnimate from '@fuse/core/FuseAnimate';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import Backend from '@fuse/utils/BackendUrl';
import axios from 'axios';
import swal from 'sweetalert';

function CampaignsApp(props) {

	const [form, setForm] = useState({
		id: 0,
		subject: "",
		textPart: "",
		htmlPart: "",
		created: ""
	});

	function canBeSubmitted() {
		return form.subject && form.subject.length > 0;
	}

	function sendCampaign() {
		axios.post(Backend.URL + '/add_campaign', form, { withCredentials: true, headers: {"Access-Control-Allow-Origin": "*"} }).then(function(resp){
			if(resp.data.status === "success") {
				setForm({...form, subject:"",textPart:"",htmlPart:""});
				swal("Sent!", "Your email marketing campaign has been sent to all the customers and prospects successfully!", "success");
			} else {
				swal("Oops!", "Something went wrong!", "error");
			}
		}).catch(function(err){
			console.log(err);
			swal("Oops!", "Something went wrong!", "error");
		});
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
							<div className="flex items-center max-w-full">
								<FuseAnimate animation="transition.expandIn" delay={300}>
									<img
										className="w-32 sm:w-48 rounded"
										src="assets/images/ecommerce/product-image-placeholder.png"
										alt="placeholder_image"
									/>
								</FuseAnimate>
								<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="text-16 sm:text-20 truncate">
											{form.subject ? form.subject : 'Email Marketing Campaign'}
										</Typography>
									</FuseAnimate>
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography variant="caption">Email Campaign</Typography>
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
								onClick={sendCampaign}
							>
								Send
							</Button>
						</FuseAnimate>
					</div>
				)
			}
			contentToolbar={
				<Tabs
					value={0}
					indicatorColor="primary"
					textColor="primary"
					variant="scrollable"
					scrollButtons="auto"
					classes={{ root: 'w-full h-64' }}
				>
					<Tab className="h-64" label="Email Campaign Info" />
				</Tabs>
			}
			content={
				form && (
					<div className="p-16 sm:p-24 max-w-2xl">
                        <div>
                            <TextField
                                className="mt-8 mb-16"
                                id="subject"
                                label="Subject"
                                name="subject"
                                value={form.subject}
                                onChange={(e)=>{setForm({...form, subject:e.target.value})}}
                                type="text"
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                className="mt-8 mb-16"
                                id="textPart"
                                label="TextPart"
                                name="textPart"
                                value={form.textPart}
                                onChange={(e)=>{setForm({...form, textPart:e.target.value})}}
                                type="text"
                                multiline
                                rows={3}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                className="mt-8 mb-16"
                                id="htmlPart"
                                label="HtmlPart"
                                name="htmlPart"
                                value={form.htmlPart}
                                onChange={(e)=>{setForm({...form, htmlPart:e.target.value})}}
                                type="text"
                                multiline
                                rows={7}
                                variant="outlined"
                                fullWidth
                            />
                        </div>
					</div>
				)
			}
			innerScroll
			
		/>
	);
}

export default CampaignsApp;