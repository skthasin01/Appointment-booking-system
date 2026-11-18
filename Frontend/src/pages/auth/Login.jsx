import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';

import AuthShell from '../../components/common/AuthShell';
import PasswordInput from '../../components/form/PasswordInput';
import SubmitButton from '../../components/form/SubmitButton';
import TextInput from '../../components/form/TextInput';
import useAuth from '../../hooks/useAuth';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};

    if (!form.email.trim()) {
      next.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address';
    }

    if (!form.password) {
      next.password = 'Password is required';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      const user = await login(form.email.trim(), form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`);

      if (user.role === 'provider') {
        navigate('/doctor/dashboard', { replace: true });
      } else {
        navigate(location.state?.from || '/', { replace: true });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.detail || 'Unable to sign in. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your appointments and book new ones."
      footer={
        <>
          New to AppointEase?{' '}
          <Link
            to="/register"
            className="font-semibold text-primary hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextInput
          label="Email address"
          type="email"
          icon={FaEnvelope}
          value={form.email}
          onChange={handleChange('email')}
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email}
        />

        <PasswordInput
          label="Password"
          icon={FaLock}
          value={form.password}
          onChange={handleChange('password')}
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password}
        />

        <SubmitButton loading={submitting} className="w-full">
          Sign In
        </SubmitButton>
      </form>
    </AuthShell>
  );
};

export default Login;
