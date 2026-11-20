import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { FaEnvelope, FaLock, FaPhoneAlt, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';

import AuthShell from '../../components/common/AuthShell';
import CheckboxField from '../../components/form/CheckboxField';
import PasswordInput from '../../components/form/PasswordInput';
import SubmitButton from '../../components/form/SubmitButton';
import TextInput from '../../components/form/TextInput';
import useAuth from '../../hooks/useAuth';
import getErrorMessage from '../../utils/getErrorMessage';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};

    if (!form.name.trim()) {
      next.name = 'Full name is required';
    }

    if (!form.email.trim()) {
      next.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address';
    }

    if (form.phone.trim() && !/^[+\d][\d\s-]{6,}$/.test(form.phone.trim())) {
      next.phone = 'Enter a valid phone number';
    }

    if (!form.password) {
      next.password = 'Password is required';
    } else if (form.password.length < 8) {
      next.password = 'Use at least 8 characters';
    } else if (form.password.length > 72) {
      next.password = 'Use at most 72 characters';
    }

    if (form.confirm !== form.password) {
      next.confirm = 'Passwords do not match';
    }

    if (!terms) {
      next.terms = 'Please accept the terms to continue';
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
      // Public sign-up always creates a patient account (backend rule)
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim() || undefined,
      });

      toast.success('Account created successfully');

      navigate('/doctors', { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to create your account'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Book appointments with verified doctors in a few taps."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextInput
          label="Full name"
          type="text"
          icon={FaUser}
          value={form.name}
          onChange={handleChange('name')}
          placeholder="Your full name"
          autoComplete="name"
          error={errors.name}
        />

        <div className="grid gap-4 sm:grid-cols-2">
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

          <TextInput
            label="Phone"
            optional
            type="tel"
            icon={FaPhoneAlt}
            value={form.phone}
            onChange={handleChange('phone')}
            placeholder="+880 1700-000000"
            autoComplete="tel"
            error={errors.phone}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <PasswordInput
            label="Password"
            icon={FaLock}
            value={form.password}
            onChange={handleChange('password')}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            error={errors.password}
          />

          <PasswordInput
            label="Confirm password"
            icon={FaLock}
            value={form.confirm}
            onChange={handleChange('confirm')}
            placeholder="Repeat your password"
            autoComplete="new-password"
            error={errors.confirm}
          />
        </div>

        <CheckboxField
          label="I agree to the Terms of Service and Privacy Policy."
          checked={terms}
          onChange={(event) => {
            setTerms(event.target.checked);
            setErrors((prev) => ({ ...prev, terms: undefined }));
          }}
          error={errors.terms}
        />

        <SubmitButton loading={submitting} className="w-full">
          Create Account
        </SubmitButton>
      </form>
    </AuthShell>
  );
};

export default Register;
