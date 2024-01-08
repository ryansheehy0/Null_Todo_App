import { createContext, useContext, useEffect, useState } from 'react'
import Dexie from "dexie"

const Context = createContext()
export const useGlobalContext = () => useContext(Context) // Returns the value attribute in the provider

export default function Provider({children}){
  const [loading, setLoading] = useState(true)
  const [globalState, setGlobalState] = useState({
    theme: "dark",
    open: false,
    boardId: 1
  })
  // Set up db
  let db = new Dexie("Null_Todos")
  db.version(1).stores({
    miscellaneous: "++id,theme,open,boardId,boardOrder",
    boards: "++id,name,lists",
    lists: "++id,name,cards",
    cards: "++id,name,cards,parentId,parentType"
  })

  useEffect(() => {
    async function loadApp(){
      // If there aren't any boards then add one
      const boards = await db.boards.toArray()
      if(boards.length === 0){
        await db.boards.add({
          name: "Board 1",
          lists: [1, 2, 3]
        })

        /* Id: 1 */await db.lists.add({
          name: "Todo",
          cards: [1, 3]
        })
        /* Id: 2 */await db.lists.add({
          name: "Doing",
          cards: [5]
        })
        /* Id: 3 */await db.lists.add({
          name: "Done",
          cards: []
        })

        /* Id: 1 */await db.cards.add({
          name: "Click the trash icon twice in order to delete components.",
          cards: [2],
          parentId: 1,
          parentType: "list"
        })
          /* Id: 2 */await db.cards.add({
            name: "If you accidentally clicked the trash icon, click anywhere outside in order to reset it.",
            cards: [],
            parentId: 1,
            parentType: "card"
          })
        /* Id: 3 */await db.cards.add({
          name: "You can drag cards, lists, or boards to rearrange them into any order you like.",
          cards: [4],
          parentId: 1,
          parentType: "list"
        })
          /* Id: 4 */await db.cards.add({
            name: "You can even drag cards into other cards.",
            cards: [],
            parentId: 3,
            parentType: "card"
          })

        /* Id: 5 */await db.cards.add({
          name: "Task 1",
          cards: [6],
          parentId: 2,
          parentType: "list"
        })
          /* Id: 6 */await db.cards.add({
            name: "Sub task 1",
            cards: [],
            parentId: 5,
            parentType: "card"
          })
      }

      // If there isn't a miscellaneous then add one
      const miscellaneous = await db.miscellaneous.get(1)
      if(!miscellaneous){
        const boards = await db.boards.toArray()
        const boardIds = boards.map(board => {return board.id})
        await db.miscellaneous.add({
          theme: "dark",
          open: false,
          boardId: 1,
          boardOrder: boardIds
        })
      }else{
        // Load the globalState
        setGlobalState({
          theme: miscellaneous.theme,
          open: miscellaneous.open,
          boardId: miscellaneous.boardId
        })
      }

      setLoading(false)
    }

    loadApp()
  }, [])

  if(loading) return null

  return (
    <Context.Provider value={{db, globalState, setGlobalState}} >
        <div className={globalState.theme === "dark" ? "dark" : ""}>
          {children}
        </div>
    </Context.Provider>
  )
}