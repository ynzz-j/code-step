# Store 拆分与收敛 — 任务总结

**时间**: 2026-05-09 14:19 GMT+8  
**项目**: D:\workspace\whd\code-type  

## 目标

将 `courseStore`（约 300 行，承担 4 种职责）拆分为 4 个独立 Zustand store，降低耦合、保持行为不变。

## 新增文件

| # | 文件 | 职责 | 关键字段/操作 |
|---|------|------|--------------|
| 1 | `src/stores/courseCatalogStore.ts` | 课程加载+筛选 | `courses`, `loadCourses`, `setCategory/Language/Difficulty` |
| 2 | `src/stores/courseSessionStore.ts` | 学习会话+进度 | `currentCourse`, `startCourse`, `markStepCompleted`, `nextStep/prevStep` |
| 3 | `src/stores/typingStatsStore.ts` | 打字统计 | `typingStats`, `recordTypingKeystroke`, `resetTypingStats` |
| 4 | `src/stores/comboStore.ts` | 连击状态 | `currentCombo`, `maxCombo`, `incrementCombo/resetCombo/resetAllCombo` |

## 修改文件

| # | 文件 | 变更 |
|---|------|------|
| 5 | `src/stores/courseStore.ts` | **重写为兼容层** — 通过 zustand subscribe 从 4 个子 store 同步状态，actions 转发到子 store |
| 6 | `src/pages/CoursesPage.tsx` | 改用 `useCourseCatalogStore` + `useCourseSessionStore`；`filteredCourses` 改为 `courses.filter()` 计算 |
| 7 | `src/components/courses/CategoryFilter.tsx` | 改用 `useCourseCatalogStore` |
| 8 | `src/pages/LearnPage.tsx` | 改用 `useCourseSessionStore` + `useTypingStatsStore` + `useComboStore`；`currentStepCompleted` 由 `completedSteps.has()` 推导；按键回调分别更新打字统计和连击；课程切换时重置连击和打字统计 |
| 9 | `src/pages/CompletePage.tsx` | 改用 `useTypingStatsStore` + `useComboStore` |
| 10 | `src/components/learn/ComboDisplay.tsx` | 改用 `useComboStore`，直接 `{ currentCombo, maxCombo }` |
| 11 | `src/hooks/useCourse.ts` | 改用 `useCourseCatalogStore` + `useCourseSessionStore` |
| 12 | `src/hooks/useProgress.ts` | 改用 `useCourseSessionStore` |

## 关键设计决策

1. **`filteredCourses` 不再存状态** — 由 `courses + filters` 通过 filter 计算，消除重复状态和同步漂移
2. **`currentStepCompleted` 不再存状态** — 由 `completedSteps.has(currentStepIndex)` 推导，减少双写
3. **连击与打字分离** — `recordTypingKeystroke` 只更新打字统计；连击由 `useComboStore` 独立管理，页面层组合两个操作
4. **课程切换时重置** — `LearnPage` 的 `useEffect` 中显式调用 `resetAllCombo()` + `resetTypingStats()`，避免跨课程串状态
5. **兼容层保留** — `courseStore.ts` 保留为兼容层，通过 subscription 同步子 store 状态，actions 转发到子 store。所有旧接口仍然可用

## 验证结果

| 项目 | 结果 |
|------|------|
| `tsc --noEmit` | ✅ 零错误 |
| `npx vite build` | ✅ 76 modules, 211KB JS (gzip 67KB) |
| `cargo check` | ✅ 仅预存 warnings |

## 消费者迁移状态

所有直接消费点已迁移完毕，`useCourseStore` 仅作为兼容层保留（可以被后续删除）。
