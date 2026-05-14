'use client';

import { useActionState, useId } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button, FieldError, HoneypotField, Input, Label } from '@/shared/ui';
import { cn } from '@/shared/model/libs/cn';
import { submitWaitlist } from '../api/submit-waitlist';
import { SERVER_ERROR_KEY } from '../model/constants';
import { initialState } from '../model/initial-state';
import { SuccessBlockClient } from './SuccessBlockClient';

type TConsentSegment =
  | { type: 'text'; value: string }
  | { type: 'link'; text: string; href: string };

const parseConsentLabel = (input: string): TConsentSegment[] => {
  const segments: TConsentSegment[] = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: input.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'link', text: match[1] ?? '', href: match[2] ?? '' });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < input.length) {
    segments.push({ type: 'text', value: input.slice(lastIndex) });
  }

  return segments;
}

const selectCls = cn(
  'block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors',
  'min-h-11',
  'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary-pale',
  'disabled:cursor-not-allowed disabled:bg-surface',
);

export const WaitlistForm = () => {
  const tForm = useTranslations('WaitlistPage.form');
  const tErrors = useTranslations('WaitlistPage.form.errors');
  const tCommon = useTranslations('Common');
  const bonusThreshold = tForm.raw('progress.bonusThreshold') as number;

  const [state, formAction, pending] = useActionState(submitWaitlist, initialState);

  const formErrorId = useId();
  const firstNameErrorId = useId();
  const lastNameErrorId = useId();
  const emailErrorId = useId();
  const segmentErrorId = useId();
  const langHintId = useId();
  const countryErrorId = useId();
  const countryHintId = useId();
  const planErrorId = useId();
  const consentErrorId = useId();

  if (state.success) {
    return <SuccessBlockClient position={state.position} bonusThreshold={bonusThreshold} />;
  }

  // Map server error keys to translated strings
  const generalErrors = state.errors.map((key) =>
    key === SERVER_ERROR_KEY ? tErrors('serverError') : key,
  );

  function translateFieldErrors(
    errorKeys: string[] | undefined,
    fieldKey: string,
  ): string[] | undefined {
    if (!errorKeys || errorKeys.length === 0) return undefined;
    return errorKeys.map((key) => {
      if (key === 'email.invalid') return tErrors('emailInvalid');
      if (fieldKey === 'consent') return tErrors('consentRequired');
      if (fieldKey === 'email') return tErrors('emailInvalid');
      return tErrors('required');
    });
  }

  const consentLabel = tForm('fields.consent.label');
  const consentSegments = parseConsentLabel(consentLabel);

  const segmentOptions = tForm.raw('fields.segment.options') as Array<{
    value: string;
    label: string;
  }>;
  const langOptions = tForm.raw('fields.lang.options') as Array<{
    value: string;
    label: string;
  }>;
  const countryOptions = tForm.raw('fields.country.options') as Array<{
    value: string;
    label: string;
  }>;
  const planOptions = tForm.raw('fields.plan.options') as Array<{
    value: string;
    title: string;
    subtitle: string;
  }>;

  const countryAriaDescribedBy = cn(
    state.fieldErrors['country'] && countryErrorId,
    countryHintId,
  );

  return (
    <form
      action={formAction}
      aria-busy={pending}
      aria-describedby={generalErrors.length > 0 ? formErrorId : undefined}
      noValidate
    >
      <HoneypotField name="website" />

      {/* Live region for pending state */}
      <div role="status" aria-live="polite" className="sr-only">
        {pending ? tCommon('submitting') : ''}
      </div>

      {/* General server errors */}
      {generalErrors.length > 0 ? (
        <div id={formErrorId} className="mb-6">
          <FieldError errors={generalErrors} />
        </div>
      ) : null}

      <div className="space-y-5">
        {/* firstName */}
        <div>
          <Label htmlFor="firstName">
            {tForm('fields.firstName.label')}
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          </Label>
          <div className="mt-1.5">
            <Input
              id="firstName"
              name="firstName"
              type="text"
              inputMode="text"
              autoComplete="given-name"
              placeholder={tForm('fields.firstName.placeholder')}
              required
              aria-required="true"
              invalid={!!state.fieldErrors['firstName']}
              aria-invalid={!!state.fieldErrors['firstName']}
              aria-describedby={state.fieldErrors['firstName'] ? firstNameErrorId : undefined}
              defaultValue={state.prev['firstName'] ?? ''}
              disabled={pending}
            />
          </div>
          <FieldError
            id={firstNameErrorId}
            errors={translateFieldErrors(state.fieldErrors['firstName'], 'firstName')}
          />
        </div>

        {/* lastName */}
        <div>
          <Label htmlFor="lastName">{tForm('fields.lastName.label')}</Label>
          <div className="mt-1.5">
            <Input
              id="lastName"
              name="lastName"
              type="text"
              inputMode="text"
              autoComplete="family-name"
              placeholder={tForm('fields.lastName.placeholder')}
              invalid={!!state.fieldErrors['lastName']}
              aria-invalid={!!state.fieldErrors['lastName']}
              aria-describedby={state.fieldErrors['lastName'] ? lastNameErrorId : undefined}
              defaultValue={state.prev['lastName'] ?? ''}
              disabled={pending}
            />
          </div>
          <FieldError
            id={lastNameErrorId}
            errors={translateFieldErrors(state.fieldErrors['lastName'], 'lastName')}
          />
        </div>

        {/* email */}
        <div>
          <Label htmlFor="email">
            {tForm('fields.email.label')}
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          </Label>
          <div className="mt-1.5">
            <Input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={tForm('fields.email.placeholder')}
              required
              aria-required="true"
              invalid={!!state.fieldErrors['email']}
              aria-invalid={!!state.fieldErrors['email']}
              aria-describedby={state.fieldErrors['email'] ? emailErrorId : undefined}
              defaultValue={state.prev['email'] ?? ''}
              disabled={pending}
            />
          </div>
          <FieldError
            id={emailErrorId}
            errors={translateFieldErrors(state.fieldErrors['email'], 'email')}
          />
        </div>

        {/* segment */}
        <div>
          <Label htmlFor="segment">
            {tForm('fields.segment.label')}
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          </Label>
          <div className="mt-1.5">
            <select
              id="segment"
              name="segment"
              required
              aria-required="true"
              aria-invalid={!!state.fieldErrors['segment']}
              aria-describedby={state.fieldErrors['segment'] ? segmentErrorId : undefined}
              defaultValue={state.prev['segment'] ?? ''}
              disabled={pending}
              className={cn(
                selectCls,
                state.fieldErrors['segment']
                  ? 'border-red-500 focus-visible:ring-red-100'
                  : 'border-line-strong',
              )}
            >
              <option value="" disabled>
                {tForm('fields.segment.placeholder')}
              </option>
              {segmentOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <FieldError
            id={segmentErrorId}
            errors={translateFieldErrors(state.fieldErrors['segment'], 'segment')}
          />
        </div>

        {/* lang (optional) */}
        <div>
          <Label htmlFor="lang">{tForm('fields.lang.label')}</Label>
          <div className="mt-1.5">
            <select
              id="lang"
              name="lang"
              aria-invalid={!!state.fieldErrors['lang']}
              aria-describedby={langHintId}
              defaultValue={state.prev['lang'] ?? ''}
              disabled={pending}
              className={cn(
                selectCls,
                state.fieldErrors['lang']
                  ? 'border-red-500 focus-visible:ring-red-100'
                  : 'border-line-strong',
              )}
            >
              <option value="">{tForm('fields.lang.placeholder')}</option>
              {langOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <p id={langHintId} className="mt-1.5 text-xs text-muted">
            {tForm('fields.lang.hint')}
          </p>
        </div>

        {/* country */}
        <div>
          <Label htmlFor="country">
            {tForm('fields.country.label')}
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          </Label>
          <div className="mt-1.5">
            <select
              id="country"
              name="country"
              required
              aria-required="true"
              aria-invalid={!!state.fieldErrors['country']}
              aria-describedby={countryAriaDescribedBy || undefined}
              defaultValue={state.prev['country'] ?? ''}
              disabled={pending}
              className={cn(
                selectCls,
                state.fieldErrors['country']
                  ? 'border-red-500 focus-visible:ring-red-100'
                  : 'border-line-strong',
              )}
            >
              <option value="" disabled>
                {tForm('fields.country.placeholder')}
              </option>
              {countryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <FieldError
            id={countryErrorId}
            errors={translateFieldErrors(state.fieldErrors['country'], 'country')}
          />
          <p id={countryHintId} className="mt-1.5 text-xs text-muted">
            {tForm('fields.country.hint')}
          </p>
        </div>

        {/* plan — radio group */}
        <fieldset>
          <legend className="block text-sm font-medium text-ink">
            {tForm('fields.plan.label')}
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          </legend>
          <div
            aria-describedby={state.fieldErrors['plan'] ? planErrorId : undefined}
            className="mt-2 grid gap-3 sm:grid-cols-2"
          >
            {planOptions.map((opt) => {
              const isDefault = !state.prev['plan'] && opt.value === 'plus';
              const isSelected = state.prev['plan'] === opt.value || isDefault;
              return (
                <label
                  key={opt.value}
                  className={cn(
                    'relative flex cursor-pointer flex-col gap-1 rounded-xl border p-4 transition-colors',
                    'has-[:checked]:border-primary has-[:checked]:bg-primary-pale',
                    state.fieldErrors['plan']
                      ? 'border-red-500'
                      : 'border-line-strong hover:border-primary',
                  )}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={opt.value}
                    required
                    defaultChecked={isSelected}
                    disabled={pending}
                    className="sr-only"
                  />
                  <span className="font-semibold text-ink">{opt.title}</span>
                  <span className="text-sm text-muted">{opt.subtitle}</span>
                </label>
              );
            })}
          </div>
          <FieldError
            id={planErrorId}
            errors={translateFieldErrors(state.fieldErrors['plan'], 'plan')}
          />
        </fieldset>

        {/* consent */}
        <div>
          <div className="flex items-start gap-3">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              value="on"
              required
              aria-required="true"
              aria-invalid={!!state.fieldErrors['consent']}
              aria-describedby={state.fieldErrors['consent'] ? consentErrorId : undefined}
              disabled={pending}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-line-strong accent-primary"
            />
            <label
              htmlFor="consent"
              className="text-sm leading-snug text-muted"
            >
              {consentSegments.map((seg, i) => {
                if (seg.type === 'link') {
                  return (
                    <Link
                      key={i}
                      href={seg.href}
                      className="underline hover:text-ink"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {seg.text}
                    </Link>
                  );
                }
                return <span key={i}>{seg.value}</span>;
              })}
            </label>
          </div>
          <FieldError
            id={consentErrorId}
            errors={translateFieldErrors(state.fieldErrors['consent'], 'consent')}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="mt-8">
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={pending}
          aria-disabled={pending}
        >
          {pending ? tCommon('submitting') : tForm('submit')}
        </Button>
        <p className="mt-3 text-center text-xs text-muted">
          {tForm('hint')}
        </p>
      </div>
    </form>
  );
}
