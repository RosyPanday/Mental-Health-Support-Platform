import React, { useState } from 'react';
import { usePhqNine } from '../hooks/usePhqNine';
import { getCookie, clearAuthCookies } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const questions = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead or of hurting yourself in some way',
];

const options = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
];

const DepressionScreeningPage = () => {
  const username = getCookie('authUsername') || 'there';
  const navigate = useNavigate();

  const [responses, setResponses] = useState<number[]>(
    Array(9).fill(0)
  );

  const [submitted, setSubmitted] = useState(false);

  const [result, setResult] = useState<{
    totalScore: number;
    responses: number[];
  } | null>(null);

  const [screening, { loading, error }] = usePhqNine();


  const handleChange = (index:number,value:number)=>{
    const next=[...responses];
    next[index]=value;
    setResponses(next);
  };


  const handleLogout = ()=>{
    clearAuthCookies();
    navigate('/login');
  };


  const handleSubmit = async(
    event:React.FormEvent<HTMLFormElement>
  )=>{
    event.preventDefault();

    const response = await screening({
      variables:{
        input:{
          responses,
        },
      },
    });


    const data=response.data?.phqNineScreening?.data;

    if(data){
      setResult({
        totalScore:data.totalScore,
        responses:data.responses
      });

      setSubmitted(true);
    }
  };


  const getSeverityBadge=(score:number)=>{
    if(score<=4)
      return {
        label:'Minimal / None',
        style:'bg-emerald-100 text-emerald-700 border-emerald-300'
      };

    if(score<=9)
      return {
        label:'Mild',
        style:'bg-sky-100 text-sky-700 border-sky-300'
      };

    if(score<=14)
      return {
        label:'Moderate',
        style:'bg-yellow-100 text-yellow-700 border-yellow-300'
      };

    if(score<=19)
      return {
        label:'Moderately Severe',
        style:'bg-orange-100 text-orange-700 border-orange-300'
      };

    return {
      label:'Severe',
      style:'bg-red-100 text-red-700 border-red-300'
    };
  };


  return (
    <div className="
      min-h-screen
      bg-gradient-to-br
      from-teal-50
      via-sky-50
      to-white
      text-slate-800
      pb-16
    ">


      {/* NAVBAR */}

      <header className="
        sticky top-0 z-50
        bg-emerald-100/95
        border-b
        border-emerald-200
        shadow-sm
        backdrop-blur-xl
      ">

        <div className="
          max-w-6xl mx-auto
          px-5
          h-18
          flex
          items-center
          justify-between
          gap-4
        ">


          <button className="
              inline-flex
              items-center
              gap-3
              px-5 py-3
              rounded-2xl
              bg-white
              text-emerald-900
              font-semibold
              shadow-sm
              hover:bg-emerald-50
              transition
            ">
            <span className="
              inline-flex
              items-center
              justify-center
              w-11 h-11
              rounded-2xl
              bg-emerald-700
              text-white
              text-lg
            ">
              🩺
            </span>
            Depression Screening
          </button>



          <div className="flex items-center gap-3">
            <button className="
              px-5 py-3
              rounded-2xl
              bg-emerald-50
              text-emerald-900
              font-semibold
              border
              border-emerald-200
              hover:bg-emerald-100
              transition
            ">
              Patient
            </button>
            <button
              onClick={handleLogout}
              className="
                px-4 py-3
                rounded-2xl
                bg-white
                text-slate-600
                font-medium
                border
                border-slate-200
                hover:text-red-600
                hover:border-red-200
                transition
              "
            >
              Logout
            </button>
          </div>


        </div>

      </header>





      {/* HERO */}


      <section className="
        max-w-4xl
        mx-auto
        px-5
        pt-10
      ">

        <div className="
          bg-gradient-to-br
          from-emerald-50
          via-teal-50
          to-white
          rounded-[32px]
          border
          border-teal-100
          shadow-sm
          p-10
          text-center
        ">

          <span className="
            inline-flex
            px-3 py-1
            rounded-full
            bg-teal-100
            text-teal-700
            text-xs
            font-semibold
            tracking-[0.2em]
          ">
            SELF ASSESSMENT
          </span>

          <h1 className="
            text-3xl
            font-bold
            text-slate-900
            mt-4
          ">
            PHQ-9 Depression Screening
          </h1>

          <p className="
            mt-4
            text-slate-600
            max-w-2xl
            mx-auto
            leading-relaxed
          ">
            Hello {username}. Answer these questions based on how you have been
            feeling over the last two weeks. This assessment is private and only
            takes a few minutes.
          </p>

          <div className="
            mt-10
            grid
            gap-4
            sm:grid-cols-3
          ">

            <div className="bg-white rounded-3xl p-5 text-left shadow-sm border border-teal-100">
              <p className="text-xs uppercase tracking-[0.22em] text-teal-700 font-semibold">Questions</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">9</p>
            </div>

            <div className="bg-white rounded-3xl p-5 text-left shadow-sm border border-sky-100">
              <p className="text-xs uppercase tracking-[0.22em] text-sky-700 font-semibold">Duration</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">2 min</p>
            </div>

            <div className="bg-white rounded-3xl p-5 text-left shadow-sm border border-emerald-100">
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-700 font-semibold">Max Score</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">27</p>
            </div>

          </div>

        </div>

      </section>

      {/* QUESTIONNAIRE */}

      <section
        className="
          max-w-4xl
          mx-auto
          px-5
          mt-8
        "
      >

        <form
          onSubmit={handleSubmit}
          className="
            space-y-6
          "
        >


          {questions.map((question,index)=>(

            <div
              key={question}
              className="
                bg-white
                rounded-3xl
                border
                border-teal-100
                shadow-sm
                p-6
                transition
                hover:shadow-md
              "
            >


              {/* QUESTION HEADER */}

              <div className="
                flex
                flex-col
                md:flex-row
                items-start
                justify-between
                gap-4
                mb-5
              ">

                <span className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-teal-600
                ">
                  Question {index+1} of 9
                </span>

                <span className="
                  text-xs
                  text-slate-400
                ">
                  PHQ-9
                </span>

              </div>

              <h2 className="
                text-lg
                font-semibold
                text-slate-900
                leading-relaxed
                mb-6
              ">

                {question}

              </h2>





              {/* OPTIONS */}

              <div className="
                grid
                gap-3
                sm:grid-cols-2
              ">


                {options.map((option)=>{


                  const selected =
                    responses[index]===option.value;


                  return (

                    <label
                      key={option.value}
                      className={`
                        flex
                        items-center
                        gap-3
                        p-4
                        rounded-3xl
                        border
                        cursor-pointer
                        transition-all
                        ${
                          selected
                          ?
                          `
                          bg-gradient-to-r
                          from-teal-50
                          to-sky-50
                          border-teal-500
                          shadow-sm
                          `
                          :
                          `
                          bg-white
                          border-slate-200
                          hover:border-teal-300
                          hover:bg-teal-50/30
                          `
                        }
                      `}
                    >


                      <input
                        type="radio"
                        name={`response-${index}`}
                        value={option.value}
                        checked={selected}
                        onChange={()=>
                          handleChange(index,option.value)
                        }
                        className="
                          w-5
                          h-5
                          accent-teal-600
                        "
                      />


                      <span className={`
                        text-sm
                        font-medium
                        ${
                          selected
                          ?
                          'text-teal-800'
                          :
                          'text-slate-600'
                        }
                      `}>

                        {option.label}

                      </span>


                    </label>

                  );

                })}


              </div>


            </div>


          ))}





          {/* ERROR */}


          {error && (

            <div className="
              rounded-2xl
              bg-red-50
              border
              border-red-200
              text-red-700
              p-4
              text-sm
              font-medium
            ">

              Unable to submit right now.
              Please try again later.

            </div>

          )}






          {/* SUBMIT */}


          <div className="
            flex
            justify-center
            pt-5
          ">


            <button
              type="submit"
              disabled={loading}
              className="
                px-10
                py-4
                rounded-2xl
                bg-gradient-to-r
                from-teal-600
                to-sky-600
                text-white
                font-semibold
                shadow-md
                hover:from-teal-700
                hover:to-sky-700
                transition
                disabled:opacity-50
              "
            >

              {
                loading
                ?
                'Submitting assessment...'
                :
                'Submit Assessment'
              }


            </button>


          </div>





          {/* RESULTS */}



          {
            submitted && result && (

              <div
                className="
                  mt-8
                  bg-white
                  rounded-3xl
                  border
                  border-teal-100
                  shadow-sm
                  p-8
                "
              >


                <div className="
                  text-center
                ">


                  <div className="
                    inline-flex
                    px-4
                    py-2
                    rounded-full
                    bg-teal-100
                    text-teal-700
                    text-sm
                    font-semibold
                  ">

                    Assessment Complete

                  </div>



                  <h2 className="
                    mt-5
                    text-lg
                    font-semibold
                    text-slate-700
                  ">

                    Your PHQ-9 Score

                  </h2>



                  <div className="
                    text-6xl
                    font-black
                    text-slate-900
                    mt-2
                  ">

                    {result.totalScore}

                  </div>


                  <p className="
                    text-sm
                    text-slate-500
                    mt-1
                  ">

                    out of 27 possible points

                  </p>



                  <div
                    className={`
                      inline-block
                      mt-5
                      px-5
                      py-2
                      rounded-full
                      border
                      font-semibold
                      ${
                        getSeverityBadge(
                          result.totalScore
                        ).style
                      }
                    `}
                  >

                    {
                      getSeverityBadge(
                        result.totalScore
                      ).label
                    }

                  </div>



                </div>





                <div className="
                  mt-8
                  bg-slate-50
                  rounded-2xl
                  p-5
                ">


                  <h3 className="
                    font-semibold
                    text-slate-800
                    mb-2
                  ">

                    Recorded Responses

                  </h3>


                  <p className="
                    font-mono
                    text-sm
                    text-slate-600
                    break-all
                  ">

                    {
                      result.responses.join(', ')
                    }

                  </p>


                </div>



              </div>


            )
          }



        </form>


      </section>



    </div>
  );
};


export default DepressionScreeningPage;