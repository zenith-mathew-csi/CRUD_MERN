import './App.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import ListMovies from './components/ListMovies'
import UpdateMovies from './components/UpdateMovies'
import CreateMovies from './components/CreateMovies'

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ListMovies /> }></Route>
          <Route path='/create' element={ <CreateMovies />}></Route>
          <Route path='/update' element={ <UpdateMovies />}></Route>
          <Route path="/update/:id" element={<UpdateMovies />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
