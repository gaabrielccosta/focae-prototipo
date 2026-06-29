import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { AppShell } from './components/AppShell';
import { TaskCompletedToast } from './components/TaskCompletedToast';
import { Agenda } from './pages/Agenda';
import { Home } from './pages/Home';
import { NewTask } from './pages/NewTask';
import { NewSubject } from './pages/NewSubject';
import { Placeholder } from './pages/Placeholder';
import { PlanAvailability } from './pages/PlanAvailability';
import { PlanIntro } from './pages/PlanIntro';
import { PlanReview } from './pages/PlanReview';
import { PlanSuggestion } from './pages/PlanSuggestion';
import { PlanSuccess } from './pages/PlanSuccess';
import { TaskSuccess } from './pages/TaskSuccess';
import { Tasks } from './pages/Tasks';
import { subjects as initialSubjects, suggestedBlocks as initialStudyBlocks, tasks as initialTasks } from './data/mockData';
import { defaultStudyPreferences, generateStudyBlocks } from './utils/planning';
import { createTaskFromDraft, getInitialTaskStatus } from './utils/taskUtils';
import type { AppSettings, Route, StudyBlock, StudyPreferences, Subject, SubjectDraft, Task, TaskDraft } from './types';
import './index.css';

const validRoutes: Route[] = [
  '/',
  '/tarefas',
  '/tarefas/nova',
  '/tarefas/nova-erro',
  '/tarefas/sucesso',
  '/agenda',
  '/agenda/criar-plano',
  '/agenda/disponibilidade',
  '/agenda/revisao',
  '/agenda/sugestao',
  '/agenda/sucesso',
  '/disciplinas',
  '/disciplinas/nova',
  '/configuracoes',
];

function getRouteFromHash(): Route {
  const hashRoute = window.location.hash.replace('#', '') || '/';
  return validRoutes.includes(hashRoute as Route) ? (hashRoute as Route) : '/';
}

export default function App() {
  const [route, setRoute] = useState<Route>(getRouteFromHash);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [lastCreatedTask, setLastCreatedTask] = useState<Task | null>(null);
  const [studyPreferences, setStudyPreferences] = useState<StudyPreferences>(defaultStudyPreferences);
  const [draftStudyBlocks, setDraftStudyBlocks] = useState<StudyBlock[]>(initialStudyBlocks);
  const [savedStudyBlocks, setSavedStudyBlocks] = useState<StudyBlock[]>(initialStudyBlocks);
  const [settings, setSettings] = useState<AppSettings>({
    showTextLabels: true,
    confirmations: true,
    reminders: true,
  });

  useEffect(() => {
    const handleHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  function navigate(nextRoute: Route) {
    window.location.hash = nextRoute;
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function createTask(draft: TaskDraft) {
    const nextId = tasks.reduce((highestId, task) => Math.max(highestId, task.id), 0) + 1;
    const createdTask = createTaskFromDraft(nextId, draft);

    setTasks((currentTasks) => [...currentTasks, createdTask]);
    setLastCreatedTask(createdTask);
  }

  function createSubject(draft: SubjectDraft) {
    const nextId = subjects.reduce((highestId, subject) => Math.max(highestId, subject.id), 0) + 1;

    setSubjects((currentSubjects) => [
      ...currentSubjects,
      {
        id: nextId,
        ...draft,
        pending: 0,
        progress: 100,
      },
    ]);
  }

  function undoCreateTask() {
    if (!lastCreatedTask) return;

    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== lastCreatedTask.id));
    setLastCreatedTask(null);
  }

  function completeTask(taskId: number) {
    const taskToComplete = tasks.find((task) => task.id === taskId);
    if (!taskToComplete || taskToComplete.status === 'Concluída') return;

    toast.custom(
      (toastInstance) => <TaskCompletedToast task={taskToComplete} toastInstance={toastInstance} />,
      { duration: 8000 },
    );
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: 'Concluída', completedAt: new Date().toISOString() }
          : task,
      ),
    );
  }

  function markTaskAsNotCompleted(taskId: number) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: getInitialTaskStatus(task.dueDate), completedAt: undefined }
          : task,
      ),
    );
  }

  function saveStudyBlocks(blocks: StudyBlock[]) {
    setSavedStudyBlocks(blocks);
    setDraftStudyBlocks(blocks);
  }

  function generateDraftStudyBlocks() {
    setDraftStudyBlocks(generateStudyBlocks(tasks, studyPreferences));
  }

  const taskPageProps = {
    tasks,
    onCompleteTask: completeTask,
    onMarkTaskAsNotCompleted: markTaskAsNotCompleted,
  };

  let page;

  switch (route) {
    case '/':
      page = <Home onNavigate={navigate} {...taskPageProps} />;
      break;
    case '/tarefas':
      page = <Tasks onNavigate={navigate} {...taskPageProps} />;
      break;
    case '/tarefas/nova':
      page = <NewTask subjects={subjects} onCreateTask={createTask} onNavigate={navigate} />;
      break;
    case '/tarefas/nova-erro':
      page = <NewTask subjects={subjects} onCreateTask={createTask} onNavigate={navigate} forceError />;
      break;
    case '/tarefas/sucesso':
      page = <TaskSuccess lastCreatedTask={lastCreatedTask} onNavigate={navigate} onUndoCreateTask={undoCreateTask} />;
      break;
    case '/agenda':
      page = <Agenda studyBlocks={savedStudyBlocks} tasks={tasks} onNavigate={navigate} />;
      break;
    case '/agenda/criar-plano':
      page = <PlanIntro onNavigate={navigate} />;
      break;
    case '/agenda/disponibilidade':
      page = <PlanAvailability preferences={studyPreferences} onChangePreferences={setStudyPreferences} onNavigate={navigate} />;
      break;
    case '/agenda/revisao':
      page = <PlanReview tasks={tasks} onGeneratePlan={generateDraftStudyBlocks} onNavigate={navigate} />;
      break;
    case '/agenda/sugestao':
      page = (
        <PlanSuggestion
          draftStudyBlocks={draftStudyBlocks}
          preferences={studyPreferences}
          onChangeDraftStudyBlocks={setDraftStudyBlocks}
          onNavigate={navigate}
          onSaveStudyBlocks={saveStudyBlocks}
        />
      );
      break;
    case '/agenda/sucesso':
      page = <PlanSuccess studyBlocks={savedStudyBlocks} onNavigate={navigate} />;
      break;
    case '/disciplinas':
      page = <Placeholder subjects={subjects} tasks={tasks} type="disciplinas" onNavigate={navigate} />;
      break;
    case '/disciplinas/nova':
      page = <NewSubject subjects={subjects} onCreateSubject={createSubject} onNavigate={navigate} />;
      break;
    case '/configuracoes':
      page = <Placeholder settings={settings} type="configuracoes" onChangeSettings={setSettings} />;
      break;
    default:
      page = <Home onNavigate={navigate} {...taskPageProps} />;
  }

  return (
    <AppShell route={route} tasks={tasks} remindersEnabled={settings.reminders} onNavigate={navigate}>
      <Toaster position="top-right" gutter={12} toastOptions={{ duration: 8000 }} />
      {page}
    </AppShell>
  );
}
