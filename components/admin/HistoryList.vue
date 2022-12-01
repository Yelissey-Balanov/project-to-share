<template>
  <div class="history-table">
    <p v-if="histories.length === 0"> There are no modifications recorded </p>
    <div class="history-row" v-for="history in groupedHistories">
      <div class="history-row--user">
        <div>
          <template v-if="history.user"> {{ history.user.firstname }} {{ history.user.lastname }} </template>
          <template v-else> --- </template>
        </div>
        <div class="text-gray-400">{{ history.created_at | datetime }}</div>
      </div>

      <div class="history-row--changes">
        <template v-if="history.action === HistoryAction.Created">
          <template v-if="classMapping[history.changed_model]">
            <div class="text-green-700">
              <template v-if="history.changed_model === history.historiable_type"> Created </template>
              <template v-else> Added </template>
              {{ classMapping[history.changed_model].label(history.changes) }}
            </div>
            <div class="history-row--changes--value" :class="{ pre: classMapping[history.changed_model].usePre }"
              ><!--
              -->{{ classMapping[history.changed_model].readableValue(history.changes) }}
            </div>
          </template>
          <template v-else>
            <div class="text-green-700"> Added {{ history.changed_model }} </div>
            <pre class="history-row--changes--value">{{ history.changes | prettyJson }}</pre>
          </template>
        </template>

        <template v-else-if="history.action === HistoryAction.Updated">
          <template v-if="classMapping[history.changed_model]">
            <div class="text-blue-700">Updated {{ classMapping[history.changed_model].label(history.changes) }}</div>
            <div
              class="history-row--changes--value attribute-changes"
              v-for="attributeKey in getChangesKeys(history.changes)"
            >
              <span>
                {{ attributeKey | formatSnakeCaseString }}
              </span>
              <ul class="attribute-changes--old-new">
                <li>{{ formattedValue(history.changes[attributeKey].old, attributeKey) }}</li>
                <li>{{ formattedValue(history.changes[attributeKey].new, attributeKey) }}</li>
              </ul>
            </div>
          </template>
          <template v-else>
            <div class="text-blue-700">Updated {{ history.changed_model }}</div>
            <pre class="history-row--changes--value">{{ history.changes | prettyJson }}</pre>
          </template>
        </template>

        <template v-else-if="history.action === HistoryAction.Deleted">
          <template v-if="classMapping[history.changed_model]">
            <div class="text-red-700">Removed {{ classMapping[history.changed_model].label(history.changes) }}</div>
            <div class="history-row--changes--value" :class="{ pre: classMapping[history.changed_model].usePre }"
              ><!--
              -->{{ classMapping[history.changed_model].readableValue(history.changes) }}
            </div>
          </template>
          <template v-else>
            <div class="text-red-700">Removed {{ history.changed_model }}</div>
            <pre class="history-row--changes--value">{{ history.changes | prettyJson }}</pre>
          </template>
        </template>

        <template v-else-if="history.action === HistoryAction.Attached">
          <template v-if="classMapping[history.changes.class]">
            <div class="text-green-700">Attached {{ classMapping[history.changes.class].label(history.changes) }}</div>
            <div class="text-green-700 text-xs" v-if="history.changes.class === 'App\\DocumentTag'">
              To "{{ history.changes.documentTitle }}"
            </div>
            <div class="history-row--changes--value attached-detached-values" v-if="history.changes.objects">
              <div v-for="changesObject in history.changes.objects">
                {{ classMapping[history.changes.class].attachDetachGroupedValue(changesObject)
                }}<!--
              --></div>
            </div>
            <div class="history-row--changes--value attached-detached-values" v-else>
              {{ classMapping[history.changes.class].attachDetachValue(history.changes)
              }}<!--
            --></div>
          </template>
          <template v-else>
            <div class="text-green-700">Attached {{ history.changes.class }}</div>
            <pre class="history-row--changes--value">{{ history.changes | prettyJson }}</pre>
          </template>
        </template>

        <template v-else-if="history.action === HistoryAction.Detached">
          <template v-if="classMapping[history.changes.class]">
            <div class="text-red-700">Detached {{ classMapping[history.changes.class].label(history.changes) }}</div>
            <div class="text-red-700 text-xs" v-if="history.changes.class === 'App\\DocumentTag'">
              From "{{ history.changes.documentTitle }}"
            </div>
            <div class="history-row--changes--value attached-detached-values" v-if="history.changes.objects">
              <div v-for="changesObject in history.changes.objects">
                {{ classMapping[history.changes.class].attachDetachGroupedValue(changesObject)
                }}<!--
              --></div>
            </div>
            <div class="history-row--changes--value attached-detached-values" v-else>
              {{ classMapping[history.changes.class].attachDetachValue(history.changes)
              }}<!--
              --></div
            >
          </template>
          <template v-else>
            <div class="text-red-700">Detached {{ history.changes.class }}</div>
            <pre class="history-row--changes--value">{{ history.changes | prettyJson }}</pre>
          </template>
        </template>

        <template v-if="history.action === HistoryAction.Restored">
          <template v-if="classMapping[history.changed_model]">
            <div class="text-green-700">
              Restored {{ classMapping[history.changed_model].label(history.changes) }}
            </div>
          </template>
          <template v-else>
            <div class="text-green-700"> Restored {{ history.changed_model }} </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import { History, HistoryAction, Location, Phonenumber, Document, Event } from '~/graphql/GQLTypes'
