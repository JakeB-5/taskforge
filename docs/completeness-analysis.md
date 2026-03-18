# TaskForge 프로젝트 완성도 분석

> 분석 일시: 2026-03-17
> 분석 도구: Claude Code Architect Agent (Opus)
> 대상: TaskForge v0.1.0 (205 files, ~15K LOC)

## 요약

TaskForge는 아키텍처적으로 잘 설계되어 있으나 (모노레포, 공유 스키마, 타입 ORM), 프론트엔드-백엔드 통합에서 **13개의 Critical/High 버그**가 발견됨. 가장 치명적인 3가지: (1) API URL에 `/api` prefix 누락, (2) CORS origin이 포트 5173으로 설정 (Next.js는 3000), (3) API 응답 구조 불일치로 모든 store가 `undefined` 수신.

## 발견 사항

### 1. 프론트엔드-백엔드 통합 (CRITICAL)

| # | 이슈 | 파일 | 심각도 | 수정 방안 |
|---|------|------|--------|----------|
| 1.1 | `NEXT_PUBLIC_API_URL`에 `/api` prefix 누락. 모든 API 호출이 404 | `.env`, `api-client.ts` | **CRITICAL** | `.env`와 `.env.example`을 `http://localhost:3001/api`로 변경 |
| 1.2 | CORS origin이 포트 5173 (Vite 기본)으로 설정. Next.js 3000 포트 차단 | `config.ts:26` | **CRITICAL** | `CORS_ORIGIN=http://localhost:3000` 추가, 기본값 변경 |
| 1.3 | 응답 구조 불일치. 백엔드: `{ data: { user: {...} } }`, 프론트: `User` 직접 기대 | 모든 API 함수 | **CRITICAL** | 백엔드에서 엔티티 래핑 제거 또는 프론트에서 구조분해 |
| 1.4 | 리스트 엔드포인트도 동일한 래핑 문제 | 모든 list API | **CRITICAL** | 1.3과 동일 |
| 1.5 | Task 라우트 경로 불일치. 프론트: `/projects/:pId/tasks/:tId`, 백엔드: `/tasks/:id` | `tasks.ts` | **CRITICAL** | 프론트 경로를 `/tasks/:id`로 수정 |
| 1.6 | moveTask: 잘못된 경로 + HTTP 메서드 (POST vs PATCH) | `tasks.ts:26` | **CRITICAL** | `apiClient.patch("/tasks/:id/position")` |
| 1.7 | Project 라우트 경로 불일치 | `projects.ts` | **CRITICAL** | 프론트 경로를 `/projects/:id`로 수정 |
| 1.8 | Label API 경로가 workspace 스코프 사용 (실제: project 스코프) | `labels.ts:5` | **HIGH** | `/projects/:projectId/labels` 사용 |
| 1.9 | Search API 경로 불일치 | `search.ts` | **HIGH** | `/search?q=...&workspaceId=...` 사용 |
| 1.10 | Notification: POST 대신 PATCH 사용해야 함 | `notifications.ts` | **HIGH** | `apiClient.patch` 사용 |
| 1.11 | `/notifications/unread-count` 엔드포인트 미존재 | `notifications.ts` | **HIGH** | 엔드포인트 추가 또는 리스트 응답에서 파싱 |

### 2. 미완성 기능 / 불완전 코드

| # | 이슈 | 심각도 | 수정 방안 |
|---|------|--------|----------|
| 2.1 | "My Tasks" - `assignee=me` 파라미터 미존재 | **HIGH** | `{ assigneeId: currentUserId }` 사용 |
| 2.2 | Forgot-password: 항상 성공 응답, 이메일 미발송 | **MEDIUM** | "기능 준비 중" 표시 또는 구현 |
| 2.3 | notification store의 `readAt` 필드가 DB에 미존재 | **MEDIUM** | store에서 `readAt` 제거 |
| 2.4 | Task 타입 "story"가 DB enum에 미포함 | **LOW** | 타입 또는 스키마 통일 |
| 2.5 | Task 인터페이스의 `startDate`, `sprintId` 필드가 DB에 미존재 | **LOW** | 인터페이스에서 제거 |
| 2.6 | Comment Zod 스키마의 `body` vs DB의 `content` 필드명 불일치 | **MEDIUM** | 필드명 통일 |

