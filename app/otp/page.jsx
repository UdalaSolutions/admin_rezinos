'use client';

import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { verifyOtp, registerAdmin, sendOtp } from '../services/auth';

export default function OtpPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get('email') || '';

	const [otp, setOtp] = useState(['', '', '', '', '', '']);
	const [isLoading, setIsLoading] = useState(false);
	const [isResending, setIsResending] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [countdown, setCountdown] = useState(60);
	const [canResend, setCanResend] = useState(false);

	const inputRefs = useRef([]);
	const intervalRef = useRef(null);

	// Use an interval (not a countdown-dependent effect) so reload doesn't restart it
	useEffect(() => {
		intervalRef.current = setInterval(() => {
			setCountdown((c) => {
				if (c <= 1) {
					clearInterval(intervalRef.current);
					setCanResend(true);
					return 0;
				}
				return c - 1;
			});
		}, 1000);
		return () => clearInterval(intervalRef.current);
	}, []);

	const startCountdown = () => {
		clearInterval(intervalRef.current);
		setCountdown(60);
		setCanResend(false);
		intervalRef.current = setInterval(() => {
			setCountdown((c) => {
				if (c <= 1) {
					clearInterval(intervalRef.current);
					setCanResend(true);
					return 0;
				}
				return c - 1;
			});
		}, 1000);
	};

	const handleChange = (index, value) => {
		if (!/^\d?$/.test(value)) return;
		const updated = [...otp];
		updated[index] = value;
		setOtp(updated);
		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === 'Backspace' && !otp[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handlePaste = (e) => {
		e.preventDefault();
		const pasted = e.clipboardData
			.getData('text')
			.replace(/\D/g, '')
			.slice(0, 6);
		const updated = ['', '', '', '', '', ''];
		pasted.split('').forEach((char, i) => {
			updated[i] = char;
		});
		setOtp(updated);
		inputRefs.current[Math.min(pasted.length, 5)]?.focus();
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const code = otp.join('');
		if (code.length < 6) {
			setError('Please enter the full 6-digit code');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			await verifyOtp(email, code);

			const pending = sessionStorage.getItem('pendingRegistration');
			if (pending) {
				const userData = JSON.parse(pending);
				await registerAdmin(userData);
				sessionStorage.removeItem('pendingRegistration');
			}

			setSuccess('Account created! Redirecting to sign in...');
			setTimeout(() => router.push('/signin'), 1500);
		} catch (err) {
			setError(
				err.response?.data?.data ||
					err.response?.data?.message ||
					'Invalid or expired OTP',
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleResend = async () => {
		setIsResending(true);
		setError('');
		setSuccess('');
		// Clear OTP inputs immediately
		setOtp(['', '', '', '', '', '']);
		inputRefs.current[0]?.focus();

		try {
			await sendOtp(email);
			setSuccess('A new code has been sent to your email');
			startCountdown(); // restart timer
		} catch (err) {
			setError(
				err.response?.data?.data ||
					err.response?.data?.message ||
					'Failed to resend OTP',
			);
		} finally {
			setIsResending(false);
		}
	};

	return (
		<div className='max-h-screen flex'>
			{/* Image Section */}
			<div className='hidden lg:flex w-1/2 items-center justify-center'>
				<Image
					src='/auth_img.svg'
					alt='Verify OTP'
					className='w-full h-full object-cover rounded-r-3xl'
					height={0}
					width={0}
				/>
			</div>

			{/* Form Section */}
			<div className='flex-1 flex items-center justify-center p-8'>
				<div className='max-w-md w-full bg-white'>
					<div className='mb-6'>
						<div className='w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center mb-4'>
							<Icon
								icon='mdi:email-check-outline'
								width='28'
								className='text-pink-500'
							/>
						</div>
						<h2 className='text-3xl font-bold text-gray-900 mb-2'>
							Verify your email
						</h2>
						<p className='text-gray-500 text-sm'>
							We sent a 6-digit code to{' '}
							<span className='font-medium text-gray-700'>{email}</span>
						</p>
					</div>

					{error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
					{success && <p className='text-green-500 text-sm mb-4'>{success}</p>}

					<form
						onSubmit={handleSubmit}
						className='space-y-7'
						noValidate>
						<div
							className='flex gap-3 justify-between'
							onPaste={handlePaste}>
							{otp.map((digit, i) => (
								<input
									key={i}
									ref={(el) => (inputRefs.current[i] = el)}
									type='text'
									inputMode='numeric'
									maxLength={1}
									value={digit}
									onChange={(e) => handleChange(i, e.target.value)}
									onKeyDown={(e) => handleKeyDown(i, e)}
									className='w-12 h-14 text-center text-xl font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition'
								/>
							))}
						</div>

						<button
							type='submit'
							disabled={isLoading || !!success}
							className='w-full py-3 bg-linear-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
							{isLoading ?
								<>
									<Icon
										icon='mdi:loading'
										className='animate-spin'
										width='20'
									/>
									Verifying...
								</>
							:	'Verify & Create Account'}
						</button>
					</form>

					<div className='mt-6 text-center text-sm text-gray-500'>
						Didn&apos;t receive the code?{' '}
						{canResend ?
							<button
								onClick={handleResend}
								disabled={isResending}
								className='text-pink-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed'>
								{isResending ? 'Sending...' : 'Resend code'}
							</button>
						:	<span className='text-gray-400'>
								Resend in{' '}
								<span className='font-semibold text-gray-600'>
									{countdown}s
								</span>
							</span>
						}
					</div>
				</div>
			</div>
		</div>
	);
}
