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
import moment from 'moment/moment';
import React from 'react';

const defaultFormState = {
	id: '',
	title: '',
	notes: '',
	startDate: new Date(),
	dueDate: new Date(),
	completed: false,
	starred: false,
	important: false,
	deleted: false,
	labels: []
};

function TodoDialog(props) {

	const { form, handleChange } = useForm({ ...defaultFormState }); // setForm
	const startDate = moment(form.startDate).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
	const dueDate = moment(form.dueDate).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);

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
							label="Title"
							autoFocus
							name="title"
							value={form.title}
							onChange={handleChange}
							required
							variant="outlined"
						/>
					</FormControl>

					<FormControl className="mt-8 mb-16" required fullWidth>
						<TextField
							label="Notes"
							name="notes"
							multiline
							rows="6"
							value={form.notes}
							onChange={handleChange}
							variant="outlined"
						/>
					</FormControl>
					<div className="flex -mx-4">
						<TextField
							name="startDate"
							label="Start Date"
							type="datetime-local"
							className="mt-8 mb-16 mx-4"
							InputLabelProps={{
								shrink: true
							}}
							inputProps={{
								max: dueDate
							}}
							value={startDate}
							onChange={handleChange}
							variant="outlined"
						/>
						<TextField
							name="dueDate"
							label="Due Date"
							type="datetime-local"
							className="mt-8 mb-16 mx-4"
							InputLabelProps={{
								shrink: true
							}}
							inputProps={{
								min: startDate
							}}
							value={dueDate}
							onChange={handleChange}
							variant="outlined"
						/>
					</div>
				</div>
			</DialogContent>

			{true ? (
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
