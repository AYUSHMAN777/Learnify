import { Button } from "@/components/ui/button"
import Login from "@/pages/Login"
// import Navbar from "@/components/Navbar"
import Hero from "./pages/User/Hero"
import { createBrowserRouter } from "react-router-dom"
import MainLayout from "./layout/MainLayout"
import { RouterProvider } from "react-router-dom"
import Courses from "./pages/User/Courses"
import MyLearning from "./pages/User/MyLearning"
import MyProfile from "./pages/User/MyProfile"
import Sidebar from "./pages/admin/Sidebar"
import Dashboard from "./pages/admin/Dashboard"
import CourseTable from "./pages/admin/course/CourseTable"
import Addcourse from "./pages/admin/course/Addcourse"
// import EditCourse from "./pages/admin/course/EditCourse"
import CreateLecture from "./pages/admin/lecture/CreateLecture"
import EditLecture from "./pages/admin/lecture/EditLecture"
import CourseDetail from "./pages/User/CourseDetail"
import CourseProgress from "./pages/User/CourseProgress"
import SearchPage from "./pages/User/SearchPage"
import { AdminRoute, AuthenticatedUser, ProtectedRoute } from "./components/ui/ProtectedRoute"
import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute"
import { ThemeProvider } from "../src/components/ThemeProvider"
import CourseTab from "./pages/admin/course/CourseTab"




const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <>
            <Hero />
            <Courses />
          </>
        ),
      },
      {
        path: "/login",
        element: <AuthenticatedUser><Login /></AuthenticatedUser>
      },
      {
        path: "/my-learning",
        element: <ProtectedRoute><MyLearning /></ProtectedRoute>,
      },
      {
        path: "/profile",
        element: <ProtectedRoute><MyProfile /></ProtectedRoute>,
      },
      {
        path: "course/search",
        element: <ProtectedRoute><SearchPage /></ProtectedRoute>,
      },
      {
        path: "/course-detail/:courseId",
        element: <ProtectedRoute><CourseDetail /></ProtectedRoute>,
      },
      {
        path: "/course-progress/:courseId",
        element: (
          <ProtectedRoute>
            <PurchaseCourseProtectedRoute>
              <CourseProgress />
            </PurchaseCourseProtectedRoute>
          </ProtectedRoute>
        ),
      },




      //admin dashboard routes
      {
        path: "/admin",
        element: <AdminRoute><Sidebar /></AdminRoute>,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />
          },
          {
            path: "course",
            element: <CourseTable />
          },
          {
            path: "course/create",
            element: <Addcourse />
          },
          {
            path: "course/:courseId",
            element: <CourseTab />
          },
          {
            path: "course/:courseId/lecture",
            element: <CreateLecture />
          },
          {
            path: "course/:courseId/lecture/:lectureId",
            element: <EditLecture />,
            errorElement: <div>Lecture not found or some error occurred.</div>
          },
        ]
      }
    ],
  },

])

function App() {
  return (
    <main>
      <ThemeProvider >
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  )
}

export default App