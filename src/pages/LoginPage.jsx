import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../features/authSlice';
import { TEInput, TERipple } from 'tw-elements-react';
import './Login.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const status = useSelector((state) => state.auth.status);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    useEffect(() => {
        if (status === 'logged_in') {
            // navigate('/dashboard'); // Uncomment this line to redirect to the dashboard
        }
    }, [status, navigate]);

    return (
        <section className="h-screen">
            <div className="h-full">
                <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
                    <div className="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
                        <img
                            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                            className="w-full"
                            alt="Sample image"
                        />
                    </div>
                    <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-row items-center justify-center lg:justify-start">
                                <p className="mb-0 mr-4 text-lg">Sign in with</p>
                                <TERipple rippleColor="light">
                                    <button type="button" className="mx-1 h-9 w-9 rounded-full bg-primary uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-lg focus:bg-primary-600 focus:shadow-lg focus:outline-none active:bg-primary-700 active:shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                        </svg>
                                    </button>
                                </TERipple>
                            </div>
                            <div className="my-4 flex items-center before:mr-4 before:flex-1 before:border-t before:border-neutral-300 after:ml-4 after:flex-1 after:border-t after:border-neutral-300">
                                <p className="mx-4 mb-0 text-center font-semibold dark:text-white">Or</p>
                            </div>
                            <TEInput type="text" label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-6" />
                            <TEInput type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-6" />
                            <div className="mb-[0.125rem] min-h-[1.5rem] flex items-center">
                                <input className="mr-2 h-4 w-4 appearance-none rounded-sm border border-gray-300 bg-white checked:bg-primary checked:border-primary focus:outline-none" type="checkbox" value="" id="rememberMe" />
                                <label className="inline-block pl-[0.15rem] hover:cursor-pointer">Remember me</label>
                            </div>
                            <a href="#!" className="text-primary transition duration-200 ease-in-out hover:text-primary-700 focus:text-primary-700 active:text-primary-800">Forgot password?</a>
                            <div className="text-center lg:text-left mt-4">
                                <button type="submit" className="inline-block rounded bg-primary px-7 py-3 text-sm font-medium uppercase leading-snug text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none active:bg-primary-800 active:shadow-lg">Login</button>
                                <p className="mt-2 mb-0 pt-1 text-sm font-semibold">
                                    Don't have an account?
                                    <a href="#!" className="text-danger transition duration-200 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700"> Register</a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;
