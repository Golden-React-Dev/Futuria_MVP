import styles from "../styles/ai.module.css"
import { Stack } from "@chakra-ui/react"
import ReactAudioPlayer from 'react-audio-player';
import React, { useEffect, useState, useCallback } from "react";
import logo from "../logo/logo7.png"

export type audios = {
  id: number,
  url: string,
  title: string,
  category_id: number
}

const apiKey = "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";

const apiUrl = "https://api.openai.com/v1/completions";

const keywords = ["finance", "trading", "sex", "blog", "article"];

const subCategories = [
  { id: 1, title: "honeymoon", hidden: "Write in a romantic fantasy style.", category_id: 1 },
  { id: 2, title: "business", hidden: "Write in a safe style.", category_id: 1 },
  { id: 3, title: "education", hidden: "Write in a helpful and educational style.", category_id: 1 },
]

const templates = [
  {
    id: 1,
    category_id: 1,
    data: [
      "Write the poem about  ",
      "Who is the most famous in  ",
      "Please tell me about the  "
    ]
  },
  {
    id: 2,
    category_id: 2,
    data: [
      "Which one is the best for fat man?",
      "How much does it cost to take fitness class in Italy"
    ]
  },
  {
    id: 3,
    category_id: 3,
    data: [
      "Which technology is rising now?",
      "Is OpenAI fully free?",
      "What is the MERN stack?"
    ]
  },
  {
    id: 4,
    category_id: 4,
    data: [
      "How long does it take to draw a wonderful nature?",
      "Which instrument is the best for girls?"
    ]
  },
  {
    id: 5,
    category_id: 5,
    data: [
      "How many restaurant in Paris?",
      "How long will it takes to go there?"
    ]
  }
]

const categories = [
  { id: 1, data: "Travel plan and Vacation" },
  { id: 2, data: "Hotels and Airbnb" },
  { id: 3, data: "restaurants and food" },
  { id: 4, data: "free time" },
  { id: 5, data: "sport" }
] as const

const languages = [
  { lang: "English", hidden_text: "Please give me an answer in English" },
  { lang: "Portuguese", hidden_text: "Please give me an answer in Portuguese" },
  { lang: "Italian", hidden_text: "Please give me an answer in Italian" },
  { lang: "Spanish", hidden_text: "Please give me an answer in Spanish" },
] as const

