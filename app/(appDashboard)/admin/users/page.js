'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { getAllUsers } from '../../../services/auth';
import UserDetailModal from '../../../components/admin/Modal/UserDetailModal';
import Pagination from '../../../components/admin/Pagination';

export default function UsersPage() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedUser, setSelectedUser] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const usersPerPage = 8;

	const fetchUsers = async () => {
		setLoading(true);
		setError('');
		try {
			const usersData = await getAllUsers();
			setUsers(usersData);
		} catch (err) {
			setError(err.message || 'Unable to fetch users');
		} finally {
			setLoading(false);
		}
	};

	const handleViewUser = (user) => {
		setSelectedUser(user);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedUser(null);
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const filteredUsers = users.filter(
		(u) =>
			u.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			u.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			u.email?.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	// Pagination logic
	const indexOfLastUser = currentPage * usersPerPage;
	const indexOfFirstUser = indexOfLastUser - usersPerPage;
	const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

	const getRoleColor = (role) => {
		const colors = {
			admin: 'bg-red-100 text-red-700',
			user: 'bg-blue-100 text-blue-700',
		};
		return colors[role?.toLowerCase()] || 'bg-gray-100 text-gray-700';
	};

	return (
		<div className='space-y-8'>
			{/* Header */}
			<div className='flex flex-col md:flex-row items-center justify-between gap-4'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>Users</h1>
					<p className='text-gray-600 mt-1'>Manage all registered users</p>
				</div>
				<div className='flex gap-3 flex-wrap'>
					<input
						type='text'
						placeholder='Search by name or email...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='px-4 py-2 border rounded-lg focus:outline-none'
					/>
					<button
						onClick={fetchUsers}
						disabled={loading}
						className='flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 border border-pink-100 rounded-lg hover:bg-pink-100 disabled:opacity-50 disabled:cursor-not-allowed transition'>
						<Icon
							icon='mdi:refresh'
							width='20'
						/>
						Refresh
					</button>
				</div>
			</div>

			{/* Stats */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<div className='bg-white p-6 rounded-xl shadow-sm'>
					<p className='text-gray-600 text-sm'>Total Users</p>
					<p className='text-3xl font-bold text-gray-900 mt-2'>
						{users.length}
					</p>
				</div>
				<div className='bg-white p-6 rounded-xl shadow-sm'>
					<p className='text-gray-600 text-sm'>Active Users</p>
					<p className='text-3xl font-bold text-green-600 mt-2'>
						{users.filter((u) => u.isActive).length}
					</p>
				</div>
				<div className='bg-white p-6 rounded-xl shadow-sm'>
					<p className='text-gray-600 text-sm'>Admin Users</p>
					<p className='text-3xl font-bold text-red-600 mt-2'>
						{users.filter((u) => u.role?.toLowerCase() === 'admin').length}
					</p>
				</div>
			</div>

			{/* Loading / Error / Empty States */}
			{loading ?
				<div className='text-center py-16 bg-white rounded-xl shadow-sm'>
					<Icon
						icon='mdi:loading'
						width='40'
						className='mx-auto text-gray-400 animate-spin'
					/>
					<p className='mt-3 text-gray-600'>Loading users...</p>
				</div>
			: error ?
				<div className='text-center py-16 bg-white rounded-xl shadow-sm border border-red-200'>
					<Icon
						icon='mdi:alert-circle'
						width='40'
						className='mx-auto text-red-500'
					/>
					<p className='mt-3 text-red-600 font-medium'>{error}</p>
					<button
						onClick={fetchUsers}
						className='mt-4 px-4 py-2 bg-pink-50 text-pink-600 border border-pink-100 rounded-lg hover:bg-pink-100 transition'>
						Retry
					</button>
				</div>
			: filteredUsers.length === 0 ?
				<div className='text-center py-16 bg-white rounded-xl shadow-sm'>
					<Icon
						icon='mdi:account-off-outline'
						width='40'
						className='mx-auto text-gray-400'
					/>
					<p className='mt-3 text-gray-600'>No users found</p>
				</div>
			:	<>
					{/* Table */}
					<div className='bg-white rounded-xl shadow-sm overflow-hidden'>
						<div className='overflow-x-auto'>
							<table className='w-full'>
								<thead className='bg-gray-50 border-b border-gray-200'>
									<tr>
										<th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
											User
										</th>
										<th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
											Email
										</th>
										<th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
											Role
										</th>
										<th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
											Status
										</th>
										<th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
											Actions
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-gray-200'>
									{currentUsers.map((user) => (
										<tr
											key={user.id}
											className='hover:bg-gray-50 transition'>
											<td className='px-6 py-4'>
												<div className='flex items-center gap-3'>
													<div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold'>
														{user.firstName?.[0]?.toUpperCase() ||
															user.lastName?.[0]?.toUpperCase() ||
															'U'}
													</div>
													<div>
														<p className='font-medium text-gray-900'>
															{user.firstName} {user.lastName}
														</p>
													</div>
												</div>
											</td>
											<td className='px-6 py-4 text-sm text-gray-700'>
												{user.email}
											</td>
											<td className='px-6 py-4'>
												<span
													className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
														user.role,
													)}`}>
													<Icon
														icon='mdi:shield-account'
														width='16'
													/>
													{user.role || 'User'}
												</span>
											</td>
											<td className='px-6 py-4'>
												<span
													className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
														user.isActive ?
															'bg-green-100 text-green-700'
														:	'bg-gray-100 text-gray-700'
													}`}>
													<Icon
														icon={
															user.isActive ? 'mdi:check-circle' : (
																'mdi:close-circle'
															)
														}
														width='16'
													/>
													{user.isActive ? 'Active' : 'Inactive'}
												</span>
											</td>
											<td className='px-6 py-4'>
												<button
													onClick={() => handleViewUser(user)}
													className='text-pink-600 hover:text-pink-700 font-medium text-sm flex items-center gap-1'>
													<Icon
														icon='mdi:eye'
														width='18'
													/>
													View Details
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{/* Pagination */}
					<Pagination
						totalItems={filteredUsers.length}
						itemsPerPage={usersPerPage}
						currentPage={currentPage}
						onPageChange={setCurrentPage}
					/>
				</>
			}

			{/* User Modal */}
			<UserDetailModal
				isOpen={isModalOpen}
				onClose={closeModal}
				user={selectedUser}
				loading={false}
			/>
		</div>
	);
}
