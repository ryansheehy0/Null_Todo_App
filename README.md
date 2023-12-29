# Null Todos

A simple todo app that allows for nested todos.

## Features
- Nested todos where the lowest todo is fixed width.
- Drag and drop todo cards like trello.


Null_Todos
Boards
  ++id,name,lists
    lists [
      {
        id:
        name:
        cards:
      }
    ]

    cards [
      {
        id:
        name:
        cards:
      }
    ]
    
Make sure all boards, lists, and cards have unique ids


```json
[
  { // Board
    id, // automatically handled by indexedDb
    name: "",
    lists: [
      {// List
        id: 0,
        name: "",
        cards: [
          {// Card
            id: 0,
            name: "",
            cards: []
          }
        ]
      }
    ]
  }
]
```