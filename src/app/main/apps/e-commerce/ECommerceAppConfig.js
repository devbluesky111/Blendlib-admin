import React from 'react';
import { Redirect } from 'react-router-dom';

const ECommerceAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/apps/e-commerce/products/:productId',
			component: React.lazy(() => import('./product/Product'))
		},
		{
			path: '/apps/e-commerce/products',
			component: React.lazy(() => import('./products/Products'))
		},
		{
			path: '/apps/e-commerce/submenu',
			component: React.lazy(() => import('./submenus/Submenus'))
		},
		{
			path: '/apps/e-commerce/menu',
			component: React.lazy(() => import('./menus/Menus'))
		},
		{
			path: '/apps/e-commerce',
			component: () => <Redirect to="/apps/e-commerce/products" />
		}
	]
};

export default ECommerceAppConfig;
