import React, { useEffect, useState } from 'react'
import { FaStar } from "react-icons/fa"
import 'bootstrap/dist/css/bootstrap.min.css';

function Feedback() {
  let [star, setStar] = useState(0)
  let [feedback, setFeedback] = useState({})
  let [feedData, setFeedData] = useState([])
  let [index, setIndex] = useState(-1)
  let [error, setError] = useState({})

  useEffect(() => {
    let oldFeedData = JSON.parse(sessionStorage.getItem('feedback-data')) || []
    setFeedData(oldFeedData)
  }, [setFeedData])

  let handleStar = (star) => {
    setStar(star)
    let feed = { ...feedback, star: star }
    setFeedback(feed)
  }

  let handleInput = (e) => {
    let { name, value } = e.target
    let feed = { ...feedback, [name]: value }
    setFeedback(feed)
  }

  let validationData = () => {
    let tempError = {}

    if (!feedback.star) tempError.star = "Star rating cannot be empty"
    if (!feedback.feedback) tempError.feedback = "Feedback cannot be empty"

    setError(tempError)
    return Object.keys(tempError).length == 0
  }

  let handleSubmit = (e) => {
    e.preventDefault()

    if (!validationData()) return false

    let newFeedData = []

    if (index != -1) {
      feedData[index] = feedback
      newFeedData = [...feedData]
    } else {
      newFeedData = [...feedData, feedback]
    }

    setFeedData(newFeedData)
    sessionStorage.setItem('feedback-data', JSON.stringify(newFeedData))
    setIndex(-1)
    setStar(0)
    setFeedback({})
  }

  let handleDelete = (pos) => {
    feedData.splice(pos, 1)
    let newFeedData = [...feedData]
    setFeedData(newFeedData)
    sessionStorage.setItem('feedback-data', JSON.stringify(newFeedData))
  }

  let handleEdit = (pos) => {
    let editFeedback = feedData[pos]
    setFeedback(editFeedback)
    setStar(editFeedback.star)
    setIndex(pos)
  }

  return (
    <>
      <div className="d-flex flex-column align-items-center min-vh-100 bg-dark">
        <div className="card shadow p-4 w-50 mb-4">
          <h2 className="text-center mb-4">Feedback Form</h2>
          <form onSubmit={handleSubmit}>
            <div className="text-center mb-4">
              {[...Array(5)].map((v, i) => (
                <FaStar
                  key={i}
                  color={star >= i + 1 ? "gold" : "lightgray"}
                  size={40}
                  onChange={handleInput}
                  onMouseOver={() => handleStar(i + 1)}
                />
              ))}
              {error.star ?
                <div className="alert alert-danger mt-2 fw-bold" role="alert">{error.star}</div> : ""}
            </div>
            <div className="form-group mb-3">
              <textarea
                className="form-control shadow-sm"
                name="feedback"
                rows="4"
                placeholder="Share your thoughts..."
                onChange={handleInput}
                value={feedback.feedback || ""}
                style={{ resize: 'none' }}
              />
              {error.feedback ?
                <div className="alert alert-danger mt-2 text-center fw-bold" role="alert">{error.feedback}</div> : ""}
            </div>
            <input type="submit" className="btn btn-primary w-100 shadow-sm" value={index != -1 ? "Update Feedback" : "Submit Feedback"} />
          </form>
        </div>

        <div className="container">
          <div className="row">
            {feedData.map((val, i) => (
              <div key={i} className="col-md-4 mb-4">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <div className="d-flex justify-content-center mb-2">
                      {[...Array(5)].map((v, i) => (
                        <FaStar
                          key={i}
                          color={val.star >= i + 1 ? "gold" : "lightgray"}
                          size={20}
                        />
                      ))}
                    </div>
                    <p className="card-text text-center mb-3">{val.feedback}</p>
                    <div className="d-flex justify-content-center">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(i)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(i)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Feedback