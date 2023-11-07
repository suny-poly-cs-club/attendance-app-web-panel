import {ChangeEventHandler, FC, FormEventHandler, useState} from "react";
import * as Form from '@radix-ui/react-form';

import styles from './auth.module.css';
import {useAuth} from "../providers/auth";

export const LoginForm: FC = () => {
  const auth = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [err, setError] = useState<string | null>(null);

  const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
    setForm(form => ({
      ...form,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();

    try {
      await auth.login(form.email, form.password);
    } catch (err) {
      const error = err as Error;

      // TODO: check if this is invalid email/pass or different error
      setError(error.message);
    }
  };

  return (
    <Form.Root className={styles.formRoot} onSubmit={handleSubmit}>
      <Form.Field className={styles.formField} name="email">
        <div className={styles.formLabelInfo}>
          <Form.Label className={styles.formLabel}>Email</Form.Label>
          {err && (
            <Form.Message className={styles.formMessage}>{err}</Form.Message>
          )}

          <Form.Message
            match="valueMissing"
            className={styles.formMessage}
          >
            Please enter your email
          </Form.Message>

          <Form.Message
            match="typeMismatch"
            className={styles.formMessage}
          >
            Please provide a valid email
          </Form.Message>
        </div>

        <Form.Control
          type="email"
          className={styles.input}
          value={form.email}
          onChange={handleChange}
          required
        />
      </Form.Field>

      <Form.Field name="password" className={styles.formField}>
        <div className={styles.formLabelInfo}>
          <Form.Label className={styles.formLabel}>Password</Form.Label>
          {err && (
            <Form.Message className={styles.formMessage}>{err}</Form.Message>
          )}

          <Form.Message
            match="valueMissing"
            className={styles.formMessage}
          >
            Please enter your password
          </Form.Message>
        </div>

        <Form.Control
          type="password"
          className={styles.input}
          value={form.password}
          onChange={handleChange}
          required
        />

      </Form.Field>

      <Form.Submit asChild>
        <button type="submit" className={styles.submit}>Sign In</button>
      </Form.Submit>
    </Form.Root>
  )
}

export const SignUpForm: FC = () => {
  const auth = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [err, setError] = useState<string | null>(null);

  const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
    setForm(form => ({
      ...form,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();

    try {
      await auth.signUp(form);
    } catch (err) {
      const error = err as Error;

      // TODO: check if this is invalid email/pass or different error
      setError(error.message);
    }
  };

  return (
    <Form.Root className={styles.formRoot} onSubmit={handleSubmit}>
      <div className={styles.nameFields}>
        <Form.Field className={styles.formField} name="firstName">
          <Form.Label className={styles.formLabel}>First Name</Form.Label>

          <Form.Control
            type="text"
            className={styles.input}
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </Form.Field>

        <Form.Field className={styles.formField} name="lastName">
          <Form.Label className={styles.formLabel}>Last Name</Form.Label>

          <Form.Control
            type="text"
            className={styles.input}
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </Form.Field>
      </div>

      <Form.Field className={styles.formField} name="email">
        <div className={styles.formLabelInfo}>
          <Form.Label className={styles.formLabel}>Email</Form.Label>
          {err && (
            <Form.Message className={styles.formMessage}>{err}</Form.Message>
          )}

          <Form.Message
            match="valueMissing"
            className={styles.formMessage}
          >
            Please enter your email
          </Form.Message>

          <Form.Message
            match="typeMismatch"
            className={styles.formMessage}
          >
            Please provide a valid email
          </Form.Message>
        </div>

        <Form.Control
          type="email"
          className={styles.input}
          value={form.email}
          onChange={handleChange}
          required
        />
      </Form.Field>

      <Form.Field name="password" className={styles.formField}>
        <div className={styles.formLabelInfo}>
          <Form.Label className={styles.formLabel}>Password</Form.Label>
          {err && (
            <Form.Message className={styles.formMessage}>{err}</Form.Message>
          )}

          <Form.Message
            match="valueMissing"
            className={styles.formMessage}
          >
            Please enter your password
          </Form.Message>
        </div>

        <Form.Control
          type="password"
          className={styles.input}
          value={form.password}
          onChange={handleChange}
          required
        />

      </Form.Field>

      <Form.Submit asChild>
        <button type="submit" className={styles.submit}>Sign In</button>
      </Form.Submit>
    </Form.Root>
  )
}
