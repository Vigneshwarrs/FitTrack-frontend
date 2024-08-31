import React from 'react'
import WorkoutBarChart from '../components/Workout/WorkoutChart'

function WorkoutPage() {
  return (
    <div>
        <h1>WorkoutPage</h1>
        <WorkoutBarChart chartType="overall" />
    </div>
  )
}

export default WorkoutPage