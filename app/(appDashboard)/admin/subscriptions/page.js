'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { subscriptionService } from '../../../services/subscription';
import Pagination from '../../../components/admin/Pagination';

export default function SubscriptionsPage() {
	const [subscriptions, setSubscriptions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 8;

	const fetchSubscriptions = async () => {
		setLoading(true);
		setError('');
		try {
			const subs = await subscriptionService.getAllSubscriptions();
			setSubscriptions(subs);
		} catch (err) {
			setError(err.message || 'Unable to fetch subscriptions');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSubscriptions();
	}, []);

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentSubs = subscriptions.slice(indexOfFirstItem, indexOfLastItem);

	const isActive = (sub) =>
		new Date(sub.dateTheSubscriptionStarts) <= new Date() &&
		new Date(sub.dateTheSubscriptionEnd) >= new Date();

	const getActiveCount = () => subscriptions.filter(isActive).length;

	const getExpiringSoon = () =>
		subscriptions.filter((s) => {
			const diff =
				(new Date(s.dateTheSubscriptionEnd) - new Date()) /
				(1000 * 60 * 60 * 24);
			return diff > 0 && diff <= 3;
		}).length;

	const formatDate = (dateStr) =>
		new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});

	const formatPhone = (phone) => {
		// Format Nigerian-style numbers or any raw phone string nicely
		if (!phone) return '—';
		const str = String(phone);
		// e.g. 2349164361941 → +234 916 436 1941
		if (str.startsWith('234') && str.length >= 13) {
			return `+${str.slice(0, 3)} ${str.slice(3, 6)} ${str.slice(6, 9)} ${str.slice(9)}`;
		}
		return str;
	};

	return (
		<div className='space-y-8'>
			{/* Header */}
			<div className='flex flex-col md:flex-row items-center justify-between gap-4'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>Subscriptions</h1>
					<p className='text-gray-600 mt-1'>
						View all active user subscriptions
					</p>
				</div>
				<button
					onClick={fetchSubscriptions}
					disabled={loading}
					className='flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 border border-pink-100 rounded-lg hover:bg-pink-100 disabled:opacity-50 disabled:cursor-not-allowed transition'>
					<Icon
						icon='mdi:refresh'
						width='20'
					/>
					Refresh
				</button>
			</div>

			{/* Stats */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<div className='bg-white p-6 rounded-xl shadow-sm'>
					<p className='text-gray-600 text-sm'>Total Subscriptions</p>
					<p className='text-3xl font-bold text-gray-900 mt-2'>
						{subscriptions.length}
					</p>
				</div>
				<div className='bg-white p-6 rounded-xl shadow-sm'>
					<p className='text-gray-600 text-sm'>Active Today</p>
					<p className='text-3xl font-bold text-green-600 mt-2'>
						{getActiveCount()}
					</p>
				</div>
				<div className='bg-white p-6 rounded-xl shadow-sm'>
					<p className='text-gray-600 text-sm'>Expiring Soon</p>
					<p className='text-3xl font-bold text-orange-600 mt-2'>
						{getExpiringSoon()}
					</p>
				</div>
			</div>

			{/* Loading / Error / Empty States */}
			{loading ?
				<div className='text-center py-16 bg-white rounded-xl shadow-sm'>
					<Icon
						icon='mdi:loading'
						width='40'
						className='mx-auto text-gray-400 animate-spin'
					/>
					<p className='mt-3 text-gray-600'>Loading subscriptions...</p>
				</div>
			: error ?
				<div className='text-center py-16 bg-white rounded-xl shadow-sm border border-red-200'>
					<Icon
						icon='mdi:alert-circle'
						width='40'
						className='mx-auto text-red-500'
					/>
					<p className='mt-3 text-red-600 font-medium'>{error}</p>
					<button
						onClick={fetchSubscriptions}
						className='mt-4 px-4 py-2 bg-pink-50 text-pink-600 border border-pink-100 rounded-lg hover:bg-pink-100 transition'>
						Retry
					</button>
				</div>
			: subscriptions.length === 0 ?
				<div className='text-center py-16 bg-white rounded-xl shadow-sm'>
					<Icon
						icon='mdi:inbox'
						width='40'
						className='mx-auto text-gray-400'
					/>
					<p className='mt-3 text-gray-600'>No subscriptions found</p>
				</div>
			:	<>
					{/* Table */}
					<div className='bg-white rounded-xl shadow-sm overflow-hidden'>
						<div className='overflow-x-auto'>
							<table className='w-full'>
								<thead className='bg-gray-50 border-b border-gray-200'>
									<tr>
										<th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
											Phone Number
										</th>
										<th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
											Start Date
										</th>
										<th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
											End Date
										</th>
										<th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
											Videos
										</th>
										<th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
											Status
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-gray-200'>
									{currentSubs.map((sub) => {
										const active = isActive(sub);

										return (
											<tr
												key={sub.id}
												className='hover:bg-gray-50 transition'>
												{/* Phone Number */}
												<td className='px-6 py-4'>
													<div className='flex items-center gap-3'>
														<div className='w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semiboshrink-0'>
															<Icon
																icon='mdi:phone'
																width='18'
															/>
														</div>
														<span className='font-mono text-sm text-gray-800 font-medium'>
															{formatPhone(sub.userId)}
														</span>
													</div>
												</td>

												{/* Start Date */}
												<td className='px-6 py-4 text-sm text-gray-700'>
													{formatDate(sub.dateTheSubscriptionStarts)}
												</td>

												{/* End Date */}
												<td className='px-6 py-4 text-sm text-gray-700'>
													{formatDate(sub.dateTheSubscriptionEnd)}
												</td>

												{/* Number of Videos */}
												<td className='px-6 py-4'>
													<span className='inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium'>
														<Icon
															icon='mdi:video'
															width='15'
														/>
														{sub.numberOfVideos ?? 0}{' '}
														{sub.numberOfVideos === 1 ? 'video' : 'videos'}
													</span>
												</td>

												{/* Status */}
												<td className='px-6 py-4'>
													<span
														className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
															active ?
																'bg-green-100 text-green-700'
															:	'bg-red-100 text-red-700'
														}`}>
														<Icon
															icon={
																active ? 'mdi:check-circle' : 'mdi:close-circle'
															}
															width='16'
														/>
														{active ? 'Active' : 'Expired'}
													</span>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>

					{/* Pagination */}
					<Pagination
						totalItems={subscriptions.length}
						itemsPerPage={itemsPerPage}
						currentPage={currentPage}
						onPageChange={setCurrentPage}
					/>
				</>
			}
		</div>
	);
}
