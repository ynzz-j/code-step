import type { TrainingPack } from '@/types';

export const DEFAULT_TRAINING_PACK_IDS = [
  'js-high-frequency',
  'python-high-frequency',
  'spring-rest-patterns',
];

export const FEATURED_TRAINING_PACKS: TrainingPack[] = [
  {
    id: 'js-high-frequency',
    title: 'JavaScript 高频肌肉记忆',
    track: '前端与 Node 高频 loop',
    language: 'javascript',
    difficulty: 'intermediate',
    durationModes: ['30s', '3min', 'Loop'],
    sourceCourseIds: ['js-array', 'js-async', 'js-function', 'js-object'],
    patterns: [
      {
        id: 'map-filter-reduce',
        label: 'map / filter / reduce',
        snippets: ['users.map(...)', 'orders.filter(...)', 'cart.reduce(...)'],
        targetSkill: '数组链式处理',
        recommendedDuration: 30,
      },
      {
        id: 'async-await',
        label: 'async / await',
        snippets: ['await fetchUser(userId)', 'try/catch async flow'],
        targetSkill: '异步请求节奏',
        recommendedDuration: 30,
      },
      {
        id: 'object-function',
        label: '函数与对象',
        snippets: ['destructure params', 'return object literal'],
        targetSkill: '业务代码骨架',
        recommendedDuration: 60,
      },
    ],
  },
  {
    id: 'python-high-frequency',
    title: 'Python 高频基础 loop',
    track: '脚本与数据处理肌肉记忆',
    language: 'python',
    difficulty: 'basic',
    durationModes: ['30s', '3min', 'Loop'],
    sourceCourseIds: ['python-list', 'python-dict', 'python-function', 'python-control', 'python-string'],
    patterns: [
      {
        id: 'list-dict',
        label: 'list / dict',
        snippets: ['[item for item in items]', 'user.get("email")'],
        targetSkill: '集合处理',
        recommendedDuration: 30,
      },
      {
        id: 'function-guard',
        label: '函数与 guard',
        snippets: ['def normalize_user(user):', 'if not user_id:'],
        targetSkill: '函数入口判断',
        recommendedDuration: 45,
      },
      {
        id: 'control-string',
        label: '控制流与字符串',
        snippets: ['for item in items:', 'name.strip().lower()'],
        targetSkill: '日常脚本节奏',
        recommendedDuration: 60,
      },
    ],
  },
  {
    id: 'spring-rest-patterns',
    title: 'Spring REST 短模板训练',
    track: '后端接口骨架',
    language: 'java',
    difficulty: 'intermediate',
    durationModes: ['30s', '3min', 'Challenge'],
    sourceCourseIds: ['spring-boot-rest', 'spring-boot-api', 'spring-ioc-core'],
    patterns: [
      {
        id: 'controller-mapping',
        label: 'Controller 注解',
        snippets: ['@RestController', '@GetMapping("/{id}")'],
        targetSkill: 'REST 入口骨架',
        recommendedDuration: 30,
      },
      {
        id: 'service-template',
        label: 'Service 模板',
        snippets: ['private final UserService userService;', 'return userService.findById(id);'],
        targetSkill: '服务层调用',
        recommendedDuration: 45,
      },
      {
        id: 'bean-ioc',
        label: 'IoC Bean',
        snippets: ['@Bean', 'public Clock clock()'],
        targetSkill: '依赖注入节奏',
        recommendedDuration: 60,
      },
    ],
  },
];
