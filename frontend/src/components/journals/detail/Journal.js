import React from 'react'
import { useSelector } from 'react-redux'
import Todo from './sections/Todo'
import Reflection from './sections/Reflection'
import BookSummary from './sections/BookSummary'
import Quote from './sections/Quote'
import TodayWord from './sections/TodayWord'

const Journal = ({ journal }) => {
	const sectionFilter = useSelector(state => state.sectionFilter)

	const todosDisplay = () => (
		<div className="todos-section">
			<h5 className="text-muted">Todos</h5>
			<div className="todos-list">
				{journal.todos.map(todo =>
					<Todo
						key={todo.id}
						todo={todo} />
				)}
			</div>
		</div>
	)

	const reflectionsDisplay = () => (
		<div className="reflections-section">
			<h5 className="text-muted">Reflections</h5>
			{journal.reflections.map(reflection =>
				<Reflection
					key={reflection.id}
					reflection={reflection} />
			)}
		</div>
	)

	const bookSummariesDisplay = () => (
		<div className="book-summaries-section">
			<h5 className="text-muted">Book Summary</h5>
			{journal.book_summaries.map(bookSummary =>
				<BookSummary
					key={bookSummary.id}
					bookSummary={bookSummary} />
			)}
		</div>
	)

	const quotesDisplay = () => (
		<div className="quotes-section">
			<h5 className="text-muted">Cool Quotes</h5>
			{journal.quotes.map(quote =>
				<Quote
					key={quote.id}
					quote={quote} />
			)}
		</div>
	)

	const todayWordsDisplay = () => (
		<div className="words-section">
			<h5 className="text-muted">Words of Today</h5>
			{journal.words_of_today.map(vocabulary =>
				<TodayWord
					key={vocabulary.id}
					vocabulary={vocabulary} />
			)}
		</div>
	)
	return (
		<div className="journal-page">
			{!(sectionFilter !== 'all' && journal[sectionFilter].length === 0) &&
			<div className="date-section">
				<h5>{journal.date}</h5>
			</div>
			}

			{journal.todos.length !== 0 &&
			(sectionFilter === 'all' || sectionFilter === 'todos') &&
			todosDisplay()}

			{journal.reflections.length !== 0 &&
			(sectionFilter === 'all' || sectionFilter === 'reflections') &&
			reflectionsDisplay()
			}

			{journal.book_summaries.length !== 0 &&
			(sectionFilter === 'all' || sectionFilter === 'book_summaries') &&
			bookSummariesDisplay()}

			{journal.quotes.length !== 0 &&
			(sectionFilter === 'all' || sectionFilter === 'quotes') &&
			quotesDisplay()}

			{journal.words_of_today.length !== 0 &&
			(sectionFilter === 'all' || sectionFilter === 'words_of_today') &&
			todayWordsDisplay()}
		</div>
	)
}

export default Journal