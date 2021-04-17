import FusePageCarded from '@fuse/core/FusePageCarded';
import React from 'react';
import BlogsHeader from './BlogsHeader';
import BlogsTable from './BlogsTable';

function Blogs() {
	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				contentCard: 'overflow-hidden',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={<BlogsHeader />}
			content={<BlogsTable />}
			innerScroll
		/>
	);
}

export default Blogs;