import { languagesObject } from '~/helpers/languagesListEn'
import { nationalitiesObject } from '~/helpers/nationalitiesListEn'

@Component
export default class HistoryList extends Vue {
  @Prop()
  histories?: History[]

  groupedHistories: History[] = []

  HistoryAction = HistoryAction

  private dateAttributes = ['birthdate', 'available_from', 'project_start', 'project_end', 'placed_start_at']

  private datetimeAttributes = ['happened_at']

  classMapping = {
    'App\\Bucket': {
      label: () => 'bucket',
      usePre: true,
      readableValue: (changes) => this.$options.filters!.prettyJson(changes),
      attachDetachValue: () => {},
    },
    'App\\IntermediateModel\\BucketUser': {
      label: (c) => `sharing with ${c._user.firstname} ${c._user.lastname}`,
      usePre: true,
      readableValue: (c) => {
        const changes = { ...c }
        delete changes._user
        return this.$options.filters!.prettyJson(changes)
      },
      attachDetachValue: () => {},
    },
    'App\\IntermediateModel\\BucketCandidate': {
      label: () => 'candidates',
      usePre: true,
      readableValue: () => {},
      attachDetachValue: (changes) => `${changes.object.firstname} ${changes.object.lastname}`,
      attachDetachGroupedValue: (object) => `${object.firstname} ${object.lastname}`,
    },
    'App\\IntermediateModel\\BucketClient': {
      label: () => 'clients',
      usePre: true,
      readableValue: () => {},
      attachDetachValue: (changes) => `${changes.object.firstname} ${changes.object.lastname}`,
      attachDetachGroupedValue: (object) => `${object.firstname} ${object.lastname}`,
    },
    'App\\IntermediateModel\\BucketCompany': {
      label: () => 'companies',
      usePre: true,
      readableValue: () => {},
      attachDetachValue: (changes) => `${changes.object.name}`,
      attachDetachGroupedValue: (object) => `${object.name}`,
    },
    'App\\IntermediateModel\\BucketProject': {
      label: () => 'projects',
      usePre: true,
      readableValue: () => {},
      attachDetachValue: (changes) => `${changes.object.title}`,
      attachDetachGroupedValue: (object) => `${object.title}`,
    },
    'App\\Industry': {
      label: () => 'industries',
      usePre: false,
      readableValue: () => {},
      attachDetachValue: (changes) => (changes.object ? changes.object.title : changes.id),
      attachDetachGroupedValue: (object) => object.title,
    },
    'App\\IntermediateModel\\CandidateCompany': {
      label: (c) => `position at company ${c._company ? c._company.name : ''}`,
      usePre: true,
      readableValue: (c) => {
        const changes = { ...c }
        delete changes._company
        return this.$options.filters!.prettyJson(changes)
      },
      attachDetachValue: () => {},
    },
    'App\\IntermediateModel\\CandidateProject': {
      label: (c) => `data of candidate ${c._candidate ? c._candidate.full_name : ''}`,
      usePre: true,
      readableValue: (c) => {
        const changes = { ...c }
        delete changes._candidate
        return this.$options.filters!.prettyJson(changes)
      },
      attachDetachValue: () => {},
    },
    'App\\Candidate': {
      label: () => 'candidate',
      usePre: true,
      readableValue: (changes) => this.$options.filters!.prettyJson(changes),
      attachDetachValue: () => {},
    },
    'App\\Company': {
      label: () => 'company',
      usePre: true,
      readableValue: (changes) => this.$options.filters!.prettyJson(changes),
      attachDetachValue: () => {},
    },
    'App\\Client': {
      label: () => 'client',
      usePre: true,
      readableValue: (changes) => this.$options.filters!.prettyJson(changes),
      attachDetachValue: () => {},
    },
    'App\\Document': {
      label: () => 'documents',
      usePre: false,
      readableValue: (document: Document) => document.title,
      attachDetachValue: (changes) => (changes.object ? changes.object.title : changes.id),
      attachDetachGroupedValue: (object) => object.title,
    },
    'App\\DocumentTag': {
      label: () => 'document tags',
      usePre: false,
      readableValue: () => {},
      attachDetachValue: (changes) => (changes.object ? changes.object.title : changes.id),
      attachDetachGroupedValue: (object) => object.title,
    },
    'App\\Employee': {
      label: () => 'employee',
      usePre: true,
      readableValue: (changes) => this.$options.filters!.prettyJson(changes),
      attachDetachValue: () => {},
    },
    'App\\Event': {
      label: () => 'events',
      usePre: false,
      readableValue: (event: Event) =>
        `${event.group} - ${event.type} (${this.$options.filters!.datetime(event.happened_at)}). ${
          event.notes ? event.notes : ''
        }`,
      attachDetachValue: () => {},
      attachDetachGroupedValue: () => {},
    },
    'App\\Skill': {
      label: () => 'skills',
      usePre: false,
      readableValue: () => {},
      attachDetachValue: (changes) => (changes.object ? changes.object.title : changes.id),
      attachDetachGroupedValue: (object) => object.title,
    },
    'App\\Image': {
      label: () => 'image',
      usePre: false,
      readableValue: () => {},
      attachDetachValue: () => {},
    },
    'App\\ItSkill': {
      label: () => 'IT skills',
      usePre: false,
      readableValue: () => {},
      attachDetachValue: (changes) => (changes.object ? changes.object.title : changes.id),
      attachDetachGroupedValue: (object) => object.title,
    },
    'App\\JobAd': {
      label: () => 'job',
      usePre: false,
      readableValue: () => {},
      attachDetachValue: () => {},
    },
    'App\\Language': {
      label: () => 'languages',
      usePre: false,
      readableValue: () => {},
      attachDetachValue: (changes) => {
        let text = languagesObject[changes.id]
        if (changes.object && changes.object.level && changes.object.level.description) {
          text += ` (${changes.object.level.description})`
        }
        return text
      },
      attachDetachGroupedValue: (object) => {
        let text = languagesObject[object.language]
        if (object.level && object.level.description) {
          text += ` (${object.level.description})`
        }
        return text
      },
    },
    'App\\Location': {
      label: () => 'location',
      usePre: false,
      readableValue: (location: Location) => location.full_address,
      attachDetachValue: () => {},
    },
    'App\\Nationality': {
      label: () => 'nationalities',
      usePre: false,
      readableValue: () => {},
      attachDetachValue: (changes) => {
        return nationalitiesObject[changes.id].nationality
      },
      attachDetachGroupedValue: (object) => {
        return nationalitiesObject[object.nationality].nationality
      },
    },
    'App\\Person': {
      label: () => 'personal data',
      usePre: true,
      readableValue: (changes) => this.$options.filters!.prettyJson(changes),
      attachDetachValue: () => {},
    },
    'App\\Phonenumber': {
      label: () => 'phonenumber',
      usePre: false,
      readableValue: (phonenumber: Phonenumber) =>
        `${phonenumber.label} - [${phonenumber.country_code}] ${phonenumber.dial_code} ${phonenumber.number}`,
      attachDetachValue: () => {},
    },
    'App\\Project': {
      label: () => 'project',
      usePre: true,
      readableValue: (changes) => this.$options.filters!.prettyJson(changes),
      attachDetachValue: () => {},
    },
    'App\\IntermediateModel\\ProjectUser': {
      label: () => 'consultant',
      usePre: true,
      readableValue: (changes) => this.$options.filters!.prettyJson(changes),
      attachDetachValue: () => {},
    },
    'App\\Certification': {
      label: () => 'certifications',
      usePre: false,
      readableValue: () => {},
      attachDetachValue: (changes) => (changes.object ? changes.object.title : changes.id),
      attachDetachGroupedValue: (object) => object.title,
    },
    'App\\User': {
      label: () => 'user',
      usePre: false,
      readableValue: () => {},
      attachDetachValue: () => {},
    },
  }

