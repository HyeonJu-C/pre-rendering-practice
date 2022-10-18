export async function getAllEvents() {
  const response = await fetch(
    'https://next-app-7e347-default-rtdb.asia-southeast1.firebasedatabase.app/events.json',
  )
  const data = await response.json()
  return data
}

export async function getFeaturedEvents() {
  const allEvents = await getAllEvents()
  return allEvents.filter((event) => event.isFeatured)
}

export async function getFilteredEvents(dateFilter) {
  const { year, month } = dateFilter

  const allEvents = await getAllEvents()

  let filteredEvents = allEvents.filter((event) => {
    const eventDate = new Date(event.date)
    return (
      eventDate.getFullYear() === year && eventDate.getMonth() === month - 1
    )
  })

  return filteredEvents
}

export async function getEventById(id) {
  const allEvents = await getAllEvents()
  return allEvents.find((event) => event.id === id)
}
