import { auth } from './auth'

import { API_URL } from './constants'
// const USER_URL = `${API_URL}/user/`
const LOGIN_URL = `${API_URL}/user/login`

const TOPIC_GET_URL = `${API_URL}/topic/get`
const TOPIC_ADD_URL = `${API_URL}/topic/create`

const SUBJECT_GET_URL = `${API_URL}/subject/get`
const SUBJECT_GET_ID_URL = `${API_URL}/subject/get/?id=`
const SUBJECT_ADD_URL = `${API_URL}/subject/create`
const SUBJECT_GET_RELATED_URL = `${API_URL}/subject/related/?id=`

const SUBJECT_TOPIC_RELATE_URL = `${API_URL}/subject/topic/relate`

export const api = {
  /**
   * Get the user from API
   * @param {object} ctx Context.
   * @param {string} username Username.
   */
  getUser (ctx, username) {
    // Return the user from GET request.
    return {
      username: 'ole',
      firstName: 'Ola',
      lastName: 'Nordmann'
    }
  },

  /**
   * Get all subjects from API.
   * @param {object} ctx Context.
   * @param {function} callback Handle the request output.
   * @param {function} error Feedback error.
   */
  getSubjects (ctx, callback, error) {
    this.getRequest(SUBJECT_GET_URL, callback, error)
  },

  /**
   * Get topics related to a subject from the API
   * @param {object} ctx Context.
   * @param {function} callback Handle the request output.
   * @param {integer} id The subject id
   */
  getRelatedTopics (ctx, callback, error, id) {
    this.getRequest(SUBJECT_GET_RELATED_URL + id, callback, error)
  },

  /**
   * Get the subject with the given id form API.
   * @param {object} ctx Context.
   * @param {function} callback Handle the request output.
   * @param {function} error Feedback error.
   * @param {integer} id The subject id.
   */
  getSubjectID (ctx, callback, error, id) {
    this.getRequest(SUBJECT_GET_ID_URL + id, callback, error)
  },

  /**
   * Get all topics from API.
   * @param {object} ctx Context.
   * @param {function} callback Handle the request output.
   * @param {function} error Feedback error.
   */
  getTopics (ctx, callback, error) {
    this.getRequest(TOPIC_GET_URL, callback, error)
  },

  /**
   * Post a user to the API.
   * @param {object} ctx Context.
   * @param {object} data The data to post in request.
   */
  postUserLogin (ctx, data, callback, error) {
    // Here we can inject token.

    let req = {
      body: JSON.stringify(data)
    }

    this.postRequest(LOGIN_URL, req, callback, error)
  },

  /**
   * Add subject.
   * @param {object} ctx Context.
   * @param {object} subject The subject to post in request.
   * @param {function} callback Handle the request output.
   * @param {function} error Feedback error.
   */
  addSubject (ctx, subject, callback, error) {
    let data = {
      title: subject.title,
      institution: subject.institution,
      subjectCode: subject.subjectCode,
      description: subject.description,
      username: auth.getUsername()
    }

    let req = {
      body: JSON.stringify(data),
      method: 'POST'
    }

    this.postRequest(SUBJECT_ADD_URL, req, callback, error)
  },

  /**
   * Add topic.
   * @param {object} ctx Context.
   * @param {object} topic The topic to post in request.
   * @param {function} callback Handle the request output.
   * @param {function} error Feedback error.
   */
  addTopic (ctx, topic, callback, error) {
    let data = {
      title: topic.title,
      description: topic.description,
      username: auth.getUsername()
    }

    let req = {
      body: JSON.stringify(data),
      method: 'POST'
    }

    this.postRequest(TOPIC_ADD_URL, req, callback, error)
  },

  /**
   * Relate subject and topic
   * @param {object} ctx Context.
   * @param {object} topic The topic to relate
   * @param {object} subject The subject to relate
   * @param {function} callback Handle the request output.
   * @param {function} error Feedback error.
   */
  relateSubjectTopic (ctx, topic, subject, callback, error) {
    let data = {
      subjectID: subject.id,
      topicID: topic.id
    }

    let req = {
      body: JSON.stringify(data),
      method: 'POST'
    }

    this.postRequest(SUBJECT_TOPIC_RELATE_URL, req, callback, error)
  },

  /**
   * General function for posting requests to the API.
   * @param {string} url URL address to send to.
   * @param {object} req Data to send with the POST-request.
   * @param {function} callback Handle the request output.
   * @param {function} error Feedback error.
   */
  postRequest (url, req, callback, error) {
    req.headers = Object.assign({}, req.headers || {}, {
      'Authorization': auth.getAuthHeader()['Authorization'],
      'X-Username': auth.getUsername()
    })
    req.method = 'POST'
    let headers = new Headers(req.headers)
    req.headers = headers

    // ctx.$http.post(LOGIN_URL, req)
    fetch(new Request(url, req)) // Does not work in IE, needs polyfill.
    .then(res => res.json())
    .then(callback)
    .catch(error)
  },

  /**
   * General function for getting requests from the API.
   * @param {string} url URL address to send to.
   * @param {function} callback Handle the request output.
   * @param {function} error Feedback error.
   */
  getRequest (url, callback, error) {
    // ctx.$http.post(LOGIN_URL, req)
    fetch(url) // Does not work in IE, needs polyfill.
    .then(res => res.json())
    .then(callback)
    .catch(error)
  }
}
