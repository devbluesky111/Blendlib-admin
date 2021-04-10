import { combineReducers } from '@reduxjs/toolkit';
import product from './productSlice';
import products from './productsSlice';

const reducer = combineReducers({
	products,
	product,
});

export default reducer;
