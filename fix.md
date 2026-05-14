1) href = '#main' - это лучше держать в константе все айди 

2) export function Container({ children, className }: TProps) {
   9   return <div className={cn('mx-auto w-full max-w-[1180px] px-5', className)}>{children}</div>;
  10 }

лучше или использовать стандарный из таивинда или переизменить в css переменных 

3) все такие href="/" должны быть через constant названную paths.ts из 06_shared 

лучше или использовать стандарный из таивинда или переизменить в css переменных

4) typeof window !== 'undefined' - для этого лучше делать утилиту isClient / isServer 

5) <SkipLink>Перейти к содержимому</SkipLink> - надо брать текст из словаря моего

6) компоненты должны быть не export async function, а стрелочные функции и в целом отдает предпочтением стрелочным (кроме  app папки)

7) на GlobalError, ErrorPage тоже нужно брать текста из словаря 

8)  The class text-[color:var(--color-muted)] can be written as text-muted

9) The class max-w-[720px] can be written as max-w-180

10) The class text-[color:var(--color-primary)] can be written as text-primary

11) это нормально что у тебя в лого вложенно два span? 

<span className={cn('inline-flex items-center gap-2.5 text-[18px] font-extrabold tracking-tight', className)}>
  12       <span
  13         aria-hidden="true"
  14         className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[color:var(--color-gold-accent)] to-[color:var(--color-gold)] text-[11px] font-
     extrabold text-white"
  15       >
  16         {t('brandCoinLabel')}
  17       </span>
  18       <span>{t('brand')}</span>
  19     </span>

12) в BrandCoin текст тоже через наш файл текстов (но там всегда будет «SM») - просто лучше делажать в одоном файле

13) The class from-[color:var(--color-gold-accent)] can be written as from-gold-accent

14) The class to-[color:var(--color-gold)] can be written as to-gold

15) The class bg-gradient-to-br can be written as bg-linear-to-br

16) The class hover:text-[color:var(--color-ink)] can be written as hover:text-ink

17) The class min-h-[28px] can be written as min-h-7

18) The class focus-visible:outline-[color:var(--color-primary)] can be written as focus-visible:outline-primary

19) The class border-[color:var(--color-line)] can be written as border-line

20) <nav aria-label="Primary" className="ml-3 hidden lg:flex">
  34             <ul className="flex gap-7 text-[14.5px] font-medium text-[color:var(--color-muted)]">
  35               {NAV_ITEMS.map((item) => (
  36                 <li key={item.key}>
  37                   <Link
  38                     href={item.href}
  39                     className="transition-colors hover:text-[color:var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[col
     or:var(--color-primary)]"
  40                   >
  41                     {tLinks(item.key)}
  42                   </Link>
  43                 </li>
  44               ))}
  45             </ul>
  46           </nav>

это можно в отделньый компонент и даже нужно 

21) тоже самое по футер nav - надо вынести в отделньый компонент и в футере тоже нужно вынести 

<div className="border-t border-[color:var(--color-line)] py-6 text-xs leading-relaxed text-[color:var(--color-faint)]">
  90           <p>{t('legalEntity')}</p>
  91           <p className="mt-3">{t('researchNotice')}</p>
  92         </div>

<ul className="mt-3 flex flex-wrap gap-3 text-sm">
  72               {socialLinks.map((item) => (
  73                 <li key={item.id}>
  74                   <a
  75                     href={item.href}
  76                     aria-label={item.ariaLabel}
  77                     target="_blank"
  78                     rel="noopener noreferrer"
  79                     className="inline-flex min-h-[36px] items-center rounded-lg border border-[color:var(--color-line)] px-3 text-[color:var(--color-muted)] hover:tex
     t-[color:var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]"
  80                   >
  81                     {item.label}
  82                   </a>
  83                 </li>
  84               ))}
  85             </ul>


  22) почему в ScenarioCard ты не использовал мой Icon а брал обычный svg?

23) The class border-[color:var(--color-line)] can be written as border-line

24) The class hover:shadow-[var(--shadow-mid)] can be written as hover:shadow-(--shadow-mid)

25) у тебя очень много «text-[13px]» или бери классы с таилвинда или переофромини на наши стили

26) почему в FloatBubble не берется cn а join - это не прваильно?

27) в AdvantageTile aria-label должны быть через перемодчик + там тоже почему не используешься cn из libs

28) вместо text-[12px] text-[14px] или text-[16px] брать из таилвинда

29) в ScheduleCard тоже join в className вместо cn

30) iPhone frame нужно в отделньый компонент + все текста должны быть из переводчика нашего 

31) почему в HomePhonePreview испольуется svg вместо нашего Icon? 

