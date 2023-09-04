{
    "status":
    {
        "code": 10000,
        "description": "Ok",
        "req_id": "c89539ceeed9e8b8f1448aa62f38332f"
    },
    "outputs":
    [
        {
            "id": "81394a9b098b4eefa16f6a067f05023a",
            "status":
            {
                "code": 10000,
                "description": "Ok"
            },
            "created_at": "2023-09-04T12:11:05.751761243Z",
            "model":
            {
                "id": "food-item-v1-recognition",
                "name": "food-items-v1.0",
                "created_at": "2016-09-17T22:18:59.955626Z",
                "modified_at": "2021-10-20T06:53:05.568020Z",
                "app_id": "main",
                "model_version":
                {
                    "id": "dfebc169854e429086aceb8368662641",
                    "created_at": "2016-09-17T22:18:59.955626Z",
                    "status":
                    {
                        "code": 21100,
                        "description": "Model is trained and ready"
                    },
                    "visibility":
                    {
                        "gettable": 50
                    },
                    "app_id": "main",
                    "user_id": "clarifai",
                    "metadata":
                    {}
                },
                "display_name": "food-items-v1-visual-classifier",
                "user_id": "clarifai",
                "model_type_id": "visual-classifier",
                "visibility":
                {
                    "gettable": 50
                },
                "toolkits":
                [],
                "use_cases":
                [],
                "languages":
                [],
                "languages_full":
                [],
                "check_consents":
                [],
                "workflow_recommended": false
            },
            "input":
            {
                "id": "e2cb63af2cfa4e38bd454db66bf577e0",
                "data":
                {
                    "image":
                    {
                        "url": "https://samples.clarifai.com/placeholder.gif",
                        "base64": "dHJ1ZQ=="
                    }
                }
            },
            "data":
            {
                "concepts":
                [
                    {
                        "id": "ai_CFS37srh",
                        "name": "tea",
                        "value": 0.9846841,
                        "app_id": "main"
                    },
                    {
                        "id": "ai_f1zKlGnc",
                        "name": "coffee",
                        "value": 0.9750068,
                        "app_id": "main"
                    },
                    {
                        "id": "ai_lSK1vzWN",
                        "name": "egg",
                        "value": 0.82982284,
                        "app_id": "main"
                    },
                    {
                        "id": "ai_G58V132Z",
                        "name": "water",
                        "value": 0.8008839,
                        "app_id": "main"
                    },
                    {
                        "id": "ai_r2Fbdv8L",
                        "name": "beer",
                        "value": 0.6869198,
                        "app_id": "main"
                    },
                    {
                        "id": "ai_jmcSl8c1",
                        "name": "bacon",
                        "value": 0.66934663,
                        "app_id": "main"
                    },
                    {
                        "id": "ai_mZHVM5R0",
                        "name": "beans",
                        "value": 0.6650475,
                        "app_id": "main"
                    },
                    {
                        "id": "ai_0wh0dJkQ",
                        "name": "sweet",
                        "value": 0.6565695,
                        "app_id": "main"
                    },
                    {
                        "id": "ai_b4b4hLRV",
                        "name": "turkey",
                        "value": 0.64057654,
                        "app_id": "main"
                    },
                    {
                        "id": "ai_r59dFMqd",
                        "name": "juice",
                        "value": 0.5809071,
                        "app_id": "main"
                    },
                    {
                        "id": "ai_CB8hsS3T",
                        "name": "tomato",
                        "value": 0.58068115,
                        "app_id": "main"
                    },
                    {
                        "id": "ai_jvVxlhLh",
                        "name": "chicken",
                        "value": 0.55615044,
                        "app_id": "main"
                    },
                    {
                        "id": "ai_TtT3b8dX",
                        "name": "cherry",
                        "value": 0.53066844,
                        "app_id": "main"
                    },
                    {
                        "id": "ai_GC6FB0cQ",
                        "name": "sauce",
                        "value": 0.52151763,
                        "app_id": "main"
                    },
                    {
                        "id": "ai_T851HmVS",
                        "name": "orange",
                        "value": 0.5014392,
                        "app_id": "main"
                    },
                    {
                        "id": "ai_zFqwk1nf",
                        "name": "date",
                        "value": 0.4844462,
                        "app_id": "main"
                    },
                    {
                        "id": "ai_ZHtk2LRK",
                        "name": "potato",
                        "value": 0.4660752,
                        "app_id": "main"
                    },
                    {
                        "id": "ai_PbPLrZH1",
                        "name": "milk",
                        "value": 0.44670272,
                        "app_id": "main"
                    },
                    {
                        "id": "ai_NhSzzDVx",
                        "name": "sandwich",
                        "value": 0.4463824,
                        "app_id": "main"
                    },
                    {
                        "id": "ai_dptdbnBR",
                        "name": "espresso",
                        "value": 0.44360572,
                        "app_id": "main"
                    }
                ]
            }
        }
    ]
}