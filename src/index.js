import _ from 'lodash'
import {
  buildEvent,
  validateEvent,
  formatEvent,
  formatCalendar
} from './pipeline'

export function generateEvent (attributes, cb) {
  let err = null
  const { error, value } = validateEvent(buildEvent(attributes))
  if (error && !cb) return { error, value }
  if (error) return cb(error)
  let event = ''
  try {
    event = formatEvent(value)
  } catch(error) {
    err = error
  }
  if (!cb) return { error: err, value: event }
  // Return a node-style callback
  return cb(err, event)
}

export function createCalendar (data, properties, cb) {
  let formatedEvents = ""
  let events = []
  if (!data || !properties) Error('attributes & properties is required')
  if(_.isObject(data) && !_.isArray(data)){
    events.push(data)
  }else{
    events = data
  }
  try {
    _.forEach(events, (attributes)=> {
      if (!attributes) throw Error('attributes argument is required')
      generateEvent(attributes,(error,val)=>{
        if(error) throw error
          formatedEvents+=val
      })
    })
    formatedEvents = formatCalendar(formatedEvents, properties)
  } catch(error) {
    if (!cb) return { error: error, value: null}
    return cb(error, null)
  }
  if (!cb) return { error: null, value: formatedEvents}
  return cb(null, formatedEvents)
}

/* For support old version */
export function createEvent (data, cb) {
  createCalendar(data, {}, cb);
}
