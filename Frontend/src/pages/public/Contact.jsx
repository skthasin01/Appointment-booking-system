import { useState } from 'react';
import {
  FaClock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import PageHeader from '../../components/common/PageHeader';
import SubmitButton from '../../components/form/SubmitButton';
import TextArea from '../../components/form/TextArea';
import TextInput from '../../components/form/TextInput';

const channels = [
  {
    icon: FaEnvelope,
    label: 'Email',
    value: 'support@appointease.com',
    hint: 'We reply within one business day.',
  },
  {
    icon: FaPhoneAlt,
    label: 'Phone',
    value: '+880 1700-000000',
    hint: 'Saturday to Thursday, working hours.',
  },
  {
    icon: FaMapMarkerAlt,
    label: 'Office',
    value: 'Khulna, Bangladesh',
    hint: 'Visits by appointment only.',
  },
  {
    icon: FaClock,
    label: 'Support hours',
    value: '9:00 AM – 8:00 PM',
    hint: 'Closed on Friday.',
  },
];

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};

    if (!form.name.trim()) {
      next.name = 'Your name is required';
    }

    if (!form.email.trim()) {
      next.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address';
    }

    if (!form.subject.trim()) {
      next.subject = 'Please add a subject';
    }

    if (!form.message.trim()) {
      next.message = 'Please tell us how we can help';
    } else if (form.message.trim().length < 10) {
      next.message = 'Please add a little more detail';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      toast.success('Thanks for reaching out. We will be in touch soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 600);
  };

  return (
    <div>
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <PageHeader
          eyebrow="Contact us"
          title="We are here to help"
          description="Questions about booking, your account, or partnering with AppointEase? Send us a message and our team will get back to you."
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body gap-5 p-6 sm:p-8">
              <div>
                <h2 className="text-xl font-semibold text-base-content">
                  Send us a message
                </h2>
                <p className="mt-1 text-sm text-base-content/60">
                  Fill in the form and we will route it to the right team.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput
                    label="Full name"
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder="Your name"
                    autoComplete="name"
                    error={errors.name}
                  />

                  <TextInput
                    label="Email address"
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    placeholder="you@example.com"
                    autoComplete="email"
                    error={errors.email}
                  />
                </div>

                <TextInput
                  label="Subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange('subject')}
                  placeholder="How can we help?"
                  error={errors.subject}
                />

                <TextArea
                  label="Message"
                  value={form.message}
                  onChange={handleChange('message')}
                  rows={5}
                  placeholder="Tell us a little about your question"
                  error={errors.message}
                />

                <SubmitButton loading={submitting}>Send message</SubmitButton>
              </form>
            </div>
          </div>

          <div className="space-y-5">
            {channels.map((channel) => (
              <div
                key={channel.label}
                className="card border border-base-300 bg-base-100 shadow-sm"
              >
                <div className="card-body flex-row items-start gap-4 p-5">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <channel.icon />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                      {channel.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-base-content">
                      {channel.value}
                    </p>
                    <p className="mt-0.5 text-xs text-base-content/60">
                      {channel.hint}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
