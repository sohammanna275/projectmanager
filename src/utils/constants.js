export const UserRolesEnum = {
    ADMIN: "admin",
    PROJECT_ADMIN: "project_admin",
    MEMBER: "member"
}

export const AvailableUserRole = Object.values(UserRolesEnum);

export const TaskStatusEnum = {
    TO_DO: "to_do",
    IN_PROGRESS: "in_progress",
    REVIEW: "review",
    DONE: "done"
}
export const AvailableTaskStatuses = Object.values(TaskStatusEnum);