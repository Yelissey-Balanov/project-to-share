import { ProjectStatus } from '~/graphql/GQLTypes'

export function statusTextColor(projectStatus: ProjectStatus) {
  if (projectStatus === ProjectStatus.Active) {
    return 'bg-blue-50 border-blue-600 text-blue-700'
  } else if (
    projectStatus === ProjectStatus.CancelledByBlackbull ||
    projectStatus === ProjectStatus.CancelledByClient
  ) {
    return 'bg-red-50 border-red-600 text-red-700'
  } else if (
    projectStatus === ProjectStatus.Completed ||
    projectStatus === ProjectStatus.Placed ||
    projectStatus === ProjectStatus.Runner
  ) {
    return 'bg-green-50 border-green-600 text-green-700'
  } else if (projectStatus === ProjectStatus.Paused) {
    return 'bg-yellow-50 border-yellow-600 text-yellow-700'
  }
}
