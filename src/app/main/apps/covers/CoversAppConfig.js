import React from 'react';
import { Redirect } from 'react-router-dom';

const CoversAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/apps/covers/images/:coverId',
			component: React.lazy(() => import('./CoverDetail'))
		},
		{
			path: '/apps/covers/images',
			component: React.lazy(() => import('./CoversApp'))
		},
		{
			path: '/apps/covers',
			component: () => <Redirect to="/apps/covers/images" />
		}
	]
};

export default CoversAppConfig;
