import React from 'react';
import { Redirect } from 'react-router-dom';

const BlogAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/apps/blogs/blogs/:blogId',
			component: React.lazy(() => import('./blog/Blog'))
		},
		{
			path: '/apps/blogs/blogs',
			component: React.lazy(() => import('./blogs/Blogs'))
		},
		{
			path: '/apps/blogs',
			component: () => <Redirect to="/apps/blogs/blogs" />
		}
	]
};

export default BlogAppConfig;
