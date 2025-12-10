'use client';

import { Icon } from '@iconify/react';

export default function UserDetailModal({ isOpen, onClose, user, loading }) {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'>
			<div className='bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
				<div className='p-6 border-b border-gray-200 flex items-center justify-between'>
					<h2 className='text-2xl font-bold text-gray-900'>User Details</h2>
					<button
						onClick={onClose}
						className='text-gray-400 hover:text-gray-600 transition'>
						<Icon
							icon='mdi:close'
							width='24'
						/>
					</button>
				</div>

				{user ? (
					<div className='p-6 space-y-4'>
						<div className='flex items-center gap-4'>
							<div className='w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl'>
								{user.firstName?.[0]?.toUpperCase() ||
									user.lastName?.[0]?.toUpperCase() ||
									'U'}
							</div>
							<div>
								<h3 className='text-xl font-bold text-gray-900'>
									{user.firstName} {user.lastName}
								</h3>
								<p className='text-gray-600'>{user.email}</p>
								<p className='text-gray-500 text-sm'>{user.userType}</p>
							</div>
						</div>
					</div>
				) : (
					<p className='p-6 text-center text-gray-500'>
						No user details available
					</p>
				)}
			</div>
		</div>
	);
}
