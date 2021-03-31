import FuseAnimate from '@fuse/core/FuseAnimate';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useDispatch } from 'react-redux';
import { openNewContactDialog } from './store/contactsSlice';

const useStyles = makeStyles(theme => ({
	listItem: {
		color: 'inherit!important',
		textDecoration: 'none!important',
		height: 40,
		width: 'calc(100% - 16px)',
		borderRadius: '0 20px 20px 0',
		paddingLeft: 24,
		paddingRight: 12,
		'&.active': {
			backgroundColor: theme.palette.secondary.main,
			color: `${theme.palette.secondary.contrastText}!important`,
			pointerEvents: 'none',
			'& .list-item-icon': {
				color: 'inherit'
			}
		},
		'& .list-item-icon': {
			marginRight: 16
		}
	}
}));

function ContactsSidebarContent(props) {

	const dispatch = useDispatch();

	const classes = useStyles(props);

	return (
		<div className="p-0 lg:p-24 lg:ltr:pr-4 lg:rtl:pl-4">
			<FuseAnimate animation="transition.slideLeftIn" delay={200}>
				<Paper className="rounded-0 shadow-none lg:rounded-8 lg:shadow">

					<div className="p-24">
						<Button
							variant="contained"
							color="primary"
							className="w-full"
							onClick={ev => dispatch(openNewContactDialog())}
						>
							New User
						</Button>
					</div>

					<List className="pt-0">
						<ListItem
							button
							component={NavLinkAdapter}
							to="/apps/contacts/all"
							activeClassName="active"
							className={classes.listItem}
						>
							<Icon className="list-item-icon text-16" color="action">
								people
							</Icon>
							<ListItemText className="truncate" primary="All users" disableTypography />
						</ListItem>
						<ListItem
							button
							component={NavLinkAdapter}
							to="/apps/contacts/pending"
							activeClassName="active"
							className={classes.listItem}
						>
							<Icon className="list-item-icon text-16" color="action">
								restore
							</Icon>
							<ListItemText className="truncate" primary="Pending users" disableTypography />
						</ListItem>
						<ListItem
							button
							component={NavLinkAdapter}
							to="/apps/contacts/restrict"
							activeClassName="active"
							className={classes.listItem}
						>
							<Icon className="list-item-icon text-16" color="action">
								star
							</Icon>
							<ListItemText className="truncate" primary="Restricted users" disableTypography />
						</ListItem>
					</List>
				</Paper>
			</FuseAnimate>
		</div>
	);
}

export default ContactsSidebarContent;
