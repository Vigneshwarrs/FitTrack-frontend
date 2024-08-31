import React from 'react'
import NutritionChart from '../components/Nutrition/NutritionChart';

function NutrtionPage() {
  return (
    <div>
        <h1>NutrtionPage</h1>
        <NutritionChart chartType='overall' />
    </div>
  )
}

export default NutrtionPage