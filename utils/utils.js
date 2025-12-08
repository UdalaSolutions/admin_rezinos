export const predefinedCategories = [
	'acne',
	'anti-aging',
	'cleansing',
	'hydration',
	'moisturizing',
	'sun-protection',
	'morning-routine',
	'night-routine',
	'product-review',
	'tutorial',
	'diy-skincare',
];

export const menuItems = [
	{ name: 'Dashboard', href: '/dashboard', icon: 'mdi:view-dashboard-outline' },
	{ name: 'Videos', href: '/admin/videos', icon: 'mdi:video-outline' },
	{
		name: 'Users',
		href: '/admin/users',
		icon: 'mdi:account-multiple-outline',
	},
	{
		name: 'Subscriptions',
		href: '/admin/subscriptions',
		icon: 'mdi:credit-card-outline',
	},
];

export const stats = [
	{
		title: 'Total Users',
		value: '1,234',
		change: '+12%',
		icon: 'mdi:account-multiple-outline',
		color: 'from-blue-500 to-blue-600',
	},
	{
		title: 'Active Subscriptions',
		value: '856',
		change: '+8%',
		icon: 'mdi:credit-card-outline',
		color: 'from-green-500 to-green-600',
	},
	{
		title: 'Total Videos',
		value: '42',
		change: '+3',
		icon: 'mdi:video-outline',
		color: 'from-purple-500 to-purple-600',
	},
	{
		title: 'Monthly Revenue',
		value: '₦428,000',
		change: '+23%',
		icon: 'mdi:cash-multiple',
		color: 'from-pink-500 to-pink-600',
	},
];

export const recentActivities = [
	{
		id: 1,
		type: 'user',
		message: 'New user registered: John Doe',
		time: '5 minutes ago',
		icon: 'mdi:account-plus-outline',
		color: 'bg-blue-100 text-blue-600',
	},
	{
		id: 2,
		type: 'subscription',
		message: 'New subscription: Monthly plan',
		time: '15 minutes ago',
		icon: 'mdi:credit-card-outline',
		color: 'bg-green-100 text-green-600',
	},
	{
		id: 3,
		type: 'video',
		message: 'New video uploaded: Morning Routine',
		time: '1 hour ago',
		icon: 'mdi:video-outline',
		color: 'bg-purple-100 text-purple-600',
	},
	{
		id: 4,
		type: 'user',
		message: 'User deleted: Jane Smith',
		time: '2 hours ago',
		icon: 'mdi:account-remove-outline',
		color: 'bg-red-100 text-red-600',
	},
];

export const quickActions = [
	{
		title: 'Create Video',
		description: 'Upload new skincare video',
		href: '/admin/videos',
		icon: 'mdi:video-outline',
		color: 'from-pink-500 to-pink-600',
	},
	{
		title: 'View Users',
		description: 'Manage user accounts',
		href: '/admin/users',
		icon: 'mdi:account-multiple-outline',
		color: 'from-blue-500 to-blue-600',
	},
	{
		title: 'Subscriptions',
		description: 'View all subscriptions',
		href: '/admin/subscriptions',
		icon: 'mdi:credit-card-outline',
		color: 'from-green-500 to-green-600',
	},
];
