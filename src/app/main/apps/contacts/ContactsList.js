import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseUtils from '@fuse/utils';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContactsMultiSelectMenu from './ContactsMultiSelectMenu';
import ContactsTable from './ContactsTable';
import { openEditContactDialog, openPendingDialog, toggleRestrict, selectContacts } from './store/contactsSlice';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Badge from '@material-ui/core/Badge';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

function ContactsList(props) {
	const dispatch = useDispatch();
	const contacts = useSelector(selectContacts);
	const searchText = useSelector(({ contactsApp }) => contactsApp.contacts.searchText);

	const [filteredData, setFilteredData] = useState(null);

	const columns = React.useMemo(
		() => [
			{
				Header: ({ selectedFlatRows }) => {
					const selectedRowIds = selectedFlatRows.map(row => row.original.id);

					return (
						selectedFlatRows.length > 0 && <ContactsMultiSelectMenu selectedContactIds={selectedRowIds} />
					);
				},
				accessor: 'avatar',
				Cell: () => {
					return <Avatar className="mx-8" />;
				},
				className: 'justify-center',
				width: 64,
				sortable: false
			},
			{
				Header: 'First Name',
				accessor: 'name',
				className: 'font-bold',
				sortable: true
			},
			{
				Header: 'Last Name',
				accessor: 'lastName',
				className: 'font-bold',
				sortable: true
			},
			{
				Header: 'Membership',
				accessor: 'membership',
				sortable: true,
				Cell: ({ row }) => (
					<Badge
						color={row.original.membership === 'free' ? 'primary' : row.original.membership === 'pro' ? 'secondary' : row.original.membership === 'platinum' ? 'error' : ''}
						badgeContent={row.original.membership}
						style={{paddingLeft:'30px'}}
					/>
				)
			},
			{
				Header: 'Restrict Status',
				accessor: 'status',
				sortable: true,
				Cell: ({ row }) => (
					<div className="flex items-center">
						<FormGroup>
							<FormControlLabel
							control={<Switch checked={row.original.status === 'on' ? true : false} name="status" />}
							label="Status"
							onClick={ev => {
								ev.stopPropagation();
								dispatch(toggleRestrict({id: row.original.id, status: row.original.status}));
							}}
							/>
						</FormGroup>
					</div>
				)
			},
			{
				Header: 'Email',
				accessor: 'email',
				sortable: true
			},
			{
				Header: 'Password',
				accessor: 'password',
				sortable: true
			},
			{
				Header: 'Action Pending',
				accessor: 'action',
				sortable: false,
				Cell: ({ row }) => (
					<>
					{row.original.pending === 'no' ?
						<></>
					:
						<div
						onClick={e=>{
							e.stopPropagation();
							dispatch(openPendingDialog(row.original));
						}}
						>
							<IconButton
								className="p-0"
								aria-haspopup="true"
							>
								<Icon>more_horiz</Icon>
							</IconButton>
							<span style={row.original.pending === 'pro' ? {color: '#61dafb'} : {color: '#f44336'}}> {row.original.pending} ?</span>
						</div>
					}
					</>
				)
			}
		],
		[dispatch]
	);

	useEffect(() => {
		function getFilteredArray(entities, _searchText) {
			if (_searchText.length === 0) {
				return contacts;
			}
			return FuseUtils.filterArrayByString(contacts, _searchText);
		}

		if (contacts) {
			setFilteredData(getFilteredArray(contacts, searchText));
		}
	}, [contacts, searchText]);

	if (!filteredData) {
		return null;
	}

	if (filteredData.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					There are no contacts!
				</Typography>
			</div>
		);
	}

	return (
		<FuseAnimate animation="transition.slideUpIn" delay={300}>
			<ContactsTable
				columns={columns}
				data={filteredData}
				onRowClick={(ev, row) => {
					if (row) {
						dispatch(openEditContactDialog(row.original));
					}
				}}
			/>
		</FuseAnimate>
	);
}

export default ContactsList;
