
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

const SignUp: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const success = await signUp({ fullName, username, phoneNumber, password });
    setLoading(false);

    if (success) {
      setSuccess('Account created successfully! Redirecting to sign in...');
      setTimeout(() => navigate('/signin'), 2000);
    } else {
      setError('Username already exists. Please choose another one.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a new account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center">{success}</p>}

            <Input id="fullName" label="Full Name" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />
            <Input id="username" label="Username" type="text" value={username} onChange={e => setUsername(e.target.value)} required />
            <Input id="phoneNumber" label="Phone Number" type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
            <Input id="password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />

            <div>
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Creating account...' : 'Sign up'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
