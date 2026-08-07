import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthCookies, getCookie } from '../utils/auth';

interface LayoutProps {
  children: React.ReactNode;
  activeNav?: string;
}

export const DashboardLayout: React.FC<LayoutProps> = ({
  children,
  activeNav = 'screening',
}) => {

  const navigate = useNavigate();

  const username = getCookie('authUsername') || 'User';
  const role = getCookie('authRole') || 'client';


  const handleLogout = () => {
    clearAuthCookies();
    navigate('/login');
  };


  return (

    <div className="
      min-h-screen
      bg-slate-50
      text-slate-800
    ">


      {/* NAVBAR */}

      <header className="
        sticky
        top-0
        z-50
        bg-white/90
        backdrop-blur
        border-b
        border-slate-200
      ">


        <div className="
          max-w-6xl
          mx-auto
          px-5
          h-16
          flex
          items-center
          justify-between
        ">


          {/* LEFT */}

          <div className="
            flex
            items-center
            gap-8
          ">


            <Link
              to={`/dashboard/${role}`}
              className="
                flex
                items-center
                gap-3
              "
            >

              <div className="
                w-9
                h-9
                rounded-xl
                bg-teal-100
                text-teal-700
                flex
                items-center
                justify-center
                font-bold
              ">
                W
              </div>


              <span className="
                font-semibold
                text-slate-900
                text-lg
              ">
                Wellness
              </span>


            </Link>



            <nav className="
              hidden
              md:flex
              items-center
              gap-2
            ">


              <Link
                to="/dashboard/client/screening"
                className={`
                  px-4
                  py-2
                  rounded-xl
                  text-sm
                  font-medium
                  transition

                  ${
                    activeNav==='screening'
                    ?
                    `
                    bg-teal-50
                    text-teal-700
                    `
                    :
                    `
                    text-slate-500
                    hover:bg-slate-100
                    `
                  }
                `}
              >

                Depression Screening

              </Link>


            </nav>


          </div>





          {/* RIGHT */}

          <div className="
            flex
            items-center
            gap-4
          ">


            <div className="
              hidden
              sm:flex
              items-center
              gap-3
            ">


              <div className="
                w-9
                h-9
                rounded-full
                bg-teal-50
                text-teal-700
                flex
                items-center
                justify-center
                font-semibold
              ">

                {username.charAt(0).toUpperCase()}

              </div>


              <span className="
                text-sm
                font-medium
                text-slate-700
              ">

                {username}

              </span>


            </div>



            <button
              onClick={handleLogout}
              className="
                px-4
                py-2
                rounded-xl
                text-sm
                font-medium
                text-slate-600
                border
                border-slate-200
                bg-white
                hover:bg-red-50
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





      <main className="
        max-w-5xl
        mx-auto
        w-full
        px-5
        py-8
      ">

        {children}

      </main>


    </div>

  );
};