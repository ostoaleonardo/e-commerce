'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../utils/supabase'
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card'
import { Progress } from '@nextui-org/progress'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import Link from 'next/link'

export default function Login() {
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

    const validateEmail = (email) => email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i)

    const handleLogin = async () => {
        if (validateEmail(email) && password !== '') {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
        }
    }

    const isEmailInvalid = useMemo(() => {
        if (email === '') return false
        return validateEmail(email) ? false : true
    }, [email])

    const isPasswordInvalid = useMemo(() => {
        if (password === '') return false
    }, [password])

    return (
        <main className='w-full min-h-screen flex flex-col items-center justify-center'>
            <Card className='w-[calc(100%_-_2rem)] sm:w-1/3 sm:min-w-[500px] px-6' shadow='none'>
                <CardHeader className='flex flex-col items-start pt-10 pb-8 gap-2'>
                    <h1 className='text-4xl font-bold'>Login</h1>
                    <span className='text-foreground-500'>Login to access your account</span>
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
                        errorMessage={isPasswordInvalid && 'Please enter a password'}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        size='lg'
                        radius='lg'
                        color='primary'
                        className='w-full mt-6'
                        onPress={handleLogin}
                    >
                        Sign In
                    </Button>
                </CardBody>
                <CardFooter className='justify-center py-10'>
                    <span className='text-foreground-500'>
                        Don't have an account?{' '}
                        <Link href='/register' className='text-primary-500'>
                            Register
                        </Link>
                    </span>
                </CardFooter>
            </Card>
        </main>
    )
}
