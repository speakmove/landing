1) логика HomeSchedule должна быть в feature model hooks а не просто в ui widget 

2) почему снова у тебя есть svg в jsx, а не вынесем это в Icon?

3)  у тебя вложенность main + main !

4) я хочу оставить прошлую структуру json         "botName": "Lorem ipsum SpeakMove 17",
        "botStatus": "Lorem ipsum",
        "coinBalance": "127",
        "messages": [
          {
            "from": "bot",
            "text": "Lorem ipsum dolor sit amet 18",
            "translation": "Lorem ipsum dolor sit amet 19",
            "meta": "Lorem ipsum 20"
          },
          {
            "from": "me",
            "text": "Lorem ipsum dolor sit amet 21",
            "translation": "Lorem ipsum dolor sit amet 22"
          },
          {
            "from": "bot",
            "text": "Lorem ipsum 23",
            "translation": "Lorem ipsum dolor sit amet 24",
            "reward": "+10 SM"
          },
          {
            "from": "bot",
            "text": "Lorem ipsum dolor sit amet 25",
            "translation": "Lorem ipsum 26",
            "highlight": "x2 монет"
          }
        ],
        "micLabel": "Lorem ipsum",
        "micTime": "0:07",
        "floatBubbles": [
          {
            "title": "100 SM = $1",
            "subtitle": "Lorem ipsum 27"
          },
          {
            "title": "7 дней подряд",
            "subtitle": "+50 SM за серию"
          }
        ]

        но текста должны быть текущими, что новые

5) расшить gitignore: там не нужны tsconfig.tsbuildinfo + .claude/settings.local.json

6) телефон у тебя сейчас на нашем сайте neextjs как-то сжатый , на оригинале html он 390/730

7) на странице формы waitlist plan — спорно спрашивать ДО запуска. Юзер ещё не пробовал продукт, а ты заставляешь его выбрать $12.99 vs $22.99. Это снизит conversion на 15–25%. Я бы заменил на «На
  каком тарифе планируешь стартовать?» с третьим вариантом «Ещё не решил» (default-checked)

8) lastName не нужно в форме

9) Honeypot называется website — самые продвинутые боты заполняют именно поле website. Переименуй в что-то менее ожидаемое: company_url, linkedin_profile.

10) const isExternal = (href: string): boolean => {
  15    return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:');
  16  }; это лучше сделать в утилиту отдельно в shared 