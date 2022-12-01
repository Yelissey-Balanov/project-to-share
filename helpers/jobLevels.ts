import { JobLevel } from '~/graphql/GQLTypes'
import formatSnakeCaseString from '~/helpers/formatSnakeCaseString'

const jobLevelOptions: JobLevelItem[] = []
// init jobLevel level options
Object.keys(JobLevel).forEach((level) => {
  jobLevelOptions.push({
    value: JobLevel[level],
    name: formatSnakeCaseString(JobLevel[level]),
  })
})

const jobLevelsObject = {}
jobLevelOptions.forEach((jobLevel: JobLevelItem) => {
  jobLevelsObject[jobLevel.value] = jobLevel.name
})

interface JobLevelItem {
  value: string
  name: string
}

export { jobLevelOptions, JobLevelItem, jobLevelsObject }
