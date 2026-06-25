import { CreateLinkDto } from '../links/dto/create-link.dto';

export const seedLinks: CreateLinkDto[] = [
  {
    title: 'Jira',
    category: 'Project Management',
    url: 'https://www.atlassian.com/software/jira',
    description: 'Plan work, track delivery, and follow engineering tickets.',
    icon: 'KanbanSquare',
  },
  {
    title: 'Grafana',
    category: 'Monitoring',
    url: 'https://grafana.com/',
    description: 'Inspect service dashboards and operational metrics.',
    icon: 'Activity',
  },
  {
    title: 'Kibana',
    category: 'Logs',
    url: 'https://www.elastic.co/kibana',
    description: 'Search centralized logs and troubleshoot incidents.',
    icon: 'SearchCode',
  },
  {
    title: 'Jenkins',
    category: 'CI/CD',
    url: 'https://www.jenkins.io/',
    description: 'Review build jobs, deployments, and automation pipelines.',
    icon: 'Workflow',
  },
  {
    title: 'Kubernetes',
    category: 'Cluster Dashboard',
    url: 'https://kubernetes.io/',
    description: 'Review workloads, pods, and platform state.',
    icon: 'Boxes',
  },
  {
    title: 'SonarQube',
    category: 'Code Quality',
    url: 'https://www.sonarsource.com/products/sonarqube/',
    description: 'Track code quality gates, vulnerabilities, and coverage.',
    icon: 'ShieldCheck',
  },
  {
    title: 'GitLab',
    category: 'Source Code',
    url: 'https://about.gitlab.com/',
    description: 'Browse repositories, merge requests, and source history.',
    icon: 'GitBranch',
  },
];
