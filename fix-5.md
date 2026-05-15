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