const videos = [
  { id: 1, url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", category_id: 2 },
  { id: 2, url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4", category_id: 1 },
  { id: 3, url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", category_id: 4 },
  { id: 4, url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", category_id: 5 }
] as const

const musics = [
  { id: 1, url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", title: "Title 1", category_id: 1 },
  { id: 2, url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", title: "Title 2", category_id: 1 },
  { id: 3, url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", title: "Title 3", category_id: 2 },
  { id: 4, url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", title: "Title 4", category_id: 2 },
  { id: 5, url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", title: "Title 5", category_id: 3 },
  { id: 6, url: "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav", title: "Title 6", category_id: 1 },
  { id: 7, url: "https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav", title: "Title 7", category_id: 3 },
  { id: 8, url: "https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther30.wav", title: "Title 8", category_id: 4 },
  { id: 9, url: "https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther30.wav", title: "Title 9", category_id: 5 }
]

const AiPage = () => {

  const [loading, setLoading] = useState<string>("")
  const [template, setTemplate] = useState<string[]>([""])
  const [category, setCategory] = useState<number>(0);
  const [subCategory, setSubCategory] = useState<number>(0);
  const [language, setLanguage] = useState<string>("in English");
  const [hidden, setHidden] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [userQuestion, setUserQuestion] = useState<string>("");
  const [qTemplate, setQtemplate] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [audios, setAudios] = useState<audios[]>([musics[0]])
  const [curAudio, setCurAudio] = useState<string>("")

  useEffect(() => {
    const video = videos.filter((value) => value.category_id === category)
    setVideoUrl(video[0] ? video[0].url + "?autoplay=1" : "")
    const audios = musics.filter((value) => value.category_id === category)
    setAudios(audios)
    const cur_template = templates.filter(value => value.category_id === category)
    setTemplate(cur_template[0]?.data)
    setSubCategory(0)
  }, [category])

  useEffect(() => {
    const cur_subCategory = subCategories.filter((value) => value.id === subCategory)
    setQuestion( cur_subCategory[0]?.hidden + userQuestion + "." + language)
  }, [category, language, userQuestion, subCategory])

  useEffect(() => {
    setUserQuestion(qTemplate)
  }, [qTemplate])

  const handleRunClick = useCallback(async () => {
    if (userQuestion === "") {
      alert("Please fill the question field");
      return
    }

    if (category === 0) {
      alert("Please select the category")
      return
    }

    if (subCategory === 0) {
      alert("Please select the subCategory")
      return
    }

    //const query = 'Please check this sentences contains the related word with ' + categories[category - 1].data + '. If it contains then give me only one words "true", if it does not then give me "false". sentences: "' + userQuestion + '"';
    // const query = "Please check this '" + userQuestion + "' contains the word that related to the word 'finance'."
    // console.log(query)

    // const data = {
    //   prompt: query,
    //   max_tokens: 2000,
    //   model: "text-davinci-003",
    //   temperature: 0.5,
    // };

    try {
      // const response = await fetch(apiUrl, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": "Bearer " + apiKey
      //   },
      //   body: JSON.stringify(data)
      // })
      // setLoading("Please Wait...")
      // const result = await response.json()
      // setLoading("")

      const hasKeyword = keywords.some(keyword => userQuestion.includes(keyword));

      console.log(hasKeyword)

      if(!hasKeyword) {
        console.log(question)
        const data = {
          prompt: question,
          max_tokens: 2000,
          model: "text-davinci-003",
          temperature: 0.5,
        };
    
        fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apiKey
          },
          body: JSON.stringify(data)
        })
          .then(response => response.json())
          .then(data => {
            console.log(data.choices[0].text)
            setResult(data.choices[0].text);
          })
          .catch(error => console.error(error));
      } else {
        alert("Please set the correct query. These query isn't related with given category.")
      }

    } catch (err) {
      alert("Something went wrong." + err)
    }


  }, [question, userQuestion, category])

  const handleCopyClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(result);
      alert("Result Copied")
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }, [result])

  return (
    <>
      <div className="text-center bg-gray-100">
        <h1>Your Header goese here</h1>
      </div>
      <div className="container mx-auto flex flex-col p-4">
        <div className={`p-2 ${styles.video_container}`}>
          <iframe className={styles.video} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" src={category === 0 || videoUrl === "" ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4?autoplay=1' : videoUrl} allowFullScreen ></iframe>
        </div>
        <div className="grid grid-cols-3 p-2">
          <div className="col-span-3 sm:col-span-2 flex flex-col mr-2">
            <div className="mb-2 flex justify-between">
              <div>
                <img src={logo.src} alt="logo" className={styles.logo_image} />
              </div>
              <div>
                <select id="languages" className="ai_select" onChange={(e) => setLanguage(e.target.value)}>
                  <option value="in English">Choose a Language</option>
                  {
                    languages.map((value, index) => (<option key={index} value={value.hidden_text}>{value.lang}</option>))
                  }
                </select>
              </div>
              <div>
                <select id="categories" className="ai_select mb-1" defaultValue={0} onChange={(e) => setCategory(Number(e.target.value))}>
                  <option value="0">Choose a Category</option>
                  {
                    categories.map((value, index) => (<option key={index} value={value.id}>{value.data.toUpperCase()}</option>))
                  }
                </select>
                <select id="subCategories" className="ai_select mb-1" value={subCategory} disabled={category === 0 ? true : undefined} onChange={(e) => setSubCategory(Number(e.target.value))}>
                  <option value="0">Choose a SubCategory</option>
                  {
                    subCategories.filter((value) => value.category_id === category).map((value, index) => (<option key={index} value={value.id}>{value.title.toUpperCase()}</option>))
                  }
                </select>
              </div>
            </div>
            <div className="h-full">
              <textarea name="questions" id="questions" className={`${styles.question_field} input h-full`} onChange={(e) => setUserQuestion(e.target.value)} value={userQuestion} />
              <button type="button" className={`${styles.run_button} text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`} onClick={handleRunClick} >
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Icon description</span>
              </button>
            </div>
          </div>
          <div className={`${styles.size} col-span-3 sm:col-span-1 mt-1`}>
            <div className="flex items-center flex-col pb-2 px-4">
              <div className="w-full">
                <ReactAudioPlayer
                  src={curAudio}
                  controls
                  className="pb-1 w-full"
                />
              </div>
              <select id="audioSelector" className="ai_select" defaultValue={audios[0]?.url} onChange={(e) => setCurAudio(e.target.value)}>
                <option value={audios[0]?.url}>Choose a Audio</option>
                {
                  audios?.map((value, index) => <option key={index} value={value.url}>{value.title}</option>)
                }
              </select>
            </div>
            <div>
              <Stack direction='column'>
                {
                  template?.map((value, index) => (
                    (<span key={index} className="text-lg py-1 px-2.5 font-bold bg-green-500 text-white rounded hover:cursor-pointer" onClick={() => setQtemplate(value)}>{value}</span>)
                  ))
                }
              </Stack>
            </div>
          </div>
        </div>
        <div className={`p-5 shadow-md bg-slate-100 ${styles.result_container}`}>
          {result.split('\n').map((item:string, index:number) => (
              <React.Fragment key={index}>
                {item}
                <br/>
              </React.Fragment>
            )
          )}
          <div className={`flex justify-end ${styles.button_container}`}>
            <button type="button" className={`${styles.run_button} text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`} onClick={handleCopyClick} >
              Copy
            </button>
            <button type="button" className={`${styles.run_button} text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`} onClick={() => setResult("")} >
              Delete
            </button>
            <button type="button" className={`${styles.run_button} text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`} onClick={handleRunClick} >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AiPage