32) grid background должен быть в компоненте чтобы если нужно можно было его переиспользовать 

33) не нужно использовать style , а только className

34) ariaLabelledBy="schedule-heading" тоже нужно с перевода

35) в HomePricingTeaser тоже нужно брать cn вместо join + 3-plan grid должен быть отдельный компонент

36) HomeUkraineProgramme, FinalCtaWithFomo надо ariaLabelledBy через переводичик наш 

37) CefrLevelRow тоже надо cn вместо join на классах + тоже самое в ChatMessage и других компонентах тоже проверь сам


38) HowItWorksPhonePreview скорее лучше отдельный файл, не?

39) BoldText может лучше делать не strong а через тех <b> ? и также может лучше через 06_shared/ui? 

40) CoinTable может лучше в feature или entites? 

41) в PrivacyFeatureGrid ariaLabelledBy и aria-label делаем тоже через наш переодчик 

42) «»Object.fromEntries(routing.locales.map((l) => [l, `/${l}/how-it-works`])); тут тоже путь через paths

43) [browser] Encountered two children with the same key, В. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.

44) Почему где-то у тебя text-[value_px] где-то text-[value_rem] а где-то text-[calm..] - везде дожно быть одинаково или в этом есть спец смысл? 

45) нужно предусмотреть что для европы это евро будут, для тех кто в UK фунты, а для всех остальных доллары (но по дефолту доллары) - {resolved.amount.startsWith('$') ? resolved.amount : `$${resolved.amount}`}

46) aria-label={`Включено в ${plan.name}`} должен быть с переводом и тоже самое в других местах где захардкожен текст: ариа атрибыты, просто плейн текст и другое

47) href="https://t.me/speakmove_bot" - этот юрл должно быть тоже в константе в 06_shared


48) FaqItem тут тоже вместо cn берешь join + также почему инлайновая свг вместо моей + нет ариа атрибутов или они тут не нужны? 

49) по FSD «BillingToggle» должно быть в feature а не в виджетте 

50) очень плохо что такая вложенность, тяжело подедрживать и рефакторить 

 32       if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
  33         nextIndex = (currentIndex + 1) % OPTIONS.length;
  34       } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
  35         nextIndex = (currentIndex - 1 + OPTIONS.length) % OPTIONS.length;
  36       } else if (e.key === 'Home') {
  37         nextIndex = 0;
  38       } else if (e.key === 'End') {
  39         nextIndex = OPTIONS.length - 1;
  40       } else {
  41         return;
  42       }

  51) в PricingFeatureComparisonTable можно разделить на компоненте thead / tbody + у них тоже есть хорошо доступные a11y? 

52) если <main id="main-content"> это часть везде на pages одинаковая то может мы могли бы вынести её в layout?


53) почему ты добавил // eslint-disable-next-line jsx-a11y/interactive-supports-focus ?

54) почему в SuccessBlockClient не наша Icon а мы пишем вручную. В целом иконки должны быть в shared чтобы они были везде одинаковые, ведь если ты пишешь каждый раз заново svg то есть шанс что будет немного другой в разных местах

55) очень очень большой WaitlistForm - надо делить на компоненты 

56) в инпутах надо добавить какую клавиатуру показывать вроде это атрибут mode или displayMode 

57) <select
  263               id="lang"
  264               name="lang"
  265               aria-invalid={!!state.fieldErrors['lang']}
  266               aria-describedby={langHintId}
  267               defaultValue={state.prev['lang'] ?? ''}
  268               disabled={pending}
  269               className={cn(
  270                 selectCls,
  271                 state.fieldErrors['lang']
  272                   ? 'border-red-500 focus-visible:ring-red-100'
  273                   : 'border-[color:var(--color-line-strong)]',
  274               )}
  275             >
  276               <option value="">{tForm('fields.lang.placeholder')}</option>
  277               {langOptions.map((opt) => (
  278                 <option key={opt.value} value={opt.value}>
  279                   {opt.label}
  280                 </option>
  281               ))}
  282             </select>

нужно сделать ui компонентом в shared и он должен быть кастомного нашего стиля, а не дефолтного от браузера


58) ты кажется стили к страницам сам придумаываешь а не читаешь из моего /Users/dmitriy/Desktop/mvp/01_lingocoin/html и делаешь такие же компоненты/страницы/стили , но переисползуеммые 

59) // metadataBase must be a static export so Next.js can resolve absolute URLs                                                                                             
 33 +// (e.g. OG images) during static generation without triggering warnings.                                                                                                
 34 +export const metadata: Metadata = {                                                                                                                                      
 35 +  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),                                                                                                                       
 36 +};  

зачем ты вынес?