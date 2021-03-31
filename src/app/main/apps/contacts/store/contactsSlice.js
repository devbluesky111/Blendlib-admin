import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import Backend from '@fuse/utils/BackendUrl';

export const getContacts = createAsyncThunk('contactsApp/contacts/getContacts', async (routeParams, { getState }) => {
	routeParams = routeParams || getState().contactsApp.contacts.routeParams;
	const response = await axios.post(Backend.URL + '/get_all_users', {
		params: routeParams.id
	});
	const data = await response.data[0];

	return { data, routeParams };
});

export const addContact = createAsyncThunk(
	'contactsApp/contacts/addContact',
	async (contact, { dispatch, getState }) => {
		const response = await axios.post(Backend.URL + '/add_user', contact);
		const data = await response.data;

		dispatch(getContacts());

		return data;
	}
);

export const updateContact = createAsyncThunk(
	'contactsApp/contacts/updateContact',
	async (contact, { dispatch, getState }) => {
		const response = await axios.post(Backend.URL + '/edit_user', contact);
		const data = await response.data;

		dispatch(getContacts());

		return data;
	}
);

export const removeContact = createAsyncThunk(
	'contactsApp/contacts/removeContact',
	async (contactId, { dispatch, getState }) => {
		await axios.post(Backend.URL + '/delete_user', { ids : [contactId] });

		dispatch(getContacts());

		return contactId;
	}
);

export const removeContacts = createAsyncThunk(
	'contactsApp/contacts/removeContacts',
	async (contactIds, { dispatch, getState }) => {
		await axios.post(Backend.URL + '/delete_user', { ids: contactIds });

		dispatch(getContacts());

		return contactIds;
	}
);

export const toggleRestrict = createAsyncThunk(
	'contactsApp/contacts/toggleRestrict',
	async (restrict, { dispatch, getState }) => {
		const response = await axios.post(Backend.URL + '/toggle_restrict', restrict);
		const data = await response.data;

		dispatch(getContacts());

		return data;
	}
);

export const pendingContact = createAsyncThunk(
	'contactsApp/contacts/pendingContact',
	async (pending, { dispatch, getState }) => {
		const response = await axios.post(Backend.URL + '/pending_solve', pending);
		const data = await response.data;

		dispatch(getContacts());

		return data;
	}
);

const contactsAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactsById } = contactsAdapter.getSelectors(
	state => state.contactsApp.contacts
);

const contactsSlice = createSlice({
	name: 'contactsApp/contacts',
	initialState: contactsAdapter.getInitialState({
		searchText: '',
		routeParams: {},
		contactDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		},
		pendingDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		setContactsSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		},
		openNewContactDialog: (state, action) => {
			state.contactDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewContactDialog: (state, action) => {
			state.contactDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditContactDialog: (state, action) => {
			state.contactDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditContactDialog: (state, action) => {
			state.contactDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		},
		openPendingDialog: (state, action) => {
			state.pendingDialog = {
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closePendingDialog: (state, action) => {
			state.pendingDialog = {
				props: {
					open: false
				},
				data: null
			};
		}
	},
	extraReducers: {
		[updateContact.fulfilled]: contactsAdapter.upsertOne,
		[addContact.fulfilled]: contactsAdapter.addOne,
		[removeContacts.fulfilled]: (state, action) => contactsAdapter.removeMany(state, action.payload),
		[removeContact.fulfilled]: (state, action) => contactsAdapter.removeOne(state, action.payload),
		[getContacts.fulfilled]: (state, action) => {
			const { data, routeParams } = action.payload;
			contactsAdapter.setAll(state, data);
			state.routeParams = routeParams;
			state.searchText = '';
		}
	}
});

export const {
	setContactsSearchText,
	openNewContactDialog,
	closeNewContactDialog,
	openEditContactDialog,
	closeEditContactDialog,
	openPendingDialog,
	closePendingDialog
} = contactsSlice.actions;

export default contactsSlice.reducer;
