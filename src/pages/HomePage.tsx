import React from 'react'
import { Link } from 'react-router-dom'

export const HomePage = () => {
  return (
    <div>
      <h1>Home</h1>
      <ul>
        <li>
          <Link to="/projects">Projects</Link>
        </li>
      </ul>
    </div>
  )
}