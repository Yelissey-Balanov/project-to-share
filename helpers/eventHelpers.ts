import { EventGroup, EventType } from '~/graphql/GQLTypes'
import formatReplaceUnderscoreWithSpace from '~/helpers/replaceUnderscoreWithSpace'

const groupedCandidateEventTypeOptions = {}
groupedCandidateEventTypeOptions[EventGroup.Contact] = {}
groupedCandidateEventTypeOptions[EventGroup.Contact][EventType.Telephone] = formatReplaceUnderscoreWithSpace(
  EventType.Telephone
)
groupedCandidateEventTypeOptions[EventGroup.Contact][EventType.Email] = formatReplaceUnderscoreWithSpace(
  EventType.Email
)
groupedCandidateEventTypeOptions[EventGroup.Contact][EventType.LinkedIn] = formatReplaceUnderscoreWithSpace(
  EventType.LinkedIn
)
groupedCandidateEventTypeOptions[EventGroup.Contact][EventType.Xing] = formatReplaceUnderscoreWithSpace(EventType.Xing)
groupedCandidateEventTypeOptions[EventGroup.Contact][EventType.VideoCall] = formatReplaceUnderscoreWithSpace(
  EventType.VideoCall
)
groupedCandidateEventTypeOptions[EventGroup.Contact][EventType.WhatsApp] = formatReplaceUnderscoreWithSpace(
  EventType.WhatsApp
)
groupedCandidateEventTypeOptions[EventGroup.Contact][EventType.Sms] = formatReplaceUnderscoreWithSpace(EventType.Sms)

groupedCandidateEventTypeOptions[EventGroup.Meeting] = {}
groupedCandidateEventTypeOptions[EventGroup.Meeting][EventType.OfficeFfm] = formatReplaceUnderscoreWithSpace(
  EventType.OfficeFfm
)
groupedCandidateEventTypeOptions[EventGroup.Meeting][EventType.Lunch] = formatReplaceUnderscoreWithSpace(
  EventType.Lunch
)
groupedCandidateEventTypeOptions[EventGroup.Meeting][EventType.Dinner] = formatReplaceUnderscoreWithSpace(
  EventType.Dinner
)
groupedCandidateEventTypeOptions[EventGroup.Meeting][EventType.Virtual] = EventType.Virtual

groupedCandidateEventTypeOptions[EventGroup.Interview] = {}
groupedCandidateEventTypeOptions[EventGroup.Interview][EventType.Telephone] = formatReplaceUnderscoreWithSpace(
  EventType.Telephone
)
groupedCandidateEventTypeOptions[EventGroup.Interview][EventType.F2F] = EventType.F2F
groupedCandidateEventTypeOptions[EventGroup.Interview][EventType.Virtual] = EventType.Virtual

const groupedCandidateWithinProjectEventTypeOptions = { ...groupedCandidateEventTypeOptions }

groupedCandidateWithinProjectEventTypeOptions[EventGroup.ClientInterview] = {}
groupedCandidateWithinProjectEventTypeOptions[EventGroup.ClientInterview][
  EventType.FirstInterview
] = formatReplaceUnderscoreWithSpace(EventType.FirstInterview)
groupedCandidateWithinProjectEventTypeOptions[EventGroup.ClientInterview][
  EventType.SecondInterview
] = formatReplaceUnderscoreWithSpace(EventType.SecondInterview)
groupedCandidateWithinProjectEventTypeOptions[EventGroup.ClientInterview][
  EventType.AdditionalInterview
] = formatReplaceUnderscoreWithSpace(EventType.AdditionalInterview)
groupedCandidateWithinProjectEventTypeOptions[EventGroup.ClientInterview][
  EventType.AssessmentCenter
] = formatReplaceUnderscoreWithSpace(EventType.AssessmentCenter)
groupedCandidateWithinProjectEventTypeOptions[EventGroup.ClientInterview][
  EventType.FinalInterview
] = formatReplaceUnderscoreWithSpace(EventType.FinalInterview)

groupedCandidateWithinProjectEventTypeOptions[EventGroup.Offer] = {}
groupedCandidateWithinProjectEventTypeOptions[EventGroup.Offer][
  EventType.UnderOffer
] = formatReplaceUnderscoreWithSpace(EventType.UnderOffer)
groupedCandidateWithinProjectEventTypeOptions[EventGroup.Offer][EventType.Accepted] = formatReplaceUnderscoreWithSpace(
  EventType.Accepted
)
groupedCandidateWithinProjectEventTypeOptions[EventGroup.Offer][EventType.Rejected] = formatReplaceUnderscoreWithSpace(
  EventType.Rejected
)

const groupedClientEventTypeOptions = {}
groupedClientEventTypeOptions[EventGroup.Contact] = {}
groupedClientEventTypeOptions[EventGroup.Contact][EventType.Telephone] = formatReplaceUnderscoreWithSpace(
  EventType.Telephone
)
groupedClientEventTypeOptions[EventGroup.Contact][EventType.Email] = formatReplaceUnderscoreWithSpace(EventType.Email)
groupedClientEventTypeOptions[EventGroup.Contact][EventType.LinkedIn] = formatReplaceUnderscoreWithSpace(
  EventType.LinkedIn
)
groupedClientEventTypeOptions[EventGroup.Contact][EventType.Xing] = formatReplaceUnderscoreWithSpace(EventType.Xing)
groupedClientEventTypeOptions[EventGroup.Contact][EventType.VideoCall] = formatReplaceUnderscoreWithSpace(
  EventType.VideoCall
)
groupedClientEventTypeOptions[EventGroup.Contact][EventType.WhatsApp] = formatReplaceUnderscoreWithSpace(
  EventType.WhatsApp
)
groupedClientEventTypeOptions[EventGroup.Contact][EventType.Sms] = formatReplaceUnderscoreWithSpace(EventType.Sms)

groupedClientEventTypeOptions[EventGroup.Meeting] = {}
groupedClientEventTypeOptions[EventGroup.Meeting][EventType.OfficeFfm] = formatReplaceUnderscoreWithSpace(
  EventType.OfficeFfm
)
groupedClientEventTypeOptions[EventGroup.Meeting][EventType.OfficeClient] = formatReplaceUnderscoreWithSpace(
  EventType.OfficeClient
)
groupedClientEventTypeOptions[EventGroup.Meeting][EventType.Lunch] = formatReplaceUnderscoreWithSpace(EventType.Lunch)
groupedClientEventTypeOptions[EventGroup.Meeting][EventType.Dinner] = formatReplaceUnderscoreWithSpace(EventType.Dinner)
groupedClientEventTypeOptions[EventGroup.Meeting][EventType.Virtual] = formatReplaceUnderscoreWithSpace(
  EventType.Virtual
)

export {
  groupedCandidateEventTypeOptions,
  groupedClientEventTypeOptions,
  groupedCandidateWithinProjectEventTypeOptions,
}