### 3. 에러 처리

| # | 이슈 | 심각도 |
|---|------|--------|
| 3.1 | Dashboard fetch 에러 무시 (`.catch(() => {})`) | **MEDIUM** |
| 3.2 | MyTasksView 에러 무시 | **MEDIUM** |
| 3.3 | Store CRUD 액션에 에러 처리 없음 | **MEDIUM** |
| 3.4 | Bulk task update 입력 검증 없음 | **MEDIUM** |

### 4. 타입 안전성

| # | 이슈 | 심각도 |
|---|------|--------|
| 4.1 | API 전체에 47+ `as any` 캐스트 | **HIGH** |
| 4.2 | 프론트 컴포넌트에서 `(task as any).subtasks` 등 관계 필드 접근 | **HIGH** |
| 4.3 | comment-list의 `(comment as any).content` 등 | **MEDIUM** |

### 5. 데이터베이스 / 시드

| # | 이슈 | 심각도 |
|---|------|--------|
| 5.1 | Seed의 패스워드 해시가 placeholder (로그인 불가) | **HIGH** |

### 6. 보안

| # | 이슈 | 심각도 |
|---|------|--------|
| 6.1 | `.env`에 JWT 시크릿 하드코딩 (git 추적 중일 수 있음) | **HIGH** |
| 6.5 | 비밀번호 변경 엔드포인트 미존재 | **MEDIUM** |

### 7. UI/UX

| # | 이슈 | 심각도 |
|---|------|--------|
| 7.1 | Dashboard `myTasks` 항상 빈 배열 | **HIGH** |
| 7.2 | Mutation 후 toast 알림 없음 | **MEDIUM** |
| 7.5 | 가입 후 워크스페이스 생성 플로우 없음 | **HIGH** |

### 8. 테스트

| # | 이슈 | 심각도 |
|---|------|--------|
| 8.1 | 7개 테스트 파일만 존재 (127 tests) | **HIGH** |
| 8.2 | 통합/E2E 테스트 0개 | **HIGH** |

## 우선순위별 수정 계획

| 순위 | 작업 | 예상 규모 | 영향 |
|------|------|----------|------|
| 1 | API URL `/api` prefix 추가 | 1분 | 모든 API 호출 차단 해제 |
| 2 | CORS origin 수정 | 2분 | 브라우저 요청 차단 해제 |
| 3 | 응답 구조 통일 (백엔드 래핑 제거) | 1-2시간 | 모든 store 데이터 수정 |
| 4 | 라우트 경로 불일치 전체 수정 | 1시간 | CRUD 정상화 |
| 5 | Notification HTTP 메서드 + unread-count | 30분 | 알림 기능 정상화 |
| 6 | My Tasks 필터 수정 | 15분 | 마이 태스크 페이지 수정 |
| 7 | Seed 패스워드 해시 실제 생성 | 30분 | 시드 유저 로그인 가능 |
| 8 | 가입 후 워크스페이스 생성 플로우 | 1시간 | 신규 유저 경험 수정 |
| 9 | Hono Env 타입 확장 (`as any` 제거) | 30분 | ~30개 타입 캐스트 제거 |
| 10 | `TaskWithRelations` 타입 생성 | 30분 | ~20개 타입 캐스트 제거 |
| 11 | API 통합 테스트 추가 | 4-6시간 | 회귀 방지 |
| 12 | Dashboard myTasks, 필드명 불일치 수정 | 1시간 | 대시보드 수정 |
