import { Icon } from '@iconify/react';

export default function VideoCard({ video, onDelete }) {
	const embedUrl = video.url?.includes('youtube')
		? video.url.replace('watch?v=', 'embed/')
		: video.url;

	return (
		<div className='bg-white rounded-xl shadow-sm overflow-hidden flex flex-col'>
			{/* Video Embed */}
			<div className='relative aspect-video'>
				{video.url ? (
					<iframe
						src={embedUrl}
						className='w-full h-full'
						allowFullScreen
						title={video.title || 'Video'}
					/>
				) : (
					<div className='flex items-center justify-center h-full bg-gray-100 text-gray-400'>
						<Icon
							icon='mdi:video-off-outline'
							width='40'
						/>
					</div>
				)}
			</div>

			{/* Video Info */}
			<div className='p-4 flex flex-col gap-2'>
				{/* Title */}
				<h3
					className='text-gray-900 font-semibold text-md truncate'
					title={video.title}>
					{video.title || 'Untitled Video'}
				</h3>

				{/* Description */}
				<p
					className='text-gray-600 text-sm line-clamp-2'
					title={video.description}>
					{video.description || 'No description provided.'}
				</p>

				{/* Category */}
				<p className='text-gray-500 text-sm truncate'>{video.videoCategory}</p>

				{/* Views & Date */}
				<div className='flex justify-between items-center mt-2 text-gray-500 text-sm'>
					<span className='flex items-center gap-1'>
						<Icon
							icon='mdi:eye-outline'
							width='16'
						/>{' '}
						{video.views || 0}
					</span>
					{/* <span>
						{video.createdAt
							? new Date(video.createdAt).toLocaleDateString()
							: ''}
					</span> */}
				</div>

				{/* Delete Button */}
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
