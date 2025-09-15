import React, { useState } from 'react'

export default function App() {
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function search(e) {
    e && e.preventDefault()
    if (!query.trim()) {
      setError('Please enter a book title to search.')
      setBooks([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=20`)
      if (!res.ok) throw new Error('Network response was not ok')
      const data = await res.json()
      if (!data.docs || data.docs.length === 0) {
        setBooks([])
        setError('No results found.')
      } else {
        setBooks(data.docs)
      }
    } catch (err) {
      setError('Search failed. ' + err.message)
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Book Finder</h1>
        <p className="subtitle">Search books using the OpenLibrary API (React + CSS)</p>
      </header>

      <main className="main">
        <form className="search" onSubmit={search}>
          <input
            aria-label="Search books"
            placeholder="Enter book title (e.g. Pride and Prejudice)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" disabled={loading}>Search</button>
        </form>

        {loading && <div className="status">Loading…</div>}
        {error && <div className="status error">{error}</div>}

        <section className="results">
          {books.map((b) => {
            const coverId = b.cover_i
            const cover = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null
            const authors = b.author_name ? b.author_name.join(', ') : 'Unknown author'
            const year = b.first_publish_year || '—'
            const title = b.title || 'No title'
            return (
              <article className="card" key={b.key}>
                <div className="thumb">
                  {cover ? <img src={cover} alt={title} /> : <div className="no-cover">No cover</div>}
                </div>
                <div className="meta">
                  <h3>{title}</h3>
                  <p className="authors">{authors}</p>
                  <p className="year">First published: {year}</p>
                  <a className="link" href={`https://openlibrary.org${b.key}`} target="_blank" rel="noreferrer">View on OpenLibrary</a>
                </div>
              </article>
            )
          })}
        </section>
      </main>

      <footer className="footer">
        <small>Built with React • Uses OpenLibrary API</small>
      </footer>
    </div>
  )
}
