'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { menuItems } from '@/utils/utils';
import { jwtDecode } from 'jwt-decode';

export default function AdminLayout({ children }) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const pathname = usePathname();
	const router = useRouter();

	// Check token validity
	// useEffect(() => {
	// 	const token = localStorage.getItem('authToken');
	// 	if (!token) {
	// 		router.replace('/signin');
	// 		return;
	// 	}

	// 	try {
	// 		const decoded = jwtDecode(token);
	// 		// exp is in seconds
	// 		if (decoded.exp * 1000 < Date.now()) {
	// 			localStorage.removeItem('authToken');
	// 			router.replace('/');
	// 		}
	// 	} catch {
	// 		localStorage.removeItem('authToken');
	// 		router.replace('/');
	// 	}
	// }, [router]);

	return (
		<div className='flex h-screen bg-[#f3f3f3]'>
			{/* Sidebar */}
			<aside
				className={`bg-white border-r border-gray-200 transition-all duration-300 relative flex flex-col ${
					isSidebarOpen ? 'w-64' : 'w-20'
				}`}>
				<div className='p-6 flex flex-col flex-1'>
					{/* Logo & Toggle */}
					<div className='flex items-center justify-between mb-8'>
						{isSidebarOpen && (
							<h1 className='text-xl font-bold text-gray-900'>Rezinos Admin</h1>
						)}
						<button
							onClick={() => setIsSidebarOpen(!isSidebarOpen)}
							className='text-gray-400 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition'>
							<Icon
								icon={isSidebarOpen ? 'mdi:chevron-left' : 'mdi:chevron-right'}
								width='20'
							/>
						</button>
					</div>

					{/* Menu Items */}
					<nav className='flex-1 space-y-1'>
						{menuItems.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group
                    ${
											isActive
												? 'bg-pink-50 text-pink-600 font-medium border border-pink-100'
												: 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
										}`}>
									<Icon
										icon={item.icon}
										width='22'
										className={
											isActive
												? 'text-pink-600'
												: 'text-gray-500 group-hover:text-gray-900'
										}
									/>
									{isSidebarOpen && (
										<span className='text-sm'>{item.name}</span>
									)}
								</Link>
							);
						})}
					</nav>
				</div>

				{/* User Profile */}
				<div className='p-4 border-t border-gray-200'>
					<div className='flex items-center gap-3 px-2 py-2'>
						<div className='w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shrink-0'>
							A
						</div>
						{isSidebarOpen && (
							<div className='flex flex-col min-w-0'>
								<p className='font-medium text-gray-900 text-sm truncate'>
									Admin User
								</p>
								<p className='text-xs text-gray-500 truncate'>
									admin@rezinos.com
								</p>
							</div>
						)}
					</div>
				</div>
			</aside>

			{/* Main Content */}
			<main className='flex-1 flex flex-col overflow-hidden'>
				{/* Header */}
				<header className='bg-white border-b border-gray-200 shrink-0'>
					<div className='px-8 py-4 flex items-center justify-between'>
						<h2 className='text-xl font-semibold text-gray-900'>
							Admin Dashboard
						</h2>
						<div className='flex items-center gap-3'>
							<button className='relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition'>
								<Icon
									icon='mdi:bell-outline'
									width='22'
								/>
								<span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
							</button>
							<div className='w-px h-6 bg-gray-200'></div>
							<button
								onClick={() => {
									localStorage.removeItem('authToken');
									router.replace('/signin');
								}}
								className='flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition text-sm font-medium'>
								<Icon
									icon='mdi:logout'
									width='20'
								/>
								Logout
							</button>
						</div>
					</div>
				</header>

				{/* Page Content */}
				<div className='p-8 overflow-y-auto flex-1 bg-gray-50'>{children}</div>
			</main>
		</div>
	);
}
