import { ComponentLoader } from 'adminjs'

const componentLoader = new ComponentLoader()

const Components = {
  CommentsShow: componentLoader.add('CommentsShow', './comments-show'),
  ReservationCalendar: componentLoader.add('ReservationCalendar', './reservation-calendar'),
}

export { componentLoader, Components }
