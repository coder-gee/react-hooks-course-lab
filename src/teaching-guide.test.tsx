import { courseFlowTransitions } from "./data/courseFlowTransitions";
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';
import { teachingGuide } from './data/teachingGuide';
import { teachingScreens } from './data/teachingScreens';
import { referenceSlides } from './data/referenceSlides';
import { scenes } from './data/scenes';
import { glossaryTerms } from './data/glossaryTerms';
import { teachingTerminology } from './data/teachingTerminology';
import TeachingText from './components/TeachingText';
import { cuePrompts } from './data/cuePrompts';

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

function open(path: string) {
  window.history.replaceState({}, '', path);
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  return render(<App />);
}

function screenLinks() {
  return within(screen.getByRole('region', { name: 'What to open' }));
}

it('preserves the two-hour schedule and every resource destination', () => {
  expect(teachingGuide[0].start).toBe(0);
  expect(teachingGuide.at(-1)?.end).toBe(120);
  expect(teachingGuide.reduce((sum, stage) => sum + stage.talkMinutes, 0)).toBe(35);
  expect(new Set(teachingGuide.map(stage => stage.id)).size).toBe(teachingGuide.length);
  for (const [index, stage] of teachingGuide.entries()) {
    if (index) expect(stage.start).toBe(teachingGuide[index - 1].end);
    expect(stage.end).toBeGreaterThan(stage.start);
    expect(stage.talkMinutes).toBeLessThanOrEqual(stage.end - stage.start);
    for (const id of stage.referenceIds) {
      expect(referenceSlides.some(slide => slide.id === id)).toBe(true);
    }
    for (const demo of stage.demos) {
      expect(scenes.some(scene => scene.id === demo.id)).toBe(true);
    }
    const plan = teachingScreens[stage.id];
    expect(plan?.steps.length).toBeGreaterThan(0);
    for (const step of plan.steps) {
      for (const id of step.slides || []) expect(stage.referenceIds).toContain(id);
      for (const id of step.demos || []) expect(stage.demos.some(demo => demo.id === id)).toBe(true);
      if (step.checkout) expect(stage.checkpoint).toBeTruthy();
    }
  }
  expect(teachingGuide.find(stage => stage.start === 50)?.end).toBe(55);
  expect(teachingGuide.at(-1)?.start).toBe(114);
});

