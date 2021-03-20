import { useForm } from '@fuse/hooks';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const defaultFormState = {
	id: '',
	name: '',
	status: '',
	created: new Date(),
};

function TodoDialog(props) {

	const { form, handleChange } = useForm({ ...defaultFormState }); // setForm

	function closeTodoDialog() {
		props.closeDlg();
	}

	return (
		<Dialog
			open={props.open}
			onClose={closeTodoDialog}
			fullWidth
			maxWidth="sm"
			classes={{
				paper: 'rounded-8'
			}}
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Menu
					</Typography>
				</Toolbar>
			</AppBar>

			<DialogContent classes={{ root: 'p-0' }}>

				<div className="px-16 sm:px-24">
					<FormControl className="mt-8 mb-16" required fullWidth>
						<TextField
							label="Name"
							autoFocus
							name="name"
							value={form.name}
							onChange={handleChange}
							required
							variant="outlined"
						/>
					</FormControl>
				</div>
			</DialogContent>

			{props.type === 'new' ? (
				<DialogActions className="justify-between p-8">
					<div className="px-16">
						<Button
							variant="contained"
							color="primary"
							onClick={() => {
								;
							}}
						>
							Add
						</Button>
					</div>
				</DialogActions>
			) : (
				<DialogActions className="justify-between p-8">
					<div className="px-16">
						<Button
							variant="contained"
							color="primary"
							onClick={() => {
								;
							}}
						>
							Save
						</Button>
					</div>
					<IconButton
						className="min-w-auto"
						onClick={() => {
							;
						}}
					>
						<Icon>delete</Icon>
					</IconButton>
				</DialogActions>
			)}
		</Dialog>
	);
}

export default TodoDialog;
