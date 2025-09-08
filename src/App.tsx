import "bootstrap/dist/css/bootstrap.min.css"
import { Button, Container, Image } from "react-bootstrap"
import { Route, Routes, Navigate } from "react-router-dom"
import { NewNote } from "./NewNote"
import { useLocalStorage } from "./useLocalStorage"
import { useEffect, useMemo, useState } from "react"
import { v4 as uuidV4 } from "uuid"
import { NoteList } from "./NoteList"
import "./App.css"
import { NoteLayout } from "./NoteLayout"
import { Note } from "./Note"
import { EditNote } from "./EditNote"

export type RawNote = {
  id: string
} & RawNoteData

export type RawNoteData = {
  title: string
  markdown: string
  tagIds: string[]
}

export type Note = {
  id: string
} & NoteData

export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
}

export type Tag = {
  id: string
  label: string
}

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])

  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return { 
        ...note, 
        tags: tags.filter(tag => note.tagIds.includes(tag.id))
      }
    })
  }, [notes, tags])

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return [
        ...prevNotes, 
        { 
          ...data, 
          id: uuidV4(), 
          tagIds: tags.map(tag => tag.id) 
        }
      ]
    })
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return prevNotes.map(
        note => {
          if (note.id === id) {
            return {
              ...note,
              ...data,
              tagIds: tags.map(tag => tag.id) 
            }
          } else {
            return note
          }
        }
      )
    })
  }

  function onDeleteNote(id: string) {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id)
    })
  }

  function addTag(tag: Tag) {
    setTags(
      prev => [
        ...prev, 
        tag
      ]
    )
  }

  function updateTag(id: string, label: string) {
    setTags(prevTags => {
      return prevTags.map(tag => {
        if (tag.id === id) {
          return { ...tag, label }
        } else {
          return tag
        }
      })
    })
  }

  function deleteTag(id: string) {
    setTags(prevTags => {
      return prevTags.filter(tag => tag.id !== id)
    })
  }

  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'teto' : 'miku')
        
  function switchTheme() {
      const newTheme = 
        theme === 'miku' ? 'teto' : 
        (theme === 'teto' ? 'rin' : 
        (theme === 'rin' ? 'gumi' : 
        (theme === 'gumi' ? 'defoko' : 
        (theme === 'defoko' ? 'ia' : 'miku'))))
      setTheme(newTheme)
  }

  const [bounce, setBounce] = useState<boolean>(false)
  // make this mf jump like a human
  useEffect(() => {
    const bounceInterval = setInterval(() => {
      if ((Math.random() * 1000) > 500) {
        setBounce(prev => !prev)
        // smth wrong with the timer i know it
        useEffect(() => {
          const timer = setTimeout(() => {
            
          }, 200)
          setBounce(prev => !prev)
          return () => clearTimeout(timer)
        }, [])
      }
    }, 1000)
    return () => clearInterval(bounceInterval)
  }, [])

  return (
    <Container className="main-container p-0 m-0 min-vh-100 h-auto w-100" data-theme={theme}>
      <Container className="py-4">
        <Routes>
          <Route path="/" element={<NoteList 
              availableTags={tags} 
              notes={notesWithTags} 
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
            />} />
          <Route path="/new" element={
              <NewNote 
                onSubmit={onCreateNote}  
                onAddTag={addTag}
                availableTags={tags}
              />
            } />
          <Route path="/:id" element={<NoteLayout notes={notesWithTags}/>}>
            <Route index element={<Note onDelete={onDeleteNote} />} />
            <Route path="edit" element={
                <EditNote 
                  onSubmit={onUpdateNote}  
                  onAddTag={addTag}
                  availableTags={tags}
                />
              } />
          </Route>
          <Route path="/error404" element={<h1>Error 404</h1>} />
          <Route path="*" element={<Navigate to="/error404" />} />
        </Routes>
      </Container>
      <Container className="d-flex flex-row-reverse w-100 pb-4">
        <Button onClick={switchTheme}>
          {
            theme === 'miku' ? 'Miku' : 
            (theme === 'teto' ? 'Teto' : 
            (theme === 'rin' ? 'Rin' : 
            (theme === 'gumi' ? 'GUMI' : 
            (theme === 'defoko' ? 'Defoko' : 'IA'))))
          }
        </Button>
      </Container>
      <Container className="image-container mb-4" data-ibt={bounce === true ? 'bounce' : 'no-bounce'}>
          <Image src={
            theme === 'miku' ? '/miku.png' : 
            (theme === 'teto' ? '/teto.png' : 
            (theme === 'rin' ? '/rin.png' : 
            (theme === 'gumi' ? '/gumi.png' : 
            (theme === 'defoko' ? '/defoko.png' : '/ia.png'))))
          } height="100%" />
      </Container>
    </Container>
  )
}

export default App
