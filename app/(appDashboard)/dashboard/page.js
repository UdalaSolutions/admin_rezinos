'use client';

import Link from 'next/link';
import { Icon } from '@iconify/react';
import { stats, recentActivities, quickActions } from '../../../utils/utils';

export default function AdminDashboard() {
	return (
		<div className='space-y-8'>
			{/* Welcome Section */}

			{/* Stats Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				{stats.map((stat, index) => (
					<div
						key={index}
						className='bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition'>
						<div className='flex items-center justify-between mb-4'>
							<div
								className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color} bg-opacity-10`}>
								<Icon
									icon={stat.icon}
									width='24'
									className={stat.color.replace('bg-', 'text-')}
								/>
							</div>
						</div>
						<p className='text-gray-600 text-sm mb-1'>{stat.title}</p>
						<p className='text-3xl font-bold text-gray-900 mb-2'>
							{stat.value}
						</p>
						<p className='text-sm text-green-600 font-medium'>
							{stat.change} from last month
						</p>
					</div>
				))}
			</div>

			{/* Quick Actions */}
			<div>
				<h2 className='text-xl font-bold text-gray-900 mb-4'>Quick Actions</h2>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					{quickActions.map((action, index) => (
						<Link
							key={index}
							href={action.href}
							className='bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-gray-300 transition group'>
							<div className='flex items-center gap-4'>
								<div
									className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color} bg-opacity-10 group-hover:bg-opacity-20 transition`}>
									<Icon
										icon={action.icon}
										width='24'
										className={action.color.replace('bg-', 'text-')}
									/>
								</div>
								<div>
									<h3 className='text-base font-semibold text-gray-900 mb-1'>
										{action.title}
									</h3>
									<p className='text-gray-600 text-sm'>{action.description}</p>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>

			{/* Recent Activity */}
			<div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
				<h2 className='text-xl font-bold text-gray-900 mb-6'>
					Recent Activity
				</h2>
				<div className='space-y-1'>
					{recentActivities.map((activity) => (
						<div
							key={activity.id}
							className='flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition'>
							<div
								className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color} bg-opacity-10`}>
								<Icon
									icon={activity.icon}
									width='20'
									className={activity.color.replace('bg-', 'text-')}
								/>
							</div>
							<div className='flex-1 min-w-0'>
								<p className='text-sm text-gray-900 font-medium'>
									{activity.message}
								</p>
								<p className='text-xs text-gray-500 mt-1'>{activity.time}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
