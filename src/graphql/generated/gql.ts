/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "fragment ActivityLogFields on ActivityLog {\n  id\n  action\n  entityType\n  entityId\n  user {\n    id\n    username\n    email\n  }\n  createdAt\n}": typeof types.ActivityLogFieldsFragmentDoc,
    "fragment ChatFields on Chat {\n  id\n  title\n  type\n  status\n  lastActivityAt\n  participants {\n    user {\n      id\n      username\n      email\n    }\n    joinedAt\n  }\n  createdAt\n  updatedAt\n}": typeof types.ChatFieldsFragmentDoc,
    "fragment ChatMessageFields on ChatMessage {\n  id\n  role\n  content\n  sender {\n    id\n    username\n    email\n  }\n  aiMetadata {\n    embeddingModel\n    embeddingSynced\n    indexedAt\n  }\n  mentionedUsers {\n    id\n    username\n    email\n  }\n  referencedFiles {\n    id\n    name\n  }\n  createdAt\n  updatedAt\n}": typeof types.ChatMessageFieldsFragmentDoc,
    "fragment FileFields on File {\n  id\n  name\n  size\n  folder {\n    id\n  }\n  storage {\n    bucketName\n    objectKey\n    etag\n    versionId\n    checksum\n    mimeType\n    uploadedBy {\n      id\n      username\n      email\n    }\n    downloadUrl\n    createdAt\n    updatedAt\n  }\n  properties {\n    originalName\n    isIndexed\n    deletedAt\n    createdAt\n    updatedAt\n  }\n  aiMetadata {\n    extractedText\n    embeddingModel\n    embeddingSynced\n    indexedAt\n    processingStatus\n    summary\n    errorMessage\n    createdAt\n    updatedAt\n  }\n  createdAt\n  updatedAt\n}": typeof types.FileFieldsFragmentDoc,
    "fragment FileShareFields on FileShare {\n  id\n  sharedBy {\n    id\n    username\n    email\n  }\n  sharedWith {\n    id\n    username\n    email\n  }\n  permission\n  createdAt\n}": typeof types.FileShareFieldsFragmentDoc,
    "fragment FlowchartFields on Flowchart {\n  id\n  name\n  data\n  generatedBy {\n    id\n    username\n    email\n  }\n  generatedByAI\n  status\n  sourceChat {\n    id\n  }\n  createdAt\n  updatedAt\n}": typeof types.FlowchartFieldsFragmentDoc,
    "fragment FolderFields on Folder {\n  id\n  name\n  parentFolder {\n    id\n  }\n  createdAt\n  updatedAt\n}": typeof types.FolderFieldsFragmentDoc,
    "fragment ProjectFields on Project {\n  id\n  name\n  description\n  visibility\n  owner {\n    id\n    username\n    email\n  }\n  archivedAt\n  createdAt\n  updatedAt\n}": typeof types.ProjectFieldsFragmentDoc,
    "fragment ProjectMemberFields on ProjectMember {\n  id\n  role\n  user {\n    id\n    username\n    email\n  }\n  createdAt\n  updatedAt\n}": typeof types.ProjectMemberFieldsFragmentDoc,
    "fragment ReportFields on Report {\n  id\n  title\n  content\n  format\n  properties {\n    generatedBy {\n      id\n      username\n      email\n    }\n    generatedByAI\n    status\n    sourceChat {\n      id\n    }\n  }\n  createdAt\n  updatedAt\n}": typeof types.ReportFieldsFragmentDoc,
    "fragment UserFields on User {\n  id\n  username\n  email\n  profile {\n    firstName\n    lastName\n    bio\n    avatarUrl\n    createdAt\n    updatedAt\n  }\n  createdAt\n  updatedAt\n}": typeof types.UserFieldsFragmentDoc,
    "mutation CreateActivityLog($input: CreateActivityLogInput!) {\n  createActivityLog(input: $input) {\n    ...ActivityLogFields\n  }\n}": typeof types.CreateActivityLogDocument,
    "mutation DeleteActivityLogByID($id: ID!) {\n  deleteActivityLogByID(id: $id)\n}": typeof types.DeleteActivityLogByIdDocument,
    "mutation CreateChatMessage($input: CreateChatMessageInput!) {\n  createChatMessage(input: $input) {\n    ...ChatMessageFields\n  }\n}": typeof types.CreateChatMessageDocument,
    "mutation CreateChatParticipant($input: CreateChatParticipantInput!) {\n  createChatParticipant(input: $input) {\n    user {\n      id\n      username\n      email\n    }\n    joinedAt\n  }\n}": typeof types.CreateChatParticipantDocument,
    "mutation CreateChat($input: CreateChatInput!) {\n  createChat(input: $input) {\n    ...ChatFields\n  }\n}": typeof types.CreateChatDocument,
    "mutation DeleteChatMessage($id: ID!) {\n  deleteChatMessage(id: $id)\n}": typeof types.DeleteChatMessageDocument,
    "mutation DeleteChat($id: ID!) {\n  deleteChat(id: $id)\n}": typeof types.DeleteChatDocument,
    "mutation RemoveChatParticipant($chatId: ID!, $userId: ID!) {\n  removeChatParticipant(chatId: $chatId, userId: $userId)\n}": typeof types.RemoveChatParticipantDocument,
    "mutation UpdateChatMessage($input: UpdateChatMessageInput!) {\n  updateChatMessage(input: $input) {\n    ...ChatMessageFields\n  }\n}": typeof types.UpdateChatMessageDocument,
    "mutation UpdateChat($id: ID!, $input: UpdateChatInput!) {\n  updateChat(id: $id, input: $input) {\n    ...ChatFields\n  }\n}": typeof types.UpdateChatDocument,
    "mutation CreateFile($input: CreateFileInput!) {\n  createFile(input: $input) {\n    ...FileFields\n  }\n}": typeof types.CreateFileDocument,
    "mutation CreateFolder($input: CreateFolderInput!) {\n  createFolder(input: $input) {\n    ...FolderFields\n  }\n}": typeof types.CreateFolderDocument,
    "mutation DeleteFileShare($fileShareId: ID!) {\n  deleteFileShare(fileShareId: $fileShareId)\n}": typeof types.DeleteFileShareDocument,
    "mutation DeleteFile($fileId: ID!) {\n  deleteFile(fileId: $fileId)\n}": typeof types.DeleteFileDocument,
    "mutation DeleteFolder($folderId: ID!) {\n  deleteFolder(folderId: $folderId)\n}": typeof types.DeleteFolderDocument,
    "mutation MoveFile($input: MoveFileInput!) {\n  moveFile(input: $input) {\n    ...FileFields\n  }\n}": typeof types.MoveFileDocument,
    "mutation MoveFolder($folderId: ID!, $parentFolderId: ID) {\n  moveFolder(folderId: $folderId, parentFolderId: $parentFolderId) {\n    ...FolderFields\n  }\n}": typeof types.MoveFolderDocument,
    "mutation RenameFile($fileId: ID!, $name: String!) {\n  renameFile(fileId: $fileId, name: $name) {\n    ...FileFields\n  }\n}": typeof types.RenameFileDocument,
    "mutation RenameFolder($folderId: ID!, $name: String!) {\n  renameFolder(folderId: $folderId, name: $name) {\n    ...FolderFields\n  }\n}": typeof types.RenameFolderDocument,
    "mutation RestoreFile($fileId: ID!) {\n  restoreFile(fileId: $fileId) {\n    ...FileFields\n  }\n}": typeof types.RestoreFileDocument,
    "mutation RestoreFolder($folderId: ID!) {\n  restoreFolder(folderId: $folderId) {\n    ...FolderFields\n  }\n}": typeof types.RestoreFolderDocument,
    "mutation SetFileFavorite($input: SetFileFavoriteInput!) {\n  setFileFavorite(input: $input) {\n    user {\n      id\n      username\n      email\n    }\n    file {\n      id\n      name\n    }\n    isFavorite\n    createdAt\n    updatedAt\n  }\n}": typeof types.SetFileFavoriteDocument,
    "mutation ShareFile($input: ShareFileInput!) {\n  shareFile(input: $input) {\n    ...FileShareFields\n  }\n}": typeof types.ShareFileDocument,
    "mutation TrashFile($fileId: ID!) {\n  trashFile(fileId: $fileId) {\n    ...FileFields\n  }\n}": typeof types.TrashFileDocument,
    "mutation TrashFolder($folderId: ID!) {\n  trashFolder(folderId: $folderId) {\n    ...FolderFields\n  }\n}": typeof types.TrashFolderDocument,
    "mutation UpdateFileSharePermission($fileShareId: ID!, $permission: FilePermission!) {\n  updateFileSharePermission(fileShareId: $fileShareId, permission: $permission) {\n    ...FileShareFields\n  }\n}": typeof types.UpdateFileSharePermissionDocument,
    "mutation CreateFlowchart($input: CreateFlowchartInput!) {\n  createFlowchart(input: $input) {\n    ...FlowchartFields\n  }\n}": typeof types.CreateFlowchartDocument,
    "mutation DeleteFlowchart($id: ID!) {\n  deleteFlowchart(id: $id)\n}": typeof types.DeleteFlowchartDocument,
    "mutation UpdateFlowchart($id: ID!, $input: UpdateFlowchartInput!) {\n  updateFlowchart(id: $id, input: $input) {\n    ...FlowchartFields\n  }\n}": typeof types.UpdateFlowchartDocument,
    "mutation AddProjectMember($input: AddProjectMemberInput!) {\n  addProjectMember(input: $input) {\n    ...ProjectMemberFields\n  }\n}": typeof types.AddProjectMemberDocument,
    "mutation ArchiveProject($projectId: ID!) {\n  archiveProject(projectId: $projectId)\n}": typeof types.ArchiveProjectDocument,
    "mutation CreateProject($input: CreateProjectInput!) {\n  createProject(input: $input) {\n    ...ProjectFields\n  }\n}": typeof types.CreateProjectDocument,
    "mutation DeleteProject($id: ID!) {\n  deleteProject(id: $id)\n}": typeof types.DeleteProjectDocument,
    "mutation RemoveProjectMember($projectId: ID!, $userId: ID!) {\n  removeProjectMember(projectId: $projectId, userId: $userId)\n}": typeof types.RemoveProjectMemberDocument,
    "mutation RestoreProject($projectId: ID!) {\n  restoreProject(projectId: $projectId)\n}": typeof types.RestoreProjectDocument,
    "mutation TransferProjectOwnership($input: TransferProjectOwnershipInput!) {\n  transferProjectOwnership(input: $input) {\n    ...ProjectFields\n  }\n}": typeof types.TransferProjectOwnershipDocument,
    "mutation UpdateProjectMemberRole($input: UpdateProjectMemberRoleInput!) {\n  updateProjectMemberRole(input: $input) {\n    ...ProjectMemberFields\n  }\n}": typeof types.UpdateProjectMemberRoleDocument,
    "mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {\n  updateProject(id: $id, input: $input) {\n    ...ProjectFields\n  }\n}": typeof types.UpdateProjectDocument,
    "mutation CreateReport($input: CreateReportInput!) {\n  createReport(input: $input) {\n    ...ReportFields\n  }\n}": typeof types.CreateReportDocument,
    "mutation DeleteReport($id: ID!) {\n  deleteReport(id: $id)\n}": typeof types.DeleteReportDocument,
    "mutation UpdateReport($id: ID!, $input: UpdateReportInput!) {\n  updateReport(id: $id, input: $input) {\n    ...ReportFields\n  }\n}": typeof types.UpdateReportDocument,
    "mutation CreateUser($input: CreateUserInput!) {\n  createUser(input: $input) {\n    ...UserFields\n  }\n}": typeof types.CreateUserDocument,
    "mutation DeleteUser($id: ID!) {\n  deleteUser(id: $id)\n}": typeof types.DeleteUserDocument,
    "mutation UpdateUserAvatar($id: ID!, $input: UpdateUserAvatarInput!) {\n  updateUserAvatar(id: $id, input: $input) {\n    user {\n      id\n      username\n      email\n    }\n    firstName\n    lastName\n    bio\n    avatarUrl\n    createdAt\n    updatedAt\n  }\n}": typeof types.UpdateUserAvatarDocument,
    "mutation UpdateUserProfile($id: ID!, $input: UpdateUserProfileInput!) {\n  updateUserProfile(id: $id, input: $input) {\n    user {\n      id\n      username\n      email\n    }\n    firstName\n    lastName\n    bio\n    avatarUrl\n    createdAt\n    updatedAt\n  }\n}": typeof types.UpdateUserProfileDocument,
    "mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {\n  updateUser(id: $id, input: $input) {\n    ...UserFields\n  }\n}": typeof types.UpdateUserDocument,
    "query GetActivityLogs($projectId: ID, $userId: ID) {\n  activityLogs(projectId: $projectId, userId: $userId) {\n    ...ActivityLogFields\n  }\n}": typeof types.GetActivityLogsDocument,
    "query GetActiveChats($projectId: ID!) {\n  activeChats(projectId: $projectId) {\n    ...ChatFields\n  }\n}": typeof types.GetActiveChatsDocument,
    "query GetArchivedChats($projectId: ID!) {\n  archivedChats(projectId: $projectId) {\n    ...ChatFields\n  }\n}": typeof types.GetArchivedChatsDocument,
    "query GetChatMessages($chatId: ID!) {\n  chatMessages(chatId: $chatId) {\n    ...ChatMessageFields\n  }\n}": typeof types.GetChatMessagesDocument,
    "query GetChat($id: ID!) {\n  chat(id: $id) {\n    ...ChatFields\n  }\n}": typeof types.GetChatDocument,
    "query GetChats($projectId: ID!) {\n  chats(projectId: $projectId) {\n    ...ChatFields\n  }\n}": typeof types.GetChatsDocument,
    "query GetMyChats($projectId: ID) {\n  myChats(projectId: $projectId) {\n    ...ChatFields\n  }\n}": typeof types.GetMyChatsDocument,
    "query GetFavoriteFiles($userId: ID!, $projectId: ID) {\n  favoriteFiles(userId: $userId, projectId: $projectId) {\n    ...FileFields\n  }\n}": typeof types.GetFavoriteFilesDocument,
    "query GetFileShare($id: ID!) {\n  fileShare(id: $id) {\n    ...FileShareFields\n  }\n}": typeof types.GetFileShareDocument,
    "query GetFileShares($fileId: ID!) {\n  fileShares(fileId: $fileId) {\n    ...FileShareFields\n  }\n}": typeof types.GetFileSharesDocument,
    "query GetFileWithShares($id: ID!) {\n  file(id: $id) {\n    id\n    name\n    size\n    createdAt\n    updatedAt\n    shares {\n      ...FileShareFields\n    }\n  }\n}": typeof types.GetFileWithSharesDocument,
    "query GetFile($id: ID!) {\n  file(id: $id) {\n    ...FileFields\n  }\n}": typeof types.GetFileDocument,
    "query GetFiles($projectId: ID, $folderId: ID) {\n  files(projectId: $projectId, folderId: $folderId) {\n    ...FileFields\n  }\n}": typeof types.GetFilesDocument,
    "query GetFolderContents($folderId: ID, $projectId: ID) {\n  folderContents(folderId: $folderId, projectId: $projectId) {\n    __typename\n    ... on Folder {\n      ...FolderFields\n    }\n    ... on File {\n      ...FileFields\n    }\n  }\n}": typeof types.GetFolderContentsDocument,
    "query GetFolderPath($folderId: ID!) {\n  folderPath(folderId: $folderId) {\n    ...FolderFields\n  }\n}": typeof types.GetFolderPathDocument,
    "query GetFolderTree($id: ID!) {\n  folder(id: $id) {\n    ...FolderFields\n    parentFolder {\n      ...FolderFields\n    }\n    childFolders {\n      ...FolderFields\n    }\n  }\n}": typeof types.GetFolderTreeDocument,
    "query GetFolder($id: ID!) {\n  folder(id: $id) {\n    ...FolderFields\n    parentFolder {\n      ...FolderFields\n    }\n  }\n}": typeof types.GetFolderDocument,
    "query GetFolders($projectId: ID) {\n  folders(projectId: $projectId) {\n    ...FolderFields\n  }\n}": typeof types.GetFoldersDocument,
    "query GetRootFiles($projectId: ID) {\n  rootFiles(projectId: $projectId) {\n    ...FileFields\n  }\n}": typeof types.GetRootFilesDocument,
    "query GetRootFolders($projectId: ID) {\n  rootFolders(projectId: $projectId) {\n    ...FolderFields\n  }\n}": typeof types.GetRootFoldersDocument,
    "query GetSharedWithMe($userId: ID!) {\n  sharedWithMe(userId: $userId) {\n    ...FileShareFields\n  }\n}": typeof types.GetSharedWithMeDocument,
    "query GetTrashedFiles($projectId: ID) {\n  trashedFiles(projectId: $projectId) {\n    ...FileFields\n  }\n}": typeof types.GetTrashedFilesDocument,
    "query GetTrashedFolders($projectId: ID) {\n  trashedFolders(projectId: $projectId) {\n    ...FolderFields\n  }\n}": typeof types.GetTrashedFoldersDocument,
    "query GetFlowchart($id: ID!) {\n  flowchart(id: $id) {\n    ...FlowchartFields\n  }\n}": typeof types.GetFlowchartDocument,
    "query GetFlowcharts($projectId: ID!) {\n  flowcharts(projectId: $projectId) {\n    ...FlowchartFields\n  }\n}": typeof types.GetFlowchartsDocument,
    "query GetArchivedProjectsByOwner($ownerId: ID!) {\n  archivedProjectsByOwner(ownerId: $ownerId) {\n    ...ProjectFields\n  }\n}": typeof types.GetArchivedProjectsByOwnerDocument,
    "query GetArchivedProjectsForUser($userId: ID!) {\n  archivedProjectsForUser(userId: $userId) {\n    ...ProjectFields\n  }\n}": typeof types.GetArchivedProjectsForUserDocument,
    "query GetDashboard {\n  projects {\n    ...ProjectFields\n    members {\n      id\n      role\n      user {\n        id\n        username\n      }\n    }\n    files {\n      file {\n        id\n        name\n        size\n        createdAt\n        aiMetadata {\n          processingStatus\n        }\n      }\n    }\n    chats {\n      id\n    }\n    reports {\n      id\n    }\n    flowcharts {\n      id\n    }\n    activityLogs {\n      ...ActivityLogFields\n    }\n  }\n}": typeof types.GetDashboardDocument,
    "query GetProjectMembers($projectId: ID!) {\n  projectMembers(projectId: $projectId) {\n    ...ProjectMemberFields\n  }\n}": typeof types.GetProjectMembersDocument,
    "query GetProjectStats($projectId: ID!) {\n  projectStats(projectId: $projectId) {\n    memberCount\n    fileCount\n    chatCount\n    reportCount\n    flowchartCount\n  }\n}": typeof types.GetProjectStatsDocument,
    "query GetProject($id: ID!) {\n  project(id: $id) {\n    ...ProjectFields\n  }\n}": typeof types.GetProjectDocument,
    "query GetProjectsByOwner($ownerId: ID!) {\n  projectsByOwner(ownerId: $ownerId) {\n    ...ProjectFields\n  }\n}": typeof types.GetProjectsByOwnerDocument,
    "query GetProjectsForUser($userId: ID!) {\n  projectsForUser(userId: $userId) {\n    ...ProjectFields\n  }\n}": typeof types.GetProjectsForUserDocument,
    "query GetProjects {\n  projects {\n    ...ProjectFields\n  }\n}": typeof types.GetProjectsDocument,
    "query GetAIReports($projectId: ID!) {\n  aiReports(projectId: $projectId) {\n    ...ReportFields\n  }\n}": typeof types.GetAiReportsDocument,
    "query GetReport($id: ID!) {\n  report(id: $id) {\n    ...ReportFields\n  }\n}": typeof types.GetReportDocument,
    "query GetReportsByChat($sourceChatId: ID!) {\n  reportsByChat(sourceChatId: $sourceChatId) {\n    ...ReportFields\n  }\n}": typeof types.GetReportsByChatDocument,
    "query GetReportsByFormat($projectId: ID!, $format: ReportFormat!) {\n  reportsByFormat(projectId: $projectId, format: $format) {\n    ...ReportFields\n  }\n}": typeof types.GetReportsByFormatDocument,
    "query GetReportsByGenerator($projectId: ID!, $generatedById: ID!) {\n  reportsByGenerator(projectId: $projectId, generatedById: $generatedById) {\n    ...ReportFields\n  }\n}": typeof types.GetReportsByGeneratorDocument,
    "query GetReportsByStatus($projectId: ID!, $status: ReportStatus!) {\n  reportsByStatus(projectId: $projectId, status: $status) {\n    ...ReportFields\n  }\n}": typeof types.GetReportsByStatusDocument,
    "query GetReports($projectId: ID!) {\n  reports(projectId: $projectId) {\n    ...ReportFields\n  }\n}": typeof types.GetReportsDocument,
    "query GetAllUsers {\n  allUsers {\n    ...UserFields\n  }\n}": typeof types.GetAllUsersDocument,
    "query GetUserByEmail($email: String!) {\n  userByEmail(email: $email) {\n    ...UserFields\n  }\n}": typeof types.GetUserByEmailDocument,
    "query GetUserByUsername($username: String!) {\n  userByUsername(username: $username) {\n    ...UserFields\n  }\n}": typeof types.GetUserByUsernameDocument,
    "query GetUserProfile($userId: ID!) {\n  userProfile(userId: $userId) {\n    user {\n      id\n      username\n      email\n    }\n    firstName\n    lastName\n    bio\n    avatarUrl\n    createdAt\n    updatedAt\n  }\n}": typeof types.GetUserProfileDocument,
    "query GetUserWorkspace($id: ID!) {\n  user(id: $id) {\n    id\n    username\n    ownedProjects {\n      ...ProjectFields\n    }\n    projectMemberships {\n      id\n      role\n      project {\n        id\n        name\n        visibility\n      }\n    }\n    sharedFiles {\n      ...FileShareFields\n      file {\n        id\n        name\n        size\n      }\n    }\n  }\n}": typeof types.GetUserWorkspaceDocument,
    "query GetUser($id: ID!) {\n  user(id: $id) {\n    ...UserFields\n  }\n}": typeof types.GetUserDocument,
    "query GetUsers($ids: [ID!]!) {\n  users(ids: $ids) {\n    ...UserFields\n  }\n}": typeof types.GetUsersDocument,
    "query Me {\n  me {\n    ...UserFields\n  }\n}": typeof types.MeDocument,
    "query SearchUsers($query: String!, $limit: Int) {\n  searchUsers(query: $query, limit: $limit) {\n    ...UserFields\n  }\n}": typeof types.SearchUsersDocument,
    "subscription ChatMessageAdded($chatId: ID!) {\n  chatMessageAdded(chatId: $chatId) {\n    ...ChatMessageFields\n  }\n}": typeof types.ChatMessageAddedDocument,
};
const documents: Documents = {
    "fragment ActivityLogFields on ActivityLog {\n  id\n  action\n  entityType\n  entityId\n  user {\n    id\n    username\n    email\n  }\n  createdAt\n}": types.ActivityLogFieldsFragmentDoc,
    "fragment ChatFields on Chat {\n  id\n  title\n  type\n  status\n  lastActivityAt\n  participants {\n    user {\n      id\n      username\n      email\n    }\n    joinedAt\n  }\n  createdAt\n  updatedAt\n}": types.ChatFieldsFragmentDoc,
    "fragment ChatMessageFields on ChatMessage {\n  id\n  role\n  content\n  sender {\n    id\n    username\n    email\n  }\n  aiMetadata {\n    embeddingModel\n    embeddingSynced\n    indexedAt\n  }\n  mentionedUsers {\n    id\n    username\n    email\n  }\n  referencedFiles {\n    id\n    name\n  }\n  createdAt\n  updatedAt\n}": types.ChatMessageFieldsFragmentDoc,
    "fragment FileFields on File {\n  id\n  name\n  size\n  folder {\n    id\n  }\n  storage {\n    bucketName\n    objectKey\n    etag\n    versionId\n    checksum\n    mimeType\n    uploadedBy {\n      id\n      username\n      email\n    }\n    downloadUrl\n    createdAt\n    updatedAt\n  }\n  properties {\n    originalName\n    isIndexed\n    deletedAt\n    createdAt\n    updatedAt\n  }\n  aiMetadata {\n    extractedText\n    embeddingModel\n    embeddingSynced\n    indexedAt\n    processingStatus\n    summary\n    errorMessage\n    createdAt\n    updatedAt\n  }\n  createdAt\n  updatedAt\n}": types.FileFieldsFragmentDoc,
    "fragment FileShareFields on FileShare {\n  id\n  sharedBy {\n    id\n    username\n    email\n  }\n  sharedWith {\n    id\n    username\n    email\n  }\n  permission\n  createdAt\n}": types.FileShareFieldsFragmentDoc,
    "fragment FlowchartFields on Flowchart {\n  id\n  name\n  data\n  generatedBy {\n    id\n    username\n    email\n  }\n  generatedByAI\n  status\n  sourceChat {\n    id\n  }\n  createdAt\n  updatedAt\n}": types.FlowchartFieldsFragmentDoc,
    "fragment FolderFields on Folder {\n  id\n  name\n  parentFolder {\n    id\n  }\n  createdAt\n  updatedAt\n}": types.FolderFieldsFragmentDoc,
    "fragment ProjectFields on Project {\n  id\n  name\n  description\n  visibility\n  owner {\n    id\n    username\n    email\n  }\n  archivedAt\n  createdAt\n  updatedAt\n}": types.ProjectFieldsFragmentDoc,
    "fragment ProjectMemberFields on ProjectMember {\n  id\n  role\n  user {\n    id\n    username\n    email\n  }\n  createdAt\n  updatedAt\n}": types.ProjectMemberFieldsFragmentDoc,
    "fragment ReportFields on Report {\n  id\n  title\n  content\n  format\n  properties {\n    generatedBy {\n      id\n      username\n      email\n    }\n    generatedByAI\n    status\n    sourceChat {\n      id\n    }\n  }\n  createdAt\n  updatedAt\n}": types.ReportFieldsFragmentDoc,
    "fragment UserFields on User {\n  id\n  username\n  email\n  profile {\n    firstName\n    lastName\n    bio\n    avatarUrl\n    createdAt\n    updatedAt\n  }\n  createdAt\n  updatedAt\n}": types.UserFieldsFragmentDoc,
    "mutation CreateActivityLog($input: CreateActivityLogInput!) {\n  createActivityLog(input: $input) {\n    ...ActivityLogFields\n  }\n}": types.CreateActivityLogDocument,
    "mutation DeleteActivityLogByID($id: ID!) {\n  deleteActivityLogByID(id: $id)\n}": types.DeleteActivityLogByIdDocument,
    "mutation CreateChatMessage($input: CreateChatMessageInput!) {\n  createChatMessage(input: $input) {\n    ...ChatMessageFields\n  }\n}": types.CreateChatMessageDocument,
    "mutation CreateChatParticipant($input: CreateChatParticipantInput!) {\n  createChatParticipant(input: $input) {\n    user {\n      id\n      username\n      email\n    }\n    joinedAt\n  }\n}": types.CreateChatParticipantDocument,
    "mutation CreateChat($input: CreateChatInput!) {\n  createChat(input: $input) {\n    ...ChatFields\n  }\n}": types.CreateChatDocument,
    "mutation DeleteChatMessage($id: ID!) {\n  deleteChatMessage(id: $id)\n}": types.DeleteChatMessageDocument,
    "mutation DeleteChat($id: ID!) {\n  deleteChat(id: $id)\n}": types.DeleteChatDocument,
    "mutation RemoveChatParticipant($chatId: ID!, $userId: ID!) {\n  removeChatParticipant(chatId: $chatId, userId: $userId)\n}": types.RemoveChatParticipantDocument,
    "mutation UpdateChatMessage($input: UpdateChatMessageInput!) {\n  updateChatMessage(input: $input) {\n    ...ChatMessageFields\n  }\n}": types.UpdateChatMessageDocument,
    "mutation UpdateChat($id: ID!, $input: UpdateChatInput!) {\n  updateChat(id: $id, input: $input) {\n    ...ChatFields\n  }\n}": types.UpdateChatDocument,
    "mutation CreateFile($input: CreateFileInput!) {\n  createFile(input: $input) {\n    ...FileFields\n  }\n}": types.CreateFileDocument,
    "mutation CreateFolder($input: CreateFolderInput!) {\n  createFolder(input: $input) {\n    ...FolderFields\n  }\n}": types.CreateFolderDocument,
    "mutation DeleteFileShare($fileShareId: ID!) {\n  deleteFileShare(fileShareId: $fileShareId)\n}": types.DeleteFileShareDocument,
    "mutation DeleteFile($fileId: ID!) {\n  deleteFile(fileId: $fileId)\n}": types.DeleteFileDocument,
    "mutation DeleteFolder($folderId: ID!) {\n  deleteFolder(folderId: $folderId)\n}": types.DeleteFolderDocument,
    "mutation MoveFile($input: MoveFileInput!) {\n  moveFile(input: $input) {\n    ...FileFields\n  }\n}": types.MoveFileDocument,
    "mutation MoveFolder($folderId: ID!, $parentFolderId: ID) {\n  moveFolder(folderId: $folderId, parentFolderId: $parentFolderId) {\n    ...FolderFields\n  }\n}": types.MoveFolderDocument,
    "mutation RenameFile($fileId: ID!, $name: String!) {\n  renameFile(fileId: $fileId, name: $name) {\n    ...FileFields\n  }\n}": types.RenameFileDocument,
    "mutation RenameFolder($folderId: ID!, $name: String!) {\n  renameFolder(folderId: $folderId, name: $name) {\n    ...FolderFields\n  }\n}": types.RenameFolderDocument,
    "mutation RestoreFile($fileId: ID!) {\n  restoreFile(fileId: $fileId) {\n    ...FileFields\n  }\n}": types.RestoreFileDocument,
    "mutation RestoreFolder($folderId: ID!) {\n  restoreFolder(folderId: $folderId) {\n    ...FolderFields\n  }\n}": types.RestoreFolderDocument,
    "mutation SetFileFavorite($input: SetFileFavoriteInput!) {\n  setFileFavorite(input: $input) {\n    user {\n      id\n      username\n      email\n    }\n    file {\n      id\n      name\n    }\n    isFavorite\n    createdAt\n    updatedAt\n  }\n}": types.SetFileFavoriteDocument,
    "mutation ShareFile($input: ShareFileInput!) {\n  shareFile(input: $input) {\n    ...FileShareFields\n  }\n}": types.ShareFileDocument,
    "mutation TrashFile($fileId: ID!) {\n  trashFile(fileId: $fileId) {\n    ...FileFields\n  }\n}": types.TrashFileDocument,
    "mutation TrashFolder($folderId: ID!) {\n  trashFolder(folderId: $folderId) {\n    ...FolderFields\n  }\n}": types.TrashFolderDocument,
    "mutation UpdateFileSharePermission($fileShareId: ID!, $permission: FilePermission!) {\n  updateFileSharePermission(fileShareId: $fileShareId, permission: $permission) {\n    ...FileShareFields\n  }\n}": types.UpdateFileSharePermissionDocument,
    "mutation CreateFlowchart($input: CreateFlowchartInput!) {\n  createFlowchart(input: $input) {\n    ...FlowchartFields\n  }\n}": types.CreateFlowchartDocument,
    "mutation DeleteFlowchart($id: ID!) {\n  deleteFlowchart(id: $id)\n}": types.DeleteFlowchartDocument,
    "mutation UpdateFlowchart($id: ID!, $input: UpdateFlowchartInput!) {\n  updateFlowchart(id: $id, input: $input) {\n    ...FlowchartFields\n  }\n}": types.UpdateFlowchartDocument,
    "mutation AddProjectMember($input: AddProjectMemberInput!) {\n  addProjectMember(input: $input) {\n    ...ProjectMemberFields\n  }\n}": types.AddProjectMemberDocument,
    "mutation ArchiveProject($projectId: ID!) {\n  archiveProject(projectId: $projectId)\n}": types.ArchiveProjectDocument,
    "mutation CreateProject($input: CreateProjectInput!) {\n  createProject(input: $input) {\n    ...ProjectFields\n  }\n}": types.CreateProjectDocument,
    "mutation DeleteProject($id: ID!) {\n  deleteProject(id: $id)\n}": types.DeleteProjectDocument,
    "mutation RemoveProjectMember($projectId: ID!, $userId: ID!) {\n  removeProjectMember(projectId: $projectId, userId: $userId)\n}": types.RemoveProjectMemberDocument,
    "mutation RestoreProject($projectId: ID!) {\n  restoreProject(projectId: $projectId)\n}": types.RestoreProjectDocument,
    "mutation TransferProjectOwnership($input: TransferProjectOwnershipInput!) {\n  transferProjectOwnership(input: $input) {\n    ...ProjectFields\n  }\n}": types.TransferProjectOwnershipDocument,
    "mutation UpdateProjectMemberRole($input: UpdateProjectMemberRoleInput!) {\n  updateProjectMemberRole(input: $input) {\n    ...ProjectMemberFields\n  }\n}": types.UpdateProjectMemberRoleDocument,
    "mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {\n  updateProject(id: $id, input: $input) {\n    ...ProjectFields\n  }\n}": types.UpdateProjectDocument,
    "mutation CreateReport($input: CreateReportInput!) {\n  createReport(input: $input) {\n    ...ReportFields\n  }\n}": types.CreateReportDocument,
    "mutation DeleteReport($id: ID!) {\n  deleteReport(id: $id)\n}": types.DeleteReportDocument,
    "mutation UpdateReport($id: ID!, $input: UpdateReportInput!) {\n  updateReport(id: $id, input: $input) {\n    ...ReportFields\n  }\n}": types.UpdateReportDocument,
    "mutation CreateUser($input: CreateUserInput!) {\n  createUser(input: $input) {\n    ...UserFields\n  }\n}": types.CreateUserDocument,
    "mutation DeleteUser($id: ID!) {\n  deleteUser(id: $id)\n}": types.DeleteUserDocument,
    "mutation UpdateUserAvatar($id: ID!, $input: UpdateUserAvatarInput!) {\n  updateUserAvatar(id: $id, input: $input) {\n    user {\n      id\n      username\n      email\n    }\n    firstName\n    lastName\n    bio\n    avatarUrl\n    createdAt\n    updatedAt\n  }\n}": types.UpdateUserAvatarDocument,
    "mutation UpdateUserProfile($id: ID!, $input: UpdateUserProfileInput!) {\n  updateUserProfile(id: $id, input: $input) {\n    user {\n      id\n      username\n      email\n    }\n    firstName\n    lastName\n    bio\n    avatarUrl\n    createdAt\n    updatedAt\n  }\n}": types.UpdateUserProfileDocument,
    "mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {\n  updateUser(id: $id, input: $input) {\n    ...UserFields\n  }\n}": types.UpdateUserDocument,
    "query GetActivityLogs($projectId: ID, $userId: ID) {\n  activityLogs(projectId: $projectId, userId: $userId) {\n    ...ActivityLogFields\n  }\n}": types.GetActivityLogsDocument,
    "query GetActiveChats($projectId: ID!) {\n  activeChats(projectId: $projectId) {\n    ...ChatFields\n  }\n}": types.GetActiveChatsDocument,
    "query GetArchivedChats($projectId: ID!) {\n  archivedChats(projectId: $projectId) {\n    ...ChatFields\n  }\n}": types.GetArchivedChatsDocument,
    "query GetChatMessages($chatId: ID!) {\n  chatMessages(chatId: $chatId) {\n    ...ChatMessageFields\n  }\n}": types.GetChatMessagesDocument,
    "query GetChat($id: ID!) {\n  chat(id: $id) {\n    ...ChatFields\n  }\n}": types.GetChatDocument,
    "query GetChats($projectId: ID!) {\n  chats(projectId: $projectId) {\n    ...ChatFields\n  }\n}": types.GetChatsDocument,
    "query GetMyChats($projectId: ID) {\n  myChats(projectId: $projectId) {\n    ...ChatFields\n  }\n}": types.GetMyChatsDocument,
    "query GetFavoriteFiles($userId: ID!, $projectId: ID) {\n  favoriteFiles(userId: $userId, projectId: $projectId) {\n    ...FileFields\n  }\n}": types.GetFavoriteFilesDocument,
    "query GetFileShare($id: ID!) {\n  fileShare(id: $id) {\n    ...FileShareFields\n  }\n}": types.GetFileShareDocument,
    "query GetFileShares($fileId: ID!) {\n  fileShares(fileId: $fileId) {\n    ...FileShareFields\n  }\n}": types.GetFileSharesDocument,
    "query GetFileWithShares($id: ID!) {\n  file(id: $id) {\n    id\n    name\n    size\n    createdAt\n    updatedAt\n    shares {\n      ...FileShareFields\n    }\n  }\n}": types.GetFileWithSharesDocument,
    "query GetFile($id: ID!) {\n  file(id: $id) {\n    ...FileFields\n  }\n}": types.GetFileDocument,
    "query GetFiles($projectId: ID, $folderId: ID) {\n  files(projectId: $projectId, folderId: $folderId) {\n    ...FileFields\n  }\n}": types.GetFilesDocument,
    "query GetFolderContents($folderId: ID, $projectId: ID) {\n  folderContents(folderId: $folderId, projectId: $projectId) {\n    __typename\n    ... on Folder {\n      ...FolderFields\n    }\n    ... on File {\n      ...FileFields\n    }\n  }\n}": types.GetFolderContentsDocument,
    "query GetFolderPath($folderId: ID!) {\n  folderPath(folderId: $folderId) {\n    ...FolderFields\n  }\n}": types.GetFolderPathDocument,
    "query GetFolderTree($id: ID!) {\n  folder(id: $id) {\n    ...FolderFields\n    parentFolder {\n      ...FolderFields\n    }\n    childFolders {\n      ...FolderFields\n    }\n  }\n}": types.GetFolderTreeDocument,
    "query GetFolder($id: ID!) {\n  folder(id: $id) {\n    ...FolderFields\n    parentFolder {\n      ...FolderFields\n    }\n  }\n}": types.GetFolderDocument,
    "query GetFolders($projectId: ID) {\n  folders(projectId: $projectId) {\n    ...FolderFields\n  }\n}": types.GetFoldersDocument,
    "query GetRootFiles($projectId: ID) {\n  rootFiles(projectId: $projectId) {\n    ...FileFields\n  }\n}": types.GetRootFilesDocument,
    "query GetRootFolders($projectId: ID) {\n  rootFolders(projectId: $projectId) {\n    ...FolderFields\n  }\n}": types.GetRootFoldersDocument,
    "query GetSharedWithMe($userId: ID!) {\n  sharedWithMe(userId: $userId) {\n    ...FileShareFields\n  }\n}": types.GetSharedWithMeDocument,
    "query GetTrashedFiles($projectId: ID) {\n  trashedFiles(projectId: $projectId) {\n    ...FileFields\n  }\n}": types.GetTrashedFilesDocument,
    "query GetTrashedFolders($projectId: ID) {\n  trashedFolders(projectId: $projectId) {\n    ...FolderFields\n  }\n}": types.GetTrashedFoldersDocument,
    "query GetFlowchart($id: ID!) {\n  flowchart(id: $id) {\n    ...FlowchartFields\n  }\n}": types.GetFlowchartDocument,
    "query GetFlowcharts($projectId: ID!) {\n  flowcharts(projectId: $projectId) {\n    ...FlowchartFields\n  }\n}": types.GetFlowchartsDocument,
    "query GetArchivedProjectsByOwner($ownerId: ID!) {\n  archivedProjectsByOwner(ownerId: $ownerId) {\n    ...ProjectFields\n  }\n}": types.GetArchivedProjectsByOwnerDocument,
    "query GetArchivedProjectsForUser($userId: ID!) {\n  archivedProjectsForUser(userId: $userId) {\n    ...ProjectFields\n  }\n}": types.GetArchivedProjectsForUserDocument,
    "query GetDashboard {\n  projects {\n    ...ProjectFields\n    members {\n      id\n      role\n      user {\n        id\n        username\n      }\n    }\n    files {\n      file {\n        id\n        name\n        size\n        createdAt\n        aiMetadata {\n          processingStatus\n        }\n      }\n    }\n    chats {\n      id\n    }\n    reports {\n      id\n    }\n    flowcharts {\n      id\n    }\n    activityLogs {\n      ...ActivityLogFields\n    }\n  }\n}": types.GetDashboardDocument,
    "query GetProjectMembers($projectId: ID!) {\n  projectMembers(projectId: $projectId) {\n    ...ProjectMemberFields\n  }\n}": types.GetProjectMembersDocument,
    "query GetProjectStats($projectId: ID!) {\n  projectStats(projectId: $projectId) {\n    memberCount\n    fileCount\n    chatCount\n    reportCount\n    flowchartCount\n  }\n}": types.GetProjectStatsDocument,
    "query GetProject($id: ID!) {\n  project(id: $id) {\n    ...ProjectFields\n  }\n}": types.GetProjectDocument,
    "query GetProjectsByOwner($ownerId: ID!) {\n  projectsByOwner(ownerId: $ownerId) {\n    ...ProjectFields\n  }\n}": types.GetProjectsByOwnerDocument,
    "query GetProjectsForUser($userId: ID!) {\n  projectsForUser(userId: $userId) {\n    ...ProjectFields\n  }\n}": types.GetProjectsForUserDocument,
    "query GetProjects {\n  projects {\n    ...ProjectFields\n  }\n}": types.GetProjectsDocument,
    "query GetAIReports($projectId: ID!) {\n  aiReports(projectId: $projectId) {\n    ...ReportFields\n  }\n}": types.GetAiReportsDocument,
    "query GetReport($id: ID!) {\n  report(id: $id) {\n    ...ReportFields\n  }\n}": types.GetReportDocument,
    "query GetReportsByChat($sourceChatId: ID!) {\n  reportsByChat(sourceChatId: $sourceChatId) {\n    ...ReportFields\n  }\n}": types.GetReportsByChatDocument,
    "query GetReportsByFormat($projectId: ID!, $format: ReportFormat!) {\n  reportsByFormat(projectId: $projectId, format: $format) {\n    ...ReportFields\n  }\n}": types.GetReportsByFormatDocument,
    "query GetReportsByGenerator($projectId: ID!, $generatedById: ID!) {\n  reportsByGenerator(projectId: $projectId, generatedById: $generatedById) {\n    ...ReportFields\n  }\n}": types.GetReportsByGeneratorDocument,
    "query GetReportsByStatus($projectId: ID!, $status: ReportStatus!) {\n  reportsByStatus(projectId: $projectId, status: $status) {\n    ...ReportFields\n  }\n}": types.GetReportsByStatusDocument,
    "query GetReports($projectId: ID!) {\n  reports(projectId: $projectId) {\n    ...ReportFields\n  }\n}": types.GetReportsDocument,
    "query GetAllUsers {\n  allUsers {\n    ...UserFields\n  }\n}": types.GetAllUsersDocument,
    "query GetUserByEmail($email: String!) {\n  userByEmail(email: $email) {\n    ...UserFields\n  }\n}": types.GetUserByEmailDocument,
    "query GetUserByUsername($username: String!) {\n  userByUsername(username: $username) {\n    ...UserFields\n  }\n}": types.GetUserByUsernameDocument,
    "query GetUserProfile($userId: ID!) {\n  userProfile(userId: $userId) {\n    user {\n      id\n      username\n      email\n    }\n    firstName\n    lastName\n    bio\n    avatarUrl\n    createdAt\n    updatedAt\n  }\n}": types.GetUserProfileDocument,
    "query GetUserWorkspace($id: ID!) {\n  user(id: $id) {\n    id\n    username\n    ownedProjects {\n      ...ProjectFields\n    }\n    projectMemberships {\n      id\n      role\n      project {\n        id\n        name\n        visibility\n      }\n    }\n    sharedFiles {\n      ...FileShareFields\n      file {\n        id\n        name\n        size\n      }\n    }\n  }\n}": types.GetUserWorkspaceDocument,
    "query GetUser($id: ID!) {\n  user(id: $id) {\n    ...UserFields\n  }\n}": types.GetUserDocument,
    "query GetUsers($ids: [ID!]!) {\n  users(ids: $ids) {\n    ...UserFields\n  }\n}": types.GetUsersDocument,
    "query Me {\n  me {\n    ...UserFields\n  }\n}": types.MeDocument,
    "query SearchUsers($query: String!, $limit: Int) {\n  searchUsers(query: $query, limit: $limit) {\n    ...UserFields\n  }\n}": types.SearchUsersDocument,
    "subscription ChatMessageAdded($chatId: ID!) {\n  chatMessageAdded(chatId: $chatId) {\n    ...ChatMessageFields\n  }\n}": types.ChatMessageAddedDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ActivityLogFields on ActivityLog {\n  id\n  action\n  entityType\n  entityId\n  user {\n    id\n    username\n    email\n  }\n  createdAt\n}"): (typeof documents)["fragment ActivityLogFields on ActivityLog {\n  id\n  action\n  entityType\n  entityId\n  user {\n    id\n    username\n    email\n  }\n  createdAt\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ChatFields on Chat {\n  id\n  title\n  type\n  status\n  lastActivityAt\n  participants {\n    user {\n      id\n      username\n      email\n    }\n    joinedAt\n  }\n  createdAt\n  updatedAt\n}"): (typeof documents)["fragment ChatFields on Chat {\n  id\n  title\n  type\n  status\n  lastActivityAt\n  participants {\n    user {\n      id\n      username\n      email\n    }\n    joinedAt\n  }\n  createdAt\n  updatedAt\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ChatMessageFields on ChatMessage {\n  id\n  role\n  content\n  sender {\n    id\n    username\n    email\n  }\n  aiMetadata {\n    embeddingModel\n    embeddingSynced\n    indexedAt\n  }\n  mentionedUsers {\n    id\n    username\n    email\n  }\n  referencedFiles {\n    id\n    name\n  }\n  createdAt\n  updatedAt\n}"): (typeof documents)["fragment ChatMessageFields on ChatMessage {\n  id\n  role\n  content\n  sender {\n    id\n    username\n    email\n  }\n  aiMetadata {\n    embeddingModel\n    embeddingSynced\n    indexedAt\n  }\n  mentionedUsers {\n    id\n    username\n    email\n  }\n  referencedFiles {\n    id\n    name\n  }\n  createdAt\n  updatedAt\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment FileFields on File {\n  id\n  name\n  size\n  folder {\n    id\n  }\n  storage {\n    bucketName\n    objectKey\n    etag\n    versionId\n    checksum\n    mimeType\n    uploadedBy {\n      id\n      username\n      email\n    }\n    downloadUrl\n    createdAt\n    updatedAt\n  }\n  properties {\n    originalName\n    isIndexed\n    deletedAt\n    createdAt\n    updatedAt\n  }\n  aiMetadata {\n    extractedText\n    embeddingModel\n    embeddingSynced\n    indexedAt\n    processingStatus\n    summary\n    errorMessage\n    createdAt\n    updatedAt\n  }\n  createdAt\n  updatedAt\n}"): (typeof documents)["fragment FileFields on File {\n  id\n  name\n  size\n  folder {\n    id\n  }\n  storage {\n    bucketName\n    objectKey\n    etag\n    versionId\n    checksum\n    mimeType\n    uploadedBy {\n      id\n      username\n      email\n    }\n    downloadUrl\n    createdAt\n    updatedAt\n  }\n  properties {\n    originalName\n    isIndexed\n    deletedAt\n    createdAt\n    updatedAt\n  }\n  aiMetadata {\n    extractedText\n    embeddingModel\n    embeddingSynced\n    indexedAt\n    processingStatus\n    summary\n    errorMessage\n    createdAt\n    updatedAt\n  }\n  createdAt\n  updatedAt\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment FileShareFields on FileShare {\n  id\n  sharedBy {\n    id\n    username\n    email\n  }\n  sharedWith {\n    id\n    username\n    email\n  }\n  permission\n  createdAt\n}"): (typeof documents)["fragment FileShareFields on FileShare {\n  id\n  sharedBy {\n    id\n    username\n    email\n  }\n  sharedWith {\n    id\n    username\n    email\n  }\n  permission\n  createdAt\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment FlowchartFields on Flowchart {\n  id\n  name\n  data\n  generatedBy {\n    id\n    username\n    email\n  }\n  generatedByAI\n  status\n  sourceChat {\n    id\n  }\n  createdAt\n  updatedAt\n}"): (typeof documents)["fragment FlowchartFields on Flowchart {\n  id\n  name\n  data\n  generatedBy {\n    id\n    username\n    email\n  }\n  generatedByAI\n  status\n  sourceChat {\n    id\n  }\n  createdAt\n  updatedAt\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment FolderFields on Folder {\n  id\n  name\n  parentFolder {\n    id\n  }\n  createdAt\n  updatedAt\n}"): (typeof documents)["fragment FolderFields on Folder {\n  id\n  name\n  parentFolder {\n    id\n  }\n  createdAt\n  updatedAt\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ProjectFields on Project {\n  id\n  name\n  description\n  visibility\n  owner {\n    id\n    username\n    email\n  }\n  archivedAt\n  createdAt\n  updatedAt\n}"): (typeof documents)["fragment ProjectFields on Project {\n  id\n  name\n  description\n  visibility\n  owner {\n    id\n    username\n    email\n  }\n  archivedAt\n  createdAt\n  updatedAt\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ProjectMemberFields on ProjectMember {\n  id\n  role\n  user {\n    id\n    username\n    email\n  }\n  createdAt\n  updatedAt\n}"): (typeof documents)["fragment ProjectMemberFields on ProjectMember {\n  id\n  role\n  user {\n    id\n    username\n    email\n  }\n  createdAt\n  updatedAt\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ReportFields on Report {\n  id\n  title\n  content\n  format\n  properties {\n    generatedBy {\n      id\n      username\n      email\n    }\n    generatedByAI\n    status\n    sourceChat {\n      id\n    }\n  }\n  createdAt\n  updatedAt\n}"): (typeof documents)["fragment ReportFields on Report {\n  id\n  title\n  content\n  format\n  properties {\n    generatedBy {\n      id\n      username\n      email\n    }\n    generatedByAI\n    status\n    sourceChat {\n      id\n    }\n  }\n  createdAt\n  updatedAt\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment UserFields on User {\n  id\n  username\n  email\n  profile {\n    firstName\n    lastName\n    bio\n    avatarUrl\n    createdAt\n    updatedAt\n  }\n  createdAt\n  updatedAt\n}"): (typeof documents)["fragment UserFields on User {\n  id\n  username\n  email\n  profile {\n    firstName\n    lastName\n    bio\n    avatarUrl\n    createdAt\n    updatedAt\n  }\n  createdAt\n  updatedAt\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateActivityLog($input: CreateActivityLogInput!) {\n  createActivityLog(input: $input) {\n    ...ActivityLogFields\n  }\n}"): (typeof documents)["mutation CreateActivityLog($input: CreateActivityLogInput!) {\n  createActivityLog(input: $input) {\n    ...ActivityLogFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeleteActivityLogByID($id: ID!) {\n  deleteActivityLogByID(id: $id)\n}"): (typeof documents)["mutation DeleteActivityLogByID($id: ID!) {\n  deleteActivityLogByID(id: $id)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateChatMessage($input: CreateChatMessageInput!) {\n  createChatMessage(input: $input) {\n    ...ChatMessageFields\n  }\n}"): (typeof documents)["mutation CreateChatMessage($input: CreateChatMessageInput!) {\n  createChatMessage(input: $input) {\n    ...ChatMessageFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateChatParticipant($input: CreateChatParticipantInput!) {\n  createChatParticipant(input: $input) {\n    user {\n      id\n      username\n      email\n    }\n    joinedAt\n  }\n}"): (typeof documents)["mutation CreateChatParticipant($input: CreateChatParticipantInput!) {\n  createChatParticipant(input: $input) {\n    user {\n      id\n      username\n      email\n    }\n    joinedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateChat($input: CreateChatInput!) {\n  createChat(input: $input) {\n    ...ChatFields\n  }\n}"): (typeof documents)["mutation CreateChat($input: CreateChatInput!) {\n  createChat(input: $input) {\n    ...ChatFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeleteChatMessage($id: ID!) {\n  deleteChatMessage(id: $id)\n}"): (typeof documents)["mutation DeleteChatMessage($id: ID!) {\n  deleteChatMessage(id: $id)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeleteChat($id: ID!) {\n  deleteChat(id: $id)\n}"): (typeof documents)["mutation DeleteChat($id: ID!) {\n  deleteChat(id: $id)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RemoveChatParticipant($chatId: ID!, $userId: ID!) {\n  removeChatParticipant(chatId: $chatId, userId: $userId)\n}"): (typeof documents)["mutation RemoveChatParticipant($chatId: ID!, $userId: ID!) {\n  removeChatParticipant(chatId: $chatId, userId: $userId)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateChatMessage($input: UpdateChatMessageInput!) {\n  updateChatMessage(input: $input) {\n    ...ChatMessageFields\n  }\n}"): (typeof documents)["mutation UpdateChatMessage($input: UpdateChatMessageInput!) {\n  updateChatMessage(input: $input) {\n    ...ChatMessageFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateChat($id: ID!, $input: UpdateChatInput!) {\n  updateChat(id: $id, input: $input) {\n    ...ChatFields\n  }\n}"): (typeof documents)["mutation UpdateChat($id: ID!, $input: UpdateChatInput!) {\n  updateChat(id: $id, input: $input) {\n    ...ChatFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateFile($input: CreateFileInput!) {\n  createFile(input: $input) {\n    ...FileFields\n  }\n}"): (typeof documents)["mutation CreateFile($input: CreateFileInput!) {\n  createFile(input: $input) {\n    ...FileFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateFolder($input: CreateFolderInput!) {\n  createFolder(input: $input) {\n    ...FolderFields\n  }\n}"): (typeof documents)["mutation CreateFolder($input: CreateFolderInput!) {\n  createFolder(input: $input) {\n    ...FolderFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeleteFileShare($fileShareId: ID!) {\n  deleteFileShare(fileShareId: $fileShareId)\n}"): (typeof documents)["mutation DeleteFileShare($fileShareId: ID!) {\n  deleteFileShare(fileShareId: $fileShareId)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeleteFile($fileId: ID!) {\n  deleteFile(fileId: $fileId)\n}"): (typeof documents)["mutation DeleteFile($fileId: ID!) {\n  deleteFile(fileId: $fileId)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeleteFolder($folderId: ID!) {\n  deleteFolder(folderId: $folderId)\n}"): (typeof documents)["mutation DeleteFolder($folderId: ID!) {\n  deleteFolder(folderId: $folderId)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation MoveFile($input: MoveFileInput!) {\n  moveFile(input: $input) {\n    ...FileFields\n  }\n}"): (typeof documents)["mutation MoveFile($input: MoveFileInput!) {\n  moveFile(input: $input) {\n    ...FileFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation MoveFolder($folderId: ID!, $parentFolderId: ID) {\n  moveFolder(folderId: $folderId, parentFolderId: $parentFolderId) {\n    ...FolderFields\n  }\n}"): (typeof documents)["mutation MoveFolder($folderId: ID!, $parentFolderId: ID) {\n  moveFolder(folderId: $folderId, parentFolderId: $parentFolderId) {\n    ...FolderFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RenameFile($fileId: ID!, $name: String!) {\n  renameFile(fileId: $fileId, name: $name) {\n    ...FileFields\n  }\n}"): (typeof documents)["mutation RenameFile($fileId: ID!, $name: String!) {\n  renameFile(fileId: $fileId, name: $name) {\n    ...FileFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RenameFolder($folderId: ID!, $name: String!) {\n  renameFolder(folderId: $folderId, name: $name) {\n    ...FolderFields\n  }\n}"): (typeof documents)["mutation RenameFolder($folderId: ID!, $name: String!) {\n  renameFolder(folderId: $folderId, name: $name) {\n    ...FolderFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RestoreFile($fileId: ID!) {\n  restoreFile(fileId: $fileId) {\n    ...FileFields\n  }\n}"): (typeof documents)["mutation RestoreFile($fileId: ID!) {\n  restoreFile(fileId: $fileId) {\n    ...FileFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RestoreFolder($folderId: ID!) {\n  restoreFolder(folderId: $folderId) {\n    ...FolderFields\n  }\n}"): (typeof documents)["mutation RestoreFolder($folderId: ID!) {\n  restoreFolder(folderId: $folderId) {\n    ...FolderFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SetFileFavorite($input: SetFileFavoriteInput!) {\n  setFileFavorite(input: $input) {\n    user {\n      id\n      username\n      email\n    }\n    file {\n      id\n      name\n    }\n    isFavorite\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["mutation SetFileFavorite($input: SetFileFavoriteInput!) {\n  setFileFavorite(input: $input) {\n    user {\n      id\n      username\n      email\n    }\n    file {\n      id\n      name\n    }\n    isFavorite\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ShareFile($input: ShareFileInput!) {\n  shareFile(input: $input) {\n    ...FileShareFields\n  }\n}"): (typeof documents)["mutation ShareFile($input: ShareFileInput!) {\n  shareFile(input: $input) {\n    ...FileShareFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation TrashFile($fileId: ID!) {\n  trashFile(fileId: $fileId) {\n    ...FileFields\n  }\n}"): (typeof documents)["mutation TrashFile($fileId: ID!) {\n  trashFile(fileId: $fileId) {\n    ...FileFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation TrashFolder($folderId: ID!) {\n  trashFolder(folderId: $folderId) {\n    ...FolderFields\n  }\n}"): (typeof documents)["mutation TrashFolder($folderId: ID!) {\n  trashFolder(folderId: $folderId) {\n    ...FolderFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateFileSharePermission($fileShareId: ID!, $permission: FilePermission!) {\n  updateFileSharePermission(fileShareId: $fileShareId, permission: $permission) {\n    ...FileShareFields\n  }\n}"): (typeof documents)["mutation UpdateFileSharePermission($fileShareId: ID!, $permission: FilePermission!) {\n  updateFileSharePermission(fileShareId: $fileShareId, permission: $permission) {\n    ...FileShareFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateFlowchart($input: CreateFlowchartInput!) {\n  createFlowchart(input: $input) {\n    ...FlowchartFields\n  }\n}"): (typeof documents)["mutation CreateFlowchart($input: CreateFlowchartInput!) {\n  createFlowchart(input: $input) {\n    ...FlowchartFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeleteFlowchart($id: ID!) {\n  deleteFlowchart(id: $id)\n}"): (typeof documents)["mutation DeleteFlowchart($id: ID!) {\n  deleteFlowchart(id: $id)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateFlowchart($id: ID!, $input: UpdateFlowchartInput!) {\n  updateFlowchart(id: $id, input: $input) {\n    ...FlowchartFields\n  }\n}"): (typeof documents)["mutation UpdateFlowchart($id: ID!, $input: UpdateFlowchartInput!) {\n  updateFlowchart(id: $id, input: $input) {\n    ...FlowchartFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation AddProjectMember($input: AddProjectMemberInput!) {\n  addProjectMember(input: $input) {\n    ...ProjectMemberFields\n  }\n}"): (typeof documents)["mutation AddProjectMember($input: AddProjectMemberInput!) {\n  addProjectMember(input: $input) {\n    ...ProjectMemberFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ArchiveProject($projectId: ID!) {\n  archiveProject(projectId: $projectId)\n}"): (typeof documents)["mutation ArchiveProject($projectId: ID!) {\n  archiveProject(projectId: $projectId)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateProject($input: CreateProjectInput!) {\n  createProject(input: $input) {\n    ...ProjectFields\n  }\n}"): (typeof documents)["mutation CreateProject($input: CreateProjectInput!) {\n  createProject(input: $input) {\n    ...ProjectFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeleteProject($id: ID!) {\n  deleteProject(id: $id)\n}"): (typeof documents)["mutation DeleteProject($id: ID!) {\n  deleteProject(id: $id)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RemoveProjectMember($projectId: ID!, $userId: ID!) {\n  removeProjectMember(projectId: $projectId, userId: $userId)\n}"): (typeof documents)["mutation RemoveProjectMember($projectId: ID!, $userId: ID!) {\n  removeProjectMember(projectId: $projectId, userId: $userId)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RestoreProject($projectId: ID!) {\n  restoreProject(projectId: $projectId)\n}"): (typeof documents)["mutation RestoreProject($projectId: ID!) {\n  restoreProject(projectId: $projectId)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation TransferProjectOwnership($input: TransferProjectOwnershipInput!) {\n  transferProjectOwnership(input: $input) {\n    ...ProjectFields\n  }\n}"): (typeof documents)["mutation TransferProjectOwnership($input: TransferProjectOwnershipInput!) {\n  transferProjectOwnership(input: $input) {\n    ...ProjectFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateProjectMemberRole($input: UpdateProjectMemberRoleInput!) {\n  updateProjectMemberRole(input: $input) {\n    ...ProjectMemberFields\n  }\n}"): (typeof documents)["mutation UpdateProjectMemberRole($input: UpdateProjectMemberRoleInput!) {\n  updateProjectMemberRole(input: $input) {\n    ...ProjectMemberFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {\n  updateProject(id: $id, input: $input) {\n    ...ProjectFields\n  }\n}"): (typeof documents)["mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {\n  updateProject(id: $id, input: $input) {\n    ...ProjectFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateReport($input: CreateReportInput!) {\n  createReport(input: $input) {\n    ...ReportFields\n  }\n}"): (typeof documents)["mutation CreateReport($input: CreateReportInput!) {\n  createReport(input: $input) {\n    ...ReportFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeleteReport($id: ID!) {\n  deleteReport(id: $id)\n}"): (typeof documents)["mutation DeleteReport($id: ID!) {\n  deleteReport(id: $id)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateReport($id: ID!, $input: UpdateReportInput!) {\n  updateReport(id: $id, input: $input) {\n    ...ReportFields\n  }\n}"): (typeof documents)["mutation UpdateReport($id: ID!, $input: UpdateReportInput!) {\n  updateReport(id: $id, input: $input) {\n    ...ReportFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateUser($input: CreateUserInput!) {\n  createUser(input: $input) {\n    ...UserFields\n  }\n}"): (typeof documents)["mutation CreateUser($input: CreateUserInput!) {\n  createUser(input: $input) {\n    ...UserFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeleteUser($id: ID!) {\n  deleteUser(id: $id)\n}"): (typeof documents)["mutation DeleteUser($id: ID!) {\n  deleteUser(id: $id)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateUserAvatar($id: ID!, $input: UpdateUserAvatarInput!) {\n  updateUserAvatar(id: $id, input: $input) {\n    user {\n      id\n      username\n      email\n    }\n    firstName\n    lastName\n    bio\n    avatarUrl\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["mutation UpdateUserAvatar($id: ID!, $input: UpdateUserAvatarInput!) {\n  updateUserAvatar(id: $id, input: $input) {\n    user {\n      id\n      username\n      email\n    }\n    firstName\n    lastName\n    bio\n    avatarUrl\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateUserProfile($id: ID!, $input: UpdateUserProfileInput!) {\n  updateUserProfile(id: $id, input: $input) {\n    user {\n      id\n      username\n      email\n    }\n    firstName\n    lastName\n    bio\n    avatarUrl\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["mutation UpdateUserProfile($id: ID!, $input: UpdateUserProfileInput!) {\n  updateUserProfile(id: $id, input: $input) {\n    user {\n      id\n      username\n      email\n    }\n    firstName\n    lastName\n    bio\n    avatarUrl\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {\n  updateUser(id: $id, input: $input) {\n    ...UserFields\n  }\n}"): (typeof documents)["mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {\n  updateUser(id: $id, input: $input) {\n    ...UserFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetActivityLogs($projectId: ID, $userId: ID) {\n  activityLogs(projectId: $projectId, userId: $userId) {\n    ...ActivityLogFields\n  }\n}"): (typeof documents)["query GetActivityLogs($projectId: ID, $userId: ID) {\n  activityLogs(projectId: $projectId, userId: $userId) {\n    ...ActivityLogFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetActiveChats($projectId: ID!) {\n  activeChats(projectId: $projectId) {\n    ...ChatFields\n  }\n}"): (typeof documents)["query GetActiveChats($projectId: ID!) {\n  activeChats(projectId: $projectId) {\n    ...ChatFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetArchivedChats($projectId: ID!) {\n  archivedChats(projectId: $projectId) {\n    ...ChatFields\n  }\n}"): (typeof documents)["query GetArchivedChats($projectId: ID!) {\n  archivedChats(projectId: $projectId) {\n    ...ChatFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetChatMessages($chatId: ID!) {\n  chatMessages(chatId: $chatId) {\n    ...ChatMessageFields\n  }\n}"): (typeof documents)["query GetChatMessages($chatId: ID!) {\n  chatMessages(chatId: $chatId) {\n    ...ChatMessageFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetChat($id: ID!) {\n  chat(id: $id) {\n    ...ChatFields\n  }\n}"): (typeof documents)["query GetChat($id: ID!) {\n  chat(id: $id) {\n    ...ChatFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetChats($projectId: ID!) {\n  chats(projectId: $projectId) {\n    ...ChatFields\n  }\n}"): (typeof documents)["query GetChats($projectId: ID!) {\n  chats(projectId: $projectId) {\n    ...ChatFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetMyChats($projectId: ID) {\n  myChats(projectId: $projectId) {\n    ...ChatFields\n  }\n}"): (typeof documents)["query GetMyChats($projectId: ID) {\n  myChats(projectId: $projectId) {\n    ...ChatFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetFavoriteFiles($userId: ID!, $projectId: ID) {\n  favoriteFiles(userId: $userId, projectId: $projectId) {\n    ...FileFields\n  }\n}"): (typeof documents)["query GetFavoriteFiles($userId: ID!, $projectId: ID) {\n  favoriteFiles(userId: $userId, projectId: $projectId) {\n    ...FileFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetFileShare($id: ID!) {\n  fileShare(id: $id) {\n    ...FileShareFields\n  }\n}"): (typeof documents)["query GetFileShare($id: ID!) {\n  fileShare(id: $id) {\n    ...FileShareFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetFileShares($fileId: ID!) {\n  fileShares(fileId: $fileId) {\n    ...FileShareFields\n  }\n}"): (typeof documents)["query GetFileShares($fileId: ID!) {\n  fileShares(fileId: $fileId) {\n    ...FileShareFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetFileWithShares($id: ID!) {\n  file(id: $id) {\n    id\n    name\n    size\n    createdAt\n    updatedAt\n    shares {\n      ...FileShareFields\n    }\n  }\n}"): (typeof documents)["query GetFileWithShares($id: ID!) {\n  file(id: $id) {\n    id\n    name\n    size\n    createdAt\n    updatedAt\n    shares {\n      ...FileShareFields\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetFile($id: ID!) {\n  file(id: $id) {\n    ...FileFields\n  }\n}"): (typeof documents)["query GetFile($id: ID!) {\n  file(id: $id) {\n    ...FileFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetFiles($projectId: ID, $folderId: ID) {\n  files(projectId: $projectId, folderId: $folderId) {\n    ...FileFields\n  }\n}"): (typeof documents)["query GetFiles($projectId: ID, $folderId: ID) {\n  files(projectId: $projectId, folderId: $folderId) {\n    ...FileFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetFolderContents($folderId: ID, $projectId: ID) {\n  folderContents(folderId: $folderId, projectId: $projectId) {\n    __typename\n    ... on Folder {\n      ...FolderFields\n    }\n    ... on File {\n      ...FileFields\n    }\n  }\n}"): (typeof documents)["query GetFolderContents($folderId: ID, $projectId: ID) {\n  folderContents(folderId: $folderId, projectId: $projectId) {\n    __typename\n    ... on Folder {\n      ...FolderFields\n    }\n    ... on File {\n      ...FileFields\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetFolderPath($folderId: ID!) {\n  folderPath(folderId: $folderId) {\n    ...FolderFields\n  }\n}"): (typeof documents)["query GetFolderPath($folderId: ID!) {\n  folderPath(folderId: $folderId) {\n    ...FolderFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetFolderTree($id: ID!) {\n  folder(id: $id) {\n    ...FolderFields\n    parentFolder {\n      ...FolderFields\n    }\n    childFolders {\n      ...FolderFields\n    }\n  }\n}"): (typeof documents)["query GetFolderTree($id: ID!) {\n  folder(id: $id) {\n    ...FolderFields\n    parentFolder {\n      ...FolderFields\n    }\n    childFolders {\n      ...FolderFields\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetFolder($id: ID!) {\n  folder(id: $id) {\n    ...FolderFields\n    parentFolder {\n      ...FolderFields\n    }\n  }\n}"): (typeof documents)["query GetFolder($id: ID!) {\n  folder(id: $id) {\n    ...FolderFields\n    parentFolder {\n      ...FolderFields\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetFolders($projectId: ID) {\n  folders(projectId: $projectId) {\n    ...FolderFields\n  }\n}"): (typeof documents)["query GetFolders($projectId: ID) {\n  folders(projectId: $projectId) {\n    ...FolderFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetRootFiles($projectId: ID) {\n  rootFiles(projectId: $projectId) {\n    ...FileFields\n  }\n}"): (typeof documents)["query GetRootFiles($projectId: ID) {\n  rootFiles(projectId: $projectId) {\n    ...FileFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetRootFolders($projectId: ID) {\n  rootFolders(projectId: $projectId) {\n    ...FolderFields\n  }\n}"): (typeof documents)["query GetRootFolders($projectId: ID) {\n  rootFolders(projectId: $projectId) {\n    ...FolderFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetSharedWithMe($userId: ID!) {\n  sharedWithMe(userId: $userId) {\n    ...FileShareFields\n  }\n}"): (typeof documents)["query GetSharedWithMe($userId: ID!) {\n  sharedWithMe(userId: $userId) {\n    ...FileShareFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetTrashedFiles($projectId: ID) {\n  trashedFiles(projectId: $projectId) {\n    ...FileFields\n  }\n}"): (typeof documents)["query GetTrashedFiles($projectId: ID) {\n  trashedFiles(projectId: $projectId) {\n    ...FileFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetTrashedFolders($projectId: ID) {\n  trashedFolders(projectId: $projectId) {\n    ...FolderFields\n  }\n}"): (typeof documents)["query GetTrashedFolders($projectId: ID) {\n  trashedFolders(projectId: $projectId) {\n    ...FolderFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetFlowchart($id: ID!) {\n  flowchart(id: $id) {\n    ...FlowchartFields\n  }\n}"): (typeof documents)["query GetFlowchart($id: ID!) {\n  flowchart(id: $id) {\n    ...FlowchartFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetFlowcharts($projectId: ID!) {\n  flowcharts(projectId: $projectId) {\n    ...FlowchartFields\n  }\n}"): (typeof documents)["query GetFlowcharts($projectId: ID!) {\n  flowcharts(projectId: $projectId) {\n    ...FlowchartFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetArchivedProjectsByOwner($ownerId: ID!) {\n  archivedProjectsByOwner(ownerId: $ownerId) {\n    ...ProjectFields\n  }\n}"): (typeof documents)["query GetArchivedProjectsByOwner($ownerId: ID!) {\n  archivedProjectsByOwner(ownerId: $ownerId) {\n    ...ProjectFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetArchivedProjectsForUser($userId: ID!) {\n  archivedProjectsForUser(userId: $userId) {\n    ...ProjectFields\n  }\n}"): (typeof documents)["query GetArchivedProjectsForUser($userId: ID!) {\n  archivedProjectsForUser(userId: $userId) {\n    ...ProjectFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetDashboard {\n  projects {\n    ...ProjectFields\n    members {\n      id\n      role\n      user {\n        id\n        username\n      }\n    }\n    files {\n      file {\n        id\n        name\n        size\n        createdAt\n        aiMetadata {\n          processingStatus\n        }\n      }\n    }\n    chats {\n      id\n    }\n    reports {\n      id\n    }\n    flowcharts {\n      id\n    }\n    activityLogs {\n      ...ActivityLogFields\n    }\n  }\n}"): (typeof documents)["query GetDashboard {\n  projects {\n    ...ProjectFields\n    members {\n      id\n      role\n      user {\n        id\n        username\n      }\n    }\n    files {\n      file {\n        id\n        name\n        size\n        createdAt\n        aiMetadata {\n          processingStatus\n        }\n      }\n    }\n    chats {\n      id\n    }\n    reports {\n      id\n    }\n    flowcharts {\n      id\n    }\n    activityLogs {\n      ...ActivityLogFields\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetProjectMembers($projectId: ID!) {\n  projectMembers(projectId: $projectId) {\n    ...ProjectMemberFields\n  }\n}"): (typeof documents)["query GetProjectMembers($projectId: ID!) {\n  projectMembers(projectId: $projectId) {\n    ...ProjectMemberFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetProjectStats($projectId: ID!) {\n  projectStats(projectId: $projectId) {\n    memberCount\n    fileCount\n    chatCount\n    reportCount\n    flowchartCount\n  }\n}"): (typeof documents)["query GetProjectStats($projectId: ID!) {\n  projectStats(projectId: $projectId) {\n    memberCount\n    fileCount\n    chatCount\n    reportCount\n    flowchartCount\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetProject($id: ID!) {\n  project(id: $id) {\n    ...ProjectFields\n  }\n}"): (typeof documents)["query GetProject($id: ID!) {\n  project(id: $id) {\n    ...ProjectFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetProjectsByOwner($ownerId: ID!) {\n  projectsByOwner(ownerId: $ownerId) {\n    ...ProjectFields\n  }\n}"): (typeof documents)["query GetProjectsByOwner($ownerId: ID!) {\n  projectsByOwner(ownerId: $ownerId) {\n    ...ProjectFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetProjectsForUser($userId: ID!) {\n  projectsForUser(userId: $userId) {\n    ...ProjectFields\n  }\n}"): (typeof documents)["query GetProjectsForUser($userId: ID!) {\n  projectsForUser(userId: $userId) {\n    ...ProjectFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetProjects {\n  projects {\n    ...ProjectFields\n  }\n}"): (typeof documents)["query GetProjects {\n  projects {\n    ...ProjectFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetAIReports($projectId: ID!) {\n  aiReports(projectId: $projectId) {\n    ...ReportFields\n  }\n}"): (typeof documents)["query GetAIReports($projectId: ID!) {\n  aiReports(projectId: $projectId) {\n    ...ReportFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetReport($id: ID!) {\n  report(id: $id) {\n    ...ReportFields\n  }\n}"): (typeof documents)["query GetReport($id: ID!) {\n  report(id: $id) {\n    ...ReportFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetReportsByChat($sourceChatId: ID!) {\n  reportsByChat(sourceChatId: $sourceChatId) {\n    ...ReportFields\n  }\n}"): (typeof documents)["query GetReportsByChat($sourceChatId: ID!) {\n  reportsByChat(sourceChatId: $sourceChatId) {\n    ...ReportFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetReportsByFormat($projectId: ID!, $format: ReportFormat!) {\n  reportsByFormat(projectId: $projectId, format: $format) {\n    ...ReportFields\n  }\n}"): (typeof documents)["query GetReportsByFormat($projectId: ID!, $format: ReportFormat!) {\n  reportsByFormat(projectId: $projectId, format: $format) {\n    ...ReportFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetReportsByGenerator($projectId: ID!, $generatedById: ID!) {\n  reportsByGenerator(projectId: $projectId, generatedById: $generatedById) {\n    ...ReportFields\n  }\n}"): (typeof documents)["query GetReportsByGenerator($projectId: ID!, $generatedById: ID!) {\n  reportsByGenerator(projectId: $projectId, generatedById: $generatedById) {\n    ...ReportFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetReportsByStatus($projectId: ID!, $status: ReportStatus!) {\n  reportsByStatus(projectId: $projectId, status: $status) {\n    ...ReportFields\n  }\n}"): (typeof documents)["query GetReportsByStatus($projectId: ID!, $status: ReportStatus!) {\n  reportsByStatus(projectId: $projectId, status: $status) {\n    ...ReportFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetReports($projectId: ID!) {\n  reports(projectId: $projectId) {\n    ...ReportFields\n  }\n}"): (typeof documents)["query GetReports($projectId: ID!) {\n  reports(projectId: $projectId) {\n    ...ReportFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetAllUsers {\n  allUsers {\n    ...UserFields\n  }\n}"): (typeof documents)["query GetAllUsers {\n  allUsers {\n    ...UserFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetUserByEmail($email: String!) {\n  userByEmail(email: $email) {\n    ...UserFields\n  }\n}"): (typeof documents)["query GetUserByEmail($email: String!) {\n  userByEmail(email: $email) {\n    ...UserFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetUserByUsername($username: String!) {\n  userByUsername(username: $username) {\n    ...UserFields\n  }\n}"): (typeof documents)["query GetUserByUsername($username: String!) {\n  userByUsername(username: $username) {\n    ...UserFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetUserProfile($userId: ID!) {\n  userProfile(userId: $userId) {\n    user {\n      id\n      username\n      email\n    }\n    firstName\n    lastName\n    bio\n    avatarUrl\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["query GetUserProfile($userId: ID!) {\n  userProfile(userId: $userId) {\n    user {\n      id\n      username\n      email\n    }\n    firstName\n    lastName\n    bio\n    avatarUrl\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetUserWorkspace($id: ID!) {\n  user(id: $id) {\n    id\n    username\n    ownedProjects {\n      ...ProjectFields\n    }\n    projectMemberships {\n      id\n      role\n      project {\n        id\n        name\n        visibility\n      }\n    }\n    sharedFiles {\n      ...FileShareFields\n      file {\n        id\n        name\n        size\n      }\n    }\n  }\n}"): (typeof documents)["query GetUserWorkspace($id: ID!) {\n  user(id: $id) {\n    id\n    username\n    ownedProjects {\n      ...ProjectFields\n    }\n    projectMemberships {\n      id\n      role\n      project {\n        id\n        name\n        visibility\n      }\n    }\n    sharedFiles {\n      ...FileShareFields\n      file {\n        id\n        name\n        size\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetUser($id: ID!) {\n  user(id: $id) {\n    ...UserFields\n  }\n}"): (typeof documents)["query GetUser($id: ID!) {\n  user(id: $id) {\n    ...UserFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetUsers($ids: [ID!]!) {\n  users(ids: $ids) {\n    ...UserFields\n  }\n}"): (typeof documents)["query GetUsers($ids: [ID!]!) {\n  users(ids: $ids) {\n    ...UserFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Me {\n  me {\n    ...UserFields\n  }\n}"): (typeof documents)["query Me {\n  me {\n    ...UserFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query SearchUsers($query: String!, $limit: Int) {\n  searchUsers(query: $query, limit: $limit) {\n    ...UserFields\n  }\n}"): (typeof documents)["query SearchUsers($query: String!, $limit: Int) {\n  searchUsers(query: $query, limit: $limit) {\n    ...UserFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "subscription ChatMessageAdded($chatId: ID!) {\n  chatMessageAdded(chatId: $chatId) {\n    ...ChatMessageFields\n  }\n}"): (typeof documents)["subscription ChatMessageAdded($chatId: ID!) {\n  chatMessageAdded(chatId: $chatId) {\n    ...ChatMessageFields\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;