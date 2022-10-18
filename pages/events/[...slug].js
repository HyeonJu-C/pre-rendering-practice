import { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getFilteredEvents } from '../../helpers/events-api'
import EventList from '../../components/events/event-list'
import ResultsTitle from '../../components/events/results-title'
import Button from '../../components/ui/button'
import ErrorAlert from '../../components/ui/error-alert'

function FilteredEventsPage() {
  const router = useRouter()
  const [filteredEvents, setFilteredEvents] = useState(null)
  const [isLoading, setIsLoading] = useState(null)

  // events 페이지를 거치지 않고, 바로 filterd events 페이지에 접근하면 filterData = undefined 임
  // => useRouter의 동작 원리에 의한 에러였음
  const filterData = router?.query?.slug
  const filteredYear = filterData?.[0]
  const filteredMonth = filterData?.[1]

  const numYear = +filteredYear
  const numMonth = +filteredMonth

  useEffect(() => {
    const getData = async () => {
      return await getFilteredEvents({
        year: numYear,
        month: numMonth,
      })
    }

    setIsLoading(true)
    getData() //
      .then(setFilteredEvents)
      .finally(() => setIsLoading(false))
  }, [numYear, numMonth])

  if (!filterData || isLoading) {
    return <p className="center">loading...</p>
  }

  if (
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2030 ||
    numYear < 2021 ||
    numMonth < 1 ||
    numMonth > 12
  ) {
    return (
      <Fragment>
        <ErrorAlert>
          <p>Invalid filter. Please adjust your values!</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    )
  }

  if (!filteredEvents) {
    return (
      <Fragment>
        <ErrorAlert>
          <p>No events found for the chosen filter!</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    )
  }

  const date = new Date(numYear, numMonth - 1)

  return (
    <Fragment>
      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </Fragment>
  )
}

export default FilteredEventsPage

/*
export async function getStaticProps(context) {
  const { params } = context
  const filterData = params.slug
  const filteredYear = filterData[0]
  const filteredMonth = filterData[1]
  const numYear = +filteredYear
  const numMonth = +filteredMonth

  const filteredEvents = await getFilteredEvents({
    year: numYear,
    month: numMonth,
  })

  return {
    props: {
      filteredEvents,
    },
  }
}

export async function getStaticPaths() {
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  let paths = [
    ...months.map((month) => ({
      params: {
        slug: `2021/${month}`,
      },
    })),
    ...months.map((month) => ({
      params: {
        slug: `2022/${month}`,
      },
    })),
  ]

  return {
    paths,
    fallback: 'blocking',
  }
}
*/
