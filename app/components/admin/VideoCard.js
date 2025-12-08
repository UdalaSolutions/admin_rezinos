import { Icon } from '@iconify/react';

export default function VideoCard({ video, onDelete }) {
	const embedUrl = video.url?.includes('youtube')
		? video.url.replace('watch?v=', 'embed/')
		: video.url;

	return (
		<div className='bg-white rounded-xl shadow-sm overflow-hidden flex flex-col'>
			<div className='relative aspect-video'>
				{video.url ? (
					<iframe
						src={embedUrl}
						className='w-full h-full'
						allowFullScreen></iframe>
				) : (
					<div className='flex items-center justify-center h-full bg-gray-100 text-gray-400'>
						<Icon
							icon='mdi:video-off-outline'
							width='40'
						/>
					</div>
				)}
			</div>
			<div className='p-4 flex flex-col gap-2'>
				<p className='text-gray-500 text-sm truncate'>{video.videoCategory}</p>
				<div className='flex justify-between items-center mt-2 text-gray-500 text-sm'>
					<span>
						<Icon
							icon='mdi:eye-outline'
							width='16'
						/>{' '}
						{video.views || 0}
					</span>
					<span>{new Date(video.createdAt).toLocaleDateString()}</span>
				</div>
				<button
					onClick={() => onDelete(video.id)}
					className='mt-3 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition'>
					<Icon
						icon='mdi:delete-outline'
						width='18'
					/>
					Delete
				</button>
			</div>
		</div>
	);
}
