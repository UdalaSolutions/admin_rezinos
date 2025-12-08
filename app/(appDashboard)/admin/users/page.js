'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { getAllUsers, getUserById } from '@/app/services/auth';

export default function UsersPage() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedUser, setSelectedUser] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loadingUserDetail, setLoadingUserDetail] = useState(false);

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

	const handleViewUser = async (userId) => {
		setLoadingUserDetail(true);
		setIsModalOpen(true);
		try {
			const userData = await getUserById(userId);
			setSelectedUser(userData);
		} catch (err) {
			setError('Unable to fetch user details');
			setIsModalOpen(false);
		} finally {
			setLoadingUserDetail(false);
		}
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedUser(null);
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const filteredUsers = users.filter(
		(user) =>
			user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.email?.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const getRoleColor = (role) => {
		const colors = {
			admin: 'bg-red-100 text-red-700',
			user: 'bg-blue-100 text-blue-700',
			moderator: 'bg-purple-100 text-purple-700',
		};
		return colors[role?.toLowerCase()] || 'bg-gray-100 text-gray-700';
	};

	return (
		<div className='space-y-8'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>Users</h1>
					<p className='text-gray-600 mt-1'>Manage all registered users</p>
				</div>
				<button
					onClick={fetchUsers}
					disabled={loading}
					className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition'>
					<Icon
						icon='mdi:refresh'
						width='20'
					/>
					Refresh
				</button>
			</div>

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

			<div className='bg-white p-4 rounded-xl shadow-sm flex items-center gap-3'>
				<Icon
					icon='mdi:magnify'
					width='22'
					className='text-gray-400'
				/>
				<input
					type='text'
					placeholder='Search by name or email...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='w-full outline-none text-gray-700'
				/>
			</div>

			{loading ? (
				<div className='text-center py-16 bg-white rounded-xl shadow-sm'>
					<Icon
						icon='mdi:loading'
						width='40'
						className='mx-auto text-gray-400 animate-spin'
					/>
					<p className='mt-3 text-gray-600'>Loading users...</p>
				</div>
			) : error ? (
				<div className='text-center py-16 bg-white rounded-xl shadow-sm border border-red-200'>
					<Icon
						icon='mdi:alert-circle'
						width='40'
						className='mx-auto text-red-500'
					/>
					<p className='mt-3 text-red-600 font-medium'>{error}</p>
					<button
						onClick={fetchUsers}
						className='mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition'>
						Try Again
					</button>
				</div>
			) : filteredUsers.length === 0 ? (
				<div className='text-center py-16 bg-white rounded-xl shadow-sm'>
					<Icon
						icon='mdi:account-off-outline'
						width='40'
						className='mx-auto text-gray-400'
					/>
					<p className='mt-3 text-gray-600'>No users found</p>
				</div>
			) : (
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
								{filteredUsers.map((user) => (
									<tr
										key={user.id}
										className='hover:bg-gray-50 transition'>
										<td className='px-6 py-4'>
											<div className='flex items-center gap-3'>
												<div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold'>
													{user.name?.[0]?.toUpperCase() ||
														user.email?.[0]?.toUpperCase() ||
														'U'}
												</div>
												<div>
													<p className='font-medium text-gray-900'>
														{user.name || 'Unknown User'}
													</p>
													<p className='text-xs text-gray-500'>
														ID: {user.id?.slice(0, 8)}...
													</p>
												</div>
											</div>
										</td>
										<td className='px-6 py-4 text-sm text-gray-700'>
											{user.email || 'No email'}
										</td>
										<td className='px-6 py-4'>
											<span
												className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
													user.role
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
													user.isActive
														? 'bg-green-100 text-green-700'
														: 'bg-gray-100 text-gray-700'
												}`}>
												<Icon
													icon={
														user.isActive
															? 'mdi:check-circle'
															: 'mdi:close-circle'
													}
													width='16'
												/>
												{user.isActive ? 'Active' : 'Inactive'}
											</span>
										</td>
										<td className='px-6 py-4'>
											<button
												onClick={() => handleViewUser(user.id)}
												className='text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1'>
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
			)}

			{/* User Detail Modal */}
			{isModalOpen && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
					<div className='bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
						<div className='p-6 border-b border-gray-200 flex items-center justify-between'>
							<h2 className='text-2xl font-bold text-gray-900'>User Details</h2>
							<button
								onClick={closeModal}
								className='text-gray-400 hover:text-gray-600 transition'>
								<Icon
									icon='mdi:close'
									width='24'
								/>
							</button>
						</div>

						{loadingUserDetail ? (
							<div className='p-12 text-center'>
								<Icon
									icon='mdi:loading'
									width='40'
									className='mx-auto text-gray-400 animate-spin'
								/>
								<p className='mt-3 text-gray-600'>Loading user details...</p>
							</div>
						) : selectedUser ? (
							<div className='p-6 space-y-6'>
								<div className='flex items-center gap-4'>
									<div className='w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl'>
										{selectedUser.name?.[0]?.toUpperCase() ||
											selectedUser.email?.[0]?.toUpperCase() ||
											'U'}
									</div>
									<div>
										<h3 className='text-xl font-bold text-gray-900'>
											{selectedUser.name || 'Unknown User'}
										</h3>
										<p className='text-gray-600'>{selectedUser.email}</p>
									</div>
								</div>

								<div className='grid grid-cols-2 gap-4'>
									<div className='bg-gray-50 p-4 rounded-lg'>
										<p className='text-xs text-gray-500 uppercase font-semibold mb-1'>
											User ID
										</p>
										<p className='text-sm text-gray-900 font-mono'>
											{selectedUser.id}
										</p>
									</div>

									<div className='bg-gray-50 p-4 rounded-lg'>
										<p className='text-xs text-gray-500 uppercase font-semibold mb-1'>
											Role
										</p>
										<span
											className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
												selectedUser.role
											)}`}>
											{selectedUser.role || 'User'}
										</span>
									</div>

									<div className='bg-gray-50 p-4 rounded-lg'>
										<p className='text-xs text-gray-500 uppercase font-semibold mb-1'>
											Status
										</p>
										<span
											className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
												selectedUser.isActive
													? 'bg-green-100 text-green-700'
													: 'bg-gray-100 text-gray-700'
											}`}>
											{selectedUser.isActive ? 'Active' : 'Inactive'}
										</span>
									</div>

									<div className='bg-gray-50 p-4 rounded-lg'>
										<p className='text-xs text-gray-500 uppercase font-semibold mb-1'>
											Created At
										</p>
										<p className='text-sm text-gray-900'>
											{selectedUser.createdAt
												? new Date(selectedUser.createdAt).toLocaleDateString(
														'en-US',
														{
															year: 'numeric',
															month: 'short',
															day: 'numeric',
														}
												  )
												: 'N/A'}
										</p>
									</div>
								</div>

								{selectedUser.phone && (
									<div className='bg-gray-50 p-4 rounded-lg'>
										<p className='text-xs text-gray-500 uppercase font-semibold mb-1'>
											Phone
										</p>
										<p className='text-sm text-gray-900'>
											{selectedUser.phone}
										</p>
									</div>
								)}
							</div>
						) : null}
					</div>
				</div>
			)}
		</div>
	);
}
