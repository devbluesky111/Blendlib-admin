import React from 'react';

const CampaignsAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/campaigns',
			component: React.lazy(() => import('./CampaignsApp'))
		}
	]
};

export default CampaignsAppConfig;
