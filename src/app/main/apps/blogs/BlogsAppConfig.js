import React from 'react';
import { Redirect } from 'react-router-dom';

const BlogsAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/apps/blogs/posts/:blogId',
			component: React.lazy(() => import('./BlogDetail'))
		},
		{
			path: '/apps/blogs/posts',
			component: React.lazy(() => import('./BlogsApp'))
		},
		{
			path: '/apps/blogs',
			component: () => <Redirect to="/apps/blogs/posts" />
		}
	]
};

export default BlogsAppConfig;
