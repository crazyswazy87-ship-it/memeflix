import {Routes, Route} from 'react-router-dom'
import './App.css'
import SigninForm from './_auth/forms/SigninForm'
import SignupForm from './_auth/forms/SignupForm'
import { AllUsers, Analytics, Appeal, Banned, ContactSupport, CreatePost, EditPost, Explore, Home,
         LikedPosts, Mods, Notes, PageNotFound, Profile, Saved, SesionEnd, SupportPage, Sus, SusHistory, Suspended, UpdateProfile,
         Verify} from './_root'
import { AuthLayout } from './_auth/AuthLayout'
import { RootLayout } from './_root/RootLayout'
import { Toaster } from "@/components/ui/sonner"
import Repost from './components/shared/Repost'
//import AuthLoading from './_auth/forms/AuthLoading'
import Company from './_root/pages/Company'
//import ForgotPassword from './_auth/forms/ForgotPassword' 
//import AuthCallback from './_auth/forms/AuthCallback'
import Notifications from './_root/pages/Notifications'
import AdminRoute from './_Binn/AdminRoute'
import { Denzel } from './_Binn'
import AccountAppealApproved from './_root/pages/AccountAppealApproved'
import PublisherForm from './components/forms/PublisherForm'
import OccupationAll from './_root/pages/OccupationAll'
import AuthLoading from './_auth/forms/AuthLoading'
import AuthCallback from './_auth/forms/AuthCallback'
import ForgotPassword from './_auth/forms/ForgotPassword'
import AuthOAuthCallback from './_auth/forms/AuthOAuthCallbak'

function App() {

  return (
      <main className="main-dev">
        <Routes>

          {/**PUBLIC ROUTES */}
          <Route element={<AuthLayout />} >
            <Route path="sign-in" element={<SigninForm />} />
            <Route path="sign-up" element={<SignupForm />} />
            <Route path="/auth-loading" element={<AuthLoading />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/auth/oauth-callback"
              element={<AuthOAuthCallback />}
            />
    
          </Route>

          {/**PRIVATE ROUTES */}
          <Route element={<RootLayout />} >
            <Route index element= {<Home />}  />
            <Route path="/explore" element= {< Explore />} />
            <Route path="/saved" element= {< Saved />} />
            <Route path="/all-users" element= {< AllUsers />} />
            <Route path="/create-post" element= {< CreatePost />} />
            <Route path="/publisher" element={<PublisherForm />} />
            <Route path="/update-post/:id" element= {< EditPost />} />
            <Route path="/profile/:id/*" element= {< Profile />} />
            <Route path="/update-profile/:id" element= {< UpdateProfile />} />
            <Route path="/liked-posts" element= {< LikedPosts />} />
            <Route path="/repost/:id" element={<Repost />} />
            <Route path="/blockseven" element={<Company />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/contact-support/:category" element={<ContactSupport />} />
            <Route path="/verify/:id" element={<Verify />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/add-note" element={<Notes />} />
            <Route path='/occupation' element={<OccupationAll/>} />

            <Route path="/suspended" element={<Suspended />} />
            <Route path="/appeal" element={<Appeal />} />
            <Route path="/appeal-approved" element={<AccountAppealApproved />} />
            <Route path="/permanent-ban" element={<Banned /> } />
            <Route path="/moderation" element={<Mods />} />
            <Route path="/suspension-history" element={<SusHistory />} />
            <Route path="/sus" element={<Sus />} />
            <Route path="/page-error" element={<PageNotFound />} />
            <Route path="/session-end" element={<SesionEnd />} />
          </Route>
          
          {/**DANGER hATARI */}
          <Route element={<AdminRoute />}>
            <Route path="/blockbasa" element={<Denzel />} />
          </Route>
        </Routes>

        <Toaster />
      </main>
  )
}

export default App

