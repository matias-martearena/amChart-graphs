import React from 'react'

import { RentabilityExpensesIncomesScreen } from './components/graphs/bar-graph/RentabilityExpensesIncomes'
import { RentabilityScreen } from './components/graphs/bar-graph/Rentability'
import { ExpensesPerClientScreen } from './components/graphs/pie-graph/ExpensesPerClient'
import { ExpensesIncomesScreen } from './components/graphs/pie-graph/ExpensesIncomes'
import { ClockRentabilityScreen } from './components/graphs/clock-graph/ClockGraph'
import { HybridGraphScreen } from './components/graphs/hybrid-graph/HybridGraph'

export const App: React.FC = () => {
  return (
    <main>
      <h1>amChat</h1>
      <RentabilityExpensesIncomesScreen />
      <RentabilityScreen />
      <ExpensesPerClientScreen />
      <ExpensesIncomesScreen />
      <ClockRentabilityScreen />
      <HybridGraphScreen />
    </main>
  )
}