it('makes the overview, demonstration and student practice use different screen routes', () => {
  open('/guide?stage=hook-map');
  const panel = screen.getByRole('region', { name: 'What to open' });
  expect(panel.querySelector('details')).toBeNull();
  expect(screen.getByRole('region', { name: 'Speaking notes' }).compareDocumentPosition(panel) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
  let route = screenLinks();
  expect(route.getByText(/Lecture slides only/)).toBeTruthy();
  expect(route.queryByRole('heading', { name: 'Discussion' })).toBeNull();
  expect(route.getAllByRole('link').every(link => link.getAttribute('href')?.startsWith('/slides?'))).toBe(true);
  expect(screen.queryByRole('link', { name: /open checkout/i })).toBeNull();

  fireEvent.change(screen.getByLabelText('Current teaching stage'), { target: { value: 'state-snapshots' } });
  expect(screen.getByRole('region', { name: 'What to open' }).querySelector('details')).toBeNull();
  route = screenLinks();
  const demos = route.getAllByRole('link', { name: /open live demo/i });
  expect(demos.map(link => new URL(link.getAttribute('href')!, window.location.origin).searchParams.get('scene'))).toEqual(['remember', 'queue']);
  expect(route.queryByRole('link', { name: /open checkout/i })).toBeNull();

  fireEvent.change(screen.getByLabelText('Current teaching stage'), { target: { value: 'controlled-checkout' } });
  route = screenLinks();
  const practiceLinks = route.getAllByRole('link');
  expect(practiceLinks.map(link => link.getAttribute('href'))).toEqual([
    '/slides?topic=controlled-input',
    '/slides?topic=derived-state',
    '/demo?scene=consistent&stage=controlled-checkout',
    '/checkout?checkpoint=starter&stage=controlled-checkout&view=reference',
    '/checkout?checkpoint=starter&stage=controlled-checkout',
  ]);
  expect(practiceLinks.every(link => link.getAttribute('target') === '_blank')).toBe(true);
  expect(route.queryByText('Only if needed')).toBeNull();
});

it('keeps the two state demonstrations ordered while opening public material separately', () => {
  const stage = teachingGuide.find(item => item.demos.some(demo => demo.id === 'queue'))!;
  expect(stage.demos.map(demo => demo.id)).toEqual(['remember', 'queue']);
  open(`/guide?stage=${stage.id}`);
  screenLinks();
  expect((screen.getByLabelText('Current teaching stage') as HTMLSelectElement).value).toBe(stage.id);
  const links = screen.getAllByRole('link').filter(link => link.getAttribute('href')?.startsWith('/demo?'));
  expect(links.map(link => new URL(link.getAttribute('href')!, window.location.origin).searchParams.get('scene'))).toEqual(['remember', 'queue']);
  for (const link of links) {
    expect(link.getAttribute('target')).toBe('_blank');
    expect(new URL(link.getAttribute('href')!, window.location.origin).searchParams.get('stage')).toBe(stage.id);
  }
});

it('returns from a shared demo to the exact second teaching stage that opened it', () => {
  const stages = teachingGuide.filter(stage => stage.demos.some(demo => demo.id === 'custom'));
  expect(stages.length).toBe(2);
  const origin = stages[1];
  open(`/demo?scene=custom&stage=${origin.id}`);
  const back = screen.getAllByRole('link', { name: /back to teaching guide/i })[0];
  expect(back.getAttribute('href')).toBe(`/guide?stage=${origin.id}`);
  fireEvent.click(back);
  expect((screen.getByLabelText('Current teaching stage') as HTMLSelectElement).value).toBe(origin.id);
});

it('keeps optimization and hands off to Homework without an alternative assessment route', () => {
  open('/guide?stage=optional-callback');
  expect(screen.queryByText(/Skip optimization|consolidate the core/)).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Next stage →' }));
  expect(screen.getByRole('heading', { name: 'Introduce homework and show where to start' })).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Open Homework instructions ↗' }).getAttribute('href')).toBe('/homework');
  expect(screen.getByRole('link', { name: /Open Checkout lab · Homework/ }).getAttribute('href')).toContain('checkpoint=homework');
  expect(screen.queryByText('CHECK UNDERSTANDING')).toBeNull();
});

it('places glossary after lecture slides in lecturer navigation', () => {
  open('/guide');
  const nav = within(screen.getByRole('navigation', { name: 'Teaching surfaces' }));
  expect(nav.getAllByRole('link').map(link => link.textContent)).toEqual(['Teaching guide', 'Lecture slides', 'Live demo', 'Checkout lab', 'Homework', 'Glossary']);
  fireEvent.click(nav.getByRole('link', { name: 'Lecture slides' }));
  expect((screen.getByLabelText('Jump to lecture slide') as HTMLSelectElement).value).toBe('course-intro');
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('React Hooks');
});

it('lecture slides remain independent and tolerate an old fractional step URL', () => {
  open('/slides?step=1.5');
  expect(screen.getByRole('article')).toBeTruthy();
  expect(screen.queryByLabelText('Current teaching stage')).toBeNull();
  expect(screen.queryByText('Presenter cues')).toBeNull();
  expect(screen.queryByText('Expected reasoning')).toBeNull();
  expect(screen.queryByRole('link', { name: /open.*task/i })).toBeNull();
  const slide = referenceSlides[2];
  fireEvent.change(screen.getByLabelText('Jump to lecture slide'), { target: { value: slide.id } });
  expect(window.location.search).toBe(`?topic=${slide.id}`);
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('REACT HOOKS: Rules of Hooks');
});

it('opens the course flow separately and preserves the guide position', () => {
  open('/guide?stage=controlled-checkout');
  const flow = screen.getByRole('link', { name: 'Course flow ↗' });
  expect(flow.getAttribute('href')).toBe('/flow?stage=controlled-checkout');
  expect(flow.getAttribute('target')).toBe('_blank');
  expect(screen.queryByRole('link', { name: 'Full speaking script ↗' })).toBeNull();
  cleanup();
  open('/flow?stage=controlled-checkout');
  expect(document.title).toBe('Course flow · React Hooks Course Lab');
  expect(screen.getByRole('link', { name: /back to teaching guide/i }).getAttribute('href')).toBe('/guide?stage=controlled-checkout');
  expect(screen.getByRole('link', { name: 'Glossary ↗' }).getAttribute('href')).toBe('/glossary?stage=controlled-checkout');
  expect(screen.queryByRole('link', { name: 'Full speaking script ↗' })).toBeNull();
});

it('shows all sixteen screen sequences with the state handover and optional route clearly separated', () => {
  open('/flow?stage=optional-memo&path=consolidate');
  const flow = screen.getByRole('article', { name: 'Course flow' });
  expect(flow.querySelectorAll('.course-flow-stage:not(.course-flow-alternative)')).toHaveLength(teachingGuide.length);
  expect(flow.querySelector('details')).toBeNull();
  expect(flow.querySelector('blockquote')).toBeNull();
  const stateRoute = within(screen.getByRole('region', { name: teachingGuide[3].title }));
  const stateSteps = within(stateRoute.getByRole('list', { name: 'Screen transitions' }));
  expect(stateSteps.getAllByRole('link').map(link => link.getAttribute('href'))).toEqual([
    '/slides?topic=controlled-input',
    '/slides?topic=derived-state',
    '/demo?scene=consistent&stage=controlled-checkout',
    '/checkout?checkpoint=starter&stage=controlled-checkout&view=reference',
    '/checkout?checkpoint=starter&stage=controlled-checkout',
  ]);
  expect(stateRoute.getAllByRole('link').every(link => link.getAttribute('target') === '_blank')).toBe(true);
  const resetRoute = within(screen.getByRole('region', { name: teachingGuide.find(stage => stage.id === 'reducer-reset')!.title }));
  expect(resetRoute.queryAllByText(/If needed/)).toHaveLength(0);
  expect(resetRoute.getAllByRole('link').filter(link => /\/(slides|demo)\?/.test(link.getAttribute('href') || ''))).toHaveLength(0);
  expect(screen.queryByRole('region', { name: 'If you skip optimization' })).toBeNull();
  expect(screen.getByRole('link', { name: /back to teaching guide/i }).getAttribute('href')).toBe('/guide?stage=optional-memo');
});

it('shows only approved main-section scripts fully expanded in Course Flow', () => {
  open('/flow');
  expect(screen.queryByRole('button', { name: 'Expand speaking cues' })).toBeNull();
  expect(screen.queryByRole('region', { name: 'Terms to bring up' })).toBeNull();
  expect(screen.getAllByRole('region', { name: 'Spoken transition' })).toHaveLength(11);
  for (const stage of teachingGuide) {
    const region = within(screen.getByRole('region', { name: stage.title }));
    const paragraphs = courseFlowTransitions[stage.id];
    if (!paragraphs) {
      expect(region.queryByRole('region', { name: 'Spoken transition' })).toBeNull();
      continue;
    }
    const script = within(region.getByRole('region', { name: 'Spoken transition' }));
    for (const paragraph of paragraphs) expect(script.getByText(paragraph)).toBeTruthy();
  }
  const overview = courseFlowTransitions['hook-map']!;
  expect(overview).toHaveLength(2);
  const overviewStage = within(screen.getByRole('region', { name: teachingGuide[1].title }));
  const opening = overviewStage.getByText(overview[0]);
  const rules = overviewStage.getByText(overview[1]);
  expect(opening.compareDocumentPosition(rules) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(rules.compareDocumentPosition(screen.getByText(courseFlowTransitions['state-snapshots']![0])) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Welcome' })).toBeNull();
  expect(screen.queryByText(cuePrompts.Welcome)).toBeNull();
});

it('maps every terminology reminder to a defined term and a slide used in that stage', () => {
  const names = glossaryTerms.map(term => term.phrase);
  expect(new Set(names).size).toBe(names.length);
  for (const stage of teachingGuide) {
    for (const group of teachingTerminology[stage.id]) {
      if (group.slide) expect(stage.referenceIds).toContain(group.slide);
      for (const name of group.terms) expect(names).toContain(name);
    }
  }
});

it('keeps glossary concepts separate from script aliases and only annotates whole terms', () => {
  render(<TeachingText text="An interaction uses an action. connects to things outside the component. Rendering and rendering." />);
  expect(screen.getAllByRole('button', { name: 'action' })).toHaveLength(1);
  expect(screen.getByRole('button', { name: 'connects to things outside the component' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Rendering' })).toBeTruthy();
  cleanup();
  open('/glossary?stage=state-snapshots');
  expect(screen.getAllByRole('term')).toHaveLength(glossaryTerms.length);
  expect(screen.getByText('external system', { selector: 'dt' })).toBeTruthy();
  expect(screen.queryByText('connects to things outside the component', { selector: 'dt' })).toBeNull();
});


it('keeps the guide cues without example speeches or a full-script page', () => {
  for (const stage of teachingGuide) {
    open(`/guide?stage=${stage.id}`);
    const notes = screen.getByRole('region', { name: 'Speaking notes' });
    for (const cue of stage.speakingNotes!.cues) {
      const button = within(notes).getByRole('button', { name: cue });
      expect(document.getElementById(button.getAttribute('aria-describedby')!)?.textContent).toContain(cuePrompts[cue]);
    }
    expect(notes.querySelector('details')).toBeNull();
    expect(notes.querySelector('blockquote')).toBeNull();
    expect(screen.queryByRole('link', { name: /full speaking script/i })).toBeNull();
    cleanup();
  }
  open('/script?stage=state-snapshots');
  expect(screen.queryByRole('article', { name: 'Full speaking script' })).toBeNull();
  expect((screen.getByLabelText('Current teaching stage') as HTMLSelectElement).value).toBe('state-snapshots');
});

it('expands cues independently by stage and remembers each choice through navigation', () => {
  const stored = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => stored.get(key) ?? null,
    setItem: (key: string, value: string) => { stored.set(key, value); },
    clear: () => stored.clear(),
  });
  open('/guide?stage=native-baseline');
  const firstToggle = screen.getByRole('button', { name: 'Expand speaking cues' });
  fireEvent.click(firstToggle);
  expect(firstToggle.getAttribute('aria-pressed')).toBe('true');
  expect(screen.getByText(cuePrompts.Welcome)).toBeTruthy();
  cleanup();
  open('/guide?stage=native-baseline');
  expect(screen.getByRole('button', { name: 'Expand speaking cues' }).getAttribute('aria-pressed')).toBe('true');
  fireEvent.change(screen.getByLabelText('Current teaching stage'), { target: { value: 'hook-map' } });
  expect(screen.getByRole('button', { name: 'Expand speaking cues' }).getAttribute('aria-pressed')).toBe('false');
  fireEvent.change(screen.getByLabelText('Current teaching stage'), { target: { value: 'native-baseline' } });
  fireEvent.click(screen.getByRole('button', { name: 'Expand speaking cues' }));
  expect(screen.getByRole('button', { name: 'Welcome' })).toBeTruthy();
  window.localStorage.clear();
});

it('opens each scoped working target before its unfinished exercise', () => {
  const targets: Record<string, string> = {
    'controlled-checkout': 'starter',
    'subscription-cleanup': 'repair-sync',
    'explicit-focus': 'sync',
    'reducer-reset': 'reducer',
    'context-owner': 'context',
    'custom-extract': 'custom',
    'custom-reuse': 'custom',
  };
  open('/flow');
  for (const [stageId, checkpoint] of Object.entries(targets)) {
    const stage = teachingGuide.find(item => item.id === stageId)!;
    const region = within(screen.getByRole('region', { name: stage.title }));
    const links = region.getAllByRole('link').filter(link => link.getAttribute('href')?.startsWith('/checkout?'));
    expect(links[0].getAttribute('href')).toBe(`/checkout?checkpoint=${checkpoint}&stage=${stageId}&view=reference`);
    expect(links[0].textContent).toMatch(/Working reference/);
    expect(links[1].getAttribute('href')).toBe(`/checkout?checkpoint=${stage.checkpoint}&stage=${stageId}`);
  }
});

it('separates the optimization divider from the useMemo introduction in stage 14', () => {
  open('/flow');
  const region = within(screen.getByRole('region', { name: teachingGuide[13].title }));
  const divider = region.getByRole('heading', { name: 'Slide 26 · Optimization' });
  const hook = region.getByRole('heading', { name: 'Slide 27 · useMemo' });
  expect(divider.parentElement?.querySelector('p')?.textContent).toBe('Our features are working. If an interaction feels slow, we can look for unnecessary work and reduce it. That’s optimization. Let’s see how.');
  expect(hook.parentElement?.querySelector('p')?.textContent).toBe('useMemo lets us reuse a calculated result when its dependencies haven’t changed.');
  expect(divider.parentElement?.textContent).not.toContain('useMemo');
  expect(divider.compareDocumentPosition(hook) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});
