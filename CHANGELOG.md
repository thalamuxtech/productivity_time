# Changelog - Tab View and Auto-Promotion Features

## New Features Added

### 1. **Tab View for Task Organization**
- Added three tabs to organize tasks:
  - **Active**: Tasks that are not completed and not overdue
  - **Completed**: Tasks that have been marked as complete
  - **Overdue**: Tasks that are past their deadline and not completed
- Each tab displays a count badge showing the number of tasks
- Tabs maintain all existing sorting and filtering options

### 2. **Auto-Promotion of Priority Tasks**
When the current priority task becomes overdue:
- The system automatically demotes it from "Priority" to "High" priority
- Automatically selects and promotes the next best task as the new priority task
- Selection criteria for next priority task:
  1. Must not be completed
  2. Must not be overdue
  3. Prioritizes by: High → Medium → Low priority
  4. Among tasks with the same priority, chooses the one with the closest deadline

### 3. **Background Auto-Promotion Check**
- Runs every 10 seconds to check if priority task needs promotion
- Also runs on app load/task refresh
- Seamless and automatic - no user action required

### 4. **Editing Overdue Tasks**
- Overdue tasks can now be fully edited (this was already possible but now explicitly maintained)
- Users can update deadline, priority, and all other fields
- Visual indicator: Overdue tasks have a red left border

## Technical Implementation

### Files Created:
1. `src/components/ui/Tabs.tsx` - Reusable tabs component
2. `src/hooks/useAutoPriorityPromotion.ts` - Hook for background auto-promotion

### Files Modified:
1. `src/store/uiStore.ts` - Added activeTab state
2. `src/store/taskStore.ts` - Added autoPromotePriorityTask function
3. `src/hooks/useTasks.ts` - Added tab filtering and count calculation
4. `src/components/dashboard/Dashboard.tsx` - Added tabs UI
5. `src/components/ui/index.ts` - Exported Tabs component

## How to Use

### Viewing Tasks by Tab:
1. Click on "Active", "Completed", or "Overdue" tabs
2. Each tab shows only tasks matching that status
3. Counts update in real-time

### Auto-Promotion:
1. Set a task as Priority
2. Wait for it to become overdue
3. System automatically promotes the next highest priority task
4. Toast notification appears when auto-promotion occurs

### Editing Overdue Tasks:
1. Navigate to the "Overdue" tab
2. Click the edit icon on any task
3. Modify any field including deadline
4. Save changes

## Visual Indicators

- **Overdue Tasks**: Red left border (4px)
- **Tab Counts**: Badge next to tab name
- **Active Tab**: Blue underline and highlighted text
- **Priority Task Card**: Still shown at top when exists
