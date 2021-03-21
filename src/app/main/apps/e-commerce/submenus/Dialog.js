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
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import React from 'react';

function TodoDialog(props) {

	return (
		<Dialog
			open={props.open}
			onClose={props.closeDlg}
			fullWidth
			maxWidth="sm"
			classes={{
				paper: 'rounded-8'
			}}
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Sub Menu
					</Typography>
				</Toolbar>
			</AppBar>

			<DialogContent classes={{ root: 'p-0' }}>

				<div className="px-16 sm:px-24">
					<FormControl className="mt-16 mb-16" required fullWidth>
						<TextField
							label="Name"
							autoFocus
							name="name"
							value={props.form.name}
							onChange={props.changeName}
							required
							variant="outlined"
						/>
					</FormControl>
					<FormControl className="mt-16 mb-16" fullWidth required variant="outlined">
						<InputLabel htmlFor="main-menu"> Main Menu </InputLabel>
						<Select
							value={props.form.m_id}
							onChange={props.changeMain}
							input={
								<OutlinedInput
									labelWidth={'category'.length * 9}
									name="category"
									id="main-menu"
								/>
							}
						>
							{props.menus.map((menu) => {
								return (
									<MenuItem value={menu.id} key={menu.id}>
										<em> {menu.name} </em>
									</MenuItem>
								)
							})}
						</Select>
					</FormControl>
					<FormControl className="mt-16 mb-16" required fullWidth>
						<TextField
							label="Order"
							name="order_nam"
							value={props.form.order_num}
							onChange={props.changeOrder}
							required
							variant="outlined"
							type='number'
						/>
					</FormControl>
					<FormControl className="mt-16 mb-16" fullWidth required variant="outlined">
						<InputLabel htmlFor="menu-status"> Status </InputLabel>
						<Select
							value={props.form.status}
							onChange={props.changeStatus}
							input={
								<OutlinedInput
									labelWidth={'category'.length * 9}
									name="category"
									id="menu-status"
								/>
							}
						>
							<MenuItem value="on">
								<em> On </em>
							</MenuItem>
							<MenuItem value="off">
								<em> Off </em>
							</MenuItem>
						</Select>
					</FormControl>
				</div>
			</DialogContent>

			{props.type === 'new' ? (
				<DialogActions className="justify-between p-8">
					<div className="px-16">
						<Button
							variant="contained"
							color="primary"
							onClick={props.addMenu}
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
							onClick={props.editMenu}
						>
							Save
						</Button>
					</div>
					<IconButton
						className="min-w-auto"
						onClick={props.deleteMenu}
					>
						<Icon>delete</Icon>
					</IconButton>
				</DialogActions>
			)}
		</Dialog>
	);
}

export default TodoDialog;
