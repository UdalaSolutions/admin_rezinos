'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { sendOtp } from '../services/auth';

export default function SignUpPage() {
	const router = useRouter();
	const [form, setForm] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleChange = (e) => {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		if (form.password !== form.confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		setIsLoading(true);

		try {
			// Step 1: Send OTP to email
			await sendOtp(form.email);

			// Save form data so OTP page can complete registration after verification
			sessionStorage.setItem(
				'pendingRegistration',
				JSON.stringify({
					firstName: form.firstName,
					lastName: form.lastName,
					email: form.email,
					password: form.password,
				}),
			);

			router.push(`/otp?email=${encodeURIComponent(form.email)}`);
		} catch (err) {
			setError(
				err.response?.data?.data ||
					err.response?.data?.message ||
					'Failed to send verification code',
			);
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
					alt='Sign up'
					className='w-full h-full object-cover rounded-r-3xl'
					height={0}
					width={0}
				/>
			</div>

			{/* Form Section */}
			<div className='flex-1 flex items-center justify-center p-8'>
				<div className='max-w-md w-full bg-white'>
					<h2 className='text-3xl font-bold text-gray-900 mb-2'>
						Create Account
					</h2>
					<p className='text-gray-500 mb-6'>Sign up for a new admin account</p>

					{error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

					<form
						onSubmit={handleSubmit}
						className='space-y-5'
						noValidate>
						{/* First & Last Name */}
						<div className='flex gap-3'>
							<div className='relative flex-1'>
								<Icon
									icon='mdi:account-outline'
									width='20'
									className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
								/>
								<input
									type='text'
									name='firstName'
									placeholder='First name'
									value={form.firstName}
									onChange={handleChange}
									required
									className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition'
								/>
							</div>
							<div className='relative flex-1'>
								<Icon
									icon='mdi:account-outline'
									width='20'
									className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
								/>
								<input
									type='text'
									name='lastName'
									placeholder='Last name'
									value={form.lastName}
									onChange={handleChange}
									required
									className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition'
								/>
							</div>
						</div>

						{/* Email */}
						<div className='relative'>
							<Icon
								icon='mdi:email-outline'
								width='20'
								className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
							/>
							<input
								type='email'
								name='email'
								placeholder='Email address'
								value={form.email}
								onChange={handleChange}
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
								name='password'
								placeholder='Password'
								value={form.password}
								onChange={handleChange}
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

						{/* Confirm Password */}
						<div className='relative'>
							<Icon
								icon='mdi:lock-check-outline'
								width='20'
								className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
							/>
							<input
								type={showConfirm ? 'text' : 'password'}
								name='confirmPassword'
								placeholder='Confirm password'
								value={form.confirmPassword}
								onChange={handleChange}
								required
								className='w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition'
							/>
							<button
								type='button'
								onClick={() => setShowConfirm(!showConfirm)}
								className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition'>
								<Icon
									icon={showConfirm ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}
									width='20'
								/>
							</button>
						</div>

						{/* Submit */}
						<button
							type='submit'
							disabled={isLoading}
							className='w-full py-3 bg-linear-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
							{isLoading ?
								<>
									<Icon
										icon='mdi:loading'
										className='animate-spin'
										width='20'
									/>
									Sending code...
								</>
							:	'Continue'}
						</button>
					</form>

					{/* Footer */}
					<div className='mt-6 text-center text-sm text-gray-500'>
						Already have an account?{' '}
						<Link
							href='/'
							className='text-pink-500 hover:underline'>
							Sign in
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
