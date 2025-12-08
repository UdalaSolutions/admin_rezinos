'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { signIn } from '@/app/services/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SignInPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		try {
			await signIn(email, password);
			router.push('/dashboard');
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='max-h-screen flex'>
			{/* Image Section */}
			<div className='hidden lg:flex w-1/2 items-center justify-center'>
				<Image
					src='/auth_img.svg'
					alt='Sign in'
					className='w-full h-full object-cover rounded-r-3xl'
					height={0}
					width={0}
				/>
			</div>

			{/* Form Section */}
			<div className='flex-1 flex items-center justify-center p-8'>
				<div className='max-w-md w-full bg-white '>
					<h2 className='text-3xl font-bold text-gray-900 mb-2'>
						Welcome Back
					</h2>
					<p className='text-gray-500 mb-6'>Sign in to your admin account</p>

					{error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

					<form
						onSubmit={handleSubmit}
						className='space-y-7'
						noValidate>
						{/* Email */}
						<div className='relative'>
							<Icon
								icon='mdi:email-outline'
								width='20'
								className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
							/>
							<input
								type='email'
								placeholder='Email address'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition'
							/>
						</div>

						{/* Password */}
						<div className='relative'>
							<Icon
								icon='mdi:lock-outline'
								width='20'
								className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
							/>
							<input
								type={showPassword ? 'text' : 'password'}
								placeholder='Password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className='w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition'
							/>
							<button
								type='button'
								onClick={() => setShowPassword(!showPassword)}
								className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition'>
								<Icon
									icon={
										showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'
									}
									width='20'
								/>
							</button>
						</div>

						{/* Submit */}
						<button
							type='submit'
							disabled={isLoading}
							className='w-full py-3 bg-linear-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
							{isLoading ? (
								<>
									<Icon
										icon='mdi:loading'
										className='animate-spin'
										width='20'
									/>
									Signing in...
								</>
							) : (
								'Sign In'
							)}
						</button>
					</form>

					{/* Footer */}
					<div className='mt-6 text-center text-sm text-gray-500'>
						Don’t have an account?{' '}
						<Link
							href='/signup'
							className='text-pink-500 hover:underline'>
							Sign up
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
