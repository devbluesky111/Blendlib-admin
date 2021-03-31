import { useForm } from '@fuse/hooks';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	closePendingDialog,
	pendingContact
} from './store/contactsSlice';

const defaultFormState = {
	id: 0,
	name: '',
	lastName: '',
	nickname: '',
	company: '',
	jobTitle: '',
	email: '',
	phone: '',
	address: '',
	birthday: '',
	notes: '',
	password: '',
	membership: 'free',
	pending: 'no',
	status: 'on'
};

function PendingDialog(props) {
	const dispatch = useDispatch();
	const pendingDialog = useSelector(({ contactsApp }) => contactsApp.contacts.pendingDialog);

	const { form, setForm } = useForm(defaultFormState);

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (pendingDialog.data) {
			setForm({ ...pendingDialog.data });
		}
	}, [pendingDialog.data, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (pendingDialog.props.open) {
			initDialog();
		}
	}, [pendingDialog.props.open, initDialog]);

	function closeComposeDialog() {
		return dispatch(closePendingDialog());
	}

	function allowPending(event) {
		event.preventDefault();
		dispatch(pendingContact({id: form.id, membership:form.pending, type:'allow'}));
		return dispatch(closePendingDialog());
	}

	function denyPending(event) {
		event.preventDefault();
		dispatch(pendingContact({id: form.id, membership:form.pending, type:'deny'}));
		return dispatch(closePendingDialog());
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...pendingDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Membership Pending
					</Typography>
				</Toolbar>
				<div className="flex flex-col items-center justify-center pb-24">
					<Avatar className="w-96 h-96" alt="contact avatar" src={form.avatar} />
					<Typography variant="h6" color="inherit" className="pt-8">
						{form.name}
					</Typography>
				</div>
			</AppBar>
			<form noValidate className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex mt-4 mb-4">
						<span className="items-center">Are you sure to allow "{form.name}"  a "{form.pending}" membership ?</span>
					</div>
				</DialogContent>
				<DialogActions className="justify-between p-8">
					<div className="px-16">
						<Button
							variant="contained"
							color="secondary"
							onClick={allowPending}
						>
							Allow
						</Button>
					</div>
					<div className="px-16">
						<Button
							variant="contained"
							color="primary"
							onClick={denyPending}
						>
							Deny
						</Button>
					</div>
					<div className="px-16">
						<Button
							variant="contained"
							color="inherit"
							type="submit"
							onClick={closeComposeDialog}
						>
							Cancel
						</Button>
					</div>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default PendingDialog;
