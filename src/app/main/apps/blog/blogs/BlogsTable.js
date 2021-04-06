import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Checkbox from '@material-ui/core/Checkbox';
import Icon from '@material-ui/core/Icon';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseAnimate from '@fuse/core/FuseAnimate/FuseAnimate';
import BlogsTableHead from './BlogsTableHead';
import Backend from '@fuse/utils/BackendUrl';
import axios from 'axios';
import Moment from 'react-moment';
import { withRouter } from 'react-router-dom';


function BlogsTable(props) {
	const [products, setProducts] = useState([]);

	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null
	});
	const [menus, setMenus] = useState([]);
	const [submenus, setSubmenus] = useState([]);

	const init = async () => {
		setLoading(true);
		const res1 = await axios.post(Backend.URL + '/get_submenu', {data:0}, { withCredentials: true, headers: {"Access-Control-Allow-Origin": "*"} });
		setSubmenus(res1.data);
		const res2 = await axios.post(Backend.URL + '/get_menu', {data:0}, { withCredentials: true, headers: {"Access-Control-Allow-Origin": "*"} });
		setMenus(res2.data);
		const res = await axios.post(Backend.URL + '/get_products', {platinum: 'on'}, { withCredentials: true, headers: {"Access-Control-Allow-Origin": "*"} });
		setProducts(res.data[0]);
		setLoading(false);
	}

	useEffect(() => {
		init();
	}, []);

	useEffect(() => {
		setData(products);
	}, [products]);

	function handleRequestSort(event, property) {
		const id = property;
		let direction = 'desc';

		if (order.id === property && order.direction === 'desc') {
			direction = 'asc';
		}

		setOrder({
			direction,
			id
		});
	}

	function handleSelectAllClick(event) {
		if (event.target.checked) {
			setSelected(data.map(n => n.id));
			return;
		}
		setSelected([]);
	}

	async function handleDeselect() {
		const resp = await axios.post(Backend.URL + '/delete_product', {ids: selected}, { withCredentials: true, headers: {"Access-Control-Allow-Origin": "*"} });
		if (resp.data.ids) {
			setLoading(true);
			init();
			setLoading(false);
		}
		setSelected([]);
	}

	function handleClick(item) {
		props.history.push(`/apps/e-commerce/products/${item.id}`);
	}

	function handleCheck(event, id) {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}

		setSelected(newSelected);
	}

	function handleChangePage(event, value) {
		setPage(value);
	}

	function handleChangeRowsPerPage(event) {
		setRowsPerPage(event.target.value);
	}

	if (loading) {
		return <FuseLoading />;
	}

	if (data.length === 0) {
		return (
			<FuseAnimate delay={100}>
				<div className="flex flex-1 items-center justify-center h-full">
					<Typography color="textSecondary" variant="h5">
						There are no products!
					</Typography>
				</div>
			</FuseAnimate>
		);
	}

	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
					<BlogsTableHead
						selectedProductIds={selected}
						order={order}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={data.length}
						onMenuItemClick={handleDeselect}
					/>

					<TableBody>
						{_.orderBy(
							data,
							[
								o => {
									switch (order.id) {
										case 'categories': {
											return o.categories[0];
										}
										default: {
											return o[order.id];
										}
									}
								}
							],
							[order.direction]
						)
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((n, _i) => {
								const isSelected = selected.indexOf(n.id) !== -1;
								return (
									<TableRow
										className="h-64 cursor-pointer"
										hover
										role="checkbox"
										aria-checked={isSelected}
										tabIndex={-1}
										key={_i}
										selected={isSelected}
										onClick={event => handleClick(n)}
									>
										<TableCell className="w-40 md:w-64 text-center" padding="none">
											<Checkbox
												checked={isSelected}
												onClick={event => event.stopPropagation()}
												onChange={event => handleCheck(event, n.id)}
											/>
										</TableCell>

										<TableCell
											className="w-52 px-4 md:px-0"
											component="th"
											scope="row"
											padding="none"
										>
											{n.p_image ? (
												<img
													className="w-full block rounded"
													src={Backend.URL + `/images/` + n.p_image}
													alt={n.name}
												/>
											) : (
												<img
													className="w-full block rounded"
													src="assets/images/ecommerce/product-image-placeholder.png"
													alt={n.name}
												/>
											)}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.name}
										</TableCell>

										<TableCell className="p-4 md:p-16 truncate" component="th" scope="row">
											{menus.filter(menu => n.main_menu === menu.id).map((mm) => {
												return mm.name;
											} )}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{submenus.filter(smenu => n.sub_menu === smenu.id).map((sm) => {
												return sm.name;
											} )}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											<Moment format="YYYY-MM-DD">{n.created}</Moment>
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.platinum === 'on' ? (<Icon className="text-green text-20">check_circle</Icon>) : (<Icon className="text-red text-20">remove_circle</Icon>)}	
											</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</FuseScrollbars>

			<TablePagination
				className="flex-shrink-0 border-t-1"
				component="div"
				count={data.length}
				rowsPerPage={rowsPerPage}
				page={page}
				backIconButtonProps={{
					'aria-label': 'Previous Page'
				}}
				nextIconButtonProps={{
					'aria-label': 'Next Page'
				}}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</div>
	);
}

export default withRouter(BlogsTable);
