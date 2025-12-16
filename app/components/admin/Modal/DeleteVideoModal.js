'use client';

import { Icon } from '@iconify/react';

export default function DeleteVideoModal({ onClose, onConfirm, isLoading }) {
	return (
		<div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
			<div className='bg-white rounded-2xl shadow-2xl w-full max-w-sm'>
				<div className='px-6 py-5 border-b border-gray-100 text-center'>
					<h2 className='text-xl font-semibold text-gray-900'>Delete Video</h2>
				</div>

				<div className='px-6 py-6 text-center space-y-4'>
					<p className='text-gray-600'>
						Are you sure you want to delete this video?
					</p>

					<div className='flex gap-3 pt-4'>
						<button
							onClick={onClose}
							disabled={isLoading}
							className='flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition'>
							Cancel
						</button>

						<button
							onClick={onConfirm}
							disabled={isLoading}
							className='flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition'>
							{isLoading ? (
								<Icon
									icon='mdi:loading'
									width='18'
									className='mx-auto animate-spin'
								/>
							) : (
								'Delete'
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
