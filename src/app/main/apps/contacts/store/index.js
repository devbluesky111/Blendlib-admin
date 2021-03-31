import { combineReducers } from '@reduxjs/toolkit';
import contacts from './contactsSlice';

const reducer = combineReducers({
	contacts
});

export default reducer;
