'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import CreateVideoModal from '@/app/components/admin/CreateVideoModal';
import VideoCard from '@/app/components/admin/VideoCard';
import { videoService } from '@/app/services/video';

export default function VideosPage({ userToken }) {
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	// Set auth token and fetch videos
	useEffect(() => {
		if (userToken) videoService.setAuthToken(userToken);
		fetchVideos();
	}, [userToken]);

	const fetchVideos = async () => {
		setLoading(true);
		setError('');
		try {
			const res = await videoService.getVideos();
			setVideos(res.data?.videos || []);
		} catch (err) {
			console.error(err);
			setError('Failed to fetch videos');
		} finally {
			setLoading(false);
		}
	};

	const handleCreateVideo = async (video) => {
		try {
			const newVideo = await videoService.addVideo(video);
			setVideos((prev) => [newVideo, ...prev]);
			setIsModalOpen(false);
		} catch {
			alert('Failed to add video');
		}
	};

	const handleDeleteVideo = async (id) => {
		if (!confirm('Delete this video?')) return;
		try {
			await videoService.deleteVideo(id);
			setVideos((prev) => prev.filter((v) => v.id !== id));
		} catch {
			alert('Failed to delete video');
		}
	};

	const filteredVideos = videos.filter(
		(v) =>
			v.videoCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			v.title?.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className='space-y-8'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>Videos</h1>
					<p className='text-gray-600 mt-1'>Manage all your video content</p>
				</div>
				<button
					onClick={() => setIsModalOpen(true)}
					className='flex items-center gap-2 px-5 py-3 bg-linear-to-r from-pink-600 to-purple-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition'>
					<Icon
						icon='mdi:plus'
						width='20'
					/>
					Add Video
				</button>
			</div>

			{/* Search */}
			<div className='bg-white p-4 rounded-xl shadow-sm flex items-center gap-3'>
				<Icon
					icon='mdi:magnify'
					width='22'
					className='text-gray-400'
				/>
				<input
					type='text'
					placeholder='Search by title or category...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='w-full outline-none text-gray-700'
				/>
			</div>

			{/* Content */}
			{loading ? (
				<div className='text-center py-16 bg-white rounded-xl shadow-sm'>
					<Icon
						icon='mdi:loading'
						width='40'
						className='mx-auto text-gray-400 animate-spin'
					/>
					<p className='mt-3 text-gray-600'>Loading videos...</p>
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
						onClick={fetchVideos}
						className='mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition'>
						Try Again
					</button>
				</div>
			) : filteredVideos.length === 0 ? (
				<div className='text-center py-16 bg-white rounded-xl shadow-sm'>
					<Icon
						icon='mdi:video-off-outline'
						width='40'
						className='mx-auto text-gray-400'
					/>
					<p className='mt-3 text-gray-600'>No videos found</p>
				</div>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
					{filteredVideos.map((video) => (
						<VideoCard
							key={video.id}
							video={video}
							onDelete={handleDeleteVideo}
						/>
					))}
				</div>
			)}

			{/* Create Video Modal */}
			{isModalOpen && (
				<CreateVideoModal
					onClose={() => setIsModalOpen(false)}
					onSubmit={handleCreateVideo}
				/>
			)}
		</div>
	);
}
