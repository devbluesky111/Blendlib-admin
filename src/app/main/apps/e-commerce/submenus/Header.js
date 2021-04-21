import FuseAnimate from '@fuse/core/FuseAnimate';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import Button from '@material-ui/core/Button';

function Header(props) {

	return (
		<div className="flex flex-1 w-full items-center justify-between">
			<div className="flex items-center">
				<FuseAnimate animation="transition.expandIn" delay={300}>
					<Icon className="text-32">menu</Icon>
				</FuseAnimate>

				<FuseAnimate animation="transition.slideLeftIn" delay={300}>
					<Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
						Sub Menu
					</Typography>
				</FuseAnimate>
			</div>

			<div className="flex flex-2 items-right px-12">
				<div className="p-24">
					<Button
						onClick={() => {
							props.addMenu();
						}}
						variant="contained"
						color="secondary"
						className="w-full"
					>
						Add Sub Menu
					</Button>
				</div>
			</div>
			
			
		</div>
	);
}

export default Header;
