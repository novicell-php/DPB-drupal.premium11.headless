import { setLocale, localize } from '@vee-validate/i18n';
import { defineRule, configure } from 'vee-validate';

import * as rules from '@vee-validate/rules';
import da from '@vee-validate/i18n/dist/locale/da.json';

const includedRules = [
  'required',
  'email',
  'integer',
  'min_value',
  'max_value',
  'max',
  'min',
];

export default defineNuxtPlugin((nuxtApp) => {
  // Register only the included rules
  includedRules.forEach((rule) => {
    if (rules[rule]) {
      defineRule(rule, rules[rule]);
    }
  });

  // Configure localization
  configure({
    generateMessage: localize({
      'da-DK': da,
    }),
  });

  // Set the default locale
  setLocale('da-DK');
});
