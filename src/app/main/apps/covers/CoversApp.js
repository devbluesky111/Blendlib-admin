import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import React from 'react';
import reducer from './store';
import CoversHeader from './CoversHeader';
import CoversTable from './CoversTable';

function Covers() {
	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				contentCard: 'overflow-hidden',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={<CoversHeader />}
			content={<CoversTable />}
			innerScroll
		/>
	);
}

export default withReducer('eCommerceApp', reducer)(Covers);
