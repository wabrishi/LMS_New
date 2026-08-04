import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { LoginView } from './components/auth/LoginView';
import { ShieldAlert } from 'lucide-react';

// Modules
import { DashboardView } from './components/modules/Dashboard/DashboardView';
import { StudentManagementView } from './components/modules/StudentManagement/StudentManagementView';
import { FacultyManagementView } from './components/modules/FacultyManagement/FacultyManagementView';
import { CourseManagementView } from './components/modules/CourseManagement/CourseManagementView';
import { BatchManagementView } from './components/modules/BatchManagement/BatchManagementView';
import { LiveClassesView } from './components/modules/LiveClasses/LiveClassesView';
import { VideoLibraryView } from './components/modules/VideoLibrary/VideoLibraryView';
import { StudyMaterialsView } from './components/modules/StudyMaterials/StudyMaterialsView';
import { AssignmentModuleView } from './components/modules/AssignmentModule/AssignmentModuleView';
import { QuizExaminationView } from './components/modules/QuizExamination/QuizExaminationView';
import { AttendanceModuleView } from './components/modules/AttendanceModule/AttendanceModuleView';
import { FeeModuleView } from './components/modules/FeeModule/FeeModuleView';
import { CertificateModuleView } from './components/modules/CertificateModule/CertificateModuleView';
import { DiscussionForumView } from './components/modules/DiscussionForum/DiscussionForumView';
import { MessagingModuleView } from './components/modules/MessagingModule/MessagingModuleView';
import { ReportsModuleView } from './components/modules/ReportsModule/ReportsModuleView';
import { RBACManagementView } from './components/modules/RBACManagement/RBACManagementView';
import { SettingsModuleView } from './components/modules/SettingsModule/SettingsModuleView';

const MainLayout: React.FC = () => {
  const { activeModule, role, hasPermission, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderActiveView = () => {
    if (activeModule !== 'Dashboard' && activeModule !== 'RBAC Control' && !hasPermission(role, activeModule, 'view')) {
      return (
        <div className="bg-white p-8 rounded-2xl border border-red-200 shadow-card text-center space-y-4 my-8">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto ring-4 ring-red-100">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Access Denied &bull; Module Revoked</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            Your role (<strong className="text-slate-800">{role}</strong>) does not have View permission for <strong className="text-blue-600">{activeModule}</strong> as configured in the Super Admin RBAC Policy Matrix.
          </p>
        </div>
      );
    }

    switch (activeModule) {
      case 'Dashboard': return <DashboardView />;
      case 'Students': return <StudentManagementView />;
      case 'Faculty': return <FacultyManagementView />;
      case 'Courses': return <CourseManagementView />;
      case 'Batches': return <BatchManagementView />;
      case 'Live Classes': return <LiveClassesView />;
      case 'Video Library': return <VideoLibraryView />;
      case 'Study Materials': return <StudyMaterialsView />;
      case 'Assignments': return <AssignmentModuleView />;
      case 'Quizzes & Exams': return <QuizExaminationView />;
      case 'Attendance': return <AttendanceModuleView />;
      case 'Fees & Invoices': return <FeeModuleView />;
      case 'Certificates': return <CertificateModuleView />;
      case 'Discussion Forum': return <DiscussionForumView />;
      case 'Direct Messages': return <MessagingModuleView />;
      case 'Reports & Analytics': return <ReportsModuleView />;
      case 'RBAC Control': return <RBACManagementView />;
      case 'Settings': return <SettingsModuleView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-slate-900 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-6 flex-1 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;
