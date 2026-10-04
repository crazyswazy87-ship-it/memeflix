import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthLayout } from './_auth/AuthLayout'
import { RootLayout } from './_root/RootLayout'
import { Toaster } from "@/components/ui/sonner"
import AdminRoute from './_Binn/AdminRoute'

const SigninForm = lazy(() => import('./_auth/forms/SigninForm'))
const SignupForm = lazy(() => import('./_auth/forms/SignupForm'))
const AuthLoading = lazy(() => import('./_auth/forms/AuthLoading'))
const AuthCallback = lazy(() => import('./_auth/forms/AuthCallback'))
const ForgotPassword = lazy(() => import('./_auth/forms/ForgotPassword'))
const AuthOAuthCallback = lazy(() => import('./_auth/forms/AuthOAuthCallbak'))

const Home = lazy(() => import('./_root/pages/Home'))
const Explore = lazy(() => import('./_root/pages/Explore'))
const Saved = lazy(() => import('./_root/pages/Saved'))
const AllUsers = lazy(() => import('./_root/pages/AllUsers'))
const CreatePost = lazy(() => import('./_root/pages/CreatePost'))
const PublisherForm = lazy(() => import('./components/forms/PublisherForm'))
const EditPost = lazy(() => import('./_root/pages/EditPost'))
const Profile = lazy(() => import('./_root/pages/Profile'))
const UpdateProfile = lazy(() => import('./_root/pages/UpdateProfile'))
const LikedPosts = lazy(() => import('./_root/pages/LikedPosts'))
const Repost = lazy(() => import('./components/shared/Repost'))
const Company = lazy(() => import('./_root/pages/Company'))
const Analytics = lazy(() => import('./_root/pages/Analytics'))
const SupportPage = lazy(() => import('./_root/pages/SupportPage'))
const ContactSupport = lazy(() => import('./_root/pages/ContactSupport'))
const Verify = lazy(() => import('./_root/pages/Verify'))
const Notifications = lazy(() => import('./_root/pages/Notifications'))
const Notes = lazy(() => import('./_root/pages/Notes'))
const OccupationAll = lazy(() => import('./_root/pages/OccupationAll'))
const Suspended = lazy(() => import('./_root/pages/AccountSuspended'))
const Appeal = lazy(() => import('./_root/pages/AccountAppeal'))
const AccountAppealApproved = lazy(() => import('./_root/pages/AccountAppealApproved'))
const Banned = lazy(() => import('./_root/pages/AccountBan'))
const Mods = lazy(() => import('./_root/pages/AccountsModeration'))
const SusHistory = lazy(() => import('./_root/pages/AccountSusHistory'))
const Sus = lazy(() => import('./_root/pages/AccountSuspension'))
const PageNotFound = lazy(() => import('./_root/pages/PageNotFound'))
const SesionEnd = lazy(() => import('./_root/pages/AccountSession'))
const Denzel = lazy(() => import('./_Binn/Denzel'))

function RouteLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
    </div>
  )
}

function App() {
  return (
    <main className="main-dev">
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          {/** PUBLIC ROUTES */}
          <Route element={<AuthLayout />}>
            <Route path="sign-in" element={<SigninForm />} />
            <Route path="sign-up" element={<SignupForm />} />
            <Route path="/auth-loading" element={<AuthLoading />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/oauth-callback" element={<AuthOAuthCallback />} />
          </Route>

          {/** PRIVATE ROUTES */}
          <Route element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/all-users" element={<AllUsers />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/publisher" element={<PublisherForm />} />
            <Route path="/update-post/:id" element={<EditPost />} />
            <Route path="/profile/:id/*" element={<Profile />} />
            <Route path="/update-profile/:id" element={<UpdateProfile />} />
            <Route path="/liked-posts" element={<LikedPosts />} />
            <Route path="/repost/:id" element={<Repost />} />
            <Route path="/blockseven" element={<Company />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/contact-support/:category" element={<ContactSupport />} />
            <Route path="/verify/:id" element={<Verify />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/add-note" element={<Notes />} />
            <Route path="/occupation" element={<OccupationAll />} />
            <Route path="/suspended" element={<Suspended />} />
            <Route path="/appeal" element={<Appeal />} />
            <Route path="/appeal-approved" element={<AccountAppealApproved />} />
            <Route path="/permanent-ban" element={<Banned />} />
            <Route path="/moderation" element={<Mods />} />
            <Route path="/suspension-history" element={<SusHistory />} />
            <Route path="/sus" element={<Sus />} />
            <Route path="/page-error" element={<PageNotFound />} />
            <Route path="/session-end" element={<SesionEnd />} />
          </Route>

          {/** DANGER HATARI */}
          <Route element={<AdminRoute />}>
            <Route path="/blockbasa" element={<Denzel />} />
          </Route>
        </Routes>
      </Suspense>

      <Toaster />
    </main>
  )
}

export default App
