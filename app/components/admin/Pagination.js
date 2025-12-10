'use client';

export default function Pagination({
	totalItems,
	itemsPerPage,
	currentPage,
	onPageChange,
}) {
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	if (totalPages <= 1) return null;

	const pages = [];
	for (let i = 1; i <= totalPages; i++) pages.push(i);

	return (
		<div className='flex justify-center mt-4 space-x-2'>
			{pages.map((page) => (
				<button
					key={page}
					onClick={() => onPageChange(page)}
					className={`px-4 py-2 rounded-lg border ${
						page === currentPage
							? 'bg-pink-50 text-pink-600 border border-pink-100'
							: 'bg-white text-gray-700 border-gray-300 hover:bg-pink-50 hover:text-pink-600'
					}`}>
					{page}
				</button>
			))}
		</div>
	);
}
