'use client';

import { useActionState, useId } from 'react';
import { useTranslations } from 'next-intl';
import { Button, FieldError, HoneypotField } from '@/shared/ui';
import { submitWaitlist } from '../api/submit-waitlist';
import { SERVER_ERROR_KEY } from '../model/constants';
import { initialState } from '../model/initial-state';
import { SuccessBlockClient } from './SuccessBlockClient';
import { TextField, SelectField, RadioPlanField, ConsentField } from './fields';

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
};

export const WaitlistForm = () => {
  const tForm = useTranslations('WaitlistPage.form');
  const tErrors = useTranslations('WaitlistPage.form.errors');
  const tCommon = useTranslations('Common');
  const bonusThreshold = tForm.raw('progress.bonusThreshold') as number;

  const [state, formAction, pending] = useActionState(submitWaitlist, initialState);

  const formErrorId = useId();
  const firstNameErrorId = useId();
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

  const generalErrors = state.errors.map((key) =>
    key === SERVER_ERROR_KEY ? tErrors('serverError') : key,
  );

  const translateFieldErrors = (
    errorKeys: string[] | undefined,
    fieldKey: string,
  ): string[] | undefined => {
    if (!errorKeys || errorKeys.length === 0) return undefined;
    return errorKeys.map((key) => {
      if (key === 'email.invalid') return tErrors('emailInvalid');
      if (fieldKey === 'consent') return tErrors('consentRequired');
      if (fieldKey === 'email') return tErrors('emailInvalid');
      return tErrors('required');
    });
  };

  const consentSegments = parseConsentLabel(tForm('fields.consent.label'));

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

  return (
    <form
      action={formAction}
      aria-busy={pending}
      aria-describedby={generalErrors.length > 0 ? formErrorId : undefined}
      noValidate
    >
      <HoneypotField name="company_url" />

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
        <TextField
          id="firstName"
          name="firstName"
          label={tForm('fields.firstName.label')}
          placeholder={tForm('fields.firstName.placeholder')}
          required
          type="text"
          inputMode="text"
          autoComplete="given-name"
          invalid={!!state.fieldErrors['firstName']}
          errors={translateFieldErrors(state.fieldErrors['firstName'], 'firstName')}
          errorId={firstNameErrorId}
          defaultValue={state.prev['firstName'] ?? ''}
          disabled={pending}
        />

        <TextField
          id="email"
          name="email"
          label={tForm('fields.email.label')}
          placeholder={tForm('fields.email.placeholder')}
          required
          type="email"
          inputMode="email"
          autoComplete="email"
          invalid={!!state.fieldErrors['email']}
          errors={translateFieldErrors(state.fieldErrors['email'], 'email')}
          errorId={emailErrorId}
          defaultValue={state.prev['email'] ?? ''}
          disabled={pending}
        />

        <SelectField
          id="segment"
          name="segment"
          label={tForm('fields.segment.label')}
          placeholder={tForm('fields.segment.placeholder')}
          required
          invalid={!!state.fieldErrors['segment']}
          errors={translateFieldErrors(state.fieldErrors['segment'], 'segment')}
          errorId={segmentErrorId}
          options={segmentOptions}
          defaultValue={state.prev['segment'] ?? ''}
          disabled={pending}
        />

        <SelectField
          id="lang"
          name="lang"
          label={tForm('fields.lang.label')}
          invalid={!!state.fieldErrors['lang']}
          options={langOptions}
          defaultValue={state.prev['lang'] ?? ''}
          hint={tForm('fields.lang.hint')}
          hintId={langHintId}
          disabled={pending}
        />

        <SelectField
          id="country"
          name="country"
          label={tForm('fields.country.label')}
          placeholder={tForm('fields.country.placeholder')}
          required
          invalid={!!state.fieldErrors['country']}
          errors={translateFieldErrors(state.fieldErrors['country'], 'country')}
          errorId={countryErrorId}
          options={countryOptions}
          defaultValue={state.prev['country'] ?? ''}
          hint={tForm('fields.country.hint')}
          hintId={countryHintId}
          disabled={pending}
        />

        <RadioPlanField
          label={tForm('fields.plan.label')}
          options={planOptions}
          prevValue={state.prev['plan']}
          invalid={!!state.fieldErrors['plan']}
          errors={translateFieldErrors(state.fieldErrors['plan'], 'plan')}
          errorId={planErrorId}
          disabled={pending}
        />

        <ConsentField
          segments={consentSegments}
          invalid={!!state.fieldErrors['consent']}
          errors={translateFieldErrors(state.fieldErrors['consent'], 'consent')}
          errorId={consentErrorId}
          disabled={pending}
        />
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
};
