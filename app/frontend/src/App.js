// frontend/src/App.js
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import './App.css';

function App() {
  const [todoItems, setTodoItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3010/api/todo-items')
      .then((res) => res.json())
      .then((result) => setTodoItems(result.data));
  }, []);

  // Обработчик изменения текста задачи
  const handleTextChange = (e, id) => {
    const newText = e.target.value;
    // Обновляем только текст задачи в массиве todoItems
    setTodoItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, text: newText } : item
      )
    );
  };

  // Обработчик изменения состояния выполнения задачи
  const handleCheckboxChange = (e, id) => {
    const newDoneStatus = e.target.checked;
    // Обновляем только состояние задачи (выполнена/не выполнена)
    setTodoItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, done: newDoneStatus } : item
      )
    );
  };

  // Функция для сохранения изменений на сервере
  const saveChanges = (item) => {
    fetch(`http://localhost:3010/api/todo-items/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: item.text,
        done: item.done,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // Можно добавить логику для обработки ответа от сервера
        console.log('Задача обновлена', result);
      })
      .catch((err) => {
        console.error('Ошибка при обновлении задачи', err);
      });
  };

  return (
    <div>
      {todoItems.map((item) => (
        <Form.Group key={item.id} className="app__todo-item">
          {/* Чекбокс для выполнения задачи */}
          <Form.Check
            type="checkbox"
            checked={item.done}
            onChange={(e) => handleCheckboxChange(e, item.id)}
          />
          {/* Текстовое поле для редактирования текста задачи */}
          <Form.Control
            type="text"
            value={item.text}
            onChange={(e) => handleTextChange(e, item.id)}
            onBlur={() => saveChanges(item)} // Сохраняем изменения при потере фокуса
          />
        </Form.Group>
      ))}
    </div>
  );
}

export default App;