  created() {}

  mounted() {
    const groupedHistories: History[] = []

    this.histories!.forEach((historyEntry) => {
      if (groupedHistories.length === 0) {
        groupedHistories.push(historyEntry)
        return
      }
      const lastItem = groupedHistories[groupedHistories.length - 1]

      // group same attaches/detaches
      if (
        (historyEntry.action === HistoryAction.Attached || historyEntry.action === HistoryAction.Detached) &&
        historyEntry.action === lastItem.action &&
        historyEntry.changes.class === lastItem.changes.class &&
        ((!historyEntry.changes.documentTitle && !lastItem.changes.documentTitle) ||
          (historyEntry.changes.documentTitle &&
            lastItem.changes.documentTitle &&
            historyEntry.changes.documentTitle === lastItem.changes.documentTitle))
      ) {
        if (!('objects' in lastItem.changes)) {
          // create objects attribute and add object from last lite. after this remove object attribute
          lastItem.changes.objects = [lastItem.changes.object]
          delete lastItem.changes.object
        }
        lastItem.changes.objects.push(historyEntry.changes.object)
      } else {
        groupedHistories.push(historyEntry)
      }
    })

    this.groupedHistories = groupedHistories
  }

  formattedValue(value, key) {
    if (value === null) {
      return 'null'
    }
    if (this.dateAttributes.includes(key)) {
      return this.$options.filters!.date(value)
    }
    if (this.datetimeAttributes.includes(key)) {
      return this.$options.filters!.datetime(value)
    }
    return value
  }

