import { Fragment } from 'react'

import { getAllEvents, getEventById } from '../../dummy-data'
import EventSummary from '../../components/event-detail/event-summary'
import EventLogistics from '../../components/event-detail/event-logistics'
import EventContent from '../../components/event-detail/event-content'
import ErrorAlert from '../../components/ui/error-alert'

function EventDetailPage({ event }) {
  if (!event) {
    return (
      <ErrorAlert>
        <p>No event found!</p>
      </ErrorAlert>
    )
  }

  return (
    <Fragment>
      <EventSummary title={event.title} />
      <EventLogistics
        date={event.date}
        address={event.location}
        image={event.image}
        imageAlt={event.title}
      />
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
    </Fragment>
  )
}

export default EventDetailPage

export async function getStaticProps(context) {
  const { params } = context
  const event = await getEventById(params?.eventId)
  return {
    props: { event },
  }
}

export async function getStaticPaths() {
  const allEvents = await getAllEvents()
  const paths = allEvents.map(({ id }) => ({
    params: {
      eventId: id,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}
