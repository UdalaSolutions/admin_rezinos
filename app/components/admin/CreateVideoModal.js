'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { predefinedCategories } from '@/utils/utils';

export default function CreateVideoModal({ onClose, onSubmit }) {
	const [formData, setFormData] = useState({ url: '', videoCategory: '' });
	const [categoryInput, setCategoryInput] = useState('');
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowDropdown(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const filteredCategories = predefinedCategories.filter((cat) =>
		cat.toLowerCase().includes(categoryInput.toLowerCase())
	);

	const isNewCategory =
		categoryInput &&
		!predefinedCategories.some(
			(cat) => cat.toLowerCase() === categoryInput.toLowerCase()
		);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleCategoryInputChange = (e) => {
		const value = e.target.value;
		setCategoryInput(value);
		setFormData((prev) => ({ ...prev, videoCategory: value }));
		setShowDropdown(true);
	};

	const handleSelectCategory = (category) => {
		setCategoryInput(category);
		setFormData((prev) => ({ ...prev, videoCategory: category }));
		setShowDropdown(false);
	};

	const handleSubmit = () => {
		if (!formData.url.trim()) return alert('Enter video URL');
		if (!formData.videoCategory.trim())
			return alert('Enter or select category');

		setIsLoading(true);
		onSubmit(formData);
		setIsLoading(false);
		onClose();
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && !showDropdown) {
			e.preventDefault();
			handleSubmit();
		}
	};

	return (
		<div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
			<div className='bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden'>
				{/* HEADER */}
				<div className='relative px-6 py-5 border-b border-gray-100'>
					<h2 className='text-2xl font-semibold text-gray-900 text-center'>
						Add Video
					</h2>
					<button
						onClick={onClose}
						className='absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200'>
						<Icon
							icon='mdi:close'
							width='20'
						/>
					</button>
				</div>

				{/* FORM */}
				<div className='px-6 py-6 space-y-5'>
					{/* Video URL */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Video URL
						</label>
						<div className='relative'>
							<div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
								<Icon
									icon='mdi:link-variant'
									width='20'
								/>
							</div>
							<input
								name='url'
								type='url'
								value={formData.url}
								onChange={handleChange}
								onKeyPress={handleKeyPress}
								placeholder='https://www.youtube.com/watch?v=...'
								className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all'
								required
							/>
						</div>
					</div>

					{/* Category */}
					<div
						ref={dropdownRef}
						className='relative'>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Category
						</label>
						<div className='relative'>
							<div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
								<Icon
									icon='mdi:tag-outline'
									width='20'
								/>
							</div>
							<input
								value={categoryInput}
								onChange={handleCategoryInputChange}
								onFocus={() => setShowDropdown(true)}
								onKeyPress={handleKeyPress}
								placeholder='Search or type category'
								className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all'
								required
							/>
						</div>

						{/* Dropdown */}
						{showDropdown && (
							<div className='absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden max-h-48 overflow-y-auto'>
								{filteredCategories.map((cat) => (
									<div
										key={cat}
										onClick={() => handleSelectCategory(cat)}
										className='px-4 py-2.5 flex justify-between items-center cursor-pointer hover:bg-pink-50 transition'>
										<span className='text-sm text-gray-700'>{cat}</span>
										<Icon
											icon='mdi:check-circle'
											width='18'
											className='text-pink-500'
										/>
									</div>
								))}

								{isNewCategory && (
									<div
										onClick={() => handleSelectCategory(categoryInput)}
										className='px-4 py-2.5 flex items-center gap-2 cursor-pointer hover:bg-green-50 transition'>
										<Icon
											icon='mdi:plus-circle'
											width='18'
											className='text-green-600'
										/>
										<span className='text-sm text-gray-700'>
											Create <strong>&apos;{categoryInput}&apos;</strong>
										</span>
									</div>
								)}
							</div>
						)}
					</div>

					{/* ACTIONS */}
					<div className='flex gap-3 pt-4'>
						<button
							type='button'
							onClick={onClose}
							className='flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition'>
							Cancel
						</button>
						<button
							onClick={handleSubmit}
							disabled={isLoading}
							className='flex-1 py-3 bg-linear-to-r from-pink-500 to-pink-600 text-white rounded-xl text-sm font-medium hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm hover:shadow-md'>
							{isLoading ? (
								<span className='flex items-center justify-center gap-2'>
									<Icon
										icon='mdi:loading'
										className='animate-spin'
										width='18'
									/>
									Creating...
								</span>
							) : (
								'Add Video'
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