  private getChangesKeys(historyChanges) {
    return Object.keys(historyChanges).filter((key) => key.substr(0, 1) !== '_')
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/scss/variables';

.history-row {
  display: flex;
  flex-direction: column;

  & + & {
    border-top: 1px solid $color-gray;
  }
}

.history-row--user {
  flex: auto;
  padding: 7px 8px 7px 0;
}

.history-row--changes {
  flex: auto;
  padding: 7px 0 7px 20px;
}

.history-row--changes--value {
  margin-top: 0.3em;
  font-size: 12px;
}

.attached-detached-values {
  display: flex;
  flex-wrap: wrap;

  > * {
    margin: 0 0 3px;

    &:not(:last-child)::after {
      content: ', ';
      display: inline-block;
      margin-right: 4px;
    }
  }
}

.attribute-changes {
  & + & {
    margin-top: 0.5em;
  }

  > span {
    color: mix($color-blue, black, 50%);
    line-height: 1.5;
  }
}

.attribute-changes--old-new {
  margin: 0 0 0 1.5em;
  display: block;
  padding: 0;
  list-style: none;

  > li {
    margin: 0;
    padding: 0;

    &:first-child {
      text-decoration: line-through;
      color: $color-gray-semidark;
    }

    &:last-child {
      color: $color-gray-dark;
    }
  }
}

@media #{$media-from-md} {
  .history-row {
    flex-direction: row;
  }

  .history-row--user {
    flex: 0 0 220px;
  }
}
</style>
