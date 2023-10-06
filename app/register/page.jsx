'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../utils/supabase'
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card'
import { Progress } from '@nextui-org/progress'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import Link from 'next/link'

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [secureValue, setSecureValue] = useState(0)
    const [security, setSecurity] = useState({
        hasNumber: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasSpecialChar: false,
        isLargeEnough: false,
    })

    useEffect(() => {
        checkSecureValue(password)
    }, [password])

    const handleRegister = async () => {
        if (secureValue === 100) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (!error) {
                setEmail('')
                setPassword('')
            }
        }
    }

    const validateEmail = (email) => email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i)

    const isEmailInvalid = useMemo(() => {
        if (email === '') return false
        return validateEmail(email) ? false : true
    }, [email])

    const isPasswordSecure = useMemo(() => {
        const { isLargeEnough, hasNumber, hasSpecialChar, hasUpperCase, hasLowerCase } = security
        return isLargeEnough && hasNumber && hasSpecialChar && hasUpperCase && hasLowerCase
    }, [security])

    const isPasswordInvalid = useMemo(() => {
        if (password === '') return false
        return !isPasswordSecure
    }, [password, isPasswordSecure])

    const checkSecureValue = (password) => {
        // Regular expressions to check the criteria
        const numbers = new RegExp('[0-9]')
        const upperCase = new RegExp('[A-Z]')
        const lowerCase = new RegExp('[a-z]')
        const specialChars = new RegExp('[!@#$%^&*(),.?":{}|<>]')

        // Check if the criteria is met
        const hasNumber = numbers.test(password)
        const hasUpperCase = upperCase.test(password)
        const hasLowerCase = lowerCase.test(password)
        const hasSpecialChar = specialChars.test(password)
        const isLargeEnough = password.length >= 8

        setSecurity({
            hasNumber,
            hasUpperCase,
            hasLowerCase,
            hasSpecialChar,
            isLargeEnough,
        })

        // Calculate the secureValue based on the criteria met
        const secureValue =
            (hasNumber ? 1 : 0) +
            (hasUpperCase ? 1 : 0) +
            (hasLowerCase ? 1 : 0) +
            (hasSpecialChar ? 1 : 0) +
            (isLargeEnough ? 1 : 0)

        setSecureValue((secureValue / 5) * 100)
    }

    const setLabel = () => {
        const { isLargeEnough, hasNumber, hasSpecialChar, hasUpperCase, hasLowerCase } = security

        if (!isLargeEnough) return 'Your password is too short'
        if (!hasNumber) return 'Your password must contain at least one number'
        if (!hasUpperCase) return 'Your password must contain at least one uppercase character'
        if (!hasLowerCase) return 'Your password must contain at least one lowercase character'
        if (!hasSpecialChar) return 'Your password must contain at least one special character'
        return 'Password is secure'
    }

    return (
        <main className='w-full min-h-screen flex flex-col items-center justify-center'>
            <Card className='w-[calc(100%_-_2rem)] sm:w-1/3 sm:min-w-[500px] px-6' shadow='none'>
                <CardHeader className='flex flex-col items-start pt-10 pb-8 gap-2'>
                    <h1 className='text-4xl font-bold'>Register</h1>
                    <span className='text-foreground-500'>Register to access your account</span>
                </CardHeader>
                <CardBody className='gap-4 p-3'>
                    <Input
                        type='email'
                        label='Email'
                        value={email}
                        variant='bordered'
                        labelPlacement='inside'
                        isInvalid={isEmailInvalid}
                        placeholder='Enter your email'
                        errorMessage={isEmailInvalid && 'Please enter a valid email'}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        type='password'
                        label='Password'
                        value={password}
                        variant='bordered'
                        labelPlacement='inside'
                        isInvalid={isPasswordInvalid}
                        placeholder='Enter your password'
                        errorMessage={isPasswordInvalid && setLabel()}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {password !== '' && (
                        <Progress
                            size='sm'
                            value={secureValue}
                            aria-label='Password strength'
                            color={
                                secureValue === 100
                                    ? 'success'
                                    : secureValue >= 50
                                        ? 'warning'
                                        : 'danger'
                            }
                            className='h-[0.15rem]'
                        />
                    )}
                    <Button
                        size='lg'
                        radius='lg'
                        color='primary'
                        className='w-full mt-6'
                        onPress={handleRegister}
                    >
                        Sign Up
                    </Button>
                </CardBody>
                <CardFooter className='justify-center py-10'>
                    <span className='text-foreground-500'>
                        Already have an account?{' '}
                        <Link href='/login' className='text-primary-500'>
                            Login
                        </Link>
                    </span>
                </CardFooter>
            </Card>
        </main>
    )
}
