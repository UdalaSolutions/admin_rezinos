'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import CreateVideoModal from '../../../components/admin/CreateVideoModal';
import DeleteVideoModal from '../../../components/admin/Modal/DeleteVideoModal';
import VideoCard from '../../../components/admin/VideoCard';
import { getVideos, addVideo, deleteVideo } from '../../../services/video';

export default function VideosPage() {
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	const [videoToDelete, setVideoToDelete] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		fetchVideos();
	}, []);

	const fetchVideos = async () => {
		setLoading(true);
		setError('');

		try {
			const res = await getVideos();
			const videosArray =
				Array.isArray(res?.videos) ? res.videos : res?.data?.videos || [];
			setVideos(videosArray);
		} catch (err) {
			console.error(err);
			setError('Failed to fetch videos');
		} finally {
			setLoading(false);
		}
	};

	const handleCreateVideo = async (video) => {
		try {
			await addVideo(video);
			await fetchVideos();
			setIsModalOpen(false);
		} catch {
			toast.error('Failed to add video');
		}
	};

	const openDeleteModal = (video) => {
		setVideoToDelete(video);
	};

	const handleConfirmDelete = async () => {
		if (!videoToDelete) return;

		setIsDeleting(true);

		try {
			await deleteVideo(videoToDelete.id);
			toast.success('Video deleted');
			setVideoToDelete(null);
			await fetchVideos();
		} catch (err) {
			console.error(err);
			toast.error('Failed to delete video');
			setVideoToDelete(null);
		} finally {
			setIsDeleting(false);
		}
	};

	const filteredVideos = videos.filter(
		(v) =>
			v.videoCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			v.title?.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className='space-y-8'>
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

			{loading ?
				<div className='text-center py-16 bg-white rounded-xl shadow-sm'>
					<Icon
						icon='mdi:loading'
						width='40'
						className='mx-auto animate-spin'
					/>
					<p className='mt-3 text-gray-600'>Loading videos...</p>
				</div>
			: filteredVideos.length === 0 ?
				<div className='text-center py-16 bg-white rounded-xl shadow-sm'>
					<Icon
						icon='mdi:video-off-outline'
						width='40'
						className='mx-auto text-gray-400'
					/>
					<p className='mt-3 text-gray-600'>No videos found</p>
				</div>
			:	<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
					{filteredVideos.map((video) => (
						<VideoCard
							key={video.id}
							video={video}
							onDelete={() => openDeleteModal(video)}
						/>
					))}
				</div>
			}

			{isModalOpen && (
				<CreateVideoModal
					onClose={() => setIsModalOpen(false)}
					onSubmit={handleCreateVideo}
				/>
			)}

			{videoToDelete && (
				<DeleteVideoModal
					onClose={() => setVideoToDelete(null)}
					onConfirm={handleConfirmDelete}
					isLoading={isDeleting}
				/>
			)}
		</div>
	);
}
